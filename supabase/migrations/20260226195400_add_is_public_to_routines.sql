-- Add is_public column to routines table
ALTER TABLE public.routines
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE;

-- Create policy to allow users to view public routines
CREATE POLICY "Public routines are viewable by everyone."
ON public.routines FOR SELECT
USING (is_public = true);

-- Create policy to allow users to view exercises of public routines
CREATE POLICY "Exercises of public routines are viewable by everyone."
ON public.routine_exercises FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.routines r
        WHERE r.id = routine_exercises.routine_id AND r.is_public = true
    )
);
