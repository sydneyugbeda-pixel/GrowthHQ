"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
    if (!key) return;
    posthog.init(key, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: false, // handled by PostHogPageview
      capture_pageleave: true,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Call this after auth to identify the user in PostHog
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.identify(userId, traits);
}

// Call this on sign out
export function resetUser() {
  if (typeof window === "undefined") return;
  posthog.reset();
}

// Typed event names for consistency
export type AnalyticsEvent =
  | "signed_up"
  | "logged_in"
  | "onboarding_completed"
  | "payment_initiated"
  | "payment_succeeded"
  | "coaching_session_started"
  | "assessment_completed"
  | "habit_created"
  | "journal_entry_created"
  | "upgrade_clicked";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  posthog.capture(event, properties);
}

export { usePostHog };
