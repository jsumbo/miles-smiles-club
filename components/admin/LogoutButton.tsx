"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/localAuth";
import { logoutAction } from "@/app/(admin)/admin/login/actions";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        logout();
        await logoutAction();
        router.replace("/admin/login");
      }}
    >
      <LogOut className="h-4 w-4" />
      Log out
    </Button>
  );
}
