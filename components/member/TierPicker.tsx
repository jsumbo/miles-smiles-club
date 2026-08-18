"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { TIER_META } from "@/components/member/MembershipCard";
import { selectMemberTierAction } from "@/app/(dashboard)/account/actions";
import { cn } from "@/lib/utils";
import type { MemberTier } from "@/types/firestore";

const TIER_OPTIONS: {
  value: MemberTier;
  blurb: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  border: string;
  selectedBorder: string;
}[] = [
  {
    value: "bronze",
    blurb: "Get started as a member.",
    gradient: "from-orange-50 to-surface-card",
    iconBg: "bg-orange-500/15",
    iconColor: "text-orange-600",
    border: "border-orange-200 hover:border-orange-300",
    selectedBorder: "border-orange-500",
  },
  {
    value: "silver",
    blurb: "For regulars showing up often.",
    gradient: "from-slate-100 to-surface-card",
    iconBg: "bg-slate-500/15",
    iconColor: "text-slate-600",
    border: "border-slate-200 hover:border-slate-300",
    selectedBorder: "border-slate-500",
  },
  {
    value: "gold",
    blurb: "For the club's most active runners.",
    gradient: "from-amber-100 via-yellow-50 to-surface-card",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-600",
    border: "border-amber-200 hover:border-amber-300",
    selectedBorder: "border-amber-500",
  },
];

export function TierPicker() {
  const { firebaseUser, refresh } = useMemberAuth();
  const [selected, setSelected] = useState<MemberTier | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleContinue() {
    if (!selected || !firebaseUser) return;
    setSaving(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const updated = await selectMemberTierAction(idToken, selected);
      if (updated) await refresh(updated);
      toast.success("You're all set");
    } catch {
      toast.error("Couldn't save your tier. Try again.");
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light px-4 py-12">
      <div className="w-full max-w-3xl rounded-xl border border-border bg-surface-card p-6 shadow-card sm:p-8">
        <p className="font-heading text-lg tracking-wide">
          Miles<span className="text-brand-primary">&amp;</span>Smiles
        </p>
        <h1 className="mt-3 font-heading text-2xl tracking-wide sm:text-3xl">Choose your membership tier</h1>
        <p className="mt-1 text-sm text-text-muted">
          Pick one to unlock your dashboard and membership card. You can only change this later by asking an admin.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {TIER_OPTIONS.map((option) => {
            const meta = TIER_META[option.value];
            const Icon = meta.icon;
            const isGold = option.value === "gold";
            const active = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelected(option.value)}
                className={cn(
                  "relative flex flex-col items-start gap-3 rounded-xl border-2 bg-gradient-to-b p-5 text-left transition-all",
                  option.gradient,
                  active ? cn(option.selectedBorder, "shadow-card-hover") : option.border
                )}
              >
                {active && (
                  <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-white">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg",
                    option.iconBg,
                    isGold ? "h-12 w-12" : "h-10 w-10"
                  )}
                >
                  <Icon className={cn(option.iconColor, isGold ? "h-6 w-6" : "h-5 w-5")} />
                </div>

                <div>
                  <p
                    className={cn(
                      "font-heading tracking-wide",
                      isGold ? "text-2xl" : "text-xl"
                    )}
                  >
                    {meta.label}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{option.blurb}</p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!selected || saving}
          onClick={handleContinue}
          className="mt-8 w-full rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-50 sm:w-auto sm:px-8"
        >
          {saving ? "Saving…" : "Continue"}
        </button>
      </div>
    </div>
  );
}
