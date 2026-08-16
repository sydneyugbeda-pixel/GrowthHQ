import { NextResponse } from "next/server";
import { createHmac, randomUUID } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTeamInviteEmail } from "@/lib/email";

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
      metadata?: {
        userId?: string;
        plan?: string;
        type?: string;
        orgId?: string;
        orgName?: string;
        memberEmail?: string;
        tier?: string;
        billing?: string;
        skillFocus?: string[];
        inviterName?: string;
      };
      customer?: { email?: string };
    };
  };

  const supabase = createAdminClient();

  switch (event.event) {
    case "charge.success": {
      const meta = event.data.metadata ?? {};

      if (meta.type === "enterprise_seat") {
        // Enterprise seat purchase — create pending invite
        const { orgId, orgName, memberEmail, tier, skillFocus, inviterName } = meta;
        if (orgId && memberEmail && tier) {
          const inviteToken = randomUUID();
          await supabase.from("org_members").upsert(
            {
              org_id: orgId,
              email: memberEmail,
              subscription_tier: tier,
              skill_focus: skillFocus ?? [],
              status: "pending",
              invite_token: inviteToken,
              invited_at: new Date().toISOString(),
            },
            { onConflict: "org_id,email" }
          );
          const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signup?invite=${inviteToken}`;
          await sendTeamInviteEmail(
            memberEmail,
            orgName ?? "your organisation",
            inviterName ?? "Your team admin",
            tier,
            inviteUrl
          ).catch(console.error);
        }
      } else {
        // Individual subscription purchase
        const userId = meta.userId;
        const plan = meta.plan;
        if (userId && plan) {
          await supabase.from("users").update({ subscription_tier: plan }).eq("id", userId);
        }
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
