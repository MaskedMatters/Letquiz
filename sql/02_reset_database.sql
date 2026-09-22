-- ========================================================
-- Letquiz - Reset Database & Clear All Data Script
-- ========================================================
-- WARNING: Executing this script will permanently delete ALL users,
-- user profiles, flashcard decks, cards, folders, study classes,
-- class announcements, and test results.
--
-- Instructions:
-- Copy and paste this script into your Supabase SQL Editor and click 'Run'.
-- ========================================================

-- 1. Truncate all application data tables in order
TRUNCATE TABLE public.test_results CASCADE;
TRUNCATE TABLE public.announcements CASCADE;
TRUNCATE TABLE public.class_folders CASCADE;
TRUNCATE TABLE public.class_members CASCADE;
TRUNCATE TABLE public.classes CASCADE;
TRUNCATE TABLE public.folder_decks CASCADE;
TRUNCATE TABLE public.folders CASCADE;
TRUNCATE TABLE public.cards CASCADE;
TRUNCATE TABLE public.decks CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- 2. Delete all Supabase Auth Users
-- (This removes all authenticated users so new signups start completely fresh)
DELETE FROM auth.users;

-- Confirmation output
SELECT 'Database completely reset! All users, profiles, decks, folders, classes, and test records have been wiped.' AS status;
