import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Map — EV Chargers in Pakistan",
  description:
    "Find EV charging stations across Pakistan — interactive map with filters by province, city, charger type (AC/DC), power output, cost, and 24-hour availability.",
  alternates: { canonical: "/map" },
};

export default function MapPage() {
  return (
    <>
      <h1 className="sr-only">EV Charging Stations in Pakistan</h1>
      <p className="sr-only">
        ChargeMap PK is Pakistan&apos;s community-driven directory of electric vehicle
        charging stations. Browse AC and DC chargers by province, city, and location type.
        View pricing, operating hours, and directions for every station.
      </p>
      <AppShell />
    </>
  );
}
