"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSession, setSession } from "@/lib/localAuth";
import { verifyAdminCredentials } from "./actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/admin/dashboard");
  }, [router]);

  const inputCls =
    "w-full rounded-md border border-border bg-surface-light px-3 py-2 text-sm text-foreground placeholder:text-text-muted/60 outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    try {
      const ok = await verifyAdminCredentials(email, password);
      if (!ok) {
        toast.error("Incorrect email or password");
        setLoading(false);
        return;
      }
      setSession(email);
      router.replace("/admin/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-light px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface-card p-6 shadow-card sm:p-8">
        <p className="font-heading text-lg tracking-wide">
          Miles<span className="text-brand-primary">&</span>Smiles
        </p>
        <h1 className="mt-1 text-sm text-text-muted">Admin sign in</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className={inputCls}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
