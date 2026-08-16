import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { token } = await request.json();
    if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    const admin = createAdminClient();
    const { data: member } = await admin
      .from("org_members")
      .select("id, org_id, subscription_tier, status, email")
      .eq("invite_token", token)
      .single();

    if (!member || member.status !== "pending") {
      return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
    }

    if (member.email.toLowerCase() !== user.email!.toLowerCase()) {
      return NextResponse.json({ error: "This invite is for a different email address" }, { status: 403 });
    }

    // Accept invite
    await admin.from("org_members").update({
      user_id: user.id,
      status: "active",
      joined_at: new Date().toISOString(),
      invite_token: null,
    }).eq("id", member.id);

    // Grant subscription tier and link org
    await admin.from("users").update({
      subscription_tier: member.subscription_tier,
      org_id: member.org_id,
    }).eq("id", user.id);

    return NextResponse.json({ ok: true, tier: member.subscription_tier });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
