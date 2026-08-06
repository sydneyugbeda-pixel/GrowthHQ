"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff, Zap, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
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
            Set a new<br />password.
          </h1>
          <p className="text-brand-200 text-lg">
            Choose something strong that you haven't used before.
          </p>
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

          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password updated!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Your password has been changed. You can now sign in with your new password.
              </p>
              <Button
                variant="gradient"
                size="lg"
                className="w-full justify-center"
                onClick={() => { window.location.href = "/dashboard"; }}
              >
                Go to dashboard
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Create new password</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">Must be at least 8 characters.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New password"
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
                <Input
                  label="Confirm password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <Button type="submit" variant="gradient" size="lg" className="w-full justify-center mt-2" loading={loading}>
                  Update password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
