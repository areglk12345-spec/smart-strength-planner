'use client'

import { addExercise } from '@/app/actions/exercise'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 outline-none transition text-sm bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
const labelClass = "block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1"

export function AddExerciseForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await addExercise(formData)
        setLoading(false)

        if (res.error) {
            alert(res.error)
        } else {
            const form = document.getElementById('add-exercise-form') as HTMLFormElement
            if (form) form.reset()
            router.refresh()
        }
    }

    const inputClasses = "w-full px-4 py-2 border border-gray-300 dark:border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 focus:border-blue-500 dark:focus:border-red-500 outline-none transition-all text-sm bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600"
    const labelClasses = "block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5"

    return (
        <div className="bg-white/70 dark:bg-zinc-900 p-6 sm:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 mb-8 backdrop-blur-md">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                <span className="text-blue-500 dark:text-red-500">+</span> เพิ่มท่าออกกำลังกายใหม่
            </h2>
            <form id="add-exercise-form" action={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className={labelClasses}>ชื่อท่า</label>
                        <input type="text" name="name" required className={inputClasses} placeholder="เช่น Barbell Bench Press" />
                    </div>
                    <div>
                        <label className={labelClasses}>กล้ามเนื้อหลัก</label>
                        <input type="text" name="muscle_group" required className={inputClasses} placeholder="เช่น Chest, Legs, Back" />
                    </div>
                    <div>
                        <label className={labelClasses}>ประเภท</label>
                        <input type="text" name="type" required className={inputClasses} placeholder="เช่น compound, isolation" />
                    </div>
                    <div>
                        <label className={labelClasses}>คำอธิบายสั้นๆ</label>
                        <input type="text" name="description" className={inputClasses} placeholder="(ไม่บังคับ) ท่าหลักสำหรับสร้างกล้ามเนื้อหน้าอก" />
                    </div>
                </div>
                <div>
                    <label className={labelClasses}>
                        วิดีโอตัวอย่าง (YouTube URL) <span className="text-gray-400 dark:text-zinc-600 font-normal ml-1">(ไม่บังคับ)</span>
                    </label>
                    <input type="url" name="youtube_url" className={inputClasses} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading}
                        className="bg-green-600 hover:bg-green-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm shadow-sm hover:shadow-md dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                        {loading ? 'กำลังบันทึก...' : '+ เพิ่มข้อมูล'}
                    </button>
                </div>
            </form>
        </div>
    )
}
