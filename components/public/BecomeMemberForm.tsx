"use client";

import { useState } from "react";
import { UserPlus, MailCheck } from "lucide-react";
import { requestSignInLink } from "@/lib/firebase/memberAuth";
import { becomeMemberAction } from "@/app/(auth)/account/join/actions";
import { GENDERS, HOW_HEARD_OPTIONS } from "@/lib/formOptions";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Gender } from "@/types/firestore";

export function BecomeMemberForm() {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [howHeard, setHowHeard] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();

    const howHeardLabel = HOW_HEARD_OPTIONS.find((o) => o.value === howHeard)?.label ?? "";
    const friendName = (fd.get("howHeardFriendName") as string) || "";
    const eventName = (fd.get("howHeardEventName") as string) || "";
    let howHeardValue = howHeardLabel;
    if (howHeard === "friend" && friendName) howHeardValue = `${howHeardLabel} (${friendName})`;
    if (howHeard === "event" && eventName) howHeardValue = `${howHeardLabel} (${eventName})`;

    try {
      const { alreadyMember } = await becomeMemberAction({
        name: fd.get("name") as string,
        email,
        whatsapp: fd.get("whatsapp") as string,
        phone: (fd.get("phone") as string) || "",
        address: fd.get("address") as string,
        gender: (fd.get("gender") as Gender) || "female",
        howHeard: howHeardValue,
      });
      await requestSignInLink(email);
      setAlreadyMember(alreadyMember);
      setSentTo(email);
    } catch (err) {
      console.error("becomeMember failed:", err);
      setError("Something went wrong. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sentTo) {
    return (
      <div className="rounded-lg border border-border bg-surface-card p-6 text-center shadow-card">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
          <MailCheck className="h-5 w-5" />
        </div>
        <p className="mt-3 font-heading text-lg tracking-wide">Check your email</p>
        <p className="mt-1 text-sm text-text-muted">
          {alreadyMember
            ? "Looks like you're already a member — we sent a sign-in link to "
            : "We sent a sign-in link to "}
          <span className="font-medium text-foreground">{sentTo}</span>. Check your inbox/spam too
          {alreadyMember ? " sign in." : " finish setting up your card."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="jm-name" className="mb-1 block text-xs font-medium text-text-muted">
          Full name *
        </label>
        <input id="jm-name" name="name" required className={inputCls} placeholder="Your name" />
      </div>

      <div>
        <label htmlFor="jm-email" className="mb-1 block text-xs font-medium text-text-muted">
          Email *
        </label>
        <input id="jm-email" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="jm-whatsapp" className="mb-1 block text-xs font-medium text-text-muted">
          WhatsApp number *
        </label>
        <input id="jm-whatsapp" name="whatsapp" required className={inputCls} placeholder="+231 77 000 0000" />
      </div>

      <div>
        <label htmlFor="jm-phone" className="mb-1 block text-xs font-medium text-text-muted">
          Contact number (if different)
        </label>
        <input id="jm-phone" name="phone" className={inputCls} placeholder="+231 88 000 0000" />
      </div>

      <div>
        <label htmlFor="jm-gender" className="mb-1 block text-xs font-medium text-text-muted">
          Gender
        </label>
        <select id="jm-gender" name="gender" className={inputCls}>
          {GENDERS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="jm-address" className="mb-1 block text-xs font-medium text-text-muted">
          Address / Area *
        </label>
        <input id="jm-address" name="address" required className={inputCls} placeholder="Sinkor, Monrovia" />
      </div>

      <div>
        <label htmlFor="jm-howHeard" className="mb-1 block text-xs font-medium text-text-muted">
          How did you hear about us? *
        </label>
        <Select value={howHeard} onValueChange={(value) => setHowHeard(value as string)} required>
          <SelectTrigger id="jm-howHeard" className={inputCls}>
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
          <label htmlFor="jm-howHeardFriendName" className="mb-1 block text-xs font-medium text-text-muted">
            Friend&apos;s name *
          </label>
          <input
            id="jm-howHeardFriendName"
            name="howHeardFriendName"
            required
            className={inputCls}
            placeholder="Who told you about us?"
          />
        </div>
      )}

      {howHeard === "event" && (
        <div>
          <label htmlFor="jm-howHeardEventName" className="mb-1 block text-xs font-medium text-text-muted">
            Which event? *
          </label>
          <input
            id="jm-howHeardEventName"
            name="howHeardEventName"
            required
            className={inputCls}
            placeholder="e.g. Open Community Run"
          />
        </div>
      )}

      {error && <p className="text-xs font-medium text-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-50"
      >
        <UserPlus className="h-4 w-4" />
        {loading ? "Submitting…" : "Become a member"}
      </button>
    </form>
  );
}
