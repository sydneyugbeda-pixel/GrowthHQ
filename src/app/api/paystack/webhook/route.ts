import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const hash = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body) as {
    event: string;
    data: {
      metadata?: { userId?: string; plan?: string };
      customer?: { email?: string };
    };
  };

  const supabase = createAdminClient();

  switch (event.event) {
    case "charge.success": {
      const userId = event.data.metadata?.userId;
      const plan = event.data.metadata?.plan;
      if (userId && plan) {
        await supabase.from("users").update({ subscription_tier: plan }).eq("id", userId);
      }
      break;
    }

    case "subscription.not_renew":
    case "subscription.disable": {
      const email = event.data.customer?.email;
      if (email) {
        await supabase.from("users").update({ subscription_tier: "free" }).eq("email", email);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
