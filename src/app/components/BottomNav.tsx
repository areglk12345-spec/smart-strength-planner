'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, History, PencilLine, Dumbbell, User } from 'lucide-react'

export function BottomNav() {
    const pathname = usePathname()

    // Hide on login page
    if (pathname === '/login') return null

    const navItems = [
        { href: '/', icon: <Home size={22} />, label: 'หน้าแรก' },
        { href: '/logs', icon: <History size={22} />, label: 'ประวัติ' },
        { href: '/logs/new', icon: <PencilLine size={24} />, label: 'บันทึก', isFab: true },
        { href: '/routines', icon: <Dumbbell size={22} />, label: 'ตารางฝึก' },
        { href: '/profile', icon: <User size={22} />, label: 'โปรไฟล์' },
    ]

    return (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-gray-200 dark:border-zinc-800 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
            <nav className="flex justify-around items-end px-2 py-2 mb-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    if (item.isFab) {
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center -top-4"
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform active:scale-95 ${isActive
                                        ? 'bg-blue-600 dark:bg-red-600 text-white'
                                        : 'bg-gradient-to-br from-blue-500 to-purple-600 dark:from-red-600 dark:to-rose-800 text-white'
                                    }`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-bold mt-1.5 ${isActive ? 'text-blue-600 dark:text-red-500' : 'text-gray-500 dark:text-zinc-500'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full py-1 transition-all active:scale-95 ${isActive
                                    ? 'text-blue-600 dark:text-red-500'
                                    : 'text-gray-500 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-zinc-300'
                                }`}
                        >
                            <span className={`transition-transform ${isActive ? 'scale-110 mb-0.5' : 'mb-1'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-[10px] font-bold tracking-tight ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <span className="absolute bottom-0 w-1 h-1 rounded-full bg-blue-600 dark:bg-red-500 animate-pulse"></span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
