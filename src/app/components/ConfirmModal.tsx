'use client'

import { ReactNode } from 'react'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: ReactNode
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
    variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'ยืนยัน',
    cancelText = 'ยกเลิก',
    onConfirm,
    onCancel,
    isLoading = false,
    variant = 'danger'
}: ConfirmModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in transition-opacity"
                onClick={!isLoading ? onCancel : undefined}
            />
            <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 dark:border dark:border-zinc-800 rounded-3xl shadow-2xl p-6 animate-scale-in">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' :
                    variant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400' :
                        'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                    }`}>
                    {variant === 'danger' ? '⚠️' : variant === 'warning' ? '⚡' : 'ℹ️'}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">{title}</h3>
                <div className="text-sm text-gray-500 dark:text-zinc-400 mb-6">{message}</div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-xl font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 py-2.5 rounded-xl font-bold text-white transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' :
                            variant === 'warning' ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-500/30' :
                                'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
                            }`}
                    >
                        {isLoading && <span className="animate-spin text-sm">⏳</span>}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}
