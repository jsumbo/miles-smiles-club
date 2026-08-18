"use server";

import { createAdminSessionCookie, clearAdminSessionCookie } from "@/lib/adminSession";

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }

  const ok = email.trim().toLowerCase() === adminEmail.trim().toLowerCase() && password === adminPassword;
  if (ok) await createAdminSessionCookie(adminEmail.trim().toLowerCase());
  return ok;
}

export async function logoutAction() {
  await clearAdminSessionCookie();
}
