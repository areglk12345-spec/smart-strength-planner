-- Added superset_id to allow grouping exercises in a routine together as a Superset or Drop Set.
-- The superset_id can be any string identifier (e.g., UUID or a simple group ID like 'A', 'B') to group consecutive exercises.

ALTER TABLE routine_exercises
ADD COLUMN superset_id TEXT DEFAULT NULL;
