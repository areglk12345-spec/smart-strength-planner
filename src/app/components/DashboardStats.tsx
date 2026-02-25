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
            gradient: 'from-blue-500 to-cyan-400',
            bg: 'from-blue-500/10 to-cyan-400/10',
            border: 'border-blue-500/20',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            icon: '🗓️',
            label: 'ตารางฝึกของคุณ',
            value: totalRoutines,
            unit: 'ตาราง',
            gradient: 'from-emerald-500 to-teal-400',
            bg: 'from-emerald-500/10 to-teal-400/10',
            border: 'border-emerald-500/20',
            textColor: 'text-emerald-600 dark:text-emerald-400',
        },
        {
            icon: '🔥',
            label: 'ส่วนที่เน้นมากที่สุด',
            value: topMuscleGroup,
            unit: null,
            gradient: 'from-orange-500 to-red-400',
            bg: 'from-orange-500/10 to-red-400/10',
            border: 'border-orange-500/20',
            textColor: 'text-orange-600 dark:text-orange-400',
        },
        {
            icon: '📋',
            label: 'ตารางล่าสุด',
            value: latestRoutineName || 'ยังไม่มี',
            unit: null,
            gradient: 'from-purple-500 to-violet-400',
            bg: 'from-purple-500/10 to-violet-400/10',
            border: 'border-purple-500/20',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
            {stats.map((stat, i) => (
                <div key={i}
                    className={`animate-fade-in-up glass-card p-5 bg-gradient-to-br ${stat.bg} border ${stat.border} group cursor-default`}
                >
                    {/* Icon */}
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-xl mb-3 shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                        {stat.icon}
                    </div>
                    {/* Label */}
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        {stat.label}
                    </p>
                    {/* Value */}
                    <p className={`text-2xl font-extrabold ${stat.textColor} truncate`}>
                        {stat.value}
                        {stat.unit && (
                            <span className="text-sm font-normal text-gray-400 dark:text-gray-500 ml-1">
                                {stat.unit}
                            </span>
                        )}
                    </p>
                </div>
            ))}
        </div>
    )
}
