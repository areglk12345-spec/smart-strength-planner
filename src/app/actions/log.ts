'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createWorkoutLog(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }

    const date = formData.get('date')?.toString() || new Date().toISOString().split('T')[0]
    const notes = formData.get('notes')?.toString()
    const routineId = formData.get('routine_id')?.toString() || null
    const exercisesStr = formData.get('exercises_json')?.toString()

    if (!exercisesStr) return { error: 'ไม่พบข้อมูลท่าออกกำลังกาย' }

    let exercisesData: any[]
    try {
        exercisesData = JSON.parse(exercisesStr)
    } catch (e) {
        return { error: 'รูปแบบข้อมูลไม่ถูกต้อง' }
    }
    if (!exercisesData || exercisesData.length === 0) return { error: 'ต้องมีท่าออกกำลังกายอย่างน้อย 1 ท่า' }

    const { data: logData, error: logError } = await supabase
        .from('workout_logs')
        .insert([{ user_id: user.id, date, notes, routine_id: routineId }])
        .select()
        .single()

    if (logError || !logData) return { error: 'เกิดข้อผิดพลาดในการสร้างบันทึก (Log)' }

    const logExercises = exercisesData.map(ex => ({
        workout_log_id: logData.id,
        exercise_id: ex.exercise_id,
        sets: Number(ex.sets) || 1,
        reps: Number(ex.reps) || 0,
        weight: Number(ex.weight) || 0
    }))

    const { error: exercisesError } = await supabase.from('workout_log_exercises').insert(logExercises)
    if (exercisesError) return { error: 'เกิดข้อผิดพลาดในการบันทึกท่าออกกำลังกายในเซสชันนี้' }

    // ── PR Detection ──────────────────────────────────────────────────────────
    const prs: { exerciseName: string; weight: number; exerciseId: string }[] = []

    for (const ex of exercisesData) {
        if (!ex.weight || Number(ex.weight) <= 0) continue

        // Get the user's PREVIOUS max weight for this exercise (excluding this log)
        const { data: prevBest } = await supabase
            .from('workout_log_exercises')
            .select(`weight, workout_logs!inner ( user_id, date )`)
            .eq('exercise_id', ex.exercise_id)
            .eq('workout_logs.user_id', user.id)
            .neq('workout_log_id', logData.id) // exclude the log we just created
            .order('weight', { ascending: false })
            .limit(1)

        const prevMax = prevBest?.[0]?.weight ?? 0
        const currentWeight = Number(ex.weight)

        if (currentWeight > prevMax) {
            prs.push({
                exerciseId: ex.exercise_id,
                exerciseName: ex.name,
                weight: currentWeight
            })
        }
    }

    revalidatePath('/logs')
    revalidatePath('/progress')
    // Return success + PRs (client handles redirect after showing celebration)
    return { success: true, prs }
}

// ── Phase 6: Progress Charts ─────────────────────────────────────────────────

export async function getExerciseProgress(exerciseId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('workout_log_exercises')
        .select(`weight, sets, reps, workout_logs!inner ( date, user_id )`)
        .eq('exercise_id', exerciseId)
        .eq('workout_logs.user_id', user.id)
        .order('workout_logs(date)', { ascending: true })

    if (error || !data) return []

    const byDate: Record<string, { date: string; maxWeight: number; sets: number; reps: number }> = {}
    for (const row of data as any[]) {
        const date: string = Array.isArray(row.workout_logs) ? row.workout_logs[0]?.date : row.workout_logs?.date
        if (!date) continue
        if (!byDate[date] || row.weight > byDate[date].maxWeight) {
            byDate[date] = { date, maxWeight: row.weight, sets: row.sets, reps: row.reps }
        }
    }

    return Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))
}

export async function getAllExercisesWithProgress() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('workout_log_exercises')
        .select(`exercise_id, exercises ( id, name, muscle_group ), workout_logs!inner ( user_id )`)
        .eq('workout_logs.user_id', user.id)

    if (error || !data) return []

    const seen = new Set<string>()
    const exercises: { id: string; name: string; muscle_group: string }[] = []
    for (const row of data as any[]) {
        const ex = Array.isArray(row.exercises) ? row.exercises[0] : row.exercises
        if (ex && !seen.has(ex.id)) {
            seen.add(ex.id)
            exercises.push(ex)
        }
    }
    return exercises
}

export async function getAllPersonalRecords() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('workout_log_exercises')
        .select(`weight, reps, exercises ( id, name, muscle_group ), workout_logs!inner ( user_id, date )`)
        .eq('workout_logs.user_id', user.id)
        .order('weight', { ascending: false })

    if (error || !data) return []

    // Keep only the max weight per exercise
    const prMap: Record<string, { exerciseId: string; name: string; muscle_group: string; weight: number; reps: number; date: string }> = {}
    for (const row of data as any[]) {
        const ex = Array.isArray(row.exercises) ? row.exercises[0] : row.exercises
        const log = Array.isArray(row.workout_logs) ? row.workout_logs[0] : row.workout_logs
        if (!ex || !log) continue
        if (!prMap[ex.id] || row.weight > prMap[ex.id].weight) {
            prMap[ex.id] = { exerciseId: ex.id, name: ex.name, muscle_group: ex.muscle_group, weight: row.weight, reps: row.reps, date: log.date }
        }
    }

    return Object.values(prMap).sort((a, b) => b.weight - a.weight)
}

// ── Phase 8: Workout Streak ───────────────────────────────────────────────────

// ── Phase 8: Workout Streak (Moved to actions/streak.ts) ──────────────────────

// ── Phase 13: Volume Tracker ──────────────────────────────────────────────────

export async function getVolumeStats(days = 30) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().split('T')[0]

    const { data: logs } = await supabase
        .from('workout_logs')
        .select(`
            date,
            workout_log_exercises ( sets, reps, weight )
        `)
        .eq('user_id', user.id)
        .gte('date', sinceStr)
        .order('date', { ascending: true })

    if (!logs) return []

    // Group by date and sum volume = sets × reps × weight
    const byDate: Record<string, number> = {}
    for (const log of logs) {
        const vol = (log.workout_log_exercises ?? []).reduce((sum: number, ex: any) => {
            const s = Number(ex.sets) || 1
            const r = Number(ex.reps) || 0
            const w = Number(ex.weight) || 0
            return sum + s * r * w
        }, 0)
        byDate[log.date] = (byDate[log.date] ?? 0) + vol
    }

    return Object.entries(byDate).map(([date, volume]) => ({ date, volume }))
}

// ── Phase 14: Muscle Group Heatmap ───────────────────────────────────────────

export async function getMuscleSetCounts(days = 30) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return {}

    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString().split('T')[0]

    const { data: logs } = await supabase
        .from('workout_logs')
        .select(`
            date,
            workout_log_exercises (
                sets,
                exercises ( muscle_group )
            )
        `)
        .eq('user_id', user.id)
        .gte('date', sinceStr)

    if (!logs) return {}

    const counts: Record<string, number> = {}
    for (const log of logs) {
        for (const ex of (log.workout_log_exercises ?? []) as any[]) {
            const mg = ex.exercises?.muscle_group
            if (!mg) continue
            counts[mg] = (counts[mg] ?? 0) + (Number(ex.sets) || 1)
        }
    }

    return counts
}

// ── Phase 22: CRUD for Workout Logs ─────────────────────────────────────────

export async function deleteWorkoutLog(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    // Ensure the log belongs to the user
    const { data: logCheck } = await supabase
        .from('workout_logs')
        .select('id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

    if (!logCheck) return { error: 'ไม่พบประวัติการฝึก หรือคุณไม่มีสิทธิ์ลบ' }

    // Deleting the log will cascade and delete workout_log_exercises automatically via Supabase FK (if configured)
    // Even if not, we can just delete the log explicitly. The best practice is cascade.
    const { error } = await supabase
        .from('workout_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting workout log:', error)
        return { error: 'เกิดข้อผิดพลาดในการลบประวัติการฝึก' }
    }

    revalidatePath('/logs')
    revalidatePath('/progress')
    return { success: true }
}

export async function updateWorkoutLog(id: string, formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const date = formData.get('date')?.toString()
    const notes = formData.get('notes')?.toString()

    if (!date) return { error: 'วันที่จำเป็นต้องระบุ' }

    const { error } = await supabase
        .from('workout_logs')
        .update({ date, notes: notes || null })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error updating workout log:', error)
        return { error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' }
    }

    revalidatePath('/logs')
    revalidatePath('/progress')
    return { success: true }
}
