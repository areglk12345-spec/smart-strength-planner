-- =============================================================================
-- Phase 34: Nutrition Tracking Schema
-- =============================================================================

-- 1. Nutrition Logs (รายวัน)
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_name TEXT NOT NULL,
    calories INTEGER NOT NULL DEFAULT 0,
    protein FLOAT NOT NULL DEFAULT 0,
    carbs FLOAT NOT NULL DEFAULT 0,
    fat FLOAT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for faster lookups
CREATE INDEX IF NOT EXISTS nutrition_logs_user_id_date_idx ON public.nutrition_logs (user_id, date);

-- 3. RLS Policies
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own nutrition logs."
ON public.nutrition_logs FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.nutrition_logs;
