'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PR {
    exerciseName: string
    weight: number
    exerciseId: string
}

interface Props {
    prs: PR[]
    onDismiss?: () => void
}

export function PRCelebration({ prs, onDismiss }: Props) {
    const router = useRouter()
    const [visible, setVisible] = useState(true)
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(timer)
                    handleClose()
                    return 0
                }
                return c - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    function handleClose() {
        setVisible(false)
        if (onDismiss) onDismiss()
        else router.push('/logs')
    }

    if (!visible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-bounce-in">
                {/* Gold banner */}
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 p-6 text-center">
                    <div className="text-6xl mb-2 animate-bounce">🏆</div>
                    <h2 className="text-2xl font-extrabold text-white drop-shadow">
                        Personal Record!
                    </h2>
                    <p className="text-yellow-100 text-sm mt-1">คุณทำลายสถิติส่วนตัวใหม่!</p>
                </div>

                {/* PR List */}
                <div className="p-6">
                    <ul className="space-y-3 mb-6">
                        {prs.map((pr, i) => (
                            <li key={i} className="flex items-center gap-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                                <div className="text-2xl">🥇</div>
                                <div className="flex-1">
                                    <div className="font-bold text-gray-900 dark:text-gray-100">{pr.exerciseName}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">น้ำหนักสูงสุดใหม่</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-extrabold text-yellow-600 dark:text-yellow-400">
                                        {pr.weight}
                                    </div>
                                    <div className="text-xs text-gray-400">kg</div>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleClose}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-yellow-500/30"
                    >
                        🎉 เยี่ยมมาก! ({countdown}s)
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes bounce-in {
                    0%   { transform: scale(0.5); opacity: 0; }
                    70%  { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .animate-bounce-in { animation: bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
            `}</style>
        </div>
    )
}
