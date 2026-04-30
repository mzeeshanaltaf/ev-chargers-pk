import type { Metadata } from "next";
import { StatsClient } from "./stats-client";

export const metadata: Metadata = {
  title: "Charger Statistics",
  description:
    "Live statistics for EV charging stations across Pakistan — total chargers, AC vs DC split, 24-hour availability, and breakdowns by province and location type.",
  alternates: { canonical: "/stats" },
};

export default function StatsPage() {
  return <StatsClient />;
}
