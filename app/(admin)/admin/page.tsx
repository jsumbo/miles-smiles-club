"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/localAuth";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getSession() ? "/admin/dashboard" : "/admin/login");
  }, [router]);

  return null;
}
