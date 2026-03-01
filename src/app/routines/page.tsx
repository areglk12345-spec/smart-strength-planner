import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ChevronLeft, Plus } from 'lucide-react'
import { CreateRoutineForm } from './components/CreateRoutineForm'
import { RoutinesTabs } from './components/RoutinesTabs'
import { getPublicRoutines } from '../actions/routine'

interface Routine {
    id: string
    name: string
    description: string
    created_at: string
}

async function getMyRoutines() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('routines')
        .select('*')
        .order('created_at', { ascending: false })
    return data as Routine[] | null
}

export default async function RoutinesPage({
    searchParams
}: {
    searchParams: Promise<{ tab?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const myRoutines = await getMyRoutines()

    return (
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-gray-100 pb-20 sm:pb-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6 animate-fade-in-up">
                    <Link href="/" className="text-sm text-blue-500 hover:underline mb-1 flex items-center gap-1 group w-fit transition-colors">
                        <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        หน้าหลัก
                    </Link>
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Calendar size={28} className="text-blue-600 dark:text-red-500" />
                            <h1 className="text-3xl font-black gradient-text">ตารางฝึกของฉัน</h1>
                        </div>
                    </div>
                </div>

                <RoutinesTabs
                    myRoutines={myRoutines || []}
                    currentUserId={user.id}
                />
            </div>
        </main>
    )
}
