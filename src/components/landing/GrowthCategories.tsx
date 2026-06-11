"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GROWTH_CATEGORIES } from "@/lib/utils";

export function GrowthCategories() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f7f6f3] dark:bg-[#120f0c]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#1a1a1a] dark:text-white mb-4">
            Master every dimension of
            <br />
            <span className="gradient-text">high performance</span>
          </h2>
          <div className="section-divider mt-5 mb-6" />
          <p className="text-lg text-[#6b7280] dark:text-[#9ca3af] max-w-xl mx-auto">
            Structured growth paths across every area that drives professional and personal success.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {GROWTH_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={`/auth/signup?category=${cat.id}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-white dark:bg-[#1a1916] border border-[#e8e8e4] dark:border-[#2a2824] hover:border-[#C4622D]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/8 text-center"
              >
                <span className="text-4xl mb-3">{cat.emoji}</span>
                <span className="font-bold text-sm text-[#1a1a1a] dark:text-white mb-1">{cat.label}</span>
                <span className="text-xs text-[#9ca3af] group-hover:text-[#C4622D] transition-colors flex items-center gap-0.5 font-medium">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </motion.div>
          ))}

          {/* All categories CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: GROWTH_CATEGORIES.length * 0.07 }}
          >
            <Link
              href="/auth/signup"
              className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-[#C4622D] to-[#E8943A] text-white text-center hover:-translate-y-1 transition-transform shadow-lg shadow-orange-500/20"
            >
              <span className="text-4xl mb-3">🎯</span>
              <span className="font-bold text-sm mb-1">All Categories</span>
              <span className="text-xs text-orange-200 flex items-center gap-0.5 font-medium">
                Get started <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
