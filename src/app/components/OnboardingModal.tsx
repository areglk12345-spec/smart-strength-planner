'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { upsertProfile } from '@/app/actions/profile'
import { useToast } from '@/app/components/Toast'
import {
    User,
    Target,
    Zap,
    ArrowRight,
    ChevronLeft,
    Dumbbell,
    CheckCircle2,
    Sparkles
} from 'lucide-react'

interface OnboardingModalProps {
    isOpen: boolean
    userEmail: string | undefined
}

export function OnboardingModal({ isOpen, userEmail }: OnboardingModalProps) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState('')
    const [level, setLevel] = useState('')
    const [goal, setGoal] = useState('')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    if (!isOpen) return null

    const handleNext = () => setStep(s => s + 1)
    const handleBack = () => setStep(s => s - 1)

    const handleSubmit = async () => {
        setLoading(true)
        const formData = new FormData()
        formData.append('display_name', name)
        formData.append('experience_level', level)
        formData.append('goal', goal)

        const res = await upsertProfile(formData)
        setLoading(false)

        if (res?.error) {
            toast(res.error, 'error')
        } else {
            toast('ตั้งค่าโปรไฟล์เรียบร้อย!', 'success')
            handleNext()
        }
    }

    const steps = [
        {
            title: "ยินดีต้อนรับสู่ Strength Planner",
            description: "ขอทราบชื่อเท่ๆ ของคุณหน่อยครับ เพื่อเริ่มการตั้งค่า",
            icon: <Sparkles size={40} className="text-yellow-500" />,
            content: (
                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="ชื่อของคุณ (เช่น อาร์ม นักยก)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-950 border-2 border-transparent focus:border-blue-500 dark:focus:border-red-500 rounded-2xl outline-none text-lg font-bold transition-all shadow-inner"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "ระดับประสบการณ์ของคุณ?",
            description: "เราจะช่วยปรับโปรแกรมให้เหมาะสมกับจุดเริ่มต้นของคุณ",
            icon: <Zap size={40} className="text-blue-500 dark:text-red-500" />,
            content: (
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { id: 'beginner', label: 'มือใหม่ (Beginner)', desc: 'ยังไม่เคยฝึก หรือฝึกไม่ถึง 6 เดือน' },
                        { id: 'intermediate', label: 'ระดับกลาง (Intermediate)', desc: 'ฝึกมาแล้ว 1-2 ปี สม่ำเสมอ' },
                        { id: 'advanced', label: 'ระดับสูง (Advanced)', desc: 'ฝึกมานานกว่า 2 ปี รู้จักท่า Compound ดี' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setLevel(item.id)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${level === item.id
                                ? 'border-blue-500 bg-blue-50 dark:border-red-500 dark:bg-red-950/20'
                                : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}
                        >
                            <div className="font-bold text-gray-900 dark:text-zinc-100">{item.label}</div>
                            <div className="text-xs text-gray-500 dark:text-zinc-500 mt-1">{item.desc}</div>
                        </button>
                    ))}
                </div>
            )
        },
        {
            title: "เป้าหมายหลักคืออะไร?",
            description: "ระบุเป้าหมายเพื่อให้ระบบช่วยติดตามความก้าวหน้า",
            icon: <Target size={40} className="text-rose-500" />,
            content: (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        {['เพิ่มมวลกล้ามเนื้อ (Build Muscle)', 'ลดไขมัน (Fat Loss)', 'เน้นพลังและความแข็งแรง (Strength)'].map(g => (
                            <button
                                key={g}
                                onClick={() => setGoal(g)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${goal === g
                                    ? 'border-blue-500 bg-blue-50 dark:border-red-500 dark:bg-red-950/20'
                                    : 'border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}
                            >
                                <div className="font-bold text-gray-900 dark:text-zinc-100">{g}</div>
                            </button>
                        ))}
                    </div>
                    <div className="pt-2">
                        <p className="text-xs text-center text-gray-400">หรือพิมพ์เป้าหมายของคุณเอง</p>
                        <input
                            type="text"
                            placeholder="เช่น ต้องการลดน้ำหนัก 5 กก."
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full px-4 py-3 mt-2 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none text-sm"
                        />
                    </div>
                </div>
            )
        },
        {
            title: "พร้อมแล้วสำหรับการเปลี่ยนร่าง!",
            description: "การตั้งค่าสำเร็จแล้ว คุณสามารถเริ่มฝึกและบันทึกผลได้ทันที",
            icon: <CheckCircle2 size={60} className="text-green-500 animate-bounce" />,
            content: (
                <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-red-950/20 rounded-full text-blue-600 dark:text-red-400 font-bold text-sm mb-4">
                        <Dumbbell size={16} /> Let's Get Strong!
                    </div>
                </div>
            )
        }
    ]

    const currentData = steps[step - 1]

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

            <div className="relative bg-white dark:bg-zinc-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scale-in border border-white/20 dark:border-zinc-800">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 px-4 py-3">
                    {[1, 2, 3, 4].map(idx => (
                        <div
                            key={idx}
                            className={`flex-1 h-full rounded-full transition-all duration-500 ${step >= idx ? 'bg-blue-600 dark:bg-red-600' : 'bg-gray-100 dark:bg-zinc-800'}`}
                        />
                    ))}
                </div>

                <div className="p-8 pt-12 flex flex-col items-center text-center">
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-zinc-950/50 rounded-3xl shadow-inner">
                        {currentData.icon}
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-zinc-100 mb-3 tracking-tight">
                        {currentData.title}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-zinc-400 mb-8 max-w-xs leading-relaxed">
                        {currentData.description}
                    </p>

                    <div className="w-full text-left">
                        {currentData.content}
                    </div>

                    <div className="w-full flex gap-3 mt-10">
                        {step > 1 && step < 4 && (
                            <button
                                onClick={handleBack}
                                className="p-4 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-bold transition-all hover:bg-gray-200 dark:hover:bg-zinc-700"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={(step === 1 && !name) || (step === 2 && !level)}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 dark:shadow-red-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <span>ต่อไป</span>
                                <ArrowRight size={20} />
                            </button>
                        ) : step === 3 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={!goal || loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-red-600 dark:to-red-800 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'กำลังบันทึก...' : 'เสร็จสิ้นการตั้งค่า'}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    router.refresh()
                                    window.location.reload()
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <span>เริ่มใช้งานแอปได้เลย!</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
