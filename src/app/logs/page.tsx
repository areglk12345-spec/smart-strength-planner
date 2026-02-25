import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '../components/ThemeToggle'

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
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">ประวัติการฝึกของฉัน 📖</h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 hidden sm:block">
                            ← กลับหน้าหลัก
                        </Link>
                        <Link href="/logs/new" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow-sm border border-transparent transition shadow-blue-500/20">
                            + บันทึกการฝึกใหม่
                        </Link>
                    </div>
                </div>

                {logs.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 p-12 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center shadow-sm">
                        <div className="text-4xl mb-4">📝</div>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">ยังไม่มีประวัติการฝึก</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">เริ่มต้นบันทึกการออกกำลังกายครั้งแรกของคุณเพื่อดูการพัฒนา</p>
                        <Link href="/logs/new" className="inline-block bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                            เริ่มบันทึกเลย
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {logs.map(log => {
                            const dateObj = new Date(log.date)
                            const formattedDate = dateObj.toLocaleDateString('th-TH', {
                                year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
                            })
                            const routineName = Array.isArray(log.routines) ? log.routines[0]?.name : log.routines?.name
                            return (
                                <div key={log.id} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{formattedDate}</h3>
                                            {routineName && (
                                                <div className="inline-block mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full">
                                                    ตาราง: {routineName}
                                                </div>
                                            )}
                                        </div>
                                        {log.notes && (
                                            <div className="mt-3 md:mt-0 text-sm italic text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                                &quot;{log.notes}&quot;
                                            </div>
                                        )}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg border-b dark:border-gray-600">ท่าออกกำลังกาย</th>
                                                    <th className="px-4 py-3 text-center border-b dark:border-gray-600">เซ็ต</th>
                                                    <th className="px-4 py-3 text-center border-b dark:border-gray-600">ครั้ง</th>
                                                    <th className="px-4 py-3 text-right rounded-tr-lg border-b dark:border-gray-600">น้ำหนัก (kg)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {log.workout_log_exercises.map((ex, idx) => {
                                                    const exName = Array.isArray(ex.exercises) ? ex.exercises[0]?.name : ex.exercises?.name
                                                    return (
                                                        <tr key={`${log.id}-${idx}`} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{exName || 'ไม่ทราบชื่อท่า'}</td>
                                                            <td className="px-4 py-3 text-center">{ex.sets}</td>
                                                            <td className="px-4 py-3 text-center">{ex.reps}</td>
                                                            <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">{ex.weight > 0 ? ex.weight : '-'}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}
