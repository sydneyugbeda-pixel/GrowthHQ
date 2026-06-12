"use client";

import { motion, type Variants } from "framer-motion";
import { MessageSquare, Target, BookOpen, LineChart, Trophy, Users, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI Growth Coach",
    description: "A personalized AI mentor available 24/7. Get coaching, feedback, scenario simulations, and action plans tailored to your goals.",
    highlight: true,
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Smart Assessments",
    description: "Deep-dive assessments in leadership, communication, sales, EQ, and more with AI-generated insights.",
    highlight: false,
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Learning Hub",
    description: "Courses, micro-lessons, templates, and playbooks curated by world-class coaches at your pace.",
    highlight: false,
  },
  {
    icon: <LineChart className="w-6 h-6" />,
    title: "Growth Tracking",
    description: "Track habits, check-ins, and milestones. Visualize your progress with beautiful charts and your personalized growth score.",
    highlight: false,
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: "Gamification & XP",
    description: "Earn XP points, unlock achievements, maintain streaks, and level up. Growth becomes addictive when it feels like a game.",
    highlight: false,
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "AI Journaling",
    description: "Daily AI-guided journaling with intelligent reflection prompts. Your journal grows smarter the more you use it.",
    highlight: false,
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Accountability Community",
    description: "Join accountability circles, participate in peer challenges, and learn from ambitious growth-focused individuals.",
    highlight: false,
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Personalized Roadmaps",
    description: "AI generates your unique growth roadmap based on your goals, background, and challenges. Every plan is built for you.",
    highlight: false,
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0f0e0c]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <div className="section-pill mb-5">Everything you need</div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1a1a1a] dark:text-white mb-4">
            Your complete growth
            <br />
            <span className="gradient-text">operating system</span>
          </h2>
          <div className="section-divider mt-5 mb-6" />
          <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-2xl mx-auto">
            Every tool, resource, and insight you need to grow professionally and personally —
            unified in one intelligent platform.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className={`group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 cursor-default ${
                f.highlight
                  ? "bg-gradient-to-br from-[#C4622D] to-[#DD8348] border-transparent text-white shadow-xl shadow-blue-500/20"
                  : "bg-white dark:bg-[#1a1916] border-[#e8e8e4] dark:border-[#2a2824] hover:border-[#C4622D]/30 hover:shadow-lg hover:shadow-blue-500/5"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                f.highlight ? "bg-white/20 text-white" : "bg-[#eef3ff] dark:bg-[#0e1730] text-[#C4622D]"
              }`}>
                {f.icon}
              </div>
              <h3 className={`font-bold text-base mb-2 ${f.highlight ? "text-white" : "text-[#1a1a1a] dark:text-white"}`}>
                {f.title}
              </h3>
              <p className={`text-sm leading-relaxed ${f.highlight ? "text-blue-100" : "text-[#6b7280] dark:text-[#9ca3af]"}`}>
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
