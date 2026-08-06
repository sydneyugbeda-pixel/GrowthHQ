import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const onboarding = searchParams.get("onboarding");
  const next = searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // Password reset link
  if (tokenHash && type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });
    if (!error) {
      return NextResponse.redirect(`${origin}/auth/reset-password`);
    }
    return NextResponse.redirect(`${origin}/auth/forgot-password?error=link_expired`);
  }

  // OAuth / magic-link code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectTo = onboarding === "true" ? `${origin}/onboarding` : `${origin}${next}`;
      return NextResponse.redirect(redirectTo);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
