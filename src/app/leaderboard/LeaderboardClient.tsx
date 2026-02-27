'use client'

import { useState } from 'react'

type LeaderboardVolumeRow = {
    user_id: string
    username: string | null
    avatar_url: string | null
    total_volume_30d: number
    workouts_count: number
}

type LeaderboardPRRow = {
    user_id: string
    username: string | null
    avatar_url: string | null
    exercise_name: string
    max_weight: number
    date: string
}

export function LeaderboardClient({
    volumeData,
    prData,
    currentUserId,
}: {
    volumeData: LeaderboardVolumeRow[]
    prData: LeaderboardPRRow[]
    currentUserId: string | undefined
}) {
    const [tab, setTab] = useState<'volume' | 'prs'>('volume')

    return (
        <div className="space-y-6 animate-fade-in-up pb-16 sm:pb-0">
            {/* Header / Tabs */}
            <div className="flex gap-3">
                <button
                    onClick={() => setTab('volume')}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 shadow-sm border ${tab === 'volume'
                        ? 'bg-blue-600 dark:bg-blue-700 text-white shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(29,78,216,0.3)] border-transparent'
                        : 'bg-white/70 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 border-white/40 dark:border-zinc-800 hover:shadow-md'
                        }`}
                >
                    <span className="text-lg mr-2">🏋️</span> Volume (30 วัน)
                </button>
                <button
                    onClick={() => setTab('prs')}
                    className={`flex-1 py-3.5 rounded-2xl text-sm font-black transition-all duration-300 shadow-sm border ${tab === 'prs'
                        ? 'bg-yellow-500 dark:bg-amber-600 text-white shadow-yellow-500/30 dark:shadow-[0_4px_15px_rgba(217,119,6,0.3)] border-transparent'
                        : 'bg-white/70 dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 border-white/40 dark:border-zinc-800 hover:shadow-md'
                        }`}
                >
                    <span className="text-lg mr-2">🏆</span> Top Bench Press
                </button>
            </div>

            <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md overflow-hidden">
                <div className={`px-6 md:px-8 py-5 flex items-center gap-4 ${tab === 'volume' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-900' : 'bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-amber-600 dark:to-orange-800'}`}>
                    <span className="text-3xl drop-shadow-md">{tab === 'volume' ? '🌟' : '👑'}</span>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">
                            {tab === 'volume' ? 'Top Volume Leaderboard' : 'King of Bench Press'}
                        </h2>
                        <p className={`text-xs font-bold uppercase tracking-wide mt-0.5 ${tab === 'volume' ? 'text-blue-50 dark:text-blue-100/80' : 'text-yellow-50 dark:text-yellow-100/80'}`}>
                            {tab === 'volume' ? 'จัดอันดับจากน้ำหนัก (sets×reps×weight) ใน 30 วัน' : 'จัดอันดับจากน้ำหนัก Bench Press สูงสุดตลอดกาล'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wide border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/50">
                                <th className="text-left px-6 py-4 w-16">Rank</th>
                                <th className="text-left px-4 py-4">Lifter</th>
                                {tab === 'volume' ? (
                                    <>
                                        <th className="text-right px-4 py-4">Workouts</th>
                                        <th className="text-right px-6 py-4">Volume (kg)</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="text-right px-4 py-4">Date</th>
                                        <th className="text-right px-6 py-4">Max Weight</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-zinc-800">
                            {(tab === 'volume' ? volumeData : prData).map((row: any, i) => {
                                const isMe = row.user_id === currentUserId
                                return (
                                    <tr key={row.user_id} className={`transition-colors ${isMe ? 'bg-blue-50/80 dark:bg-red-950/20' : 'hover:bg-gray-50/80 dark:hover:bg-zinc-900/50'}`}>
                                        <td className="px-6 py-4 font-mono font-bold">
                                            {i === 0 ? <span className="text-2xl drop-shadow-sm">🥇</span> : i === 1 ? <span className="text-xl drop-shadow-sm">🥈</span> : i === 2 ? <span className="text-xl drop-shadow-sm">🥉</span> : <span className="text-gray-400 dark:text-zinc-500">#{i + 1}</span>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-sm font-black shrink-0 overflow-hidden shadow-sm border border-white dark:border-zinc-700">
                                                    {row.avatar_url ? (
                                                        row.avatar_url.startsWith('http') ? (
                                                            <img src={row.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-2xl">{row.avatar_url}</span>
                                                        )
                                                    ) : (
                                                        <span className="text-gray-500 dark:text-zinc-400">{(row.username || 'U')[0].toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <span className={`font-black tracking-tight ${isMe ? 'text-blue-700 dark:text-red-400 text-base' : 'text-gray-800 dark:text-zinc-200'}`}>
                                                    {row.username || 'Anonymous User'}
                                                    {isMe && <span className="ml-3 text-[10px] bg-blue-100 dark:bg-red-900/50 text-blue-700 dark:text-red-300 px-2.5 py-0.5 rounded-lg font-black uppercase tracking-widest border border-blue-200 dark:border-red-800/50">YOU</span>}
                                                </span>
                                            </div>
                                        </td>
                                        {tab === 'volume' ? (
                                            <>
                                                <td className="px-4 py-4 text-right text-gray-500 dark:text-zinc-400 font-bold">
                                                    {row.workouts_count}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-blue-600 dark:text-blue-500 text-lg">
                                                    {row.total_volume_30d >= 1000 ? `${(row.total_volume_30d / 1000).toFixed(1)}k` : row.total_volume_30d}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-4 text-right text-gray-500 dark:text-zinc-400 text-xs font-bold">
                                                    {new Date(row.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 text-right font-black text-yellow-600 dark:text-amber-500 text-lg">
                                                    {row.max_weight} <span className="text-xs font-bold text-gray-400 dark:text-zinc-500 ml-1 uppercase">kg</span>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {(tab === 'volume' ? volumeData : prData).length === 0 && (
                        <div className="p-10 text-center font-bold text-gray-500 dark:text-zinc-500">
                            ยังไม่มีข้อมูลจัดอันดับ
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
