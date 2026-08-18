"use server";

import { createMemberInvite, getMemberByEmail } from "@/lib/firestore/members";
import type { Gender } from "@/types/firestore";

// Public and intentionally unauthenticated — matches the "open self-serve"
// membership model. Anyone can apply; this just pre-fills their profile so
// it's ready the moment they complete the email-link sign-in.
export async function becomeMemberAction(input: {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  gender: Gender;
  howHeard: string;
}): Promise<{ alreadyMember: boolean }> {
  const existing = await getMemberByEmail(input.email);
  if (existing) return { alreadyMember: true };

  await createMemberInvite({
    email: input.email,
    name: input.name,
    phone: input.phone || undefined,
    whatsapp: input.whatsapp || undefined,
    address: input.address || undefined,
    gender: input.gender,
    howHeard: input.howHeard || undefined,
    joinedAt: Date.now(),
  });

  return { alreadyMember: false };
}
