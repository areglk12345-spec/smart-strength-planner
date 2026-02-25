import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { goal, daysPerWeek, level } = await req.json()

        // Fetch user's recent workout data for context
        const since = new Date()
        since.setDate(since.getDate() - 30)
        const sinceStr = since.toISOString().split('T')[0]

        const [logsRes, prsRes] = await Promise.all([
            supabase
                .from('workout_logs')
                .select(`date, workout_log_exercises ( weight, sets, reps, exercises ( name, muscle_group ) )`)
                .eq('user_id', user.id)
                .gte('date', sinceStr)
                .order('date', { ascending: false })
                .limit(10),
            supabase
                .from('workout_log_exercises')
                .select(`weight, exercises ( name, muscle_group ), workout_logs!inner ( user_id, date )`)
                .eq('workout_logs.user_id', user.id)
                .order('weight', { ascending: false })
                .limit(10),
        ])

        // Build context string
        const muscleGroups: Record<string, number> = {}
        for (const log of logsRes.data ?? []) {
            for (const ex of (log.workout_log_exercises ?? []) as any[]) {
                const mg = ex.exercises?.muscle_group
                if (mg) muscleGroups[mg] = (muscleGroups[mg] ?? 0) + 1
            }
        }

        const recentMuscles = Object.entries(muscleGroups)
            .sort((a, b) => b[1] - a[1])
            .map(([m]) => m)
            .join(', ')

        const topPRs = (prsRes.data ?? [])
            .slice(0, 5)
            .map((p: any) => `${p.exercises?.name}: ${p.weight}kg`)
            .join(', ')

        const systemPrompt = `คุณเป็นโค้ชฟิตเนสผู้เชี่ยวชาญ ตอบเป็นภาษาไทย กระชับ และปฏิบัติได้จริง`

        const userPrompt = `
ข้อมูลนักกีฬา:
- ระดับ: ${level}
- เป้าหมาย: ${goal}
- ต้องการฝึก: ${daysPerWeek} วัน/สัปดาห์
- กล้ามเนื้อที่ฝึกบ่อยใน 30 วัน: ${recentMuscles || 'ยังไม่มีข้อมูล'}
- PR ปัจจุบัน: ${topPRs || 'ยังไม่มีข้อมูล'}

กรุณาแนะนำ:
1. ตารางฝึก ${daysPerWeek} วัน/สัปดาห์ (ระบุวันและกล้ามเนื้อที่ focus)
2. ท่าออกกำลังกายหลัก 3-4 ท่าต่อวัน พร้อม sets/reps แนะนำ
3. เคล็ดลับสั้นๆ 1-2 ข้อที่เหมาะกับเป้าหมาย

ตอบแบบมีโครงสร้าง ใช้หัวข้อและ bullet points ให้อ่านง่าย
`.trim()

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                max_tokens: 800,
                temperature: 0.7,
            }),
        })

        if (!openaiRes.ok) {
            const err = await openaiRes.json()
            return NextResponse.json({ error: err.error?.message ?? 'OpenAI error' }, { status: 500 })
        }

        const data = await openaiRes.json()
        const result = data.choices?.[0]?.message?.content ?? 'ไม่มีคำตอบ'

        return NextResponse.json({ suggestion: result })

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
