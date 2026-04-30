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

export function findChargerByIdSuffix(chargers: Charger[], suffix: string): Charger | undefined {
  return chargers.find((c) => c.id.slice(-5).toLowerCase() === suffix.toLowerCase());
}
