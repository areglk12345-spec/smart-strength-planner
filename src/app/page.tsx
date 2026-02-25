import { createClient } from '@/utils/supabase/server'
import { logout } from './login/actions'
import { AddExerciseForm } from './components/AddExerciseForm'
import { ExerciseList } from './components/ExerciseList'
import { DashboardStats } from './components/DashboardStats'
import { ThemeToggle } from './components/ThemeToggle'
import { StreakWidget } from './components/StreakWidget'
import { getUserStreak } from './actions/log'
import Link from 'next/link'

// สร้าง Interface กำหนดหน้าตาของข้อมูล (Type)
interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
    type: string;
    description: string;
}

// ฟังก์ชันสำหรับดึงข้อมูลจากตาราง exercises
async function getExercises() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('id', { ascending: true })

    if (error) {
        console.error('Error fetching exercises:', error)
        return []
    }

    return data as Exercise[]
}

export default async function Home() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const exercises = await getExercises()

    let totalRoutines = 0
    let latestRoutineName = null

    if (user) {
        const { data: routines } = await supabase
            .from('routines')
            .select('name')
            .order('created_at', { ascending: false })

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
        if (count > maxCount) {
            maxCount = count
            topMuscleGroup = group
        }
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        Smart Strength Planner 💪
                    </h1>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        {user ? (
                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto whitespace-nowrap">
                                <Link href="/profile" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition border-r pr-4 border-gray-200 dark:border-gray-600">
                                    โปรไฟล์
                                </Link>
                                <Link href="/logs" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition border-r pr-4 border-gray-200 dark:border-gray-600">
                                    ประวัติการฝึก
                                </Link>
                                <Link href="/progress" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition border-r pr-4 border-gray-200 dark:border-gray-600">
                                    📊 พัฒนาการ
                                </Link>
                                <Link href="/routines" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition border-r pr-4 border-gray-200 dark:border-gray-600">
                                    ตารางฝึกของฉัน
                                </Link>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    สวัสดี, {user.email}
                                </span>
                                <form action={logout}>
                                    <button type="submit" className="text-sm font-semibold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition">
                                        ออกจากระบบ
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition">
                                เข้าสู่ระบบ
                            </Link>
                        )}
                    </div>
                </div>

                {user && (
                    <DashboardStats
                        totalExercises={exercises.length}
                        totalRoutines={totalRoutines}
                        topMuscleGroup={topMuscleGroup}
                        latestRoutineName={latestRoutineName}
                    />
                )}

                {user && (
                    <div className="mb-8">
                        <StreakWidget streak={streak} />
                    </div>
                )}

                {user && <AddExerciseForm />}

                <ExerciseList initialExercises={exercises} userId={user?.id} />
            </div>
        </main>
    )
}