"use server";

import { headers } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";

// Generates a real Firebase sign-in link via the Admin SDK without letting
// Firebase send its own email — delivery happens via EmailJS instead
// (lib/email/emailjs.ts), so the from-name/branding/deliverability is ours
// to control. The link itself verifies identically either way.
export async function generateSignInLinkAction(email: string): Promise<string> {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const proto = hdrs.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");

  return adminAuth.generateSignInWithEmailLink(email, {
    url: `${proto}://${host}/account/verify`,
    handleCodeInApp: true,
  });
}
