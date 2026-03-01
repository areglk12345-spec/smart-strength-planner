'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteRoutine } from '@/app/actions/routine'
import { ConfirmModal } from '@/app/components/ConfirmModal'
import { useToast } from '@/app/components/Toast'
import { Trash2, Loader2 } from 'lucide-react'

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
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 border border-transparent dark:border-red-900/30 px-4 py-2 rounded-xl transition-colors disabled:opacity-50 z-10 relative font-bold"
            >
                {loading ? (
                    <span className="flex items-center gap-1.5">
                        <Loader2 size={14} className="animate-spin" />
                        กำลังลบ...
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5">
                        <Trash2 size={14} />
                        ลบ
                    </span>
                )}
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
