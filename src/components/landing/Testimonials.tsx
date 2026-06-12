"use client";

import { Star } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

const testimonials = [
  {
    name: "Marcus Thompson",
    role: "VP of Sales, TechCorp",
    quote: "Growth HQ completely transformed how I approach leadership. My team's engagement scores went up 40% in 3 months. The AI coach is like having a McKinsey advisor in your pocket.",
    rating: 5,
    highlight: "40% team engagement increase",
  },
  {
    name: "Sarah Chen",
    role: "Founder & CEO",
    quote: "I went from struggling to communicate my vision to closing $2M in funding. The communication assessments pinpointed exactly what I needed to work on.",
    rating: 5,
    highlight: "$2M funding closed",
  },
  {
    name: "David Okafor",
    role: "Senior Sales Executive",
    quote: "My close rate jumped 65% after just 8 weeks using the sales coaching features. The AI roleplay simulations are incredibly realistic and effective.",
    rating: 5,
    highlight: "65% higher close rate",
  },
  {
    name: "Priya Sharma",
    role: "Director of Marketing",
    quote: "The daily growth prompts and journaling features keep me consistently focused. My confidence in executive presentations has completely transformed.",
    rating: 5,
    highlight: "Executive presence unlocked",
  },
  {
    name: "James Rivera",
    role: "Business Development Lead",
    quote: "Worth every penny. The personalized roadmap addresses my specific weaknesses. I've grown more in 90 days than in the previous 3 years.",
    rating: 5,
    highlight: "3× growth acceleration",
  },
  {
    name: "Emily Walsh",
    role: "Team Lead, Product",
    quote: "The gamification makes growth habit-forming. I haven't missed a day in 47 days. My team noticed the difference before I even told them about the platform.",
    rating: 5,
    highlight: "47-day streak and counting",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0f0e0c]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <div className="flex justify-center gap-0.5 mb-5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1a1a1a] dark:text-white mb-4">
            What our customers say
          </h2>
          <div className="section-divider mt-5 mb-6" />
          <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-xl mx-auto">
            Join thousands of high performers who have transformed their careers with Growth HQ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group bg-white dark:bg-[#1a1916] rounded-2xl p-6 border border-[#e8e8e4] dark:border-[#2a2824] hover:border-[#3B6FF6]/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Highlight badge */}
              <div className="inline-flex self-start items-center px-2.5 py-1 rounded-full bg-[#eef3ff] dark:bg-[#0e1730] text-[#3B6FF6] dark:text-[#6E97FF] text-xs font-bold mb-4 border border-[#3B6FF6]/15">
                {t.highlight}
              </div>

              {/* Quote */}
              <blockquote className="text-[#4D4D4D] dark:text-[#d1cfc9] text-sm leading-relaxed mb-5 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#f5f4f0] dark:border-[#2a2824]">
                <Avatar name={t.name} size="sm" />
                <div>
                  <p className="font-bold text-sm text-[#1a1a1a] dark:text-white">{t.name}</p>
                  <p className="text-xs text-[#9ca3af]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
