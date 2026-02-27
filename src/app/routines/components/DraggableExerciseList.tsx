'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableExerciseItem } from './SortableExerciseItem';
import { updateRoutineExercisesOrder } from '../../actions/routine';

export interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
    type: string;
    order_index?: number;
    superset_id?: string | null;
}

export function DraggableExerciseList({
    initialExercises,
    routineId,
    isOwner
}: {
    initialExercises: Exercise[];
    routineId: string;
    isOwner: boolean;
}) {
    const [exercises, setExercises] = useState(initialExercises);

    useEffect(() => {
        setExercises(initialExercises);
    }, [initialExercises]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Need to drag at least 5px before starting
            }
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setExercises((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Save to DB
                const updates = newItems.map((item, index) => ({
                    exercise_id: item.id,
                    order_index: index,
                    superset_id: item.superset_id || null
                }));

                updateRoutineExercisesOrder(routineId, updates).catch(err => {
                    console.error('Failed to save new order:', err);
                });

                return newItems;
            });
        }
    };

    const handleLinkWithNext = (exerciseId: string) => {
        setExercises((items) => {
            const index = items.findIndex(i => i.id === exerciseId);
            if (index === -1 || index >= items.length - 1) return items;

            const currentItem = items[index];
            const nextItem = items[index + 1];

            // If already linked, unlink them
            let newSupersetId: string | null = null;
            if (currentItem.superset_id && currentItem.superset_id === nextItem.superset_id) {
                // Unlinking logic: we just remove superset_id from current (or both depending on preference, let's just clear both for simplicity)
                newSupersetId = null;
            } else {
                // Link them using current item's superset_id or generate a new one
                newSupersetId = currentItem.superset_id || crypto.randomUUID();
            }

            const newItems = [...items];
            newItems[index] = { ...currentItem, superset_id: newSupersetId };
            newItems[index + 1] = { ...nextItem, superset_id: newSupersetId };

            const updates = newItems.map((item, idx) => ({
                exercise_id: item.id,
                order_index: idx,
                superset_id: item.superset_id || null
            }));

            updateRoutineExercisesOrder(routineId, updates).catch(err => {
                console.error('Failed to save superset link:', err);
            });

            return newItems;
        });
    };

    if (!exercises || exercises.length === 0) {
        return (
            <div className="bg-gray-50/50 dark:bg-zinc-950/30 p-12 rounded-2xl text-center border-2 border-dashed border-gray-300 dark:border-zinc-800">
                <p className="text-gray-500 dark:text-zinc-500 mb-4 font-medium">ยังไม่ได้เพิ่มท่าออกกำลังกายในตารางนี้</p>
                {isOwner && (
                    <div className="text-blue-600 dark:text-red-400 font-bold">
                        คลิกปุ่ม "+ เพิ่มท่า" ด้านบนเพื่อเลือกท่าเข้าตาราง
                    </div>
                )}
            </div>
        );
    }

    if (!isOwner) {
        // Read-only view
        return (
            <ul className="space-y-4">
                {exercises.map((ex, idx) => (
                    <SortableExerciseItem
                        key={ex.id}
                        id={ex.id}
                        exercise={ex}
                        index={idx}
                        routineId={routineId}
                        isOwner={isOwner}
                        disabled={true}
                    />
                ))}
            </ul>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={exercises.map(e => e.id)}
                strategy={verticalListSortingStrategy}
            >
                <ul className="space-y-4">
                    {exercises.map((ex, idx) => (
                        <div key={ex.id} className="relative">
                            <SortableExerciseItem
                                id={ex.id}
                                exercise={ex}
                                index={idx}
                                routineId={routineId}
                                isOwner={isOwner}
                                disabled={!isOwner}
                                hasNextItem={idx < exercises.length - 1}
                                onLinkWithNext={handleLinkWithNext}
                            />
                            {ex.superset_id && idx < exercises.length - 1 && exercises[idx + 1]?.superset_id === ex.superset_id && (
                                <div className="absolute -bottom-4 left-6 w-1 h-8 bg-indigo-500 rounded-full z-0 dark:bg-indigo-600 shadow-sm" />
                            )}
                        </div>
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );
}
