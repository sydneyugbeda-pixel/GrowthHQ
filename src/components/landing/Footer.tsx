"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, Link2, GitBranch, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "AI Coach", "Assessments", "Learning Hub"],
  Company: ["About", "Blog", "Careers", "Press"],
  Resources: ["Documentation", "Help Center", "Community", "API"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
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
              <a href="mailto:hello@growthhq.io" className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#E07840] transition-colors">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                hello@growthhq.io
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-2 text-sm text-[#9ca3af] hover:text-[#E07840] transition-colors">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                (555) 123-4567
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
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-[#9ca3af] hover:text-white hover:bg-[#C4622D] transition-all"
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
                  <li key={link}>
                    <Link href="#" className="text-sm text-[#9ca3af] hover:text-[#E07840] transition-colors">
                      {link}
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
              className="flex-1 sm:w-56 h-10 px-3 rounded-lg bg-white/10 border border-white/15 text-sm text-white placeholder:text-[#6b7280] focus:outline-none focus:border-[#C4622D] transition-colors"
            />
            <button
              type="submit"
              className="h-10 px-5 rounded-lg bg-[#C4622D] hover:bg-[#A5511F] text-white text-sm font-bold transition-colors"
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
