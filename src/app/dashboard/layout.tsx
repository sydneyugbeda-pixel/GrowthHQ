import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      <Sidebar user={profile || { email: user.email }} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
