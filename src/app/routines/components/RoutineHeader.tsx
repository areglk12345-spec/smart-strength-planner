'use client'

import { useState } from 'react'
import { EditRoutineModal } from './EditRoutineModal'

export function RoutineHeader({
    routine,
    isOwner
}: {
    routine: { id: string; name: string; description: string | null }
    isOwner: boolean
}) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mt-4 mb-6 relative group">
            {isEditing && (
                <EditRoutineModal
                    routine={routine}
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                />
            )}

            <div className="flex justify-between items-start pr-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{routine.name}</h1>
                    {routine.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{routine.description}</p>
                    )}
                </div>
                {isOwner && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition opacity-0 group-hover:opacity-100"
                        title="แก้ไขตารางฝึก"
                    >
                        ✏️
                    </button>
                )}
            </div>
        </div>
    )
}
