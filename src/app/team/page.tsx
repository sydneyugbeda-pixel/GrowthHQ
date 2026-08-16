import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { TeamClient } from "@/components/team/TeamClient";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single();
  if (!profile?.org_id) redirect("/dashboard");

  const admin = createAdminClient();

  const [{ data: org }, { data: members }] = await Promise.all([
    admin.from("organizations").select("*").eq("id", profile.org_id).single(),
    admin
      .from("org_members")
      .select("*, users(full_name, avatar_url, xp_points, streak_days)")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: true }),
  ]);

  return (
    <TeamClient
      org={org}
      members={members ?? []}
      currentUser={profile}
    />
  );
}
