"use client";

import useSWR from "swr";
import type { Charger, ChargerInsertPayload } from "@/lib/types";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch chargers");
    return r.json();
  });

export function useChargers() {
  const { data, error, isLoading, mutate } = useSWR<Charger[]>(
    "/api/chargers",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );

  async function addCharger(
    payload: Omit<ChargerInsertPayload, "event_type">
  ) {
    const res = await fetch("/api/chargers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to add charger");
    const newChargers: Charger[] = await res.json();
    mutate(
      (current) => [...(current || []), ...newChargers],
      { revalidate: true }
    );
    return newChargers;
  }

  async function updateCharger(
    id: string,
    payload: Omit<ChargerInsertPayload, "event_type">
  ) {
    const res = await fetch("/api/chargers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    if (!res.ok) throw new Error("Failed to update charger");
    await mutate();
  }

  async function deleteCharger(id: string) {
    const res = await fetch("/api/chargers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Failed to delete charger");
    mutate((current) => (current || []).filter((c) => c.id !== id), { revalidate: false });
  }

  return { chargers: data || [], error, isLoading, addCharger, updateCharger, deleteCharger, mutate };
}
