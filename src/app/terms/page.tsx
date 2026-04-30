import type { Metadata } from "next";
import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "ChargeMap PK terms of service — rules and guidelines for using Pakistan's community EV charging station directory.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-text-secondary mb-8">Last updated: March 2026</p>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using ChargeMap PK, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our platform.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            2. Description of Service
          </h2>
          <p>
            ChargeMap PK is a community-driven platform for discovering and sharing EV charging station locations across Pakistan. The service is provided &quot;as is&quot; and is intended for informational purposes only.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            3. User Contributions
          </h2>
          <p>
            Users may contribute charging station information to the platform. By submitting data, you confirm that the information is accurate to the best of your knowledge. You grant ChargeMap PK a non-exclusive, royalty-free license to use, display, and distribute the submitted information.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            4. Accuracy of Information
          </h2>
          <p>
            While we strive to maintain accurate and up-to-date information, ChargeMap PK does not guarantee the accuracy, completeness, or reliability of any charging station data. Users should verify station availability and details before relying on the information for travel planning.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            5. Prohibited Conduct
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Submitting false or misleading charging station information</li>
            <li>Attempting to disrupt or overload the platform</li>
            <li>Using automated tools to scrape data without permission</li>
            <li>Impersonating others or misrepresenting your affiliation</li>
          </ul>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            6. Limitation of Liability
          </h2>
          <p>
            ChargeMap PK shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use the platform, including but not limited to damages resulting from inaccurate charging station information.
          </p>

          <h2 className="text-xl font-semibold text-text-primary pt-2" style={{ fontFamily: "var(--font-heading)" }}>
            7. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
          </p>

          <div className="border-t border-border pt-8 mt-8">
            <p className="text-sm text-text-secondary">
              Questions about these terms?{" "}
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
