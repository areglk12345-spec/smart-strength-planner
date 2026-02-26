'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DeleteButton } from './DeleteButton'
import { EditExerciseModal } from './EditExerciseModal'

interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
    type: string;
    description: string;
    youtube_url: string | null;
}

export function ExerciseList({
    initialExercises,
    userId
}: {
    initialExercises: Exercise[];
    userId: string | undefined;
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedMuscle, setSelectedMuscle] = useState('All')
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

    const muscleGroups = ['All', ...Array.from(new Set(initialExercises.map(ex => ex.muscle_group)))]

    const filteredExercises = initialExercises.filter(exercise => {
        const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMuscle = selectedMuscle === 'All' || exercise.muscle_group === selectedMuscle
        return matchesSearch && matchesMuscle
    })

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            {editingExercise && (
                <EditExerciseModal
                    exercise={editingExercise}
                    isOpen={!!editingExercise}
                    onClose={() => setEditingExercise(null)}
                />
            )}

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">ท่าออกกำลังกายพื้นฐาน (จากฐานข้อมูล)</h2>

            <div className="mb-6 space-y-4">
                <input
                    type="search"
                    placeholder="🔍 ค้นหาท่าออกกำลังกาย..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />

                <div className="flex flex-wrap gap-2">
                    {muscleGroups.map(muscle => (
                        <button
                            key={muscle}
                            onClick={() => setSelectedMuscle(muscle)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedMuscle === muscle
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>
            </div>

            {filteredExercises.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                    <p className="text-gray-500 dark:text-gray-400">ไม่พบท่าออกกำลังกายที่ตรงกับการค้นหา</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {filteredExercises.map((exercise) => (
                        <li key={exercise.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition bg-white dark:bg-gray-800 group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <Link href={`/exercises/${exercise.id}`}>
                                            {exercise.name}
                                        </Link>
                                    </div>
                                    <div className="text-sm text-gray-600 flex gap-2 mt-1.5 mb-2">
                                        <span className="bg-blue-50 dark:bg-blue-900/50 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-medium">
                                            {exercise.muscle_group}
                                        </span>
                                        <span className="bg-purple-50 dark:bg-purple-900/50 border border-purple-100 dark:border-purple-800 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-xs font-medium">
                                            {exercise.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{exercise.description}</p>
                                </div>
                                {userId && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2 items-end">
                                        <Link
                                            href={`/exercises/${exercise.id}`}
                                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1 rounded transition font-medium"
                                        >
                                            ดูรายละเอียด →
                                        </Link>
                                        <div className="flex items-center gap-2 mt-1">
                                            <button
                                                onClick={() => setEditingExercise(exercise)}
                                                className="text-gray-400 hover:text-blue-500 transition text-sm p-1"
                                                title="แก้ไขท่า"
                                            >
                                                ✏️
                                            </button>
                                            <DeleteButton id={exercise.id} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
