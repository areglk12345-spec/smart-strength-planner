'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCommunityUsers(searchQuery: string = '') {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let query = supabase
        .from('profiles')
        .select(`
            id, 
            name, 
            avatar_url,
            followers:user_followers!user_followers_following_id_fkey(count),
            following:user_followers!user_followers_follower_id_fkey(count)
        `)

    if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data: users, error } = await query.limit(50)

    if (error) {
        console.error('Error fetching community users:', error)
        return []
    }

    // Process follows counts and check if current user is following them
    let followMap = new Set<string>()
    if (user) {
        const { data: myFollows } = await supabase
            .from('user_followers')
            .select('following_id')
            .eq('follower_id', user.id)

        if (myFollows) {
            myFollows.forEach(f => followMap.add(f.following_id))
        }
    }

    return users
        .filter(u => u.id !== user?.id) // Exclude self
        .map(u => ({
            ...u,
            followersCount: u.followers[0]?.count || 0,
            followingCount: u.following[0]?.count || 0,
            isFollowing: followMap.has(u.id)
        }))
}

export async function toggleFollow(targetUserId: string, currentlyFollowing: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    if (user.id === targetUserId) return { error: 'ไม่สามารถติดตามตัวเองได้' }

    if (currentlyFollowing) {
        const { error } = await supabase
            .from('user_followers')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', targetUserId)

        if (error) return { error: 'เกิดข้อผิดพลาดในการเลิกติดตาม' }
    } else {
        const { error } = await supabase
            .from('user_followers')
            .insert({ follower_id: user.id, following_id: targetUserId })

        if (error) {
            if (error.code === '23505') return { success: true } // Already following
            return { error: 'เกิดข้อผิดพลาดในการติดตาม' }
        }
    }

    revalidatePath('/community')
    revalidatePath(`/profile/${targetUserId}`)
    return { success: true, isFollowing: !currentlyFollowing }
}
