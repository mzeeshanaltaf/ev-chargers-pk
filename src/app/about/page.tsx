"use client";

import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
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
            <li>Copy a Google Maps link for any charger directly from the card</li>
            <li>Use your current location to find nearby charging stations</li>
            <li>Add new charging stations including AC/DC type, peak-hour pricing, and per-day operating hours (requires sign-in)</li>
            <li>Edit or delete charging stations you have added (requires sign-in)</li>
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

          <div className="border-t border-border pt-8 mt-8">
            <p className="text-sm text-text-secondary">
              Have questions or suggestions?{" "}
              <Link href="/contact" className="text-brand hover:underline">
                Get in touch with us
              </Link>. See our{" "}
              <Link href="/acknowledgements" className="text-brand hover:underline">
                Acknowledgements
              </Link>.
            </p>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
