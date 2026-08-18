import { adminDb } from "@/lib/firebase/admin";
import type { Gender, Member, MemberInvite, MemberStatus, MemberTier } from "@/types/firestore";

const MEMBERS = "members";
const INVITES = "memberInvites";
const COUNTERS_DOC = "_meta/counters";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getMember(uid: string): Promise<Member | null> {
  const snap = await adminDb.collection(MEMBERS).doc(uid).get();
  return snap.exists ? (snap.data() as Member) : null;
}

export async function getMemberInvite(email: string): Promise<MemberInvite | null> {
  const snap = await adminDb.collection(INVITES).doc(normalizeEmail(email)).get();
  return snap.exists ? (snap.data() as MemberInvite) : null;
}

export async function getMemberByNumber(memberNumber: string): Promise<Member | null> {
  const snap = await adminDb.collection(MEMBERS).where("memberNumber", "==", memberNumber).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as Member);
}

export async function getMemberByEmail(email: string): Promise<Member | null> {
  const snap = await adminDb.collection(MEMBERS).where("email", "==", normalizeEmail(email)).limit(1).get();
  return snap.empty ? null : (snap.docs[0].data() as Member);
}

// Allocates a sequential member number (e.g. "MS-0007") atomically, so two
// people signing in for the first time at the same moment can't collide.
async function nextMemberNumber(): Promise<string> {
  const counterRef = adminDb.doc(COUNTERS_DOC);
  const seq = await adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(counterRef);
    const current = (snap.data()?.memberSeq as number | undefined) ?? 0;
    const next = current + 1;
    tx.set(counterRef, { memberSeq: next }, { merge: true });
    return next;
  });
  return `MS-${String(seq).padStart(4, "0")}`;
}

/** Runs right after a member's first successful sign-in. Idempotent. */
export async function createOrGetMemberForAuthUser({
  uid,
  email,
}: {
  uid: string;
  email: string;
}): Promise<Member> {
  const existing = await getMember(uid);
  if (existing) return existing;

  const normalizedEmail = normalizeEmail(email);
  const invite = await getMemberInvite(normalizedEmail);
  const memberNumber = invite?.memberNumberOverride ?? (await nextMemberNumber());
  const now = Date.now();

  const member: Member = {
    id: uid,
    memberNumber,
    name: invite?.name ?? normalizedEmail.split("@")[0],
    email: normalizedEmail,
    phone: invite?.phone ?? "",
    whatsapp: invite?.whatsapp ?? "",
    address: invite?.address ?? "",
    photoUrl: "",
    cardTheme: "classic",
    tier: "bronze",
    hasSelectedTier: false,
    status: "active",
    gender: invite?.gender ?? "female",
    howHeard: invite?.howHeard ?? "",
    joinedAt: invite?.joinedAt ?? now,
    createdAt: now,
    updatedAt: now,
  };

  await adminDb.collection(MEMBERS).doc(uid).set(member);
  if (invite) await adminDb.collection(INVITES).doc(normalizedEmail).delete();

  return member;
}

type ProfilePatch = Partial<
  Pick<Member, "name" | "phone" | "whatsapp" | "address" | "photoUrl" | "cardTheme" | "gender">
>;

export async function updateMemberProfile(uid: string, patch: ProfilePatch): Promise<void> {
  await adminDb
    .collection(MEMBERS)
    .doc(uid)
    .update({ ...patch, updatedAt: Date.now() });
}

export async function listMembers(): Promise<Member[]> {
  const snap = await adminDb.collection(MEMBERS).orderBy("joinedAt", "desc").get();
  return snap.docs.map((d) => d.data() as Member);
}

export async function setMemberStatus(uid: string, status: MemberStatus): Promise<void> {
  await adminDb.collection(MEMBERS).doc(uid).update({ status, updatedAt: Date.now() });
}

export async function setMemberTier(uid: string, tier: MemberTier): Promise<void> {
  await adminDb.collection(MEMBERS).doc(uid).update({ tier, hasSelectedTier: true, updatedAt: Date.now() });
}

/** The member's own first tier pick, right after onboarding. */
export async function selectMemberTier(uid: string, tier: MemberTier): Promise<void> {
  await adminDb.collection(MEMBERS).doc(uid).update({ tier, hasSelectedTier: true, updatedAt: Date.now() });
}

export async function createMemberInvite(input: {
  email: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  gender?: Gender;
  howHeard?: string;
  joinedAt: number;
  memberNumberOverride?: string;
}): Promise<void> {
  const normalizedEmail = normalizeEmail(input.email);
  const invite: MemberInvite = {
    id: normalizedEmail,
    email: normalizedEmail,
    name: input.name,
    joinedAt: input.joinedAt,
    createdAt: Date.now(),
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.whatsapp ? { whatsapp: input.whatsapp } : {}),
    ...(input.address ? { address: input.address } : {}),
    ...(input.gender ? { gender: input.gender } : {}),
    ...(input.howHeard ? { howHeard: input.howHeard } : {}),
    ...(input.memberNumberOverride ? { memberNumberOverride: input.memberNumberOverride } : {}),
  };
  await adminDb.collection(INVITES).doc(normalizedEmail).set(invite);
}

export async function listMemberInvites(): Promise<MemberInvite[]> {
  const snap = await adminDb.collection(INVITES).orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as MemberInvite);
}

export async function deleteMemberInvite(email: string): Promise<void> {
  await adminDb.collection(INVITES).doc(normalizeEmail(email)).delete();
}
