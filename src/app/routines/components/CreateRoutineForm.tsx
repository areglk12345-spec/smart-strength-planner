'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRoutine } from '@/app/actions/routine'

const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all text-sm bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm"

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
        <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8">
            <h2 className="text-xl font-black mb-6 text-gray-800 dark:text-zinc-100 tracking-tight">สร้างตารางฝึกใหม่</h2>
            <form id="create-routine-form" action={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ชื่อตารางฝึก<span className="text-red-500">*</span></label>
                        <input type="text" name="name" required className={inputClass} placeholder="เช่น Push Day, Upper Body" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">คำอธิบาย</label>
                        <input type="text" name="description" className={inputClass} placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)" />
                    </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-zinc-800 mt-2">
                    <button type="submit" disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 disabled:opacity-50 text-sm shadow-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                        {loading ? 'กำลังสร้าง...' : '+ สร้างตารางฝึก'}
                    </button>
                </div>
            </form>
        </div>
    )
}
