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
            <div className="flex gap-2">
                <button
                    onClick={() => setTab('volume')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-sm ${tab === 'volume'
                        ? 'bg-blue-600 text-white shadow-blue-500/30'
                        : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    🏋️ Volume (30 วัน)
                </button>
                <button
                    onClick={() => setTab('prs')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-sm ${tab === 'prs'
                        ? 'bg-yellow-500 text-white shadow-yellow-500/30'
                        : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    🏆 Top Bench Press
                </button>
            </div>

            <div className="glass-card overflow-hidden">
                <div className={`px-6 py-4 flex items-center gap-3 ${tab === 'volume' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-yellow-400 to-orange-400'}`}>
                    <span className="text-2xl">{tab === 'volume' ? '🌟' : '👑'}</span>
                    <div>
                        <h2 className="text-lg font-extrabold text-white">
                            {tab === 'volume' ? 'Top Volume Leaderboard' : 'King of Bench Press'}
                        </h2>
                        <p className={`text-xs ${tab === 'volume' ? 'text-blue-100' : 'text-yellow-100'}`}>
                            {tab === 'volume' ? 'จัดอันดับจากน้ำหนัก (sets×reps×weight) ใน 30 วัน' : 'จัดอันดับจากน้ำหนัก Bench Press สูงสุดตลอดกาล'}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase border-b border-gray-100 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50">
                                <th className="text-left px-6 py-3 w-16">Rank</th>
                                <th className="text-left px-4 py-3">Lifter</th>
                                {tab === 'volume' ? (
                                    <>
                                        <th className="text-right px-4 py-3">Workouts</th>
                                        <th className="text-right px-6 py-3">Volume (kg)</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="text-right px-4 py-3">Date</th>
                                        <th className="text-right px-6 py-3">Max Weight</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {(tab === 'volume' ? volumeData : prData).map((row: any, i) => {
                                const isMe = row.user_id === currentUserId
                                return (
                                    <tr key={row.user_id} className={`transition ${isMe ? 'bg-blue-50/50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                                        <td className="px-6 py-4 font-bold">
                                            {i === 0 ? <span className="text-xl">🥇</span> : i === 1 ? <span className="text-lg">🥈</span> : i === 2 ? <span className="text-lg">🥉</span> : <span className="text-gray-400">#{i + 1}</span>}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                                                    {row.avatar_url ? (
                                                        row.avatar_url.startsWith('http') ? (
                                                            <img src={row.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-xl">{row.avatar_url}</span>
                                                        )
                                                    ) : (
                                                        (row.username || 'U')[0].toUpperCase()
                                                    )}
                                                </div>
                                                <span className={`font-semibold ${isMe ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                    {row.username || 'Anonymous User'}
                                                    {isMe && <span className="ml-2 text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">YOU</span>}
                                                </span>
                                            </div>
                                        </td>
                                        {tab === 'volume' ? (
                                            <>
                                                <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400">
                                                    {row.workouts_count}
                                                </td>
                                                <td className="px-6 py-4 text-right font-extrabold text-blue-600 dark:text-blue-400">
                                                    {row.total_volume_30d >= 1000 ? `${(row.total_volume_30d / 1000).toFixed(1)}k` : row.total_volume_30d}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400 text-xs">
                                                    {new Date(row.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 text-right font-extrabold text-yellow-600 dark:text-yellow-400">
                                                    {row.max_weight} <span className="text-xs font-medium text-gray-400">kg</span>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {(tab === 'volume' ? volumeData : prData).length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            ยังไม่มีข้อมูลจัดอันดับ
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
