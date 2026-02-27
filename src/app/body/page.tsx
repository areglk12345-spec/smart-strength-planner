import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { getMeasurements, getProgressPhotos } from '@/app/actions/body'
import { BodyClient } from './BodyClient'

export const dynamic = 'force-dynamic'

export default async function BodyPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const [measurements, photos] = await Promise.all([
        getMeasurements(),
        getProgressPhotos()
    ])

    return (
        <main className="min-h-screen bg-mesh text-gray-900 dark:text-zinc-100 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0 px-6 py-3 border-b-white/40 dark:border-b-red-500/20">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-sm font-bold text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100 transition-colors">
                            ← หน้าหลัก
                        </Link>
                        <span className="text-gray-300 dark:text-zinc-700">/</span>
                        <h1 className="text-lg font-black text-gray-900 dark:text-zinc-100">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-red-400 dark:to-orange-500">
                                💪 Body Tracker
                            </span>
                        </h1>
                    </div>
                    <ThemeToggle />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <BodyClient
                    measurements={measurements}
                    photos={photos}
                    userId={user.id}
                />
            </div>
        </main>
    )
}
