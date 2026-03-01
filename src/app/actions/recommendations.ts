'use server';

import { createClient } from '@/utils/supabase/server';

export interface RecommendedRoutine {
    id: string;
    name: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    exercises: { name: string; muscle_group: string }[];
}

const RECOMMENDATIONS: RecommendedRoutine[] = [
    {
        id: 'rec_full_body_beg',
        name: 'Full Body Foundations',
        description: 'เน้นท่าพื้นฐานที่ใช้กล้ามเนื้อหลายส่วนพร้อมกัน เหมาะสำหรับผู้เริ่มต้นเพื่อสร้างความแข็งแรงทั่วร่าง',
        level: 'beginner',
        exercises: [
            { name: 'Goblet Squat', muscle_group: 'Legs' },
            { name: 'Push Ups', muscle_group: 'Chest' },
            { name: 'Dumbbell Rows', muscle_group: 'Back' },
            { name: 'Plank', muscle_group: 'Abs' }
        ]
    },
    {
        id: 'rec_ppl_push_int',
        name: 'PPL: Push Day',
        description: 'เน้นกล้ามเนื้อกลุ่มผลัก (อก, ไหล่, หลังแขน) เพื่อเพิ่มมวลกล้ามเนื้อและความแข็งแรงเฉพาะส่วน',
        level: 'intermediate',
        exercises: [
            { name: 'Bench Press', muscle_group: 'Chest' },
            { name: 'Overhead Press', muscle_group: 'Shoulders' },
            { name: 'Incline Dumbbell Press', muscle_group: 'Chest' },
            { name: 'Tricep Pushdowns', muscle_group: 'Arms' }
        ]
    },
    {
        id: 'rec_ppl_pull_int',
        name: 'PPL: Pull Day',
        description: 'เน้นกล้ามเนื้อกลุ่มดึง (หลัง, ไหล่หลัง, หน้าแขน) เพื่อสร้างความหนาและความกว้างของแผ่นหลัง',
        level: 'intermediate',
        exercises: [
            { name: 'Deadlift', muscle_group: 'Back' },
            { name: 'Lat Pulldown', muscle_group: 'Back' },
            { name: 'Seated Rows', muscle_group: 'Back' },
            { name: 'Bicep Curls', muscle_group: 'Arms' }
        ]
    },
    {
        id: 'rec_advanced_split',
        name: 'Heavy Power Split',
        description: 'โปรแกรมความเข้มข้นสูง เน้นการยกหนักด้วยท่า Compound เพื่อทำลายสถิติ PR',
        level: 'advanced',
        exercises: [
            { name: 'Barbell Squat', muscle_group: 'Legs' },
            { name: 'Weighted Pull Ups', muscle_group: 'Back' },
            { name: 'Dipping', muscle_group: 'Chest' },
            { name: 'Romanian Deadlift', muscle_group: 'Legs' }
        ]
    }
];

export async function getRecommendedRoutines() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch user profile for experience level
    const { data: profile } = await supabase
        .from('profiles')
        .select('experience_level')
        .eq('id', user.id)
        .single();

    const level = (profile?.experience_level?.toLowerCase() || 'beginner') as RecommendedRoutine['level'];

    // Return routines matching user level, or beginner if none found
    return RECOMMENDATIONS.filter(r => r.level === level);
}

export async function cloneRecommendedRoutine(recId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'กรุณาเข้าสู่ระบบ' };

    const rec = RECOMMENDATIONS.find(r => r.id === recId);
    if (!rec) return { error: 'ไม่พบโปรแกรมที่เลือก' };

    // 1. Create new routine
    const { data: newRoutine, error: rError } = await supabase
        .from('routines')
        .insert({
            user_id: user.id,
            name: `${rec.name} (Recommended)`,
            description: rec.description,
            is_public: false
        })
        .select()
        .single();

    if (rError) return { error: rError.message };

    // 2. Add exercises (Find existing exercises in the DB by name)
    // For simplicity in this mock, we assume the exercises exist. 
    // In a real app we'd fetch IDs first.
    const { data: dbExercises } = await supabase
        .from('exercises')
        .select('id, name')
        .in('name', rec.exercises.map(e => e.name));

    if (dbExercises && dbExercises.length > 0) {
        const routineExercises = dbExercises.map((ex, index) => ({
            routine_id: newRoutine.id,
            exercise_id: ex.id,
            order_index: index
        }));

        const { error: reError } = await supabase
            .from('routine_exercises')
            .insert(routineExercises);

        if (reError) return { error: reError.message };
    }

    return { success: true, routineId: newRoutine.id };
}
