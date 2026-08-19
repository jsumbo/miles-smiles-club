import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";
import { AdminLoginForm } from "./AdminLoginForm";

export default async function AdminLoginPage() {
  const email = await getAdminSession();
  if (email) redirect("/admin/dashboard");

  return <AdminLoginForm />;
}
