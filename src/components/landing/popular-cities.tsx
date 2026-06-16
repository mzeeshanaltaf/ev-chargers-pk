import Link from "next/link";
import { MapPinIcon } from "@/components/icons";

export interface CityEntry {
  name: string;
  slug: string;
  count: number;
}

export function PopularCities({ cities }: { cities: CityEntry[] }) {
  return (
    <section
      id="cities"
      className="scroll-mt-20 py-20 md:py-28"
      style={{ background: "var(--ld-bg-deep)", borderTop: "1px solid var(--ld-border)", borderBottom: "1px solid var(--ld-border)" }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: "var(--ld-green-bright)" }}>
              Browse by city
            </p>
            <h2 className="ld-display mt-3 text-[clamp(2rem,4.5vw,3rem)] font-bold" style={{ color: "var(--ld-text)" }}>
              Charging, city by city
            </h2>
          </div>
          <Link href="/map" className="text-sm font-medium" style={{ color: "var(--ld-text-muted)" }}>
            View all on the map →
          </Link>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((c) => (
            <Link
              key={c.slug}
              href={`/chargers/${c.slug}`}
              className="group flex items-center justify-between rounded-xl px-5 py-4 transition-colors"
              style={{ background: "var(--ld-surface)", border: "1px solid var(--ld-border)" }}
            >
              <span className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center w-9 h-9 rounded-lg"
                  style={{ background: "color-mix(in oklch, var(--ld-green) 13%, transparent)", color: "var(--ld-green-bright)" }}
                >
                  <MapPinIcon className="w-4 h-4" />
                </span>
                <span className="font-semibold" style={{ color: "var(--ld-text)" }}>{c.name}</span>
              </span>
              {c.count > 0 && (
                <span className="text-[13px] font-medium" style={{ color: "var(--ld-text-dim)" }}>
                  {c.count} {c.count === 1 ? "station" : "stations"}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
