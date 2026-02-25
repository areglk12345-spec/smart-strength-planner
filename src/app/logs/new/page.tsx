import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { WorkoutLogForm } from '../components/WorkoutLogForm'

export default async function NewLogPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const resolvedParams = await searchParams
    const routineId = typeof resolvedParams.routine_id === 'string' ? resolvedParams.routine_id : null

    // 1. Fetch available exercises for Dropdown
    const { data: allExercises } = await supabase
        .from('exercises')
        .select('id, name')
        .order('name')

    let initialExercises: any[] = []

    // 2. If coming from a routine, pre-fill the form with routine exercises
    if (routineId) {
        const { data: routineExercises } = await supabase
            .from('routine_exercises')
            .select(`
                exercise_id,
                exercises ( id, name )
            `)
            .eq('routine_id', routineId)
            .order('order_index', { ascending: true })

        if (routineExercises) {
            initialExercises = routineExercises.map(re => {
                const ex = Array.isArray(re.exercises) ? re.exercises[0] : re.exercises
                return {
                    exercise_id: re.exercise_id,
                    name: ex?.name || 'Unknown',
                    sets: 1,
                    reps: 0,
                    weight: 0
                }
            })
        }
    }

    return (
        <main className="min-h-screen p-8 bg-gray-50 text-gray-900">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">บันทึกสถิติการออกกำลังกาย ✍️</h1>
                    <p className="text-gray-600">จดบันทึกเซ็ตและน้ำหนักที่คุณยกในวันนี้ เพื่อดูการพัฒนาของตัวเอง</p>
                </div>

                <WorkoutLogForm
                    routineId={routineId}
                    initialExercises={initialExercises}
                    allExercises={allExercises || []}
                />
            </div>
        </main>
    )
}
