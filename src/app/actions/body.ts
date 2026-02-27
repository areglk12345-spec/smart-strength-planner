'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Body Measurements ─────────────────────────────────────────────────────────

export async function addMeasurement(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const date = formData.get('date')?.toString() || new Date().toISOString().split('T')[0]
    const weight = formData.get('weight') ? Number(formData.get('weight')) : null
    const body_fat = formData.get('body_fat_percentage') ? Number(formData.get('body_fat_percentage')) : null
    const waist = formData.get('waist') ? Number(formData.get('waist')) : null
    const arms = formData.get('arms') ? Number(formData.get('arms')) : null
    const hips = formData.get('hips') ? Number(formData.get('hips')) : null
    const chest = formData.get('chest') ? Number(formData.get('chest')) : null
    const legs = formData.get('legs') ? Number(formData.get('legs')) : null

    const { error } = await supabase.from('body_measurements').insert({
        user_id: user.id,
        date,
        weight,
        body_fat_percentage: body_fat,
        waist,
        arms,
        hips,
        chest,
        legs
    })

    if (error) return { error: 'เกิดข้อผิดพลาดในการบันทึก' }

    revalidatePath('/body')
    return { success: true }
}

export async function getMeasurements() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    return data || []
}

export async function deleteMeasurement(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const { error } = await supabase
        .from('body_measurements')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: 'เกิดข้อผิดพลาดในการลบ' }

    revalidatePath('/body')
    return { success: true }
}

// ── Progress Photos ───────────────────────────────────────────────────────────

export async function getProgressPhotos() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

    return data || []
}

export async function deleteProgressPhoto(id: string, photoUrl: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    // Extract stored path from URL
    const storageUrl = new URL(photoUrl)
    const pathParts = storageUrl.pathname.split('/progress_photos/')
    if (pathParts[1]) {
        await supabase.storage.from('progress_photos').remove([pathParts[1]])
    }

    const { error } = await supabase
        .from('progress_photos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: 'เกิดข้อผิดพลาดในการลบรูป' }

    revalidatePath('/body')
    return { success: true }
}
