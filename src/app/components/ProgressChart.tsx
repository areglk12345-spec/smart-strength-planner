'use client'

interface DataPoint {
    date: string
    maxWeight: number
    sets: number
    reps: number
}

interface Props {
    data: DataPoint[]
    exerciseName?: string
}

export function ProgressChart({ data, exerciseName }: Props) {
    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-500">
                <span className="text-4xl mb-3 grayscale opacity-50">📊</span>
                <span className="text-sm font-medium">ยังไม่มีข้อมูล — บันทึกการฝึกก่อนเลย!</span>
            </div>
        )
    }

    if (data.length === 1) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-white/70 dark:bg-zinc-900 rounded-3xl border border-white/40 dark:border-zinc-800 shadow-sm backdrop-blur-md text-gray-500 dark:text-zinc-500">
                <div className="text-5xl font-black text-blue-600 dark:text-red-500 drop-shadow-sm">{data[0].maxWeight} <span className="text-xl">kg</span></div>
                <div className="text-sm font-bold mt-3 uppercase tracking-wide text-gray-400 dark:text-zinc-500">บันทึกเพิ่มอีกอย่างน้อย 1 ครั้งเพื่อดูกราฟ</div>
            </div>
        )
    }

    // Chart calculations
    const W = 600
    const H = 200
    const PAD = { top: 16, right: 20, bottom: 36, left: 48 }
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const weights = data.map(d => d.maxWeight)
    const minW = Math.min(...weights)
    const maxW = Math.max(...weights)
    const range = maxW - minW || 1

    const xStep = innerW / (data.length - 1)
    const toX = (i: number) => PAD.left + i * xStep
    const toY = (w: number) => PAD.top + innerH - ((w - minW) / range) * innerH

    const points = data.map((d, i) => `${toX(i)},${toY(d.maxWeight)}`).join(' ')
    const polyPoints = `${PAD.left},${PAD.top + innerH} ${points} ${toX(data.length - 1)},${PAD.top + innerH}`

    // Y-axis labels (3 steps)
    const yLabels = [minW, minW + range / 2, maxW]

    // X-axis labels: show at most 6 evenly spaced dates
    const xIndices = data.length <= 6
        ? data.map((_, i) => i)
        : [0, Math.floor((data.length - 1) / 4), Math.floor((data.length - 1) / 2), Math.floor(3 * (data.length - 1) / 4), data.length - 1]

    const improvement = data[data.length - 1].maxWeight - data[0].maxWeight
    const pr = Math.max(...weights)

    return (
        <div>
            {/* KPI row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-3 sm:p-4 text-center shadow-sm">
                    <div className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">PR สูงสุด</div>
                    <div className="text-xl sm:text-2xl font-black text-blue-700 dark:text-blue-300 tracking-tight drop-shadow-sm">{pr} <span className="text-xs sm:text-sm font-bold text-blue-500/70">kg</span></div>
                </div>
                <div className={`border rounded-2xl p-3 sm:p-4 text-center shadow-sm ${improvement >= 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'}`}>
                    <div className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 ${improvement >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>พัฒนาการ</div>
                    <div className={`text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm ${improvement >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)} <span className={`text-xs sm:text-sm font-bold ${improvement >= 0 ? 'text-green-500/70' : 'text-red-500/70'}`}>kg</span>
                    </div>
                </div>
                <div className="bg-purple-50 dark:bg-red-950/20 border border-purple-100 dark:border-red-900/30 rounded-2xl p-3 sm:p-4 text-center shadow-sm">
                    <div className="text-[10px] sm:text-xs font-bold text-purple-600 dark:text-red-500 uppercase tracking-widest mb-1.5">จำนวนเซสชัน</div>
                    <div className="text-xl sm:text-2xl font-black text-purple-700 dark:text-red-400 tracking-tight drop-shadow-sm">{data.length}</div>
                </div>
            </div>

            {/* SVG Chart */}
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 300 }}>
                    {/* Grid lines */}
                    {yLabels.map((v, i) => (
                        <g key={i}>
                            <line
                                x1={PAD.left} y1={toY(v)}
                                x2={PAD.left + innerW} y2={toY(v)}
                                className="stroke-gray-200 dark:stroke-zinc-700"
                                strokeWidth="1" strokeDasharray="4,3"
                            />
                            <text x={PAD.left - 6} y={toY(v) + 4} textAnchor="end"
                                className="fill-gray-400 dark:fill-zinc-500"
                                fontSize="10">{v}</text>
                        </g>
                    ))}

                    {/* Area fill */}
                    <polygon
                        points={polyPoints}
                        fill="url(#progressGrad)"
                        opacity="0.3"
                    />
                    <defs>
                        <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Line */}
                    <polyline points={points}
                        fill="none" stroke="#ef4444" strokeWidth="3"
                        strokeLinejoin="round" strokeLinecap="round"
                    />

                    {/* Dots */}
                    {data.map((d, i) => (
                        <g key={i}>
                            <circle cx={toX(i)} cy={toY(d.maxWeight)} r={5}
                                fill="#ef4444" stroke="white" strokeWidth="2.5"
                            />
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {xIndices.map(i => {
                        const d = data[i]
                        const dateObj = new Date(d.date)
                        const label = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
                        return (
                            <text key={i} x={toX(i)} y={H - 6} textAnchor="middle"
                                className="fill-gray-400 dark:fill-zinc-500" fontSize="10" fontWeight="bold">
                                {label}
                            </text>
                        )
                    })}

                    {/* Tooltip on last point */}
                    {data.length > 0 && (() => {
                        const last = data[data.length - 1]
                        const lx = toX(data.length - 1)
                        const ly = toY(last.maxWeight)
                        return (
                            <g>
                                <rect x={lx - 32} y={ly - 30} width={64} height={24}
                                    rx={6} fill="#dc2626" />
                                <text x={lx} y={ly - 13} textAnchor="middle"
                                    fill="white" fontSize="11" fontWeight="800">
                                    {last.maxWeight} kg
                                </text>
                            </g>
                        )
                    })()}
                </svg>
            </div>
        </div>
    )
}
