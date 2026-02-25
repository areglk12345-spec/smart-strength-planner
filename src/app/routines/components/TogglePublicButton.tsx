'use client'

import { useState } from 'react'
import { toggleRoutinePublic } from '@/app/actions/routine'

export function TogglePublicButton({ routineId, isPublic }: { routineId: string; isPublic: boolean }) {
    const [loading, setLoading] = useState(false)
    const [currentPublic, setCurrentPublic] = useState(isPublic)
    const [copied, setCopied] = useState(false)

    const publicUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/routines/${routineId}/public`
        : `/routines/${routineId}/public`

    async function handleToggle() {
        setLoading(true)
        const res = await toggleRoutinePublic(routineId, currentPublic)
        setLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            setCurrentPublic(res.is_public ?? !currentPublic)
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
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50 ${currentPublic
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/60'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
            >
                <span>{loading ? '⏳' : currentPublic ? '🌐' : '🔒'}</span>
                {loading ? 'กำลังอัปเดต...' : currentPublic ? 'Public — กดเพื่อซ่อน' : 'Private — กดเพื่อแชร์'}
            </button>

            {currentPublic && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <span className="text-xs text-blue-700 dark:text-blue-300 font-mono truncate flex-1 select-all">
                        {publicUrl}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="shrink-0 text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition font-medium"
                    >
                        {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                </div>
            )}
        </div>
    )
}
