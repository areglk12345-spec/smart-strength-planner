import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export async function getWorkoutDates(year: number, month: number): Promise<string[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const start = `${year}-${String(month).padStart(2, '0')}-01`
    const endMonth = month === 12 ? 1 : month + 1
    const endYear = month === 12 ? year + 1 : year
    const end = `${endYear}-${String(endMonth).padStart(2, '0')}-01`

    const { data } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', user.id)
        .gte('date', start)
        .lt('date', end)

    return [...new Set(data?.map(d => d.date) ?? [])]
}

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ y?: string; m?: string }>
}) {
    const params = await searchParams
    const now = new Date()
    const year = Number(params.y) || now.getFullYear()
    const month = Number(params.m) || now.getMonth() + 1

    const workoutDates = await getWorkoutDates(year, month)
    const workoutSet = new Set(workoutDates)

    // Build calendar grid
    const firstDay = new Date(year, month - 1, 1)
    const daysInMonth = new Date(year, month, 0).getDate()
    const startDow = firstDay.getDay() // 0=Sun

    const today = now.toISOString().split('T')[0]
    const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    const DAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

    // Prev / next
    const prevMonth = month === 1 ? 12 : month - 1
    const prevYear = month === 1 ? year - 1 : year
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year

    const cells: (number | null)[] = [
        ...Array(startDow).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ]
    while (cells.length % 7 !== 0) cells.push(null)

    const totalWorkouts = workoutDates.length

    return (
        <main className="min-h-screen bg-mesh px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                    <div>
                        <Link href="/" className="text-sm text-blue-500 hover:underline mb-1 block">← กลับหน้าหลัก</Link>
                        <h1 className="text-3xl font-black gradient-text">📅 ปฏิทินการฝึก</h1>
                    </div>
                    <div className="glass-card px-4 py-2 text-center">
                        <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{totalWorkouts}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">เซสชันเดือนนี้</div>
                    </div>
                </div>

                {/* Month nav */}
                <div className="glass-card p-4 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-4">
                        <Link href={`/calendar?y=${prevYear}&m=${prevMonth}`}
                            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 font-bold transition text-lg">
                            ‹
                        </Link>
                        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">
                            {THAI_MONTHS[month - 1]} {year + 543}
                        </h2>
                        <Link href={`/calendar?y=${nextYear}&m=${nextMonth}`}
                            className="p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 font-bold transition text-lg">
                            ›
                        </Link>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 mb-2">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 py-1">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-1">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />

                            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                            const isWorkout = workoutSet.has(dateStr)
                            const isToday = dateStr === today

                            return (
                                <div key={dateStr}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-semibold transition-all
                                        ${isWorkout
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/30 scale-105'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        }
                                        ${isToday && !isWorkout ? 'ring-2 ring-blue-400 dark:ring-blue-500' : ''}
                                        ${isToday && isWorkout ? 'ring-2 ring-white/50' : ''}
                                    `}
                                >
                                    {day}
                                    {isWorkout && <div className="w-1 h-1 rounded-full bg-white/70 mt-0.5" />}
                                </div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-md bg-gradient-to-br from-blue-500 to-purple-600" />
                            วันที่ออกกำลังกาย
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-md ring-2 ring-blue-400" />
                            วันนี้
                        </div>
                    </div>
                </div>

                {/* Workout list this month */}
                {workoutDates.length > 0 && (
                    <div className="glass-card p-4 mt-4 animate-fade-in-up">
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-3 text-sm">
                            วันที่ฝึกเดือนนี้
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {workoutDates.sort().map(d => (
                                <span key={d} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                                    {new Date(d).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-4 flex gap-3">
                    <Link href="/logs" className="btn-primary w-full text-center py-3 text-sm rounded-xl">
                        📝 ดูประวัติการฝึกทั้งหมด
                    </Link>
                </div>
            </div>
        </main>
    )
}
