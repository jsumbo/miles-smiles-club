import type { Gender } from "@/types/firestore";

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

export const HOW_HEARD_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "friend", label: "A friend" },
  { value: "google", label: "Google search" },
  { value: "flyer", label: "Flyer / poster" },
  { value: "event", label: "Saw us at an event" },
  { value: "other", label: "Other" },
];
