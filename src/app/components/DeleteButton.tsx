'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteExercise } from '@/app/actions/exercise'

export function DeleteButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete() {
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบท่าออกกำลังกายนี้?')) return

        setLoading(true)
        const res = await deleteExercise(id)
        setLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            router.refresh()
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="text-xs font-bold text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 bg-white dark:bg-zinc-900 px-3 py-1.5 rounded-lg transition-all shadow-sm disabled:opacity-50"
        >
            {loading ? 'กำลังลบ...' : 'ลบข้อมูล'}
        </button>
    )
}
