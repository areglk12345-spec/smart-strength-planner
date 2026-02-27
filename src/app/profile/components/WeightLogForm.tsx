'use client'

import { useState } from 'react'
import { addWeightLog } from '@/app/actions/profile'
import { useToast } from '@/app/components/Toast'

const inputClass = "w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-green-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm"

export function WeightLogForm() {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        const res = await addWeightLog(formData)
        setLoading(false)
        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('บันทึกน้ำหนักสำเร็จ!', 'success')
            setSaved(true)
                ; (e.target as HTMLFormElement).reset()
            setTimeout(() => setSaved(false), 3000)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">น้ำหนัก (กิโลกรัม)</label>
                <input name="weight" type="number" step="0.1" min="1" required placeholder="เช่น 72.5" className={inputClass} />
            </div>
            <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">วันที่</label>
                <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className={inputClass} />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <button type="submit" disabled={loading}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-sm transition-all duration-300 whitespace-nowrap dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                    {loading ? 'บันทึก...' : '+ บันทึกน้ำหนัก'}
                </button>
                {saved && <span className="text-green-500 dark:text-green-400 text-sm font-bold">✅</span>}
            </div>
        </form>
    )
}
