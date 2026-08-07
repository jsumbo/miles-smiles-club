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
  customerName: string;
  email: string;
  phone: string;
  items: OrderItem[];
  totalCents: number;
  fulfillmentNote: string;
  status: OrderStatus;
  createdAt: number;
}
