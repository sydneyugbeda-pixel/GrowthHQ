import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Check admin role (emails ending in admin domain or specific email)
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  return <div className="min-h-screen bg-slate-50 dark:bg-slate-950">{children}</div>;
}
