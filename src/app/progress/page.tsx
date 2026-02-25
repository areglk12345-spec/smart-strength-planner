import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '../components/ThemeToggle'
import { getAllExercisesWithProgress, getExerciseProgress, getAllPersonalRecords } from '../actions/log'
import { ProgressChart } from '../components/ProgressChart'

export default async function ProgressPage({
    searchParams
}: {
    searchParams: Promise<{ ex?: string; tab?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { ex: selectedId, tab } = await searchParams
    const activeTab = tab === 'prs' ? 'prs' : 'chart'

    const [exercises, allPRs] = await Promise.all([
        getAllExercisesWithProgress(),
        getAllPersonalRecords()
    ])

    const activeId = selectedId || exercises[0]?.id || null
    const progressData = activeId ? await getExerciseProgress(activeId) : []
    const activeExercise = exercises.find(e => e.id === activeId)

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">📊 พัฒนาการการฝึก</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">ติดตามน้ำหนักที่ยกสูงสุดต่อท่าตามเวลา</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm">
                            ← หน้าหลัก
                        </Link>
                    </div>
                </div>

                {/* Tab switcher */}
                <div className="flex gap-2 mb-6">
                    <Link href="/progress" className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm ${activeTab === 'chart' ? 'bg-blue-600 text-white shadow-blue-500/30' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        📈 กราฟพัฒนาการ
                    </Link>
                    <Link href="/progress?tab=prs" className={`px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm ${activeTab === 'prs' ? 'bg-yellow-500 text-white shadow-yellow-500/30' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                        🏆 สถิติสูงสุด (PRs)
                    </Link>
                </div>

                {activeTab === 'prs' ? (
                    /* ── PR Leaderboard ── */
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4 flex items-center gap-3">
                            <span className="text-2xl">🏆</span>
                            <div>
                                <h2 className="text-lg font-extrabold text-white">สถิติสูงสุดส่วนตัว</h2>
                                <p className="text-yellow-100 text-xs">น้ำหนักสูงสุดที่เคยยกในแต่ละท่า</p>
                            </div>
                        </div>

                        {allPRs.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                                <div className="text-4xl mb-3">🏋️</div>
                                <p>ยังไม่มีสถิติ — บันทึกการฝึกเพื่อเริ่มสะสม PR!</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                            <th className="text-left px-6 py-3">#</th>
                                            <th className="text-left px-4 py-3">ท่า</th>
                                            <th className="text-left px-4 py-3">กลุ่มกล้ามเนื้อ</th>
                                            <th className="text-right px-4 py-3">🏆 PR</th>
                                            <th className="text-right px-6 py-3">วันที่ทำได้</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {allPRs.map((pr, i) => (
                                            <tr key={pr.exerciseId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                <td className="px-6 py-3 text-gray-400 dark:text-gray-500 font-mono">{i + 1}</td>
                                                <td className="px-4 py-3">
                                                    <Link href={`/exercises/${pr.exerciseId}`} className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
                                                        {pr.name}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-medium">
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
                ) : (
                    /* ── Chart Tab ── */
                    exercises.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center shadow-sm">
                            <div className="text-5xl mb-4">📝</div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">ยังไม่มีข้อมูลการฝึก</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">บันทึกการออกกำลังกายก่อนเพื่อดูกราฟพัฒนาการ</p>
                            <Link href="/logs/new" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition">
                                + บันทึกการฝึก
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">ท่าออกกำลังกาย</h2>
                                    </div>
                                    <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                                        {exercises.map(ex => (
                                            <li key={ex.id}>
                                                <Link href={`/progress?ex=${ex.id}`}
                                                    className={`flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-gray-50 dark:hover:bg-gray-700 ${ex.id === activeId ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold border-l-2 border-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    <span className="truncate">{ex.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                {activeExercise ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{activeExercise.name}</h2>
                                                <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full font-medium">
                                                    {activeExercise.muscle_group}
                                                </span>
                                            </div>
                                            <Link href={`/exercises/${activeExercise.id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                                ดูรายละเอียด →
                                            </Link>
                                        </div>
                                        <ProgressChart data={progressData} exerciseName={activeExercise.name} />
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-12 text-center shadow-sm">
                                        <p className="text-gray-500 dark:text-gray-400">เลือกท่าออกกำลังกายทางซ้ายเพื่อดูกราฟ</p>
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
