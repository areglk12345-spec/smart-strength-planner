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
        <div className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="w-20 h-20 text-4xl bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                {description}
            </p>
            {actionText && actionHref && (
                <Link
                    href={actionHref}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-xl transition shadow-lg shadow-blue-500/30"
                >
                    {actionText}
                </Link>
            )}
        </div>
    )
}
