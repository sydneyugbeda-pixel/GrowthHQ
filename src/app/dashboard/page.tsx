import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [profileRes, assessmentsRes, journalRes, habitsRes, achievementsRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("assessments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(7),
    supabase.from("journal_entries").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("habits").select("*, habit_logs(completed_at)").eq("user_id", user.id).limit(5),
    supabase.from("user_achievements").select("*, achievements(*)").eq("user_id", user.id).limit(6),
  ]);

  return (
    <DashboardClient
      user={profileRes.data}
      assessments={assessmentsRes.data || []}
      journalEntries={journalRes.data || []}
      habits={habitsRes.data || []}
      achievements={achievementsRes.data || []}
    />
  );
}
