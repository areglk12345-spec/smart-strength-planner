import { createClient } from '@/utils/supabase/server'
import { logout } from './login/actions'
import { AddExerciseForm } from './components/AddExerciseForm'
import { ExerciseList } from './components/ExerciseList'
import { DashboardStats } from './components/DashboardStats'
import { ThemeToggle } from './components/ThemeToggle'
import { StreakWidget } from './components/StreakWidget'
import { getStreak } from './actions/streak'
import { PRTrackerWidget } from './components/PRTrackerWidget'
import { TimelineWidget } from './components/TimelineWidget'
import { getAllPersonalRecords, getRecentActivity } from './actions/log'
import Link from 'next/link'

interface Exercise {
    id: string
    name: string
    muscle_group: string
    type: string
    description: string
    youtube_url: string | null
}

async function getExercises() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('exercises').select('*').order('id', { ascending: true })
    if (error) return []
    return data as Exercise[]
}

export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const exercises = await getExercises()

    let totalRoutines = 0
    let latestRoutineName = null

    if (user) {
        const { data: routines } = await supabase.from('routines').select('name').order('created_at', { ascending: false })
        if (routines) {
            totalRoutines = routines.length
            if (routines.length > 0) latestRoutineName = routines[0].name
        }
    }

    const streak = user ? await getStreak(user.id) : { current: 0, best: 0, lastWorkout: null }
    const prs = user ? await getAllPersonalRecords() : []
    const activities = user ? await getRecentActivity(5) : []

    const muscleGroupCounts = exercises.reduce((acc, ex) => {
        acc[ex.muscle_group] = (acc[ex.muscle_group] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    let topMuscleGroup = 'ไม่มีข้อมูล'
    let maxCount = 0
    for (const [group, count] of Object.entries(muscleGroupCounts)) {
        if (count > maxCount) { maxCount = count; topMuscleGroup = group }
    }

    return (
        <main className="min-h-screen bg-mesh text-gray-900 dark:text-zinc-100">
            {/* ── Navigation Bar ── */}
            <header className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0 px-6 py-3 border-b-white/40 dark:border-b-red-500/20">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 dark:from-red-600 dark:to-rose-800 flex items-center justify-center text-white text-sm font-black shadow-sm dark:shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                            💪
                        </div>
                        <span className="font-extrabold text-lg gradient-text hidden sm:block dark:drop-shadow-[0_0_10px_rgba(220,38,38,0.3)]">Strength Planner</span>
                    </div>

                    {/* Nav Links */}
                    {user && (
                        <nav className="flex items-center gap-1 overflow-x-auto">
                            {[
                                { href: '/logs', label: 'ประวัติ' },
                                { href: '/progress', label: '📊 พัฒนาการ' },
                                { href: '/routines', label: 'ตารางฝึก' },
                                { href: '/calendar', label: '📅 ปฏิทิน' },
                                { href: '/goals', label: '🎯 เป้าหมาย' },
                                { href: '/community', label: '🌍 คอมมูนิตี้' },
                                { href: '/leaderboard', label: '🏆 Leaderboard' },
                                { href: '/body', label: '💪 Body' },
                                { href: '/profile', label: 'โปรไฟล์' },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="text-xs font-semibold text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-red-950/40 transition-colors whitespace-nowrap">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    )}

                    {/* Right side */}
                    <div className="flex items-center gap-2 shrink-0">
                        <ThemeToggle />
                        {user ? (
                            <form action={logout}>
                                <button type="submit" className="text-xs font-semibold text-gray-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors">
                                    ออก
                                </button>
                            </form>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.3)]">เข้าสู่ระบบ</Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* ── Hero ── */}
                <div className="mb-8 animate-fade-in-up relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-zinc-900 dark:to-black border border-white/40 dark:border-red-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(220,38,38,0.1)] backdrop-blur-md overflow-hidden">
                    {/* Decorative Mesh Bloom */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 dark:bg-red-600/20 rounded-full blur-[80px] dark:blur-[100px] pointer-events-none dark:-top-32 dark:-right-32 dark:w-80 dark:h-80"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 dark:bg-red-900/30 rounded-full blur-[80px] dark:blur-[100px] pointer-events-none dark:-bottom-32 dark:-left-32 dark:w-80 dark:h-80"></div>

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            {user ? (
                                <p className="text-blue-600 dark:text-red-500 text-sm font-semibold dark:font-bold mb-2 flex items-center gap-2 dark:uppercase dark:tracking-wider">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 dark:bg-red-500 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 dark:bg-red-600"></span>
                                    </span>
                                    <span className="dark:hidden">ยินดีต้อนรับกลับมา, </span><span className="hidden dark:inline">Welcome back, </span>{user.email?.split('@')[0]}
                                </p>
                            ) : null}
                            <h1 className="text-4xl sm:text-5xl font-black mb-2 leading-tight tracking-tight dark:uppercase dark:italic">
                                <span className="text-gray-900 dark:text-zinc-100">Smart </span>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:bg-gradient-to-br dark:from-red-500 dark:to-red-800 dark:drop-shadow-sm">Strength</span>
                            </h1>
                            <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base font-medium">
                                {user ? 'พร้อมที่จะทำลายขีดจำกัดของตัวเองในวันนี้หรือยัง? 🔥' : 'ออกแบบโปรแกรมการฝึกและติดตามความก้าวหน้าของคุณ 💪'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Stats + Streak ── */}
                {user && (
                    <>
                        <DashboardStats
                            totalExercises={exercises.length}
                            totalRoutines={totalRoutines}
                            topMuscleGroup={topMuscleGroup}
                            latestRoutineName={latestRoutineName}
                        />
                        <div className="mb-8 animate-fade-in-up relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StreakWidget streak={streak} />
                            <PRTrackerWidget prs={prs} />
                        </div>
                        <div className="mb-8 animate-fade-in-up relative z-10 w-full">
                            <TimelineWidget activities={activities} />
                        </div>
                    </>
                )}

                {/* ── Quick Actions ── */}
                {user && (
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-10 stagger">
                        {[
                            { href: '/logs/new', icon: '📝', label: 'บันทึกการฝึก', hoverColor: 'hover:border-blue-400 hover:shadow-blue-500/20 hover:text-blue-600' },
                            { href: '/routines', icon: '🗓️', label: 'ตารางฝึก', hoverColor: 'hover:border-emerald-400 hover:shadow-emerald-500/20 hover:text-emerald-600' },
                            { href: '/progress', icon: '📊', label: 'พัฒนาการ', hoverColor: 'hover:border-purple-400 hover:shadow-purple-500/20 hover:text-purple-600' },
                            { href: '/community', icon: '🌍', label: 'คอมมูนิตี้', hoverColor: 'hover:border-teal-400 hover:shadow-teal-500/20 hover:text-teal-600' },
                            { href: '/goals', icon: '🎯', label: 'เป้าหมาย', hoverColor: 'hover:border-rose-400 hover:shadow-rose-500/20 hover:text-rose-600' },
                            { href: '/leaderboard', icon: '🏆', label: 'แข่งกับเพื่อน', hoverColor: 'hover:border-indigo-400 hover:shadow-indigo-500/20 hover:text-indigo-600' },
                        ].map(action => (
                            <Link key={action.href} href={action.href}
                                className={`group animate-fade-in-up bg-white/70 dark:bg-zinc-900 backdrop-blur-sm border-2 border-transparent dark:border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 font-semibold dark:font-bold text-sm text-gray-700 dark:text-zinc-300 shadow-sm dark:shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-red-500/50 dark:hover:shadow-[0_8px_20px_rgba(220,38,38,0.15)] dark:hover:bg-zinc-800/80 ${action.hoverColor}`}>
                                <div className="text-2xl bg-white dark:bg-zinc-950/80 border border-transparent dark:border-zinc-800/50 w-12 h-12 rounded-full flex items-center justify-center shadow-sm dark:shadow-inner group-hover:scale-110 transition-transform duration-300 dark:group-hover:border-red-500/30">
                                    {action.icon}
                                </div>
                                <span className="dark:group-hover:text-red-400 transition-colors flex flex-col items-center">
                                    <span className="dark:hidden">{action.label}</span>
                                    <span className="hidden dark:block uppercase tracking-wide text-xs">{action.label}</span>
                                </span>
                            </Link>
                        ))}
                    </div>
                )}

                {/* ── Add Exercise Form ── */}
                {user && <AddExerciseForm />}

                {/* ── Exercise List ── */}
                <div className="animate-fade-in-up">
                    <ExerciseList initialExercises={exercises} userId={user?.id} />
                </div>
            </div>
        </main>
    )
}