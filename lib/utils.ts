import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared admin-panel date format, e.g. "Jul 11, 2026". */
export function formatDate(input: number | string | Date) {
  return new Date(input).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Shared admin-panel date+time format, e.g. "Jul 11, 2026 · 6:00 PM". */
export function formatDateTime(dateStr: string, timeStr?: string) {
  const date = new Date(`${dateStr}T${timeStr || "00:00"}`);
  const datePart = formatDate(date);
  if (!timeStr) return datePart;
  const timePart = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}
