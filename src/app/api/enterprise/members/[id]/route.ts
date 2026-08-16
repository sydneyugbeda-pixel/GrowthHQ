import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase.from("users").select("org_id").eq("id", user.id).single();
    if (!profile?.org_id) return NextResponse.json({ error: "Not an org owner" }, { status: 403 });

    // Verify org owns this member
    const admin = createAdminClient();
    const { data: member } = await admin
      .from("org_members")
      .select("id, user_id, org_id, role")
      .eq("id", id)
      .eq("org_id", profile.org_id)
      .single();

    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    if (member.role === "owner") return NextResponse.json({ error: "Cannot modify org owner" }, { status: 403 });

    const body = await request.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (body.status !== undefined) updates.status = body.status;
    if (body.skill_focus !== undefined) updates.skill_focus = body.skill_focus;

    await admin.from("org_members").update(updates).eq("id", id);

    // If deactivating, revoke their subscription
    if (body.status === "deactivated" && member.user_id) {
      await admin.from("users").update({ subscription_tier: "free" }).eq("id", member.user_id);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
