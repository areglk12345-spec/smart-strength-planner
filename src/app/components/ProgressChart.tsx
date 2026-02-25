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
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 dark:bg-gray-700 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500">
                <span className="text-3xl mb-2">📊</span>
                <span className="text-sm">ยังไม่มีข้อมูล — บันทึกการฝึกก่อนเลย!</span>
            </div>
        )
    }

    if (data.length === 1) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{data[0].maxWeight} kg</div>
                <div className="text-sm mt-1">บันทึกเพิ่มอีกอย่างน้อย 1 ครั้งเพื่อดูกราฟ</div>
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
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-3 text-center">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wide mb-1">PR สูงสุด</div>
                    <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-300">{pr} <span className="text-sm font-normal">kg</span></div>
                </div>
                <div className={`border rounded-xl p-3 text-center ${improvement >= 0 ? 'bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800'}`}>
                    <div className={`text-xs font-semibold uppercase tracking-wide mb-1 ${improvement >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>พัฒนาการ</div>
                    <div className={`text-2xl font-extrabold ${improvement >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)} <span className="text-sm font-normal">kg</span>
                    </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800 rounded-xl p-3 text-center">
                    <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wide mb-1">จำนวนเซสชัน</div>
                    <div className="text-2xl font-extrabold text-purple-700 dark:text-purple-300">{data.length}</div>
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
                                className="stroke-gray-200 dark:stroke-gray-600"
                                strokeWidth="1" strokeDasharray="4,3"
                            />
                            <text x={PAD.left - 6} y={toY(v) + 4} textAnchor="end"
                                className="fill-gray-400 dark:fill-gray-500"
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
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Line */}
                    <polyline points={points}
                        fill="none" stroke="#3b82f6" strokeWidth="2.5"
                        strokeLinejoin="round" strokeLinecap="round"
                    />

                    {/* Dots */}
                    {data.map((d, i) => (
                        <g key={i}>
                            <circle cx={toX(i)} cy={toY(d.maxWeight)} r={5}
                                fill="#3b82f6" stroke="white" strokeWidth="2"
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
                                className="fill-gray-400 dark:fill-gray-500" fontSize="10">
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
                                <rect x={lx - 28} y={ly - 26} width={56} height={20}
                                    rx={4} fill="#3b82f6" />
                                <text x={lx} y={ly - 12} textAnchor="middle"
                                    fill="white" fontSize="11" fontWeight="700">
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
