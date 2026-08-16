import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("org_id").eq("id", user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: "Not part of an org" }, { status: 403 });

    const admin = createAdminClient();
    const { data: members } = await admin
      .from("org_members")
      .select("*, users(full_name, avatar_url, xp_points, streak_days)")
      .eq("org_id", profile.org_id)
      .order("created_at", { ascending: true });

    return NextResponse.json({ members: members ?? [] });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
