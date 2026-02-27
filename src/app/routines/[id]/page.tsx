import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { RemoveFromRoutineButton } from '../components/RemoveFromRoutineButton'
import { TogglePublicButton } from '../components/TogglePublicButton'
import { ThemeToggle } from '../../components/ThemeToggle'
import { CloneRoutineButton } from '../components/CloneRoutineButton'
import { RoutineHeader } from '../components/RoutineHeader'
import { AddExerciseModalHandler } from './AddExerciseModalHandler' // We will create a client component to wrap the state
import { DraggableExerciseList } from '../components/DraggableExerciseList'

interface Routine {
    id: string
    name: string
    description: string
    user_id: string
    is_public: boolean
}

async function getRoutineDetails(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: routine } = await supabase.from('routines').select('*').eq('id', id).single()
    if (!routine) return { routine: null, exercises: null, isOwner: false }

    const isOwner = user ? user.id === routine.user_id : false
    if (!isOwner && !routine.is_public) return { routine: null, exercises: null, isOwner: false }

    const { data: routineExercises } = await supabase
        .from('routine_exercises')
        .select(`order_index, exercise_id, exercises ( id, name, muscle_group, type )`)
        .eq('routine_id', id)
        .order('order_index', { ascending: true })

    const exercises = routineExercises?.map(re => ({
        ...Array.isArray(re.exercises) ? re.exercises[0] : re.exercises,
        order_index: re.order_index
    }))

    const { data: allExercises } = await supabase
        .from('exercises')
        .select('id, name, muscle_group, type')
        .order('name', { ascending: true })

    return { routine: routine as Routine, exercises, allExercises: allExercises || [], isOwner, isLoggedIn: !!user }
}

export default async function RoutineDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { routine, exercises, allExercises, isOwner, isLoggedIn } = await getRoutineDetails(id)
    if (!routine) notFound()

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/routines" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 transition-all group bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        กลับไปยังตารางฝึกของฉัน
                    </Link>
                    <ThemeToggle />
                </div>

                <RoutineHeader routine={routine} isOwner={isOwner} />

                <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800 gap-4">
                        <h2 className="text-xl font-black text-gray-800 dark:text-zinc-100 tracking-tight">
                            ท่าออกกำลังกายในตาราง ({exercises?.length || 0})
                        </h2>
                        <div className="flex gap-3">
                            {isOwner && (
                                <AddExerciseModalHandler
                                    routineId={routine.id}
                                    allExercises={allExercises}
                                    existingExerciseIds={exercises ? exercises.map((ex: any) => ex.id) : []}
                                />
                            )}
                            {isOwner && exercises && exercises.length > 0 && (
                                <Link href={`/logs/new?routine_id=${routine.id}`} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
                                    💪 เริ่มฝึก
                                </Link>
                            )}
                        </div>
                    </div>

                    {!exercises || exercises.length === 0 ? (
                        <div className="bg-gray-50/50 dark:bg-zinc-950/30 p-12 rounded-2xl text-center border-2 border-dashed border-gray-300 dark:border-zinc-800">
                            <p className="text-gray-500 dark:text-zinc-500 mb-4 font-medium">ยังไม่ได้เพิ่มท่าออกกำลังกายในตารางนี้</p>
                            {isOwner && (
                                <div className="text-blue-600 dark:text-red-400 font-bold">
                                    คลิกปุ่ม "+ เพิ่มท่า" ด้านบนเพื่อเลือกท่าเข้าตาราง
                                </div>
                            )}
                        </div>
                    ) : (
                        <DraggableExerciseList
                            initialExercises={exercises as any}
                            routineId={routine.id}
                            isOwner={isOwner}
                        />
                    )}
                </div>

                {/* Share / Copy Section */}
                <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                    {isOwner ? (
                        <>
                            <h3 className="text-lg font-black text-gray-800 dark:text-zinc-100 mb-2 flex items-center gap-2">
                                <span>🔗</span> แชร์ตารางฝึกนี้
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6 font-medium">
                                ทำให้ตารางเป็น Public เพื่อแชร์ URL ให้คนอื่นดูและ Clone ได้
                            </p>
                            <TogglePublicButton routineId={routine.id} isPublic={routine.is_public} />

                            {routine.is_public && (
                                <div className="mt-4 p-4 bg-gray-50 dark:bg-zinc-950/50 rounded-xl border border-gray-100 dark:border-zinc-800">
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 font-bold uppercase tracking-wider">Public Link</p>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/routines/${routine.id}`}
                                            className="flex-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 mb-3 tracking-tight">💡 ถูกใจตารางฝึกนี้ไหม?</h3>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-8 font-medium max-w-md mx-auto">คุณสามารถคัดลอกตารางนี้ลงในบัญชีของคุณเพื่อนำไปใช้และปรับแต่งต่อได้</p>
                            <CloneRoutineButton routineId={routine.id} isLoggedIn={isLoggedIn!} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
