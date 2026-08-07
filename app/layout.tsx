import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "500", "600", "700"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

const SITE_URL = "https://milesandsmiles.run";
const TITLE = "Miles & Smiles Run Club — Monrovia";
const DESCRIPTION =
  "A no-drop run club for every pace. We run every Thursday and open the roads to everyone on the 1st and 3rd Saturday of each month. Based in Monrovia.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s — Miles & Smiles Run Club",
  },
  description: DESCRIPTION,
  keywords: ["run club", "Monrovia running", "Liberia running club", "no-drop run", "Miles and Smiles"],
  icons: {
    icon: "/favicon.jpg",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Miles & Smiles Run Club",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} ${jetbrains.variable}`}>
      <body suppressHydrationWarning>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
