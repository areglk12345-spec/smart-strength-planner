'use client'

import { useState, useEffect } from 'react'
import { savePushSubscription, deletePushSubscription } from '../actions/push'

// Helper to convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

export function PushNotificationToggle() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isSupported, setIsSupported] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            checkSubscription()
        } else {
            setLoading(false)
        }
    }, [])

    async function checkSubscription() {
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            setIsSubscribed(!!subscription)
        } catch (error) {
            console.error('Error checking push subscription:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggle() {
        if (!isSupported) return
        setLoading(true)

        try {
            const registration = await navigator.serviceWorker.ready

            if (isSubscribed) {
                // Unsubscribe
                const subscription = await registration.pushManager.getSubscription()
                if (subscription) {
                    await subscription.unsubscribe()
                    await deletePushSubscription(subscription.endpoint)
                }
                setIsSubscribed(false)
            } else {
                // Ask permission and Subscribe
                // Note: You must replace applicationServerKey with your actual public VAPID key from your server backend
                // For demo purposes, we prompt the user and show failure if key is missing
                const permission = await Notification.requestPermission()
                if (permission !== 'granted') {
                    alert('กรุณาอนุญาตการแจ้งเตือนในตั้งค่า Browser ของคุณ')
                    setLoading(false)
                    return
                }

                // WARNING: Needs valid process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                if (!vapidPublicKey) {
                    alert('ระบบยังไม่ได้กำหนด VAPID Key สำหรับส่งแจ้งเตือน')
                    setLoading(false)
                    return
                }

                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedVapidKey
                })

                await savePushSubscription(JSON.parse(JSON.stringify(subscription)))
                setIsSubscribed(true)
            }
        } catch (error: any) {
            console.error('Push notification toggle error:', error)
            alert('เกิดข้อผิดพลาด: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isSupported) {
        return (
            <div className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg mt-4">
                ⚠️ เบราว์เซอร์ของคุณไม่รองรับการแจ้งเตือน (Push Notifications)
            </div>
        )
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white/50 dark:bg-zinc-900/50 rounded-2xl mt-4 border border-gray-100 dark:border-zinc-800 gap-4">
            <div>
                <h3 className="font-black text-gray-900 dark:text-zinc-100 tracking-tight">เปิดการแจ้งเตือน (Push)</h3>
                <p className="text-xs font-bold text-gray-500 dark:text-zinc-500 mt-1 uppercase tracking-wide">รับแจ้งเตือนเมื่อถึงเวลาฝึกของแต่ละวัน</p>
            </div>
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${isSubscribed ? 'bg-blue-600 dark:bg-red-600 shadow-sm dark:shadow-[0_0_10px_rgba(220,38,38,0.4)]' : 'bg-gray-200 dark:bg-zinc-800 border-gray-300 dark:border-zinc-700'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={isSubscribed}
            >
                <span className="sr-only">Toggle notifications</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-300 ease-in-out ${isSubscribed ? 'translate-x-[1.25rem]' : 'translate-x-0'}`}
                />
            </button>
        </div>
    )
}
