import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        await supabase
          .from("users")
          .update({
            subscription_tier: plan,
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
          })
          .eq("id", userId);
      }
      break;
    }

    case "customer.subscription.deleted":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.userId;

      if (userId) {
        const tier = event.type === "customer.subscription.deleted"
          ? "free"
          : subscription.status === "active" ? subscription.metadata?.plan || "pro" : "free";

        await supabase.from("users").update({ subscription_tier: tier }).eq("id", userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
