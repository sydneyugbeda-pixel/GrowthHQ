import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";

interface Props {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}

export default async function CheckoutCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const reference = params.reference || params.trxref;

  if (!reference) {
    redirect("/#pricing");
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    }
  );
  const { status, data } = await res.json();

  if (!status || data?.status !== "success") {
    redirect("/#pricing?payment=failed");
  }

  const userId = data.metadata?.userId;
  const plan = data.metadata?.plan;

  if (userId && plan) {
    const supabase = createAdminClient();
    await supabase.from("users").update({ subscription_tier: plan }).eq("id", userId);
  }

  redirect("/dashboard?payment=success");
}
