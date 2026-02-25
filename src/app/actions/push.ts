'use server'

import { createClient } from '@/utils/supabase/server'

export async function savePushSubscription(subscription: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Convert standard PushSubscription JSON structure to string fields for DB
    const endpoint = subscription.endpoint
    const p256dh = subscription.keys?.p256dh || ''
    const auth = subscription.keys?.auth || ''

    const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
            user_id: user.id,
            endpoint,
            p256dh,
            auth
        }, { onConflict: 'user_id, endpoint' })

    if (error) {
        console.error('Save Push Error:', error)
        return { error: error.message }
    }
    return { success: true }
}

export async function deletePushSubscription(endpoint: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .match({ user_id: user.id, endpoint })

    if (error) return { error: error.message }
    return { success: true }
}
