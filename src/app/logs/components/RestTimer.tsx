'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RestTimerProps {
    defaultRestTime?: number; // in seconds
    onTimerEnd?: () => void;
}

export function RestTimer({ defaultRestTime = 90, onTimerEnd }: RestTimerProps) {
    const [timeLeft, setTimeLeft] = useState(defaultRestTime);
    const [isActive, setIsActive] = useState(false);
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [customTime, setCustomTime] = useState(defaultRestTime);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((time) => time - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            setIsActive(false);

            // Play sound
            try {
                const audio = new Audio('/sounds/timer-beep.mp3'); // We'll need to create this or use a browser beep
                audio.play().catch(e => console.error("Audio playback failed:", e));
            } catch (e) {
                console.error("Audio not supported");
            }

            if (onTimerEnd) onTimerEnd();
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onTimerEnd]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
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
        setIsActive(true); // Auto-start when custom time applied
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = ((customTime - timeLeft) / customTime) * 100;

    return (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-gray-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm mt-6 mb-6">
            <div className="flex flex-col items-center justify-center">
                <div className="flex justify-between w-full mb-2 items-center">
                    <h3 className="text-sm font-black text-gray-700 dark:text-zinc-300 flex items-center gap-2 tracking-tight">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        จับเวลาพัก
                    </h3>

                    <button
                        onClick={() => setIsCustomizing(!isCustomizing)}
                        className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                    >
                        ตั้งเวลา
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isCustomizing ? (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2 my-4 w-full justify-center"
                        >
                            <input
                                type="number"
                                value={customTime}
                                onChange={handleCustomTimeChange}
                                className="w-20 bg-gray-100 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-center text-lg font-black text-gray-900 dark:text-white"
                                min="1"
                            />
                            <span className="text-gray-500 dark:text-zinc-400 font-medium">วินาที</span>
                            <button
                                onClick={applyCustomTime}
                                className="ml-2 bg-blue-600 dark:bg-blue-600 text-white px-3 py-2 rounded-xl text-sm font-bold shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition"
                            >
                                ตกลง
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative flex items-center justify-center my-4"
                        >
                            {/* Circular Progress (simplified) */}
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64" cy="64" r="58"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-100 dark:text-zinc-800"
                                />
                                <circle
                                    cx="64" cy="64" r="58"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    strokeDasharray="364.4"
                                    strokeDashoffset={364.4 - (364.4 * progress) / 100}
                                    className={`transition-all duration-1000 ease-linear ${timeLeft <= 10 && isActive ? 'text-red-500 dark:text-red-500' : 'text-blue-500 dark:text-blue-500'}`}
                                />
                            </svg>
                            <div className="absolute text-3xl font-black text-gray-900 dark:text-zinc-100 tracking-tighter">
                                {formatTime(timeLeft)}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex gap-3 w-full justify-center">
                    {!isCustomizing && (
                        <>
                            <button
                                onClick={toggleTimer}
                                className={`flex-1 max-w-[120px] py-2.5 rounded-xl font-bold text-shadow-sm transition-all text-white shadow-sm ${isActive
                                        ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                                        : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
                                    }`}
                            >
                                {isActive ? 'หยุดชั่วคราว' : timeLeft < customTime ? 'ทำต่อ' : 'เริ่มจับเวลา'}
                            </button>
                            <button
                                onClick={resetTimer}
                                disabled={timeLeft === customTime && !isActive}
                                className="flex-1 max-w-[120px] py-2.5 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                รีเซ็ต
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Auto-start trigger helper for parent components */}
            <button
                id="hidden-timer-start-btn"
                className="hidden"
                onClick={() => {
                    setTimeLeft(customTime);
                    setIsActive(true);
                }}
            />
        </div>
    );
}
