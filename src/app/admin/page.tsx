import { createClient } from "@/lib/supabase/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const supabase = await createClient();

  const [usersRes, assessmentsRes] = await Promise.all([
    supabase.from("users").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("assessments").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  const users = usersRes.data || [];
  const assessments = assessmentsRes.data || [];

  const stats = {
    totalUsers: users.length,
    proUsers: users.filter((u: Record<string, unknown>) => u.subscription_tier === "pro").length,
    eliteUsers: users.filter((u: Record<string, unknown>) => u.subscription_tier === "elite").length,
    freeUsers: users.filter((u: Record<string, unknown>) => u.subscription_tier === "free" || !u.subscription_tier).length,
    totalAssessments: assessments.length,
    avgScore: assessments.length
      ? Math.round(assessments.reduce((sum: number, a: Record<string, unknown>) => sum + (a.score as number), 0) / assessments.length)
      : 0,
  };

  return <AdminDashboard users={users} stats={stats} assessments={assessments} />;
}
