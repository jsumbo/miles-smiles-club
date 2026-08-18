"use server";

import { getContentBlock } from "@/lib/firestore/content";
import { listEvents, listUpcomingEvents } from "@/lib/firestore/events";
import { listGalleryImages } from "@/lib/firestore/gallery";
import { listProducts, getProduct } from "@/lib/firestore/products";
import { createJoinRequest } from "@/lib/firestore/joinRequests";
import type { JoinRequest } from "@/types/firestore";

export async function getContentBlockAction(id: string) {
  return getContentBlock(id);
}

export async function listEventsAction() {
  return listEvents();
}

export async function listUpcomingEventsAction(limit?: number) {
  return listUpcomingEvents(limit);
}

export async function listGalleryImagesAction() {
  return listGalleryImages();
}

export async function listProductsAction(opts?: { activeOnly?: boolean }) {
  return listProducts(opts);
}

export async function getProductAction(slug: string) {
  return getProduct(slug);
}

export async function createJoinRequestAction(input: Omit<JoinRequest, "id" | "createdAt">) {
  return createJoinRequest(input);
}
