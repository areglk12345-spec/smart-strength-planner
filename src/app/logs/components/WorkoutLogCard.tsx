'use client'

import { useState } from 'react'
import { deleteWorkoutLog } from '@/app/actions/log'
import { useToast } from '@/app/components/Toast'
import { ConfirmModal } from '@/app/components/ConfirmModal'
import { EditLogModal } from './EditLogModal'

interface WorkoutLog {
    id: string
    date: string
    notes: string | null
    routines: { name: string } | null
    workout_log_exercises: {
        exercise_id: string
        sets: number
        reps: number
        weight: number
        exercises: { name: string }
    }[]
}

export function WorkoutLogCard({ log }: { log: WorkoutLog }) {
    const { toast } = useToast()
    const [isDeleting, setIsDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const dateObj = new Date(log.date)
    const formattedDate = dateObj.toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    })
    const routineName = Array.isArray(log.routines) ? log.routines[0]?.name : log.routines?.name

    async function handleDelete() {
        const res = await deleteWorkoutLog(log.id)
        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('ลบประวัติการฝึกแล้ว', 'success')
            setIsDeleting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 hover:shadow-md dark:hover:border-red-500/50 dark:hover:shadow-[0_8px_20px_rgba(220,38,38,0.15)] transition-all duration-300 relative group">
            {isDeleting && (
                <ConfirmModal
                    isOpen={isDeleting}
                    title="ลบประวัติการฝึกอออกกำลังกาย"
                    message={`คุณแน่ใจหรือไม่ว่าต้องการลบประวัติของวันที่ ${formattedDate}? ข้อมูลสถิติของวันนี้จะหายไปทั้งหมด`}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleting(false)}
                    confirmText="ยืนยันการลบ"
                />
            )}

            {isEditing && (
                <EditLogModal
                    log={log}
                    isOpen={isEditing}
                    onClose={() => setIsEditing(false)}
                />
            )}

            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4 relative">
                <div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">{formattedDate}</h3>
                    {routineName && (
                        <div className="inline-block mt-3 text-xs font-bold text-blue-700 dark:text-red-400 bg-blue-50 dark:bg-red-950/30 border border-blue-100 dark:border-red-900/50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                            ตาราง: {routineName}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {log.notes && (
                        <div className="text-sm italic text-gray-500 dark:text-zinc-400 bg-gray-50 dark:bg-zinc-950/50 p-3 rounded-xl border border-gray-200 dark:border-zinc-800 mr-2 max-w-xs truncate">
                            &quot;{log.notes}&quot;
                        </div>
                    )}

                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-red-400 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100"
                        title="แก้ไขวัน/โน้ต"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => setIsDeleting(true)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors opacity-0 group-hover:opacity-100"
                        title="ลบประวัติการฝึก"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-zinc-800">
                <table className="w-full text-sm text-left text-gray-600 dark:text-zinc-400">
                    <thead className="text-xs text-gray-700 dark:text-zinc-300 uppercase bg-gray-50 dark:bg-zinc-950">
                        <tr>
                            <th className="px-5 py-4 border-b dark:border-zinc-800">ท่าออกกำลังกาย</th>
                            <th className="px-5 py-4 text-center border-b dark:border-zinc-800">เซ็ต</th>
                            <th className="px-5 py-4 text-center border-b dark:border-zinc-800">ครั้ง</th>
                            <th className="px-5 py-4 text-right border-b dark:border-zinc-800">น้ำหนัก (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {log.workout_log_exercises.map((ex, idx) => {
                            const exName = Array.isArray(ex.exercises) ? ex.exercises[0]?.name : ex.exercises?.name
                            return (
                                <tr key={`${log.id}-${idx}`} className="bg-white dark:bg-zinc-900 border-b dark:border-zinc-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/80 transition-colors">
                                    <td className="px-5 py-4 font-bold text-gray-900 dark:text-zinc-100">{exName || 'ไม่ทราบชื่อท่า'}</td>
                                    <td className="px-5 py-4 text-center font-medium">{ex.sets}</td>
                                    <td className="px-5 py-4 text-center font-medium">{ex.reps}</td>
                                    <td className="px-5 py-4 text-right font-black text-blue-600 dark:text-red-400">{ex.weight > 0 ? ex.weight : <span className="text-gray-400">-</span>}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
