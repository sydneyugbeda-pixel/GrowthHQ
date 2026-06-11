"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const perks = [
  "14-day free trial",
  "No credit card required",
  "Cancel anytime",
];

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f7f6f3] dark:bg-[#120f0c]">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2D2D2D] via-[#1a1a1a] to-[#2D2D2D] p-12 sm:p-16 text-center shadow-2xl">

          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "28px 28px" }} />

          {/* Orange accent blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4622D]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E8943A]/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider border border-white/15 mb-6">
              Start growing today
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              Tired of Spinning<br />Your Wheels?
            </h2>
            <p className="text-[#d1cfc9] text-lg mb-8 max-w-lg mx-auto leading-relaxed">
              Let&apos;s get clear — and get moving. Join 10,000+ high performers leveling up
              with AI-powered growth coaching.
            </p>

            {/* Perks */}
            <div className="flex flex-wrap items-center justify-center gap-5 mb-10">
              {perks.map((p) => (
                <span key={p} className="flex items-center gap-1.5 text-sm text-[#d1cfc9] font-medium">
                  <CheckCircle className="w-4 h-4 text-[#E07840] shrink-0" />
                  {p}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  variant="gradient"
                  size="lg"
                  className="px-10 shadow-xl shadow-orange-500/30 text-base font-bold"
                  iconRight={<ArrowRight className="w-5 h-5" />}
                >
                  Start a Free Business Smarter
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-white hover:bg-white/10 border border-white/20 font-semibold"
                >
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
