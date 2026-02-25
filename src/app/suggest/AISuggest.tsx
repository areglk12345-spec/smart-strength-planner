'use client'

import { useState } from 'react'

const LEVELS = ['มือใหม่', 'ระดับกลาง', 'ขั้นสูง']
const GOALS = ['เพิ่มกล้ามเนื้อ', 'ลดไขมัน', 'เพิ่มความแข็งแกร่ง', 'เพิ่มความทนทาน', 'ฟิตรวม']
const DAYS = [2, 3, 4, 5, 6]

function formatSuggestion(text: string) {
    // Convert markdown-like text to styled HTML
    return text
        .split('\n')
        .map((line, i) => {
            if (line.startsWith('###') || line.startsWith('##')) {
                return <h4 key={i} className="font-extrabold text-blue-600 dark:text-blue-400 mt-4 mb-1 text-sm">{line.replace(/^#+\s*/, '')}</h4>
            }
            if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-bold text-gray-800 dark:text-gray-200 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
            }
            if (line.startsWith('- ') || line.startsWith('• ')) {
                return <li key={i} className="text-gray-700 dark:text-gray-300 text-sm ml-4 my-0.5 list-disc">{line.replace(/^[-•]\s*/, '')}</li>
            }
            if (line.match(/^\d+\./)) {
                return <li key={i} className="text-gray-700 dark:text-gray-300 text-sm ml-4 my-0.5 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>
            }
            if (line.trim() === '') return <br key={i} />
            return <p key={i} className="text-gray-700 dark:text-gray-300 text-sm my-0.5">{line}</p>
        })
}

export function AISuggest() {
    const [goal, setGoal] = useState(GOALS[0])
    const [level, setLevel] = useState(LEVELS[0])
    const [daysPerWeek, setDaysPerWeek] = useState(3)
    const [loading, setLoading] = useState(false)
    const [suggestion, setSuggestion] = useState('')
    const [error, setError] = useState('')

    async function handleGenerate() {
        setLoading(true)
        setSuggestion('')
        setError('')

        try {
            const res = await fetch('/api/ai-suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ goal, level, daysPerWeek }),
            })

            const data = await res.json()
            if (!res.ok || data.error) {
                setError(data.error ?? 'เกิดข้อผิดพลาด')
            } else {
                setSuggestion(data.suggestion)
            }
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Form */}
            <div className="glass-card p-5 animate-fade-in-up">
                <h2 className="font-extrabold text-gray-800 dark:text-gray-200 mb-4">ตั้งค่าก่อนรับคำแนะนำ</h2>

                <div className="grid gap-4 sm:grid-cols-3">
                    {/* Goal */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">🎯 เป้าหมาย</label>
                        <div className="flex flex-col gap-1.5">
                            {GOALS.map(g => (
                                <button key={g} onClick={() => setGoal(g)}
                                    className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${goal === g
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}>
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Level */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">💪 ระดับ</label>
                        <div className="flex flex-col gap-1.5">
                            {LEVELS.map(l => (
                                <button key={l} onClick={() => setLevel(l)}
                                    className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${level === l
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}>
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Days */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">📅 วัน/สัปดาห์</label>
                        <div className="flex flex-col gap-1.5">
                            {DAYS.map(d => (
                                <button key={d} onClick={() => setDaysPerWeek(d)}
                                    className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition-all ${daysPerWeek === d
                                            ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}>
                                    {d} วัน/สัปดาห์
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="btn-primary w-full py-3.5 rounded-2xl mt-5 font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            AI กำลังวิเคราะห์...
                        </>
                    ) : (
                        '🤖 รับคำแนะนำจาก AI'
                    )}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="glass-card p-4 border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                    ❌ {error}
                </div>
            )}

            {/* Result */}
            {suggestion && (
                <div className="glass-card p-6 animate-fade-in-up">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-700/50">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm">🤖</div>
                        <div>
                            <h3 className="font-extrabold text-gray-800 dark:text-gray-200 text-sm">คำแนะนำจาก AI</h3>
                            <p className="text-xs text-gray-400 dark:text-gray-500">{goal} · {level} · {daysPerWeek} วัน/สัปดาห์</p>
                        </div>
                        <button
                            onClick={handleGenerate}
                            className="ml-auto text-xs text-blue-500 hover:text-blue-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                            🔄 รีเจน
                        </button>
                    </div>

                    <div className="prose prose-sm max-w-none">
                        {formatSuggestion(suggestion)}
                    </div>
                </div>
            )}
        </div>
    )
}
