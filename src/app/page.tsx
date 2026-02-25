import { createClient } from '@/utils/supabase/server'
import { logout } from './login/actions'
import { AddExerciseForm } from './components/AddExerciseForm'
import { ExerciseList } from './components/ExerciseList'
import { DashboardStats } from './components/DashboardStats'
import { ThemeToggle } from './components/ThemeToggle'
import { StreakWidget } from './components/StreakWidget'
import { getUserStreak } from './actions/log'
import Link from 'next/link'

interface Exercise {
    id: string
    name: string
    muscle_group: string
    type: string
    description: string
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

    const streak = user ? await getUserStreak() : { current: 0, best: 0, lastWorkout: null }

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
        <main className="min-h-screen bg-mesh text-gray-900 dark:text-gray-100">
            {/* ── Navigation Bar ── */}
            <header className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0 px-6 py-3">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-sm">
                            💪
                        </div>
                        <span className="font-extrabold text-lg gradient-text hidden sm:block">Strength Planner</span>
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
                                { href: '/profile', label: 'โปรไฟล์' },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition whitespace-nowrap">
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
                                <button type="submit" className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                                    ออก
                                </button>
                            </form>
                        ) : (
                            <Link href="/login" className="btn-primary text-sm">เข้าสู่ระบบ</Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-6 py-8">
                {/* ── Hero ── */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-4xl sm:text-5xl font-black mb-2 leading-tight">
                        <span className="gradient-text">Smart Strength</span><br />
                        <span className="text-gray-700 dark:text-gray-300 text-3xl sm:text-4xl font-bold">Planner 💪</span>
                    </h1>
                    {user ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            สวัสดี, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.email}</span> — พร้อมฝึกวันนี้ไหม?
                        </p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            ออกแบบโปรแกรมการฝึกและติดตามความก้าวหน้าของคุณ
                        </p>
                    )}
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
                        <div className="mb-8 animate-fade-in-up">
                            <StreakWidget streak={streak} />
                        </div>
                    </>
                )}

                {/* ── Quick Actions ── */}
                {user && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger">
                        {[
                            { href: '/logs/new', icon: '📝', label: 'บันทึกการฝึก', gradient: 'from-blue-600 to-blue-500' },
                            { href: '/routines', icon: '🗓️', label: 'ตารางฝึก', gradient: 'from-emerald-600 to-teal-500' },
                            { href: '/progress', icon: '📊', label: 'พัฒนาการ', gradient: 'from-purple-600 to-violet-500' },
                            { href: '/goals', icon: '🎯', label: 'เป้าหมาย', gradient: 'from-orange-500 to-rose-500' },
                        ].map(action => (
                            <Link key={action.href} href={action.href}
                                className={`animate-fade-in-up bg-gradient-to-br ${action.gradient} text-white rounded-2xl p-4 flex flex-col items-center gap-2 font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                                <span className="text-2xl">{action.icon}</span>
                                {action.label}
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