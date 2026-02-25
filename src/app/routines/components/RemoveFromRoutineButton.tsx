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
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
        >
            {loading ? 'กำลังนำออก...' : 'นำออก'}
        </button>
    )
}
