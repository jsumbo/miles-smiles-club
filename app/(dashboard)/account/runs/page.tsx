import { RunsList } from "@/components/public/RunsList";

export default function AccountRunsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl tracking-wide">Runs</h1>
      <p className="mt-1 text-sm text-text-muted">RSVP to upcoming runs and see what you&apos;ve been to.</p>
      <RunsList />
    </div>
  );
}
