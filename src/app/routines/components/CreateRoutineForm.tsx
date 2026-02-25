'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRoutine } from '@/app/actions/routine'

const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"

export function CreateRoutineForm() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await createRoutine(formData)
        setLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            const form = document.getElementById('create-routine-form') as HTMLFormElement
            if (form) form.reset()
            router.refresh()
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">สร้างตารางฝึกใหม่</h2>
            <form id="create-routine-form" action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อตารางฝึก<span className="text-red-500">*</span></label>
                        <input type="text" name="name" required className={inputClass} placeholder="เช่น Push Day, Upper Body" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">คำอธิบาย</label>
                        <input type="text" name="description" className={inputClass} placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button type="submit" disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition disabled:opacity-50 text-sm">
                        {loading ? 'กำลังสร้าง...' : '+ สร้างตารางฝึก'}
                    </button>
                </div>
            </form>
        </div>
    )
}
