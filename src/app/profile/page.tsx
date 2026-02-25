import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProfileForm } from './components/ProfileForm'
import { WeightLogForm } from './components/WeightLogForm'
import { ThemeToggle } from '../components/ThemeToggle'

interface WeightLog {
    id: string
    weight: number
    date: string
}

// Pure SVG Line Chart component (no external libraries)
function WeightChart({ logs }: { logs: WeightLog[] }) {
    if (logs.length < 2) {
        return (
            <div className="flex flex-col items-center justify-center h-40 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-gray-400">
                <span className="text-2xl mb-2">📈</span>
                <span className="text-sm">บันทึกน้ำหนักอย่างน้อย 2 ครั้งเพื่อดูกราฟ</span>
            </div>
        )
    }

    const W = 600
    const H = 180
    const PADDING = { top: 20, right: 20, bottom: 30, left: 45 }
    const chartW = W - PADDING.left - PADDING.right
    const chartH = H - PADDING.top - PADDING.bottom

    // Sort by date ascending
    const sorted = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const weights = sorted.map(l => l.weight)
    const minW = Math.min(...weights) - 1
    const maxW = Math.max(...weights) + 1

    const toX = (i: number) => PADDING.left + (i / (sorted.length - 1)) * chartW
    const toY = (w: number) => PADDING.top + ((maxW - w) / (maxW - minW)) * chartH

    const polyline = sorted.map((l, i) => `${toX(i)},${toY(l.weight)}`).join(' ')
    const area = `${PADDING.left},${PADDING.top + chartH} ${polyline} ${toX(sorted.length - 1)},${PADDING.top + chartH}`

    // Y-axis labels
    const yTicks = [minW + 0.5, (minW + maxW) / 2, maxW - 0.5].map(v => Math.round(v * 10) / 10)

    return (
        <div className="w-full overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: '300px' }}>
                {/* Grid lines */}
                {yTicks.map((tick, i) => (
                    <g key={i}>
                        <line x1={PADDING.left} y1={toY(tick)} x2={W - PADDING.right} y2={toY(tick)}
                            stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
                        <text x={PADDING.left - 5} y={toY(tick) + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                            {tick}
                        </text>
                    </g>
                ))}

                {/* Area fill */}
                <polygon points={area} fill="url(#grad)" opacity="0.3" />

                {/* Line */}
                <polyline points={polyline} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Dots */}
                {sorted.map((l, i) => (
                    <circle key={l.id} cx={toX(i)} cy={toY(l.weight)} r="4" fill="#2563eb" stroke="white" strokeWidth="2">
                        <title>{l.date}: {l.weight} kg</title>
                    </circle>
                ))}

                {/* X-axis date labels (first, middle, last) */}
                {[0, Math.floor((sorted.length - 1) / 2), sorted.length - 1].filter((v, i, a) => a.indexOf(v) === i).map(idx => (
                    <text key={idx} x={toX(idx)} y={H - 5} textAnchor="middle" fontSize="10" fill="#9ca3af">
                        {new Date(sorted[idx].date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                    </text>
                ))}

                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('name, goal, height, experience_level')
        .eq('id', user.id)
        .single()

    // Fetch the last 30 weight logs
    const { data: weightLogs } = await supabase
        .from('body_weight_logs')
        .select('id, weight, date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30)

    const logs: WeightLog[] = (weightLogs || []) as WeightLog[]
    const latestWeight = logs[0]?.weight ?? null
    const displayName = profile?.name ?? null

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">โปรไฟล์ของฉัน 👤</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                            ← กลับหน้าหลัก
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg mb-3">
                                    {displayName ? displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">{displayName || 'Unnamed Athlete'}</h2>
                                {latestWeight && (
                                    <div className="mt-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        ⚖️ น้ำหนักล่าสุด: {latestWeight} kg
                                    </div>
                                )}
                                {profile?.goal && (
                                    <div className="mt-3 text-center text-sm text-gray-500 italic">
                                        🎯 "{profile.goal}"
                                    </div>
                                )}
                            </div>

                            <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-4">แก้ไขโปรไฟล์</h3>
                            <ProfileForm
                                displayName={displayName}
                                goal={profile?.goal ?? null}
                                height={profile?.height ?? null}
                                experienceLevel={profile?.experience_level ?? null}
                            />
                        </div>
                    </div>

                    {/* Right: Weight Tracking */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Weight Chart */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <span>📈</span> กราฟน้ำหนักตัว
                                {logs.length > 0 && (
                                    <span className="text-xs font-normal text-gray-400 ml-auto">{logs.length} รายการล่าสุด</span>
                                )}
                            </h3>
                            <WeightChart logs={logs} />
                        </div>

                        {/* Add Weight Form */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <span>⚖️</span> บันทึกน้ำหนักวันนี้
                            </h3>
                            <WeightLogForm />
                        </div>

                        {/* Weight History Table */}
                        {logs.length > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <span>📋</span> ประวัติน้ำหนัก
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700">
                                                <th className="pb-3 pr-4">วันที่</th>
                                                <th className="pb-3 text-right">น้ำหนัก (kg)</th>
                                                <th className="pb-3 text-right pl-4">เปลี่ยนแปลง</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log, idx) => {
                                                const prev = logs[idx + 1]
                                                const diff = prev ? log.weight - prev.weight : null
                                                const dateObj = new Date(log.date)
                                                return (
                                                    <tr key={log.id} className="border-b border-gray-50 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                                        <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                                                            {dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td className="py-3 text-right font-bold text-gray-900">{log.weight}</td>
                                                        <td className="py-3 text-right pl-4">
                                                            {diff !== null ? (
                                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diff < 0 ? 'text-green-700 bg-green-50' : diff > 0 ? 'text-red-700 bg-red-50' : 'text-gray-500 bg-gray-100'}`}>
                                                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 text-xs">—</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
