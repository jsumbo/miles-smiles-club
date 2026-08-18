import { MemberOrderHistory } from "@/components/member/MemberOrderHistory";

export default function AccountOrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide">Orders</h1>
      <p className="mt-1 text-sm text-text-muted">Your past shop orders.</p>
      <div className="mt-6">
        <MemberOrderHistory />
      </div>
    </div>
  );
}
