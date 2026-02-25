-- Add is_public column to routines
ALTER TABLE public.routines
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false;

-- Add creator text or name info from profiles into the view later
-- Update policies to allow public reads if is_public = true

-- Drop the old select policy to recreate it
DROP POLICY IF EXISTS "Users can read their own routines." ON public.routines;

-- 1. Users can read their own routines
CREATE POLICY "Users can read their own routines."
ON public.routines FOR SELECT
USING (auth.uid() = user_id);

-- 2. Anyone can read public routines
CREATE POLICY "Anyone can read public routines."
ON public.routines FOR SELECT
USING (is_public = true);

-- Same for routine_exercises
DROP POLICY IF EXISTS "Users can read their own routine exercises." ON public.routine_exercises;

CREATE POLICY "Users can read their own routine exercises."
ON public.routine_exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_exercises.routine_id
    AND routines.user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can read exercises from public routines."
ON public.routine_exercises FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.routines
    WHERE routines.id = routine_exercises.routine_id
    AND routines.is_public = true
  )
);
