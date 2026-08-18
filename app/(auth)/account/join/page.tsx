import Link from "next/link";
import { AuthSplitScreen } from "@/components/public/AuthSplitScreen";
import { BecomeMemberForm } from "@/components/public/BecomeMemberForm";

export default function BecomeMemberPage() {
  return (
    <AuthSplitScreen>
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">Become a Member</p>
      <h2 className="mt-3 font-heading text-3xl tracking-wide">Create your account</h2>

      <div className="mt-8">
        <BecomeMemberForm />
      </div>

      <p className="mt-6 text-center text-sm text-text-muted">
        Already a member?{" "}
        <Link href="/account/login" className="font-semibold text-brand-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthSplitScreen>
  );
}
