import { ShopGrid } from "@/components/public/ShopGrid";

export default function ShopPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-secondary">Shop</p>
      <h1 className="mt-4 font-heading text-3xl tracking-wide sm:text-4xl lg:text-5xl">Club merch</h1>
      <p className="mt-4 max-w-2xl text-text-muted sm:text-lg">Rep the club on and off the road.</p>

      <div className="mt-10">
        <ShopGrid />
      </div>
    </section>
  );
}
