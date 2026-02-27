'use client'

import { useState } from 'react'
import { upsertProfile } from '@/app/actions/profile'
import { useToast } from '@/app/components/Toast'

export function ProfileForm({
    displayName,
    goal,
    height,
    experienceLevel,
    avatarUrl
}: {
    displayName: string | null
    goal: string | null
    height: number | null
    experienceLevel: string | null
    avatarUrl: string | null
}) {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const { toast } = useToast()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await upsertProfile(formData)
        setLoading(false)
        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('บันทึกโปรไฟล์เรียบร้อย!', 'success')
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">รูปโปรไฟล์ (Avatar URL)</label>
                <input name="avatar_url" type="url" defaultValue={avatarUrl || ''} placeholder="ใส่ลิ้งก์รูปภาพ (https://...) หรือ Emoji"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm" />
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-2 font-medium">แนะนำลิ้งก์ภาพสี่เหลี่ยมจัตุรัส หรือใส่อีโมจิที่ชอบ</p>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ชื่อที่ใช้แสดง (Name)</label>
                <input name="display_name" type="text" defaultValue={displayName || ''} placeholder="เช่น อาร์ม นักยก"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ส่วนสูง (Height) <span className="font-normal text-gray-400 dark:text-zinc-500">ซม.</span></label>
                <input name="height" type="number" step="0.1" min="100" max="250" defaultValue={height || ''} placeholder="เช่น 175"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">ระดับประสบการณ์ (Experience Level)</label>
                <select name="experience_level" defaultValue={experienceLevel || ''}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 shadow-sm">
                    <option value="">— เลือกระดับ —</option>
                    <option value="beginner">🌱 มือใหม่ (Beginner)</option>
                    <option value="intermediate">💪 ระดับกลาง (Intermediate)</option>
                    <option value="advanced">🔥 ระดับสูง (Advanced)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-1.5">เป้าหมายการฝึก (Goal)</label>
                <input name="goal" type="text" defaultValue={goal || ''} placeholder="เช่น ลดไขมัน 10% ใน 3 เดือน"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 outline-none transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm" />
            </div>
            <div className="flex items-center gap-3 pt-4">
                <button type="submit" disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm transition-all duration-300 dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                    {loading ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์ ✅'}
                </button>
                {saved && <span className="text-green-600 dark:text-green-400 text-sm font-bold animate-fade-in-up">✅ บันทึกสำเร็จ!</span>}
            </div>
        </form>
    )
}
