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
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition relative group">
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

            <div className="flex flex-col md:flex-row justify-between md:items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-4 relative">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{formattedDate}</h3>
                    {routineName && (
                        <div className="inline-block mt-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full">
                            ตาราง: {routineName}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {log.notes && (
                        <div className="text-sm italic text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 mr-2">
                            &quot;{log.notes}&quot;
                        </div>
                    )}

                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition opacity-0 group-hover:opacity-100"
                        title="แก้ไขวัน/โน้ต"
                    >
                        ✏️
                    </button>
                    <button
                        onClick={() => setIsDeleting(true)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition opacity-0 group-hover:opacity-100"
                        title="ลบประวัติการฝึก"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg border-b dark:border-gray-600">ท่าออกกำลังกาย</th>
                            <th className="px-4 py-3 text-center border-b dark:border-gray-600">เซ็ต</th>
                            <th className="px-4 py-3 text-center border-b dark:border-gray-600">ครั้ง</th>
                            <th className="px-4 py-3 text-right rounded-tr-lg border-b dark:border-gray-600">น้ำหนัก (kg)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {log.workout_log_exercises.map((ex, idx) => {
                            const exName = Array.isArray(ex.exercises) ? ex.exercises[0]?.name : ex.exercises?.name
                            return (
                                <tr key={`${log.id}-${idx}`} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{exName || 'ไม่ทราบชื่อท่า'}</td>
                                    <td className="px-4 py-3 text-center">{ex.sets}</td>
                                    <td className="px-4 py-3 text-center">{ex.reps}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-blue-600 dark:text-blue-400">{ex.weight > 0 ? ex.weight : '-'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
