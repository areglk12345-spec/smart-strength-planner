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
            <div className="text-sm font-bold text-gray-500 dark:text-zinc-400 italic bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 text-center sm:text-left shadow-sm">
                คุณยังไม่มีตารางฝึก <a href="/routines" className="text-blue-600 dark:text-red-500 hover:text-blue-800 dark:hover:text-red-400 border-b border-transparent hover:border-current transition-colors ml-1 pb-0.5">สร้างตารางฝึกใหม่ได้ที่นี่</a>
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-6 items-center bg-gray-50/50 dark:bg-zinc-950/50 p-5 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-sm">
            <span className="text-sm font-black text-gray-700 dark:text-zinc-300 whitespace-nowrap tracking-widest uppercase">เพิ่มเข้าตารางฝึก</span>
            <select
                value={selectedRoutine}
                onChange={(e) => setSelectedRoutine(e.target.value)}
                className="flex-1 w-full sm:w-auto min-w-[200px] border border-gray-300 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 outline-none bg-white dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 shadow-sm transition-all text-center sm:text-left"
                disabled={loading}
            >
                <option value="">-- เลือกตารางฝึก --</option>
                {userRoutines.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                ))}
            </select>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button onClick={handleAdd} disabled={!selectedRoutine || loading}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 text-white px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                    {loading ? 'กำลังเพิ่ม...' : '+ เพิ่ม'}
                </button>
                {added && <span className="text-green-600 dark:text-green-400 text-xs font-bold animate-fade-in-up whitespace-nowrap bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-900/50 shadow-sm uppercase tracking-wide">✅ เพิ่มแล้ว</span>}
            </div>
        </div>
    )
}
