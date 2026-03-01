'use client'

import { Trophy, TrendingUp, Zap, Target } from 'lucide-react'

interface DataPoint {
    date: string
    maxWeight: number
    sets: number
    reps: number
    calculated_1rm: number
}

interface Props {
    data: DataPoint[]
    exerciseName?: string
}

export function ProgressChart({ data, exerciseName }: Props) {
    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700 text-gray-500 dark:text-zinc-500">
                <TrendingUp className="text-gray-300 dark:text-zinc-700 mb-3 grayscale opacity-50" size={48} />
                <span className="text-sm font-medium">ยังไม่มีข้อมูล — บันทึกการฝึกก่อนเลย!</span>
            </div>
        )
    }

    if (data.length === 1) {
        const point = data[0]
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 dark:bg-zinc-900 p-6 rounded-3xl border border-white/40 dark:border-zinc-800 shadow-sm backdrop-blur-md text-center">
                        <div className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">น้ำหนักสูงสุด</div>
                        <div className="text-4xl font-black text-blue-600 dark:text-red-500 drop-shadow-sm">{point.maxWeight} <span className="text-xl">kg</span></div>
                    </div>
                    <div className="bg-white/70 dark:bg-zinc-900 p-6 rounded-3xl border border-white/40 dark:border-zinc-800 shadow-sm backdrop-blur-md text-center">
                        <div className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-1">Estimated 1RM</div>
                        <div className="text-4xl font-black text-purple-600 dark:text-red-400 drop-shadow-sm">{point.calculated_1rm} <span className="text-xl">kg</span></div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center h-24 bg-gray-50/50 dark:bg-zinc-950/20 border border-dashed border-gray-200 dark:border-zinc-800 rounded-3xl text-gray-400 dark:text-zinc-500">
                    <div className="text-xs font-bold uppercase tracking-wide">บันทึกเพิ่มอีกอย่างน้อย 1 ครั้งเพื่อดูกราฟ</div>
                </div>
            </div>
        )
    }

    // Chart calculations
    const W = 600
    const H = 220
    const PAD = { top: 20, right: 30, bottom: 40, left: 50 }
    const innerW = W - PAD.left - PAD.right
    const innerH = H - PAD.top - PAD.bottom

    const max1RM_all = data.map(d => d.calculated_1rm)
    const weights_all = data.map(d => d.maxWeight)
    const minVal = Math.min(...weights_all) * 0.95
    const maxVal = Math.max(...max1RM_all) * 1.05
    const range = maxVal - minVal || 1

    const xStep = innerW / (data.length - 1)
    const toX = (i: number) => PAD.left + i * xStep
    const toY = (v: number) => PAD.top + innerH - ((v - minVal) / range) * innerH

    // Line for Max Weight
    const weightPoints = data.map((d, i) => `${toX(i)},${toY(d.maxWeight)}`).join(' ')

    // Line for 1RM
    const rmPoints = data.map((d, i) => `${toX(i)},${toY(d.calculated_1rm)}`).join(' ')

    // Y-axis labels
    const yLabels = [minVal, minVal + range / 2, maxVal].map(v => Math.round(v))

    const xIndices = data.length <= 6
        ? data.map((_, i) => i)
        : [0, Math.floor((data.length - 1) / 4), Math.floor((data.length - 1) / 2), Math.floor(3 * (data.length - 1) / 4), data.length - 1]

    const improvement = data[data.length - 1].calculated_1rm - data[0].calculated_1rm
    const pr1rm = Math.max(...max1RM_all)

    return (
        <div>
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-zinc-950/30 border border-blue-100 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
                    <div className="text-[10px] font-black text-blue-600 dark:text-red-500 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
                        <Trophy size={10} /> Max Weight
                    </div>
                    <div className="text-2xl font-black text-blue-700 dark:text-zinc-100 tracking-tight">{Math.max(...weights_all)} <span className="text-xs font-bold text-blue-500/70">kg</span></div>
                </div>

                <div className="bg-purple-50 dark:bg-zinc-950/30 border border-purple-100 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
                    <div className="text-[10px] font-black text-purple-600 dark:text-red-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
                        <Zap size={10} /> 1RM สูงสุด
                    </div>
                    <div className="text-2xl font-black text-purple-700 dark:text-zinc-100 tracking-tight">{pr1rm} <span className="text-xs font-bold text-purple-500/70">kg</span></div>
                </div>

                <div className={`border rounded-2xl p-4 text-center shadow-sm ${improvement >= 0 ? 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'}`}>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1 ${improvement >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                        <TrendingUp size={10} /> ความแข็งแรง
                    </div>
                    <div className={`text-2xl font-black tracking-tight ${improvement >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)} <span className="text-xs font-bold opacity-70">kg</span>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-zinc-950/30 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 text-center shadow-sm">
                    <div className="text-[10px] font-black text-gray-500 dark:text-zinc-500 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
                        <Target size={10} /> เซสชัน
                    </div>
                    <div className="text-2xl font-black text-gray-700 dark:text-zinc-200 tracking-tight">{data.length}</div>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 px-2">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-red-600" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Weight</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500 dark:bg-red-400" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estimated 1RM</span>
                </div>
            </div>

            {/* SVG Chart */}
            <div className="overflow-x-auto">
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 400 }}>
                    {/* Grid lines */}
                    {yLabels.map((v, i) => (
                        <g key={i}>
                            <line
                                x1={PAD.left} y1={toY(v)}
                                x2={PAD.left + innerW} y2={toY(v)}
                                className="stroke-gray-100 dark:stroke-zinc-800"
                                strokeWidth="1" strokeDasharray="4,4"
                            />
                            <text x={PAD.left - 10} y={toY(v) + 4} textAnchor="end"
                                className="fill-gray-400 dark:fill-zinc-600 font-bold"
                                fontSize="10">{v}</text>
                        </g>
                    ))}

                    {/* 1RM Line (Faded in background) */}
                    <polyline points={rmPoints}
                        fill="none" stroke="#a855f7" strokeWidth="2"
                        className="dark:stroke-red-400/50"
                        strokeLinejoin="round" strokeLinecap="round" strokeDasharray="5,3"
                    />

                    {/* Max Weight Line (Primary) */}
                    <polyline points={weightPoints}
                        fill="none" stroke="#2563eb" strokeWidth="4"
                        className="dark:stroke-red-600"
                        strokeLinejoin="round" strokeLinecap="round"
                    />

                    {/* Dots for Weight */}
                    {data.map((d, i) => (
                        <circle key={i} cx={toX(i)} cy={toY(d.maxWeight)} r={5}
                            fill="#2563eb" className="dark:fill-red-600" stroke="white" strokeWidth="2.5"
                        />
                    ))}

                    {/* X-axis labels */}
                    {xIndices.map(i => {
                        const d = data[i]
                        const dateObj = new Date(d.date)
                        const label = dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
                        return (
                            <text key={i} x={toX(i)} y={H - 8} textAnchor="middle"
                                className="fill-gray-400 dark:fill-zinc-600" fontSize="10" fontWeight="black">
                                {label}
                            </text>
                        )
                    })}
                </svg>
            </div>

            <p className="text-[10px] text-gray-400 dark:text-zinc-600 italic mt-4 text-center font-medium">
                * Estimated 1RM คำนวณโดยใช้สูตร Brzycki: Weight × (36 / (37 - Reps))
            </p>
        </div>
    )
}
