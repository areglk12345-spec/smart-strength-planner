interface StreakData {
    current: number
    best: number
    lastWorkout: string | null
}

export function StreakWidget({ streak }: { streak: StreakData }) {
    const { current, best, lastWorkout } = streak
    const isActive = current > 0

    const themeParams = current >= 30
        ? {
            bg: 'from-rose-500/10 to-orange-500/10 dark:from-red-600/20 dark:to-orange-600/20',
            border: 'border-orange-500/30 dark:border-red-500/50',
            text: 'text-orange-600 dark:text-red-500',
            icon: 'from-rose-500 to-orange-400 dark:from-red-500 dark:to-orange-500'
        }
        : current >= 14
            ? {
                bg: 'from-orange-500/10 to-amber-500/10 dark:from-red-700/20 dark:to-rose-600/20',
                border: 'border-amber-500/30 dark:border-red-500/40',
                text: 'text-amber-600 dark:text-red-400',
                icon: 'from-orange-500 to-amber-400 dark:from-red-600 dark:to-rose-500'
            }
            : current >= 7
                ? {
                    bg: 'from-amber-500/10 to-yellow-500/10 dark:from-red-800/30 dark:to-red-600/20',
                    border: 'border-yellow-500/30 dark:border-red-600/40',
                    text: 'text-yellow-600 dark:text-red-500',
                    icon: 'from-amber-500 to-yellow-400 dark:from-red-600 dark:to-red-500'
                }
                : {
                    bg: 'from-blue-500/5 to-cyan-500/5 dark:from-zinc-800/50 dark:to-red-900/20',
                    border: 'border-blue-500/20 dark:border-zinc-700',
                    text: 'text-blue-600 dark:text-zinc-300',
                    icon: 'from-blue-500 to-cyan-400 dark:from-red-700 dark:to-zinc-500'
                }

    const inactiveTheme = {
        bg: 'from-gray-500/5 to-gray-400/5 dark:from-zinc-800 dark:to-zinc-900',
        border: 'border-gray-500/20 dark:border-zinc-800',
        text: 'text-gray-500 dark:text-zinc-500',
        icon: 'from-gray-500 to-gray-400 dark:from-zinc-600 dark:to-zinc-700'
    }
    const theme = isActive ? themeParams : inactiveTheme;

    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white/60 dark:bg-zinc-900 backdrop-blur-md border ${theme.border} shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 hover:shadow-md dark:hover:shadow-[0_12px_40px_rgba(220,38,38,0.2)] group`}>
            {/* Edge Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} opacity-50 pointer-events-none`} />
            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${theme.bg} opacity-40 blur-3xl pointer-events-none group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity duration-500`} />

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className={`text-xs font-bold uppercase tracking-widest ${theme.text} mb-1 flex items-center gap-2`}>
                            <span className="relative flex h-2 w-2">
                                {isActive && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current`}></span>}
                                <span className={`relative inline-flex rounded-full h-2 w-2 bg-current`}></span>
                            </span>
                            Workout Streak
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl sm:text-7xl font-black leading-none text-gray-900 dark:text-zinc-100 tracking-tight dark:drop-shadow-sm">{current}</span>
                            <span className="text-xl font-bold text-gray-500 dark:text-zinc-500">วัน</span>
                        </div>
                    </div>
                    <div className={`text-6xl sm:text-7xl ${isActive ? 'animate-bounce dark:drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] drop-shadow-md' : 'opacity-20 grayscale'} bg-clip-text text-transparent bg-gradient-to-br ${theme.icon}`}>
                        🔥
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-4 border-t border-gray-200/50 dark:border-zinc-800 gap-2">
                    <div className="text-sm text-gray-600 dark:text-zinc-500 font-medium dark:tracking-wide">
                        🏆 สถิติสูงสุด: <span className="font-bold text-gray-900 dark:text-zinc-300">{best} วัน</span>
                    </div>
                    {lastWorkout && (
                        <div className="text-sm text-gray-600 dark:text-zinc-500 dark:tracking-wide">
                            ฝึกล่าสุด: {new Date(lastWorkout).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                </div>

                {!isActive && (
                    <div className="mt-4 text-sm font-medium text-gray-700 dark:text-zinc-400 bg-gray-100/50 dark:bg-zinc-950/50 rounded-xl px-4 py-3 border border-gray-200/50 dark:border-zinc-800">
                        💪 บันทึกการฝึกวันนี้เพื่อเริ่ม Streak ใหม่!
                    </div>
                )}
                {isActive && current >= 7 && (
                    <div className={`mt-4 text-sm font-medium dark:font-bold ${theme.text} bg-white/50 dark:bg-red-950/20 rounded-xl px-4 py-3 border ${theme.border}`}>
                        {current >= 30 ? '🌟 ต่อเนื่องมาแล้ว 1 เดือน! ยอดเยี่ยมมาก!' :
                            current >= 14 ? '🎯 2 อาทิตย์ต่อเนื่อง! เก่งมากครับ!' :
                                '⚡ 1 อาทิตย์แล้ว! ก้าวต่อไป!'}
                    </div>
                )}
            </div>
        </div>
    )
}
