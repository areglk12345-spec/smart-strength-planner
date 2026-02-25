'use client'

import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        // On mount, read saved preference
        const saved = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const isDark = saved === 'dark' || (!saved && prefersDark)
        setDark(isDark)
        document.documentElement.classList.toggle('dark', isDark)
    }, [])

    function toggle() {
        const next = !dark
        setDark(next)
        document.documentElement.classList.toggle('dark', next)
        localStorage.setItem('theme', next ? 'dark' : 'light')
    }

    return (
        <button
            onClick={toggle}
            aria-label="Toggle dark mode"
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all duration-200 text-sm"
        >
            {dark ? '☀️' : '🌙'}
        </button>
    )
}
