"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

const perks = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
];

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0d14]">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[2rem] overflow-hidden cloud-bg border border-[#ebeef5] dark:border-[#1e2330] p-12 sm:p-16 text-center shadow-[0_30px_90px_rgba(59,111,246,0.12)]">

          {/* Floating accent cards */}
          <div className="hidden md:block absolute left-8 top-12 float-slow">
            <div className="bg-white/85 dark:bg-[#11141d]/85 backdrop-blur-xl rounded-2xl p-3 border border-white/70 dark:border-white/10 shadow-lg">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C4622D]" />
                <span className="text-xs font-semibold text-[#0d1117] dark:text-white">Daily Journal</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block absolute right-8 bottom-12 float-med">
            <div className="bg-white/85 dark:bg-[#11141d]/85 backdrop-blur-xl rounded-2xl p-3 border border-white/70 dark:border-white/10 shadow-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-semibold text-[#0d1117] dark:text-white">78% growth</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="section-pill justify-center mb-6">Start growing today</div>
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#0d1117] dark:text-white tracking-tight mb-4 leading-[1.08]">
              Achieve operational<br />excellence with <span className="gradient-text">Growth HQ</span>
            </h2>
            <p className="text-[#5b6478] dark:text-[#9ca3af] text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Let&apos;s get clear — and get moving. Join 10,000+ high performers leveling up
              with AI-powered growth coaching.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
              {perks.map((p) => (
                <span key={p} className="flex items-center gap-1.5 text-sm text-[#41485a] dark:text-[#c7ccd9] font-medium">
                  <CheckCircle className="w-4 h-4 text-[#C4622D] shrink-0" />
                  {p}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/auth/signup">
                <Button
                  variant="gradient"
                  size="lg"
                  className="px-9"
                  iconRight={<ArrowRight className="w-5 h-5" />}
                >
                  Get Started
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="lg" className="px-7">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
