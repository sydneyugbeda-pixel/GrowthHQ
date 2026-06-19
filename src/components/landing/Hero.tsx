"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Flame,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const SKILL_PILLS = [
  { label: "AI Coaching",   tone: "dark",  pos: "top-2 -left-4",      float: "float-slow" },
  { label: "Communication", tone: "brand", pos: "top-16 -right-6",    float: "float-med"  },
  { label: "Leadership",    tone: "brand", pos: "top-1/2 -left-10",   float: "float-med"  },
  { label: "Confidence",    tone: "dark",  pos: "bottom-24 -right-8", float: "float-slow" },
  { label: "Sales Mastery", tone: "dark",  pos: "bottom-2 left-6",    float: "float-med"  },
];

const MARQUEE_ITEMS = [
  "Communication",
  "Leadership",
  "AI Coaching",
  "Sales",
  "Confidence",
  "Productivity",
  "Emotional Intelligence",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 lg:pt-32 cloud-bg">
      {/* Soft dot grid */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(#2D2D2D 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />

      {/* Rotating "Start Free" badge */}
      <div className="hidden lg:block absolute top-28 right-8 xl:right-20 z-20">
        <RotatingBadge />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── Left: copy ── */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#C4622D] mb-5"
              style={{ animation: "heroFadeUp 0.6s ease forwards", animationDelay: "0.05s", opacity: 0 }}
            >
              <span className="h-px w-6 bg-[#C4622D]" />
              Hello there
              <span className="text-base">👋</span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] font-bold tracking-tight text-[#2D2D2D] dark:text-white leading-[1.05] mb-6"
              style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.12s", opacity: 0 }}
            >
              Master your growth with{" "}
              <span className="gradient-text">AI coaching</span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg text-[#5b5048] dark:text-[#a99c93] max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.2s", opacity: 0 }}
            >
              The elite platform for transforming your communication, leadership, and
              business effectiveness — guided by a personal AI coach that grows with you.
            </p>

            {/* Reviews */}
            <div
              className="flex items-center justify-center lg:justify-start gap-4 mb-8"
              style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.28s", opacity: 0 }}
            >
              <div className="flex -space-x-2.5">
                {[
                  { i: "AM", c: "from-[#C4622D] to-[#DD8348]" },
                  { i: "JL", c: "from-[#DD8348] to-[#EBAE7E]" },
                  { i: "SR", c: "from-[#9E4D21] to-[#C4622D]" },
                  { i: "KT", c: "from-[#D06F38] to-[#E59B63]" },
                ].map((a) => (
                  <div
                    key={a.i}
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${a.c} ring-2 ring-white dark:ring-[#161210] flex items-center justify-center text-[10px] font-bold text-white`}
                  >
                    {a.i}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-[#C4622D]">10,000+</span>
                  <span className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#C4622D] text-[#C4622D]" />
                    ))}
                  </span>
                  <span className="text-xs font-semibold text-[#5b5048] dark:text-[#a99c93]">(4.9 of 5)</span>
                </div>
                <p className="text-xs text-[#8a7d74]">Trusted by members worldwide</p>
              </div>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8"
              style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.36s", opacity: 0 }}
            >
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto pl-7 pr-2.5 group"
                  iconRight={
                    <span className="ml-1 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  }
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-7">
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Social */}
            <div
              className="flex items-center justify-center lg:justify-start gap-3"
              style={{ animation: "heroFadeUp 0.7s ease forwards", animationDelay: "0.44s", opacity: 0 }}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8a7d74]">Follow us on</span>
              <div className="flex items-center gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full border border-[#e7d9cf] dark:border-[#322822] text-[#5b5048] dark:text-[#a99c93] flex items-center justify-center hover:bg-[#C4622D] hover:border-[#C4622D] hover:text-white transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: visual composition ── */}
          <div
            className="relative flex justify-center lg:justify-end"
            style={{ animation: "heroFadeUp 0.9s ease forwards", animationDelay: "0.3s", opacity: 0 }}
          >
            <div className="relative w-full max-w-md">
              {/* Organic orange blob */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[94%] aspect-square bg-gradient-to-br from-[#C4622D] to-[#DD8348] blob-morph opacity-95 shadow-[0_40px_120px_rgba(196,98,45,0.35)]" />
              </div>

              {/* Main product card */}
              <div className="relative z-10 mx-auto w-full max-w-[340px] mt-6 mb-6">
                <CoachCard />
              </div>

              {/* Floating skill pills */}
              {SKILL_PILLS.map((p) => (
                <div key={p.label} className={`hidden sm:block absolute ${p.pos} z-20 ${p.float}`}>
                  <SkillPill tone={p.tone as "brand" | "dark"}>{p.label}</SkillPill>
                </div>
              ))}

              {/* Floating testimonial quote */}
              <div className="hidden md:block absolute -bottom-4 -left-6 lg:-left-12 z-20 float-med max-w-[210px]">
                <div className="bg-white/90 dark:bg-[#1e1815]/90 backdrop-blur-xl rounded-2xl p-4 border border-white/70 dark:border-white/10 shadow-[0_16px_50px_rgba(45,45,45,0.12)]">
                  <Quote className="w-5 h-5 text-[#C4622D] mb-1.5" />
                  <p className="text-xs leading-relaxed text-[#5b5048] dark:text-[#d8ccc3] font-medium">
                    &ldquo;Growth HQ transformed how I lead my team — highly recommended!&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Marquee ticker ── */}
      <div className="marquee-mask relative overflow-hidden bg-[#2D2D2D] dark:bg-[#0f0c0a] py-4 -mb-px">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {MARQUEE_ITEMS.map((item) => (
                <span key={item} className="flex items-center text-white text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap">
                  <span className="px-6">{item}</span>
                  <span className="text-[#C4622D] text-2xl leading-none">+</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pieces ── */

function SkillPill({ tone, children }: { tone: "brand" | "dark"; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold shadow-lg backdrop-blur whitespace-nowrap ${
        tone === "brand"
          ? "bg-[#C4622D] text-white shadow-[#C4622D]/30"
          : "bg-[#2D2D2D] text-white shadow-black/20"
      }`}
    >
      <Sparkles className="w-3 h-3 text-[#EBAE7E]" />
      {children}
    </span>
  );
}

function RotatingBadge() {
  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="spin-slow w-full h-full">
        <defs>
          <path id="badgeCircle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-[#2D2D2D] dark:fill-white" style={{ fontSize: "10.5px", fontWeight: 600, letterSpacing: "2.6px", textTransform: "uppercase" }}>
          <textPath href="#badgeCircle" startOffset="0%">
            Start Free · No Card · Start Free ·
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-11 h-11 rounded-full bg-[#C4622D] flex items-center justify-center shadow-lg shadow-[#C4622D]/30">
          <ArrowUpRight className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}

function CoachCard() {
  return (
    <div className="rounded-3xl overflow-hidden border border-white/70 dark:border-white/10 shadow-[0_30px_90px_rgba(196,98,45,0.22)] bg-white dark:bg-[#1e1815]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#f0e8e2] dark:border-[#322822]">
        <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#C4622D] to-[#DD8348] flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#1e1815]" />
        </div>
        <div>
          <p className="text-sm font-bold text-[#2D2D2D] dark:text-white leading-tight">Atlas · AI Coach</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Online — ready to help</p>
        </div>
      </div>

      {/* Chat */}
      <div className="p-5 space-y-3 bg-[#faf6f3] dark:bg-[#161210]">
        <div className="flex justify-end">
          <div className="bg-[#2D2D2D] text-white rounded-2xl rounded-br-sm px-3.5 py-2 text-xs max-w-[80%]">
            How do I become a better leader?
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C4622D] to-[#DD8348] shrink-0 flex items-center justify-center mt-0.5">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div className="bg-white dark:bg-[#1e1815] border border-[#f0e8e2] dark:border-[#322822] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-xs text-[#5b5048] dark:text-[#d8ccc3] leading-relaxed max-w-[85%]">
            Your biggest lever is active listening. Want a 30-day leadership sprint? 🎯
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="bg-white dark:bg-[#1e1815] rounded-xl p-3 border border-[#f0e8e2] dark:border-[#322822]">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#C4622D]" />
              <span className="text-[10px] text-[#8a7d74] font-medium">Growth Score</span>
            </div>
            <p className="text-lg font-bold text-[#2D2D2D] dark:text-white leading-none">847</p>
          </div>
          <div className="bg-white dark:bg-[#1e1815] rounded-xl p-3 border border-[#f0e8e2] dark:border-[#322822]">
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 text-[#f97316]" />
              <span className="text-[10px] text-[#8a7d74] font-medium">Day Streak</span>
            </div>
            <p className="text-lg font-bold text-[#2D2D2D] dark:text-white leading-none">23</p>
          </div>
        </div>

        {/* Skill bar */}
        <div className="bg-white dark:bg-[#1e1815] rounded-xl p-3 border border-[#f0e8e2] dark:border-[#322822]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-[#8a7d74] font-medium">Leadership</span>
            <span className="text-[10px] font-bold text-[#C4622D]">71%</span>
          </div>
          <div className="h-1.5 bg-[#f0e8e2] dark:bg-[#322822] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-[#C4622D] to-[#EBAE7E]" style={{ width: "71%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

const SOCIALS: { label: string; icon: React.ReactNode }[] = [
  {
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8.5V14h2.4v7h2.6z"/></svg>
    ),
  },
  {
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor"><path d="M17.5 4h2.9l-6.3 7.2L21.5 20h-5.7l-4.5-5.9L6.1 20H3.2l6.8-7.8L3 4h5.8l4 5.3L17.5 4zm-1 14.3h1.6L8.1 5.6H6.4l10.1 12.7z"/></svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M6.6 8.5H4V20h2.6V8.5zM5.3 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM20 20h-2.6v-5.6c0-1.3-.5-2.2-1.7-2.2-.9 0-1.4.6-1.7 1.2-.1.2-.1.5-.1.8V20H9.3s.03-9.4 0-10.4h2.6v1.5c.3-.5 1-1.3 2.4-1.3 1.8 0 3.1 1.2 3.1 3.7V20z"/></svg>
    ),
  },
  {
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.2"/><circle cx="16.5" cy="7.5" r="0.9" fill="currentColor" stroke="none"/></svg>
    ),
  },
];
