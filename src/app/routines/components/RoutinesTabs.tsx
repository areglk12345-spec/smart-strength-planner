'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CreateRoutineForm } from './CreateRoutineForm'
import { DeleteRoutineButton } from './DeleteRoutineButton'
import { cloneRoutine } from '../../actions/routine'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/Toast'

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
    const { toast } = useToast()

    async function handleClone(id: string) {
        setCloningId(id)
        const res = await cloneRoutine(id)
        setCloningId(null)
        if (res.error) {
            toast(res.error, 'error')
        } else if (res.newRoutineId) {
            toast('คัดลอกแบบฝึกสำเร็จ!', 'success')
            router.push(`/routines/${res.newRoutineId}`)
        }
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTab('mine')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${tab === 'mine'
                        ? 'bg-blue-600 dark:bg-red-600 text-white shadow-blue-500/30 dark:shadow-[0_4px_15px_rgba(220,38,38,0.3)]'
                        : 'glass-card bg-white/70 dark:bg-zinc-900 border border-white/40 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
                        }`}
                >
                    👤 ตารางของฉัน
                </button>
                <button
                    onClick={() => setTab('explore')}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm ${tab === 'explore'
                        ? 'bg-emerald-600 dark:bg-rose-600 text-white shadow-emerald-500/30 dark:shadow-[0_4px_15px_rgba(225,29,72,0.3)]'
                        : 'glass-card bg-white/70 dark:bg-zinc-900 border border-white/40 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
                        }`}
                >
                    🌍 สำรวจชุมชน
                </button>
            </div>

            {/* Content: My Routines */}
            {tab === 'mine' && (
                <div className="animate-fade-in-up space-y-6">
                    <CreateRoutineForm />
                    <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                        <h2 className="text-xl font-black mb-6 text-gray-800 dark:text-zinc-100 tracking-tight">รายการตารางฝึก</h2>
                        {myRoutines.length === 0 ? (
                            <p className="text-gray-500 dark:text-zinc-500 text-center py-8 font-medium">คุณยังไม่มีตารางฝึก สร้างตารางฝึกแรกเพื่อเริ่มจัดตารางได้เลย!</p>
                        ) : (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {myRoutines.map((routine) => (
                                    <li key={routine.id} className="p-5 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-blue-300 dark:hover:border-red-500/50 hover:shadow-md dark:shadow-[0_0_15px_rgba(220,38,38,0.05)] transition-all bg-gray-50/50 dark:bg-zinc-950/50 group flex flex-col justify-between">
                                        <div>
                                            <div className="font-black text-xl text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-red-400 transition-colors tracking-tight">
                                                <Link href={`/routines/${routine.id}`}>{routine.name}</Link>
                                            </div>
                                            {routine.description && (
                                                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2 line-clamp-2 font-medium">{routine.description}</p>
                                            )}
                                        </div>
                                        <div className="mt-5 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 pt-4">
                                            <Link href={`/routines/${routine.id}`} className="text-xs text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 bg-blue-50 dark:bg-red-950/30 hover:bg-blue-100 dark:hover:bg-red-900/50 border border-transparent dark:border-red-900/30 px-4 py-2 rounded-xl transition-colors font-bold flex items-center gap-1.5">
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
                <div className="animate-fade-in-up bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-3xl">🌍</span>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">ตารางฝึกสาธารณะ</h2>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium">ค้นหาและคัดลอกตารางฝึกดีๆ จากเพื่อนร่วมคอมมูนิตี้</p>
                        </div>
                    </div>

                    {publicRoutines.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 dark:text-zinc-500 font-medium bg-gray-50/50 dark:bg-zinc-950/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
                            ยังไม่มีตารางสาธารณะ
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {publicRoutines.map(r => {
                                const isMine = r.user_id === currentUserId
                                const exCount = r.routine_exercises?.length || 0
                                const tops = (r.routine_exercises || []).slice(0, 3).map((e: any) => e.exercises?.name).join(', ')

                                return (
                                    <div key={r.id} className="p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 hover:shadow-lg dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:dark:shadow-[0_4px_20px_rgba(225,29,72,0.15)] transition-all bg-white dark:bg-zinc-950/50 group">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-black text-lg text-gray-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-rose-400 transition-colors tracking-tight">{r.name}</h3>
                                                <div className="flex items-center gap-2 mt-1.5">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 dark:from-rose-600 dark:to-red-800 flex items-center justify-center text-xs text-white font-black overflow-hidden shadow-sm dark:shadow-[0_0_10px_rgba(225,29,72,0.3)] border-2 border-white dark:border-zinc-800">
                                                        {r.profiles?.avatar_url ? <img src={r.profiles.avatar_url} alt="avatar" className="w-full h-full object-cover" /> : (r.profiles?.name || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-xs text-gray-500 dark:text-zinc-400 font-bold">{r.profiles?.name || 'Anonymous'}</span>
                                                    {isMine && <span className="text-[10px] bg-blue-100 dark:bg-red-950/50 text-blue-600 dark:text-red-400 px-2 py-0.5 rounded-full font-black tracking-wide border border-transparent dark:border-red-900/30">ของฉัน</span>}
                                                </div>
                                            </div>
                                            <span className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm">
                                                {exCount} ท่า
                                            </span>
                                        </div>

                                        {r.description && <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 line-clamp-2 font-medium">{r.description}</p>}

                                        {exCount > 0 && (
                                            <div className="mb-5">
                                                <p className="text-xs text-gray-400 dark:text-zinc-500 font-bold mb-1.5 uppercase tracking-wide">ตัวอย่างท่า:</p>
                                                <p className="text-xs text-gray-700 dark:text-zinc-300 truncate bg-gray-50 dark:bg-zinc-900/80 rounded-xl px-4 py-2.5 border border-gray-100 dark:border-zinc-800 font-medium">
                                                    {tops} {exCount > 3 ? '...' : ''}
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex gap-3">
                                            <Link href={`/routines/${r.id}`} className="flex-1 text-center text-xs font-black bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 py-2.5 rounded-xl transition-colors">
                                                👁️ ดูรายละเอียด
                                            </Link>
                                            {!isMine && (
                                                <button
                                                    onClick={() => handleClone(r.id)}
                                                    disabled={cloningId === r.id}
                                                    className="flex-1 text-center text-xs font-black bg-emerald-50 dark:bg-rose-950/30 text-emerald-600 dark:text-rose-400 hover:bg-emerald-100 dark:hover:bg-rose-900/50 border border-emerald-200 dark:border-rose-900/30 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex justify-center items-center gap-1.5"
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
