import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import NutritionClient from './NutritionClient'
import { getNutritionLogs } from '@/app/actions/nutrition'

export default async function NutritionPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const today = new Date().toISOString().split('T')[0]
    const logs = await getNutritionLogs(today)

    // Fetch user goals to show nutrition targets
    const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .or('type.eq.calorie_intake,type.eq.body_weight')

    const calorieGoal = goals?.find(g => g.type === 'calorie_intake')?.target_value || 2500
    // Default macro targets (standard 40/40/20 or similar, can be customized later)
    const macroTargets = {
        protein: (calorieGoal * 0.3) / 4,
        carbs: (calorieGoal * 0.4) / 4,
        fat: (calorieGoal * 0.3) / 9
    }

    return (
        <NutritionClient
            initialLogs={logs}
            calorieGoal={calorieGoal}
            macroTargets={macroTargets}
        />
    )
}
