import type { Metadata } from "next";
import Link from "next/link";
import { fetchChargers } from "@/lib/charger-fetch";
import { citySlug, cityDisplayName, chargerCanonicalPath } from "@/lib/slug";
import { formatPower, formatCost } from "@/lib/format";
import { jsonLdScript } from "@/lib/json-ld";
import { LightningIcon } from "@/components/icons";
import { InfoTip } from "@/components/info-tip";
import { Header } from "@/components/header";
import { PageFooter } from "@/components/page-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ChargerTypeBadge, ActiveBadge } from "@/components/badges";
import type { Charger } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const chargers = await fetchChargers();
  const cities = new Set(chargers.map((c) => citySlug(c)));

  return {
    title: `EV Chargers in Pakistan — ${chargers.length} Stations Across ${cities.size} Cities`,
    description: `Browse all ${chargers.length} EV charging stations across ${cities.size} cities in Pakistan. View pricing, power, hours, and directions for every charger, grouped by city.`,
    alternates: { canonical: "/chargers" },
    openGraph: {
      title: "EV Chargers in Pakistan",
      description: `All ${chargers.length} EV charging stations across Pakistan, grouped by city.`,
      url: "/chargers",
    },
  };
}

export default async function ChargersIndexPage() {
  const chargers = await fetchChargers();

  if (chargers.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Header centeredNav />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mb-6">
            <LightningIcon className="w-8 h-8 text-text-secondary/40" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3" style={{ fontFamily: "var(--font-heading)" }}>
            No Chargers Listed Yet
          </h1>
          <p className="text-text-secondary max-w-sm leading-relaxed mb-8">
            We don&apos;t have any EV charging stations listed yet. Check back later or
            explore the interactive map.
          </p>
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-xl bg-brand text-white px-5 py-2.5 text-sm font-semibold hover:bg-brand/90 transition-colors"
          >
            Open the Map
          </Link>
        </main>
        <PageFooter />
      </div>
    );
  }

  const dc = chargers.filter((c) => c.charger_type === "DC").length;
  const open24 = chargers.filter((c) => c.is_available_24hrs).length;

  // Group chargers by city slug, then sort cities by station count (desc).
  const byCity = new Map<string, { name: string; chargers: Charger[] }>();
  for (const charger of chargers) {
    const slug = citySlug(charger);
    let group = byCity.get(slug);
    if (!group) {
      group = { name: cityDisplayName(slug), chargers: [] };
      byCity.set(slug, group);
    }
    group.chargers.push(charger);
  }
  const cityGroups = Array.from(byCity.entries()).sort(
    (a, b) => b[1].chargers.length - a[1].chargers.length || a[1].name.localeCompare(b[1].name)
  );

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EV Chargers in Pakistan",
    numberOfItems: chargers.length,
    itemListElement: chargers.slice(0, 50).map((c: Charger, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://chargemap-pk.zeeshanai.cloud${chargerCanonicalPath(c)}`,
      name: `${c.charger_type} ${formatPower(c.power_kw)} kW — ${c.address}`,
    })),
  };

  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListJsonLd) }}
      />

      <Header centeredNav />

      <main className="max-w-2xl mx-auto px-6 py-10">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Chargers" },
        ]} />

        <h1 className="text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          EV Chargers in Pakistan
        </h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          {chargers.length} charging station{chargers.length !== 1 ? "s" : ""} across{" "}
          {cityGroups.length} cit{cityGroups.length !== 1 ? "ies" : "y"} in Pakistan —{" "}
          {dc} DC fast charger{dc !== 1 ? "s" : ""}, {open24} available 24/7.
        </p>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total", value: chargers.length },
            { label: "DC Fast", value: dc },
            { label: "Cities", value: cityGroups.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-surface-raised p-4 text-center">
              <div className="text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>{value}</div>
              <div className="text-xs text-text-secondary mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Chargers grouped by city */}
        <div className="space-y-10">
          {cityGroups.map(([slug, { name, chargers: cityChargers }]) => (
            <section key={slug}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
                  {name}
                </h2>
                <Link
                  href={`/chargers/${slug}`}
                  className="text-sm text-brand font-semibold hover:text-brand/80 transition-colors"
                >
                  View all {cityChargers.length} &rarr;
                </Link>
              </div>

              <div className="space-y-3">
                {cityChargers.map((charger) => (
                  <Link
                    key={charger.id}
                    href={chargerCanonicalPath(charger)}
                    className="block rounded-xl border border-border bg-surface-raised p-4 hover:border-brand/40 hover:bg-brand/5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-base font-semibold text-text-primary tabular-nums">
                            {formatPower(charger.power_kw)} kW
                          </span>
                          <ChargerTypeBadge type={charger.charger_type} />
                          <ActiveBadge isActive={charger.is_open} />
                        </div>
                        <p className="text-sm text-text-secondary truncate">{charger.address}</p>
                        <p className="inline-flex items-center gap-1 text-xs text-brand font-semibold mt-1">
                          {formatCost(charger.cost_per_kwh)}/kWh
                          <InfoTip />
                        </p>
                      </div>
                      <svg className="w-4 h-4 text-text-secondary/40 shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <PageFooter />
    </div>
  );
}
