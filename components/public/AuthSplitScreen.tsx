import Link from "next/link";

export function AuthSplitScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Visual panel — hidden on small screens, the form takes the full width there */}
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src="/hero-bg.jpeg"
          alt="Miles & Smiles Run Club"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/92 via-brand-primary/75 to-brand-secondary/85" />

        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-[0.12]"
          viewBox="0 0 1200 300"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 220 C 150 100, 300 260, 450 160 S 750 60, 900 180 S 1100 260, 1200 140"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-14">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-heading text-lg tracking-wide">
              Miles<span className="opacity-80">&amp;</span>Smiles
            </span>
          </Link>

          <div>
            <h1 className="max-w-md text-balance font-heading text-4xl leading-tight tracking-wide xl:text-5xl">
              Your membership card, always on you.
            </h1>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="font-heading text-3xl">20+</p>
              <p className="text-xs uppercase tracking-widest text-white/70">Members</p>
            </div>
            <div>
              <p className="font-heading text-3xl">58,000</p>
              <p className="text-xs uppercase tracking-widest text-white/70">KM logged</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center bg-surface-light px-4 py-12 sm:px-6 lg:px-16 xl:px-24">
        <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
          <img src="/logo.jpg" alt="" className="h-8 w-8 rounded-lg object-cover" />
          <span className="font-heading text-lg tracking-wide">
            Miles<span className="text-brand-primary">&amp;</span>Smiles
          </span>
        </Link>

        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
