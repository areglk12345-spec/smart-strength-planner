import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { FollowButton } from '@/app/community/components/FollowButton'

export const dynamic = 'force-dynamic'

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && user.id === id) {
        // if user clicks their own profile, redirect to their private profile
        redirect('/profile')
    }

    // Fetch user profile stats
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            name, 
            goal, 
            avatar_url,
            followers:user_followers!user_followers_following_id_fkey(count),
            following:user_followers!user_followers_follower_id_fkey(count)
        `)
        .eq('id', id)
        .single()

    if (!profile) notFound()

    const followersCount = profile.followers?.[0]?.count || 0
    const followingCount = profile.following?.[0]?.count || 0

    // Check if the current user is following this profile
    let isFollowing = false
    if (user) {
        const { data: followCheck } = await supabase
            .from('user_followers')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', id)
            .single()
        isFollowing = !!followCheck
    }

    // Fetch this user's public routines
    const { data: publicRoutines } = await supabase
        .from('routines')
        .select('*, routine_exercises(exercises(name, muscle_group))')
        .eq('user_id', id)
        .eq('is_public', true)
        .order('created_at', { ascending: false })

    // Build stats counts
    const routineCount = publicRoutines?.length || 0

    return (
        <main className="min-h-screen bg-mesh text-gray-900 dark:text-zinc-100 px-6 py-8">
            <div className="max-w-4xl mx-auto animate-fade-in-up">

                {/* Header Navigation */}
                <div className="flex justify-between items-center mb-8 relative z-10 glass-card p-4 rounded-3xl">
                    <Link href="/community" className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <span className="mr-2">←</span> กลับหน้ารวม Community
                    </Link>
                    <ThemeToggle />
                </div>

                {/* Profile Banner & Info */}
                <div className="bg-white/70 dark:bg-zinc-900 p-8 md:p-10 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8 relative z-10 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
                        {/* Avatar */}
                        <div className="shrink-0">
                            <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 dark:bg-zinc-800 shadow-xl border-4 border-white dark:border-zinc-800 relative z-10 rotate-3 transition-transform hover:rotate-0">
                                {profile.avatar_url ? (
                                    <Image
                                        src={profile.avatar_url}
                                        alt={profile.name}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl">👶</div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-3">
                            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tight">
                                {profile.name}
                            </h1>
                            {profile.goal && (
                                <p className="text-gray-500 dark:text-zinc-400 font-medium italic">
                                    "{profile.goal}"
                                </p>
                            )}

                            {/* Stats Flex */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-bold pt-2">
                                <div className="bg-gray-50 dark:bg-zinc-950/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center">
                                    <span className="text-xl text-blue-600 dark:text-red-400">{followersCount}</span>
                                    <span className="text-gray-500 dark:text-zinc-500 text-xs uppercase tracking-widest mt-0.5">Followers</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-950/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center">
                                    <span className="text-xl text-gray-900 dark:text-zinc-200">{followingCount}</span>
                                    <span className="text-gray-500 dark:text-zinc-500 text-xs uppercase tracking-widest mt-0.5">Following</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-950/50 px-4 py-2 rounded-xl border border-gray-100 dark:border-zinc-800 flex flex-col items-center">
                                    <span className="text-xl text-gray-900 dark:text-zinc-200">{routineCount}</span>
                                    <span className="text-gray-500 dark:text-zinc-500 text-xs uppercase tracking-widest mt-0.5">Routines</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="shrink-0 mt-2 md:mt-0 self-center md:self-start pt-2">
                            <FollowButton
                                userId={id}
                                initialIsFollowing={isFollowing}
                                isLoggedIn={!!user}
                            />
                        </div>
                    </div>
                </div>

                {/* Public Routines Section */}
                <h2 className="text-2xl font-black text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <span>ตารางฝึกที่แจกแจง ({routineCount})</span>
                </h2>

                {publicRoutines && publicRoutines.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {publicRoutines.map((routine: any) => (
                            <Link key={routine.id} href={`/routines/${routine.id}`} className="group relative z-10">
                                <div className="bg-white/70 dark:bg-zinc-900 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md h-full transition-all group-hover:border-blue-300 dark:group-hover:border-red-900/60 group-hover:shadow-blue-500/10 dark:group-hover:shadow-[0_4px_20px_rgba(225,29,72,0.15)] group-hover:-translate-y-1 relative overflow-hidden">

                                    {/* Decoration */}
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/10 to-transparent dark:from-red-600/10 rounded-bl-full pointer-events-none"></div>

                                    <div className="flex justify-between items-start mb-3 relative z-10">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-red-400 transition-colors">
                                            {routine.name}
                                        </h3>
                                        <div className="bg-blue-50 dark:bg-red-950/30 text-blue-700 dark:text-red-400 font-bold px-2.5 py-1 rounded-lg text-xs tracking-wider shrink-0 ml-3">
                                            {routine.routine_exercises?.length || 0} ท่า
                                        </div>
                                    </div>
                                    {routine.description && (
                                        <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2 relative z-10">
                                            {routine.description}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/70 dark:bg-zinc-900 p-12 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md text-center">
                        <div className="text-5xl opacity-50 mb-4">📭</div>
                        <p className="text-lg font-bold text-gray-700 dark:text-zinc-300">
                            {profile.name} ยังไม่มีตารางฝึกที่เปิดเป็นสาธารณะ
                        </p>
                    </div>
                )}
            </div>
        </main>
    )
}
