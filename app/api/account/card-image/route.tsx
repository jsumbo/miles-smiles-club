import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import QRCode from "qrcode";
import { Award, Crown, Medal } from "lucide-react";
import { adminAuth } from "@/lib/firebase/admin";
import { getMember } from "@/lib/firestore/members";
import type { CardTheme, MemberTier } from "@/types/firestore";

// Needs the Admin SDK (Firestore + Auth), which isn't edge-compatible —
// this runs on the default Node runtime.
// Keep in sync with CARD_THEMES in components/member/MembershipCard.tsx.
const THEME_COLORS: Record<CardTheme, string> = {
  classic: "#e85d2a",
  sunrise: "#f59e0b",
  forest: "#047857",
  midnight: "#1e1b4b",
  mono: "#262626",
};

// Same data URI as CARD_PATTERN_URL in components/member/MembershipCard.tsx — keep in sync.
const CARD_PATTERN_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+PHBhdGggZD0iTTAgMjggTDI4IDAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA5IiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=";

const TIER_META: Record<MemberTier, { label: string; Icon: typeof Crown }> = {
  bronze: { label: "Bronze", Icon: Medal },
  silver: { label: "Silver", Icon: Award },
  gold: { label: "Gold", Icon: Crown },
};

function formatDate(ms: number) {
  return new Date(ms).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice("Bearer ".length));
    uid = decoded.uid;
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const member = await getMember(uid);
  if (!member) return new Response("Member not found", { status: 404 });

  const verifyUrl = `${req.nextUrl.origin}/verify/${member.memberNumber}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 240 });

  const color = THEME_COLORS[member.cardTheme] ?? THEME_COLORS.classic;
  const tier = TIER_META[member.tier] ?? TIER_META.bronze;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          background: color,
          color: "white",
          fontFamily: "sans-serif",
          borderRadius: 32,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${CARD_PATTERN_URL})`,
            backgroundRepeat: "repeat",
          }}
        />

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 34, fontWeight: 700 }}>Miles&amp;Smiles</div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                letterSpacing: 4,
                textTransform: "uppercase",
                opacity: 0.75,
                marginTop: 4,
              }}
            >
              Membership Card
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginTop: 14,
                padding: "5px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.2)",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              <tier.Icon size={15} color="white" />
              {tier.label}
            </div>
          </div>

          {member.photoUrl ? (
            <img
              src={member.photoUrl}
              alt={member.name}
              width={140}
              height={140}
              style={{ borderRadius: 20, objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 140,
                height: 140,
                borderRadius: 20,
                background: "rgba(255,255,255,0.15)",
                fontSize: 48,
                fontWeight: 700,
              }}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>{member.name}</div>
            <div style={{ display: "flex", gap: 32, marginTop: 10 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{ display: "flex", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}
                >
                  Member No.
                </div>
                <div style={{ display: "flex", fontSize: 18, marginTop: 2 }}>{member.memberNumber}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{ display: "flex", fontSize: 12, letterSpacing: 2, textTransform: "uppercase", opacity: 0.7 }}
                >
                  Member Since
                </div>
                <div style={{ display: "flex", fontSize: 18, marginTop: 2 }}>{formatDate(member.joinedAt)}</div>
              </div>
            </div>
          </div>

          <img
            src={qrDataUrl}
            alt="Scan to verify membership"
            width={110}
            height={110}
            style={{ borderRadius: 10, background: "white", padding: 8 }}
          />
        </div>
      </div>
    ),
    { width: 1000, height: 625 }
  );
}
