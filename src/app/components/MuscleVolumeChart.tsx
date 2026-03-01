'use client';

import { useState, useEffect } from 'react';
import { getMuscleVolumeTrends } from '@/app/actions/log';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

export function MuscleVolumeChart() {
    const [data, setData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const trends = await getMuscleVolumeTrends(8);
            setData(trends);
            setIsLoading(false);
        }
        load();
    }, []);

    if (isLoading) return <div className="animate-pulse bg-gray-100 dark:bg-zinc-800 h-64 rounded-3xl" />;
    if (data.length === 0) return (
        <div className="bg-white/70 dark:bg-zinc-900/70 p-8 rounded-[2rem] border border-white/40 dark:border-zinc-800 text-center text-gray-400">
            ยังไม่มีข้อมูลเพียงพอสำหรับการวิเคราะห์แนวโน้ม
        </div>
    );

    // Get all muscle groups present in the data to create lines
    const muscleGroups = Array.from(
        new Set(data.flatMap(d => Object.keys(d).filter(k => k !== 'date')))
    );

    // Curated colors for different muscle groups
    const COLORS: Record<string, string> = {
        'Chest': '#ef4444',     // Red
        'Back': '#3b82f6',      // Blue
        'Legs': '#10b981',      // Emerald
        'Shoulders': '#f59e0b', // Amber
        'Arms': '#8b5cf6',       // Violet
        'Abs': '#ec4899'        // Pink
    };

    return (
        <div className="bg-white/70 dark:bg-zinc-900/70 p-6 md:p-8 rounded-[2rem] shadow-sm dark:shadow-md border border-white/40 dark:border-zinc-800 backdrop-blur-md mb-8">
            <h3 className="text-xl font-black text-gray-800 dark:text-zinc-100 mb-6 flex items-center gap-2 tracking-tight">
                <TrendingUp size={24} className="text-blue-600 dark:text-red-500" /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-red-400 dark:to-orange-500">Muscle Volume Trends</span>
            </h3>

            <div className="h-72 w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#888888" vertical={false} opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => {
                                const d = new Date(str);
                                return `${d.getDate()}/${d.getMonth() + 1}`;
                            }}
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px',
                                fontWeight: 'bold'
                            }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        {muscleGroups.map((mg, index) => (
                            <Line
                                key={mg}
                                type="monotone"
                                dataKey={mg}
                                stroke={COLORS[mg] || `hsl(${index * 60}, 70%, 50%)`}
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                animationDuration={1500}
                                name={mg}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <p className="mt-4 text-xs text-gray-500 dark:text-zinc-500 font-medium italic text-center">
                * กราฟแสดงผลรวมปริมาณการฝึก (Sets × Reps × Weight) ย้อนหลัง 8 สัปดาห์
            </p>
        </div>
    );
}
