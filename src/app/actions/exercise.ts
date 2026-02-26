'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function addExercise(formData: FormData) {
    const supabase = await createClient()

    // ดึงข้อมูลผู้ใช้ปัจจุบัน (ถ้าต้องการบันทึกว่าใครเป็นคนเพิ่ม)
    // const { data: { user } } = await supabase.auth.getUser()

    const name = formData.get('name')?.toString()
    const muscle_group = formData.get('muscle_group')?.toString()
    const type = formData.get('type')?.toString()
    const description = formData.get('description')?.toString()
    const youtube_url = formData.get('youtube_url')?.toString() || null

    if (!name || !muscle_group || !type) {
        return { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }
    }

    const { error } = await supabase
        .from('exercises')
        .insert([
            {
                name,
                muscle_group,
                type,
                description: description || '',
                youtube_url,
            },
        ])

    if (error) {
        console.error('Error adding exercise:', error)
        return { error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' }
    }

    revalidatePath('/')
    return { success: true }
}

export async function updateExercise(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name')?.toString()
    const muscle_group = formData.get('muscle_group')?.toString()
    const type = formData.get('type')?.toString()
    const description = formData.get('description')?.toString()
    const youtube_url = formData.get('youtube_url')?.toString() || null

    if (!name || !muscle_group || !type) {
        return { error: 'กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน' }
    }

    const { error } = await supabase
        .from('exercises')
        .update({
            name,
            muscle_group,
            type,
            description: description || '',
            youtube_url,
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating exercise:', error)
        return { error: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' }
    }

    revalidatePath('/')
    return { success: true }
}

export async function deleteExercise(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('exercises')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting exercise:', error)
        return { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' }
    }

    revalidatePath('/')
    return { success: true }
}
