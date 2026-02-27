'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addExerciseToRoutine } from '@/app/actions/routine'
import { useToast } from '@/app/components/Toast'

interface Exercise {
    id: string
    name: string
    muscle_group: string
    type: string
}

export function AddExerciseModal({
    routineId,
    allExercises,
    existingExerciseIds,
    isOpen,
    onClose
}: {
    routineId: string
    allExercises: Exercise[]
    existingExerciseIds: string[]
    isOpen: boolean
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const { toast } = useToast()
    const router = useRouter()

    if (!isOpen) return null

    // Filter out exercises that are already in the routine
    const availableExercises = allExercises.filter(ex => !existingExerciseIds.includes(ex.id))

    // Filter by search query
    const filteredExercises = availableExercises.filter(ex =>
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Group by muscle group
    const groupedExercises = filteredExercises.reduce((acc, ex) => {
        if (!acc[ex.muscle_group]) acc[ex.muscle_group] = []
        acc[ex.muscle_group].push(ex)
        return acc
    }, {} as Record<string, Exercise[]>)

    async function handleAddExercise(exerciseId: string) {
        setLoading(true)
        const res = await addExerciseToRoutine(routineId, exerciseId)
        setLoading(false)

        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('เพิ่มท่าออกกำลังกายเรียบร้อย! ✨', 'success')
            router.refresh() // The parent component (page) will refresh to show the new exercise
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 py-12 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-8 animate-fade-in-up border border-gray-100 dark:border-zinc-800 m-auto mt-16 sm:mt-auto flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                        <span className="text-blue-500 dark:text-red-500">+</span> เพิ่มท่าลงตารางฝึก
                    </h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors bg-gray-100 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center">
                        ×
                    </button>
                </div>

                <div className="mb-6 shrink-0">
                    <input
                        type="text"
                        placeholder="🔍 ค้นหาชื่อท่า หรือ กลุ่มกล้ามเนื้อ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3.5 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm"
                    />
                </div>

                <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    {availableExercises.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-zinc-500">
                            คุณมีท่าออกกำลังกายทั้งหมดในตารางนี้แล้ว
                        </div>
                    ) : filteredExercises.length === 0 ? (
                        <div className="text-center py-12 text-gray-500 dark:text-zinc-500">
                            ไม่พบท่าออกกำลังกายที่ค้นหา
                        </div>
                    ) : (
                        <div className="space-y-6 pb-4">
                            {Object.entries(groupedExercises).map(([muscleGroup, exercises]) => (
                                <div key={muscleGroup}>
                                    <h3 className="text-sm font-black text-gray-800 dark:text-zinc-300 mb-3 tracking-widest uppercase border-b border-gray-200 dark:border-zinc-800 pb-2">
                                        {muscleGroup}
                                    </h3>
                                    <ul className="space-y-3">
                                        {exercises.map((ex) => (
                                            <li key={ex.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-950/50 rounded-2xl border border-gray-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-red-500/30 transition-all">
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-zinc-100">{ex.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wide font-medium">{ex.type}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleAddExercise(ex.id)}
                                                    disabled={loading}
                                                    className="bg-white dark:bg-zinc-800 text-blue-600 dark:text-red-400 hover:bg-blue-50 dark:hover:bg-red-950/30 border border-gray-200 dark:border-zinc-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                                                >
                                                    + เพิ่ม
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
