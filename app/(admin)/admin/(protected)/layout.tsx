import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminSession();
  if (!email) redirect("/admin/login");

  return <AdminShell email={email}>{children}</AdminShell>;
}
