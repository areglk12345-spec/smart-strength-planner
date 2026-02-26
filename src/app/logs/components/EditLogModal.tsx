'use client'

import { useState } from 'react'
import { updateWorkoutLog } from '@/app/actions/log'
import { useToast } from '@/app/components/Toast'

export function EditLogModal({
    log,
    isOpen,
    onClose
}: {
    log: any
    isOpen: boolean
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    if (!isOpen) return null

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await updateWorkoutLog(log.id, formData)
        setLoading(false)

        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('อัปเดตประวัติการฝึกเรียบร้อย! ✨', 'success')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 py-12 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8 animate-fade-in-up border border-gray-100 dark:border-gray-700 m-auto mt-16 sm:mt-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">✏️ แก้ไขข้อมูลประวัติการฝึก</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition bg-gray-100 dark:bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center">
                        ×
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">วันที่ชิ้นส่วนของประวัติ</label>
                        <input name="date" type="date" required defaultValue={log.date}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">บันทึกเพิ่มเติม (Notes)</label>
                        <textarea name="notes" rows={3} defaultValue={log.notes || ''} placeholder="ข้อควรจำจากการฝึกวันนั้น..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition disabled:opacity-50">
                            {loading ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
