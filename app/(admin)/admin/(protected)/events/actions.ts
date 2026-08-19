"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import { listEvents, createEvent, updateEvent, deleteEvent } from "@/lib/firestore/events";
import type { EventFormValues } from "@/components/admin/EventForm";

export async function listEventsAction() {
  await requireAdminSession();
  return listEvents();
}

export async function createEventAction(values: EventFormValues) {
  await requireAdminSession();
  const id = await createEvent(values);
  revalidatePath("/");
  return id;
}

export async function updateEventAction(id: string, values: Partial<EventFormValues>) {
  await requireAdminSession();
  await updateEvent(id, values);
  revalidatePath("/");
}

export async function deleteEventAction(id: string) {
  await requireAdminSession();
  await deleteEvent(id);
  revalidatePath("/");
}
