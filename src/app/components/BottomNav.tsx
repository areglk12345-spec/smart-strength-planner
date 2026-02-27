'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function BottomNav() {
    const pathname = usePathname()
    // Hide on login page
    if (pathname === '/login') return null

    const navItems = [
        { href: '/', icon: '🏠', label: 'Home' },
        { href: '/progress', icon: '📊', label: 'Progress' },
        { href: '/calendar', icon: '📅', label: 'Calendar' },
        { href: '/leaderboard', icon: '👥', label: 'Social' },
        { href: '/profile', icon: '👤', label: 'Profile' },
    ]

    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-gray-200 dark:border-zinc-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(220,38,38,0.05)]">
            <nav className="flex justify-around items-center px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full py-1 transition-colors ${isActive ? 'text-blue-600 dark:text-red-500' : 'text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300'
                                }`}
                        >
                            <span className={`text-xl transition-transform ${isActive ? 'scale-110 mb-0.5 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 'mb-1'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
