import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";

export default function AcknowledgementsPage() {
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
        <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          &larr; Back to About
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-4" style={{ fontFamily: "var(--font-heading)" }}>
          Acknowledgements
        </h1>
        <p className="text-text-secondary mb-10 leading-relaxed">
          ChargeMap PK would not exist without the people who dedicate their time to growing Pakistan&apos;s EV community. We are deeply grateful to the following individuals and groups.
        </p>

        <div className="space-y-8">
          {/* Fawad Hassan */}
          <div className="rounded-xl border border-border bg-surface-raised p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  Fawad Hassan
                </h2>
                <p className="text-xs text-text-secondary">EV Enthusiast &amp; EV Cars Community Admin</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              For maintaining the up-to-date list of EV chargers in Pakistan — the foundational dataset that powers this platform.
            </p>
          </div>

          {/* PAK EVs Community */}
          <div className="rounded-xl border border-border bg-surface-raised p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  PAK EVs Community — Admin Team
                </h2>
                <p className="text-xs text-text-secondary">
                  <a href="https://pakevs.com/about-us/#team" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                    View admin team &rarr;
                  </a>
                </p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              For providing the platform to share technical details, information, reviews, expert opinions, and technical advice related to EVs — thus supporting a cleaner, greener future for Pakistan.
            </p>
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
