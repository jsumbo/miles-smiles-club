import { Skeleton } from "@/components/ui/skeleton";

/** Shown by AccountShell while the member's auth state / profile is resolving. */
export function AccountShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-surface-light">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-border bg-surface-card md:flex">
        <div className="px-4 py-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-2 h-2.5 w-14" />
        </div>
        <nav className="flex-1 space-y-1 px-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-md" />
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-surface-card px-4 sm:px-6">
          <Skeleton className="h-8 w-8 rounded-md md:hidden" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
          <div className="mt-6 max-w-lg space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

/** Matches MemberOrderHistory's order cards. */
export function MemberOrdersSkeleton({ count = 3 }: { count?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="rounded-lg border border-border bg-surface-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="mt-3 space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="mt-3 h-4 w-16" />
        </li>
      ))}
    </ul>
  );
}
