import type { Metadata } from "next";
import Link from "next/link";
import { InfoShell, InfoHeader } from "@/components/landing/info-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ChargeMap PK privacy policy — how we collect, use, and protect your information on Pakistan's EV charging station directory.",
  alternates: { canonical: "/privacy" },
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ld-display text-xl font-semibold pt-2" style={{ color: "var(--ld-text)" }}>
      {children}
    </h2>
  );
}

function Term({ children }: { children: React.ReactNode }) {
  return <span className="font-medium" style={{ color: "var(--ld-text)" }}>{children}</span>;
}

export default function PrivacyPage() {
  return (
    <InfoShell>
      <InfoHeader title="Privacy Policy" />
      <p className="-mt-7 mb-8 text-sm" style={{ color: "var(--ld-text-dim)" }}>
        Last updated: March 2026
      </p>

      <div className="space-y-6 leading-relaxed text-[16px]" style={{ color: "var(--ld-text-muted)" }}>
        <H2>1. Information We Collect</H2>
        <p>ChargeMap PK collects minimal information necessary to operate the platform:</p>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li><Term>Charger submissions:</Term> Location data, address, and optional phone number provided when adding a charging station</li>
          <li><Term>Contact form:</Term> Name, email address, and message content when you contact us</li>
          <li><Term>Location data:</Term> Your device location, only when you explicitly use the &quot;My Location&quot; feature — this data is never stored or transmitted</li>
        </ul>

        <H2>2. How We Use Your Information</H2>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>To display charging station information on the map</li>
          <li>To respond to your contact form submissions</li>
          <li>To improve the accuracy and quality of the platform</li>
        </ul>

        <H2>3. Data Storage</H2>
        <p>
          Charging station data is stored on our servers and is publicly visible to all users. Contact form submissions are stored securely and only accessible to the ChargeMap PK team.
        </p>

        <H2>4. No User Accounts</H2>
        <p>
          ChargeMap PK does not require user registration or login. We do not track individual users, and we do not use cookies for user identification or advertising.
        </p>

        <H2>5. Third-Party Services</H2>
        <p>We use the following third-party services:</p>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li><Term>OpenStreetMap &amp; CARTO:</Term> For map tiles and geocoding</li>
          <li><Term>Nominatim:</Term> For reverse geocoding when placing chargers on the map</li>
        </ul>

        <H2>6. Data Deletion</H2>
        <p>
          If you would like to request removal of a charging station you submitted or any personal information, please{" "}
          <Link href="/contact" className="underline" style={{ color: "var(--ld-green-bright)" }}>contact us</Link>.
        </p>

        <H2>7. Changes to This Policy</H2>
        <p>
          We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date.
        </p>

        <div className="pt-8 mt-8" style={{ borderTop: "1px solid var(--ld-border)" }}>
          <p className="text-sm" style={{ color: "var(--ld-text-muted)" }}>
            Questions about your privacy?{" "}
            <Link href="/contact" className="underline" style={{ color: "var(--ld-green-bright)" }}>
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </InfoShell>
  );
}
