import { getCommunityUsers } from '@/app/actions/community'
import { createClient } from '@/utils/supabase/server'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { UserCard } from './components/UserCard'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CommunityPage({
    searchParams
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // allow guest access but features are disabled
    const isLoggedIn = !!user

    const params = await searchParams
    const query = params.q || ''

    const users = await getCommunityUsers(query)

    return (
        <main className="min-h-screen bg-mesh text-gray-900 dark:text-zinc-100 px-6 py-8">
            <div className="max-w-5xl mx-auto animate-fade-in-up">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10 glass-card p-6">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-red-500 dark:to-orange-500">
                            Community 🌍
                        </h1>
                        <p className="text-gray-600 dark:text-zinc-400 font-medium">
                            ค้นหาเพื่อนร่วมอุดมการณ์ แลกเปลี่ยนและติดตามความก้าวหน้า
                        </p>
                    </div>
                    <ThemeToggle />
                </div>

                {/* Search */}
                <div className="mb-8 relative z-10 w-full max-w-md mx-auto">
                    <form action="/community" method="get" className="relative group">
                        <input
                            type="text"
                            name="q"
                            defaultValue={query}
                            placeholder="ค้นหาชื่อเพื่อน..."
                            className="w-full bg-white/70 dark:bg-zinc-900/70 p-4 pl-12 rounded-2xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-red-500 transition-all font-medium text-gray-900 dark:text-zinc-100 placeholder:text-gray-400 dark:placeholder:text-zinc-500"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl opacity-50 group-focus-within:opacity-100 transition-opacity">
                            🔍
                        </span>
                    </form>
                </div>

                {/* Users Grid */}
                {users.length === 0 ? (
                    <div className="bg-white/70 dark:bg-zinc-900/70 p-12 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md text-center max-w-lg mx-auto">
                        <div className="text-6xl mb-4 opacity-80">🕵️‍♂️</div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-zinc-100 mb-2">ไม่พบผู้ใช้ที่ค้นหา</h3>
                        <p className="text-gray-500 dark:text-zinc-400 font-medium">
                            ลองค้นหาด้วยชื่ออื่น หรือชวนเพื่อนของคุณมาใช้งาน LevelUp 365 สิ!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map(u => (
                            <UserCard
                                key={u.id}
                                user={u}
                                isLoggedIn={isLoggedIn}
                            />
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}
