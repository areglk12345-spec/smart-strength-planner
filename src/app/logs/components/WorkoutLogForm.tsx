'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWorkoutLog } from '@/app/actions/log'
import { PRCelebration } from '@/app/components/PRCelebration'

interface ExerciseType { id: string; name: string }
interface LoggedExercise { exercise_id: string; name: string; sets: number; reps: number; weight: number }

const inputClass = "w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"

export function WorkoutLogForm({ routineId, initialExercises, allExercises }: {
    routineId: string | null; initialExercises: LoggedExercise[]; allExercises: ExerciseType[]
}) {
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState('')
    const [exercises, setExercises] = useState<LoggedExercise[]>(initialExercises)
    const [prs, setPrs] = useState<{ exerciseName: string; weight: number; exerciseId: string }[]>([])
    const router = useRouter()

    const addExerciseRow = () => {
        if (allExercises.length === 0) return
        setExercises([...exercises, { exercise_id: allExercises[0].id, name: allExercises[0].name, sets: 1, reps: 0, weight: 0 }])
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
        if (exercises.length === 0) { alert('กรุณาเพิ่มท่าออกกำลังกายอย่างน้อย 1 ท่า'); return }
        setLoading(true)
        const formData = new FormData()
        formData.append('date', date)
        if (notes) formData.append('notes', notes)
        if (routineId) formData.append('routine_id', routineId)
        formData.append('exercises_json', JSON.stringify(exercises))
        const res = await createWorkoutLog(formData)
        setLoading(false)

        if (res?.error) {
            alert(res.error)
            return
        }

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

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-b border-gray-100 dark:border-gray-700 pb-8">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">วันที่ฝึก (Date)</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">บันทึกเพิ่มเติม <span className="text-gray-400 font-normal">(เลือกได้)</span></label>
                        <input type="text" value={notes} onChange={e => setNotes(e.target.value)} placeholder="รู้สึกยังไงวันนี้..." className={inputClass} />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2"><span>💪</span> ท่าที่ฝึกในวันนี้</h3>
                        <button type="button" onClick={addExerciseRow}
                            className="text-sm bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-md font-medium transition">
                            + เพิ่มท่า
                        </button>
                    </div>

                    {exercises.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400">
                            ยังไม่ได้เลือกท่า กด &quot;+ เพิ่มท่า&quot; เพื่อเริ่มบันทึกสถิติ
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {exercises.map((ex, idx) => (
                                <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                                    <div className="flex-1 w-full">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">ท่าออกกำลังกาย</label>
                                        <select value={ex.exercise_id} onChange={e => updateExercise(idx, 'exercise_id', e.target.value)} className={inputClass}>
                                            {allExercises.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-24">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">เซ็ต</label>
                                        <input type="number" min="1" value={ex.sets} onChange={e => updateExercise(idx, 'sets', e.target.value)} className={inputClass} />
                                    </div>
                                    <div className="w-full md:w-24">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">ครั้ง</label>
                                        <input type="number" min="0" value={ex.reps} onChange={e => updateExercise(idx, 'reps', e.target.value)} className={inputClass} />
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">น้ำหนัก (กิโล)</label>
                                        <input type="number" step="0.5" min="0" value={ex.weight} onChange={e => updateExercise(idx, 'weight', e.target.value)} className={inputClass} />
                                    </div>
                                    <button type="button" onClick={() => removeExerciseRow(idx)}
                                        className="w-full md:w-auto px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded text-sm font-medium transition">
                                        ลบ
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Link href={routineId ? `/routines/${routineId}` : '/logs'}
                        className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition text-sm">
                        ยกเลิก
                    </Link>
                    <button type="submit" disabled={loading || exercises.length === 0}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm transition text-sm shadow-green-500/20">
                        {loading ? '⏳ กำลังบันทึก...' : 'บันทึกสถิติ ✅'}
                    </button>
                </div>
            </form>
        </>
    )
}
