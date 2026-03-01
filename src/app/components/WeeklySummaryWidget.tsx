'use client';

import { useState, useEffect } from 'react';
import { getWeeklyComparison } from '@/app/actions/log';
import { motion } from 'framer-motion';
import { Zap, Activity, ArrowUp, ArrowDown } from 'lucide-react';

export function WeeklySummaryWidget() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getWeeklyComparison();
            setStats(data);
            setIsLoading(false);
        }
        load();
    }, []);

    if (isLoading) return <div className="animate-pulse bg-gray-100 dark:bg-zinc-800 h-32 rounded-3xl mb-8" />;
    if (!stats) return null;

    const isPositive = stats.volumeChangePercent >= 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-zinc-900/80 dark:to-black p-6 rounded-[2.5rem] shadow-sm dark:shadow-md border border-blue-100/50 dark:border-zinc-800 backdrop-blur-md mb-8 relative overflow-hidden"
        >
            {/* Decoration */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/10 dark:bg-red-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-400/20 transition-colors"></div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                <div className="text-center md:text-left">
                    <h3 className="text-sm font-black text-blue-600 dark:text-red-500 uppercase tracking-widest mb-1">Weekly Summary</h3>
                    <p className="text-2xl font-black text-gray-900 dark:text-zinc-100 tracking-tight flex items-center justify-center md:justify-start gap-2">
                        {isPositive ? (
                            <Zap size={24} className="text-yellow-500 fill-yellow-500 animate-pulse" />
                        ) : (
                            <Activity size={24} className="text-blue-500" />
                        )}
                        <span>{isPositive ? 'ติดเทอร์โบ! ' : 'ลุยต่ออย่าหยุด! '} สัปดาห์นี้คุณฝึก {stats.current.sessions} ครั้ง</span>
                    </p>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Volume</span>
                        <span className="text-xl font-black text-gray-900 dark:text-zinc-100">{stats.current.volume.toLocaleString()} <small className="text-[10px] opacity-50">KG</small></span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black text-gray-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">Change</span>
                        <div className={`flex items-center gap-1 font-black px-3 py-1 rounded-xl text-sm ${isPositive ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950/30' : 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950/30'
                            }`}>
                            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                            <span>{Math.abs(stats.volumeChangePercent)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
