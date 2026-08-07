"use client";

import { createEvent, updateEvent, deleteEvent } from "@/lib/firestore/events";
import type { EventFormValues } from "@/components/admin/EventForm";

export async function createEventAction(values: EventFormValues) {
  return createEvent(values);
}

export async function updateEventAction(id: string, values: Partial<EventFormValues>) {
  return updateEvent(id, values);
}

export async function deleteEventAction(id: string) {
  return deleteEvent(id);
}
