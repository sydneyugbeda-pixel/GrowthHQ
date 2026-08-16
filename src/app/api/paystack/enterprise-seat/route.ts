import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const AMOUNTS = {
  pro:   { monthly: 1_250_000,  annual: 10_000_000 },
  elite: { monthly: 3_500_000,  annual: 30_000_000 },
} as const;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { memberEmail, tier, billing, skillFocus, orgId } = await request.json();

    if (!memberEmail || !tier || !billing || !orgId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!["pro", "elite"].includes(tier) || !["monthly", "annual"].includes(billing)) {
      return NextResponse.json({ error: "Invalid tier or billing" }, { status: 400 });
    }

    // Verify caller is the org owner
    const { data: org } = await supabase
      .from("organizations")
      .select("id, name, owner_id")
      .eq("id", orgId)
      .single();

    if (!org || org.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const amount = AMOUNTS[tier as keyof typeof AMOUNTS][billing as "monthly" | "annual"];

    const payload = {
      email: user.email,
      amount,
      currency: "NGN",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/team?payment=success`,
      metadata: {
        type: "enterprise_seat",
        orgId,
        orgName: org.name,
        memberEmail,
        tier,
        billing,
        skillFocus: skillFocus ?? [],
        inviterName: user.email,
        cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/team`,
      },
    };

    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.status) {
      return NextResponse.json({ error: data.message || "Paystack error" }, { status: 502 });
    }

    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
