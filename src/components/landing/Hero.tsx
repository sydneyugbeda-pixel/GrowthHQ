"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Flame, Zap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

const LOGOS = ["Microsoft", "airbnb", "Stripe", "Notion", "Linear", "Vercel"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 cloud-bg">
      {/* Soft dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(#0d1117 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Powered-by pill */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur border border-white/60 dark:border-white/10 shadow-sm text-xs font-medium text-[#41485a] dark:text-[#c7ccd9] mb-8"
          style={{ animation: "heroFadeUp 0.6s ease forwards", animationDelay: "0.05s", opacity: 0 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C4622D]" />
          Powered by Growth HQ AI
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-[68px] font-semibold tracking-tight text-[#0d1117] dark:text-white leading-[1.05] mb-6"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.15s", opacity: 0 }}
        >
          Master your growth with
          <br />
          <span className="gradient-text">AI coaching and strategy</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl text-[#5b6478] dark:text-[#9ca3af] max-w-2xl mx-auto mb-9 leading-relaxed"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.25s", opacity: 0 }}
        >
          The elite platform for transforming your communication, leadership, and
          business effectiveness — guided by a personal AI coach that grows with you.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.34s", opacity: 0 }}
        >
          <Link href="#how-it-works">
            <Button variant="outline" size="lg" className="px-7">
              View Demo
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="gradient" size="lg" className="px-7" iconRight={<ArrowRight className="w-4 h-4" />}>
              Get Started
            </Button>
          </Link>
        </div>

        <p
          className="text-xs text-[#8a92a6] dark:text-[#6b7280] mb-16"
          style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.4s", opacity: 0 }}
        >
          Free to start · No credit card required
        </p>

        {/* Floating dashboard composition */}
        <div
          className="relative max-w-5xl mx-auto"
          style={{ animation: "heroFadeUp 0.9s ease forwards", animationDelay: "0.5s", opacity: 0 }}
        >
          {/* Left floating card */}
          <div className="hidden lg:block absolute -left-6 top-10 z-20 float-slow">
            <FloatCard>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#C4622D]" />
                <span className="text-xs font-semibold text-[#0d1117] dark:text-white">Daily Journal</span>
              </div>
              <div className="text-2xl font-semibold text-[#0d1117] dark:text-white">57<span className="text-sm text-[#8a92a6] font-normal">/month</span></div>
              <div className="mt-2 flex gap-1 items-end h-8">
                {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
                  <div key={i} className="w-2 rounded-sm bg-gradient-to-t from-[#C4622D] to-[#EBAE7E]" style={{ height: `${h}%` }} />
                ))}
              </div>
            </FloatCard>
          </div>

          {/* Right floating card */}
          <div className="hidden lg:block absolute -right-6 top-24 z-20 float-med">
            <FloatCard>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#C4622D]" />
                <span className="text-xs font-semibold text-[#0d1117] dark:text-white">Business Growth</span>
              </div>
              <div className="text-2xl font-semibold text-[#0d1117] dark:text-white">78%</div>
              <div className="text-[11px] text-emerald-500 font-medium">▲ 23% this month</div>
            </FloatCard>
          </div>

          {/* Bottom-right chat bubble card */}
          <div className="hidden lg:block absolute right-10 -bottom-6 z-20 float-slow">
            <FloatCard>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#C4622D] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs text-[#41485a] dark:text-[#c7ccd9] max-w-[150px]">Leadership consistency up 23% 🎯</span>
              </div>
            </FloatCard>
          </div>

          {/* Main dashboard panel */}
          <div className="relative rounded-2xl overflow-hidden border border-white/70 dark:border-white/10 shadow-[0_30px_90px_rgba(59,111,246,0.18)] bg-white dark:bg-[#11141d]">
            <div className="bg-[#f6f8fc] dark:bg-[#141823] px-4 py-3 flex items-center gap-2 border-b border-[#ebeef5] dark:border-[#1e2330]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="mx-auto flex-1 max-w-xs">
                <div className="bg-white dark:bg-[#1a1f2b] rounded-md px-3 py-1 text-xs text-[#9ca3af] text-center border border-[#ebeef5] dark:border-[#252b3a]">
                  app.growthhq.io/dashboard
                </div>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>

        {/* Trust logos */}
        <div
          className="mt-24"
          style={{ animation: "heroFadeUp 0.8s ease forwards", animationDelay: "0.65s", opacity: 0 }}
        >
          <p className="text-xs uppercase tracking-[0.12em] text-[#8a92a6] dark:text-[#6b7280] mb-6">
            Trusted by 10,000+ professionals worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((logo) => (
              <span key={logo} className="text-lg font-semibold text-[#aeb6c7] dark:text-[#4b5263] tracking-tight">
                {logo}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-0.5 h-5 rounded-full bg-[#C4622D]"
        />
      </div>
    </section>
  );
}

function FloatCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/85 dark:bg-[#11141d]/85 backdrop-blur-xl rounded-2xl p-4 border border-white/70 dark:border-white/10 shadow-[0_12px_40px_rgba(13,17,23,0.1)] min-w-[160px]">
      {children}
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="bg-[#f6f8fc] dark:bg-[#0a0d14] p-4 sm:p-6">
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="col-span-2 hidden sm:block">
          <div className="space-y-1.5">
            {["Dashboard", "AI Coach", "Assessments", "Learning", "Tracking"].map((item, i) => (
              <div key={item} className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                i === 0
                  ? "bg-[#C4622D] text-white"
                  : "text-[#6b7280] dark:text-[#9ca3af]"
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
              { label: "Growth Score", value: "847", icon: <Zap className="w-4 h-4 text-[#C4622D]" /> },
              { label: "Day Streak",   value: "23",  icon: <Flame className="w-4 h-4 text-[#f97316]" /> },
              { label: "Skills",       value: "12",  icon: <TrendingUp className="w-4 h-4 text-[#C4622D]" /> },
              { label: "XP Points",    value: "4,230", icon: <Sparkles className="w-4 h-4 text-[#8b5cf6]" /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-[#11141d] rounded-xl p-3 border border-[#ebeef5] dark:border-[#1e2330]">
                <div className="mb-1">{stat.icon}</div>
                <div className="text-base font-semibold text-[#0d1117] dark:text-white">{stat.value}</div>
                <div className="text-[10px] text-[#9ca3af]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Skills */}
            <div className="bg-white dark:bg-[#11141d] rounded-xl p-4 border border-[#ebeef5] dark:border-[#1e2330]">
              <p className="text-xs font-bold text-[#0d1117] dark:text-[#f4f6fb] mb-3 uppercase tracking-wide">Skill Breakdown</p>
              <div className="space-y-2">
                {[
                  { skill: "Communication", pct: 82 },
                  { skill: "Leadership", pct: 71 },
                  { skill: "Sales", pct: 65 },
                  { skill: "Confidence", pct: 88 },
                ].map((s) => (
                  <div key={s.skill} className="flex items-center gap-2">
                    <span className="text-xs text-[#9ca3af] w-24 shrink-0">{s.skill}</span>
                    <div className="flex-1 h-1.5 bg-[#eef1fb] dark:bg-[#1e2330] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#C4622D] to-[#EBAE7E]" style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#41485a] dark:text-[#c7ccd9]">{s.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Coach */}
            <div className="bg-white dark:bg-[#11141d] rounded-xl p-4 border border-[#ebeef5] dark:border-[#1e2330]">
              <p className="text-xs font-bold text-[#0d1117] dark:text-[#f4f6fb] mb-3 uppercase tracking-wide">AI Coach</p>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#C4622D] shrink-0 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-[#eef3ff] dark:bg-[#0e1730] rounded-xl rounded-tl-sm px-3 py-2 text-xs text-[#41485a] dark:text-[#c7ccd9] max-w-xs border border-[#C4622D]/10">
                    Great progress this week! Leadership consistency is up 23%. 🎯
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <div className="bg-[#f3f5fb] dark:bg-[#1a1f2b] rounded-xl rounded-tr-sm px-3 py-2 text-xs text-[#41485a] dark:text-[#c7ccd9] max-w-xs">
                    What should I focus on today?
                  </div>
                  <div className="w-6 h-6 rounded-full bg-[#0d1117] shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
