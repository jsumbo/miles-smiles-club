import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Miles & Smiles Run Club — Monrovia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #e85d2a 0%, #d94f1f 45%, #2a9d8f 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 32,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Monrovia · Liberia
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 96,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.05,
          }}
        >
          Miles &amp; Smiles
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.05,
          }}
        >
          Run Club
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 34,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          A no-drop run club for every pace
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 28,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          Every Thursday · 1st &amp; 3rd Saturday
        </div>
      </div>
    ),
    { ...size }
  );
}
