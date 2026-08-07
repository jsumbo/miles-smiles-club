import type { LucideIcon } from "lucide-react";

export function PageHeading({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h1 className="font-heading text-2xl tracking-wide">{title}</h1>
    </div>
  );
}
