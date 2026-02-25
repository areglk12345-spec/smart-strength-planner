import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToRoutineDropdown } from '../components/AddToRoutineDropdown'
import { ThemeToggle } from '../../components/ThemeToggle'
import { ProgressChart } from '../../components/ProgressChart'
import { getExerciseProgress } from '../../actions/log'

function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
    if (!url) return null
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regExp)
    return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : null
}

async function getExerciseById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single()
    if (error || !data) return null
    return data
}

export default async function ExerciseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const exercise = await getExerciseById(id)
    if (!exercise) notFound()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userRoutines: { id: string; name: string }[] = []
    if (user) {
        const { data } = await supabase.from('routines').select('id, name').order('created_at', { ascending: false })
        if (data) userRoutines = data
    }

    const embedUrl = getYouTubeEmbedUrl(exercise.youtube_url)
    const progressData = user ? await getExerciseProgress(id) : []

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition group bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        กลับไปยังหน้าหลัก
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">{exercise.name}</h1>
                        <div className="flex gap-2">
                            <span className="bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-bold shadow-sm">{exercise.muscle_group}</span>
                            <span className="bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-bold shadow-sm">{exercise.type}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-blue-500 pl-3">รายละเอียดของท่าออกกำลังกาย</h2>
                        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-gray-700 dark:text-gray-300 leading-relaxed min-h-24 shadow-inner">
                            {exercise.description || <span className="text-gray-400 italic">ไม่มีคำอธิบายสำหรับท่านี้</span>}
                        </div>
                        {user && (
                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <AddToRoutineDropdown exerciseId={exercise.id} userRoutines={userRoutines} />
                            </div>
                        )}
                    </div>

                    {embedUrl ? (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-l-4 border-red-500 pl-3 flex items-center gap-2">
                                <span>▶️</span> วิดีโอสาธิตท่า
                            </h2>
                            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-600" style={{ paddingTop: '56.25%' }}>
                                <iframe src={embedUrl} className="absolute top-0 left-0 w-full h-full"
                                    allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title={`วิดีโอสาธิต: ${exercise.name}`} />
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-gray-700/50">
                            <span className="text-3xl mb-3">📸</span>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ยังไม่มีวิดีโอสาธิตสำหรับท่านี้</span>
                            <span className="text-xs mt-1">ผู้สร้างท่าสามารถเพิ่มลิงก์ YouTube ได้ตอนเพิ่มท่า</span>
                        </div>
                    )}

                    {user && (
                        <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-l-4 border-blue-500 pl-3 flex items-center gap-2">
                                <span>📈</span> พัฒนาการของคุณ
                            </h2>
                            <ProgressChart data={progressData} exerciseName={exercise.name} />
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Link href={`/progress?ex=${exercise.id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                    ดูกราฟแบบเต็ม →
                                </Link>
                                <Link href="/logs/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition shadow-sm shadow-blue-500/20">
                                    <span>📝</span> บันทึกสถิติวันนี้
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
