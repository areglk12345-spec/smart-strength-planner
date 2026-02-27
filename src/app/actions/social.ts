'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLeaderboardVolume() {
    const supabase = await createClient()

    // Fetch from the materialized view / regular view created in social.sql
    const { data, error } = await supabase
        .from('leaderboard_volume')
        .select('*')
        .order('total_volume_30d', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching volume leaderboard:', error)
        return []
    }

    return data
}

export async function getLeaderboardPRs(exerciseName: string = 'Bench Press') {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('leaderboard_prs')
        .select('*')
        .ilike('exercise_name', `%${exerciseName}%`)
        .order('max_weight', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching PR leaderboard:', error)
        return []
    }

    return data
}

// ── Phase 32: Social & Community ─────────────────────────────────────────────

export async function toggleLike(logId: string, currentLiked: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    if (currentLiked) {
        const { error } = await supabase
            .from('workout_likes')
            .delete()
            .eq('log_id', logId)
            .eq('user_id', user.id)

        if (error) return { error: 'เกิดข้อผิดพลาดในการเลิกถูกใจ' }
    } else {
        const { error } = await supabase
            .from('workout_likes')
            .insert({ log_id: logId, user_id: user.id })

        if (error) {
            if (error.code === '23505') return { success: true } // Already liked
            return { error: 'เกิดข้อผิดพลาดในการถูกใจ' }
        }
    }

    revalidatePath('/')
    revalidatePath('/auth/callback') // anywhere feed is
    return { success: true, isLiked: !currentLiked }
}

export async function addComment(logId: string, content: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    if (!content.trim()) return { error: 'กรุณากรอกข้อความ' }

    const { data, error } = await supabase
        .from('workout_comments')
        .insert({ log_id: logId, user_id: user.id, content: content.trim() })
        .select(`
            id,
            content,
            created_at,
            user_id,
            profiles(name, avatar_url)
        `)
        .single()

    if (error) return { error: 'เกิดข้อผิดพลาดในการคอมเมนต์' }

    revalidatePath('/')
    return { success: true, comment: data }
}

export async function deleteComment(commentId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const { error } = await supabase
        .from('workout_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id)

    if (error) return { error: 'เกิดข้อผิดพลาดในการลบคอมเมนต์' }

    revalidatePath('/')
    return { success: true }
}
