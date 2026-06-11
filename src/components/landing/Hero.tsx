"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Star, TrendingUp, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const TRUST_ITEMS = [
  "AI-Powered Coaching",
  "7 Skill Assessments",
  "Growth Tracking",
  "Expert Community",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16 bg-white dark:bg-[#0f0e0c]">

      {/* Subtle warm background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(196,98,45,0.08),transparent)]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fdf0e8]/40 dark:bg-[#2a1e12]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#f5f4f0]/60 dark:bg-[#201f1c]/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(#2D2D2D 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">

        {/* Section pill */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fdf0e8] dark:bg-[#2a1e12] border border-[#C4622D]/20 text-[#C4622D] dark:text-[#E07840] text-xs font-semibold uppercase tracking-wider mb-8"
          style={{ animation: "heroFadeUp 0.6s ease forwards", animationDelay: "0.05s", opacity: 0 }}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          AI-Powered Personal Growth Platform
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-[72px] font-black tracking-tight text-[#1a1a1a] dark:text-white leading-[1.06] mb-6"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.15s", opacity: 0 }}
        >
          Build With
          <br />
          <span className="gradient-text">Strategy.</span>
          <br />
          <span className="text-[#4D4D4D] dark:text-[#d1cfc9]">Grow With</span>{" "}
          <span className="gradient-text">Confidence.</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-xl text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.25s", opacity: 0 }}
        >
          The elite platform for transforming your communication, leadership, sales,
          and business effectiveness — powered by your personal AI coach.
        </p>

        {/* Trust checklist */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-10"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.32s", opacity: 0 }}
        >
          {TRUST_ITEMS.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-sm text-[#4D4D4D] dark:text-[#d1cfc9] font-medium">
              <CheckCircle className="w-4 h-4 text-[#C4622D] shrink-0" />
              {item}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.38s", opacity: 0 }}
        >
          <Link href="/auth/signup">
            <Button
              variant="gradient"
              size="lg"
              className="px-8 shadow-xl shadow-orange-500/20 text-base"
              iconRight={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Journey Free
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="px-8 text-base font-semibold">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Stats bar */}
        <div
          className="flex flex-wrap items-center justify-center gap-8 mb-16"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.45s", opacity: 0 }}
        >
          {[
            { icon: <Users className="w-4 h-4" />, value: "10,000+", label: "Professionals" },
            { icon: <Star className="w-4 h-4" />,  value: "4.9/5",   label: "Avg. Rating" },
            { icon: <TrendingUp className="w-4 h-4" />, value: "3.2×", label: "Faster Growth" },
            { icon: <Zap className="w-4 h-4" />,   value: "500+",    label: "Skills Covered" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <span className="text-[#C4622D]">{stat.icon}</span>
              <span className="font-black text-xl text-[#1a1a1a] dark:text-white">{stat.value}</span>
              <span className="text-sm text-[#6b7280] dark:text-[#9ca3af]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div
          className="relative max-w-5xl mx-auto"
          style={{ animation: "heroFadeUp 0.8s ease forwards", animationDelay: "0.52s", opacity: 0 }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-[#e8e8e4] dark:border-[#2a2824] shadow-[0_24px_80px_rgba(196,98,45,0.12)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            {/* Browser bar */}
            <div className="bg-[#f7f6f3] dark:bg-[#201f1c] px-4 py-3 flex items-center gap-2 border-b border-[#e8e8e4] dark:border-[#2a2824]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="mx-auto flex-1 max-w-xs">
                <div className="bg-white dark:bg-[#2a2824] rounded-md px-3 py-1 text-xs text-[#9ca3af] text-center border border-[#e8e8e4] dark:border-[#333028]">
                  app.growthhq.io/dashboard
                </div>
              </div>
            </div>
            <DashboardPreview />
          </div>
          {/* Glow */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#C4622D]/15 blur-3xl rounded-full" />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <span className="text-xs text-[#6b7280]">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-0.5 h-5 rounded-full bg-[#C4622D]"
        />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="bg-[#f7f6f3] dark:bg-[#0f0e0c] p-4 sm:p-6">
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="col-span-2 hidden sm:block">
          <div className="space-y-1.5">
            {["Dashboard", "AI Coach", "Assessments", "Learning", "Tracking"].map((item, i) => (
              <div key={item} className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                i === 0
                  ? "bg-[#C4622D] text-white"
                  : "text-[#6b7280] dark:text-[#9ca3af] hover:text-[#2D2D2D]"
              }`}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="col-span-12 sm:col-span-10 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Growth Score", value: "847", icon: "⚡" },
              { label: "Day Streak",   value: "23",  icon: "🔥" },
              { label: "Skills",       value: "12",  icon: "🎯" },
              { label: "XP Points",    value: "4,230", icon: "✨" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-[#1a1916] rounded-xl p-3 border border-[#e8e8e4] dark:border-[#2a2824]">
                <div className="text-lg mb-1">{stat.icon}</div>
                <div className="text-base font-black text-[#1a1a1a] dark:text-white">{stat.value}</div>
                <div className="text-[10px] text-[#9ca3af]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Skills */}
            <div className="bg-white dark:bg-[#1a1916] rounded-xl p-4 border border-[#e8e8e4] dark:border-[#2a2824]">
              <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#f5f4f0] mb-3 uppercase tracking-wide">Skill Breakdown</p>
              <div className="space-y-2">
                {[
                  { skill: "Communication", pct: 82 },
                  { skill: "Leadership", pct: 71 },
                  { skill: "Sales", pct: 65 },
                  { skill: "Confidence", pct: 88 },
                ].map((s) => (
                  <div key={s.skill} className="flex items-center gap-2">
                    <span className="text-xs text-[#9ca3af] w-24 shrink-0">{s.skill}</span>
                    <div className="flex-1 h-1.5 bg-[#f5f4f0] dark:bg-[#2a2824] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C4622D] to-[#E8943A]" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#4D4D4D] dark:text-[#d1cfc9]">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coach */}
            <div className="bg-white dark:bg-[#1a1916] rounded-xl p-4 border border-[#e8e8e4] dark:border-[#2a2824]">
              <p className="text-xs font-bold text-[#2D2D2D] dark:text-[#f5f4f0] mb-3 uppercase tracking-wide">AI Coach</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C4622D] to-[#E8943A] shrink-0 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white fill-white" />
                  </div>
                  <div className="bg-[#fdf0e8] dark:bg-[#2a1e12] rounded-xl rounded-tl-sm px-3 py-2 text-xs text-[#4D4D4D] dark:text-[#d1cfc9] max-w-xs border border-[#C4622D]/10">
                    Great progress this week! Leadership consistency is up 23%. 🎯
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="bg-[#f5f4f0] dark:bg-[#2a2824] rounded-xl rounded-tr-sm px-3 py-2 text-xs text-[#4D4D4D] dark:text-[#d1cfc9] max-w-xs">
                    What should I focus on today?
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#2D2D2D] shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
