interface StreakData {
    current: number
    best: number
    lastWorkout: string | null
}

export function StreakWidget({ streak }: { streak: StreakData }) {
    const { current, best, lastWorkout } = streak
    const isActive = current > 0

    const flameColor = current >= 30
        ? 'from-red-500 to-orange-400'
        : current >= 14
            ? 'from-orange-500 to-yellow-400'
            : current >= 7
                ? 'from-yellow-500 to-amber-400'
                : 'from-amber-400 to-yellow-300'

    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg ${isActive ? `bg-gradient-to-br ${flameColor}` : 'bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-700 dark:to-gray-600'}`}>
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/5" />

            <div className="relative">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-widest text-white/70 mb-1">Workout Streak</div>
                        <div className="flex items-end gap-2">
                            <span className="text-6xl font-black leading-none">{current}</span>
                            <span className="text-xl font-semibold mb-1 text-white/80">วัน</span>
                        </div>
                    </div>
                    <div className={`text-5xl ${isActive ? 'animate-bounce' : 'opacity-30'}`}>
                        🔥
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                    <div className="text-xs text-white/70">
                        🏆 สถิติสูงสุด: <span className="font-bold text-white">{best} วัน</span>
                    </div>
                    {lastWorkout && (
                        <div className="text-xs text-white/70">
                            ฝึกล่าสุด: {new Date(lastWorkout).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                </div>

                {!isActive && (
                    <div className="mt-3 text-xs text-white/80 bg-white/10 rounded-lg px-3 py-2">
                        💪 บันทึกการฝึกวันนี้เพื่อเริ่ม Streak ใหม่!
                    </div>
                )}
                {current >= 7 && (
                    <div className="mt-3 text-xs text-white/90 bg-white/10 rounded-lg px-3 py-2">
                        {current >= 30 ? '🌟 ต่อเนื่องมาแล้ว 1 เดือน! ยอดเยี่ยมมาก!' :
                            current >= 14 ? '🎯 2 อาทิตย์ต่อเนื่อง! เก่งมากครับ!' :
                                '⚡ 1 อาทิตย์แล้ว! ก้าวต่อไป!'}
                    </div>
                )}
            </div>
        </div>
    )
}
