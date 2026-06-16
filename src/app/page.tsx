import type { Metadata } from "next";
import { fetchChargers } from "@/lib/charger-fetch";
import { citySlug } from "@/lib/slug";
import { relativeTimeAgo } from "@/lib/format";
import { LandingPage } from "@/components/landing/landing-page";
import { FAQ_ITEMS } from "@/components/landing/faq-teaser";
import type { Stat } from "@/components/landing/live-stats";
import type { CityEntry } from "@/components/landing/popular-cities";

export const metadata: Metadata = {
  title: "ChargeMap PK — Find EV Chargers Across Pakistan",
  description:
    "The community map of every AC and DC EV charging station in Pakistan. Filter by power, price, and connector, see what's open right now, and plan your route with confidence.",
  alternates: { canonical: "/" },
};

// Major cities to feature; counts are filled from live data when available.
const FEATURED_CITIES = [
  { name: "Karachi", slug: "karachi" },
  { name: "Lahore", slug: "lahore" },
  { name: "Islamabad", slug: "islamabad" },
  { name: "Rawalpindi", slug: "rawalpindi" },
  { name: "Faisalabad", slug: "faisalabad" },
  { name: "Peshawar", slug: "peshawar" },
  { name: "Multan", slug: "multan" },
  { name: "Quetta", slug: "quetta" },
];

export default async function Home() {
  const chargers = await fetchChargers();

  const total = chargers.length;
  const dc = chargers.filter((c) => c.charger_type === "DC").length;
  const available24 = chargers.filter((c) => c.is_available_24hrs).length;
  const distinctCities = new Set(chargers.map((c) => c.city).filter(Boolean)).size;

  // Count chargers per featured city using the same slug logic as detail pages.
  const countBySlug = new Map<string, number>();
  for (const c of chargers) {
    const slug = citySlug(c);
    countBySlug.set(slug, (countBySlug.get(slug) ?? 0) + 1);
  }
  const cities: CityEntry[] = FEATURED_CITIES.map((c) => ({
    ...c,
    count: countBySlug.get(c.slug) ?? 0,
  }));

  // Most recent charger by created_at — drives the "last added" freshness pill.
  const newestTs = chargers.reduce((max, c) => {
    const t = c.created_at ? new Date(c.created_at).getTime() : NaN;
    return !isNaN(t) && t > max ? t : max;
  }, 0);
  const lastAddedLabel = newestTs > 0 ? relativeTimeAgo(new Date(newestTs).toISOString()) : undefined;

  const stats: Stat[] = [
    { value: total, label: "Charging stations", suffix: "+" },
    { value: distinctCities, label: "Cities covered" },
    { value: dc, label: "DC fast chargers" },
    { value: available24, label: "Open 24/7" },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage
        chargerCount={total}
        cityCount={distinctCities}
        stats={stats}
        cities={cities}
        lastAddedLabel={lastAddedLabel}
      />
    </>
  );
}
