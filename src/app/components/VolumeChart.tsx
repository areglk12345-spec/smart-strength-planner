interface VolumePoint {
    date: string
    volume: number
}

export function VolumeChart({ data }: { data: VolumePoint[] }) {
    if (data.length === 0) {
        return (
            <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-8 text-center text-gray-400 dark:text-zinc-500 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                <div className="text-4xl mb-3 grayscale opacity-50">⚖️</div>
                <p className="text-sm font-medium">ยังไม่มีข้อมูล Volume<br />บันทึก sets/reps/weight ในการฝึกก่อนครับ</p>
            </div>
        )
    }

    const W = 600, H = 200
    const PAD = { top: 16, right: 16, bottom: 32, left: 52 }
    const chartW = W - PAD.left - PAD.right
    const chartH = H - PAD.top - PAD.bottom

    const maxVol = Math.max(...data.map(d => d.volume))
    const barW = Math.min(24, chartW / data.length - 4)

    const totalVolume = data.reduce((s, d) => s + d.volume, 0)
    const avgVolume = data.length > 0 ? Math.round(totalVolume / data.length) : 0
    const maxSession = Math.max(...data.map(d => d.volume))

    return (
        <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h3 className="font-black text-gray-900 dark:text-zinc-100 tracking-tight text-lg">⚖️ Volume ต่อเซสชัน</h3>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">30 วันล่าสุด</span>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                    { label: 'ยกรวมทั้งหมด', value: `${(totalVolume / 1000).toFixed(1)}t`, color: 'text-blue-600 dark:text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
                    { label: 'เฉลี่ยต่อเซสชัน', value: `${avgVolume >= 1000 ? (avgVolume / 1000).toFixed(1) + 'k' : avgVolume} kg`, color: 'text-purple-600 dark:text-red-500', bg: 'bg-purple-50 dark:bg-red-950/20' },
                    { label: 'สถิติสูงสุด', value: `${maxSession >= 1000 ? (maxSession / 1000).toFixed(1) + 'k' : maxSession} kg`, color: 'text-orange-500 dark:text-amber-500', bg: 'bg-orange-50 dark:bg-amber-950/20' },
                ].map(k => (
                    <div key={k.label} className={`${k.bg} rounded-2xl p-3 sm:p-4 text-center shadow-sm border border-white dark:border-zinc-800/50`}>
                        <div className={`text-lg sm:text-xl font-black tracking-tight ${k.color}`}>{k.value}</div>
                        <div className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wider">{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full drop-shadow-sm" style={{ height: 180 }}>
                <defs>
                    <linearGradient id="vol-bar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="vol-max" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                </defs>

                {/* Y-axis labels */}
                {[0, 0.5, 1].map(t => {
                    const y = PAD.top + chartH * (1 - t)
                    const val = Math.round(maxVol * t)
                    return (
                        <g key={t}>
                            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                                stroke="currentColor" strokeOpacity={0.06} strokeWidth={1} />
                            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize={9}
                                fill="currentColor" fillOpacity={0.4}>
                                {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                            </text>
                        </g>
                    )
                })}

                {/* Bars */}
                {data.map((d, i) => {
                    const x = PAD.left + (i / data.length) * chartW + (chartW / data.length - barW) / 2
                    const barH = maxVol > 0 ? (d.volume / maxVol) * chartH : 0
                    const y = PAD.top + chartH - barH
                    const isMax = d.volume === maxSession

                    return (
                        <g key={d.date}>
                            <rect x={x} y={y} width={barW} height={barH}
                                fill={isMax ? 'url(#vol-max)' : 'url(#vol-bar)'}
                                rx={4} />
                        </g>
                    )
                })}

                {/* X-axis dates (show every ~5th) */}
                {data.map((d, i) => {
                    if (data.length > 10 && i % Math.ceil(data.length / 6) !== 0) return null
                    const x = PAD.left + (i / data.length) * chartW + chartW / data.length / 2
                    const label = new Date(d.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
                    return (
                        <text key={d.date} x={x} y={H - 4} textAnchor="middle" fontSize={8}
                            fill="currentColor" fillOpacity={0.4}>
                            {label}
                        </text>
                    )
                })}
            </svg>
            <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 text-center mt-3 bg-gray-50 dark:bg-zinc-950/50 py-2 rounded-xl border border-gray-100 dark:border-zinc-800/50 uppercase tracking-wide">
                🟡 สถิติสูงสุด <span className="mx-2 opacity-30">|</span> Volume = sets × reps × weight
            </p>
        </div>
    )
}
