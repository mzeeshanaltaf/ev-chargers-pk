import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/providers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const BASE_URL = "https://chargemap-pk.zeeshanai.cloud";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ChargeMap PK — EV Chargers in Pakistan",
    template: "%s | ChargeMap PK",
  },
  description:
    "Find and add EV charging stations across Pakistan. Interactive map with filters by province, city, charger type (AC/DC), power, and 24-hour availability.",
  keywords: [
    "EV charging Pakistan",
    "electric vehicle chargers",
    "EV charger map Pakistan",
    "DC fast charger Pakistan",
    "AC charger Pakistan",
    "Karachi EV charger",
    "Lahore EV charger",
    "Islamabad EV charger",
    "Tesla charger Pakistan",
    "Pakistan electric car charging",
  ],
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "ChargeMap PK",
    title: "ChargeMap PK — EV Chargers in Pakistan",
    description:
      "Find and add EV charging stations across Pakistan. Interactive map with filters, real-time status, and community-contributed data.",
    locale: "en_PK",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ChargeMap PK — EV Chargers in Pakistan" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChargeMap PK — EV Chargers in Pakistan",
    description:
      "Find and add EV charging stations across Pakistan. Interactive map with filters, real-time status, and community-contributed data.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#00C853",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ChargeMap PK",
  url: BASE_URL,
  logo: `${BASE_URL}/icons/icon-512.png`,
  description:
    "Pakistan's community-driven EV charging station directory — find, add, and share charging stations nationwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
