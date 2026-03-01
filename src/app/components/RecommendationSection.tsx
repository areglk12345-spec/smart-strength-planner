'use client';

import { useState, useEffect, useTransition } from 'react';
import { getRecommendedRoutines, cloneRecommendedRoutine, RecommendedRoutine } from '@/app/actions/recommendations';
import { useToast } from '@/app/components/Toast';
import { useRouter } from 'next/navigation';
import { Sparkles, Plus, Loader2 } from 'lucide-react';

export function RecommendationSection() {
    const [recommendations, setRecommendations] = useState<RecommendedRoutine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function load() {
            const data = await getRecommendedRoutines();
            setRecommendations(data as RecommendedRoutine[]);
            setIsLoading(false);
        }
        load();
    }, []);

    const handleClone = (rec: RecommendedRoutine) => {
        startTransition(async () => {
            const res = await cloneRecommendedRoutine(rec.id);
            if (res.error) {
                toast(res.error, 'error');
            } else {
                toast(`เพิ่มตาราง ${rec.name} เรียบร้อยแล้ว!`, 'success');
                router.push(`/routines/${res.routineId}`);
                router.refresh();
            }
        });
    };

    if (isLoading) return <div className="animate-pulse bg-gray-100 dark:bg-zinc-800 h-48 rounded-3xl" />;
    if (recommendations.length === 0) return null;

    return (
        <section className="mb-10 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                    <Sparkles size={20} className="text-blue-500 dark:text-red-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-red-400 dark:to-orange-500">สำหรับคุณโดยเฉพาะ</span>
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec) => (
                    <div key={rec.id} className="group bg-white/70 dark:bg-zinc-900/70 p-6 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all hover:-translate-y-1">
                        {/* Level Badge */}
                        <div className="absolute top-4 right-4 bg-blue-100 dark:bg-zinc-800 text-blue-700 dark:text-zinc-300 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-blue-200 dark:border-zinc-700">
                            {rec.level}
                        </div>

                        <div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100 mb-2">{rec.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-4 line-clamp-2 leading-relaxed">
                                {rec.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {rec.exercises.slice(0, 3).map((ex, i) => (
                                    <span key={i} className="text-[11px] font-bold bg-gray-50 dark:bg-zinc-950 px-2 py-1 rounded-lg text-gray-600 dark:text-zinc-500 border border-gray-100 dark:border-zinc-800">
                                        {ex.name}
                                    </span>
                                ))}
                                {rec.exercises.length > 3 && (
                                    <span className="text-[11px] font-bold text-gray-400">+{rec.exercises.length - 3}</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => handleClone(rec)}
                            disabled={isPending}
                            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-black py-3 rounded-2xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Plus size={20} />
                                    <span>เพิ่มเข้าตารางฝึกของฉัน</span>
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}
