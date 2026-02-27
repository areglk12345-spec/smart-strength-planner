'use client'

import { useState } from 'react'
import { AddExerciseModal } from '../components/AddExerciseModal'

interface Exercise {
    id: string
    name: string
    muscle_group: string
    type: string
}

export function AddExerciseModalHandler({
    routineId,
    allExercises,
    existingExerciseIds
}: {
    routineId: string
    allExercises: Exercise[]
    existingExerciseIds: string[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-bold text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 px-5 py-2.5 rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
                + เพิ่มท่า
            </button>

            <AddExerciseModal
                routineId={routineId}
                allExercises={allExercises}
                existingExerciseIds={existingExerciseIds}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}
