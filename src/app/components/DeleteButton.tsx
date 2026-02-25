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
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 bg-white px-3 py-1 rounded transition disabled:opacity-50"
        >
            {loading ? 'กำลังลบ...' : 'ลบข้อมูล'}
        </button>
    )
}
