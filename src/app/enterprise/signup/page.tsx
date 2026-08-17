"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Mail, Lock, Eye, EyeOff, User, Zap, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function EnterpriseSignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, phone } },
      });
      if (error) { toast.error(error.message); return; }

      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          toast.success("Account created! Please confirm your email and sign in.");
          window.location.href = "/auth/login";
          return;
        }
      }

      const res = await fetch("/api/enterprise/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, billingEmail: email }),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error || "Failed to create organisation"); return; }

      toast.success("Organisation created! Let's set up your team.");
      window.location.href = "/assessments?welcome=1";
    } finally {
      setLoading(false);
    }
  };

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
            Grow your team.<br />Accelerate results.
          </h1>
          <p className="text-brand-200 text-lg mb-10">
            Give your team members personalised AI coaching and skill development at scale.
          </p>
          {[
            { emoji: "🧠", text: "AI coaching for every team member" },
            { emoji: "🎯", text: "Assign skill development goals per person" },
            { emoji: "📊", text: "Track team progress in one dashboard" },
            { emoji: "💳", text: "Buy Pro or Elite seats individually" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-brand-200">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">GrowthHQ</span>
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create your organisation</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Individual user?{" "}
            <Link href="/auth/signup" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">
              Sign up here
            </Link>
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Company / Organisation name"
              type="text"
              placeholder="Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              leftIcon={<Building2 className="w-4 h-4" />}
              required
            />
            <Input
              label="Your full name"
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
              label="Work email"
              type="email"
              placeholder="alex@acmecorp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
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
              Create Organisation
            </Button>
          </form>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-5">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
