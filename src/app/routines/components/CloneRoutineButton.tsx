'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Copy, Loader2, Check } from 'lucide-react'
import { cloneRoutine } from '../../actions/routine'
import { useToast } from '../../components/Toast'

export function CloneRoutineButton({ routineId, isLoggedIn }: { routineId: string; isLoggedIn: boolean }) {
    const [isCloning, setIsCloning] = useState(false)
    const [isDone, setIsDone] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function handleClone() {
        if (!isLoggedIn) {
            router.push('/login')
            return
        }
        setIsCloning(true)
        const res = await cloneRoutine(routineId)
        setIsCloning(false)

        if (res.error) {
            toast(res.error, 'error')
        } else if (res.newRoutineId) {
            setIsDone(true)
            toast('คัดลอกแบบฝึกสำเร็จ!', 'success')
            setTimeout(() => {
                router.push(`/routines/${res.newRoutineId}`)
            }, 1000)
        }
    }

    return (
        <button
            onClick={handleClone}
            disabled={isCloning || isDone}
            className="w-full bg-blue-600 dark:bg-red-600 hover:bg-blue-700 dark:hover:bg-red-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {isCloning ? (
                <Loader2 size={20} className="animate-spin" />
            ) : isDone ? (
                <Check size={20} />
            ) : (
                <Copy size={20} />
            )}
            {isCloning ? 'กำลังคัดลอก...' : isDone ? 'คัดลอกแล้ว!' : 'คัดลอกตารางนี้ไปใช้'}
        </button>
    )
}
