'use client'

import { useState, useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

let addToastFunction: (message: string, type: ToastType) => void

export function useToast() {
    return {
        toast: (message: string, type: ToastType = 'info') => {
            if (addToastFunction) addToastFunction(message, type)
        }
    }
}

export function ToastProvider() {
    const [toasts, setToasts] = useState<{ id: number; message: string; type: ToastType }[]>([])

    useEffect(() => {
        addToastFunction = (message: string, type: ToastType) => {
            const id = Date.now()
            setToasts(prev => [...prev, { id, message, type }])
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id))
            }, 3000)
        }
    }, [])

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 px-4 sm:px-0 w-full sm:w-auto items-center sm:items-end pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`animate-fade-in-up flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-semibold pointer-events-auto w-[90%] sm:w-80 backdrop-blur-md ${toast.type === 'success' ? 'bg-emerald-50/90 dark:bg-emerald-900/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-100' :
                        toast.type === 'error' ? 'bg-red-50/90 dark:bg-red-900/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100' :
                            toast.type === 'warning' ? 'bg-yellow-50/90 dark:bg-yellow-900/80 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-100' :
                                'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100'
                        }`}
                >
                    <span>
                        {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <p className="flex-1">{toast.message}</p>
                </div>
            ))}
        </div>
    )
}
