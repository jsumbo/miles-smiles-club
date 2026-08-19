import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/adminSession";

export default async function AdminIndexPage() {
  const email = await getAdminSession();
  redirect(email ? "/admin/dashboard" : "/admin/login");
}
