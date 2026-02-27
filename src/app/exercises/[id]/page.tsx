import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

    const embedUrl = getYouTubeEmbedUrl(exercise.youtube_url)
    const progressData = user ? await getExerciseProgress(id) : []

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <div className="max-w-3xl mx-auto animate-fade-in-up">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/" className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 transition-all group bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        กลับไปยังหน้าหลัก
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mt-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-zinc-800">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">{exercise.name}</h1>
                        <div className="flex gap-3">
                            <span className="bg-blue-50 dark:bg-red-950/50 text-blue-700 dark:text-red-400 px-4 py-1.5 rounded-xl text-xs font-black shadow-sm border border-blue-100 dark:border-red-900/30 tracking-wide">{exercise.muscle_group}</span>
                            <span className="bg-purple-50 dark:bg-rose-950/40 text-purple-700 dark:text-rose-400 px-4 py-1.5 rounded-xl text-xs font-black shadow-sm border border-purple-100 dark:border-rose-900/30 tracking-wide">{exercise.type}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-black text-gray-800 dark:text-zinc-100 mb-4 border-l-4 border-blue-500 dark:border-red-500 pl-3 tracking-tight">รายละเอียดของท่าออกกำลังกาย</h2>
                        <div className="bg-gray-50/50 dark:bg-zinc-950/50 p-6 rounded-2xl text-gray-700 dark:text-zinc-300 font-medium leading-relaxed min-h-[6rem] border border-gray-200 dark:border-zinc-800">
                            {exercise.description || <span className="text-gray-400 dark:text-zinc-500 italic">ไม่มีคำอธิบายสำหรับท่านี้</span>}
                        </div>
                    </div>

                    {embedUrl ? (
                        <div className="mb-8">
                            <h2 className="text-lg font-black text-gray-800 dark:text-zinc-100 mb-4 border-l-4 border-red-500 pl-3 flex items-center gap-2 tracking-tight">
                                <span>▶️</span> วิดีโอสาธิตท่า
                            </h2>
                            <div className="relative rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_4px_20px_rgba(220,38,38,0.1)] border border-gray-200 dark:border-zinc-800" style={{ paddingTop: '56.25%' }}>
                                <iframe src={embedUrl} className="absolute top-0 left-0 w-full h-full"
                                    allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    title={`วิดีโอสาธิต: ${exercise.name}`} />
                            </div>
                        </div>
                    ) : (
                        <div className="mb-8 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl p-10 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-zinc-950/30">
                            <span className="text-4xl mb-4 opacity-80">📸</span>
                            <span className="text-base font-bold text-gray-600 dark:text-zinc-400 mb-1">ยังไม่มีวิดีโอสาธิตสำหรับท่านี้</span>
                            <span className="text-sm text-gray-500 dark:text-zinc-500 font-medium">ผู้สร้างท่าสามารถเพิ่มลิงก์ YouTube ได้ตอนเพิ่มท่า</span>
                        </div>
                    )}

                    {user && (
                        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800">
                            <h2 className="text-lg font-black text-gray-800 dark:text-zinc-100 mb-6 border-l-4 border-blue-500 dark:border-red-500 pl-3 flex items-center gap-2 tracking-tight">
                                <span>📈</span> พัฒนาการของคุณ
                            </h2>
                            <ProgressChart data={progressData} exerciseName={exercise.name} />
                            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                <Link href={`/progress?ex=${exercise.id}`} className="text-sm font-bold text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 hover:underline transition-colors">
                                    ดูกราฟแบบเต็ม →
                                </Link>
                                <Link href="/logs/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]">
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
