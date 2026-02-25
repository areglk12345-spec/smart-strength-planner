import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { RemoveFromRoutineButton } from '../components/RemoveFromRoutineButton'
import { TogglePublicButton } from '../components/TogglePublicButton'
import { ThemeToggle } from '../../components/ThemeToggle'
import { CloneRoutineButton } from '../components/CloneRoutineButton'

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
    if (!user) return { routine: null, exercises: null }

    const { data: routine } = await supabase.from('routines').select('*').eq('id', id).single()
    if (!routine) return { routine: null, exercises: null, isOwner: false }

    const isOwner = user?.id === routine.user_id
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

    return { routine: routine as Routine, exercises, isOwner }
}

export default async function RoutineDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { routine, exercises, isOwner } = await getRoutineDetails(id)
    if (!routine) notFound()

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/routines" className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition group bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        กลับไปยังตารางฝึกของฉัน
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mt-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">{routine.name}</h1>
                    {routine.description && (
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{routine.description}</p>
                    )}

                    <div className="mt-8">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 gap-3">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                ท่าออกกำลังกายในตาราง ({exercises?.length || 0})
                            </h2>
                            <div className="flex gap-2">
                                <Link href="/" className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 px-4 py-2 rounded-md transition shadow-sm">
                                    + เพิ่มท่า
                                </Link>
                                {isOwner && exercises && exercises.length > 0 && (
                                    <Link href={`/logs/new?routine_id=${routine.id}`} className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition shadow-sm flex items-center shadow-blue-500/30">
                                        💪 เริ่มฝึกตามตารางนี้
                                    </Link>
                                )}
                            </div>
                        </div>

                        {!exercises || exercises.length === 0 ? (
                            <div className="bg-gray-50 dark:bg-gray-700 p-8 rounded-lg text-center border border-dashed border-gray-300 dark:border-gray-600">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">ยังไม่ได้เพิ่มท่าออกกำลังกายในตารางนี้</p>
                                {isOwner && (
                                    <Link href="/" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                        ไปที่หน้าแรกเพื่อเลือกท่า
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {exercises.map((ex: any, idx: number) => (
                                    <li key={ex.id} className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold w-8 h-8 rounded-full flex items-center justify-center text-sm">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <Link href={`/exercises/${ex.id}`} className="font-bold text-lg text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                                    {ex.name}
                                                </Link>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{ex.muscle_group}</span>
                                                    <span className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">{ex.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {isOwner && <RemoveFromRoutineButton routineId={routine.id} exerciseId={ex.id} />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Share / Copy Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    {isOwner ? (
                        <>
                            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1 flex items-center gap-2">
                                <span>🔗</span> แชร์ตารางฝึกนี้
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                ทำให้ตารางเป็น Public เพื่อแชร์ URL ให้คนอื่นดูและ Clone ได้
                            </p>
                            <TogglePublicButton routineId={routine.id} isPublic={routine.is_public} />
                        </>
                    ) : (
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">💡 ถูกใจตารางฝึกนี้ไหม?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">คุณสามารถคัดลอกตารางนี้ลงในบัญชีของคุณเพื่อนำไปใช้และปรับแต่งต่อได้</p>
                            <CloneRoutineButton routineId={routine.id} isLoggedIn={true} />
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
