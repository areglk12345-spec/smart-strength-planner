export default function Loading() {
    return (
        <main className="min-h-screen bg-mesh px-6 py-8">
            {/* Header Skeleton */}
            <header className="sticky top-0 z-40 glass-card rounded-none border-x-0 border-t-0 px-6 py-3 border-b-white/40 dark:border-b-red-500/20 mb-8 w-full max-w-5xl mx-auto flex items-center justify-between">
                <div className="w-40 h-8 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 dark:bg-zinc-800 rounded-xl animate-pulse"></div>
            </header>

            <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
                {/* Hero Skeleton */}
                <div className="w-full h-48 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800"></div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-28 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-zinc-800"></div>
                    <div className="h-28 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-zinc-800"></div>
                    <div className="h-28 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-zinc-800"></div>
                    <div className="h-28 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-zinc-800"></div>
                </div>

                {/* Sub-grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-48 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800"></div>
                    <div className="h-48 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800"></div>
                </div>

                {/* Main Content Skeleton */}
                <div className="h-[400px] w-full bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800"></div>
            </div>
        </main>
    )
}
