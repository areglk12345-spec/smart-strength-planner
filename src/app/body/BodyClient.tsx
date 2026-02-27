'use client'

import { useState, useTransition, useRef } from 'react'
import { addMeasurement, deleteMeasurement, deleteProgressPhoto } from '@/app/actions/body'
import { useToast } from '@/app/components/Toast'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

type Measurement = {
    id: string
    date: string
    weight: number | null
    body_fat_percentage: number | null
    waist: number | null
    arms: number | null
    hips: number | null
    chest: number | null
    legs: number | null
}

type Photo = {
    id: string
    date: string
    photo_url: string
    weight: number | null
    notes: string | null
}

type Tab = 'measurements' | 'photos'

export function BodyClient({
    measurements,
    photos: initialPhotos,
    userId
}: {
    measurements: Measurement[]
    photos: Photo[]
    userId: string
}) {
    const [tab, setTab] = useState<Tab>('measurements')
    const [photos, setPhotos] = useState(initialPhotos)
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    // Chart data (oldest first)
    const chartData = [...measurements]
        .filter(m => m.weight)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(m => ({
            date: new Date(m.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }),
            น้ำหนัก: m.weight,
            ไขมัน: m.body_fat_percentage,
        }))

    async function handleAddMeasurement(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const res = await addMeasurement(formData)
            if (res.error) toast(res.error, 'error')
            else {
                toast('บันทึกสัดส่วนเรียบร้อย! 💪', 'success')
                setShowForm(false)
                    ; (e.target as HTMLFormElement).reset()
            }
        })
    }

    async function handleDeleteMeasurement(id: string) {
        if (!confirm('ต้องการลบข้อมูลนี้ใช่ไหม?')) return
        startTransition(async () => {
            const res = await deleteMeasurement(id)
            if (res.error) toast(res.error, 'error')
            else toast('ลบข้อมูลเรียบร้อย', 'success')
        })
    }

    async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const supabase = createClient()
            const ext = file.name.split('.').pop()
            const path = `${userId}/${Date.now()}.${ext}`
            const { error: uploadError } = await supabase.storage
                .from('progress_photos')
                .upload(path, file, { upsert: false })

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage.from('progress_photos').getPublicUrl(path)
            const photoUrl = urlData.publicUrl

            const { data: newPhoto, error: insertError } = await supabase
                .from('progress_photos')
                .insert({
                    user_id: userId,
                    photo_url: photoUrl,
                    date: new Date().toISOString().split('T')[0]
                })
                .select('*')
                .single()

            if (insertError) throw insertError
            setPhotos(prev => [newPhoto, ...prev])
            toast('อัปโหลดรูปเรียบร้อย! 📸', 'success')
        } catch {
            toast('เกิดข้อผิดพลาดในการอัปโหลด', 'error')
        } finally {
            setIsUploading(false)
        }
    }

    async function handleDeletePhoto(id: string, photoUrl: string) {
        if (!confirm('ต้องการลบรูปนี้ใช่ไหม?')) return
        startTransition(async () => {
            const res = await deleteProgressPhoto(id, photoUrl)
            if (res.error) toast(res.error, 'error')
            else {
                setPhotos(prev => prev.filter(p => p.id !== id))
                toast('ลบรูปเรียบร้อย', 'success')
            }
        })
    }

    const latestMeasurement = measurements[0]

    const inputCls = "w-full bg-white dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-red-500 placeholder:text-gray-400 dark:placeholder:text-zinc-600"
    const labelCls = "text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-1 block"

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Latest Stats Banner */}
            {latestMeasurement && (
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-600/10 dark:from-zinc-900 dark:to-black rounded-3xl p-6 border border-emerald-200/40 dark:border-red-500/20 shadow-sm relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 dark:bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
                    <p className="text-xs font-bold text-emerald-600 dark:text-red-400 uppercase tracking-widest mb-3">📊 สัดส่วนล่าสุด — {new Date(latestMeasurement.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <div className="flex flex-wrap gap-4">
                        {latestMeasurement.weight && (
                            <div className="text-center">
                                <div className="text-3xl font-black text-gray-900 dark:text-zinc-100">{latestMeasurement.weight}</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">kg</div>
                            </div>
                        )}
                        {latestMeasurement.body_fat_percentage && (
                            <div className="text-center">
                                <div className="text-3xl font-black text-emerald-600 dark:text-red-400">{latestMeasurement.body_fat_percentage}%</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">ไขมัน</div>
                            </div>
                        )}
                        {latestMeasurement.waist && (
                            <div className="text-center">
                                <div className="text-2xl font-black text-gray-900 dark:text-zinc-200">{latestMeasurement.waist}</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">เอว (cm)</div>
                            </div>
                        )}
                        {latestMeasurement.chest && (
                            <div className="text-center">
                                <div className="text-2xl font-black text-gray-900 dark:text-zinc-200">{latestMeasurement.chest}</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">อก (cm)</div>
                            </div>
                        )}
                        {latestMeasurement.arms && (
                            <div className="text-center">
                                <div className="text-2xl font-black text-gray-900 dark:text-zinc-200">{latestMeasurement.arms}</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">แขน (cm)</div>
                            </div>
                        )}
                        {latestMeasurement.legs && (
                            <div className="text-center">
                                <div className="text-2xl font-black text-gray-900 dark:text-zinc-200">{latestMeasurement.legs}</div>
                                <div className="text-xs text-gray-500 dark:text-zinc-400 font-semibold">ขา (cm)</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-zinc-900 p-1.5 rounded-2xl">
                {([
                    { key: 'measurements', label: '📏 สัดส่วนร่างกาย' },
                    { key: 'photos', label: '📸 รูปพัฒนาการ' },
                ] as { key: Tab; label: string }[]).map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${tab === t.key
                            ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 shadow-sm'
                            : 'text-gray-500 dark:text-zinc-500 hover:text-gray-700 dark:hover:text-zinc-300'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* === MEASUREMENTS TAB === */}
            {tab === 'measurements' && (
                <div className="space-y-6">
                    {/* Weight & Body Fat Chart */}
                    {chartData.length >= 2 && (
                        <div className="bg-white/70 dark:bg-zinc-900 p-6 rounded-3xl border border-white/40 dark:border-zinc-800 shadow-sm">
                            <h2 className="text-lg font-black text-gray-800 dark:text-zinc-100 mb-4">📈 กราฟน้ำหนัก</h2>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:[&_line]:stroke-zinc-800" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', border: 'none', borderRadius: '12px', color: '#e4e4e7' }}
                                    />
                                    <Line type="monotone" dataKey="น้ำหนัก" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
                                    {chartData.some(d => d.ไขมัน) && (
                                        <Line type="monotone" dataKey="ไขมัน" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" dot={false} />
                                    )}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Add Entry Button */}
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="w-full py-3 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors shadow-sm"
                    >
                        {showForm ? '✕ ยกเลิก' : '+ บันทึกสัดส่วนใหม่'}
                    </button>

                    {/* Add Entry Form */}
                    {showForm && (
                        <form
                            onSubmit={handleAddMeasurement}
                            className="bg-white/70 dark:bg-zinc-900 p-6 rounded-3xl border border-white/40 dark:border-zinc-800 shadow-sm space-y-5"
                        >
                            <h2 className="text-lg font-black text-gray-800 dark:text-zinc-100">📝 บันทึกสัดส่วนวันนี้</h2>

                            <div>
                                <label className={labelCls}>วันที่</label>
                                <input type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className={inputCls} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>น้ำหนัก (kg)</label>
                                    <input type="number" name="weight" step="0.1" placeholder="เช่น 72.5" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>%ไขมัน</label>
                                    <input type="number" name="body_fat_percentage" step="0.1" placeholder="เช่น 18.5" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>รอบเอว (cm)</label>
                                    <input type="number" name="waist" step="0.1" placeholder="เช่น 84" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>รอบอก (cm)</label>
                                    <input type="number" name="chest" step="0.1" placeholder="เช่น 95" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>รอบแขน (cm)</label>
                                    <input type="number" name="arms" step="0.1" placeholder="เช่น 36" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>รอบสะโพก (cm)</label>
                                    <input type="number" name="hips" step="0.1" placeholder="เช่น 92" className={inputCls} />
                                </div>
                                <div>
                                    <label className={labelCls}>รอบต้นขา (cm)</label>
                                    <input type="number" name="legs" step="0.1" placeholder="เช่น 56" className={inputCls} />
                                </div>
                            </div>

                            <button type="submit" disabled={isPending} className="w-full py-3 rounded-2xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 dark:bg-red-700 dark:hover:bg-red-600 text-white transition-colors disabled:opacity-50">
                                {isPending ? '⏳ กำลังบันทึก...' : '💾 บันทึก'}
                            </button>
                        </form>
                    )}

                    {/* Measurement History */}
                    {measurements.length === 0 ? (
                        <div className="bg-white/70 dark:bg-zinc-900 p-12 rounded-3xl border border-white/40 dark:border-zinc-800 text-center">
                            <div className="text-5xl opacity-40 mb-4">📏</div>
                            <p className="font-bold text-gray-600 dark:text-zinc-400">ยังไม่มีข้อมูลสัดส่วน</p>
                            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">เริ่มบันทึกวันนี้เพื่อดูพัฒนาการของคุณ!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h2 className="text-lg font-black text-gray-800 dark:text-zinc-100">🗂️ ประวัติสัดส่วน</h2>
                            {measurements.map(m => (
                                <div key={m.id} className="bg-white/70 dark:bg-zinc-900 p-5 rounded-2xl border border-white/40 dark:border-zinc-800 shadow-sm flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-emerald-600 dark:text-red-400 mb-2">
                                            {new Date(m.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {m.weight && <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold">{m.weight} kg</span>}
                                            {m.body_fat_percentage && <span className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-xl text-xs font-bold">{m.body_fat_percentage}% ไขมัน</span>}
                                            {m.waist && <span className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-3 py-1 rounded-xl text-xs font-semibold">เอว {m.waist} cm</span>}
                                            {m.chest && <span className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-3 py-1 rounded-xl text-xs font-semibold">อก {m.chest} cm</span>}
                                            {m.arms && <span className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-3 py-1 rounded-xl text-xs font-semibold">แขน {m.arms} cm</span>}
                                            {m.legs && <span className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 px-3 py-1 rounded-xl text-xs font-semibold">ต้นขา {m.legs} cm</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteMeasurement(m.id)} disabled={isPending} className="text-gray-300 dark:text-zinc-700 hover:text-red-500 dark:hover:text-red-400 transition-colors text-xs font-semibold shrink-0">🗑️</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* === PHOTOS TAB === */}
            {tab === 'photos' && (
                <div className="space-y-6">
                    {/* Upload Button */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-emerald-400 dark:hover:border-red-500 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer text-center transition-colors group"
                    >
                        <div className="text-4xl group-hover:scale-110 transition-transform">{isUploading ? '⏳' : '📸'}</div>
                        <p className="font-bold text-gray-600 dark:text-zinc-400">{isUploading ? 'กำลังอัปโหลด...' : 'กดเพื่ออัปโหลดรูปพัฒนาการ'}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-600">รองรับ JPG, PNG, WEBP</p>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
                    </div>

                    {/* Photo Gallery */}
                    {photos.length === 0 ? (
                        <div className="bg-white/70 dark:bg-zinc-900 p-12 rounded-3xl border border-white/40 dark:border-zinc-800 text-center">
                            <div className="text-5xl opacity-40 mb-4">🖼️</div>
                            <p className="font-bold text-gray-600 dark:text-zinc-400">ยังไม่มีรูปถ่ายพัฒนาการ</p>
                            <p className="text-sm text-gray-400 dark:text-zinc-500 mt-1">อัปโหลดรูปด้านบนเพื่อบันทึกก้าวหน้าของคุณ!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {photos.map(p => (
                                <div key={p.id} className="relative group rounded-2xl overflow-hidden aspect-square border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <Image src={p.photo_url} alt="Progress photo" fill className="object-cover" sizes="(max-width: 768px) 50vw, 33vw" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <button onClick={() => handleDeletePhoto(p.id, p.photo_url)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors">ลบ</button>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                        <p className="text-white text-xs font-semibold">{new Date(p.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        {p.weight && <p className="text-white/70 text-[10px]">{p.weight} kg</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
