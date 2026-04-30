import type { Metadata } from "next";
import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ChargeMap PK privacy policy — how we collect, use, and protect your information on Pakistan's EV charging station directory.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-text-secondary mb-8">Last updated: March 2026</p>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            1. Information We Collect
          </h2>
          <p>
            ChargeMap PK collects minimal information necessary to operate the platform:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="text-text-primary font-medium">Charger submissions:</span> Location data, address, and optional phone number provided when adding a charging station</li>
            <li><span className="text-text-primary font-medium">Contact form:</span> Name, email address, and message content when you contact us</li>
            <li><span className="text-text-primary font-medium">Location data:</span> Your device location, only when you explicitly use the &quot;My Location&quot; feature — this data is never stored or transmitted</li>
          </ul>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            2. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To display charging station information on the map</li>
            <li>To respond to your contact form submissions</li>
            <li>To improve the accuracy and quality of the platform</li>
          </ul>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            3. Data Storage
          </h2>
          <p>
            Charging station data is stored on our servers and is publicly visible to all users. Contact form submissions are stored securely and only accessible to the ChargeMap PK team.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            4. No User Accounts
          </h2>
          <p>
            ChargeMap PK does not require user registration or login. We do not track individual users, and we do not use cookies for user identification or advertising.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            5. Third-Party Services
          </h2>
          <p>
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="text-text-primary font-medium">OpenStreetMap &amp; CARTO:</span> For map tiles and geocoding</li>
            <li><span className="text-text-primary font-medium">Nominatim:</span> For reverse geocoding when placing chargers on the map</li>
          </ul>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            6. Data Deletion
          </h2>
          <p>
            If you would like to request removal of a charging station you submitted or any personal information, please{" "}
            <Link href="/contact" className="text-brand hover:underline">contact us</Link>.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            7. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.
          </p>

          <div className="border-t border-border pt-8 mt-8">
            <p className="text-sm text-text-secondary">
              Questions about your privacy?{" "}
              <Link href="/contact" className="text-brand hover:underline">
                Contact us
              </Link>.
            </p>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
