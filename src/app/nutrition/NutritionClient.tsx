'use client'

import { useState, useTransition } from 'react'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import Link from 'next/link'
import { addNutritionLog, deleteNutritionLog } from '@/app/actions/nutrition'
import { useToast } from '@/app/components/Toast'
import { ChevronLeft, Apple, Zap, Plus, Utensils, Trash2, PieChart, BarChart3, Beef, Wheat, Salad, Loader2 } from 'lucide-react'

interface NutritionLog {
    id: string
    meal_name: string
    calories: number
    protein: number
    carbs: number
    fat: number
    date: string
}

export default function NutritionClient({
    initialLogs,
    calorieGoal,
    macroTargets
}: {
    initialLogs: any[],
    calorieGoal: number,
    macroTargets: { protein: number, carbs: number, fat: number }
}) {
    const [logs, setLogs] = useState<NutritionLog[]>(initialLogs)
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    // Form states
    const [mealName, setMealName] = useState('')
    const [calories, setCalories] = useState('')
    const [protein, setProtein] = useState('')
    const [carbs, setCarbs] = useState('')
    const [fat, setFat] = useState('')

    const totals = logs.reduce((acc, curr) => ({
        calories: acc.calories + (curr.calories || 0),
        protein: acc.protein + (curr.protein || 0),
        carbs: acc.carbs + (curr.carbs || 0),
        fat: acc.fat + (curr.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    async function handleAddLog(e: React.FormEvent) {
        e.preventDefault()
        if (!mealName) return

        const formData = new FormData()
        formData.append('meal_name', mealName)
        formData.append('calories', calories || '0')
        formData.append('protein', protein || '0')
        formData.append('carbs', carbs || '0')
        formData.append('fat', fat || '0')

        startTransition(async () => {
            const res = await addNutritionLog(formData)
            if (res.error) {
                toast(res.error, 'error')
            } else {
                toast('บันทึกข้อมูลโภชนาการแล้ว', 'success')
                setMealName('')
                setCalories('')
                setProtein('')
                setCarbs('')
                setFat('')
                // Refresh listing (in a real app we might fetch or use optimistic UI)
                const today = new Date().toISOString().split('T')[0]
                const { getNutritionLogs } = await import('@/app/actions/nutrition')
                const updatedLogs = await getNutritionLogs(today)
                setLogs(updatedLogs)
            }
        })
    }

    async function handleDelete(id: string) {
        if (!confirm('ยืนยันการลบข้อมูล?')) return

        startTransition(async () => {
            const res = await deleteNutritionLog(id)
            if (res.error) {
                toast(res.error, 'error')
            } else {
                setLogs(prev => prev.filter(log => log.id !== id))
                toast('ลบข้อมูลแล้ว', 'success')
            }
        })
    }

    return (
        <main className="min-h-screen bg-mesh text-gray-900 dark:text-zinc-100 px-6 py-8">
            <div className="max-w-4xl mx-auto animate-fade-in-up">

                {/* Header */}
                <div className="flex justify-between items-center mb-10 relative z-10 glass-card p-4 rounded-3xl">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 hover:bg-gray-50 transition-colors">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-black gradient-text uppercase tracking-tight italic flex items-center gap-2">
                            <Apple size={24} className="text-red-500" /> Nutrition Tracking
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                    {/* Left: Summary & Progress */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/70 dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <span className="p-2 bg-orange-100 dark:bg-red-950/30 rounded-lg text-lg flex items-center justify-center">
                                    <BarChart3 size={20} className="text-orange-600 dark:text-red-400" />
                                </span> สรุปวันนี้
                            </h2>

                            <div className="space-y-6">
                                {/* Calories */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-gray-500 dark:text-zinc-400 flex items-center gap-1.5">
                                            <Zap size={14} className="text-orange-500" /> แคลอรี่
                                        </span>
                                        <span className="font-black text-lg">{totals.calories} / {calorieGoal}</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                                            style={{ width: `${Math.min(100, (totals.calories / calorieGoal) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Macros */}
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                                    {/* Protein */}
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-blue-600 dark:text-blue-400 items-center">
                                            <span className="flex items-center gap-1.5"><Beef size={12} /> โปรตีน</span>
                                            <span>{totals.protein.toFixed(1)}g / {macroTargets.protein.toFixed(0)}g</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-500"
                                                style={{ width: `${Math.min(100, (totals.protein / macroTargets.protein) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Carbs */}
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-emerald-600 dark:text-emerald-400 items-center">
                                            <span className="flex items-center gap-1.5"><Wheat size={12} /> คาร์บ</span>
                                            <span>{totals.carbs.toFixed(1)}g / {macroTargets.carbs.toFixed(0)}g</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 transition-all duration-500"
                                                style={{ width: `${Math.min(100, (totals.carbs / macroTargets.carbs) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Fat */}
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1.5 uppercase tracking-wider text-yellow-600 dark:text-yellow-400 items-center">
                                            <span className="flex items-center gap-1.5"><Salad size={12} /> ไขมัน</span>
                                            <span>{totals.fat.toFixed(1)}g / {macroTargets.fat.toFixed(0)}g</span>
                                        </div>
                                        <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500 transition-all duration-500"
                                                style={{ width: `${Math.min(100, (totals.fat / macroTargets.fat) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Logging & List */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Quick Add Form */}
                        <div className="bg-white/70 dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <span className="p-2 bg-blue-100 dark:bg-blue-950/30 rounded-lg text-lg flex items-center justify-center">
                                    <Plus size={20} className="text-blue-600 dark:text-blue-400" />
                                </span> เพิ่มรายการอาหาร
                            </h2>

                            <form onSubmit={handleAddLog} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="ชื่ออาหาร (เช่น อกไก่ย่าง, เวย์โปรตีน)"
                                    className="w-full bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                    value={mealName}
                                    onChange={(e) => setMealName(e.target.value)}
                                    required
                                />

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Calories</label>
                                        <input
                                            type="number"
                                            placeholder="kcal"
                                            className="w-full bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold text-center"
                                            value={calories}
                                            onChange={(e) => setCalories(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Protein (g)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="g"
                                            className="w-full bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-center"
                                            value={protein}
                                            onChange={(e) => setProtein(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Carbs (g)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="g"
                                            className="w-full bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-center"
                                            value={carbs}
                                            onChange={(e) => setCarbs(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Fat (g)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="g"
                                            className="w-full bg-gray-50/50 dark:bg-zinc-950/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-3 focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-bold text-center"
                                            value={fat}
                                            onChange={(e) => setFat(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-gray-900 dark:bg-zinc-100 text-white dark:text-zinc-950 font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg mt-2 disabled:opacity-50 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                                >
                                    {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                                    {isPending ? 'กำลังบันทึก...' : 'บันทึกมื้ออาหาร'}
                                </button>
                            </form>
                        </div>

                        {/* Logs List */}
                        <div className="bg-white/70 dark:bg-zinc-900 p-8 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                                <Utensils size={20} className="text-gray-400" />
                                รายการวันนี้
                            </h2>

                            <div className="space-y-4">
                                {logs.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 italic">
                                        ยังไม่มีการบันทึกอาหารในวันนี้
                                    </div>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log.id} className="group bg-gray-50/50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/80 flex justify-between items-center transition-all hover:border-blue-200 dark:hover:border-red-900/50">
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-zinc-100">{log.meal_name}</h4>
                                                <div className="flex gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500 mt-2">
                                                    <span className="flex items-center gap-1"><Zap size={10} className="text-orange-500" /> {log.calories} kcal</span>
                                                    <span className="flex items-center gap-1"><Beef size={10} className="text-blue-500" /> P: {log.protein}g</span>
                                                    <span className="flex items-center gap-1"><Wheat size={10} className="text-emerald-500" /> C: {log.carbs}g</span>
                                                    <span className="flex items-center gap-1"><Salad size={10} className="text-yellow-500" /> F: {log.fat}g</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(log.id)}
                                                className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
