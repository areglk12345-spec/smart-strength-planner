'use client';

import Link from 'next/link';
import { History, Dumbbell, Weight, Clock } from 'lucide-react';

interface ActivityRecord {
    id: string;
    date: string;
    title: string;
    notes: string | null;
    totalVolume: number;
    totalExercises: number;
}

export function TimelineWidget({ activities }: { activities: ActivityRecord[] }) {
    if (!activities || activities.length === 0) {
        return (
            <div className="bg-white/70 dark:bg-zinc-900/70 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8">
                <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight mb-4">
                    <History size={20} className="text-orange-500 dark:text-red-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-red-400 dark:to-orange-500">กิจกรรมล่าสุด</span>
                </h3>
                <div className="text-center py-6 text-gray-500 dark:text-zinc-500 font-medium">
                    ยังไม่มีประวัติการฝึกซ้อม
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 p-6 rounded-3xl shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8 hover:shadow-md dark:hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 flex items-center gap-2 tracking-tight">
                    <History size={20} className="text-orange-500 dark:text-red-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500 dark:from-red-400 dark:to-orange-500">กิจกรรมล่าสุด</span>
                </h3>
                <Link href="/logs" className="text-sm text-blue-600 dark:text-blue-400 font-bold hover:underline">
                    ดูประวัติ
                </Link>
            </div>

            <div className="relative pl-6 border-l-2 border-gray-100 dark:border-zinc-800/80 space-y-6">
                {activities.map((activity, index) => {
                    const activityDate = new Date(activity.date);
                    const today = new Date();
                    activityDate.setHours(0, 0, 0, 0);
                    const todayDate = new Date(today.getTime());
                    todayDate.setHours(0, 0, 0, 0);

                    const diffTime = Math.abs(todayDate.getTime() - activityDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    let dateDisplay = activityDate.toLocaleDateString();
                    if (diffDays === 0) dateDisplay = "วันนี้";
                    else if (diffDays === 1) dateDisplay = "เมื่อวาน";
                    else if (diffDays <= 7) dateDisplay = `เมื่อ ${diffDays} วันก่อน`;

                    return (
                        <div key={activity.id} className="relative group">
                            <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm ${index === 0 ? 'bg-orange-500 dark:bg-red-500' : 'bg-blue-400 dark:bg-zinc-600'
                                }`} />

                            <div className="bg-white dark:bg-zinc-950/50 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/80 hover:border-orange-200 dark:hover:border-red-900/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-gray-900 dark:text-zinc-100 text-lg">{activity.title}</h4>
                                    <span className="text-xs font-semibold text-gray-500 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-900 px-2 py-1 rounded-lg">
                                        {dateDisplay}
                                    </span>
                                </div>

                                <div className="flex gap-4 text-sm mt-3">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                                        <Dumbbell size={14} className="text-blue-500 dark:text-blue-400" />
                                        <span className="font-semibold">{activity.totalExercises} ท่า</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-400">
                                        <Weight size={14} className="text-purple-500 dark:text-purple-400" />
                                        <span className="font-semibold">{activity.totalVolume.toLocaleString()} kg</span>
                                    </div>
                                </div>

                                {activity.notes && (
                                    <p className="mt-3 text-sm text-gray-500 dark:text-zinc-400 italic bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800">
                                        &quot;{activity.notes}&quot;
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
