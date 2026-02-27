import Link from 'next/link'
import { ReactNode } from 'react'

interface EmptyStateProps {
    title: string
    description: string
    icon?: string | ReactNode
    actionText?: string
    actionHref?: string
}

export function EmptyState({ title, description, icon = '📭', actionText, actionHref }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700 animate-fade-in">
            <div className="w-20 h-20 text-4xl bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-5 shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-zinc-100 mb-2 tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
                {description}
            </p>
            {actionText && actionHref && (
                <Link
                    href={actionHref as string}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(220,38,38,0.2)] dark:hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)]"
                >
                    {actionText}
                </Link>
            )}
        </div>
    )
}
