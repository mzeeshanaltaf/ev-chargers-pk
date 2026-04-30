import { redirect, notFound } from "next/navigation";
import { fetchChargers } from "@/lib/charger-fetch";
import { chargerCanonicalPath } from "@/lib/slug";

export default async function LegacyChargerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chargers = await fetchChargers();
  const charger = chargers.find((c) => c.id === id);

  if (!charger) notFound();

  redirect(chargerCanonicalPath(charger));
}
