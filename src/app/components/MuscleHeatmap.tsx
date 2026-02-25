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
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-gray-800 dark:text-gray-200">📊 Muscle Heatmap</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500">30 วันล่าสุด</span>
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
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
                            ยังไม่มีข้อมูล — บันทึกการฝึกก่อนครับ
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {sorted.map(([muscle, sets]) => {
                                const pct = maxSets > 0 ? Math.round((sets / maxSets) * 100) : 0
                                return (
                                    <div key={muscle} className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-20 shrink-0">{muscle}</span>
                                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${pct}%`,
                                                    background: pct > 66 ? '#ef4444' : pct > 33 ? '#f97316' : '#3b82f6'
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-12 text-right">{sets} sets</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {/* Color legend */}
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-blue-500/50" /> น้อย</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-orange-500/70" /> ปานกลาง</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500/80" /> มาก</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
