import { createClient } from '@/utils/supabase/server'
import { getGoals, getCurrentBestForExercise, getBodyGoal } from '../actions/goals'
import { GoalsClient } from './GoalsClient'
import Link from 'next/link'

async function getExercises() {
    const supabase = await createClient()
    const { data } = await supabase.from('exercises').select('id, name, muscle_group').order('name')
    return data ?? []
}

export default async function GoalsPage() {
    const [rawGoals, exercises, bodyGoal] = await Promise.all([getGoals(), getExercises(), getBodyGoal()])

    // Enrich goals with current best weight
    const goals = await Promise.all(
        rawGoals.map(async (g: any) => ({
            ...g,
            currentBest: await getCurrentBestForExercise(g.exercise_id),
        }))
    )

    const achieved = goals.filter((g: any) => g.currentBest >= g.target_weight).length
    const total = goals.length

    return (
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-zinc-100">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <Link href="/" className="text-sm font-bold text-blue-600 dark:text-red-400 hover:underline mb-2 block transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-white/50 hover:dark:bg-zinc-900/50">← กลับหน้าหลัก</Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-black gradient-text tracking-tight uppercase italic">🎯 เป้าหมาย</h1>
                        {total > 0 && (
                            <div className="bg-white/70 dark:bg-zinc-900 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md px-5 py-2.5 rounded-2xl text-center">
                                <div className="text-2xl font-black text-green-600 dark:text-green-500 drop-shadow-sm">{achieved}/{total}</div>
                                <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mt-0.5">สำเร็จแล้ว</div>
                            </div>
                        )}
                    </div>
                    <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-zinc-400 mt-3 max-w-lg">
                        ตั้งเป้าหมายน้ำหนักสำหรับแต่ละท่า แล้วติดตามความก้าวหน้า
                    </p>
                </div>

                <GoalsClient goals={goals} exercises={exercises} bodyGoal={bodyGoal} />
            </div>
        </main>
    )
}
