"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Award, Crown, Medal, type LucideIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CardTheme, Member, MemberTier } from "@/types/firestore";

export const CARD_THEMES: { value: CardTheme; label: string; color: string }[] = [
  { value: "classic", label: "Classic", color: "bg-[#e85d2a]" },
  { value: "sunrise", label: "Sunrise", color: "bg-amber-500" },
  { value: "forest", label: "Forest", color: "bg-emerald-700" },
  { value: "midnight", label: "Midnight", color: "bg-indigo-950" },
  { value: "mono", label: "Mono", color: "bg-neutral-800" },
];

// Fine diagonal hairline texture for a bit of premium card feel. Shared (same data URI) with
// the downloadable card in app/api/account/card-image/route.tsx so the two stay in sync.
export const CARD_PATTERN_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PHBhdGggZD0iTTAgMjggTDI4IDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA5IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=";

export const TIER_META: Record<MemberTier, { label: string; icon: LucideIcon; className: string }> = {
  bronze: { label: "Bronze", icon: Medal, className: "text-orange-200" },
  silver: { label: "Silver", icon: Award, className: "text-slate-100" },
  gold: { label: "Gold", icon: Crown, className: "text-yellow-300" },
};

export function MembershipCard({ member }: { member: Member }) {
  const theme = CARD_THEMES.find((t) => t.value === member.cardTheme) ?? CARD_THEMES[0];
  const tier = TIER_META[member.tier] ?? TIER_META.bronze;
  const TierIcon = tier.icon;
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const verifyUrl = `${window.location.origin}/verify/${member.memberNumber}`;
    QRCode.toDataURL(verifyUrl, { margin: 1, width: 160 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [member.memberNumber]);

  return (
    <div
      className={`relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl p-5 text-white shadow-card sm:p-6 ${theme.color}`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: `url(${CARD_PATTERN_URL})`, backgroundRepeat: "repeat" }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-heading text-lg tracking-wide sm:text-xl">
            Miles<span className="opacity-80">&amp;</span>Smiles
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">Membership Card</p>
          <div
            className={`mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm ${tier.className}`}
          >
            <TierIcon className="h-3 w-3" />
            {tier.label}
          </div>
        </div>
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 border-white/40 bg-white/10 sm:h-20 sm:w-20">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold">
              {member.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold sm:text-xl">{member.name}</p>
          <div className="mt-1.5 flex items-end gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/70">Member No.</p>
              <p className="font-mono text-sm tracking-wide">{member.memberNumber}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/70">Member Since</p>
              <p className="text-sm">{formatDate(member.joinedAt)}</p>
            </div>
          </div>
        </div>

        {qrDataUrl && (
          <img
            src={qrDataUrl}
            alt="Scan to verify membership"
            className="h-14 w-14 shrink-0 rounded-md bg-white p-1 sm:h-16 sm:w-16"
          />
        )}
      </div>
    </div>
  );
}
