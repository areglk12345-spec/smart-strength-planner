export default function Loading() {
    return (
        <main className="min-h-screen bg-mesh px-4 sm:px-6 py-8">
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
                {/* Header Profile/Title */}
                <div className="flex justify-between items-center mb-10 w-full">
                    <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/40 dark:border-zinc-800"></div>
                        <div className="w-32 h-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded border border-white/40 dark:border-zinc-800"></div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full h-64 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800 p-8">
                    <div className="w-48 h-8 bg-gray-200/50 dark:bg-zinc-800/50 rounded-xl mb-6"></div>
                    <div className="space-y-4">
                        <div className="w-full h-4 bg-gray-200/50 dark:bg-zinc-800/50 rounded-xl"></div>
                        <div className="w-full h-4 bg-gray-200/50 dark:bg-zinc-800/50 rounded-xl"></div>
                        <div className="w-3/4 h-4 bg-gray-200/50 dark:bg-zinc-800/50 rounded-xl"></div>
                    </div>
                </div>

                <div className="w-full h-48 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-white/40 dark:border-zinc-800"></div>
            </div>
        </main>
    )
}
