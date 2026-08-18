"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CARD_THEMES } from "@/components/member/MembershipCard";
import type { CardTheme } from "@/types/firestore";

interface CardThemePickerProps {
  value: CardTheme;
  onChange: (theme: CardTheme) => void;
}

export function CardThemePicker({ value, onChange }: CardThemePickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {CARD_THEMES.map((theme) => (
        <button
          key={theme.value}
          type="button"
          onClick={() => onChange(theme.value)}
          aria-label={theme.label}
          title={theme.label}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-offset-2 ring-offset-surface-light transition-shadow",
            theme.color,
            value === theme.value && "ring-2 ring-brand-primary"
          )}
        >
          {value === theme.value && <Check className="h-4 w-4 text-white drop-shadow" />}
        </button>
      ))}
    </div>
  );
}
