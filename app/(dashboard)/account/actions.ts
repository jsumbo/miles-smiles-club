"use server";

import { adminAuth } from "@/lib/firebase/admin";
import { createOrGetMemberForAuthUser, getMember, selectMemberTier, updateMemberProfile } from "@/lib/firestore/members";
import { listOrdersForMember } from "@/lib/firestore/orders";
import { listRsvpEventIdsForMember, toggleRsvp } from "@/lib/firestore/rsvps";
import type { CardTheme, Gender, MemberTier } from "@/types/firestore";

async function requireUid(idToken: string): Promise<string> {
  const decoded = await adminAuth.verifyIdToken(idToken);
  return decoded.uid;
}

export async function getOrProvisionMemberAction(idToken: string) {
  const decoded = await adminAuth.verifyIdToken(idToken);
  if (!decoded.email) throw new Error("This account has no email on file.");
  return createOrGetMemberForAuthUser({ uid: decoded.uid, email: decoded.email });
}

export async function updateMemberProfileAction(
  idToken: string,
  patch: Partial<{
    name: string;
    phone: string;
    whatsapp: string;
    address: string;
    photoUrl: string;
    cardTheme: CardTheme;
    gender: Gender;
  }>
) {
  const uid = await requireUid(idToken);
  await updateMemberProfile(uid, patch);
  return getMember(uid);
}

export async function listMyOrdersAction(idToken: string) {
  const uid = await requireUid(idToken);
  return listOrdersForMember(uid);
}

export async function selectMemberTierAction(idToken: string, tier: MemberTier) {
  const uid = await requireUid(idToken);
  await selectMemberTier(uid, tier);
  return getMember(uid);
}

export async function listMyRsvpEventIdsAction(idToken: string) {
  const uid = await requireUid(idToken);
  return listRsvpEventIdsForMember(uid);
}

export async function toggleRsvpAction(idToken: string, eventId: string) {
  const uid = await requireUid(idToken);
  return toggleRsvp(eventId, uid);
}
