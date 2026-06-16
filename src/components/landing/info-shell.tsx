import { LandingHeader } from "./landing-header";
import { PageFooter } from "@/components/page-footer";

/**
 * Shared shell for the brand/content satellite pages (about, stats, terms,
 * privacy, contact). It places them inside the landing's design world:
 * `.landing-root` layers the marketing palette + fonts, and `dark` resolves the
 * shared theme tokens (used by PageFooter) to their dark variants — exactly as
 * the live landing does. These pages are intentionally dark-only.
 */
export function InfoShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-root dark min-h-screen">
      <LandingHeader />
      <main className="mx-auto max-w-3xl px-5 md:px-8 py-16 md:py-24">
        {children}
      </main>
      <PageFooter />
    </div>
  );
}

/** Page title block: optional eyebrow + landing-display heading + optional lede. */
export function InfoHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--ld-green-bright)" }}>
          {eyebrow}
        </p>
      )}
      <h1 className="ld-display mt-2 text-[clamp(2.2rem,5vw,3.2rem)] font-bold" style={{ color: "var(--ld-text)" }}>
        {title}
      </h1>
      {lede && (
        <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>
          {lede}
        </p>
      )}
    </header>
  );
}
