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
        <div className="bg-white/70 dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
            {editingExercise && (
                <EditExerciseModal
                    exercise={editingExercise}
                    isOpen={!!editingExercise}
                    onClose={() => setEditingExercise(null)}
                />
            )}

            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="text-blue-500 dark:text-red-500">☰</span> ท่าออกกำลังกายพื้นฐาน (จากฐานข้อมูล)
            </h2>

            <div className="mb-6 space-y-4">
                <input
                    type="search"
                    placeholder="🔍 ค้นหาท่าออกกำลังกาย..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 focus:border-blue-500 dark:focus:border-red-500 outline-none transition-all text-sm shadow-sm bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600"
                />

                <div className="flex flex-wrap gap-2">
                    {muscleGroups.map(muscle => (
                        <button
                            key={muscle}
                            onClick={() => setSelectedMuscle(muscle)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedMuscle === muscle
                                ? 'bg-blue-600 dark:bg-red-600 text-white border-blue-600 dark:border-red-600 shadow-md dark:shadow-[0_0_15px_rgba(220,38,38,0.3)] scale-105'
                                : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-blue-300 dark:hover:border-red-500/50'
                                }`}
                        >
                            {muscle}
                        </button>
                    ))}
                </div>
            </div>

            {filteredExercises.length === 0 ? (
                <div className="text-center py-10 bg-gray-50/50 dark:bg-zinc-950/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
                    <p className="text-gray-500 dark:text-zinc-500 font-medium">ไม่พบท่าออกกำลังกายที่ตรงกับการค้นหา</p>
                </div>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredExercises.map((exercise) => (
                        <li key={exercise.id} className="p-5 border border-white/60 dark:border-zinc-800 rounded-2xl hover:border-blue-400 dark:hover:border-red-500/50 hover:shadow-lg dark:hover:shadow-[0_4px_20px_rgba(220,38,38,0.1)] transition-all duration-300 bg-white/50 dark:bg-zinc-900 group">
                            <div className="flex justify-between items-start h-full">
                                <div className="flex flex-col h-full">
                                    <div className="font-bold text-lg text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-red-400 transition-colors">
                                        <Link href={`/exercises/${exercise.id}`}>
                                            {exercise.name}
                                        </Link>
                                    </div>
                                    <div className="text-sm text-gray-600 flex flex-wrap gap-2 mt-2 mb-3">
                                        <span className="bg-blue-50 dark:bg-red-950/30 border border-blue-100 dark:border-red-900/50 text-blue-700 dark:text-red-400 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                                            {exercise.muscle_group}
                                        </span>
                                        <span className="bg-purple-50 dark:bg-orange-950/30 border border-purple-100 dark:border-orange-900/50 text-purple-700 dark:text-orange-400 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                                            {exercise.type}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 dark:text-zinc-400 text-sm leading-relaxed mt-auto">{exercise.description}</p>
                                </div>
                                {userId && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-3 items-end ml-4 shrink-0">
                                        <Link
                                            href={`/exercises/${exercise.id}`}
                                            className="text-xs text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 bg-blue-50 dark:bg-red-950/20 hover:bg-blue-100 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg border border-transparent dark:border-red-900/30 transition-all font-bold whitespace-nowrap"
                                        >
                                            ดูรายละเอียด →
                                        </Link>
                                        <div className="flex items-center gap-3 mt-auto">
                                            <button
                                                onClick={() => setEditingExercise(exercise)}
                                                className="text-gray-400 hover:text-blue-500 dark:hover:text-red-400 transition-colors text-sm p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
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
