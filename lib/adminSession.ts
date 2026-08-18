import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

function sign(email: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  return createHmac("sha256", secret).update(email).digest("hex");
}

function buildCookieValue(email: string): string {
  return `${email}.${sign(email)}`;
}

function verifyCookieValue(value: string): string | null {
  const dotIndex = value.lastIndexOf(".");
  if (dotIndex === -1) return null;

  const email = value.slice(0, dotIndex);
  const signature = value.slice(dotIndex + 1);
  const expected = sign(email);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return email;
}

export async function createAdminSessionCookie(email: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, buildCookieValue(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Reads and verifies the admin session cookie. Returns the admin email, or null if absent/invalid. */
export async function getAdminSession(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return verifyCookieValue(raw);
}

/** Throws if there's no valid admin session. Call this first in every admin Server Action. */
export async function requireAdminSession(): Promise<string> {
  const email = await getAdminSession();
  if (!email) throw new Error("Not authenticated.");
  return email;
}
