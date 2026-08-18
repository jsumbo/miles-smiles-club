export interface ContentBlock {
  id: string; // e.g. "landing-hero", "about-story"
  value: Record<string, string>;
  updatedAt: number;
}

export interface RunEvent {
  id: string;
  title: string;
  date: string; // ISO date
  time: string; // e.g. "06:30"
  startPoint: string;
  endPoint: string;
  distanceKm: number;
  description: string;
  imageUrl: string;
  createdAt: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  images: string[];
  sizes: string[];
  colors: string[];
  active: boolean;
  createdAt: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  order: number;
  createdAt: number;
}

export type Gender = "female" | "male";

export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  phone: string; // left blank when it's the same as whatsapp
  gender: Gender;
  address: string;
  howHeard: string;
  createdAt: number;
}

export type OrderStatus = "pending" | "confirmed" | "fulfilled" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
  priceCents: number;
}

export interface Order {
  id: string;
  memberId?: string; // set when the order was placed while signed in
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  totalCents: number;
  fulfillmentNote: string;
  status: OrderStatus;
  createdAt: number;
}

export type MemberStatus = "active" | "inactive";
export type CardTheme = "classic" | "sunrise" | "forest" | "midnight" | "mono";
export type MemberTier = "bronze" | "silver" | "gold";

export interface Member {
  id: string; // === Firebase Auth uid; also the Firestore doc id
  memberNumber: string; // e.g. "MS-0007"
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  photoUrl: string; // Firebase Storage download URL, folder "members"
  cardTheme: CardTheme;
  tier: MemberTier; // self-selected once at onboarding, or admin-assigned afterward — see hasSelectedTier
  hasSelectedTier: boolean; // gates the dashboard until the member picks their first tier
  status: MemberStatus;
  gender: Gender;
  howHeard: string; // captured at signup, not member-editable afterward
  joinedAt: number; // "member since" — may be backdated via invite
  createdAt: number;
  updatedAt: number;
}

export interface MemberInvite {
  id: string; // normalized lowercase email, used as doc id
  email: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  gender?: Gender;
  howHeard?: string;
  memberNumberOverride?: string;
  joinedAt: number;
  createdAt: number;
}

export interface EventRsvp {
  id: string; // `${eventId}_${memberId}`
  eventId: string;
  memberId: string;
  createdAt: number;
}
