"use client";

import { useState } from "react";
import { createJoinRequestAction } from "@/app/(public)/actions";
import type { Gender } from "@/types/firestore";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { GENDERS, HOW_HEARD_OPTIONS } from "@/lib/formOptions";

export function JoinRunForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [howHeard, setHowHeard] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const howHeardLabel = HOW_HEARD_OPTIONS.find((o) => o.value === howHeard)?.label ?? "";
    const friendName = (fd.get("howHeardFriendName") as string) || "";
    const eventName = (fd.get("howHeardEventName") as string) || "";

    let howHeardValue = howHeardLabel;
    if (howHeard === "friend" && friendName) howHeardValue = `${howHeardLabel} (${friendName})`;
    if (howHeard === "event" && eventName) howHeardValue = `${howHeardLabel} (${eventName})`;

    await createJoinRequestAction({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      whatsapp: fd.get("whatsapp") as string,
      phone: (fd.get("phone") as string) || "",
      gender: (fd.get("gender") as Gender) || "female",
      address: fd.get("address") as string,
      howHeard: howHeardValue,
    });

    setLoading(false);
    onSuccess();
  }

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="jr-name" className="mb-1 block text-xs font-medium text-text-muted">
          Full name *
        </label>
        <input id="jr-name" name="name" required className={inputCls} placeholder="Your name" />
      </div>

      <div>
        <label htmlFor="jr-email" className="mb-1 block text-xs font-medium text-text-muted">
          Email *
        </label>
        <input id="jr-email" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="jr-whatsapp" className="mb-1 block text-xs font-medium text-text-muted">
          WhatsApp number *
        </label>
        <input id="jr-whatsapp" name="whatsapp" required className={inputCls} placeholder="+231 77 000 0000" />
      </div>

      <div>
        <label htmlFor="jr-phone" className="mb-1 block text-xs font-medium text-text-muted">
          Contact number (if different)
        </label>
        <input id="jr-phone" name="phone" className={inputCls} placeholder="+231 88 000 0000" />
      </div>

      <div>
        <label htmlFor="jr-gender" className="mb-1 block text-xs font-medium text-text-muted">
          Gender
        </label>
        <select id="jr-gender" name="gender" className={inputCls}>
          {GENDERS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="jr-address" className="mb-1 block text-xs font-medium text-text-muted">
          Address / Area *
        </label>
        <input id="jr-address" name="address" required className={inputCls} placeholder="Sinkor, Monrovia" />
      </div>

      <div>
        <label htmlFor="jr-howHeard" className="mb-1 block text-xs font-medium text-text-muted">
          How did you hear about us? *
        </label>
        <Select value={howHeard} onValueChange={(value) => setHowHeard(value as string)} required>
          <SelectTrigger id="jr-howHeard" className={inputCls}>
            <SelectValue placeholder="Select an option">
              {(value) => HOW_HEARD_OPTIONS.find((o) => o.value === value)?.label ?? "Select an option"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {HOW_HEARD_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {howHeard === "friend" && (
        <div>
          <label htmlFor="jr-howHeardFriendName" className="mb-1 block text-xs font-medium text-text-muted">
            Friend&apos;s name *
          </label>
          <input
            id="jr-howHeardFriendName"
            name="howHeardFriendName"
            required
            className={inputCls}
            placeholder="Who told you about us?"
          />
        </div>
      )}

      {howHeard === "event" && (
        <div>
          <label htmlFor="jr-howHeardEventName" className="mb-1 block text-xs font-medium text-text-muted">
            Which event? *
          </label>
          <input
            id="jr-howHeardEventName"
            name="howHeardEventName"
            required
            className={inputCls}
            placeholder="e.g. Open Community Run"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
