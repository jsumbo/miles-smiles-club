import Link from "next/link";
import { CheckCircle2, XCircle, UserX } from "lucide-react";
import { getMemberByNumber } from "@/lib/firestore/members";
import { MembershipCard } from "@/components/member/MembershipCard";

// Public — always check live status, never cache a stale "active" result.
export const dynamic = "force-dynamic";

export default async function VerifyMemberPage({
  params,
}: {
  params: Promise<{ memberNumber: string }>;
}) {
  const { memberNumber } = await params;
  const member = await getMemberByNumber(memberNumber);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-surface-light px-4 py-16 sm:px-6">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-lg object-cover" />
        <span className="font-heading text-lg tracking-wide">
          Miles<span className="text-brand-primary">&amp;</span>Smiles
        </span>
      </Link>

      {member ? (
        <div className="w-full max-w-sm">
          <MembershipCard member={member} />
          <div
            className={`mt-4 flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold ${
              member.status === "active"
                ? "border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary"
                : "border-error/30 bg-error/10 text-error"
            }`}
          >
            {member.status === "active" ? (
              <>
                <CheckCircle2 className="h-4 w-4" /> Active member
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" /> Membership inactive
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-sm flex-col items-center rounded-lg border border-dashed border-border p-8 text-center">
          <UserX className="h-6 w-6 text-text-muted" />
          <p className="mt-2 text-sm text-text-muted">No member found with number {memberNumber}.</p>
        </div>
      )}
    </div>
  );
}
