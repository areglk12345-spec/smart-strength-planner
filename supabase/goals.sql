-- Run this SQL in Supabase SQL Editor to create the goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
    target_weight NUMERIC NOT NULL,
    target_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own goals
CREATE POLICY "Users can manage their own goals"
ON goals FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
