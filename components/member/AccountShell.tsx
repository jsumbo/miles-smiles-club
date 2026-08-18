"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { AccountSidebar } from "@/components/member/AccountSidebar";
import { AccountShellSkeleton } from "@/components/member/skeletons";
import { TierPicker } from "@/components/member/TierPicker";
import { Button } from "@/components/ui/button";

export function AccountShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { member, loading, signOut } = useMemberAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!loading && !member) router.replace("/account/login");
  }, [loading, member, router]);

  if (loading || !member) {
    return <AccountShellSkeleton />;
  }

  if (!member.hasSelectedTier) {
    return <TierPicker />;
  }

  return (
    <div className="flex min-h-screen bg-surface-light">
      <div className="hidden w-56 shrink-0 md:block">
        <AccountSidebar />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative h-full w-64 max-w-[80vw] shadow-lg">
            <AccountSidebar onNavigate={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface-card px-4 sm:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-secondary md:hidden"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-xs text-text-muted sm:text-sm">
            Signed in as {member.email}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              await signOut();
              router.replace("/");
            }}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </header>
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
