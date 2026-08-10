"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, Link2, GitBranch, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "AI Coach", href: "/coach" },
    { label: "Assessments", href: "/assessments" },
    { label: "Learning Hub", href: "/learning" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Resources: [
    { label: "Help Center", href: "#" },
    { label: "Community", href: "/community" },
    { label: "API", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[#e8e8e4] dark:border-[#2a2824] bg-[#2D2D2D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8">

          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-5">
              <Image src="/logo.svg" alt="Growth HQ" width={160} height={44} className="h-10 w-auto brightness-0 invert" />
            </div>
            <p className="text-sm text-[#9ca3af] leading-relaxed mb-6 max-w-xs">
              The AI-powered growth platform for leaders, entrepreneurs, and high performers who mean business.
            </p>

            {/* Contact info like the reference */}
            <div className="space-y-2 mb-5">
              <a href="mailto:hello@growthhq.online" className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#3B82F6] transition-colors">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                hello@growthhq.online
              </a>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: <Share2 className="w-4 h-4" />, href: "#", label: "Twitter" },
                { icon: <Link2 className="w-4 h-4" />,  href: "#", label: "LinkedIn" },
                { icon: <GitBranch className="w-4 h-4" />, href: "#", label: "GitHub" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#2563EB] transition-all"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#9ca3af] hover:text-[#3B82F6] transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter row — inspired by reference */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-bold text-white mb-1">Subscribe to our newsletter</p>
            <p className="text-sm text-[#9ca3af]">Growth tips, AI insights, and updates delivered weekly.</p>
          </div>
          <form className="flex gap-2 w-full sm:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-56 h-10 px-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#2563EB] transition-colors"
            />
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold transition-colors"
            >
              Subscribe →
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-[#6b7280]">© 2026 Growth Head Quarter. All rights reserved.</p>
          <p className="text-sm text-[#6b7280]">Built for high performers worldwide 🌍</p>
        </div>
      </div>
    </footer>
  );
}
