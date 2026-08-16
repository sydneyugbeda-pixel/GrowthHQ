import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const admin = createAdminClient();
  const { data: member } = await admin
    .from("org_members")
    .select("email, subscription_tier, status, org_id, organizations(name)")
    .eq("invite_token", token)
    .single();

  if (!member || member.status !== "pending") {
    return NextResponse.json({ error: "Invalid or expired invite" }, { status: 404 });
  }

  return NextResponse.json({
    email: member.email,
    tier: member.subscription_tier,
    orgName: (member.organizations as { name: string } | null)?.name ?? "",
  });
}
