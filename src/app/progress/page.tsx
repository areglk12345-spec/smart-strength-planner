import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '../components/ThemeToggle'
import { getAllExercisesWithProgress, getExerciseProgress, getAllPersonalRecords, getVolumeStats, getMuscleSetCounts } from '../actions/log'
import { ProgressChart } from '../components/ProgressChart'
import { VolumeChart } from '../components/VolumeChart'
import { MuscleHeatmap } from '../components/MuscleHeatmap'
import { MuscleVolumeChart } from '../components/MuscleVolumeChart'
import { EmptyState } from '../components/EmptyState'
import { LineChart, Trophy, Weight, TrendingUp, Grid3X3, BarChart2, Layout, ChevronLeft, ArrowRight, ArrowLeft, Dumbbell } from 'lucide-react'

const TABS = [
    { key: 'chart', label: 'กราฟ', icon: <LineChart size={16} />, activeColor: 'bg-blue-600 dark:bg-red-600 text-white shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(220,38,38,0.3)]' },
    { key: 'prs', label: 'PRs', icon: <Trophy size={16} />, activeColor: 'bg-yellow-500 dark:bg-yellow-600 text-white shadow-yellow-500/30 dark:shadow-[0_4px_15px_rgba(202,138,4,0.3)]' },
    { key: 'volume', label: 'Volume', icon: <Weight size={16} />, activeColor: 'bg-purple-600 dark:bg-purple-700 text-white shadow-purple-500/30 dark:shadow-[0_4px_15px_rgba(126,34,206,0.3)]' },
    { key: 'trends', label: 'Trends', icon: <TrendingUp size={16} />, activeColor: 'bg-indigo-600 dark:bg-indigo-700 text-white shadow-indigo-500/30 dark:shadow-[0_4px_15px_rgba(79,70,229,0.3)]' },
    { key: 'heat', label: 'Heatmap', icon: <Grid3X3 size={16} />, activeColor: 'bg-rose-500 dark:bg-rose-600 text-white shadow-rose-500/30 dark:shadow-[0_4px_15px_rgba(225,29,72,0.3)]' },
]

export default async function ProgressPage({
    searchParams,
}: {
    searchParams: Promise<{ ex?: string; tab?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { ex: selectedId, tab } = await searchParams
    const activeTab = TABS.find(t => t.key === tab)?.key ?? 'chart'

    const [exercises, allPRs, volumeData, muscleSetCounts] = await Promise.all([
        getAllExercisesWithProgress(),
        getAllPersonalRecords(),
        getVolumeStats(),
        getMuscleSetCounts(),
    ])

    const activeId = selectedId || exercises[0]?.id || null
    const progressData = activeId ? await getExerciseProgress(activeId) : []
    const activeExercise = exercises.find(e => e.id === activeId)

    return (
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-zinc-100">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-start sm:items-center justify-between mb-8 animate-fade-in-up flex-col sm:flex-row gap-4">
                    <div>
                        <Link href="/" className="text-sm font-bold text-blue-600 dark:text-red-400 hover:underline mb-2 block transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-white/50 hover:dark:bg-zinc-900/50 flex items-center gap-1">
                            <ChevronLeft size={16} /> กลับหน้าหลัก
                        </Link>
                        <h1 className="text-4xl font-black gradient-text tracking-tight uppercase italic drop-shadow-sm flex items-center gap-3">
                            <BarChart2 size={32} className="text-blue-600 dark:text-red-500" /> พัฒนาการการฝึก
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Tab switcher */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {TABS.map(t => (
                        <Link key={t.key}
                            href={`/progress?tab=${t.key}${activeTab === 'chart' && selectedId ? `&ex=${selectedId}` : ''}`}
                            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 shadow-sm flex items-center gap-2 ${activeTab === t.key
                                ? t.activeColor
                                : 'bg-white/70 dark:bg-zinc-900 border border-white/40 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 hover:shadow-md'
                                }`}>
                            {t.icon}
                            <span>{t.label}</span>
                        </Link>
                    ))}
                </div>

                {/* ── Volume Tab ── */}
                {activeTab === 'volume' && (
                    <div className="animate-fade-in-up">
                        <VolumeChart data={volumeData} />
                    </div>
                )}

                {/* ── Trends Tab ── */}
                {activeTab === 'trends' && (
                    <div className="animate-fade-in-up">
                        <MuscleVolumeChart />
                    </div>
                )}

                {/* ── Heatmap Tab ── */}
                {activeTab === 'heat' && (
                    <div className="animate-fade-in-up">
                        <MuscleHeatmap muscleSetCounts={muscleSetCounts as Record<string, number>} />
                    </div>
                )}

                {/* ── PR Leaderboard ── */}
                {activeTab === 'prs' && (
                    <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md overflow-hidden animate-fade-in-up">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-600 dark:to-orange-700 px-6 md:px-8 py-5 flex items-center gap-4">
                            <Trophy size={32} className="text-white drop-shadow-md" />
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">สถิติสูงสุดส่วนตัว</h2>
                                <p className="text-yellow-50 dark:text-yellow-100/80 text-xs font-bold uppercase tracking-wide mt-0.5">น้ำหนักสูงสุดที่เคยยกในแต่ละท่า</p>
                            </div>
                        </div>

                        {allPRs.length === 0 ? (
                            <div className="p-6">
                                <EmptyState
                                    icon={<Dumbbell className="text-gray-300 dark:text-zinc-700" size={48} />}
                                    title="ยังไม่มีสถิติส่วนตัว"
                                    description="คุณต้องทำลายสถิติน้ำหนักสูงสุดของท่าออกกำลังกายก่อน จึงจะแสดงในกระดานนี้ เริ่มบันทึกการฝึกเพื่อสะสมสถิติกันเลย!"
                                    actionText="บันทึกสถิติวันนี้"
                                    actionHref="/logs/new"
                                />
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
                                            <th className="text-left px-6 py-4">#</th>
                                            <th className="text-left px-4 py-4">ท่า</th>
                                            <th className="text-left px-4 py-4">กลุ่มกล้ามเนื้อ</th>
                                            <th className="text-right px-4 py-4 flex items-center justify-end gap-1"><Trophy size={14} className="text-yellow-500" /> PR</th>
                                            <th className="text-right px-6 py-4">วันที่ทำได้</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                                        {allPRs.map((pr, i) => (
                                            <tr key={pr.exerciseId} className="hover:bg-gray-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                                                <td className="px-6 py-4 text-gray-400 dark:text-zinc-500 font-mono font-bold">{i + 1}</td>
                                                <td className="px-4 py-4">
                                                    <Link href={`/exercises/${pr.exerciseId}`} className="font-extrabold text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-red-400 transition-colors tracking-tight">
                                                        {pr.name}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-xs bg-blue-50 dark:bg-red-950/40 text-blue-700 dark:text-red-400 px-3 py-1 rounded-lg font-bold border border-blue-100 dark:border-red-900/30">
                                                        {pr.muscle_group}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <span className="text-xl font-black text-yellow-600 dark:text-yellow-500">{pr.calculated_1rm}</span>
                                                    <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 ml-1 uppercase">kg</span>
                                                    <div className="text-[10px] text-gray-500 dark:text-zinc-500 mt-1">
                                                        ({pr.raw_weight}kg x {pr.reps})
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-500 dark:text-zinc-400 text-xs font-bold">
                                                    {new Date(pr.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ── Chart Tab ── */}
                {activeTab === 'chart' && (
                    exercises.length === 0 ? (
                        <div className="animate-fade-in-up mt-8">
                            <EmptyState
                                icon={<TrendingUp className="text-gray-300 dark:text-zinc-700" size={48} />}
                                title="ยังไม่มีข้อมูลกราฟสถิติ"
                                description="กราฟจะแสดงพัฒนาการของคุณหลังจากที่ได้บันทึกการยกน้ำหนักของท่าต่างๆ แล้ว"
                                actionText="เริ่มต้นบันทึกการฝึก"
                                actionHref="/logs/new"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
                            <div className="md:col-span-1">
                                <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
                                        <h2 className="text-xs font-black text-gray-500 dark:text-zinc-400 uppercase tracking-widest">ท่าออกกำลังกาย</h2>
                                    </div>
                                    <ul className="divide-y divide-gray-50 dark:divide-zinc-800/50 max-h-96 md:max-h-[600px] overflow-y-auto custom-scrollbar">
                                        {exercises.map(ex => (
                                            <li key={ex.id}>
                                                <Link href={`/progress?ex=${ex.id}&tab=chart`}
                                                    className={`flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-zinc-800/50 ${ex.id === activeId ? 'bg-blue-50 dark:bg-red-950/20 text-blue-700 dark:text-red-400 font-bold border-l-4 border-blue-600 dark:border-red-500' : 'text-gray-700 dark:text-zinc-300 font-medium border-l-4 border-transparent'}`}>
                                                    <span className="truncate">{ex.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:col-span-3">
                                {activeExercise ? (
                                    <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-zinc-800">
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">{activeExercise.name}</h2>
                                                <span className="text-xs bg-blue-50 dark:bg-red-950/40 text-blue-700 dark:text-red-400 px-3 py-1 rounded-lg font-bold border border-blue-100 dark:border-red-900/30">
                                                    {activeExercise.muscle_group}
                                                </span>
                                            </div>
                                            <Link href={`/exercises/${activeExercise.id}`} className="text-sm font-bold text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 hover:underline transition-colors whitespace-nowrap flex items-center gap-1">ดูรายละเอียด <ArrowRight size={14} /></Link>
                                        </div>
                                        <ProgressChart data={progressData} exerciseName={activeExercise.name} />
                                    </div>
                                ) : (
                                    <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-12 text-center text-gray-500 dark:text-zinc-500 border border-white/40 dark:border-zinc-800 font-bold shadow-sm backdrop-blur-md flex flex-col items-center justify-center min-h-[400px]">
                                        <ArrowLeft size={48} className="mb-4 opacity-20" />
                                        เลือกท่าออกกำลังกายทางซ้ายเพื่อดูกราฟ
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        </main>
    )
}
