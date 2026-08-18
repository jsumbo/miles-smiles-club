"use server";

import { requireAdminSession } from "@/lib/adminSession";
import {
  createMemberInvite,
  deleteMemberInvite,
  listMembers,
  setMemberStatus,
  setMemberTier,
} from "@/lib/firestore/members";
import type { MemberStatus, MemberTier } from "@/types/firestore";

// Every member regardless of status (active/inactive) — the count is meant to reflect
// everyone in the database, not just who's currently active.
export async function listMembersAction() {
  await requireAdminSession();
  return listMembers();
}

export async function setMemberStatusAction(uid: string, status: MemberStatus) {
  await requireAdminSession();
  return setMemberStatus(uid, status);
}

export async function setMemberTierAction(uid: string, tier: MemberTier) {
  await requireAdminSession();
  return setMemberTier(uid, tier);
}

export async function createMemberInviteAction(input: {
  email: string;
  name: string;
  joinedAt: number;
  memberNumberOverride?: string;
}) {
  await requireAdminSession();
  return createMemberInvite(input);
}

export async function deleteMemberInviteAction(email: string) {
  await requireAdminSession();
  return deleteMemberInvite(email);
}
