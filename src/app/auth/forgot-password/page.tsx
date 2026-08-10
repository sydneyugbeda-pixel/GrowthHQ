"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Zap, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const linkExpired = searchParams.get("error") === "link_expired";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">GrowthHQ</span>
        </Link>
      </div>

      {linkExpired && !sent && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
          That reset link has expired. Request a new one below.
        </div>
      )}

      {sent ? (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Check your email</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            We sent a password reset link to <span className="font-medium text-slate-700 dark:text-slate-300">{email}</span>. It expires in 1 hour.
          </p>
          <p className="text-sm text-slate-400 mb-6">Didn&apos;t get it? Check your spam folder or{" "}
            <button onClick={() => setSent(false)} className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
              try again
            </button>.
          </p>
          <Link href="/auth/login">
            <Button variant="outline" size="md" className="w-full justify-center" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to sign in
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Reset your password</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Remember it?{" "}
            <Link href="/auth/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Sign in instead
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />
            <Button type="submit" variant="gradient" size="lg" className="w-full justify-center" loading={loading}>
              Send reset link
            </Button>
          </form>

          <div className="mt-6">
            <Link href="/auth/login" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to sign in
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ForgotPasswordPage() {
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
            No worries,<br />we&apos;ve got you.
          </h1>
          <p className="text-brand-200 text-lg">
            Enter your email and we&apos;ll send a secure link to reset your password.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-950">
        <Suspense fallback={<div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
