import Image from 'next/image'
import Link from 'next/link'
import { FollowButton } from './FollowButton'

interface UserCardProps {
    user: {
        id: string
        name: string
        avatar_url: string | null
        followersCount: number
        followingCount: number
        isFollowing: boolean
    }
    isLoggedIn: boolean
}

export function UserCard({ user, isLoggedIn }: UserCardProps) {
    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md flex flex-col items-center text-center group hover:border-blue-200 dark:hover:border-red-900/50 transition-all">
            <Link href={`/profile/${user.id}`} className="relative mb-4 shrink-0 transition-transform group-hover:scale-105">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-inner border-2 border-white dark:border-zinc-800">
                    {user.avatar_url ? (
                        <Image
                            src={user.avatar_url}
                            alt={user.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            👶
                        </div>
                    )}
                </div>
            </Link>

            <Link href={`/profile/${user.id}`} className="hover:text-blue-600 dark:hover:text-red-400 transition-colors">
                <h3 className="font-bold text-gray-900 dark:text-zinc-100 text-lg mb-1">{user.name}</h3>
            </Link>

            <div className="flex gap-4 text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-6 bg-gray-50 dark:bg-zinc-950/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-zinc-800">
                <div className="flex flex-col items-center">
                    <span className="text-gray-900 dark:text-zinc-200">{user.followersCount}</span>
                    <span>Followers</span>
                </div>
                <div className="w-px bg-gray-200 dark:bg-zinc-800"></div>
                <div className="flex flex-col items-center">
                    <span className="text-gray-900 dark:text-zinc-200">{user.followingCount}</span>
                    <span>Following</span>
                </div>
            </div>

            <FollowButton
                userId={user.id}
                initialIsFollowing={user.isFollowing}
                isLoggedIn={isLoggedIn}
            />
        </div>
    )
}
