import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "ChargeMap PK - EV Chargers in Pakistan",
  description: "Find and add EV charging stations across Pakistan. Interactive map with filters, real-time data, and easy charger submission.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
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
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
