'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createRoutine(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }

    const name = formData.get('name')?.toString()
    const description = formData.get('description')?.toString()
    if (!name) return { error: 'กรุณากรอกชื่อตารางฝึก' }

    const { error } = await supabase.from('routines').insert([{ name, description: description || '', user_id: user.id }])
    if (error) return { error: 'เกิดข้อผิดพลาดในการสร้างตารางฝึก' }

    revalidatePath('/routines')
    return { success: true }
}

export async function deleteRoutine(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('routines').delete().eq('id', id)
    if (error) return { error: 'เกิดข้อผิดพลาดในการลบตารางฝึก' }
    revalidatePath('/routines')
    return { success: true }
}

export async function addExerciseToRoutine(routineId: string, exerciseId: string) {
    const supabase = await createClient()
    const { data: existingExercises } = await supabase
        .from('routine_exercises').select('order_index').eq('routine_id', routineId)
        .order('order_index', { ascending: false }).limit(1)

    const nextOrderIndex = existingExercises && existingExercises.length > 0 ? existingExercises[0].order_index + 1 : 0

    const { error } = await supabase.from('routine_exercises').insert([{ routine_id: routineId, exercise_id: exerciseId, order_index: nextOrderIndex }])
    if (error) {
        if (error.code === '23505') return { error: 'มีท่าออกกำลังกายนี้ในตารางฝึกแล้ว' }
        return { error: 'เกิดข้อผิดพลาดในการเพิ่มท่าเข้าตารางฝึก' }
    }

    revalidatePath(`/routines/${routineId}`)
    revalidatePath(`/exercises/${exerciseId}`)
    return { success: true }
}

export async function removeExerciseFromRoutine(routineId: string, exerciseId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('routine_exercises').delete().eq('routine_id', routineId).eq('exercise_id', exerciseId)
    if (error) return { error: 'เกิดข้อผิดพลาดในการลบท่าออกจากตารางฝึก' }
    revalidatePath(`/routines/${routineId}`)
    return { success: true }
}

// ── Phase 5: Sharing ─────────────────────────────────────────────────────────

export async function toggleRoutinePublic(routineId: string, currentValue: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const { error } = await supabase
        .from('routines')
        .update({ is_public: !currentValue })
        .eq('id', routineId)
        .eq('user_id', user.id)

    if (error) return { error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' }

    revalidatePath(`/routines/${routineId}`)
    return { success: true, is_public: !currentValue }
}

export async function cloneRoutine(sourceRoutineId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch the source routine (must be public or owned by user)
    const { data: source, error: srcError } = await supabase
        .from('routines')
        .select('name, description')
        .eq('id', sourceRoutineId)
        .single()

    if (srcError || !source) return { error: 'ไม่พบตารางฝึกที่ต้องการ Clone' }

    // Create a new routine for the current user
    const { data: newRoutine, error: createError } = await supabase
        .from('routines')
        .insert([{ name: `${source.name} (สำเนา)`, description: source.description, user_id: user.id }])
        .select('id')
        .single()

    if (createError || !newRoutine) return { error: 'เกิดข้อผิดพลาดในการสร้างตารางฝึกใหม่' }

    // Fetch exercises from source
    const { data: sourceExercises } = await supabase
        .from('routine_exercises')
        .select('exercise_id, order_index')
        .eq('routine_id', sourceRoutineId)
        .order('order_index', { ascending: true })

    if (sourceExercises && sourceExercises.length > 0) {
        const newExercises = sourceExercises.map(e => ({
            routine_id: newRoutine.id,
            exercise_id: e.exercise_id,
            order_index: e.order_index
        }))
        await supabase.from('routine_exercises').insert(newExercises)
    }

    revalidatePath('/routines')
    return { success: true, newRoutineId: newRoutine.id }
}

export async function getPublicRoutines() {
    const supabase = await createClient()

    const { data: routines, error } = await supabase
        .from('routines')
        .select(`
            id,
            name,
            description,
            user_id,
            profiles ( name, avatar_url ),
            routine_exercises ( exercises ( name, muscle_group ) )
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching public routines:', error)
        return []
    }

    return routines
}
