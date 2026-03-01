'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, Globe, Settings, Eye, Copy, Check, Loader2 } from 'lucide-react'
import { CreateRoutineForm } from './CreateRoutineForm'
import { DeleteRoutineButton } from './DeleteRoutineButton'
import { cloneRoutine } from '../../actions/routine'
import { useRouter } from 'next/navigation'
import { useToast } from '../../components/Toast'

export function RoutinesTabs({
    myRoutines,
    currentUserId
}: {
    myRoutines: any[]
    currentUserId: string
}) {
    return (
        <div className="animate-fade-in-up space-y-6">
            <CreateRoutineForm />
            <div className="bg-white/70 dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md">
                <h2 className="text-xl font-black mb-6 text-gray-800 dark:text-zinc-100 tracking-tight flex items-center gap-2">
                    <User size={20} className="text-blue-600 dark:text-red-500" />
                    รายการตารางฝึกของฉัน
                </h2>
                {myRoutines.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/50 dark:bg-zinc-950/30 border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
                        <p className="text-gray-500 dark:text-zinc-500 font-medium italic">คุณยังไม่มีตารางฝึก สร้างตารางฝึกแรกเพื่อเริ่มจัดตารางได้เลย!</p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {myRoutines.map((routine) => (
                            <li key={routine.id} className="p-5 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:border-blue-300 dark:hover:border-red-500/50 hover:shadow-md dark:shadow-[0_8px_20px_rgba(220,38,38,0.1)] transition-all bg-gray-50/50 dark:bg-zinc-950/50 group flex flex-col justify-between">
                                <div>
                                    <div className="font-black text-xl text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-red-400 transition-colors tracking-tight">
                                        <Link href={`/routines/${routine.id}`}>{routine.name}</Link>
                                    </div>
                                    {routine.description && (
                                        <p className="text-gray-500 dark:text-zinc-400 text-sm mt-2 line-clamp-2 font-medium leading-relaxed">{routine.description}</p>
                                    )}
                                </div>
                                <div className="mt-5 flex items-center justify-between border-t border-gray-200 dark:border-zinc-800 pt-4">
                                    <Link href={`/routines/${routine.id}`} className="text-xs text-blue-600 dark:text-red-400 hover:text-blue-800 dark:hover:text-red-300 bg-blue-50 dark:bg-red-950/30 hover:bg-blue-100 dark:hover:bg-red-900/50 border border-transparent dark:border-red-900/30 px-4 py-2 rounded-xl transition-colors font-bold flex items-center gap-1.5">
                                        <Settings size={14} />
                                        จัดการข้อมูล
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
    )
}
