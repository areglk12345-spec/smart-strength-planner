'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRoutine } from '@/app/actions/routine'
import { ConfirmModal } from '@/app/components/ConfirmModal'
import { useToast } from '@/app/components/Toast'

export function DeleteRoutineButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    async function handleDeleteConfirm() {
        setLoading(true)
        const res = await deleteRoutine(id)
        setLoading(false)
        setIsConfirmOpen(false)

        if (res.error) {
            toast(res.error, 'error')
        } else {
            toast('ลบตารางฝึกเรียบร้อยแล้ว', 'success')
            router.refresh()
        }
    }

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    setIsConfirmOpen(true)
                }}
                disabled={loading}
                className="text-xs text-red-500 hover:text-red-700 bg-red-50/50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition disabled:opacity-50 z-10 relative font-semibold"
            >
                {loading ? '⏳ กำลังลบ...' : '🗑 ลบ'}
            </button>

            <ConfirmModal
                isOpen={isConfirmOpen}
                title="ยืนยันการลบตารางฝึก"
                message="คุณแน่ใจหรือไม่ว่าต้องการลบตารางฝึกนี้? (ท่าออกกำลังกายและประวัติการฝึกในตารางนี้จะได้รับผลกระทบด้วย)"
                confirmText="ลบตารางฝึก"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setIsConfirmOpen(false)}
                isLoading={loading}
                variant="danger"
            />
        </>
    )
}
