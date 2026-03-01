'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addNutritionLog(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' }

    const date = formData.get('date')?.toString() || new Date().toISOString().split('T')[0]
    const mealName = formData.get('meal_name')?.toString()
    const calories = parseInt(formData.get('calories')?.toString() || '0')
    const protein = parseFloat(formData.get('protein')?.toString() || '0')
    const carbs = parseFloat(formData.get('carbs')?.toString() || '0')
    const fat = parseFloat(formData.get('fat')?.toString() || '0')

    if (!mealName) return { error: 'กรุณาระบุชื่ออาหาร' }

    const { error } = await supabase
        .from('nutrition_logs')
        .insert([{
            user_id: user.id,
            date,
            meal_name: mealName,
            calories,
            protein,
            carbs,
            fat
        }])

    if (error) {
        console.error('Error adding nutrition log:', error)
        return { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
    }

    revalidatePath('/nutrition')
    revalidatePath('/')
    return { success: true }
}

export async function deleteNutritionLog(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' }

    const { error } = await supabase
        .from('nutrition_logs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting nutrition log:', error)
        return { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' }
    }

    revalidatePath('/nutrition')
    revalidatePath('/')
    return { success: true }
}

export async function getNutritionLogs(date: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching nutrition logs:', error)
        return []
    }

    return data
}

export async function getDailyNutritionSummary(date: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('nutrition_logs')
        .select('calories, protein, carbs, fat')
        .eq('user_id', user.id)
        .eq('date', date)

    if (error) {
        console.error('Error fetching nutrition summary:', error)
        return null
    }

    const summary = data.reduce((acc, curr) => ({
        calories: acc.calories + (curr.calories || 0),
        protein: acc.protein + (curr.protein || 0),
        carbs: acc.carbs + (curr.carbs || 0),
        fat: acc.fat + (curr.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

    return summary
}
