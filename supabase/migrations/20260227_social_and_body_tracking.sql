-- ==============================================================================
-- Phase 32: Social & Community Schema
-- ==============================================================================

-- 1. User Followers (for following other users)
CREATE TABLE public.user_followers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see all followers" 
ON public.user_followers FOR SELECT 
USING (true);

CREATE POLICY "Users can follow others" 
ON public.user_followers FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow" 
ON public.user_followers FOR DELETE 
USING (auth.uid() = follower_id);

-- 2. Workout Likes
CREATE TABLE public.workout_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(log_id, user_id)
);

ALTER TABLE public.workout_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can see likes" 
ON public.workout_likes FOR SELECT 
USING (true);

CREATE POLICY "Users can like workouts" 
ON public.workout_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike workouts" 
ON public.workout_likes FOR DELETE 
USING (auth.uid() = user_id);

-- 3. Workout Comments
CREATE TABLE public.workout_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    log_id UUID NOT NULL REFERENCES public.workout_logs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workout_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can see comments" 
ON public.workout_comments FOR SELECT 
USING (true);

CREATE POLICY "Users can comment" 
ON public.workout_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.workout_comments FOR DELETE 
USING (auth.uid() = user_id);


-- ==============================================================================
-- Phase 33: Body Progress & Health Tracking Schema
-- ==============================================================================

-- 1. Progress Photos Table
CREATE TABLE public.progress_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight NUMERIC(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own photos" ON public.progress_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own photos" ON public.progress_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own photos" ON public.progress_photos FOR DELETE USING (auth.uid() = user_id);

-- 2. Body Measurements Table
CREATE TABLE public.body_measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight NUMERIC(5,2),
    body_fat_percentage NUMERIC(4,2),
    waist NUMERIC(5,2),
    arms NUMERIC(5,2),
    hips NUMERIC(5,2),
    chest NUMERIC(5,2),
    legs NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own measurements" ON public.body_measurements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own measurements" ON public.body_measurements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own measurements" ON public.body_measurements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own measurements" ON public.body_measurements FOR DELETE USING (auth.uid() = user_id);

-- 3. Add body goals to existing goals table
ALTER TABLE public.goals
ADD COLUMN target_body_fat NUMERIC(4,2),
ADD COLUMN target_waist NUMERIC(5,2);

-- 4. Create Storage Bucket for Progress Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('progress_photos', 'progress_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for the Storage Bucket
CREATE POLICY "Public Access to Photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'progress_photos');

CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'progress_photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'progress_photos' AND auth.uid()::text = (storage.foldername(name))[1]);
