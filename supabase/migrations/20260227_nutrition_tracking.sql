-- Create nutrition_logs table
CREATE TABLE public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_name TEXT NOT NULL,
    calories INTEGER NOT NULL DEFAULT 0,
    protein FLOAT NOT NULL DEFAULT 0,
    carbs FLOAT NOT NULL DEFAULT 0,
    fat FLOAT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own nutrition logs."
ON public.nutrition_logs
FOR ALL
USING (auth.uid() = user_id);

-- Index for performance
CREATE INDEX nutrition_logs_user_date_idx ON public.nutrition_logs (user_id, date);
