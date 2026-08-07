import { ensureSeeded, genId, readAll, writeAll } from "@/lib/firestore/store";
import type { RunEvent } from "@/types/firestore";

const KEY = "events";

export async function listEvents(): Promise<RunEvent[]> {
  ensureSeeded();
  return readAll<RunEvent>(KEY).sort((a, b) => a.date.localeCompare(b.date));
}

export async function listUpcomingEvents(limit = 3): Promise<RunEvent[]> {
  const today = new Date().toISOString().slice(0, 10);
  const events = await listEvents();
  return events.filter((e) => e.date >= today).slice(0, limit);
}

export async function createEvent(input: Omit<RunEvent, "id" | "createdAt">) {
  ensureSeeded();
  const events = readAll<RunEvent>(KEY);
  const id = genId();
  events.push({ ...input, id, createdAt: Date.now() });
  writeAll(KEY, events);
  return id;
}

export async function updateEvent(id: string, input: Partial<Omit<RunEvent, "id" | "createdAt">>) {
  ensureSeeded();
  const events = readAll<RunEvent>(KEY).map((e) => (e.id === id ? { ...e, ...input } : e));
  writeAll(KEY, events);
}

export async function deleteEvent(id: string) {
  ensureSeeded();
  writeAll(
    KEY,
    readAll<RunEvent>(KEY).filter((e) => e.id !== id)
  );
}
