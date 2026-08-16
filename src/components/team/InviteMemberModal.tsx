"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const FOCUS_OPTIONS = [
  "Communication", "Leadership", "Sales", "Confidence & Mindset",
  "Productivity", "Emotional Intelligence", "Business Effectiveness",
];

interface Props {
  open: boolean;
  onClose: () => void;
  orgId: string;
}

export function InviteMemberModal({ open, onClose, orgId }: Props) {
  const [email, setEmail] = useState("");
  const [tier, setTier] = useState<"pro" | "elite">("pro");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [skillFocus, setSkillFocus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFocus = (area: string) => {
    setSkillFocus((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/enterprise-seat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberEmail: email, tier, billing, skillFocus, orgId }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to initiate payment"); return; }
      window.location.href = data.authorization_url;
    } finally {
      setLoading(false);
    }
  };

  const PRICES = {
    pro:   { monthly: "₦12,500/mo",  annual: "₦100,000/yr" },
    elite: { monthly: "₦35,000/mo",  annual: "₦300,000/yr" },
  };

  return (
    <Modal open={open} onClose={onClose} title="Invite Team Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Member's email address"
          type="email"
          placeholder="colleague@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          required
        />

        {/* Tier selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subscription seat</label>
          <div className="grid grid-cols-2 gap-3">
            {(["pro", "elite"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  tier === t
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-brand-300"
                }`}
              >
                <p className="font-semibold text-sm capitalize text-slate-900 dark:text-white">{t}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{PRICES[t][billing]}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Billing cycle */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Billing cycle</label>
          <div className="flex gap-2">
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBilling(b)}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize ${
                  billing === b
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-300"
                }`}
              >
                {b} {b === "annual" && <span className="text-emerald-600 text-xs ml-1">Save 33%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Skill focus */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Skill development focus <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((area) => (
              <button
                key={area}
                type="button"
                onClick={() => toggleFocus(area)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  skillFocus.includes(area)
                    ? "bg-brand-600 text-white border-brand-600"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-400"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-sm text-slate-600 dark:text-slate-400">
          You&apos;ll be charged <strong className="text-slate-900 dark:text-white">{PRICES[tier][billing]}</strong> for this seat.
          The member will receive an invite email after payment is confirmed.
        </div>

        <div className="flex gap-3 pt-1">
          <Button variant="outline" size="lg" className="flex-1 justify-center" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="gradient" size="lg" className="flex-1 justify-center" type="submit" loading={loading}>
            Pay & Send Invite
          </Button>
        </div>
      </form>
    </Modal>
  );
}
