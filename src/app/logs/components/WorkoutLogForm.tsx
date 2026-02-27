'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWorkoutLog } from '@/app/actions/log'
import { PRCelebration } from '@/app/components/PRCelebration'
import { useToast } from '@/app/components/Toast'
import { RestTimer } from './RestTimer'

interface ExerciseType { id: string; name: string }
interface LoggedExercise { exercise_id: string; name: string; sets: number; reps: number; weight: number }

const inputClass = "w-full border border-gray-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 transition-all bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 shadow-sm"

export function WorkoutLogForm({ routineId, initialExercises, allExercises }: {
    routineId: string | null; initialExercises: LoggedExercise[]; allExercises: ExerciseType[]
}) {
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [exercises, setExercises] = useState<LoggedExercise[]>(initialExercises)
    const [prs, setPrs] = useState<{ exerciseName: string; weight: number; exerciseId: string }[]>([])
    const router = useRouter()
    const { toast } = useToast()

    const addExerciseRow = () => {
        if (allExercises.length === 0) return
        setExercises([...exercises, { exercise_id: allExercises[0].id, name: allExercises[0].name, sets: 1, reps: 0, weight: 0 }])
    }

    const handleSetComplete = () => {
        const timerBtn = document.getElementById('hidden-timer-start-btn');
        if (timerBtn) {
            timerBtn.click();
        }
        toast('เซ็ตเสร็จสมบูรณ์! จับเวลาพัก...', 'success');
    }

    const removeExerciseRow = (index: number) => {
        const newExercises = [...exercises]; newExercises.splice(index, 1); setExercises(newExercises)
    }
    const updateExercise = (index: number, field: keyof LoggedExercise, value: any) => {
        const newExercises = [...exercises]
        if (field === 'exercise_id') {
            const selectedEx = allExercises.find(e => e.id === value)
            if (selectedEx) newExercises[index].name = selectedEx.name
        }
        newExercises[index] = { ...newExercises[index], [field]: value }
        setExercises(newExercises)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (exercises.length === 0) { toast('กรุณาเพิ่มท่าออกกำลังกายอย่างน้อย 1 ท่า', 'warning'); return }
        setLoading(true)
        const formData = new FormData()
        formData.append('date', date)
        if (notes) formData.append('notes', notes)
        if (routineId) formData.append('routine_id', routineId)
        formData.append('exercises_json', JSON.stringify(exercises))
        const res = await createWorkoutLog(formData)
        setLoading(false)

        if (res?.error) {
            toast(res.error, 'error')
            return
        }

        toast('บันทึกสถิติสำเร็จ!', 'success')

        // Show PR celebration if any PRs were achieved
        if (res?.prs && res.prs.length > 0) {
            setPrs(res.prs)
            // PRCelebration will handle the redirect after dismiss
        } else {
            router.push('/logs')
        }
    }

    return (
        <>
            {prs.length > 0 && (
                <PRCelebration prs={prs} onDismiss={() => router.push('/logs')} />
            )}

            <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">

                {/* Timer Section */}
                <RestTimer defaultRestTime={90} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 dark:border-zinc-800 pb-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-2">วันที่ฝึก (Date)</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-zinc-400 mb-2">บันทึกเพิ่มเติม <span className="text-gray-400 dark:text-zinc-500 font-normal">(เลือกได้)</span></label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="รู้สึกยังไงวันนี้..." className={inputClass} />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2"><span>💪</span> ท่าที่ฝึกในวันนี้</h3>
                        <button type="button" onClick={addExerciseRow}
                            className="text-sm bg-blue-50 dark:bg-red-950/30 text-blue-600 dark:text-red-400 hover:bg-blue-100 dark:hover:bg-red-900/50 border border-transparent dark:border-red-900/30 px-4 py-2 rounded-xl font-bold transition-colors">
                            + เพิ่มท่า
                        </button>
                    </div>

                    {exercises.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50/50 dark:bg-zinc-950/30 border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-2xl text-gray-500 dark:text-zinc-500 font-medium">
                            ยังไม่ได้เลือกท่า กด &quot;+ เพิ่มท่า&quot; เพื่อเริ่มบันทึกสถิติ
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {exercises.map((ex, idx) => (
                                <div key={idx} className="p-5 bg-white/50 dark:bg-zinc-950/30 border border-gray-200 dark:border-zinc-800 rounded-2xl flex flex-col md:flex-row gap-5 items-end group hover:border-blue-300 dark:hover:border-red-500/30 transition-colors">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">ท่าออกกำลังกาย</label>
                                        <select value={ex.exercise_id} onChange={e => updateExercise(idx, 'exercise_id', e.target.value)} className={inputClass}>
                                            {allExercises.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-24">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">เซ็ต</label>
                                        <input type="number" min="1" value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} className={inputClass} />
                                    </div>
                                    <div className="w-full md:w-24">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">ครั้ง</label>
                                        <input type="number" min="0" value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} className={inputClass} />
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">น้ำหนัก (kg)</label>
                                        <input type="number" step="0.5" min="0" value={ex.weight} onChange={e => updateExercise(idx, 'weight', e.target.value)} autoFocus={idx === 0} className={inputClass} />
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button type="button" onClick={handleSetComplete}
                                            className="flex-1 md:flex-none px-4 py-2.5 bg-blue-50 dark:bg-indigo-900/40 text-blue-600 dark:text-indigo-400 hover:bg-blue-100 dark:hover:bg-indigo-800/60 rounded-xl text-sm font-bold transition-colors border border-transparent dark:border-indigo-800/50">
                                            ✓ จบเซ็ต
                                        </button>
                                        <button type="button" onClick={() => removeExerciseRow(idx)}
                                            className="px-4 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl text-sm font-bold transition-colors border border-transparent dark:border-red-900/30">
                                            ลบ
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-8 border-t border-gray-100 dark:border-zinc-800">
                    <Link href={routineId ? `/routines/${routineId}` : '/logs'}
                        className="px-6 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-bold rounded-xl transition-colors text-sm">
                        ยกเลิก
                    </Link>
                    <button type="submit" disabled={loading || exercises.length === 0}
                        className="px-8 py-3 bg-green-600 hover:bg-green-700 dark:bg-red-600 dark:hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition-all duration-300 text-sm shadow-green-500/20 dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                        {loading ? '⏳ กำลังบันทึก...' : 'บันทึกสถิติ ✅'}
                    </button>
                </div>
            </form>
        </>
    )
}
