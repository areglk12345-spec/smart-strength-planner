'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRoutine } from '@/app/actions/routine'

export function DeleteRoutineButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault() // ป้องกันไม่ให้กดแล้ววิ่งเข้า Link ถ้าซ้อนอยู่ใน Link
        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบตารางฝึกนี้? (ท่าออกกำลังกายในนี้จะถูกลบออกจากตารางไปด้วย)')) return

        setLoading(true)
        const res = await deleteRoutine(id)
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
            className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 bg-white px-3 py-1 rounded transition disabled:opacity-50 z-10 relative"
        >
            {loading ? 'กำลังลบ...' : 'ลบตาราง'}
        </button>
    )
}
