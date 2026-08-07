import { ensureSeeded, genId, readAll, writeAll } from "@/lib/firestore/store";
import type { Product } from "@/types/firestore";

const KEY = "products";

// Older localStorage records predate the sizes/colors fields — normalize on read
// so every caller can rely on them being arrays.
function normalize(product: Product): Product {
  return { ...product, sizes: product.sizes ?? [], colors: product.colors ?? [] };
}

export async function listProducts(opts?: { activeOnly?: boolean }): Promise<Product[]> {
  ensureSeeded();
  const all = readAll<Product>(KEY).map(normalize);
  if (opts?.activeOnly) return all.filter((p) => p.active);
  return all;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const products = await listProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function createProduct(input: Omit<Product, "id" | "createdAt">) {
  ensureSeeded();
  const products = readAll<Product>(KEY);
  const id = genId();
  products.push({ ...input, id, createdAt: Date.now() });
  writeAll(KEY, products);
  return id;
}

export async function updateProduct(id: string, input: Partial<Omit<Product, "id" | "createdAt">>) {
  ensureSeeded();
  const products = readAll<Product>(KEY).map((p) => (p.id === id ? { ...p, ...input } : p));
  writeAll(KEY, products);
}

export async function deleteProduct(id: string) {
  ensureSeeded();
  writeAll(KEY, readAll<Product>(KEY).filter((p) => p.id !== id));
}
