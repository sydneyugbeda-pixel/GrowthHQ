"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, Mic, Send } from "lucide-react";

const conversations = [
  {
    user: "I have a big pitch presentation tomorrow and I'm nervous.",
    ai: "Nerves before a big pitch are completely normal — even for seasoned presenters. Let's work through this. First: what's the #1 outcome you need from this presentation?",
  },
  {
    user: "How do I become a better leader?",
    ai: "Leadership compounds over time. Based on your assessment scores, your biggest opportunity is in active listening and empowering your team's autonomy. Want me to create a 30-day leadership sprint for you?",
  },
  {
    user: "I'm struggling to close deals in sales.",
    ai: "Most closing challenges trace back to one of 3 things: unclear pain, unestablished value, or unresolved objections. Which stage do you most often lose deals? I'll build you a custom objection handling framework.",
  },
  {
    user: "Give me a morning routine for peak performance.",
    ai: "Based on your goals: 5min intention setting → 20min movement → 15min deep work → 10min learning → 10min journaling. Want me to track this as a daily habit?",
  },
];

export function AICoachShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showAI, setShowAI] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAI(false);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setShowAI(true);
        setActiveIdx((i) => (i + 1) % conversations.length);
      }, 1800);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const convo = conversations[activeIdx];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0f0e0c]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="section-pill mb-6">
              <Zap className="w-3 h-3 fill-current" />
              AI-Powered Coaching
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight mb-6">
              I combine strategic frameworks<br />
              <span className="gradient-text">with grounded coaching.</span>
            </h2>
            <div className="section-divider mb-6 ml-0" style={{ margin: "0 0 24px 0" }} />
            <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] mb-8 leading-relaxed">
              Your AI coach knows your goals, tracks your progress, and delivers expert guidance on
              communication, leadership, sales, and more — so you stop spinning and start scaling.
            </p>
            <ul className="space-y-3">
              {[
                "Real-time communication feedback",
                "Leadership scenario simulations",
                "Sales conversation coaching",
                "Personalized action plans & accountability",
                "Daily growth prompts & goal tracking",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#4D4D4D] dark:text-[#d1cfc9]">
                  <span className="w-5 h-5 rounded-full bg-[#eef3ff] dark:bg-[#0e1730] flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#C4622D]" />
                  </span>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — chat UI */}
          <div className="relative">
            <div className="bg-white dark:bg-[#1a1916] rounded-2xl border border-[#e8e8e4] dark:border-[#2a2824] shadow-[0_20px_60px_rgba(196,98,45,0.12)] overflow-hidden">

              {/* Chat header */}
              <div className="px-5 py-4 border-b border-[#f5f4f0] dark:border-[#2a2824] flex items-center gap-3 bg-[#fdfcfa] dark:bg-[#201f1c]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4622D] to-[#DD8348] flex items-center justify-center pulse-ring shadow-md shadow-blue-500/20">
                  <Zap className="w-4 h-4 text-white fill-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#1a1a1a] dark:text-white">Atlas AI Coach</p>
                  <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online — ready to help
                  </p>
                </div>
                <div className="ml-auto">
                  <Mic className="w-4 h-4 text-[#9ca3af]" />
                </div>
              </div>

              {/* Messages */}
              <div className="p-5 min-h-64 space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`user-${activeIdx}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="bg-[#f5f4f0] dark:bg-[#2a2824] rounded-2xl rounded-br-sm px-4 py-2.5 max-w-xs">
                      <p className="text-sm text-[#2D2D2D] dark:text-[#f5f4f0]">{convo.user}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {isTyping ? (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C4622D] to-[#DD8348] shrink-0 flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-white" />
                    </div>
                    <div className="bg-[#eef3ff] dark:bg-[#0e1730] rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        {[0, 1, 2].map((i) => (
                          <span key={i} className="w-2 h-2 rounded-full bg-[#C4622D] typing-dot" />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {showAI && (
                      <motion.div
                        key={`ai-${activeIdx}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-2"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C4622D] to-[#DD8348] shrink-0 flex items-center justify-center mt-0.5 shadow-sm">
                          <Zap className="w-3 h-3 text-white fill-white" />
                        </div>
                        <div className="bg-[#eef3ff] dark:bg-[#0e1730] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-xs border border-[#C4622D]/10">
                          <p className="text-sm text-[#4D4D4D] dark:text-[#d1cfc9]">{convo.ai}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>

              {/* Input */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-3 bg-[#f7f6f3] dark:bg-[#201f1c] rounded-xl px-4 py-3 border border-[#e8e8e4] dark:border-[#2a2824]">
                  <span className="text-sm text-[#9ca3af] flex-1">Ask your AI coach anything...</span>
                  <button className="w-8 h-8 rounded-lg bg-[#C4622D] hover:bg-[#9E4D21] flex items-center justify-center transition-colors">
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Ambient glow */}
            <div className="absolute -z-10 inset-0 bg-gradient-to-br from-[#C4622D]/10 to-[#DD8348]/5 rounded-3xl blur-2xl scale-110" />
          </div>
        </div>
      </div>
    </section>
  );
}
