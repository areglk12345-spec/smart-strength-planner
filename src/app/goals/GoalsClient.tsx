'use client'

import { useState } from 'react'
import { createGoal, deleteGoal, updateGoal } from '../actions/goals'
import { ConfirmModal } from '../components/ConfirmModal'
import { EmptyState } from '../components/EmptyState'

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
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null)

    async function handleCreate(formData: FormData) {
        setLoading(true)
        const res = await createGoal(formData)
        setLoading(false)
        if (res?.error) alert(res.error)
        else setShowForm(false)
    }

    async function handleDeleteConfirm() {
        if (!goalToDelete) return
        setLoading(true)
        await deleteGoal(goalToDelete)
        setLoading(false)
        setGoalToDelete(null)
    }

    async function handleUpdate(id: string, formData: FormData) {
        setLoading(true)
        const res = await updateGoal(id, formData)
        setLoading(false)
        if (res?.error) alert(res.error)
        else setEditingGoalId(null)
    }

    return (
        <div>
            <ConfirmModal
                isOpen={!!goalToDelete}
                title="ลบเป้าหมายการฝึก"
                message="คุณแน่ใจหรือไม่ที่จะลบเป้าหมายนี้? ประวัติเป้าหมายจะหายไปอย่างถาวร"
                confirmText="ลบเป้าหมาย"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setGoalToDelete(null)}
                isLoading={loading}
                variant="danger"
            />

            {/* Add Goal Button */}
            <button
                onClick={() => setShowForm(v => !v)}
                className="w-full mb-6 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700/80 dark:hover:border-blue-500 rounded-xl p-4 text-center text-gray-600 dark:text-gray-300 font-semibold transition group flex flex-col items-center justify-center gap-2"
            >
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center justify-center transition">
                    ➕
                </div>
                <span>{showForm ? 'ยกเลิกการเพิ่ม' : 'เพิ่มเป้าหมายใหม่'}</span>
            </button>

            {/* Create form */}
            {showForm && (
                <form action={handleCreate} className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 animate-fade-in-up">
                    <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 items-center flex gap-2">🎯 จัดทำเป้าหมายใหม่</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">เลือกท่าออกกำลังกาย <span className="text-red-500">*</span></label>
                            <select name="exercise_id" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none">
                                <option value="">-- เลือกท่า --</option>
                                {exercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">น้ำหนักเป้าหมาย (kg) <span className="text-red-500">*</span></label>
                                <input name="target_weight" type="number" step="0.5" placeholder="ตัวอย่าง: 100" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">จะทำให้ได้ภายในวันที่ (ไม่บังคับ)</label>
                                <input name="target_date" type="date" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">โน้ตเพิ่มเติม (ไม่บังคับ)</label>
                            <textarea name="notes" rows={2} placeholder="เช่น ต้องยกให้ได้ 5 ครั้ง..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 outline-none" />
                        </div>
                        <div className="pt-2 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition">ยกเลิก</button>
                            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition disabled:opacity-50">
                                {loading ? 'กำลังบันทึก...' : 'บันทึกเป้าหมาย'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* List */}
            {goals.length === 0 ? (
                <div className="mt-6">
                    <EmptyState
                        icon="🎯"
                        title="ยังไม่มีเป้าหมายการฝึก"
                        description="ตั้งเป้าหมายน้ำหนักของท่าที่คุณอยากไปให้ถึง แล้วเราจะคำนวณความคืบหน้าให้คุณจากสถิติที่คุณบันทึก!"
                        actionText="เพิ่มเป้าหมายแรก"
                        actionHref="#" // handled by onClick of the button above mostly, or just visual
                    />
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
                                <div className="flex items-start justify-between gap-3 mb-3 relative group">
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
                                    <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingGoalId(goal.id)}
                                            className="text-gray-400 hover:text-blue-500 transition text-sm p-1.5 rounded bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/40">
                                            ✏️
                                        </button>
                                        <button onClick={() => setGoalToDelete(goal.id)}
                                            className="text-gray-400 hover:text-red-500 transition text-sm p-1.5 rounded bg-gray-50 dark:bg-gray-700/50 hover:bg-red-50 dark:hover:bg-red-900/40">
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                {editingGoalId === goal.id ? (
                                    <form action={(fd) => handleUpdate(goal.id, fd)} className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 animate-fade-in-up">
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">เป้าหมายใหม่ (kg)</label>
                                                    <input name="target_weight" type="number" step="0.5" required defaultValue={goal.target_weight}
                                                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-sm outline-none" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">ถึงวันที่ (ไม่บังคับ)</label>
                                                    <input name="target_date" type="date" defaultValue={goal.target_date || ''}
                                                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-sm outline-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">โน้ตเพิ่มเติม (ไม่บังคับ)</label>
                                                <textarea name="notes" rows={2} defaultValue={goal.notes || ''}
                                                    className="w-full px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-sm outline-none" />
                                            </div>
                                            <div className="flex justify-end gap-2 pt-1">
                                                <button type="button" onClick={() => setEditingGoalId(null)}
                                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded transition">
                                                    ยกเลิก
                                                </button>
                                                <button type="submit" disabled={loading}
                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition disabled:opacity-50 flex items-center gap-1">
                                                    💾 บันทึก
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
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
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
