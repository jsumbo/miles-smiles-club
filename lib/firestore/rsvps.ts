import { adminDb } from "@/lib/firebase/admin";
import type { EventRsvp } from "@/types/firestore";

const RSVPS = "rsvps";

function rsvpId(eventId: string, memberId: string) {
  return `${eventId}_${memberId}`;
}

export async function listRsvpEventIdsForMember(memberId: string): Promise<string[]> {
  const snap = await adminDb.collection(RSVPS).where("memberId", "==", memberId).get();
  return snap.docs.map((d) => (d.data() as EventRsvp).eventId);
}

/** Toggles the member's RSVP for an event. Returns the new state (true = now going). */
export async function toggleRsvp(eventId: string, memberId: string): Promise<boolean> {
  const ref = adminDb.collection(RSVPS).doc(rsvpId(eventId, memberId));
  const snap = await ref.get();

  if (snap.exists) {
    await ref.delete();
    return false;
  }

  const rsvp: EventRsvp = { id: rsvpId(eventId, memberId), eventId, memberId, createdAt: Date.now() };
  await ref.set(rsvp);
  return true;
}
