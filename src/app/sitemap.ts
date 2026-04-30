import type { MetadataRoute } from "next";
import { fetchChargers } from "@/lib/charger-fetch";
import { chargerCanonicalPath, citySlug } from "@/lib/slug";

const BASE = "https://chargemap-pk.zeeshanai.cloud";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const chargers = await fetchChargers();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/stats`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE}/credits`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // City index pages
  const cityMap = new Map<string, Date>();
  for (const c of chargers) {
    const slug = citySlug(c);
    const updatedAt = new Date(c.updated_at);
    const existing = cityMap.get(slug);
    if (!existing || updatedAt > existing) cityMap.set(slug, updatedAt);
  }
  const cityPages: MetadataRoute.Sitemap = Array.from(cityMap.entries()).map(([slug, lastMod]) => ({
    url: `${BASE}/chargers/${slug}`,
    lastModified: lastMod,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Individual charger pages
  const chargerPages: MetadataRoute.Sitemap = chargers.map((c) => ({
    url: `${BASE}${chargerCanonicalPath(c)}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...cityPages, ...chargerPages];
}
