"use server";

import { getMemberByEmail } from "@/lib/firestore/members";

// Public and intentionally unauthenticated — this just gates whether a
// sign-in link should be sent at all, so non-members can't get one by
// typing an arbitrary email on the login page.
export async function memberExistsAction(email: string): Promise<boolean> {
  return Boolean(await getMemberByEmail(email));
}
