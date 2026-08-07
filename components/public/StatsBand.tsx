interface Stat {
  label: string;
  value: string;
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  return (
    <section className="border-y border-border bg-surface-card">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-10 sm:grid-cols-4 sm:px-6 sm:py-12">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-heading text-3xl tracking-tight text-brand-primary sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
