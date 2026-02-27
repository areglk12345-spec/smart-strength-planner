export default function Loading() {
    return (
        <main className="min-h-screen bg-mesh px-4 sm:px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                {/* Header Profile/Title */}
                <div className="flex justify-between items-center mb-10 w-full">
                    <div className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-zinc-800"></div>
                        <div className="space-y-2">
                            <div className="w-32 h-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded border border-white/40 dark:border-zinc-800"></div>
                            <div className="w-24 h-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded border border-white/40 dark:border-zinc-800"></div>
                        </div>
                    </div>
                </div>

                {/* Sub-Header Area */}
                <div className="w-full flex justify-between">
                    <div className="w-48 h-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/40 dark:border-zinc-800"></div>
                    <div className="w-32 h-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/40 dark:border-zinc-800"></div>
                </div>

                {/* List Items Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-24 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800 p-4 flex justify-between items-center">
                            <div className="space-y-3">
                                <div className="w-40 h-5 bg-gray-200/50 dark:bg-zinc-800/50 rounded"></div>
                                <div className="w-24 h-4 bg-gray-200/50 dark:bg-zinc-800/50 rounded"></div>
                            </div>
                            <div className="w-10 h-10 bg-gray-200/50 dark:bg-zinc-800/50 rounded-xl"></div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
