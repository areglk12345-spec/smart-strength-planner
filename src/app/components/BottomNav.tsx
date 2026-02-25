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
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 pb-safe">
            <nav className="flex justify-around items-center px-2 py-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full py-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <span className={`text-xl transition-transform ${isActive ? 'scale-110 mb-0.5' : 'mb-1'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-semibold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
