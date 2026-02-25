'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addExerciseToRoutine } from '@/app/actions/routine'

interface Routine {
    id: string
    name: string
}

export function AddToRoutineDropdown({ exerciseId, userRoutines }: { exerciseId: string; userRoutines: Routine[] }) {
    const [loading, setLoading] = useState(false)
    const [selectedRoutine, setSelectedRoutine] = useState('')
    const [added, setAdded] = useState(false)
    const router = useRouter()

    async function handleAdd() {
        if (!selectedRoutine) return
        setLoading(true)
        const res = await addExerciseToRoutine(selectedRoutine, exerciseId)
        setLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            setAdded(true)
            setSelectedRoutine('')
            router.refresh()
            setTimeout(() => setAdded(false), 3000)
        }
    }

    if (userRoutines.length === 0) {
        return (
            <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                คุณยังไม่มีตารางฝึก <a href="/routines" className="text-blue-500 hover:underline">สร้างตารางฝึกใหม่ได้ที่นี่</a>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-2 mt-4 items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">เพิ่มเข้าตารางฝึก:</span>
            <select
                value={selectedRoutine}
                onChange={(e) => setSelectedRoutine(e.target.value)}
                className="flex-1 min-w-[200px] border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                disabled={loading}
            >
                <option value="">-- เลือกตารางฝึก --</option>
                {userRoutines.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>
            <div className="flex items-center gap-2">
                <button onClick={handleAdd} disabled={!selectedRoutine || loading}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition whitespace-nowrap">
                    {loading ? 'กำลังเพิ่ม...' : '+ เพิ่ม'}
                </button>
                {added && <span className="text-green-500 text-sm font-medium">✅ เพิ่มแล้ว!</span>}
            </div>
        </div>
    )
}
