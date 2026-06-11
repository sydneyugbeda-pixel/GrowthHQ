import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { AICoachShowcase } from "@/components/landing/AICoachShowcase";
import { GrowthCategories } from "@/components/landing/GrowthCategories";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AICoachShowcase />
        <GrowthCategories />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
