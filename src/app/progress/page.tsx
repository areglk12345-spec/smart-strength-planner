import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '../components/ThemeToggle'
import { getAllExercisesWithProgress, getExerciseProgress, getAllPersonalRecords, getVolumeStats, getMuscleSetCounts } from '../actions/log'
import { ProgressChart } from '../components/ProgressChart'
import { VolumeChart } from '../components/VolumeChart'
import { MuscleHeatmap } from '../components/MuscleHeatmap'
import { EmptyState } from '../components/EmptyState'

const TABS = [
    { key: 'chart', label: '📈 กราฟ', activeColor: 'bg-blue-600 text-white shadow-blue-500/30' },
    { key: 'prs', label: '🏆 PRs', activeColor: 'bg-yellow-500 text-white shadow-yellow-500/30' },
    { key: 'volume', label: '⚖️ Volume', activeColor: 'bg-purple-600 text-white shadow-purple-500/30' },
    { key: 'heat', label: '📊 Heatmap', activeColor: 'bg-rose-500 text-white shadow-rose-500/30' },
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
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-gray-100">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 animate-fade-in-up">
                    <div>
                        <Link href="/" className="text-sm text-blue-500 hover:underline mb-1 block">← หน้าหลัก</Link>
                        <h1 className="text-3xl font-black gradient-text">📊 พัฒนาการการฝึก</h1>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Tab switcher */}
                <div className="flex gap-2 mb-6 flex-wrap">
                    {TABS.map(t => (
                        <Link key={t.key}
                            href={`/progress?tab=${t.key}${activeTab === 'chart' && selectedId ? `&ex=${selectedId}` : ''}`}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm ${activeTab === t.key
                                ? t.activeColor
                                : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                }`}>
                            {t.label}
                        </Link>
                    ))}
                </div>

                {/* ── Volume Tab ── */}
                {activeTab === 'volume' && (
                    <div className="animate-fade-in-up">
                        <VolumeChart data={volumeData} />
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
                    <div className="glass-card overflow-hidden animate-fade-in-up">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <h2 className="text-lg font-extrabold text-white">สถิติสูงสุดส่วนตัว</h2>
                                <p className="text-yellow-100 text-xs">น้ำหนักสูงสุดที่เคยยกในแต่ละท่า</p>
                            </div>
                        </div>

                        {allPRs.length === 0 ? (
                            <div className="p-6">
                                <EmptyState
                                    icon="🏋️"
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
                                        <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                            <th className="text-left px-6 py-3">#</th>
                                            <th className="text-left px-4 py-3">ท่า</th>
                                            <th className="text-left px-4 py-3">กลุ่มกล้ามเนื้อ</th>
                                            <th className="text-right px-4 py-3">🏆 PR</th>
                                            <th className="text-right px-6 py-3">วันที่ทำได้</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {allPRs.map((pr, i) => (
                                            <tr key={pr.exerciseId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                                                <td className="px-6 py-3 text-gray-400 dark:text-gray-500 font-mono">{i + 1}</td>
                                                <td className="px-4 py-3">
                                                    <Link href={`/exercises/${pr.exerciseId}`} className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                                        {pr.name}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                                                        {pr.muscle_group}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <span className="text-xl font-extrabold text-yellow-600 dark:text-yellow-400">{pr.weight}</span>
                                                    <span className="text-xs text-gray-400 ml-1">kg</span>
                                                </td>
                                                <td className="px-6 py-3 text-right text-gray-500 dark:text-gray-400 text-xs">
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
                                icon="📈"
                                title="ยังไม่มีข้อมูลกราฟสถิติ"
                                description="กราฟจะแสดงพัฒนาการของคุณหลังจากที่ได้บันทึกการยกน้ำหนักของท่าต่างๆ แล้ว"
                                actionText="เริ่มต้นบันทึกการฝึก"
                                actionHref="/logs/new"
                            />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in-up">
                            <div className="lg:col-span-1">
                                <div className="glass-card overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                                        <h2 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ท่าออกกำลังกาย</h2>
                                    </div>
                                    <ul className="divide-y divide-gray-50 dark:divide-gray-700/50 max-h-96 overflow-y-auto">
                                        {exercises.map(ex => (
                                            <li key={ex.id}>
                                                <Link href={`/progress?ex=${ex.id}&tab=chart`}
                                                    className={`flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-800/50 ${ex.id === activeId ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border-l-2 border-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    <span className="truncate">{ex.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                {activeExercise ? (
                                    <div className="glass-card p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{activeExercise.name}</h2>
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium">
                                                    {activeExercise.muscle_group}
                                                </span>
                                            </div>
                                            <Link href={`/exercises/${activeExercise.id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">ดูรายละเอียด →</Link>
                                        </div>
                                        <ProgressChart data={progressData} exerciseName={activeExercise.name} />
                                    </div>
                                ) : (
                                    <div className="glass-card p-12 text-center text-gray-500 dark:text-gray-400">
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
