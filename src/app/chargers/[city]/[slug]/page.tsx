import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchChargers, findChargerByIdSuffix } from "@/lib/charger-fetch";
import { chargerCanonicalPath, citySlug, cityDisplayName } from "@/lib/slug";
import { formatPower, formatCost, formatDayHours } from "@/lib/format";
import { Badge24hr, ActiveBadge, ChargerTypeBadge, LocationTypeBadge } from "@/components/badges";
import { LightningIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CommentsClient } from "./comments-client";
import type { Charger } from "@/lib/types";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" });
}

function idSuffixFromSlug(slug: string): string {
  return slug.slice(-5);
}

async function getCharger(slug: string): Promise<Charger | null> {
  const chargers = await fetchChargers();
  const suffix = idSuffixFromSlug(slug);
  return findChargerByIdSuffix(chargers, suffix) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const charger = await getCharger(slug);
  if (!charger) return { title: "Charger Not Found", robots: { index: false } };

  const title = `${formatPower(charger.power_kw)} kW ${charger.charger_type} Charger — ${charger.address}, ${charger.city}`;
  const description = `${charger.charger_type} ${formatPower(charger.power_kw)} kW EV charger at ${charger.address}, ${charger.city}, ${charger.province_territory}. ${formatCost(charger.cost_per_kwh)}/kWh. ${charger.is_available_24hrs ? "Open 24/7." : "Operating hours apply."} View location, hours, and community comments.`;
  const canonical = chargerCanonicalPath(charger);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: `${canonical}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ChargerDetailPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;
  const charger = await getCharger(slug);

  if (!charger) notFound();

  const oh = charger.opening_hours;
  const cityName = cityDisplayName(city);

  const evStationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EVChargingStation",
    name: `${charger.charger_type} ${formatPower(charger.power_kw)} kW EV Charger`,
    description: `${charger.charger_type} charging station at ${charger.address}, ${charger.city}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: charger.address,
      addressLocality: charger.city,
      addressRegion: charger.province_territory,
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: charger.latitude,
      longitude: charger.longitude,
    },
    ...(charger.phone_number ? { telephone: charger.phone_number } : {}),
    openingHours: charger.is_available_24hrs ? "Mo-Su 00:00-24:00" : undefined,
    priceRange: formatCost(charger.cost_per_kwh) + "/kWh",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Charger Type", value: charger.charger_type },
      { "@type": "LocationFeatureSpecification", name: "Power Output", value: `${formatPower(charger.power_kw)} kW` },
    ],
    url: `https://chargemap-pk.zeeshanai.cloud${chargerCanonicalPath(charger)}`,
  };

  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(evStationJsonLd) }}
      />

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

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Chargers", href: "/chargers" },
          { label: cityName, href: `/chargers/${citySlug(charger)}` },
          { label: `${charger.charger_type} ${formatPower(charger.power_kw)} kW` },
        ]} />

        {/* Charger Info */}
        <section className="rounded-2xl border border-border bg-surface-raised p-6 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <LightningIcon className="w-5 h-5 text-brand" fill="currentColor" />
              <span className="text-2xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
                {formatPower(charger.power_kw)}
                <span className="text-base font-normal text-text-secondary ml-1">kW</span>
              </span>
            </div>
            <ChargerTypeBadge type={charger.charger_type} />
            {charger.is_available_24hrs && <Badge24hr />}
            <ActiveBadge isActive={charger.is_open} />
          </div>

          <p className="text-base text-text-primary leading-snug">{charger.address}</p>

          <div className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4 text-text-secondary shrink-0" />
            <span className="text-sm text-text-secondary">{charger.city}, {charger.province_territory}</span>
          </div>

          {charger.phone_number && (
            <div className="flex items-center gap-1.5">
              <PhoneIcon className="w-4 h-4 text-text-secondary shrink-0" />
              <span className="text-sm text-text-secondary">{charger.phone_number}</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-brand tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
              {formatCost(charger.cost_per_kwh)}/kWh
            </span>
            {charger.cost_per_kwh_peak != null && (
              <span className="text-sm font-semibold text-amber-500 tabular-nums">
                {formatCost(charger.cost_per_kwh_peak)}/kWh (Peak hours)
              </span>
            )}
          </div>

          {!charger.is_available_24hrs && oh && (
            <div className="text-sm text-text-secondary space-y-1 border-t border-border pt-3">
              {[
                { label: "Weekdays", key: "weekday" as const },
                { label: "Friday", key: "friday" as const },
                { label: "Weekend", key: "weekend" as const },
              ].map(({ label, key }) => {
                const hours = formatDayHours(oh[key]);
                return hours ? (
                  <div key={key} className="flex justify-between gap-4">
                    <span className="font-medium">{label}</span>
                    <span className={oh[key]?.closed ? "text-danger" : ""}>{hours}</span>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {charger.notes && (
            <div className="flex items-start gap-2 border-t border-border pt-3">
              <svg className="w-4 h-4 text-text-secondary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <p className="text-sm text-text-secondary italic">{charger.notes}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-border pt-3">
            <LocationTypeBadge type={charger.location_type} />
            <a
              href={`https://www.google.com/maps?q=${charger.latitude},${charger.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Open in Google Maps
            </a>
          </div>
        </section>

        {/* Record info */}
        <section className="text-xs text-text-secondary space-y-1 px-1">
          {charger.created_by_name && (
            <p>Added by <span className="font-medium text-text-primary">{charger.created_by_name}</span> on {formatDate(charger.created_at)}</p>
          )}
          {charger.updated_by_name && charger.updated_by_name !== charger.created_by_name && (
            <p>Last updated by <span className="font-medium text-text-primary">{charger.updated_by_name}</span> on {formatDate(charger.updated_at)}</p>
          )}
          {!charger.created_by_name && <p>Added on {formatDate(charger.created_at)}</p>}
          <p className="font-mono text-text-secondary/50">ID: {charger.id}</p>
        </section>

        {/* Comments (client interactive) */}
        <CommentsClient chargerId={charger.id} />

      </main>
      <PageFooter />
    </div>
  );
}
