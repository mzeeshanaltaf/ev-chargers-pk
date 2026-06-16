import Link from "next/link";

const POINTS = [
  {
    title: "Community-powered",
    body: "Every listing is added and kept current by Pakistan's EV drivers and enthusiasts — not scraped, not guessed.",
  },
  {
    title: "Honest by default",
    body: "Prices are marked tentative, hours drive live open/closed status, and every entry shows who contributed it.",
  },
  {
    title: "Free and open",
    body: "No paywall, no account needed to browse, installable as a PWA. Built as infrastructure, not a product to sell.",
  },
];

export function AboutTeaser() {
  return (
    <section id="about" className="scroll-mt-20 mx-auto max-w-6xl px-5 md:px-8 py-20 md:py-28">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--ld-green-bright)" }}>
            About ChargeMap PK
          </p>
          <h2 className="ld-display mt-3 text-[clamp(2rem,4.5vw,3rem)] font-bold" style={{ color: "var(--ld-text)" }}>
            The charging map Pakistan was missing
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>
            Reliable, nationwide EV charging data never lived in one place — and that
            gap slows adoption. ChargeMap PK fixes it: a community-driven directory of
            every AC and DC station, built by people who actually drive EVs.
          </p>
          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2"
            style={{
              background: "color-mix(in oklch, var(--ld-green) 14%, transparent)",
              color: "var(--ld-green-bright)",
              border: "1px solid var(--ld-border-strong)",
            }}
          >
            Read the full story →
          </Link>
        </div>

        <ul className="flex flex-col gap-3">
          {POINTS.map((p) => (
            <li
              key={p.title}
              className="rounded-2xl p-6"
              style={{ background: "var(--ld-surface)", border: "1px solid var(--ld-border)" }}
            >
              <h3 className="ld-display text-lg font-semibold" style={{ color: "var(--ld-text)" }}>
                {p.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
