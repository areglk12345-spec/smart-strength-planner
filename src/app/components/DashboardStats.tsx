export function DashboardStats({
    totalExercises,
    totalRoutines,
    topMuscleGroup,
    latestRoutineName
}: {
    totalExercises: number
    totalRoutines: number
    topMuscleGroup: string
    latestRoutineName: string | null
}) {
    const stats = [
        {
            icon: '💪',
            label: 'ท่าออกกำลังกาย',
            value: totalExercises,
            unit: 'ท่า',
            gradient: 'from-blue-500 to-cyan-400 dark:from-red-600 dark:to-rose-600',
        },
        {
            icon: '🗓️',
            label: 'ตารางฝึกของคุณ',
            value: totalRoutines,
            unit: 'ตาราง',
            gradient: 'from-emerald-500 to-teal-400 dark:from-red-500 dark:to-red-700',
        },
        {
            icon: '🔥',
            label: 'ส่วนที่เน้นมากที่สุด',
            value: topMuscleGroup,
            unit: null,
            gradient: 'from-orange-500 to-red-400 dark:from-rose-600 dark:to-red-500',
        },
        {
            icon: '📋',
            label: 'ตารางล่าสุด',
            value: latestRoutineName || 'ยังไม่มี',
            unit: null,
            gradient: 'from-purple-500 to-violet-400 dark:from-red-700 dark:to-red-500',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
            {stats.map((stat, i) => (
                <div key={i}
                    className="animate-fade-in-up relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-white/60 dark:bg-zinc-900 backdrop-blur-md border border-white/40 dark:border-zinc-800 shadow-sm dark:shadow-lg group hover:shadow-md dark:hover:border-red-500/30 dark:hover:shadow-[0_8px_30px_rgba(220,38,38,0.1)] transition-all duration-300"
                >
                    <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}></div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-2xl mb-4 shadow-sm dark:shadow-[0_0_15px_rgba(220,38,38,0.2)] group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        {stat.icon}
                    </div>
                    {/* Label */}
                    <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider mb-1 relative z-10">
                        {stat.label}
                    </p>
                    {/* Value */}
                    <p className="text-3xl font-black text-gray-900 dark:text-zinc-100 truncate relative z-10 dark:drop-shadow-sm">
                        {stat.value}
                        {stat.unit && (
                            <span className="text-sm font-bold text-gray-400 dark:text-zinc-500 ml-1">
                                {stat.unit}
                            </span>
                        )}
                    </p>
                </div>
            ))}
        </div>
    )
}
