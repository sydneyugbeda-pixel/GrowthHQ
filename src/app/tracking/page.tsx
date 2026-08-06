import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TrackingClient } from "@/components/tracking/TrackingClient";

export default async function TrackingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [habitsRes, todayLogsRes, journalRes, allAchievementsRes, userAchievementsRes, userStatsRes, journalCountRes] = await Promise.all([
    supabase.from("habits").select("*").eq("user_id", user.id).eq("is_active", true).order("created_at", { ascending: true }),
    supabase.from("habit_logs").select("habit_id").eq("user_id", user.id).gte("completed_at", today.toISOString()).lt("completed_at", tomorrow.toISOString()),
    supabase.from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    supabase.from("achievements").select("*").order("xp_reward", { ascending: true }),
    supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
    supabase.from("users").select("streak_days, xp_points").eq("id", user.id).single(),
    supabase.from("journal_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const completedTodayIds = new Set((todayLogsRes.data || []).map((l: { habit_id: string }) => l.habit_id));
  const habits = (habitsRes.data || []).map((h: { id: string; streak: number }) => ({ ...h, completed_today: completedTodayIds.has(h.id) }));

  const earnedIds = new Set((userAchievementsRes.data || []).map((ua: { achievement_id: string }) => ua.achievement_id));
  const achievements = (allAchievementsRes.data || []).map((a: { id: string }) => ({ ...a, earned: earnedIds.has(a.id) }));

  // Last 7 days mood data from journal entries
  const moodData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toISOString().split("T")[0];
    const entry = (journalRes.data || []).find((e: { created_at: string }) => e.created_at.startsWith(dayStr));
    return {
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      mood: entry?.mood ?? null,
      confidence: entry?.confidence ?? null,
    };
  });

  return (
    <TrackingClient
      userId={user.id}
      initialHabits={habits}
      initialJournalEntries={journalRes.data || []}
      achievements={achievements}
      userStats={userStatsRes.data || { streak_days: 0, xp_points: 0 }}
      journalCount={journalCountRes.count || 0}
      moodData={moodData}
    />
  );
}
