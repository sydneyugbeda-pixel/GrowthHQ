import { createClient } from "@/lib/supabase/server";
import { AssessmentsClient } from "@/components/assessments/AssessmentsClient";

export default async function AssessmentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: assessments } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return <AssessmentsClient assessments={assessments || []} userId={user!.id} />;
}
