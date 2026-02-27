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

// ── Phase 33: Body Composition Goals ──────────────────────────────────────────

export async function getBodyGoal() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('goals')
        .select('id, target_body_fat, target_waist')
        .eq('user_id', user.id)
        .not('target_body_fat', 'is', null)
        .limit(1)
        .maybeSingle()

    return data ?? null
}

export async function upsertBodyGoal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const target_body_fat = formData.get('target_body_fat') ? Number(formData.get('target_body_fat')) : null
    const target_waist = formData.get('target_waist') ? Number(formData.get('target_waist')) : null
    const existingId = formData.get('existing_id')?.toString() || null

    if (existingId) {
        const { error } = await supabase
            .from('goals')
            .update({ target_body_fat, target_waist })
            .eq('id', existingId)
            .eq('user_id', user.id)
        if (error) return { error: 'เกิดข้อผิดพลาด' }
    } else {
        // Create a special body-goal row with no exercise_id (use a dummy target_weight = 0)
        const { error } = await supabase
            .from('goals')
            .insert({ user_id: user.id, target_body_fat, target_waist, target_weight: 0 })
        if (error) return { error: 'เกิดข้อผิดพลาด' }
    }

    revalidatePath('/goals')
    return { success: true }
}
