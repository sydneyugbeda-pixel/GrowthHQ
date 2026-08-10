"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
        <AlertCircle className="w-7 h-7 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Something went wrong</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-sm">
        An unexpected error occurred. Please try again, or contact support if the problem persists.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition-colors"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-sm transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
