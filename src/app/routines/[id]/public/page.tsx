import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CloneRoutineButton } from '../../components/CloneRoutineButton'
import { ThemeToggle } from '../../../components/ThemeToggle'

async function getPublicRoutine(id: string) {
    const supabase = await createClient()

    const { data: routine, error } = await supabase
        .from('routines')
        .select('id, name, description, is_public')
        .eq('id', id)
        .eq('is_public', true)
        .single()

    if (error || !routine) return null

    const { data: routineExercises } = await supabase
        .from('routine_exercises')
        .select(`order_index, exercises ( id, name, muscle_group, type )`)
        .eq('routine_id', id)
        .order('order_index', { ascending: true })

    const exercises = routineExercises?.map(re => ({
        ...Array.isArray(re.exercises) ? re.exercises[0] : re.exercises,
        order_index: re.order_index
    })) ?? []

    return { routine, exercises }
}

export default async function PublicRoutinePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const result = await getPublicRoutine(id)
    if (!result) notFound()

    const { routine, exercises } = result

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                        <span>←</span> Smart Strength Planner
                    </Link>
                    <ThemeToggle />
                </div>

                {/* Shared badge */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 px-3 py-1 rounded-full">
                        🌐 ตารางฝึกสาธารณะ
                    </span>
                </div>

                {/* Routine card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                        <h1 className="text-3xl font-extrabold mb-2">{routine.name}</h1>
                        {routine.description && (
                            <p className="text-blue-100 text-sm leading-relaxed">{routine.description}</p>
                        )}
                        <div className="mt-4 text-blue-200 text-sm">
                            {exercises.length} ท่าออกกำลังกาย
                        </div>
                    </div>

                    <div className="p-6">
                        {exercises.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">ตารางนี้ยังไม่มีท่าออกกำลังกาย</p>
                        ) : (
                            <ul className="space-y-3">
                                {exercises.map((ex: any, idx: number) => (
                                    <li key={ex.id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{ex.name}</div>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-medium">
                                                    {ex.muscle_group}
                                                </span>
                                                <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-2 py-0.5 rounded-full font-medium">
                                                    {ex.type}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Clone CTA */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 text-center">
                    <div className="text-2xl mb-2">💪</div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                        ชอบตารางนี้ไหม?
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Clone ไปไว้ในบัญชีของคุณและเริ่มฝึกได้เลย!
                    </p>
                    <CloneRoutineButton routineId={routine.id} isLoggedIn={!!user} />
                </div>
            </div>
        </main>
    )
}
