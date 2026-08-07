import Link from "next/link";
import { Instagram, Facebook, MapPin, Mail } from "lucide-react";
import { JoinRunButton } from "@/components/public/JoinRunButton";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/runs", label: "Runs" },
  { href: "/gallery", label: "Gallery" },
  { href: "/shop", label: "Shop" },
];

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
  { href: "https://www.strava.com/clubs/2075589", label: "Strava", image: "/strava-logo-png-4.webp" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Miles & Smiles Run Club" className="h-10 w-10 rounded-lg object-cover" />
              <span className="font-heading text-lg tracking-wide sm:text-xl">
                Miles<span className="text-brand-primary">&</span>Smiles
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-text-muted">
              A no-drop run club for every pace, based in Monrovia. Show up for the miles, stay for the
              smiles.
            </p>
            <JoinRunButton className="mt-5 inline-block rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-shadow hover:shadow-card-hover">
              Join a Run
            </JoinRunButton>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Explore</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">Get in touch</p>
            <div className="mt-4 flex flex-col gap-2.5 text-sm text-text-muted">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-brand-secondary" /> Monrovia, Liberia
              </p>
              <a
                href="mailto:hello@milesandsmiles.run"
                className="flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 shrink-0 text-brand-secondary" /> hello@milesandsmiles.run
              </a>
            </div>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition-colors hover:border-brand-primary hover:text-brand-primary"
                >
                  {social.image ? (
                    <img src={social.image} alt="" className="h-4 w-4 object-contain" />
                  ) : (
                    social.icon && <social.icon className="h-4 w-4" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Miles &amp; Smiles Run Club. All rights reserved.</p>
          <p>Every Thursday · 1st &amp; 3rd Saturday · Monrovia</p>
        </div>
      </div>
    </footer>
  );
}
