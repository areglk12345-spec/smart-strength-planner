'use client';

import Link from 'next/link';

interface PRRecord {
    exerciseId: string;
    name: string;
    muscle_group: string;
    raw_weight: number;
    reps: number;
    calculated_1rm: number;
    date: string;
}

export function PRTrackerWidget({ prs }: { prs: PRRecord[] }) {
    if (!prs || prs.length === 0) return null;

    // Show top 3 PRs
    const topPrs = prs.slice(0, 3);

    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8 hover:shadow-md dark:hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
                    👑 <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-600 dark:from-yellow-400 dark:to-orange-500">1RM Personal Records</span>
                </h3>
                <Link href="/progress" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    ดูทั้งหมด
                </Link>
            </div>

            <div className="space-y-4">
                {topPrs.map((pr, index) => (
                    <div key={pr.exerciseId} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-950/50 rounded-2xl border border-gray-100 dark:border-zinc-800/80 hover:border-blue-200 dark:hover:border-zinc-700 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500' :
                                    index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400' :
                                        'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-500'
                                }`}>
                                #{index + 1}
                            </div>
                            <div>
                                <Link href={`/exercises/${pr.exerciseId}`} className="font-bold text-gray-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 group-hover:underline">
                                    {pr.name}
                                </Link>
                                <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1 flex gap-2">
                                    <span>{new Date(pr.date).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{pr.raw_weight}kg x {pr.reps}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xl font-black text-gray-900 dark:text-zinc-100">
                                {pr.calculated_1rm} <span className="text-sm font-semibold text-gray-500 dark:text-zinc-500">kg</span>
                            </div>
                            <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-wider">
                                Est. 1RM
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <p className="text-xs text-gray-400 dark:text-zinc-600 mt-4 text-center font-medium">
                *คำนวณ 1 Rep Max ด้วยสูตร Brzycki (สำหรับเซ็ตที่ไม่เกิน 36 ครั้ง)
            </p>
        </div>
    );
}
