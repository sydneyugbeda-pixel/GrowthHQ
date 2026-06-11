-- ================================================================
-- GrowthHQ Database Schema
-- Run this in your Supabase SQL editor to set up the database
-- ================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================================
-- USERS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  xp_points INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- GROWTH PROFILES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.growth_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goals TEXT[] DEFAULT '{}',
  challenges TEXT[] DEFAULT '{}',
  skill_level TEXT DEFAULT 'intermediate',
  career_background TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  growth_roadmap TEXT,
  learning_path TEXT,
  weekly_focus TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- ASSESSMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  insights TEXT,
  recommendations TEXT[] DEFAULT '{}',
  answers JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COURSES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'intermediate' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  duration INTEGER DEFAULT 0, -- minutes
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COURSE MODULES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT DEFAULT 'article' CHECK (content_type IN ('video', 'audio', 'pdf', 'article', 'exercise')),
  content_url TEXT,
  content TEXT,
  duration INTEGER DEFAULT 0, -- minutes
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- USER PROGRESS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id, module_id)
);

-- ================================================================
-- JOURNAL ENTRIES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  mood INTEGER CHECK (mood >= 1 AND mood <= 10),
  confidence INTEGER CHECK (confidence >= 1 AND confidence <= 10),
  ai_reflection TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- HABITS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '⭐',
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  category TEXT,
  streak INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- HABIT LOGS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- ================================================================
-- ACHIEVEMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  xp_reward INTEGER DEFAULT 50,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- USER ACHIEVEMENTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ================================================================
-- COACH CONVERSATIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.coach_conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT DEFAULT 'New Conversation',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COACH MESSAGES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.coach_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id UUID REFERENCES public.coach_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COMMUNITY POSTS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  likes INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- COMMUNITY REPLIES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.community_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- POST LIKES TABLE (for tracking who liked what)
-- ================================================================
CREATE TABLE IF NOT EXISTS public.post_likes (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

-- ================================================================
-- CHALLENGES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_days INTEGER DEFAULT 30,
  xp_reward INTEGER DEFAULT 200,
  participant_count INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- USER CHALLENGES TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.user_challenges (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_id)
);

-- ================================================================
-- NOTIFICATIONS TABLE
-- ================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'achievement', 'streak', 'coach', 'system')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_category ON public.assessments(category);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_id ON public.habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS idx_coach_messages_conversation_id ON public.coach_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_coach_conversations_user_id ON public.coach_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ================================================================
-- ROW LEVEL SECURITY
-- ================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.growth_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own growth profile" ON public.growth_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own assessments" ON public.assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own journal" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own habit logs" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own conversations" ON public.coach_conversations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can read coach messages" ON public.coach_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.coach_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert coach messages" ON public.coach_messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.coach_conversations WHERE id = conversation_id AND user_id = auth.uid())
);
CREATE POLICY "Users can manage own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Community posts are public to authenticated users" ON public.community_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Community replies are public" ON public.community_replies FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Public read for courses and achievements
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are public" ON public.courses FOR SELECT USING (TRUE);
CREATE POLICY "Modules are public" ON public.course_modules FOR SELECT USING (TRUE);
CREATE POLICY "Achievements are public" ON public.achievements FOR SELECT USING (TRUE);

-- ================================================================
-- FUNCTIONS
-- ================================================================

-- Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Increment XP function
CREATE OR REPLACE FUNCTION public.increment_xp(user_id UUID, xp_amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET xp_points = xp_points + xp_amount,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update streak function
CREATE OR REPLACE FUNCTION public.update_streak(user_id UUID)
RETURNS VOID AS $$
DECLARE
  last_active DATE;
  current_streak INTEGER;
BEGIN
  SELECT last_active_date, streak_days INTO last_active, current_streak
  FROM public.users WHERE id = user_id;

  IF last_active = CURRENT_DATE - 1 THEN
    -- Consecutive day
    UPDATE public.users
    SET streak_days = streak_days + 1,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = user_id;
  ELSIF last_active < CURRENT_DATE - 1 THEN
    -- Streak broken
    UPDATE public.users
    SET streak_days = 1,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = user_id;
  ELSIF last_active = CURRENT_DATE THEN
    -- Already logged today, no change
    NULL;
  ELSE
    -- First login
    UPDATE public.users
    SET streak_days = 1,
        last_active_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- SEED DATA
-- ================================================================

-- Seed achievements
INSERT INTO public.achievements (name, description, icon, xp_reward, category) VALUES
  ('First Steps', 'Complete your onboarding', '🌱', 50, 'onboarding'),
  ('First Assessment', 'Complete your first skill assessment', '🎯', 75, 'assessment'),
  ('7-Day Streak', 'Maintain a 7-day activity streak', '🔥', 100, 'streak'),
  ('30-Day Streak', 'Maintain a 30-day activity streak', '⚡', 250, 'streak'),
  ('AI Veteran', 'Complete 10 AI coaching sessions', '🧠', 100, 'coaching'),
  ('Bookworm', 'Complete your first full course', '📚', 150, 'learning'),
  ('Communicator', 'Score 80+ on Communication assessment', '💬', 100, 'assessment'),
  ('Leader', 'Score 80+ on Leadership assessment', '🎯', 100, 'assessment'),
  ('Top 10%', 'Reach the top 10% growth score', '👑', 200, 'score'),
  ('Elite Performer', 'Reach level 10', '⭐', 500, 'level'),
  ('Community Pillar', 'Get 10 likes on community posts', '🤝', 150, 'community'),
  ('Streak Master', 'Maintain a 90-day streak', '🚀', 500, 'streak')
ON CONFLICT (name) DO NOTHING;

-- Seed default challenges
INSERT INTO public.challenges (title, description, category, duration_days, xp_reward) VALUES
  ('30-Day Communication Sprint', 'Practice one communication skill daily for 30 days', 'communication', 30, 300),
  ('Leadership Reading Challenge', 'Read and reflect on leadership content for 30 days', 'leadership', 30, 250),
  ('Daily AI Coaching Streak', 'Chat with your AI coach every day for 21 days', 'coaching', 21, 200),
  ('Sales Mastery Month', 'Complete all sales assessments and coaching sessions', 'sales', 30, 300)
ON CONFLICT DO NOTHING;
