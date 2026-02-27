'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';
import { RemoveFromRoutineButton } from './RemoveFromRoutineButton';
import { Exercise } from './DraggableExerciseList';

export function SortableExerciseItem({
    id,
    exercise,
    index,
    routineId,
    isOwner,
    disabled = false,
    onLinkWithNext,
    hasNextItem,
}: {
    id: string;
    exercise: Exercise;
    index: number;
    routineId: string;
    isOwner: boolean;
    disabled?: boolean;
    onLinkWithNext?: (exerciseId: string) => void;
    hasNextItem?: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.8 : 1,
    };

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`p-5 bg-white/50 dark:bg-zinc-950/50 border ${isDragging ? 'border-blue-500 dark:border-red-500 shadow-lg' : 'border-gray-200 dark:border-zinc-800'} rounded-2xl flex justify-between items-center hover:border-blue-300 dark:hover:border-red-500/30 transition-colors group relative`}
        >
            <div className="flex items-center gap-5 w-full">
                {/* Drag Handle */}
                {!disabled && (
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 -ml-2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                        title="Drag to reorder"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 6C8 7.10457 7.10457 8 6 8C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z" fill="currentColor" />
                            <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="currentColor" />
                            <path d="M8 18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16C7.10457 16 8 16.8954 8 18Z" fill="currentColor" />
                            <path d="M20 6C20 7.10457 19.1046 8 18 8C16.8954 8 16 7.10457 16 6C16 4.89543 16.8954 4 18 4C19.1046 4 20 4.89543 20 6Z" fill="currentColor" />
                            <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="currentColor" />
                            <path d="M20 18C20 19.1046 19.1046 20 18 20C16.8954 20 16 19.1046 16 18C16 16.8954 16.8954 16 18 16C19.1046 16 20 16.8954 20 18Z" fill="currentColor" />
                        </svg>
                    </div>
                )}

                <div className={`bg-blue-50 dark:bg-red-950/50 text-blue-700 dark:text-red-400 font-black w-10 h-10 rounded-xl flex items-center justify-center text-sm border border-blue-100 dark:border-red-900/30 shadow-sm ${disabled ? '' : 'ml-2'}`}>
                    {index + 1}
                </div>

                <div className="flex-1">
                    <Link href={`/exercises/${exercise.id}`} className="font-black text-lg text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-red-400 transition-colors tracking-tight">
                        {exercise.name}
                    </Link>
                    <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 px-2.5 py-1 rounded-lg font-bold shadow-sm">{exercise.muscle_group}</span>
                        <span className="text-xs bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 px-2.5 py-1 rounded-lg font-bold shadow-sm">{exercise.type}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Superset Link Button */}
                {!disabled && hasNextItem && onLinkWithNext && (
                    <button
                        onClick={() => onLinkWithNext(exercise.id)}
                        className={`p-2 rounded-xl transition-all border ${exercise.superset_id
                            ? 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800 shadow-sm'
                            : 'bg-white text-gray-400 border-gray-200 hover:text-indigo-600 hover:border-indigo-300 dark:bg-zinc-900 dark:text-zinc-500 dark:border-zinc-800 dark:hover:text-indigo-400 dark:hover:border-indigo-700/50'
                            }`}
                        title={exercise.superset_id ? "Linked as Superset" : "Link as Superset with next exercise"}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.8284 10.1716L10.1716 13.8284M8.75736 15.2426C7.58579 16.4142 5.68629 16.4142 4.51472 15.2426C3.34315 14.0711 3.34315 12.1716 4.51472 11L7.34315 8.17157C8.51472 7 10.4142 7 11.5858 8.17157M15.2426 8.75736C16.4142 7.58579 16.4142 5.68629 15.2426 4.51472C14.0711 3.34315 12.1716 3.34315 11 4.51472L8.17157 7.34315C7 8.51472 7 10.4142 8.17157 11.5858" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                {isOwner && (
                    <div className="flex-shrink-0">
                        <RemoveFromRoutineButton routineId={routineId} exerciseId={exercise.id} />
                    </div>
                )}
            </div>
        </li>
    );
}
