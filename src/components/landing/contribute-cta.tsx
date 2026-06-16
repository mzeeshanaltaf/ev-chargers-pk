import Link from "next/link";

export function ContributeCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16">
      <div
        className="relative overflow-hidden rounded-3xl px-7 py-12 md:px-14 md:py-16 text-center"
        style={{
          background: "linear-gradient(140deg, var(--ld-green-deep) 0%, var(--ld-surface) 55%)",
          border: "1px solid var(--ld-border-strong)",
        }}
      >
        <div
          className="pointer-events-none absolute -inset-20 opacity-60"
          style={{ background: "radial-gradient(40% 50% at 30% 0%, var(--ld-glow), transparent 70%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="ld-display text-[clamp(2rem,4.5vw,3.25rem)] font-bold" style={{ color: "var(--ld-text)" }}>
            Help map the future of driving in Pakistan
          </h2>
          <p className="mt-4 text-[clamp(1rem,2vw,1.15rem)] leading-relaxed" style={{ color: "var(--ld-text-muted)" }}>
            Every charger you add and every price you confirm removes range anxiety for
            another driver. Start on the map, or reach out to join the contributors.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:scale-[1.03]"
              style={{ background: "var(--ld-green)", color: "var(--ld-on-green)", boxShadow: "0 0 40px var(--ld-glow)" }}
            >
              Open the Map
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[15px] font-semibold"
              style={{ background: "transparent", color: "var(--ld-text)", border: "1px solid var(--ld-border-strong)" }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
