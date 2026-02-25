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
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition">
                <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    💪
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ท่าออกกำลังกายทั้งหมด</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalExercises} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ท่า</span></p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition">
                <div className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    🗓️
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ตารางฝึกของคุณ</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalRoutines} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">ตาราง</span></p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition">
                <div className="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    🔥
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ส่วนที่เน้นมากที่สุด</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">{topMuscleGroup}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 hover:shadow-md transition">
                <div className="bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold">
                    ⏱️
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ตารางที่สร้างล่าสุด</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                        {latestRoutineName || <span className="text-gray-400 font-normal italic">ยังไม่มีตาราง</span>}
                    </p>
                </div>
            </div>
        </div>
    )
}
