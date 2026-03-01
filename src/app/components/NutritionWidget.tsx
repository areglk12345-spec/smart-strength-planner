'use client'

import Link from 'next/link'
import { Apple } from 'lucide-react'

interface NutritionSummary {
    calories: number
    protein: number
    carbs: number
    fat: number
}

export function NutritionWidget({
    summary,
    calorieGoal
}: {
    summary: NutritionSummary | null,
    calorieGoal: number
}) {
    const calories = summary?.calories || 0
    const progress = Math.min(100, (calories / calorieGoal) * 100)

    return (
        <Link href="/nutrition" className="group block h-full">
            <div className="h-full bg-white/70 dark:bg-zinc-900 p-6 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:hover:border-red-500/30">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black flex items-center gap-2">
                        <div className="p-2 bg-orange-100 dark:bg-red-950/30 rounded-lg group-hover:scale-110 transition-transform text-orange-600 dark:text-red-500">
                            <Apple size={20} fill="currentColor" />
                        </div>
                        <span className="dark:uppercase dark:tracking-wider">Nutrition</span>
                    </h3>
                    <div className="text-right">
                        <div className="text-2xl font-black text-gray-900 dark:text-zinc-100">{calories.toLocaleString()}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">kcal today</div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-end text-xs font-bold text-gray-500 dark:text-zinc-400 mb-1">
                        <span>เป้าหมาย {calorieGoal.toLocaleString()} kcal</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner p-1">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-rose-600 rounded-full transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            {progress > 10 && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-gray-50/50 dark:bg-zinc-950/50 p-2 rounded-xl border border-gray-100 dark:border-zinc-800/80 text-center">
                            <div className="text-[10px] font-black text-blue-500 uppercase">Pro</div>
                            <div className="text-xs font-bold dark:text-zinc-300">{summary?.protein?.toFixed(0) || 0}g</div>
                        </div>
                        <div className="bg-gray-50/50 dark:bg-zinc-950/50 p-2 rounded-xl border border-gray-100 dark:border-zinc-800/80 text-center">
                            <div className="text-[10px] font-black text-emerald-500 uppercase">Carb</div>
                            <div className="text-xs font-bold dark:text-zinc-300">{summary?.carbs?.toFixed(0) || 0}g</div>
                        </div>
                        <div className="bg-gray-50/50 dark:bg-zinc-950/50 p-2 rounded-xl border border-gray-100 dark:border-zinc-800/80 text-center">
                            <div className="text-[10px] font-black text-yellow-500 uppercase">Fat</div>
                            <div className="text-xs font-bold dark:text-zinc-300">{summary?.fat?.toFixed(0) || 0}g</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
