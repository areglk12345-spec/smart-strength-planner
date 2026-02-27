'use client'

import { useState } from 'react'
import { toggleFollow } from '@/app/actions/community'
import { useToast } from '@/app/components/Toast'

export function FollowButton({
    userId,
    initialIsFollowing,
    isLoggedIn
}: {
    userId: string
    initialIsFollowing: boolean
    isLoggedIn: boolean
}) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    async function handleToggle(e: React.MouseEvent) {
        e.preventDefault() // prevent navigating if inside a link

        if (!isLoggedIn) {
            toast('กรุณาเข้าสู่ระบบก่อนเพื่อติดตามเพื่อน', 'error')
            return
        }

        setLoading(true)
        const res = await toggleFollow(userId, isFollowing)
        setLoading(false)

        if (res.error) {
            toast(res.error, 'error')
        } else if (res.success) {
            setIsFollowing(res.isFollowing ?? !isFollowing)
            toast(res.isFollowing ? 'ติดตามแล้ว' : 'เลิกติดตามแล้ว', 'success')
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${isFollowing
                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-red-500'
                    : 'bg-blue-600 dark:bg-red-600 text-white hover:bg-blue-700 dark:hover:bg-red-700 border border-transparent shadow-blue-500/30 dark:shadow-red-900/40' // Primary style
                }`}
        >
            {loading ? '⏳...' : isFollowing ? 'เลิกติดตาม' : 'ติดตาม'}
        </button>
    )
}
