'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cloneRoutine } from '@/app/actions/routine'
import { useToast } from '@/app/components/Toast'

export function CloneRoutineButton({ routineId, isLoggedIn }: { routineId: string; isLoggedIn: boolean }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function handleClone() {
        if (!isLoggedIn) {
            router.push('/login')
            return
        }
        setLoading(true)
        const res = await cloneRoutine(routineId)
        setLoading(false)
        if (res.error) {
            toast(res.error, 'error')
        } else if (res.newRoutineId) {
            toast('คัดลอกตารางฝึกเรียบร้อย 🚀', 'success')
            router.push(`/routines/${res.newRoutineId}`)
        }
    }

    return (
        <button
            onClick={handleClone}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-rose-600 dark:hover:bg-rose-700 disabled:opacity-50 text-white font-black px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(225,29,72,0.3)] dark:hover:shadow-[0_6px_20px_rgba(225,29,72,0.5)] text-sm tracking-wide w-full sm:w-auto"
        >
            {loading ? (
                <><span className="animate-spin">⏳</span> กำลัง Clone...</>
            ) : (
                <><span>📋</span> {isLoggedIn ? 'Clone ตารางนี้ไปยังบัญชีของฉัน' : 'เข้าสู่ระบบเพื่อ Clone'}</>
            )}
        </button>
    )
}
