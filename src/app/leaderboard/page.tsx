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
        <main className="min-h-screen bg-mesh px-4 py-8 text-gray-900 dark:text-zinc-100 pb-20 sm:pb-8">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-start sm:items-center justify-between mb-8 animate-fade-in-up flex-col sm:flex-row gap-4">
                    <div>
                        <Link href="/" className="text-sm font-bold text-blue-600 dark:text-red-400 hover:underline mb-2 block transition-colors w-fit px-3 py-1.5 rounded-lg hover:bg-white/50 hover:dark:bg-zinc-900/50">← กลับหน้าหลัก</Link>
                        <h1 className="text-4xl font-black gradient-text tracking-tight uppercase italic drop-shadow-sm">👥 Leaderboard</h1>
                        <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mt-3 max-w-lg">จัดอันดับแข่งขันกับผู้เล่นคนอื่น</p>
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
