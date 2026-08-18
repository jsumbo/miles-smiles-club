"use client";

import { useState } from "react";
import { Mail, MailCheck } from "lucide-react";
import { requestSignInLink } from "@/lib/firebase/memberAuth";
import { memberExistsAction } from "@/app/(auth)/account/login/actions";

export function AccountLoginForm() {
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const email = (new FormData(e.currentTarget).get("email") as string).trim();

    try {
      const exists = await memberExistsAction(email);
      if (!exists) {
        setError("We couldn't find an account for that email. Become a member first.");
        return;
      }
      await requestSignInLink(email);
      setSentTo(email);
    } catch (err) {
      console.error("requestSignInLink failed:", err);
      setError("Couldn't send the sign-in link. Check the email and try again.");
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
          We sent a sign-in link to <span className="font-medium text-foreground">{sentTo}</span>. Check your
          inbox/spam too.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="account-email" className="mb-1 block text-xs font-medium text-text-muted">
          Email
        </label>
        <input
          id="account-email"
          name="email"
          type="email"
          required
          className={inputCls}
          placeholder="you@example.com"
        />
      </div>

      {error && <p className="text-xs font-medium text-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover disabled:opacity-50"
      >
        <Mail className="h-4 w-4" />
        {loading ? "Sending…" : "Continue"}
      </button>
    </form>
  );
}
