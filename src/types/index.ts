export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  subscription_tier: "free" | "pro" | "elite";
  onboarding_complete: boolean;
  xp_points: number;
  streak_days: number;
  created_at: string;
}

export interface GrowthProfile {
  id: string;
  user_id: string;
  goals: string[];
  challenges: string[];
  skill_level: string;
  career_background: string;
  focus_areas: string[];
  growth_roadmap?: string;
  learning_path?: string;
  weekly_focus?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  category: string;
  score: number;
  insights: string;
  recommendations: string[];
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: number;
  thumbnail_url?: string;
  is_premium: boolean;
  modules: CourseModule[];
  created_at: string;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  content_type: "video" | "audio" | "pdf" | "article" | "exercise";
  content_url?: string;
  content: string;
  duration: number;
  order: number;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  module_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: number;
  confidence: number;
  ai_reflection?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  category: string;
  streak: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed_at: string;
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  category: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

export interface CoachMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface CoachConversation {
  id: string;
  user_id: string;
  title: string;
  messages: CoachMessage[];
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  category: string;
  likes: number;
  replies: number;
  created_at: string;
  user: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface GrowthScore {
  overall: number;
  communication: number;
  leadership: number;
  sales: number;
  confidence: number;
  productivity: number;
  emotional_intelligence: number;
  business: number;
}
