import type { Metadata } from "next";
import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ChargeMap PK — Pakistan's community-driven platform for discovering and sharing EV charging stations. Our mission, features, and the technology behind the map.",
  alternates: { canonical: "/about" },
};

const FAQ_ITEMS = [
  {
    q: "How accurate is the charger data?",
    a: "All charger data is contributed and verified by Pakistan's EV community. We display real-time open/closed status based on each station's configured operating hours. If you find an error, please use the Contact page to let us know.",
  },
  {
    q: "Can I add a new charging station?",
    a: "Yes — authorized contributors can add, edit, and update chargers directly on the map. Sign in with your account and use the Add Charger button. If you'd like contributor access, reach out to us via the Contact page.",
  },
  {
    q: "Are the prices live or manually entered?",
    a: "Prices are manually entered by contributors and may not reflect real-time changes. We recommend confirming pricing at the station before charging.",
  },
  {
    q: "What is the difference between AC and DC charging?",
    a: "AC (Alternating Current) chargers are slower and suitable for overnight or workplace charging. DC (Direct Current) fast chargers can charge most EVs to 80% in 20–60 minutes and are ideal for highway stops and quick top-ups.",
  },
  {
    q: "Do I need to register to leave comments or reactions?",
    a: "You don't need a full account — just enter your name and solve a simple math captcha on any charger's detail page. This one-time step enables commenting and liking/disliking reviews for that session.",
  },
  {
    q: "Is there a mobile app?",
    a: "ChargeMap PK is a Progressive Web App (PWA) — you can install it on your home screen from any modern browser on Android or iOS for an app-like experience without needing to visit an app store.",
  },
  {
    q: "How do I report incorrect information?",
    a: "Use the Contact page to report inaccurate data. If you are an authorized contributor, you can edit the charger directly on the map.",
  },
];

export default function AboutPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-surface/80 backdrop-blur-xl border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <LightningIcon className="w-4.5 h-4.5 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            ChargeMap<span className="text-brand ml-0.5">PK</span>
          </span>
        </Link>
        <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          &larr; Back to Map
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-8" style={{ fontFamily: "var(--font-heading)" }}>
          About ChargeMap PK
        </h1>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            <span className="text-text-primary font-semibold">ChargeMap PK</span> is Pakistan&apos;s dedicated platform for discovering and sharing electric vehicle (EV) charging stations across the country. As Pakistan transitions toward cleaner transportation, finding reliable charging infrastructure remains a challenge — and that&apos;s exactly the problem we&apos;re solving.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4" style={{ fontFamily: "var(--font-heading)" }}>
            Our Mission
          </h2>
          <p>
            To accelerate EV adoption in Pakistan by making charging station information accessible, accurate, and community-driven. We believe that removing range anxiety is key to helping more people make the switch to electric vehicles.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4" style={{ fontFamily: "var(--font-heading)" }}>
            What You Can Do
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Browse an interactive map of EV charging stations across all provinces/territories</li>
            <li>Filter chargers by province, city, charger type (AC/DC), power output, cost, location type, availability, and open status</li>
            <li>View real-time open/closed status based on each station&apos;s operating hours</li>
            <li>See detailed info per station — power, cost, peak-hour pricing, operating hours, phone number, and notes</li>
            <li>Open any charger&apos;s location directly in Google Maps</li>
            <li>View a dedicated details page for each charger with full info, record history, and community comments</li>
            <li>Leave comments and like/dislike reactions on any charger (quick one-time name registration required)</li>
            <li>Use your current location to find nearby charging stations</li>
            <li>Explore live stats — total chargers, DC/AC breakdown, 24-hour availability, and more on the Stats page</li>
            <li>Add new charging stations including AC/DC type, peak-hour pricing, and per-day operating hours (requires sign-in)</li>
            <li>Edit charging stations you have added (requires sign-in)</li>
            <li>Right-click on the map to quickly place a new charger at any location (requires sign-in)</li>
          </ul>

          <h2 className="text-xl font-semibold text-text-primary pt-4" style={{ fontFamily: "var(--font-heading)" }}>
            Community Powered
          </h2>
          <p>
            ChargeMap PK is built on community contributions. Every charging station listed on our platform is added by users like you. Whether you own a charging station, work at one, or simply discovered one during your travels — your contributions help the entire EV community in Pakistan.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4" style={{ fontFamily: "var(--font-heading)" }}>
            Technology
          </h2>
          <p>
            Built with modern web technologies including Next.js, React, and Leaflet for an interactive mapping experience. The platform supports both light and dark themes, works across all devices, and provides real-time data about charging stations nationwide.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-4" style={{ fontFamily: "var(--font-heading)" }}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map(({ q, a }) => (
              <details key={q} className="group border border-border rounded-lg overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-text-primary select-none list-none">
                  {q}
                  <svg
                    className="w-4 h-4 text-text-secondary shrink-0 transition-transform group-open:rotate-180"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="px-4 pb-4 pt-1 text-sm text-text-secondary leading-relaxed">{a}</p>
              </details>
            ))}
          </div>

          <div className="border-t border-border pt-8 mt-8">
            <p className="text-sm text-text-secondary">
              Have questions or suggestions?{" "}
              <Link href="/contact" className="text-brand hover:underline">
                Get in touch with us
              </Link>. See our{" "}
              <Link href="/credits" className="text-brand hover:underline">
                Credits
              </Link>.
            </p>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
