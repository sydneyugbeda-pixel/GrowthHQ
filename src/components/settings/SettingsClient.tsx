"use client";

import { useState } from "react";
import { TopBar } from "@/components/shared/TopBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User, Lock, CreditCard, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsUser {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier?: string;
  xp_points?: number;
  streak_days?: number;
}

const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  elite: "Elite",
};

const TIER_COLORS: Record<string, "default" | "brand" | "green"> = {
  free: "default",
  pro: "brand",
  elite: "green",
};

export function SettingsClient({ user }: { user: SettingsUser }) {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "billing">("profile");

  const [fullName, setFullName] = useState(user.full_name || "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password";
      toast.error(msg);
    } finally {
      setSavingPassword(false);
    }
  };

  const tier = user.subscription_tier || "free";

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "password" as const, label: "Password", icon: <Lock className="w-4 h-4" /> },
    { id: "billing" as const, label: "Billing", icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopBar title="Settings" subtitle="Manage your account" />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">

          {/* Tab nav */}
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === "profile" && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Profile Information</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Update your display name.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email address</label>
                  <Input value={user.email || ""} disabled className="opacity-60 cursor-not-allowed" />
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Email changes require contacting support.</p>
                </div>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSaveProfile}
                  loading={savingProfile}
                  icon={savingProfile ? undefined : <Check className="w-4 h-4" />}
                >
                  Save changes
                </Button>
              </div>
            </Card>
          )}

          {/* Password tab */}
          {activeTab === "password" && (
            <Card className="p-6 space-y-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Change Password</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Choose a strong password of at least 8 characters.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm new password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleChangePassword}
                  loading={savingPassword}
                >
                  Update password
                </Button>
              </div>
            </Card>
          )}

          {/* Billing tab */}
          {activeTab === "billing" && (
            <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Current Plan</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{TIER_LABELS[tier]}</span>
                      <Badge variant={TIER_COLORS[tier]}>{TIER_LABELS[tier]}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {tier === "free"
                        ? "You are on the free plan."
                        : `You are subscribed to the ${TIER_LABELS[tier]} plan.`}
                    </p>
                    {user.xp_points !== undefined && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{user.xp_points} XP · {user.streak_days || 0}-day streak</p>
                    )}
                  </div>
                  {tier === "free" && (
                    <Button variant="gradient" size="sm" onClick={() => { window.location.href = "/#pricing"; }}>
                      Upgrade
                    </Button>
                  )}
                </div>
              </Card>

              {tier !== "free" && (
                <Card className="p-6 border-red-200 dark:border-red-900/40">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Cancel subscription</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        Your plan will remain active until the end of the billing period. To cancel, email us at{" "}
                        <a href="mailto:hello@growthhq.online" className="text-brand-600 hover:underline">hello@growthhq.online</a>.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
