import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, Play, Pause, RotateCcw, Bell, Settings2 } from 'lucide-react';
import { playTimerBeep } from '@/utils/audio';

interface RestTimerProps {
    defaultRestTime?: number; // in seconds
    onTimerEnd?: () => void;
}

export function RestTimer({ defaultRestTime = 90, onTimerEnd }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(defaultRestTime);
    const [isActive, setIsActive] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [customTime, setCustomTime] = useState(defaultRestTime);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);
            setIsFinished(true);

            // Play sound using native Audio API utility
            playTimerBeep();

            if (onTimerEnd) onTimerEnd();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimerEnd]);

    const toggleTimer = () => {
        if (isFinished) {
            resetTimer();
        } else {
            setIsActive(!isActive);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setIsFinished(false);
        setTimeLeft(customTime);
    };

    const handleCustomTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) {
            setCustomTime(val);
        }
    };

    const applyCustomTime = () => {
        setTimeLeft(customTime);
        setIsCustomizing(false);
        setIsFinished(false);
        setIsActive(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = (timeLeft / customTime) * 100;

    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-[2rem] p-6 shadow-sm mb-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] transition-colors duration-1000 pointer-events-none ${isActive ? 'bg-blue-500/10 dark:bg-red-500/10' : isFinished ? 'bg-green-500/10' : 'bg-gray-500/5'}`} />

            <div className="flex flex-col items-center justify-center">
                <div className="flex justify-between w-full mb-6 items-center">
                    <h3 className="text-xs font-black text-gray-500 dark:text-zinc-400 flex items-center gap-2 tracking-widest uppercase">
                        <Timer size={14} className={isActive ? 'text-blue-500 dark:text-red-500 animate-pulse' : 'text-gray-400'} />
                        พักตามกำหนดไอคอน
                    </h3>

                    <button
                        type="button"
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-red-500 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
                    >
                        <Settings2 size={16} />
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isCustomizing ? (
                        <motion.div
                            key="custom"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col items-center gap-4 my-6 w-full"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    value={customTime}
                                    onChange={handleCustomTimeChange}
                                    className="w-24 bg-gray-50 dark:bg-zinc-950 border-2 border-transparent focus:border-blue-500 dark:focus:border-red-500 rounded-2xl px-4 py-3 text-center text-2xl font-black text-gray-900 dark:text-white outline-none transition-all"
                                    min="1"
                                />
                                <span className="text-gray-500 dark:text-zinc-400 font-bold uppercase tracking-wide text-xs">วินาที</span>
                            </div>
                            <button
                                type="button"
                                onClick={applyCustomTime}
                                className="w-full max-w-[200px] bg-blue-600 dark:bg-red-600 text-white py-3 rounded-2xl font-black shadow-lg shadow-blue-500/20 dark:shadow-red-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                ตั้งเวลาใหม่
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative flex items-center justify-center my-6"
                        >
                            {/* Circular Progress */}
                            <svg className="w-40 h-40 transform -rotate-90">
                                <circle
                                    cx="80" cy="80" r="74"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    className="text-gray-100 dark:text-zinc-800"
                                />
                                <motion.circle
                                    cx="80" cy="80" r="74"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    fill="transparent"
                                    strokeDasharray="465"
                                    strokeDashoffset={465 - (465 * progress) / 100}
                                    className={`transition-all duration-1000 ease-linear ${isFinished ? 'text-green-500' : isActive ? 'text-blue-500 dark:text-red-600' : 'text-gray-300 dark:text-zinc-600'}`}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className={`text-4xl font-black tracking-tighter transition-colors duration-500 ${isFinished ? 'text-green-600' : 'text-gray-900 dark:text-zinc-100'}`}>
                                    {formatTime(timeLeft)}
                                </span>
                                {isFinished && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1"
                                    >
                                        ลุยต่อ!
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-4 w-full justify-center">
                    {!isCustomizing && (
                        <>
                            <button
                                type="button"
                                onClick={resetTimer}
                                className="p-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-zinc-300 font-bold rounded-2xl transition-all shadow-sm active:scale-95"
                                title="Reset"
                            >
                                <RotateCcw size={22} />
                            </button>
                            <button
                                type="button"
                                onClick={toggleTimer}
                                className={`flex-1 py-4 rounded-3xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${isFinished
                                    ? 'bg-green-500 shadow-green-500/30'
                                    : isActive
                                        ? 'bg-orange-500 shadow-orange-500/30'
                                        : 'bg-blue-600 dark:bg-red-600 shadow-blue-500/30 dark:shadow-red-950/40'
                                    }`}
                            >
                                {isFinished ? <Bell size={24} /> : isActive ? <Pause size={24} /> : <Play size={24} />}
                                <span>{isFinished ? 'เริ่มใหม่' : isActive ? 'หยุด' : 'พักต่อ'}</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Hidden hook for parent components to trigger timer */}
            <button
                type="button"
                id="hidden-timer-start-btn"
                className="hidden"
                onClick={() => {
                    setTimeLeft(customTime);
                    setIsFinished(false);
                    setIsActive(true);
                }}
            />
        </div>
    );
}

