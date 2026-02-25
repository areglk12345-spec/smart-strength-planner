"use client"

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '../components/ThemeToggle'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' })
    const router = useRouter()
    const supabase = createClient()

    const handleSignUp = async (e: React.MouseEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
            setMessage({ text: error.message, type: 'error' })
        } else {
            setMessage({ text: 'สมัครสมาชิกสำเร็จ! คุณสามารถเข้าสู่ระบบได้เลย 🎉', type: 'success' })
        }
        setLoading(false)
    }

    const handleLogin = async (e: React.MouseEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', type: '' })
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
            setMessage({ text: `เข้าสู่ระบบไม่สำเร็จ: ${error.message}`, type: 'error' })
        } else {
            setMessage({ text: 'เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าหลัก...', type: 'success' })
            setTimeout(() => router.push('/'), 1500)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">เข้าสู่ระบบ</h1>
                    <p className="text-gray-500 dark:text-gray-400">Smart Strength Training Planner</p>
                </div>

                {message.text && (
                    <div className={`p-4 mb-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                        {message.text}
                    </div>
                )}

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">อีเมล</label>
                        <input
                            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="your@email.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสผ่าน</label>
                        <input
                            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="••••••••" required />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={handleLogin} disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-50">
                            {loading ? 'กำลังโหลด...' : 'เข้าสู่ระบบ'}
                        </button>
                        <button onClick={handleSignUp} disabled={loading}
                            className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-500 font-medium py-2 px-4 rounded-md transition disabled:opacity-50">
                            สมัครสมาชิก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}