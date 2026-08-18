import { adminDb } from "@/lib/firebase/admin";
import type { RunEvent } from "@/types/firestore";

const EVENTS = "events";

export async function listEvents(): Promise<RunEvent[]> {
  const snap = await adminDb.collection(EVENTS).orderBy("date", "asc").get();
  return snap.docs.map((d) => d.data() as RunEvent);
}

export async function listUpcomingEvents(limit = 3): Promise<RunEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const events = await listEvents();
  return events.filter((e) => e.date >= today).slice(0, limit);
}

export async function createEvent(input: Omit<RunEvent, "id" | "createdAt">): Promise<string> {
  const ref = adminDb.collection(EVENTS).doc();
  const event: RunEvent = { ...input, id: ref.id, createdAt: Date.now() };
  await ref.set(event);
  return ref.id;
}

export async function updateEvent(id: string, input: Partial<Omit<RunEvent, "id" | "createdAt">>): Promise<void> {
  await adminDb.collection(EVENTS).doc(id).update(input);
}

export async function deleteEvent(id: string): Promise<void> {
  await adminDb.collection(EVENTS).doc(id).delete();
}
