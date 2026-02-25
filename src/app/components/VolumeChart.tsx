interface VolumePoint {
    date: string
    volume: number
}

export function VolumeChart({ data }: { data: VolumePoint[] }) {
    if (data.length === 0) {
        return (
            <div className="glass-card p-6 text-center text-gray-400 dark:text-gray-500">
                <div className="text-3xl mb-2">⚖️</div>
                <p className="text-sm">ยังไม่มีข้อมูล Volume<br />บันทึก sets/reps/weight ในการฝึกก่อนครับ</p>
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
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-gray-800 dark:text-gray-200">⚖️ Volume ต่อเซสชัน</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">30 วันล่าสุด</span>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                    { label: 'ยกรวมทั้งหมด', value: `${(totalVolume / 1000).toFixed(1)}t`, color: 'text-blue-600 dark:text-blue-400' },
                    { label: 'เฉลี่ยต่อเซสชัน', value: `${avgVolume.toLocaleString()} kg`, color: 'text-purple-600 dark:text-purple-400' },
                    { label: 'สถิติสูงสุด', value: `${maxSession.toLocaleString()} kg`, color: 'text-orange-500 dark:text-orange-400' },
                ].map(k => (
                    <div key={k.label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                        <div className={`text-lg font-extrabold ${k.color}`}>{k.value}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Bar chart */}
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180 }}>
                <defs>
                    <linearGradient id="vol-bar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
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
                                fill={isMax ? '#f59e0b' : 'url(#vol-bar)'}
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
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                🟡 = สถิติสูงสุด | Volume = sets × reps × weight (kg)
            </p>
        </div>
    )
}
