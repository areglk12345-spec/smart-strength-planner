'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function upsertProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อน' }

    const name = formData.get('display_name')?.toString()
    const goal = formData.get('goal')?.toString()
    const heightValue = formData.get('height')?.toString()
    const experience_level = formData.get('experience_level')?.toString()
    const avatar_url = formData.get('avatar_url')?.toString()

    // Check if profile already exists
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

    let error
    if (existing) {
        // Update existing profile - ONLY provided fields
        const updateData: any = {}
        if (name !== undefined) updateData.name = name
        if (goal !== undefined) updateData.goal = goal
        if (experience_level !== undefined) updateData.experience_level = experience_level
        if (avatar_url !== undefined) updateData.avatar_url = avatar_url
        if (heightValue !== undefined) updateData.height = parseFloat(heightValue)

        const result = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
        error = result.error
    } else {
        // Insert new profile
        const result = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                name: name || null,
                goal: goal || null,
                height: heightValue ? parseFloat(heightValue) : null,
                experience_level: experience_level || null,
                avatar_url: avatar_url || null
            })
        error = result.error
    }

    if (error) {
        console.error('upsertProfile error:', error)
        return { error: `เกิดข้อผิดพลาด: ${error.message}` }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function addWeightLog(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อน' }

    const weight = parseFloat(formData.get('weight')?.toString() || '0')
    const date = formData.get('date')?.toString() || new Date().toISOString().split('T')[0]

    if (!weight || weight <= 0) return { error: 'กรุณากรอกน้ำหนักให้ถูกต้อง' }

    const { error } = await supabase
        .from('body_weight_logs')
        .insert([{ user_id: user.id, weight, date }])

    if (error) {
        console.error('addWeightLog error:', error)
        return { error: 'เกิดข้อผิดพลาดในการบันทึกน้ำหนัก' }
    }

    revalidatePath('/profile')
    return { success: true }
}
