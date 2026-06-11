"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="pt-16">
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
