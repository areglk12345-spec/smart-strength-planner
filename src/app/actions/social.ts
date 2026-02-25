'use server'

import { createClient } from '@/utils/supabase/server'

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
