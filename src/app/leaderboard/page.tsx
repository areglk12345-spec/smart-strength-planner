import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '../components/ThemeToggle'
import { getLeaderboardVolume, getLeaderboardPRs } from '../actions/social'
import { LeaderboardClient } from './LeaderboardClient'

export default async function LeaderboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const [volumeData, prData] = await Promise.all([
        getLeaderboardVolume(),
        getLeaderboardPRs('Bench Press')
    ])

    return (
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-gray-100 pb-20 sm:pb-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                    <div>
                        <Link href="/" className="text-sm text-blue-500 hover:underline mb-1 block">← หน้าหลัก</Link>
                        <h1 className="text-3xl font-black gradient-text">👥 Leaderboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">จัดอันดับแข่งขันกับผู้เล่นคนอื่น</p>
                    </div>
                    <ThemeToggle />
                </div>

                <LeaderboardClient
                    volumeData={volumeData}
                    prData={prData}
                    currentUserId={user.id}
                />
            </div>
        </main>
    )
}
