import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ProfileForm } from './components/ProfileForm'
import { WeightLogForm } from './components/WeightLogForm'
import { ThemeToggle } from '../components/ThemeToggle'
import { PushNotificationToggle } from '../components/PushNotificationToggle'

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
        .select('name, goal, height, experience_level, avatar_url')
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
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-blue-600 dark:text-red-500 tracking-tight">โปรไฟล์ของฉัน 👤</h1>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium text-sm mt-1">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 px-4 py-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 transition-colors">
                            ← กลับหน้าหลัก
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md h-full">
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
                                {profile?.avatar_url ? (
                                    profile.avatar_url.startsWith('http') ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-lg mb-4 border-4 border-white dark:border-zinc-800 dark:shadow-[0_0_20px_rgba(220,38,38,0.2)]" />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-4xl shadow-lg mb-4 border-4 border-white dark:border-zinc-800 dark:shadow-[0_0_20px_rgba(220,38,38,0.2)] text-gray-700 dark:text-zinc-300">
                                            {profile.avatar_url}
                                        </div>
                                    )
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 dark:from-red-600 dark:to-rose-800 flex items-center justify-center text-white text-4xl font-black shadow-lg mb-4 border-4 border-white dark:border-zinc-800 dark:shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                                        {displayName ? displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
                                    </div>
                                )}
                                <h2 className="text-xl font-black text-gray-900 dark:text-zinc-100">{displayName || 'Unnamed Athlete'}</h2>
                                {latestWeight && (
                                    <div className="mt-3 bg-blue-50 dark:bg-red-950/30 border border-blue-100 dark:border-red-900/50 text-blue-700 dark:text-red-400 px-4 py-1.5 rounded-xl text-sm font-bold tracking-wide">
                                        ⚖️ น้ำหนักล่าสุด: {latestWeight} kg
                                    </div>
                                )}
                                {profile?.goal && (
                                    <div className="mt-4 text-center text-sm font-medium text-gray-500 dark:text-zinc-400 italic bg-gray-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 w-full">
                                        🎯 "{profile.goal}"
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 mb-5">แก้ไขโปรไฟล์</h3>
                            <ProfileForm
                                displayName={displayName}
                                goal={profile?.goal ?? null}
                                height={profile?.height ?? null}
                                experienceLevel={profile?.experience_level ?? null}
                                avatarUrl={profile?.avatar_url ?? null}
                            />

                            <div className="mt-8 border-t border-gray-100 dark:border-zinc-800 pt-6">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100 mb-4">ตั้งค่าแอปพลิเคชัน</h3>
                                <PushNotificationToggle />
                            </div>
                        </div>
                    </div>

                    {/* Right: Weight Tracking */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Weight Chart */}
                        <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                <span>📈</span> กราฟน้ำหนักตัว
                                {logs.length > 0 && (
                                    <span className="text-sm font-semibold text-gray-400 dark:text-zinc-500 ml-auto bg-gray-50 dark:bg-zinc-950/50 px-3 py-1 rounded-lg border border-gray-200 dark:border-zinc-800">{logs.length} รายการล่าสุด</span>
                                )}
                            </h3>
                            <WeightChart logs={logs} />
                        </div>

                        {/* Add Weight Form */}
                        <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                <span>⚖️</span> บันทึกน้ำหนักวันนี้
                            </h3>
                            <WeightLogForm />
                        </div>

                        {/* Weight History Table */}
                        {logs.length > 0 && (
                            <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
                                    <span>📋</span> ประวัติน้ำหนัก
                                </h3>
                                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 dark:bg-zinc-950">
                                            <tr className="text-xs font-bold text-gray-600 dark:text-zinc-400 uppercase border-b border-gray-200 dark:border-zinc-800">
                                                <th className="py-4 px-5">วันที่</th>
                                                <th className="py-4 px-5 text-right">น้ำหนัก (kg)</th>
                                                <th className="py-4 px-5 text-right">เปลี่ยนแปลง</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log, idx) => {
                                                const prev = logs[idx + 1]
                                                const diff = prev ? log.weight - prev.weight : null
                                                const dateObj = new Date(log.date)
                                                return (
                                                    <tr key={log.id} className="border-b border-gray-100 dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-colors bg-white dark:bg-zinc-900">
                                                        <td className="py-4 px-5 text-gray-700 dark:text-zinc-300 font-medium">
                                                            {dateObj.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td className="py-4 px-5 text-right font-black text-gray-900 dark:text-zinc-100">{log.weight}</td>
                                                        <td className="py-4 px-5 text-right">
                                                            {diff !== null ? (
                                                                <span className={`text-xs font-bold px-3 py-1 rounded-lg ${diff < 0 ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/40 border border-green-200 dark:border-green-900/50' : diff > 0 ? 'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50' : 'text-gray-600 bg-gray-100 dark:text-zinc-400 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700'}`}>
                                                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-300 dark:text-zinc-600 text-xs font-bold">—</span>
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
