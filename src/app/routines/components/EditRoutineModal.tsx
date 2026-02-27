'use client'

import { useState } from 'react'
import { updateRoutine } from '@/app/actions/routine'
import { useToast } from '@/app/components/Toast'

export function EditRoutineModal({
    routine,
    isOpen,
    onClose
}: {
    routine: { id: string; name: string; description: string | null }
    isOpen: boolean
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    if (!isOpen) return null

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await updateRoutine(routine.id, formData)
        setLoading(false)

        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('แก้ไขตารางฝึกเรียบร้อย! ✨', 'success')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 py-12 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 animate-fade-in-up border border-gray-100 dark:border-zinc-800 m-auto mt-16 sm:mt-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">✏️ แก้ไขตารางฝึก</h2>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition-colors bg-gray-100 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center">
                        ×
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ชื่อตารางฝึก <span className="text-red-500">*</span></label>
                        <input name="name" type="text" required defaultValue={routine.name} placeholder="เช่น Full Body Workout"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">รายละเอียด (Description)</label>
                        <textarea name="description" rows={3} defaultValue={routine.description || ''} placeholder="อธิบายเป้าหมายของตารางฝึกนี้..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm resize-y" />
                    </div>

                    <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-gray-600 dark:text-zinc-300 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors bg-gray-50 dark:bg-transparent">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold shadow-sm transition-all duration-300 disabled:opacity-50 dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                            {loading ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
