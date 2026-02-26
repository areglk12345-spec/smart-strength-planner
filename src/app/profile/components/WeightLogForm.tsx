'use client'

import { useState } from 'react'
import { addWeightLog } from '@/app/actions/profile'
import { useToast } from '@/app/components/Toast'

const inputClass = "w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"

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
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">น้ำหนัก (กิโลกรัม)</label>
                <input name="weight" type="number" step="0.1" min="1" required placeholder="เช่น 72.5" className={inputClass} />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">วันที่</label>
                <input name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required className={inputClass} />
            </div>
            <div className="flex items-center gap-3">
                <button type="submit" disabled={loading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition whitespace-nowrap">
                    {loading ? 'บันทึก...' : '+ บันทึกน้ำหนัก'}
                </button>
                {saved && <span className="text-green-500 text-sm font-medium">✅</span>}
            </div>
        </form>
    )
}
