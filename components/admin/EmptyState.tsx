import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-light py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-text-muted">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {description && <p className="mt-1 max-w-xs text-sm text-text-muted">{description}</p>}
      </div>
    </div>
  );
}
