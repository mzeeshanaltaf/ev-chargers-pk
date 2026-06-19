import type { Charger } from "@/lib/types";

// Length of the trailing id fragment appended to charger slugs for uniqueness.
// 8 hex chars (~4 billion space) makes birthday collisions negligible at the
// scale this directory will reach. Lookups match by `endsWith` so older 5-char
// links keep resolving (see findChargerByIdSuffix).
export const ID_SUFFIX_LEN = 8;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/[^a-z0-9\s-]/g, "")    // keep alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function citySlug(charger: Charger): string {
  return slugify(charger.city) || "pakistan";
}

export function chargerSlug(charger: Charger): string {
  const base = slugify(charger.address) || slugify(charger.city);
  const suffix = charger.id.slice(-ID_SUFFIX_LEN).toLowerCase();
  return `${base}-${suffix}`;
}

export function chargerCanonicalPath(charger: Charger): string {
  return `/chargers/${citySlug(charger)}/${chargerSlug(charger)}`;
}

export function cityDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
