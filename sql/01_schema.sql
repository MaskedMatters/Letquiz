-- ========================================================
-- Letquiz - Supabase PostgreSQL Database Schema
-- Standard: Modern Supabase Publishable Keys & Row Level Security
-- ========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Grant Schema Access to Public & Authenticated API roles
GRANT USAGE ON SCHEMA public TO public, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO public, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO public, authenticated;

-- 3. Profiles Table (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  streak INTEGER DEFAULT 1,
  cards_mastered INTEGER DEFAULT 0,
  tests_completed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Flashcard Decks Table (With Forking Support)
CREATE TABLE IF NOT EXISTS public.decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'unlisted', 'private')),
  view_count INTEGER DEFAULT 0,
  forked_from_id UUID,
  forked_from_author_name TEXT,
  forked_from_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Cards Table
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
  term TEXT NOT NULL,
  definition TEXT NOT NULL,
  starred BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Folders Table (With Forking Support)
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#2563eb',
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'unlisted', 'private')),
  forked_from_id UUID,
  forked_from_owner_name TEXT,
  forked_from_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Folder Decks Junction Table
CREATE TABLE IF NOT EXISTS public.folder_decks (
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE NOT NULL,
  deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (folder_id, deck_id)
);

-- 8. Study Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  banner_color TEXT DEFAULT '#2563eb',
  is_invite_only BOOLEAN DEFAULT TRUE,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Class Members Junction Table
CREATE TABLE IF NOT EXISTS public.class_members (
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (class_id, user_id)
);

-- 10. Class Folders Junction Table
CREATE TABLE IF NOT EXISTS public.class_folders (
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  folder_id UUID REFERENCES public.folders(id) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (class_id, folder_id)
);

-- 11. Class Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Test Results Table
CREATE TABLE IF NOT EXISTS public.test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  correct_count INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Access Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO public, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO public, authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folder_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- Clean Up Old Permissive Policies (if re-running)
DROP POLICY IF EXISTS "Public Profiles Read" ON public.profiles;
DROP POLICY IF EXISTS "Profile Insert Own" ON public.profiles;
DROP POLICY IF EXISTS "Profile Update Own" ON public.profiles;
DROP POLICY IF EXISTS "Decks Read Access" ON public.decks;
DROP POLICY IF EXISTS "Decks Insert Own" ON public.decks;
DROP POLICY IF EXISTS "Decks Update Own" ON public.decks;
DROP POLICY IF EXISTS "Decks Delete Own" ON public.decks;
DROP POLICY IF EXISTS "Cards Read Access" ON public.cards;
DROP POLICY IF EXISTS "Cards Manage Access" ON public.cards;
DROP POLICY IF EXISTS "Cards Insert Own Deck" ON public.cards;
DROP POLICY IF EXISTS "Cards Update Own Deck" ON public.cards;
DROP POLICY IF EXISTS "Cards Delete Own Deck" ON public.cards;
DROP POLICY IF EXISTS "Folders Read Access" ON public.folders;
DROP POLICY IF EXISTS "Folders Manage Own" ON public.folders;
DROP POLICY IF EXISTS "Folders Insert Own" ON public.folders;
DROP POLICY IF EXISTS "Folders Update Own" ON public.folders;
DROP POLICY IF EXISTS "Folders Delete Own" ON public.folders;
DROP POLICY IF EXISTS "Folder Decks All" ON public.folder_decks;
DROP POLICY IF EXISTS "Folder Decks Read Access" ON public.folder_decks;
DROP POLICY IF EXISTS "Folder Decks Insert Own Folder" ON public.folder_decks;
DROP POLICY IF EXISTS "Folder Decks Delete Own Folder" ON public.folder_decks;
DROP POLICY IF EXISTS "Classes Read Access" ON public.classes;
DROP POLICY IF EXISTS "Classes Manage Own" ON public.classes;
DROP POLICY IF EXISTS "Classes Insert Own" ON public.classes;
DROP POLICY IF EXISTS "Classes Update Own" ON public.classes;
DROP POLICY IF EXISTS "Classes Delete Own" ON public.classes;
DROP POLICY IF EXISTS "Class Members All" ON public.class_members;
DROP POLICY IF EXISTS "Class Members Read Access" ON public.class_members;
DROP POLICY IF EXISTS "Class Members Insert" ON public.class_members;
DROP POLICY IF EXISTS "Class Members Delete" ON public.class_members;
DROP POLICY IF EXISTS "Class Folders All" ON public.class_folders;
DROP POLICY IF EXISTS "Class Folders Read Access" ON public.class_folders;
DROP POLICY IF EXISTS "Class Folders Insert" ON public.class_folders;
DROP POLICY IF EXISTS "Class Folders Delete" ON public.class_folders;
DROP POLICY IF EXISTS "Announcements All" ON public.announcements;
DROP POLICY IF EXISTS "Announcements Read Access" ON public.announcements;
DROP POLICY IF EXISTS "Announcements Insert" ON public.announcements;
DROP POLICY IF EXISTS "Announcements Update" ON public.announcements;
DROP POLICY IF EXISTS "Announcements Delete" ON public.announcements;
DROP POLICY IF EXISTS "Test Results All" ON public.test_results;
DROP POLICY IF EXISTS "Test Results Read Own" ON public.test_results;
DROP POLICY IF EXISTS "Test Results Insert Own" ON public.test_results;
DROP POLICY IF EXISTS "Test Results Update Own" ON public.test_results;
DROP POLICY IF EXISTS "Test Results Delete Own" ON public.test_results;

-- Secure Row Level Security Policies

-- Profiles
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Profile Insert Own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profile Update Own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Decks
CREATE POLICY "Decks Read Access" ON public.decks FOR SELECT USING (visibility IN ('public', 'unlisted') OR auth.uid() = author_id);
CREATE POLICY "Decks Insert Own" ON public.decks FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Decks Update Own" ON public.decks FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Decks Delete Own" ON public.decks FOR DELETE USING (auth.uid() = author_id);

-- Cards (Scoped to parent deck ownership and visibility)
CREATE POLICY "Cards Read Access" ON public.cards FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.decks d
    WHERE d.id = cards.deck_id
    AND (d.visibility IN ('public', 'unlisted') OR d.author_id = auth.uid())
  )
);
CREATE POLICY "Cards Insert Own Deck" ON public.cards FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.decks d
    WHERE d.id = cards.deck_id
    AND d.author_id = auth.uid()
  )
);
CREATE POLICY "Cards Update Own Deck" ON public.cards FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.decks d
    WHERE d.id = cards.deck_id
    AND d.author_id = auth.uid()
  )
);
CREATE POLICY "Cards Delete Own Deck" ON public.cards FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.decks d
    WHERE d.id = cards.deck_id
    AND d.author_id = auth.uid()
  )
);

-- Folders
CREATE POLICY "Folders Read Access" ON public.folders FOR SELECT USING (visibility IN ('public', 'unlisted') OR auth.uid() = owner_id);
CREATE POLICY "Folders Insert Own" ON public.folders FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Folders Update Own" ON public.folders FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Folders Delete Own" ON public.folders FOR DELETE USING (auth.uid() = owner_id);

-- Folder Decks Junction
CREATE POLICY "Folder Decks Read Access" ON public.folder_decks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.folders f
    WHERE f.id = folder_decks.folder_id
    AND (f.visibility IN ('public', 'unlisted') OR f.owner_id = auth.uid())
  )
);
CREATE POLICY "Folder Decks Insert Own Folder" ON public.folder_decks FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.folders f
    WHERE f.id = folder_decks.folder_id
    AND f.owner_id = auth.uid()
  )
);
CREATE POLICY "Folder Decks Delete Own Folder" ON public.folder_decks FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.folders f
    WHERE f.id = folder_decks.folder_id
    AND f.owner_id = auth.uid()
  )
);

-- Classes
CREATE POLICY "Classes Read Access" ON public.classes FOR SELECT USING (true);
CREATE POLICY "Classes Insert Own" ON public.classes FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Classes Update Own" ON public.classes FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Classes Delete Own" ON public.classes FOR DELETE USING (auth.uid() = owner_id);

-- Class Members Junction
CREATE POLICY "Class Members Read Access" ON public.class_members FOR SELECT USING (true);
CREATE POLICY "Class Members Insert" ON public.class_members FOR INSERT WITH CHECK (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_members.class_id
    AND c.owner_id = auth.uid()
  )
);
CREATE POLICY "Class Members Delete" ON public.class_members FOR DELETE USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_members.class_id
    AND c.owner_id = auth.uid()
  )
);

-- Class Folders Junction
CREATE POLICY "Class Folders Read Access" ON public.class_folders FOR SELECT USING (true);
CREATE POLICY "Class Folders Insert" ON public.class_folders FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_folders.class_id
    AND c.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.class_members cm
    WHERE cm.class_id = class_folders.class_id
    AND cm.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.folders f
    WHERE f.id = class_folders.folder_id
    AND f.owner_id = auth.uid()
  )
);
CREATE POLICY "Class Folders Delete" ON public.class_folders FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = class_folders.class_id
    AND c.owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.folders f
    WHERE f.id = class_folders.folder_id
    AND f.owner_id = auth.uid()
  )
);

-- Announcements
CREATE POLICY "Announcements Read Access" ON public.announcements FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = announcements.class_id
    AND (
      c.owner_id = auth.uid()
      OR NOT c.is_invite_only
      OR EXISTS (
        SELECT 1 FROM public.class_members cm
        WHERE cm.class_id = announcements.class_id
        AND cm.user_id = auth.uid()
      )
    )
  )
);
CREATE POLICY "Announcements Insert" ON public.announcements FOR INSERT WITH CHECK (
  auth.uid() = author_id AND (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = announcements.class_id
      AND c.owner_id = auth.uid()
    ) OR EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.class_id = announcements.class_id
      AND cm.user_id = auth.uid()
    )
  )
);
CREATE POLICY "Announcements Update" ON public.announcements FOR UPDATE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = announcements.class_id
    AND c.owner_id = auth.uid()
  )
);
CREATE POLICY "Announcements Delete" ON public.announcements FOR DELETE USING (
  auth.uid() = author_id OR EXISTS (
    SELECT 1 FROM public.classes c
    WHERE c.id = announcements.class_id
    AND c.owner_id = auth.uid()
  )
);

-- Test Results (Strict Owner Isolation)
CREATE POLICY "Test Results Read Own" ON public.test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Test Results Insert Own" ON public.test_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Test Results Update Own" ON public.test_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Test Results Delete Own" ON public.test_results FOR DELETE USING (auth.uid() = user_id);

-- Hardening: Revoke execution on rls_auto_enable function if present
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
  END IF;
END $$;

