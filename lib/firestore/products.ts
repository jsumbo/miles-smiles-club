import { adminDb } from "@/lib/firebase/admin";
import type { Product } from "@/types/firestore";

const PRODUCTS = "products";

function normalize(product: Product): Product {
  return { ...product, sizes: product.sizes ?? [], colors: product.colors ?? [] };
}

export async function listProducts(opts?: { activeOnly?: boolean }): Promise<Product[]> {
  let query: FirebaseFirestore.Query = adminDb.collection(PRODUCTS);
  if (opts?.activeOnly) query = query.where("active", "==", true);
  const snap = await query.get();
  return snap.docs.map((d) => normalize(d.data() as Product));
}

export async function getProduct(slug: string): Promise<Product | null> {
  const snap = await adminDb.collection(PRODUCTS).where("slug", "==", slug).limit(1).get();
  const doc = snap.docs[0];
  return doc ? normalize(doc.data() as Product) : null;
}

export async function createProduct(input: Omit<Product, "id" | "createdAt">): Promise<string> {
  const ref = adminDb.collection(PRODUCTS).doc();
  const product: Product = { ...input, id: ref.id, createdAt: Date.now() };
  await ref.set(product);
  return ref.id;
}

export async function updateProduct(id: string, input: Partial<Omit<Product, "id" | "createdAt">>): Promise<void> {
  await adminDb.collection(PRODUCTS).doc(id).update(input);
}

export async function deleteProduct(id: string): Promise<void> {
  await adminDb.collection(PRODUCTS).doc(id).delete();
}
