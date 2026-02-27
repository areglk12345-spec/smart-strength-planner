import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { EmptyState } from '../components/EmptyState'

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
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-zinc-100">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                    <div>
                        <Link href="/" className="text-sm font-bold text-blue-600 dark:text-red-400 hover:underline mb-2 block transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-white/50 hover:dark:bg-zinc-900/50">← กลับหน้าหลัก</Link>
                        <h1 className="text-4xl font-black gradient-text tracking-tight uppercase italic drop-shadow-sm">📅 ปฏิทินการฝึก</h1>
                    </div>
                    <div className="bg-white/70 dark:bg-zinc-900 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md px-5 py-2.5 rounded-2xl text-center">
                        <div className="text-3xl font-black text-blue-600 dark:text-red-500 drop-shadow-sm">{totalWorkouts}</div>
                        <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide mt-0.5">เซสชันเดือนนี้</div>
                    </div>
                </div>

                {/* Month nav */}
                <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md animate-fade-in-up">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                        <Link href={`/calendar?y=${prevYear}&m=${prevMonth}`}
                            className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-red-950/30 text-blue-600 dark:text-red-400 font-black transition-all text-xl shadow-sm border border-transparent dark:hover:border-red-900/30">
                            ‹
                        </Link>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
                            {THAI_MONTHS[month - 1]} {year + 543}
                        </h2>
                        <Link href={`/calendar?y=${nextYear}&m=${nextMonth}`}
                            className="p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-red-950/30 text-blue-600 dark:text-red-400 font-black transition-all text-xl shadow-sm border border-transparent dark:hover:border-red-900/30">
                            ›
                        </Link>
                    </div>

                    {/* Day labels */}
                    <div className="grid grid-cols-7 mb-3">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-xs font-black text-gray-400 dark:text-zinc-500 py-2 uppercase tracking-wider">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-2">
                        {cells.map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} />

                            const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                            const isWorkout = workoutSet.has(dateStr)
                            const isToday = dateStr === today

                            return (
                                <div key={dateStr}
                                    className={`
                                        aspect-square flex flex-col items-center justify-center rounded-2xl text-sm sm:text-base font-black transition-all duration-300 relative
                                        ${isWorkout
                                            ? 'bg-gradient-to-br from-blue-500 to-purple-600 dark:from-red-600 dark:to-red-800 text-white shadow-md shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(220,38,38,0.3)] scale-105 border-transparent'
                                            : 'text-gray-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 shadow-sm border border-transparent dark:border-zinc-800/50'
                                        }
                                        ${isToday && !isWorkout ? 'ring-2 ring-blue-400 dark:ring-red-500' : ''}
                                        ${isToday && isWorkout ? 'ring-2 ring-white/50 dark:ring-red-300' : ''}
                                    `}
                                >
                                    <span className="relative z-10">{day}</span>
                                    {isWorkout && <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm z-10" />}
                                    {isWorkout && <div className="absolute inset-0 bg-white/20 dark:bg-black/20 rounded-2xl animate-[shimmer_3s_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}></div>}
                                </div>
                            )
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-5 mt-6 pt-5 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500 dark:text-zinc-400">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-red-600 dark:to-red-800 shadow-sm" />
                            วันที่ออกกำลังกาย
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-lg ring-2 ring-blue-400 dark:ring-red-500 bg-white dark:bg-zinc-900" />
                            วันนี้
                        </div>
                    </div>
                </div>

                {/* Workout list this month */}
                {workoutDates.length > 0 ? (
                    <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-6 mt-6 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md animate-fade-in-up">
                        <h3 className="font-black text-gray-800 dark:text-zinc-100 mb-4 text-base tracking-tight flex items-center gap-2">
                            <span>📅</span> วันที่ฝึกเดือนนี้
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                            {workoutDates.sort().map(d => (
                                <span key={d} className="px-4 py-1.5 bg-blue-50 dark:bg-red-950/40 text-blue-700 dark:text-red-400 border border-blue-100 dark:border-red-900/30 rounded-xl text-xs font-bold shadow-sm">
                                    {new Date(d).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                                </span>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 animate-fade-in-up">
                        <EmptyState
                            icon="😴"
                            title="เดือนนี้ยังไม่ได้ฝึกเลย"
                            description="ร่างกายรอการท้าทายอยู่! เริ่มต้นสร้างวินัยด้วยการฝึกเซสชันแรกของเดือนกัน"
                            actionText="บันทึกการฝึก"
                            actionHref="/logs/new"
                        />
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <Link href="/logs" className="bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold w-full text-center py-4 text-sm rounded-xl transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] tracking-wide">
                        📝 ดูประวัติการฝึกทั้งหมด
                    </Link>
                </div>
            </div>
        </main >
    )
}
