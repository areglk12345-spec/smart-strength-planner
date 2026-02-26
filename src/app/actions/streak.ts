'use server'

import { createClient } from '@/utils/supabase/server'

export async function getStreak(userId: string) {
    const supabase = await createClient()

    // Fetch all distinct dates the user has logged a workout
    const { data: logs } = await supabase
        .from('workout_logs')
        .select('date')
        .eq('user_id', userId)
        .order('date', { ascending: false })

    if (!logs || logs.length === 0) {
        return { current: 0, best: 0, lastWorkout: null }
    }

    // Extract unique dates as strings ('YYYY-MM-DD')
    const uniqueDates = Array.from(new Set(logs.map(log => log.date.split('T')[0]))).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (uniqueDates.length === 0) {
        return { current: 0, best: 0, lastWorkout: null }
    }

    const lastWorkoutStr = uniqueDates[0]

    // Calculate current streak
    let currentStreak = 0
    let bestStreak = 0
    let tempStreak = 0

    // Get today's local date (ignoring time)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if the latest logs is today or yesterday
    const lastWorkoutDate = new Date(lastWorkoutStr)
    lastWorkoutDate.setHours(0, 0, 0, 0)

    let isStreakActive = false
    if (lastWorkoutDate.getTime() === today.getTime() || lastWorkoutDate.getTime() === yesterday.getTime()) {
        isStreakActive = true
    }

    // Logic for counting consecutive days.
    // To do this simply, we will iterate backwards from the most recent date.
    if (isStreakActive) {
        currentStreak = 1;
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const currentD = new Date(uniqueDates[i])
            currentD.setHours(0, 0, 0, 0)
            const nextD = new Date(uniqueDates[i + 1])
            nextD.setHours(0, 0, 0, 0)

            const diffTime = Math.abs(currentD.getTime() - nextD.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    // Logic for calculating all-time best streak
    if (uniqueDates.length > 0) {
        tempStreak = 1
        bestStreak = 1
        for (let i = 0; i < uniqueDates.length - 1; i++) {
            const currentD = new Date(uniqueDates[i])
            currentD.setHours(0, 0, 0, 0)
            const nextD = new Date(uniqueDates[i + 1])
            nextD.setHours(0, 0, 0, 0)

            const diffTime = Math.abs(currentD.getTime() - nextD.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                tempStreak++;
                if (tempStreak > bestStreak) {
                    bestStreak = tempStreak;
                }
            } else {
                tempStreak = 1;
            }
        }
    }

    return {
        current: currentStreak,
        best: bestStreak,
        lastWorkout: lastWorkoutStr
    }
}
