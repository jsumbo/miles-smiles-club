import { CardEditor } from "@/components/member/CardEditor";

export default function AccountCardPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide">Membership Card</h1>
      <p className="mt-1 text-sm text-text-muted">Add a photo and pick a theme to make it yours.</p>
      <div className="mt-6">
        <CardEditor />
      </div>
    </div>
  );
}
