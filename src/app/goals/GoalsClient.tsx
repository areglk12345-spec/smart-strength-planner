'use client'

import { useState } from 'react'
import { createGoal, deleteGoal } from '../actions/goals'

interface Exercise {
    id: string
    name: string
    muscle_group: string
}

interface Goal {
    id: string
    target_weight: number
    target_date: string | null
    notes: string | null
    exercise_id: string
    exercises: { id: string; name: string; muscle_group: string } | null
    currentBest: number
}

export function GoalsClient({ goals, exercises }: { goals: Goal[]; exercises: Exercise[] }) {
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)

    async function handleCreate(formData: FormData) {
        setLoading(true)
        const res = await createGoal(formData)
        setLoading(false)
        if (res?.error) alert(res.error)
        else setShowForm(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('ลบเป้าหมายนี้?')) return
        await deleteGoal(id)
    }

    return (
        <div>
            {/* Add Goal Button */}
            <button
                onClick={() => setShowForm(v => !v)}
                className="btn-primary w-full py-3 rounded-xl mb-6 text-sm font-bold"
            >
                {showForm ? '✕ ยกเลิก' : '＋ เพิ่มเป้าหมายใหม่'}
            </button>

            {/* Form */}
            {showForm && (
                <form action={handleCreate} className="glass-card p-5 mb-6 animate-fade-in-up">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4">🎯 ตั้งเป้าหมายใหม่</h3>
                    <div className="grid gap-3">
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">ท่าออกกำลังกาย</label>
                            <select name="exercise_id" required
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                                <option value="">-- เลือกท่า --</option>
                                {exercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">น้ำหนักเป้าหมาย (kg)</label>
                            <input type="number" name="target_weight" step="0.5" min="1" required placeholder="เช่น 100"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">วันเป้าหมาย (ไม่บังคับ)</label>
                            <input type="date" name="target_date"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">หมายเหตุ (ไม่บังคับ)</label>
                            <input type="text" name="notes" placeholder="เช่น ภายในปีนี้!"
                                className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="btn-primary w-full py-2.5 rounded-xl mt-4 text-sm font-bold disabled:opacity-60">
                        {loading ? 'กำลังบันทึก...' : '💾 บันทึกเป้าหมาย'}
                    </button>
                </form>
            )}

            {/* Goals List */}
            {goals.length === 0 ? (
                <div className="glass-card p-8 text-center text-gray-400 dark:text-gray-500">
                    <div className="text-4xl mb-3">🎯</div>
                    <p className="text-sm">ยังไม่มีเป้าหมาย<br />กด "เพิ่มเป้าหมายใหม่" เพื่อเริ่มต้น!</p>
                </div>
            ) : (
                <div className="space-y-4 stagger">
                    {goals.map(goal => {
                        const progress = goal.currentBest > 0
                            ? Math.min(100, Math.round((goal.currentBest / goal.target_weight) * 100))
                            : 0
                        const achieved = goal.currentBest >= goal.target_weight

                        return (
                            <div key={goal.id} className={`animate-fade-in-up glass-card p-5 ${achieved ? 'border-green-500/30 bg-green-500/5' : ''}`}>
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {achieved && <span className="text-green-500 text-lg">✅</span>}
                                            <h3 className="font-extrabold text-gray-800 dark:text-gray-200">
                                                {goal.exercises?.name ?? 'ไม่ทราบท่า'}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                            {goal.exercises?.muscle_group}
                                            {goal.target_date && ` • ถึง ${new Date(goal.target_date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: '2-digit' })}`}
                                        </p>
                                        {goal.notes && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{goal.notes}"</p>}
                                    </div>
                                    <button onClick={() => handleDelete(goal.id)}
                                        className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition text-sm shrink-0 p-1">
                                        🗑️
                                    </button>
                                </div>

                                {/* Progress bar */}
                                <div className="mb-2">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            ปัจจุบัน: <span className="text-blue-600 dark:text-blue-400">{goal.currentBest} kg</span>
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            เป้า: <span className="text-purple-600 dark:text-purple-400">{goal.target_weight} kg</span>
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${achieved
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                                                }`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <div className="text-right text-xs font-extrabold mt-1" style={{ color: achieved ? '#10b981' : '#6366f1' }}>
                                        {achieved ? '🏆 สำเร็จแล้ว!' : `${progress}%`}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
