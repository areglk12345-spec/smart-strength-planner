'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CreateRoutineForm } from './CreateRoutineForm'
import { DeleteRoutineButton } from './DeleteRoutineButton'
import { cloneRoutine } from '../../actions/routine'
import { useRouter } from 'next/navigation'

export function RoutinesTabs({
    activeTab,
    myRoutines,
    publicRoutines,
    currentUserId
}: {
    activeTab: 'mine' | 'explore'
    myRoutines: any[]
    publicRoutines: any[]
    currentUserId: string
}) {
    const [tab, setTab] = useState(activeTab)
    const [cloningId, setCloningId] = useState<string | null>(null)
    const router = useRouter()

    async function handleClone(id: string) {
        setCloningId(id)
        const res = await cloneRoutine(id)
        setCloningId(null)
        if (res.error) {
            alert(res.error)
        } else if (res.newRoutineId) {
            router.push(`/routines/${res.newRoutineId}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTab('mine')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-sm ${tab === 'mine'
                            ? 'bg-blue-600 text-white shadow-blue-500/30'
                            : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    👤 ตารางของฉัน
                </button>
                <button
                    onClick={() => setTab('explore')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition shadow-sm ${tab === 'explore'
                            ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                            : 'glass-card text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                >
                    🌍 สำรวจชุมชน
                </button>
            </div>

            {/* Content: My Routines */}
            {tab === 'mine' && (
                <div className="animate-fade-in-up space-y-6">
                    <CreateRoutineForm />
                    <div className="glass-card p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">รายการตารางฝึก</h2>
                        {myRoutines.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">คุณยังไม่มีตารางฝึก สร้างตารางฝึกแรกเพื่อเริ่มจัดตารางได้เลย!</p>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {myRoutines.map((routine) => (
                                    <li key={routine.id} className="p-4 border border-gray-100 dark:border-gray-700/50 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition bg-gray-50/50 dark:bg-gray-800/50 group flex flex-col justify-between">
                                        <div>
                                            <div className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                <Link href={`/routines/${routine.id}`}>{routine.name}</Link>
                                            </div>
                                            {routine.description && (
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{routine.description}</p>
                                            )}
                                        </div>
                                        <div className="mt-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
                                            <Link href={`/routines/${routine.id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 rounded-lg transition font-bold flex items-center gap-1">
                                                <span>⚙️</span> จัดการ
                                            </Link>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <DeleteRoutineButton id={routine.id} />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}

            {/* Content: Explore */}
            {tab === 'explore' && (
                <div className="animate-fade-in-up glass-card p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-2xl">🌍</span>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">ตารางฝึกสาธารณะ</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">ค้นหาและคัดลอกตารางฝึกดีๆ จากเพื่อนร่วมคอมมูนิตี้</p>
                        </div>
                    </div>

                    {publicRoutines.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                            ยังไม่มีตารางสาธารณะ
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {publicRoutines.map(r => {
                                const isMine = r.user_id === currentUserId
                                const exCount = r.routine_exercises?.length || 0
                                const tops = (r.routine_exercises || []).slice(0, 3).map((e: any) => e.exercises?.name).join(', ')

                                return (
                                    <div key={r.id} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 hover:shadow-lg transition bg-white dark:bg-gray-800/80 group">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-extrabold text-lg text-gray-900 dark:text-gray-100">{r.name}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold overflow-hidden">
                                                        {r.profiles?.avatar_url ? <img src={r.profiles.avatar_url} alt="avatar" /> : (r.profiles?.name || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{r.profiles?.name || 'Anonymous'}</span>
                                                    {isMine && <span className="text-[9px] bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-bold">ของฉัน</span>}
                                                </div>
                                            </div>
                                            <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-lg text-xs font-bold">
                                                {exCount} ท่า
                                            </span>
                                        </div>

                                        {r.description && <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{r.description}</p>}

                                        {exCount > 0 && (
                                            <div className="mb-4">
                                                <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mb-1">ตัวอย่างท่า:</p>
                                                <p className="text-xs text-gray-700 dark:text-gray-300 truncate bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 border border-gray-100 dark:border-gray-800">
                                                    {tops} {exCount > 3 ? '...' : ''}
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                                            <Link href={`/routines/${r.id}`} className="flex-1 text-center text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-xl transition">
                                                👁️ ดูรายละเอียด
                                            </Link>
                                            {!isMine && (
                                                <button
                                                    onClick={() => handleClone(r.id)}
                                                    disabled={cloningId === r.id}
                                                    className="flex-1 text-center text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800/50 py-2 rounded-xl transition disabled:opacity-50 flex justify-center items-center gap-1"
                                                >
                                                    {cloningId === r.id ? '⏳ กำลังคัดลอก...' : '✅ คัดลอกแบบฝึก'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
