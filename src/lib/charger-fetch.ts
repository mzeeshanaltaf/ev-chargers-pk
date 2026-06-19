import type { Charger } from "@/lib/types";

export async function fetchChargers(): Promise<Charger[]> {
  const url = process.env.N8N_WEBHOOK_URL;
  const key = process.env.N8N_API_KEY;
  if (!url || !key) return [];

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": key },
      body: JSON.stringify({ event_type: "get_ev_chargers" }),
      next: { revalidate: 300 }, // cache 5 min for sitemap / OG generators
    });
    if (!res.ok) return [];
    const data = await res.json();
    const result = data?.[0]?.result;
    if (result) {
      return [
        ...(result.open ?? []).map((c: object) => ({ ...c, is_open: true })),
        ...(result.closed ?? []).map((c: object) => ({ ...c, is_open: false })),
      ] as Charger[];
    }
    return Array.isArray(data) ? (data as Charger[]) : [];
  } catch {
    return [];
  }
}

// Match by `endsWith` rather than a fixed slice so both current 8-char slugs
// and older 5-char links resolve to the same charger.
export function findChargerByIdSuffix(chargers: Charger[], suffix: string): Charger | undefined {
  const s = suffix.toLowerCase();
  if (!s) return undefined;
  return chargers.find((c) => c.id.toLowerCase().endsWith(s));
}
