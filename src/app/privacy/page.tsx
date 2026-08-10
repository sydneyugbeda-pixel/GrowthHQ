import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata = {
  title: "Privacy Policy – GrowthHQ",
  description: "How GrowthHQ collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-10">Last updated: August 10, 2026</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-700 dark:text-slate-300">

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">1. Who we are</h2>
              <p>GrowthHQ (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an AI-powered personal growth coaching platform accessible at <a href="https://growthhq.online" className="text-brand-600 hover:underline">growthhq.online</a>. We are committed to protecting your personal information and your right to privacy.</p>
              <p className="mt-2">Questions? Email us at <a href="mailto:hello@growthhq.online" className="text-brand-600 hover:underline">hello@growthhq.online</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">2. Information we collect</h2>
              <p>We collect information you provide directly:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Account data:</strong> name, email address, and password when you register.</li>
                <li><strong>Profile data:</strong> career stage, skill level, goals, and growth focus areas you share during onboarding.</li>
                <li><strong>Usage data:</strong> habits you track, journal entries you write, assessment responses, and AI coaching conversations.</li>
                <li><strong>Payment data:</strong> subscription plan. Payment card details are handled directly by Paystack and never stored on our servers.</li>
              </ul>
              <p className="mt-3">We also collect limited technical data automatically (IP address, browser type, pages visited) to operate and improve the service.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">3. How we use your information</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide, personalise, and improve the GrowthHQ platform.</li>
                <li>Generate AI coaching responses and growth roadmaps tailored to you.</li>
                <li>Process payments and manage your subscription.</li>
                <li>Send transactional emails (account confirmation, password reset, receipts).</li>
                <li>Send product updates and growth tips — you can unsubscribe at any time.</li>
                <li>Detect and prevent fraud or abuse.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">4. AI and your data</h2>
              <p>Your coaching conversations and journal entries are sent to our AI provider (OpenRouter) to generate responses. We do not use your personal data to train third-party AI models. Conversation history is stored securely in your account and is only accessible to you.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">5. Data sharing</h2>
              <p>We do not sell your personal data. We share it only with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Supabase</strong> — our database and authentication provider.</li>
                <li><strong>OpenRouter / AI providers</strong> — to generate coaching content.</li>
                <li><strong>Paystack</strong> — to process payments.</li>
                <li><strong>Vercel</strong> — to host and deliver the platform.</li>
              </ul>
              <p className="mt-3">All providers are contractually obligated to protect your data and may only use it to provide services to us.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">6. Data retention</h2>
              <p>We retain your data for as long as your account is active. You may request deletion of your account and all associated data at any time by emailing <a href="mailto:hello@growthhq.online" className="text-brand-600 hover:underline">hello@growthhq.online</a>. We will process the request within 30 days.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">7. Security</h2>
              <p>We use industry-standard security measures including encrypted connections (TLS), hashed passwords, and row-level security on our database. No method of transmission over the internet is 100% secure, but we work hard to protect your information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">8. Your rights</h2>
              <p>You have the right to access, correct, export, or delete your personal data. To exercise any of these rights, contact us at <a href="mailto:hello@growthhq.online" className="text-brand-600 hover:underline">hello@growthhq.online</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">9. Cookies</h2>
              <p>We use strictly necessary cookies to keep you signed in. We do not use third-party advertising or tracking cookies.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">10. Changes to this policy</h2>
              <p>We may update this policy from time to time. We will notify you of significant changes by email or via an in-app notice. Continued use of the platform after changes constitutes acceptance.</p>
            </section>

          </div>

          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link href="/terms" className="text-brand-600 hover:underline text-sm">View Terms of Service →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
