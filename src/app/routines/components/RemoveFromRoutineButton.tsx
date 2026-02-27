'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { removeExerciseFromRoutine } from '@/app/actions/routine'

export function RemoveFromRoutineButton({
    routineId,
    exerciseId
}: {
    routineId: string
    exerciseId: string
}) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleRemove() {
        if (!confirm('ต้องการนำท่านี้ออกจากตารางฝึกหรือไม่?')) return

        setLoading(true)
        const res = await removeExerciseFromRoutine(routineId, exerciseId)
        setLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            router.refresh()
        }
    }

    return (
        <button
            onClick={handleRemove}
            disabled={loading}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-transparent dark:border-red-900/30 transition-colors disabled:opacity-50 shadow-sm"
        >
            {loading ? 'กำลังนำออก...' : 'นำออก'}
        </button>
    )
}
