import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center mb-6 shadow-xl shadow-brand-500/20">
        <Zap className="w-7 h-7 text-white fill-white" />
      </div>
      <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-2">404</h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 text-center max-w-sm">
        This page doesn&apos;t exist. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
