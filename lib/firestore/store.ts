// Temporary local-only data layer: reads/writes browser localStorage instead
// of a real database. Swap this out (and the "server-only" adminDb calls it
// replaced) once a real backend — Firebase or Supabase — is wired up.
import type { ContentBlock, GalleryImage, JoinRequest, Order, Product, RunEvent } from "@/types/firestore";

const PREFIX = "miles-and-smiles:";
const SEED_FLAG = `${PREFIX}seeded`;

export function readAll<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

export function writeAll<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(items));
}

export function readRecord<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as Record<string, T>) : {};
  } catch {
    return {};
  }
}

export function writeRecord<T>(key: string, record: Record<string, T>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PREFIX + key, JSON.stringify(record));
}

export function genId() {
  return crypto.randomUUID();
}

/** Seeds sample content/events/team/products once, so the site isn't empty on first run. */
export function ensureSeeded() {
  if (typeof window === "undefined") return;
  if (window.localStorage.getItem(SEED_FLAG)) return;

  const today = new Date();
  const inDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  writeRecord<ContentBlock>("content", {
    "landing-hero": {
      id: "landing-hero",
      value: {
        title: "Built by the people who show up",
        subtitle:
          "Miles & Smile started with a simple idea: running is better when you don't do it alone.\n\nWhat started as a few people showing up has grown into a community that supports each other well beyond the miles.",
        ctaLabel: "Join a run",
      },
      updatedAt: Date.now(),
    },
    "landing-stats": {
      id: "landing-stats",
      value: { members: "240+", km: "58,000", years: "1", weekly: "3" },
      updatedAt: Date.now(),
    },
    "about-story": {
      id: "about-story",
      value: {
        heading: "Why I started Miles & Smiles",
        founderName: "Kerrion (Theo) Williams",
        founderRole: "CEO & Founder",
        photoUrl: "/kerion.png",
        body: "I've always loved running.\nNot for a race. Not for a medal. Just for me.\nA habit I picked up during my football days that never really left. There's something about it that quiets everything down.\n\nFor a while, a close friend (Sweetie) kept nudging me to start a run club. She'd remind me to carve out space for myself outside of work, and honestly, she was right. Somewhere between the early mornings and the late night miles, I realized I didn't want to keep doing it alone.\n\nSo two months ago, I did it. I started Miles & Smiles — just me, a few colleagues, and some friends finding rhythm together. What's happened since has genuinely surprised me. Our first open run on May 2nd drew over 50 people. The energy was something I didn't expect, and it hasn't slowed down since.\n\nWe run every Thursday as a core group, and on the 1st and 3rd Saturday of each month, we open the roads to everyone.\n\nOur next open run is this Saturday.\nIf you're in Monrovia and you've been looking for a reason to move — this is it. No pressure. No pace requirement. Just good people, good energy, and miles worth smiling about.\n\nWe're only just getting started.",
      },
      updatedAt: Date.now(),
    },
    "about-schedule": {
      id: "about-schedule",
      value: {
        heading: "How we run",
        body: "We run every Thursday as a core group, and open the roads to everyone on the 1st and 3rd Saturday of each month.",
      },
      updatedAt: Date.now(),
    },
  });

  writeAll<RunEvent>("events", [
    {
      id: genId(),
      title: "Thursday Core Run",
      date: inDays(3),
      time: "18:00",
      startPoint: "Congo Town",
      endPoint: "Ministerial Complex",
      distanceKm: 5,
      description: "Our regular core-group run. Open, but the vibe is more familiar faces than first-timers.",
      imageUrl: "",
      createdAt: Date.now(),
    },
    {
      id: genId(),
      title: "Open Community Run",
      date: inDays(9),
      time: "07:00",
      startPoint: "Monrovia — meet point shared closer to the day",
      endPoint: "Monrovia — meet point shared closer to the day",
      distanceKm: 5,
      description: "1st & 3rd Saturday of the month. No pressure, no pace requirement — everyone's welcome.",
      imageUrl: "",
      createdAt: Date.now(),
    },
    {
      id: genId(),
      title: "Sinkor Sunrise 5K",
      date: (() => {
        const d = new Date(today);
        d.setDate(d.getDate() - 10);
        return d.toISOString().slice(0, 10);
      })(),
      time: "06:30",
      startPoint: "Sinkor — Broad Street junction",
      endPoint: "Mamba Point",
      distanceKm: 5,
      description: "A past open run through Sinkor as the sun came up.",
      imageUrl: "",
      createdAt: Date.now(),
    },
  ]);

  writeAll<Product>("products", [
    {
      id: genId(),
      slug: "club-tee",
      name: "Club Tee",
      description: "Lightweight tech tee with the club logo on the chest.",
      priceCents: 2500,
      images: [],
      sizes: ["S", "M", "L"],
      colors: [],
      active: true,
      createdAt: Date.now(),
    },
    {
      id: genId(),
      slug: "trucker-hat",
      name: "Trucker Hat",
      description: "Breathable mesh back, adjustable strap.",
      priceCents: 2000,
      images: [],
      sizes: [],
      colors: ["Black", "Navy"],
      active: true,
      createdAt: Date.now(),
    },
    {
      id: genId(),
      slug: "buff-headwear",
      name: "Buff Headwear",
      description: "Moisture-wicking neck gaiter / headband.",
      priceCents: 1500,
      images: [],
      sizes: [],
      colors: [],
      active: true,
      createdAt: Date.now(),
    },
  ]);

  writeAll<Order>("orders", []);

  writeAll<GalleryImage>("gallery", [
    { id: genId(), url: "/run-placeholder.jpeg", caption: "Open Community Run", order: 0, createdAt: Date.now() },
    { id: genId(), url: "/hero-bg.jpeg", caption: "Sunrise before the start", order: 1, createdAt: Date.now() },
    { id: genId(), url: "/kiki.jpeg", caption: "Kiki leading the pack", order: 2, createdAt: Date.now() },
  ]);

  writeAll<JoinRequest>("join-requests", [
    {
      id: genId(),
      name: "Fatu Kollie",
      email: "fatu.kollie@example.com",
      whatsapp: "+231770000001",
      phone: "",
      gender: "female",
      address: "Sinkor, Monrovia",
      howHeard: "Instagram",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
    {
      id: genId(),
      name: "James Toe",
      email: "james.toe@example.com",
      whatsapp: "+231770000002",
      phone: "+231880000002",
      gender: "male",
      address: "Congo Town, Monrovia",
      howHeard: "A friend told me",
      createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    {
      id: genId(),
      name: "Aminata Sesay",
      email: "aminata.sesay@example.com",
      whatsapp: "+231770000003",
      phone: "",
      gender: "female",
      address: "Sinkor, Monrovia",
      howHeard: "Saw the club running",
      createdAt: Date.now() - 1000 * 60 * 60 * 24,
    },
  ]);

  window.localStorage.setItem(SEED_FLAG, "true");
}
