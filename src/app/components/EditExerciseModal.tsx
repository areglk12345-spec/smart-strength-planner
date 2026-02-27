'use client'

import { useState } from 'react'
import { updateExercise } from '@/app/actions/exercise'
import { useToast } from '@/app/components/Toast'

interface Exercise {
    id: string
    name: string
    muscle_group: string
    type: string
    description: string | null
    youtube_url: string | null
}

export function EditExerciseModal({
    exercise,
    isOpen,
    onClose
}: {
    exercise: Exercise
    isOpen: boolean
    onClose: () => void
}) {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    if (!isOpen) return null

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await updateExercise(exercise.id, formData)
        setLoading(false)

        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('แก้ไขท่าออกกำลังกายเรียบร้อย! ✨', 'success')
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 py-12 overflow-y-auto">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 animate-fade-in-up border border-gray-100 dark:border-zinc-800 m-auto mt-16 sm:mt-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">✏️ แก้ไขท่าออกกำลังกาย</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 transition bg-gray-100 dark:bg-zinc-800 hover:dark:bg-zinc-700 rounded-full w-8 h-8 flex items-center justify-center">
                        ×
                    </button>
                </div>

                <form action={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ชื่อท่า (Exercise Name) <span className="text-red-500">*</span></label>
                        <input name="name" type="text" required defaultValue={exercise.name}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all" />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">กลุ่มกล้ามเนื้อ <span className="text-red-500">*</span></label>
                            <select name="muscle_group" required defaultValue={exercise.muscle_group}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all">
                                <option value="Chest">หน้าอก (Chest)</option>
                                <option value="Back">หลัง (Back)</option>
                                <option value="Legs">ขา (Legs)</option>
                                <option value="Shoulders">ไหล่ (Shoulders)</option>
                                <option value="Arms">แขน (Arms)</option>
                                <option value="Core">แกนกลางลำตัว (Core)</option>
                                <option value="Full Body">ทั่วร่าง (Full Body)</option>
                                <option value="Cardio">คาร์ดิโอ (Cardio)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ประเภท <span className="text-red-500">*</span></label>
                            <select name="type" required defaultValue={exercise.type}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all">
                                <option value="Weight">ยกน้ำหนัก (Weight/Reps)</option>
                                <option value="Bodyweight">น้ำหนักตัว (Bodyweight/Reps)</option>
                                <option value="Time">จับเวลา (Duration)</option>
                                <option value="Distance">ระยะทาง (Distance)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">คำอธิบาย</label>
                        <textarea name="description" rows={3} defaultValue={exercise.description || ''}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">YouTube URL</label>
                        <input name="youtube_url" type="url" defaultValue={exercise.youtube_url || ''} placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all" />
                    </div>

                    <div className="pt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-zinc-300 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold shadow-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] transition-all duration-300 disabled:opacity-50">
                            {loading ? 'กำลังบันทึก...' : '💾 บันทึกการแก้ไข'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
