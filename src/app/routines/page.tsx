import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreateRoutineForm } from './components/CreateRoutineForm'
import { DeleteRoutineButton } from './components/DeleteRoutineButton'
import { ThemeToggle } from '../components/ThemeToggle'

interface Routine {
    id: string
    name: string
    description: string
    created_at: string
}

async function getRoutines() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('routines')
        .select('*')
        .order('created_at', { ascending: false })
    return data as Routine[] | null
}

export default async function RoutinesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    const routines = await getRoutines() || []

    return (
        <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">ตารางฝึกของฉัน 🗓️</h1>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Link href="/" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-white dark:bg-gray-800 px-4 py-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                            ← กลับหน้าหลัก
                        </Link>
                    </div>
                </div>

                <CreateRoutineForm />

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">รายการตารางฝึกที่คุณสร้างไว้</h2>
                    {routines.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">คุณยังไม่มีตารางฝึก สร้างตารางฝึกแรกเพื่อเริ่มจัดตารางได้เลย!</p>
                    ) : (
                        <ul className="space-y-3">
                            {routines.map((routine) => (
                                <li key={routine.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition bg-white dark:bg-gray-800 group flex justify-between items-start">
                                    <div>
                                        <div className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            <Link href={`/routines/${routine.id}`}>{routine.name}</Link>
                                        </div>
                                        {routine.description && (
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{routine.description}</p>
                                        )}
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-2">
                                        <Link href={`/routines/${routine.id}`} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1 rounded transition font-medium">
                                            จัดการท่าในตาราง →
                                        </Link>
                                        <DeleteRoutineButton id={routine.id} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    )
}
