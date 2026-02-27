'use client'

import { useState } from 'react'
import { toggleRoutinePublic } from '@/app/actions/routine'
import { useToast } from '@/app/components/Toast'

export function TogglePublicButton({ routineId, isPublic }: { routineId: string; isPublic: boolean }) {
    const [loading, setLoading] = useState(false)
    const [currentPublic, setCurrentPublic] = useState(isPublic)
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const publicUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/routines/${routineId}`
        : `/routines/${routineId}`

    async function handleToggle() {
        setLoading(true)
        const res = await toggleRoutinePublic(routineId, currentPublic)
        setLoading(false)
        if (res.error) {
            toast(res.error, 'error')
        } else {
            setCurrentPublic(res.is_public ?? !currentPublic)
            toast(res.is_public ? 'เปิดสาธารณะแล้ว' : 'ซ่อนเป็นส่วนตัวแล้ว', 'success')
        }
    }

    async function handleCopy() {
        await navigator.clipboard.writeText(publicUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-50 justify-center w-full sm:w-auto ${currentPublic
                    ? 'bg-green-100 dark:bg-emerald-950/40 text-green-700 dark:text-emerald-400 border border-green-300 dark:border-emerald-900/50 hover:bg-green-200 dark:hover:bg-emerald-900/60'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border border-gray-300 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700'
                    }`}
            >
                <span>{loading ? '⏳' : currentPublic ? '🌐' : '🔒'}</span>
                {loading ? 'กำลังอัปเดต...' : currentPublic ? 'Public — กดเพื่อซ่อน' : 'Private — กดเพื่อแชร์'}
            </button>

            {currentPublic && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-zinc-950/50 border border-blue-200 dark:border-zinc-800 rounded-xl">
                    <span className="text-xs text-blue-700 dark:text-zinc-400 font-mono truncate flex-1 select-all font-medium">
                        {publicUrl}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="shrink-0 text-xs bg-blue-600 hover:bg-blue-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border dark:border-zinc-700 text-white px-4 py-2 rounded-lg transition-colors font-bold shadow-sm"
                    >
                        {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                </div>
            )}
        </div>
    )
}
