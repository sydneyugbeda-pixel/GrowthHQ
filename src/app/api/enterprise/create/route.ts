import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { companyName, billingEmail } = await request.json();
    if (!companyName || !billingEmail) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const admin = createAdminClient();

    const { data: org, error: orgError } = await admin
      .from("organizations")
      .insert({ name: companyName, slug, owner_id: user.id, billing_email: billingEmail })
      .select()
      .single();

    if (orgError) {
      const msg = orgError.message.includes("unique") ? "A company with that name already exists" : orgError.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Add owner as a member
    await admin.from("org_members").insert({
      org_id: org.id,
      user_id: user.id,
      email: user.email,
      role: "owner",
      status: "active",
      joined_at: new Date().toISOString(),
    });

    // Link user to org and mark onboarding complete
    await admin.from("users").update({
      org_id: org.id,
      onboarding_complete: true,
    }).eq("id", user.id);

    return NextResponse.json({ orgId: org.id });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
