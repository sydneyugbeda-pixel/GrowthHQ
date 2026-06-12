"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Free",
    price: { monthly: 0, annual: 0 },
    description: "Start your growth journey today",
    badge: null,
    features: [
      "2 AI coaching sessions/month",
      "1 skill assessment",
      "Basic learning resources",
      "Growth tracking (limited)",
      "Community access",
    ],
    cta: "Get Started Free",
    href: "/auth/signup",
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: 29, annual: 19 },
    description: "For serious growth seekers",
    badge: "Most Popular",
    features: [
      "Unlimited AI coaching",
      "All 7 skill assessments",
      "Full learning hub access",
      "Advanced growth tracking",
      "Personalized AI roadmap",
      "Daily growth prompts",
      "Progress reports",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/auth/signup?plan=pro",
  },
  {
    id: "elite",
    name: "Elite",
    price: { monthly: 79, annual: 59 },
    description: "For elite performers",
    badge: "Best Value",
    features: [
      "Everything in Pro",
      "AI voice coaching",
      "1-on-1 human coaching session/mo",
      "Custom growth programs",
      "Team & leadership tools",
      "White-glove onboarding",
      "Dedicated success manager",
      "Early access to features",
    ],
    cta: "Go Elite",
    href: "/auth/signup?plan=elite",
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f7f6f3] dark:bg-[#120f0c]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <div className="section-pill mb-5">Simple pricing</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1a1a1a] dark:text-white mb-4">
            Invest in your growth.
            <br />
            <span className="gradient-text">Every plan pays off.</span>
          </h2>
          <div className="section-divider mt-5 mb-6" />

          {/* Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={cn("text-sm font-medium", !annual ? "text-[#1a1a1a] dark:text-white" : "text-[#9ca3af]")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn("relative w-12 h-6 rounded-full transition-colors duration-200", annual ? "bg-[#C4622D]" : "bg-[#e8e8e4] dark:bg-[#2a2824]")}
            >
              <span className={cn("absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200", annual ? "translate-x-7" : "translate-x-1")} />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-1.5", annual ? "text-[#1a1a1a] dark:text-white" : "text-[#9ca3af]")}>
              Annual
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold">Save 35%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = annual ? plan.price.annual : plan.price.monthly;
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl p-6 border transition-all",
                  isPro
                    ? "bg-gradient-to-b from-[#C4622D] to-[#9E4D21] border-transparent text-white shadow-2xl shadow-blue-500/25 scale-[1.02]"
                    : "bg-white dark:bg-[#1a1916] border-[#e8e8e4] dark:border-[#2a2824]"
                )}
              >
                {plan.badge && (
                  <div className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold shadow-sm",
                    isPro ? "bg-white text-[#C4622D]" : "bg-[#C4622D] text-white"
                  )}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={cn("font-black text-xl mb-1", isPro ? "text-white" : "text-[#1a1a1a] dark:text-white")}>{plan.name}</h3>
                  <p className={cn("text-sm", isPro ? "text-blue-100" : "text-[#9ca3af]")}>{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className={cn("text-4xl font-black", isPro ? "text-white" : "text-[#1a1a1a] dark:text-white")}>${price}</span>
                    {price > 0 && <span className={cn("text-sm mb-1.5 font-medium", isPro ? "text-blue-100" : "text-[#9ca3af]")}>/mo</span>}
                  </div>
                  {annual && price > 0 && (
                    <p className={cn("text-xs mt-1", isPro ? "text-blue-100" : "text-[#9ca3af]")}>Billed annually (${price * 12}/yr)</p>
                  )}
                </div>

                <Link href={plan.href} className="block mb-6">
                  <Button
                    size="md"
                    className={cn("w-full justify-center font-bold",
                      isPro
                        ? "bg-white text-[#C4622D] hover:bg-orange-50 shadow-md"
                        : plan.id === "elite"
                        ? "bg-[#2D2D2D] text-white hover:bg-[#1a1a1a]"
                        : "bg-[#eef3ff] text-[#C4622D] hover:bg-[#fce8d5] border border-[#C4622D]/20"
                    )}
                    icon={plan.id !== "free" ? <Zap className="w-4 h-4" /> : undefined}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <ul className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm">
                      <Check className={cn("w-4 h-4 shrink-0", isPro ? "text-blue-100" : "text-[#C4622D]")} />
                      <span className={isPro ? "text-orange-50" : "text-[#4D4D4D] dark:text-[#d1cfc9]"}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-[#9ca3af] mt-8">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
