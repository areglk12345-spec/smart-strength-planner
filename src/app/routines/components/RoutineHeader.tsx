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
        <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mt-4 mb-8 relative group">
            {isEditing && (
                <EditRoutineModal
                    routine={routine}
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                />
            )}

            <div className="flex justify-between items-start pr-8">
                <div>
                    <h1 className="text-3xl font-black text-blue-600 dark:text-red-500 mb-3 tracking-tight">{routine.name}</h1>
                    {routine.description && (
                        <p className="text-gray-600 dark:text-zinc-400 mb-2 font-medium">{routine.description}</p>
                    )}
                </div>
                {isOwner && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="absolute top-6 right-6 text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-red-400 p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
                        title="แก้ไขตารางฝึก"
                    >
                        ✏️
                    </button>
                )}
            </div>
        </div>
    )
}
