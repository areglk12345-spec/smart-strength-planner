'use client'

import { useState } from 'react'
import { upsertProfile } from '@/app/actions/profile'

export function ProfileForm({
    displayName,
    goal,
    height,
    experienceLevel
}: {
    displayName: string | null
    goal: string | null
    height: number | null
    experienceLevel: string | null
}) {
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const res = await upsertProfile(formData)
        setLoading(false)
        if (res?.error) { alert(res.error) } else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อที่ใช้แสดง (Name)</label>
                <input name="display_name" type="text" defaultValue={displayName || ''} placeholder="เช่น อาร์ม นักยก"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ส่วนสูง (Height) <span className="font-normal text-gray-400">ซม.</span></label>
                <input name="height" type="number" step="0.1" min="100" max="250" defaultValue={height || ''} placeholder="เช่น 175"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">ระดับประสบการณ์ (Experience Level)</label>
                <select name="experience_level" defaultValue={experienceLevel || ''}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    <option value="">— เลือกระดับ —</option>
                    <option value="beginner">🌱 มือใหม่ (Beginner)</option>
                    <option value="intermediate">💪 ระดับกลาง (Intermediate)</option>
                    <option value="advanced">🔥 ระดับสูง (Advanced)</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">เป้าหมายการฝึก (Goal)</label>
                <input name="goal" type="text" defaultValue={goal || ''} placeholder="เช่น ลดไขมัน 10% ใน 3 เดือน"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="flex items-center gap-3 pt-2">
                <button type="submit" disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-5 py-2 rounded-lg text-sm transition">
                    {loading ? 'กำลังบันทึก...' : 'บันทึกโปรไฟล์'}
                </button>
                {saved && <span className="text-green-600 text-sm font-medium">✅ บันทึกสำเร็จ!</span>}
            </div>
        </form>
    )
}
