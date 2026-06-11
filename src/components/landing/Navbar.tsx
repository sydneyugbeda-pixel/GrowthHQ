"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Features",     href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-[#0f0e0c]/95 backdrop-blur-xl border-b border-[#e8e8e4] dark:border-[#2a2824] shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Growth HQ"
              width={200}
              height={52}
              priority
              className="h-10 w-auto dark:brightness-90"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#4D4D4D] dark:text-[#d1cfc9] hover:text-[#C4622D] dark:hover:text-[#E07840] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="font-semibold text-[#2D2D2D] dark:text-[#f5f4f0]">
                Log in
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="gradient" size="sm" className="px-5 shadow-md shadow-orange-500/20">
                Get Started →
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#4D4D4D] dark:text-[#d1cfc9] hover:bg-[#f5f4f0] dark:hover:bg-[#2a2824]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#0f0e0c] border-t border-[#e8e8e4] dark:border-[#2a2824]"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#4D4D4D] dark:text-[#d1cfc9] hover:text-[#C4622D] hover:bg-[#fdf0e8] dark:hover:bg-[#2a1e12] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 flex flex-col gap-2 border-t border-[#e8e8e4] dark:border-[#2a2824] mt-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="md" className="w-full">Log in</Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                  <Button variant="gradient" size="md" className="w-full">Get Started →</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
