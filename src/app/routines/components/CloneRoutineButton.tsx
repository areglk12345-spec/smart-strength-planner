'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cloneRoutine } from '@/app/actions/routine'

export function CloneRoutineButton({ routineId, isLoggedIn }: { routineId: string; isLoggedIn: boolean }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleClone() {
        if (!isLoggedIn) {
            router.push('/login')
            return
        }
        setLoading(true)
        const res = await cloneRoutine(routineId)
        setLoading(false)
        if (res.error) {
            alert(res.error)
        } else if (res.newRoutineId) {
            router.push(`/routines/${res.newRoutineId}`)
        }
    }

    return (
        <button
            onClick={handleClone}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-blue-500/30 text-sm"
        >
            {loading ? (
                <><span className="animate-spin">⏳</span> กำลัง Clone...</>
            ) : (
                <><span>📋</span> {isLoggedIn ? 'Clone ตารางนี้ไปยังบัญชีของฉัน' : 'เข้าสู่ระบบเพื่อ Clone'}</>
            )}
        </button>
    )
}
