"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { completeSignInFromLink } from "@/lib/firebase/memberAuth";
import { AuthSplitScreen } from "@/components/public/AuthSplitScreen";

type Status = "verifying" | "needs-email" | "error";

export default function AccountVerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");

  async function attempt(email?: string) {
    setStatus("verifying");
    try {
      await completeSignInFromLink(email);
      router.replace("/account");
    } catch (err) {
      if (err instanceof Error && err.message === "EMAIL_REQUIRED") {
        setStatus("needs-email");
      } else {
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  return (
    <AuthSplitScreen>
      <div className="text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-primary" />
            <p className="mt-3 text-sm text-text-muted">Signing you in…</p>
          </>
        )}

        {status === "needs-email" && (
          <div className="text-left">
            <p className="text-center font-heading text-xl tracking-wide">Confirm your email</p>
            <p className="mt-1 text-center text-sm text-text-muted">
              You opened this link on a different device — enter your email to finish signing in.
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const email = (new FormData(e.currentTarget).get("email") as string).trim();
                attempt(email);
              }}
            >
              <input name="email" type="email" required placeholder="you@example.com" className={inputCls} />
              <button
                type="submit"
                className="w-full rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover"
              >
                Continue
              </button>
            </form>
          </div>
        )}

        {status === "error" && (
          <>
            <p className="font-heading text-xl tracking-wide">Link expired</p>
            <p className="mt-1 text-sm text-text-muted">This sign-in link is invalid or has already been used.</p>
            <Link
              href="/account/login"
              className="mt-6 inline-block rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover"
            >
              Request a new link
            </Link>
          </>
        )}
      </div>
    </AuthSplitScreen>
  );
}
