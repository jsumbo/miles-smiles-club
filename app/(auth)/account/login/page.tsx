import Link from "next/link";
import { AuthSplitScreen } from "@/components/public/AuthSplitScreen";
import { AccountLoginForm } from "@/components/public/AccountLoginForm";

export default function AccountLoginPage() {
  return (
    <AuthSplitScreen>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">Member Login</p>
      <h2 className="mt-3 font-heading text-3xl tracking-wide">Welcome back</h2>
      <p className="mt-2 text-sm text-text-muted">Enter your email address to receive a login link</p>

      <div className="mt-8">
        <AccountLoginForm />
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Not a member yet?{" "}
        <Link href="/account/join" className="font-semibold text-brand-primary hover:underline">
          Become a member
        </Link>
      </p>
    </AuthSplitScreen>
  );
}
