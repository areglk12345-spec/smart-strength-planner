import { AISuggest } from './AISuggest'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SuggestPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    return (
        <main className="min-h-screen bg-mesh px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6 animate-fade-in-up">
                    <Link href="/" className="text-sm text-blue-500 hover:underline mb-1 block">← กลับหน้าหลัก</Link>
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shrink-0 shadow-lg">
                            🤖
                        </div>
                        <div>
                            <h1 className="text-3xl font-black gradient-text">AI Workout Planner</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                AI วิเคราะห์ประวัติการฝึกของคุณแล้วแนะนำตารางที่เหมาะสม
                            </p>
                        </div>
                    </div>
                </div>

                {/* Note */}
                <div className="glass-card p-3 mb-5 flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 animate-fade-in">
                    <span className="text-base">✨</span>
                    AI จะวิเคราะห์จากกล้ามเนื้อที่คุณฝึกบ่อยและ PR ปัจจุบันของคุณโดยอัตโนมัติ
                </div>

                <AISuggest />
            </div>
        </main>
    )
}
