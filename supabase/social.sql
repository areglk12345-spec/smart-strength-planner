-- Profiles table already exists with 'name'. We just need to add 'avatar_url' if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- View to aggregate user stats for leaderboard: Total Volume past 30 days
DROP VIEW IF EXISTS public.leaderboard_volume;
CREATE OR REPLACE VIEW public.leaderboard_volume AS
SELECT
  p.id AS user_id,
  p.name AS username,
  p.avatar_url,
  COALESCE(SUM(wle.sets * wle.reps * wle.weight), 0) AS total_volume_30d,
  COUNT(DISTINCT wl.id) as workouts_count
FROM
  public.profiles p
LEFT JOIN public.workout_logs wl ON wl.user_id = p.id AND wl.date >= current_date - interval '30 days'
LEFT JOIN public.workout_log_exercises wle ON wle.workout_log_id = wl.id
GROUP BY
  p.id, p.name, p.avatar_url
ORDER BY
  total_volume_30d DESC;

-- View for top PRs (e.g., max bench press all time) for leaderboard
DROP VIEW IF EXISTS public.leaderboard_prs;
CREATE OR REPLACE VIEW public.leaderboard_prs AS
SELECT DISTINCT ON (wle.exercise_id, wl.user_id)
  wle.exercise_id,
  e.name AS exercise_name,
  wl.user_id,
  p.name AS username,
  p.avatar_url,
  wle.weight AS max_weight,
  wl.date
FROM
  public.workout_log_exercises wle
JOIN public.workout_logs wl ON wl.id = wle.workout_log_id
JOIN public.exercises e ON e.id = wle.exercise_id
JOIN public.profiles p ON p.id = wl.user_id
ORDER BY
  wle.exercise_id, wl.user_id, wle.weight DESC, wl.date DESC;
