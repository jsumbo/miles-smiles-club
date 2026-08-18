import { ShopGrid } from "@/components/public/ShopGrid";

export default function AccountShopPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide">Shop</h1>
      <p className="mt-1 text-sm text-text-muted">Rep the club on and off the road.</p>
      <div className="mt-6">
        <ShopGrid />
      </div>
    </div>
  );
}
