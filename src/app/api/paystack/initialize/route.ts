import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const AMOUNTS = {
  pro:   { monthly: 1_250_000,  annual: 10_000_000 },
  elite: { monthly: 3_500_000,  annual: 30_000_000 },
} as const;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, billing } = await request.json() as { plan: string; billing: string };

  if (!["pro", "elite"].includes(plan) || !["monthly", "annual"].includes(billing)) {
    return NextResponse.json({ error: "Invalid plan or billing" }, { status: 400 });
  }

  const amount = AMOUNTS[plan as keyof typeof AMOUNTS][billing as "monthly" | "annual"];
  const planEnvKey = `PAYSTACK_${plan.toUpperCase()}_${billing.toUpperCase()}_PLAN`;
  const planCode = process.env[planEnvKey];

  const payload: Record<string, unknown> = {
    email: user.email,
    amount,
    currency: "NGN",
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/callback`,
    metadata: {
      userId: user.id,
      plan,
      billing,
      cancel_action: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
    },
  };

  if (planCode) {
    payload.plan = planCode;
  }

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
}
