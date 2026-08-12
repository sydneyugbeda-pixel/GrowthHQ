import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("users")
      .select("full_name, email")
      .eq("id", user.id)
      .single();

    await sendWelcomeEmail(profile?.email || user.email!, profile?.full_name || "");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
