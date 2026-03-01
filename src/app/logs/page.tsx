import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '../components/ThemeToggle'
import { WorkoutLogCard } from './components/WorkoutLogCard'
import { ChevronLeft, ClipboardList, Plus } from 'lucide-react'

interface WorkoutLog {
    id: string
    date: string
    notes: string | null
    routines: { name: string } | null
    workout_log_exercises: {
        exercise_id: string
        sets: number
        reps: number
        weight: number
        exercises: { name: string }
    }[]
}

async function getWorkoutLogs() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data } = await supabase
        .from('workout_logs')
        .select(`id, date, notes, routines ( name ), workout_log_exercises ( exercise_id, sets, reps, weight, exercises ( name ) )`)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
    return data as any as WorkoutLog[]
}

export default async function LogsHistoryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    const logs = await getWorkoutLogs() || []

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black text-blue-600 dark:text-red-500 tracking-tight flex items-center gap-2">ประวัติการฝึกของฉัน</h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 hidden sm:flex items-center gap-1 transition-colors">
                            <ChevronLeft size={14} /> กลับหน้าหลัก
                        </Link>
                        <Link href="/logs/new" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2.5 rounded-xl shadow-sm border border-transparent transition-all shadow-blue-500/20 dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] flex items-center gap-1.5">
                            <Plus size={16} /> บันทึกการฝึกใหม่
                        </Link>
                    </div>
                </div>

                {logs.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border-2 border-dashed border-gray-300 dark:border-zinc-800 text-center shadow-sm">
                        <div className="text-5xl mb-6 text-gray-300 dark:text-zinc-700">
                            <ClipboardList size={48} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-zinc-200 mb-3">ยังไม่มีประวัติการฝึก</h2>
                        <p className="text-gray-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto">เริ่มต้นบันทึกการออกกำลังกายครั้งแรกของคุณเพื่อดูการพัฒนา</p>
                        <Link href="/logs/new" className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            เริ่มบันทึกเลย
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {logs.map(log => (
                            <WorkoutLogCard key={log.id} log={log} />
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
