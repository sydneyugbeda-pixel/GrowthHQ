import { createClient } from "@/lib/supabase/server";
import { CoachClient } from "@/components/coach/CoachClient";

export default async function CoachPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("users").select("*").eq("id", user!.id).single();
  const { data: profile_data } = await supabase.from("growth_profiles").select("*").eq("user_id", user!.id).single();
  const { data: conversations } = await supabase
    .from("coach_conversations")
    .select("id, title, created_at, updated_at")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false })
    .limit(20);

  return (
    <CoachClient
      user={profile}
      growthProfile={profile_data}
      conversations={conversations || []}
    />
  );
}
