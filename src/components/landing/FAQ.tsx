"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How is Growth HQ different from other learning platforms?",
    a: "Growth HQ is not just a course library — it's a complete AI-powered growth system. We combine personalized AI coaching, skill assessments, habit tracking, community, and learning content into one integrated platform that adapts to you.",
  },
  {
    q: "How does the AI coach work?",
    a: "Our AI coach (Atlas) is powered by advanced language models and your personal growth profile. It understands your goals, tracks your progress, and delivers contextual guidance for communication, leadership, sales, and more — 24/7.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Absolutely. You can cancel anytime with no questions asked. If you cancel an annual plan, you'll retain access for the remainder of your billing period.",
  },
  {
    q: "Is my data private and secure?",
    a: "Yes. We take privacy seriously. Your coaching conversations, journal entries, and assessment data are encrypted and never sold to third parties. You own your data.",
  },
  {
    q: "What skill areas does the platform cover?",
    a: "Growth HQ covers 7 core growth dimensions: Communication, Leadership, Sales, Confidence, Productivity, Emotional Intelligence, and Business Growth — with new content added weekly.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Every plan includes a 14-day free trial with no credit card required. The Free tier is available indefinitely with limited features.",
  },
  {
    q: "Can I use Growth HQ on mobile?",
    a: "Yes! Growth HQ is fully responsive and works beautifully on all devices. Mobile apps for iOS and Android are on our roadmap.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0f0e0c]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="section-pill mb-5">Got Questions?</div>
          <h2 className="text-4xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-3">
            I&apos;ve Got Answers.
          </h2>
          <div className="section-divider mt-5 mb-5" />
          <p className="text-[#6b7280] dark:text-[#9ca3af]">
            Everything you need to know about Growth HQ.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#e8e8e4] dark:border-[#2a2824] bg-white dark:bg-[#1a1916] overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#fcf1ea]/50 dark:hover:bg-[#2c1d12]/30 transition-colors"
              >
                <span className="font-semibold text-[#1a1a1a] dark:text-white text-sm pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 shrink-0 text-[#C4622D] transition-transform duration-200",
                    open === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed border-t border-[#f5f4f0] dark:border-[#2a2824] pt-3">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
