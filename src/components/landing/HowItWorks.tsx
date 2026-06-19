"use client";

import { motion } from "framer-motion";
import { UserCircle, Sparkles, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <UserCircle className="w-6 h-6" />,
    title: "Create your profile",
    description: "Tell us about your goals, background, and areas you want to grow. Takes 5 minutes.",
    color: "orange",
  },
  {
    number: "02",
    icon: <Sparkles className="w-6 h-6" />,
    title: "Get your AI roadmap",
    description: "Our AI analyzes your profile and builds a personalized growth roadmap and learning path.",
    color: "amber",
  },
  {
    number: "03",
    icon: <Target className="w-6 h-6" />,
    title: "Take daily actions",
    description: "Follow your plan, complete lessons, take assessments, and chat with your AI coach daily.",
    color: "charcoal",
  },
  {
    number: "04",
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Track your growth",
    description: "Watch your skills improve, earn achievements, and see measurable progress over time.",
    color: "green",
  },
];

const colorMap: Record<string, { bg: string; text: string }> = {
  orange:  { bg: "bg-[#fcf1ea] dark:bg-[#2c1d12]",   text: "text-[#C4622D]" },
  amber:   { bg: "bg-amber-50 dark:bg-amber-900/20",   text: "text-amber-600 dark:text-amber-400" },
  charcoal:{ bg: "bg-[#f5f4f0] dark:bg-[#2a2824]",    text: "text-[#2D2D2D] dark:text-[#f5f4f0]" },
  green:   { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400" },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f7f6f3] dark:bg-[#120f0c]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <div className="section-pill mb-5">Simple by design</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1a1a1a] dark:text-white mb-4">
            From zero to elite
            <br />
            <span className="gradient-text">in 4 steps</span>
          </h2>
          <div className="section-divider mt-5 mb-6" />
          <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-xl mx-auto">
            Growth HQ is engineered to be the simplest and most effective way to level up
            your professional and personal capabilities.
          </p>
        </div>

        <div className="relative">
          {/* Connector */}
          <div className="hidden lg:block absolute top-[52px] h-0.5 bg-gradient-to-r from-[#C4622D]/30 via-amber-400/30 to-emerald-400/30"
               style={{ left: "12.5%", right: "12.5%" }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className={`w-[104px] h-[104px] rounded-2xl flex items-center justify-center z-10 relative border-2 border-white dark:border-[#120f0c] shadow-lg ${colorMap[step.color].bg} ${colorMap[step.color].text}`}>
                    {step.icon}
                    <span className="absolute -top-0.5 -right-0.5 text-2xl font-black text-[#e8e8e4] dark:text-[#2a2824] select-none">
                      {step.number}
                    </span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#C4622D] text-white text-xs font-black flex items-center justify-center shadow-md">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-[#1a1a1a] dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
