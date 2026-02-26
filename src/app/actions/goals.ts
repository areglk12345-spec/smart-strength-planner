'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function getGoals() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('goals')
        .select(`
            id,
            target_weight,
            target_date,
            notes,
            exercise_id,
            exercises ( id, name, muscle_group )
        `)
        .eq('user_id', user.id)
        .order('target_date', { ascending: true })

    return data ?? []
}

export async function createGoal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const exercise_id = formData.get('exercise_id') as string
    const target_weight = Number(formData.get('target_weight'))
    const target_date = formData.get('target_date') as string || null
    const notes = formData.get('notes') as string || null

    if (!exercise_id || !target_weight) return { error: 'กรุณากรอกข้อมูลให้ครบ' }

    const { error } = await supabase.from('goals').insert({
        user_id: user.id,
        exercise_id,
        target_weight,
        target_date,
        notes,
    })

    if (error) return { error: error.message }

    revalidatePath('/goals')
    return { success: true }
}

export async function deleteGoal(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const { error } = await supabase.from('goals').delete().eq('id', id).eq('user_id', user.id)
    if (error) return { error: error.message }

    revalidatePath('/goals')
    return { success: true }
}

export async function getCurrentBestForExercise(exerciseId: string): Promise<number> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    const { data } = await supabase
        .from('workout_log_exercises')
        .select(`weight, workout_logs!inner ( user_id )`)
        .eq('exercise_id', exerciseId)
        .eq('workout_logs.user_id', user.id)
        .order('weight', { ascending: false })
        .limit(1)

    return data?.[0]?.weight ?? 0
}

// ── Phase 22: CRUD for Goals ──────────────────────────────────────────────────

export async function updateGoal(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const target_weight = Number(formData.get('target_weight'))
    const target_date = formData.get('target_date') as string || null
    const notes = formData.get('notes') as string || null

    if (!target_weight) return { error: 'กรุณาระบุน้ำหนักเป้าหมาย' }

    const { error } = await supabase
        .from('goals')
        .update({ target_weight, target_date, notes })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating goal:', error)
        return { error: 'เกิดข้อผิดพลาดในการแก้ไขเป้าหมาย' }
    }

    revalidatePath('/goals')
    return { success: true }
}
