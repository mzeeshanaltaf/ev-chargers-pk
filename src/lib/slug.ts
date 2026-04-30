import type { Charger } from "@/lib/types";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "")   // keep alphanumeric, spaces, hyphens
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function citySlug(charger: Charger): string {
  return slugify(charger.city) || "pakistan";
}

export function chargerSlug(charger: Charger): string {
  const base = slugify(charger.address) || slugify(charger.city);
  const suffix = charger.id.slice(-5).toLowerCase();
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
