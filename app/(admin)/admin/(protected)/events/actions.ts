"use server";

import { requireAdminSession } from "@/lib/adminSession";
import { listEvents, createEvent, updateEvent, deleteEvent } from "@/lib/firestore/events";
import type { EventFormValues } from "@/components/admin/EventForm";

export async function listEventsAction() {
  await requireAdminSession();
  return listEvents();
}

export async function createEventAction(values: EventFormValues) {
  await requireAdminSession();
  return createEvent(values);
}

export async function updateEventAction(id: string, values: Partial<EventFormValues>) {
  await requireAdminSession();
  return updateEvent(id, values);
}

export async function deleteEventAction(id: string) {
  await requireAdminSession();
  return deleteEvent(id);
}
