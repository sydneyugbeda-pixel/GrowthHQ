import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const onboarding = searchParams.get("onboarding");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const redirectTo = onboarding === "true" ? `${origin}/onboarding` : `${origin}${next}`;
      return NextResponse.redirect(redirectTo);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}
