'use server'

import { createClient } from '@/utils/supabase/server'

export interface LeaderboardVolumeEntry {
    user_id: string
    username: string | null
    avatar_url: string | null
    total_volume_30d: number
    workouts_count: number
}

export interface LeaderboardPREntry {
    exercise_id: string
    exercise_name: string
    user_id: string
    username: string | null
    avatar_url: string | null
    max_weight: number
    date: string
}

export async function getVolumeLeaderboard() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('leaderboard_volume')
        .select('*')
        .order('total_volume_30d', { ascending: false })
        .limit(50)

    if (error) {
        console.error('Error fetching volume leaderboard:', error)
        return []
    }

    return data as LeaderboardVolumeEntry[]
}

export async function getPrsLeaderboard() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('leaderboard_prs')
        .select('*')
        .order('max_weight', { ascending: false })
        .limit(100)

    if (error) {
        console.error('Error fetching PRs leaderboard:', error)
        return []
    }

    return data as LeaderboardPREntry[]
}
