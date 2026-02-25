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
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mt-4">
            <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">เปิดการแจ้งเตือน (Push)</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">รับแจ้งเตือนเตือนความจำเมื่อถึงเวลาฝึกของแต่ละวัน</p>
            </div>
            <button
                onClick={handleToggle}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isSubscribed ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={isSubscribed}
            >
                <span className="sr-only">Toggle notifications</span>
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSubscribed ? 'translate-x-5' : 'translate-x-0'}`}
                />
            </button>
        </div>
    )
}
