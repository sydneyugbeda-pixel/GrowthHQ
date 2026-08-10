import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Terms of Service – GrowthHQ",
  description: "The terms and conditions governing your use of GrowthHQ.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: August 10, 2026</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300">

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Acceptance of terms</h2>
              <p>By creating an account or using GrowthHQ (&ldquo;the Service&rdquo;), you agree to these Terms of Service. If you do not agree, do not use the Service. These terms form a binding agreement between you and GrowthHQ (&ldquo;we&rdquo;, &ldquo;us&rdquo;).</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. Description of service</h2>
              <p>GrowthHQ is an AI-powered personal growth coaching platform that provides assessments, AI coaching conversations, habit tracking, learning content, and community features. The Service is provided on a subscription basis.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. Eligibility</h2>
              <p>You must be at least 18 years old and capable of forming a legally binding contract to use the Service. By using GrowthHQ, you represent that you meet these requirements.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. Accounts</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately at <a href="mailto:hello@growthhq.online" className="text-brand-600 hover:underline">hello@growthhq.online</a> if you suspect unauthorised access. You may not share accounts or create accounts on behalf of others without their consent.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">5. Subscriptions and billing</h2>
              <p>GrowthHQ offers free and paid subscription tiers. Paid subscriptions are billed in advance on a monthly or annual basis in Nigerian Naira (NGN) via Paystack.</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Subscriptions automatically renew unless cancelled before the renewal date.</li>
                <li>You may cancel at any time from your account settings. Access continues until the end of the billing period.</li>
                <li>All payments are non-refundable except where required by applicable law.</li>
                <li>We reserve the right to change pricing with 30 days&apos; notice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">6. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the Service for any unlawful purpose or in violation of these terms.</li>
                <li>Attempt to gain unauthorised access to any part of the Service or its infrastructure.</li>
                <li>Scrape, crawl, or extract data from the Service in bulk.</li>
                <li>Post content that is harmful, abusive, harassing, defamatory, or violates third-party rights.</li>
                <li>Impersonate any person or entity.</li>
                <li>Use the AI coach for medical, legal, or financial advice as a substitute for qualified professional advice.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">7. AI coaching disclaimer</h2>
              <p>The AI coaching feature provides general personal development guidance and is not a substitute for professional mental health, medical, legal, or financial advice. GrowthHQ is not a licensed therapist, counsellor, or professional advisor. If you are experiencing a mental health crisis, please contact a qualified professional or emergency services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">8. Intellectual property</h2>
              <p>All platform content, branding, and technology are owned by GrowthHQ and protected by applicable intellectual property laws. You retain ownership of content you create (journal entries, posts). By posting content to community features, you grant GrowthHQ a non-exclusive licence to display that content within the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">9. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, GrowthHQ and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability for any claim shall not exceed the amount you paid us in the three months preceding the claim.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">10. Termination</h2>
              <p>We may suspend or terminate your access to the Service at any time for violation of these terms or for any other reason with reasonable notice. You may terminate your account at any time by contacting us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">11. Changes to these terms</h2>
              <p>We may update these terms from time to time. We will notify you of material changes via email or in-app notice at least 14 days before they take effect. Continued use of the Service after changes constitutes acceptance.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">12. Governing law</h2>
              <p>These terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in the competent courts of Nigeria.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">13. Contact</h2>
              <p>For any questions about these terms, contact us at <a href="mailto:hello@growthhq.online" className="text-brand-600 hover:underline">hello@growthhq.online</a>.</p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link href="/privacy" className="text-brand-600 hover:underline text-sm">View Privacy Policy →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
