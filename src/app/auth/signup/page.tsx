"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, User, Zap, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { track, identifyUser } from "@/lib/posthog";

function SignupForm() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<{ orgName: string; tier: string } | null>(null);

  useEffect(() => {
    if (!inviteToken) return;
    fetch(`/api/enterprise/invite-info?token=${inviteToken}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.email) setEmail(data.email);
        if (data.orgName) setInviteInfo({ orgName: data.orgName, tier: data.tier });
      })
      .catch(() => {});
  }, [inviteToken]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        toast.success("Account created! Please check your email to confirm, then sign in.");
        window.location.href = "/auth/login";
        return;
      }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) identifyUser(user.id, { email, name: fullName });
    track("signed_up", { method: "email" });

    // Accept invite if present
    if (inviteToken) {
      const res = await fetch("/api/enterprise/accept-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inviteToken }),
      });
      if (res.ok) {
        toast.success(`Welcome to ${inviteInfo?.orgName ?? "your team"}! Setting up your account...`);
      }
    } else {
      fetch("/api/auth/welcome", { method: "POST" }).catch(() => {});
      toast.success("Account created! Setting up your profile...");
    }

    window.location.href = "/assessments?welcome=1";
  };

  return (
    <div className="w-full max-w-md">
      {inviteInfo && (
        <div className="mb-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800">
          <p className="text-sm font-semibold text-brand-800 dark:text-brand-200">
            🎉 You&apos;ve been invited to join <strong>{inviteInfo.orgName}</strong>
          </p>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">
            You&apos;ll get a <strong>{inviteInfo.tier.charAt(0).toUpperCase() + inviteInfo.tier.slice(1)}</strong> seat — paid by your organisation.
          </p>
        </div>
      )}

      <div className="lg:hidden mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">GrowthHQ</span>
        </Link>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create your account</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
          Sign in
        </Link>
        {!inviteToken && (
          <>
            {" · "}
            <Link href="/enterprise/signup" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Signing up for a team?
            </Link>
          </>
        )}
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Alex Johnson"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          leftIcon={<User className="w-4 h-4" />}
          required
        />
        <Input
          label="Phone number"
          type="tel"
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          leftIcon={<Phone className="w-4 h-4" />}
        />
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          disabled={!!inviteToken && !!email}
          required
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          required
        />
        <Button type="submit" variant="gradient" size="lg" className="w-full justify-center mt-2" loading={loading}>
          {inviteToken ? "Accept Invite & Create Account" : "Create my account"}
        </Button>
      </form>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-5">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="underline">Terms</Link> and{" "}
        <Link href="/privacy" className="underline">Privacy Policy</Link>.
      </p>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-900 via-brand-900 to-slate-900 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="relative z-10 max-w-md text-white">
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl">GrowthHQ</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Begin your<br />elite growth journey.
          </h1>
          <p className="text-brand-200 text-lg mb-10">
            Join leaders and high performers who are leveling up with AI-powered coaching.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "10k+", label: "Active users" },
              { value: "4.9★", label: "Avg. rating" },
              { value: "3.2×", label: "Faster growth" },
              { value: "14 days", label: "Free trial" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-brand-300 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-950">
        <Suspense fallback={
          <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
        }>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
