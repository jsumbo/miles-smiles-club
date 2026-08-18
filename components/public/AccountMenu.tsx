"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LayoutDashboard, IdCard, Package, LogOut } from "lucide-react";
import { useMemberAuth } from "@/components/member/member-auth-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function AccountMenu() {
  const router = useRouter();
  const { firebaseUser, member, loading, signOut } = useMemberAuth();

  if (loading) return <div className="h-10 w-10" aria-hidden />;

  if (!firebaseUser || !member) {
    return (
      <Link
        href="/account/login"
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
        aria-label="Log in"
      >
        <LogIn className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary text-sm font-semibold"
        aria-label="My account"
      >
        {member.photoUrl ? (
          <img src={member.photoUrl} alt={member.name} className="h-full w-full object-cover" />
        ) : (
          member.name.charAt(0).toUpperCase()
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem render={<Link href="/account" />}>
          <LayoutDashboard className="h-4 w-4" /> Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/card" />}>
          <IdCard className="h-4 w-4" /> Membership card
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/account/orders" />}>
          <Package className="h-4 w-4" /> Orders
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.replace("/");
          }}
        >
          <LogOut className="h-4 w-4" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
