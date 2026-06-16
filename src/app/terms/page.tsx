import type { Metadata } from "next";
import Link from "next/link";
import { InfoShell, InfoHeader } from "@/components/landing/info-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "ChargeMap PK terms of service — rules and guidelines for using Pakistan's community EV charging station directory.",
  alternates: { canonical: "/terms" },
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="ld-display text-xl font-semibold pt-2" style={{ color: "var(--ld-text)" }}>
      {children}
    </h2>
  );
}

export default function TermsPage() {
  return (
    <InfoShell>
      <InfoHeader title="Terms of Service" />
      <p className="-mt-7 mb-8 text-sm" style={{ color: "var(--ld-text-dim)" }}>
        Last updated: March 2026
      </p>

      <div className="space-y-6 leading-relaxed text-[16px]" style={{ color: "var(--ld-text-muted)" }}>
        <H2>1. Acceptance of Terms</H2>
        <p>
          By accessing and using ChargeMap PK, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform.
        </p>

        <H2>2. Description of Service</H2>
        <p>
          ChargeMap PK is a community-driven platform for discovering and sharing EV charging station locations across Pakistan. The service is provided &quot;as is&quot; and is intended for informational purposes only.
        </p>

        <H2>3. User Contributions</H2>
        <p>
          Users may contribute charging station information to the platform. By submitting data, you confirm that the information is accurate to the best of your knowledge. You grant ChargeMap PK a non-exclusive, royalty-free license to use, display, and distribute the submitted information.
        </p>

        <H2>4. Accuracy of Information</H2>
        <p>
          While we strive to maintain accurate and up-to-date information, ChargeMap PK does not guarantee the accuracy, completeness, or reliability of any charging station data. Users should verify station availability and details before relying on the information for travel planning.
        </p>

        <H2>5. Prohibited Conduct</H2>
        <ul className="list-disc list-outside pl-5 space-y-2">
          <li>Submitting false or misleading charging station information</li>
          <li>Attempting to disrupt or overload the platform</li>
          <li>Using automated tools to scrape data without permission</li>
          <li>Impersonating others or misrepresenting your affiliation</li>
        </ul>

        <H2>6. Limitation of Liability</H2>
        <p>
          ChargeMap PK shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use the platform, including but not limited to damages resulting from inaccurate charging station information.
        </p>

        <H2>7. Changes to Terms</H2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
        </p>

        <div className="pt-8 mt-8" style={{ borderTop: "1px solid var(--ld-border)" }}>
          <p className="text-sm" style={{ color: "var(--ld-text-muted)" }}>
            Questions about these terms?{" "}
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
