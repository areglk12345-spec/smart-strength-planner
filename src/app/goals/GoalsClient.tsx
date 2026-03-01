'use client'

import { useState } from 'react'
import { createGoal, deleteGoal, updateGoal, upsertBodyGoal } from '../actions/goals'
import { ConfirmModal } from '../components/ConfirmModal'
import { EmptyState } from '../components/EmptyState'
import { Target, Plus, Trash2, Pencil, Save, Trophy, TrendingUp, X, Dumbbell, Loader2, Calendar } from 'lucide-react'

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

interface BodyGoal {
    id: string
    target_body_fat: number | null
    target_waist: number | null
}

export function GoalsClient({ goals, exercises, bodyGoal: initialBodyGoal }: { goals: Goal[]; exercises: Exercise[]; bodyGoal: BodyGoal | null }) {
    const [loading, setLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null)
    const [editingGoalId, setEditingGoalId] = useState<string | null>(null)
    const [bodyGoal, setBodyGoal] = useState<BodyGoal | null>(initialBodyGoal)
    const [showBodyForm, setShowBodyForm] = useState(false)

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
                className="w-full mb-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-red-500 hover:bg-blue-50 dark:hover:bg-red-950/20 rounded-3xl p-6 text-center text-gray-600 dark:text-zinc-400 font-bold transition-all duration-300 group flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-800 group-hover:bg-blue-100 dark:group-hover:bg-red-950/60 text-gray-500 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-red-400 flex items-center justify-center transition-all duration-300 shadow-inner group-hover:scale-110">
                    {showForm ? <X size={24} /> : <Plus size={24} />}
                </div>
                <span className="tracking-wide">{showForm ? 'ยกเลิกการเพิ่ม' : 'เพิ่มเป้าหมายใหม่'}</span>
            </button>

            {/* Create form */}
            {showForm && (
                <form action={handleCreate} className="mb-8 p-6 sm:p-8 bg-white/70 dark:bg-zinc-900 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md animate-fade-in-up">
                    <h3 className="text-2xl font-black mb-6 text-gray-900 dark:text-zinc-100 items-center flex gap-2 tracking-tight">
                        <Target size={28} className="text-blue-600 dark:text-red-500" /> จัดทำเป้าหมายใหม่
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">เลือกท่าออกกำลังกาย <span className="text-red-500">*</span></label>
                            <select name="exercise_id" required className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all shadow-sm">
                                <option value="">-- เลือกท่า --</option>
                                {exercises.map(ex => (
                                    <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscle_group})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">น้ำหนักเป้าหมาย (kg) <span className="text-red-500">*</span></label>
                                <input name="target_weight" type="number" step="0.5" placeholder="ตัวอย่าง: 100" required className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 outline-none transition-all shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">จะทำให้ได้ภายในวันที่ (ไม่บังคับ)</label>
                                <input name="target_date" type="date" className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 outline-none transition-all shadow-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-zinc-300 mb-1.5">โน้ตเพิ่มเติม (ไม่บังคับ)</label>
                            <textarea name="notes" rows={2} placeholder="เช่น ต้องยกให้ได้ 5 ครั้ง..." className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-950/50 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-600 outline-none transition-all shadow-sm" />
                        </div>
                        <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
                            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 rounded-xl text-gray-600 dark:text-zinc-300 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors w-full sm:w-auto text-center">ยกเลิก</button>
                            <button type="submit" disabled={loading} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold shadow-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] transition-all duration-300 disabled:opacity-50 w-full sm:w-auto text-center">
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
                        icon={<Target size={48} />}
                        title="ยังไม่มีเป้าหมายการฝึก"
                        description="ตั้งเป้าหมายน้ำหนักของท่าที่คุณอยากไปให้ถึง แล้วเราจะคำนวณความคืบหน้าให้คุณจากสถิติที่คุณบันทึก!"
                        actionText="เพิ่มเป้าหมายแรก"
                        actionHref="#" // handled by onClick of the button above mostly, or just visual
                    />
                </div>
            ) : (
                <div className="space-y-5 stagger">
                    {goals.map(goal => {
                        const progress = goal.currentBest > 0
                            ? Math.min(100, Math.round((goal.currentBest / goal.target_weight) * 100))
                            : 0
                        const achieved = goal.currentBest >= goal.target_weight

                        return (
                            <div key={goal.id} className={`animate-fade-in-up bg-white/70 dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-md border backdrop-blur-md transition-all ${achieved ? 'border-green-500/50 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/10' : 'border-white/40 dark:border-zinc-800'}`}>
                                <div className="flex items-start justify-between gap-4 mb-4 relative group">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {achieved && <Trophy size={20} className="text-yellow-500 dark:text-yellow-400 drop-shadow-sm" />}
                                            <h3 className="font-black text-xl text-gray-900 dark:text-zinc-100 tracking-tight">
                                                {goal.exercises?.name ?? 'ไม่ทราบท่า'}
                                            </h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 dark:text-zinc-400 mt-1 uppercase tracking-wide">
                                            {goal.exercises?.muscle_group}
                                            {goal.target_date && (
                                                <span className="flex items-center gap-1 inline-flex ml-2">
                                                    • <Calendar size={12} /> {new Date(goal.target_date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                </span>
                                            )}
                                        </p>
                                        {goal.notes && <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 font-medium bg-gray-50 dark:bg-zinc-950/50 px-3 py-2 rounded-xl border border-gray-100 dark:border-zinc-800">"{goal.notes}"</p>}
                                    </div>
                                    <div className="flex gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditingGoalId(goal.id)}
                                            className="text-gray-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-red-400 transition-colors text-sm p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-red-950/30">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => setGoalToDelete(goal.id)}
                                            className="text-gray-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-950/30">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {editingGoalId === goal.id ? (
                                    <form action={(fd) => handleUpdate(goal.id, fd)} className="mt-5 p-5 bg-gray-50/50 dark:bg-zinc-950/50 rounded-2xl border border-gray-200 dark:border-zinc-800 animate-fade-in-up">
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">เป้าหมายใหม่ (kg)</label>
                                                    <input name="target_weight" type="number" step="0.5" required defaultValue={goal.target_weight}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-900 text-sm font-bold text-gray-900 dark:text-zinc-100 outline-none transition-all shadow-sm" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">ถึงวันที่ (ไม่บังคับ)</label>
                                                    <input name="target_date" type="date" defaultValue={goal.target_date || ''}
                                                        className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-900 text-sm font-bold text-gray-900 dark:text-zinc-100 outline-none transition-all shadow-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">โน้ตเพิ่มเติม (ไม่บังคับ)</label>
                                                <textarea name="notes" rows={2} defaultValue={goal.notes || ''}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500/50 dark:focus:border-red-500 bg-white dark:bg-zinc-900 text-sm font-medium text-gray-900 dark:text-zinc-100 outline-none transition-all shadow-sm resize-y" />
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                                                <button type="button" onClick={() => setEditingGoalId(null)}
                                                    className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-zinc-300 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-xl transition-colors">
                                                    ยกเลิก
                                                </button>
                                                <button type="submit" disabled={loading}
                                                    className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5">
                                                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                                    บันทึก
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-wide">
                                            <span className="text-gray-500 dark:text-zinc-400">
                                                ปัจจุบัน: <span className="text-blue-600 dark:text-red-400 text-sm ml-1">{goal.currentBest} kg</span>
                                            </span>
                                            <span className="text-gray-500 dark:text-zinc-400">
                                                เป้า: <span className="text-purple-600 dark:text-rose-400 text-sm ml-1">{goal.target_weight} kg</span>
                                            </span>
                                        </div>
                                        <div className="h-4 bg-gray-100 dark:bg-zinc-950/50 rounded-full overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-inner">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${achieved
                                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 dark:from-red-600 dark:to-rose-800'
                                                    }`}
                                                style={{ width: `${progress}%` }}
                                            >
                                                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}></div>
                                            </div>
                                        </div>
                                        <div className="text-right text-xs font-black mt-2 tracking-wide" style={{ color: achieved ? '#10b981' : 'inherit' }}>
                                            {achieved ? '✓ เป้าหมายสำเร็จ!' : <span className="text-blue-600 dark:text-red-400">{progress}%</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── Body Composition Goals ─────────────────────────────────── */}
            <div className="mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-gray-800 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                        <Dumbbell size={24} className="text-gray-600 dark:text-zinc-400" /> เป้าหมายสัดส่วนร่างกาย
                    </h2>
                    <button
                        onClick={() => setShowBodyForm(v => !v)}
                        className="text-sm font-bold text-blue-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                        {showBodyForm ? <X size={14} /> : (bodyGoal ? <Pencil size={14} /> : <Plus size={14} />)}
                        {showBodyForm ? 'ยกเลิก' : (bodyGoal ? 'แก้ไข' : 'ตั้งเป้าหมาย')}
                    </button>
                </div>

                {/* Current body goal display */}
                {bodyGoal && !showBodyForm && (
                    <div className="bg-white/70 dark:bg-zinc-900 p-5 rounded-2xl border border-white/40 dark:border-zinc-800 shadow-sm flex flex-wrap gap-6">
                        {bodyGoal.target_body_fat && (
                            <div className="text-center">
                                <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{bodyGoal.target_body_fat}%</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mt-1">เป้าหมาย % ไขมัน</div>
                            </div>
                        )}
                        {bodyGoal.target_waist && (
                            <div className="text-center">
                                <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{bodyGoal.target_waist} cm</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mt-1">เป้าหมายรอบเอว</div>
                            </div>
                        )}
                    </div>
                )}

                {!bodyGoal && !showBodyForm && (
                    <div className="bg-white/70 dark:bg-zinc-900 p-8 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 text-center text-gray-500 dark:text-zinc-500 flex flex-col items-center">
                        <Dumbbell size={48} className="mb-2 opacity-20" />
                        <p className="font-semibold text-sm">ยังไม่ได้ตั้งเป้าหมายสัดส่วน กด "ตั้งเป้าหมาย" เพื่อเริ่มต้น</p>
                    </div>
                )}

                {/* Body goal form */}
                {showBodyForm && (
                    <form
                        action={async (fd) => {
                            setLoading(true)
                            const res = await upsertBodyGoal(fd)
                            setLoading(false)
                            if (res?.error) alert(res.error)
                            else setShowBodyForm(false)
                        }}
                        className="bg-white/70 dark:bg-zinc-900 p-6 rounded-2xl border border-white/40 dark:border-zinc-800 shadow-sm space-y-4"
                    >
                        {bodyGoal?.id && <input type="hidden" name="existing_id" value={bodyGoal.id} />}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-widest">% ไขมันเป้าหมาย</label>
                                <input
                                    type="number"
                                    name="target_body_fat"
                                    step="0.1"
                                    placeholder="เช่น 15"
                                    defaultValue={bodyGoal?.target_body_fat ?? ''}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-950/50 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 dark:text-zinc-400 mb-1.5 uppercase tracking-widest">รอบเอวเป้าหมาย (cm)</label>
                                <input
                                    type="number"
                                    name="target_waist"
                                    step="0.1"
                                    placeholder="เช่น 80"
                                    defaultValue={bodyGoal?.target_waist ?? ''}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-950/50 text-gray-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                            <button type="button" onClick={() => setShowBodyForm(false)} className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-xl">ยกเลิก</button>
                            <button type="submit" disabled={loading} className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 rounded-xl disabled:opacity-50 flex items-center gap-1.5">
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
