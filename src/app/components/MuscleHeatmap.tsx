// Muscle group → SVG path mapping (simplified body outline)
// Colors scale from gray (0) → blue → orange → red based on set count

const MUSCLE_PATHS: Record<string, { paths: string[]; label: string; x: number; y: number }> = {
    'หน้าอก': {
        label: 'หน้าอก',
        x: 100, y: 95,
        paths: ['M 82,80 Q 100,70 118,80 L 122,105 Q 100,115 78,105 Z']
    },
    'หลัง': {
        label: 'หลัง',
        x: 260, y: 95,
        paths: ['M 242,80 Q 260,70 278,80 L 282,115 Q 260,120 238,115 Z']
    },
    'ไหล่': {
        label: 'ไหล่',
        x: 100, y: 75,
        paths: [
            'M 68,75 Q 78,65 82,80 L 76,100 Q 62,90 60,80 Z',
            'M 132,75 Q 122,65 118,80 L 124,100 Q 138,90 140,80 Z',
            'M 228,75 Q 238,65 242,80 L 236,100 Q 222,90 220,80 Z',
            'M 292,75 Q 282,65 278,80 L 284,100 Q 298,90 300,80 Z',
        ]
    },
    'แขน': {
        label: 'แขน',
        x: 100, y: 120,
        paths: [
            'M 60,100 Q 52,115 54,135 L 64,135 Q 66,115 70,100 Z',
            'M 140,100 Q 148,115 146,135 L 136,135 Q 134,115 130,100 Z',
            'M 220,100 Q 212,115 214,135 L 224,135 Q 226,115 230,100 Z',
            'M 300,100 Q 308,115 306,135 L 296,135 Q 294,115 290,100 Z',
        ]
    },
    'ท้อง': {
        label: 'ท้อง',
        x: 100, y: 125,
        paths: ['M 84,110 Q 100,108 116,110 L 114,145 Q 100,148 86,145 Z']
    },
    'ขาหน้า': {
        label: 'ต้นขา',
        x: 100, y: 175,
        paths: [
            'M 86,148 L 82,195 Q 90,200 98,195 L 100,148 Z',
            'M 100,148 L 102,195 Q 110,200 118,195 L 114,148 Z',
            'M 242,148 L 238,195 Q 246,200 254,195 L 256,148 Z',
            'M 256,148 L 258,195 Q 266,200 274,195 L 270,148 Z',
        ]
    },
    'น่อง': {
        label: 'น่อง',
        x: 100, y: 215,
        paths: [
            'M 83,198 Q 82,220 86,235 L 96,235 Q 98,220 99,198 Z',
            'M 101,198 Q 103,220 104,235 L 114,235 Q 116,220 117,198 Z',
            'M 239,198 Q 238,220 242,235 L 252,235 Q 254,220 255,198 Z',
            'M 257,198 Q 259,220 260,235 L 270,235 Q 272,220 273,198 Z',
        ]
    },
    'สะโพก': {
        label: 'สะโพก',
        x: 260, y: 155,
        paths: ['M 238,145 Q 260,140 282,145 L 278,180 Q 260,185 242,180 Z']
    },
}

function getColor(sets: number, maxSets: number) {
    if (maxSets === 0 || sets === 0) return 'rgba(148,163,184,0.15)'
    const t = sets / maxSets
    if (t < 0.33) return `rgba(59,130,246,${0.3 + t * 0.5})`
    if (t < 0.66) return `rgba(249,115,22,${0.4 + t * 0.4})`
    return `rgba(239,68,68,${0.5 + t * 0.4})`
}

interface Props {
    muscleSetCounts: Record<string, number>
}

export function MuscleHeatmap({ muscleSetCounts }: Props) {
    const maxSets = Math.max(0, ...Object.values(muscleSetCounts))

    // Sort muscles by sets descending
    const sorted = Object.entries(muscleSetCounts).sort((a, b) => b[1] - a[1])

    return (
        <div className="bg-white/70 dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-zinc-800 pb-4">
                <h3 className="font-black text-gray-900 dark:text-zinc-100 tracking-tight text-lg">📊 Muscle Heatmap</h3>
                <span className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">30 วันล่าสุด</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center">
                {/* SVG Body */}
                <div className="shrink-0">
                    <svg viewBox="0 0 360 270" width="280" className="mx-auto">
                        {/* Body outline front */}
                        {/* Head */}
                        <circle cx="100" cy="45" r="22" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />
                        {/* Torso front */}
                        <rect x="78" y="67" width="44" height="82" rx="8" fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={1.5} />
                        {/* Head back */}
                        <circle cx="260" cy="45" r="22" fill="none" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />
                        {/* Torso back */}
                        <rect x="238" y="67" width="44" height="82" rx="8" fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={1.5} />

                        {/* Muscle overlays */}
                        {Object.entries(MUSCLE_PATHS).map(([key, def]) => {
                            const sets = muscleSetCounts[key] ?? 0
                            const color = getColor(sets, maxSets)
                            return def.paths.map((path, i) => (
                                <path key={`${key}-${i}`} d={path} fill={color}
                                    stroke="none" rx={4} />
                            ))
                        })}

                        {/* Labels */}
                        <text x="100" y="260" textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>ด้านหน้า</text>
                        <text x="260" y="260" textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>ด้านหลัง</text>
                    </svg>
                </div>

                {/* Legend / Stats */}
                <div className="flex-1 w-full">
                    {sorted.length === 0 ? (
                        <p className="text-sm font-medium text-gray-400 dark:text-zinc-500 text-center bg-gray-50 dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800">
                            ยังไม่มีข้อมูล — บันทึกการฝึกก่อนครับ
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {sorted.map(([muscle, sets]) => {
                                const pct = maxSets > 0 ? Math.round((sets / maxSets) * 100) : 0
                                return (
                                    <div key={muscle} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 w-16 shrink-0 uppercase tracking-wide">{muscle}</span>
                                        <div className="flex-1 h-2.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className="h-full rounded-full transition-all duration-500 shadow-sm"
                                                style={{
                                                    width: `${pct}%`,
                                                    background: pct > 66 ? 'linear-gradient(to right, #ef4444, #b91c1c)' : pct > 33 ? 'linear-gradient(to right, #f97316, #c2410c)' : 'linear-gradient(to right, #3b82f6, #1d4ed8)'
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-gray-600 dark:text-zinc-400 w-14 text-right">{sets} sets</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Color legend */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 dark:border-zinc-800 text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm" /> น้อย</div>
                        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm" /> กลาง</div>
                        <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-md bg-gradient-to-br from-red-500 to-red-700 shadow-sm" /> มาก</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
