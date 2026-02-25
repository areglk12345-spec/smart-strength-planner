'use client'

import { addExercise } from '@/app/actions/exercise'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"

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

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">เพิ่มท่าออกกำลังกายใหม่</h2>
            <form id="add-exercise-form" action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>ชื่อท่า</label>
                        <input type="text" name="name" required className={inputClass} placeholder="เช่น Barbell Bench Press" />
                    </div>
                    <div>
                        <label className={labelClass}>กล้ามเนื้อหลัก</label>
                        <input type="text" name="muscle_group" required className={inputClass} placeholder="เช่น Chest, Legs, Back" />
                    </div>
                    <div>
                        <label className={labelClass}>ประเภท</label>
                        <input type="text" name="type" required className={inputClass} placeholder="เช่น compound, isolation" />
                    </div>
                    <div>
                        <label className={labelClass}>คำอธิบายสั้นๆ</label>
                        <input type="text" name="description" className={inputClass} placeholder="(ไม่บังคับ) ท่าหลักสำหรับสร้างกล้ามเนื้อหน้าอก" />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>
                        วิดีโอตัวอย่าง (YouTube URL) <span className="text-gray-400 font-normal">(ไม่บังคับ)</span>
                    </label>
                    <input type="url" name="youtube_url" className={inputClass} placeholder="https://www.youtube.com/watch?v=..." />
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition disabled:opacity-50 text-sm">
                        {loading ? 'กำลังบันทึก...' : '+ เพิ่มข้อมูล'}
                    </button>
                </div>
            </form>
        </div>
    )
}
