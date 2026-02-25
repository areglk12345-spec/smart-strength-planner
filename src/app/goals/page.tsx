import { createClient } from '@/utils/supabase/server'
import { getGoals, getCurrentBestForExercise } from '../actions/goals'
import { GoalsClient } from './GoalsClient'
import Link from 'next/link'

async function getExercises() {
    const supabase = await createClient()
    const { data } = await supabase.from('exercises').select('id, name, muscle_group').order('name')
    return data ?? []
}

export default async function GoalsPage() {
    const [rawGoals, exercises] = await Promise.all([getGoals(), getExercises()])

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
        <main className="min-h-screen bg-mesh px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <Link href="/" className="text-sm text-blue-500 hover:underline mb-1 block">← กลับหน้าหลัก</Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-black gradient-text">🎯 เป้าหมาย</h1>
                        {total > 0 && (
                            <div className="glass-card px-4 py-2 text-center">
                                <div className="text-xl font-extrabold text-green-500">{achieved}/{total}</div>
                                <div className="text-xs text-gray-400">สำเร็จแล้ว</div>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ตั้งเป้าหมายน้ำหนักสำหรับแต่ละท่า แล้วติดตามความก้าวหน้า
                    </p>
                </div>

                <GoalsClient goals={goals} exercises={exercises} />
            </div>
        </main>
    )
}
