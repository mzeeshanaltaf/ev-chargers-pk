"use client";

import dynamic from "next/dynamic";
import type { Charger } from "@/lib/types";

const MapInner = dynamic(() => import("@/components/map/map-inner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-surface-raised animate-pulse flex items-center justify-center">
      <div className="text-text-secondary/40 text-sm">Loading map...</div>
    </div>
  ),
});

interface ChargerMapProps {
  chargers: Charger[];
  selectedCharger: Charger | null;
  onSelectCharger: (charger: Charger) => void;
  onMapRightClick?: (lat: number, lng: number) => void;
}

export function ChargerMap({ chargers, selectedCharger, onSelectCharger, onMapRightClick }: ChargerMapProps) {
  return (
    <div className="w-full h-full relative">
      <MapInner
        chargers={chargers}
        selectedCharger={selectedCharger}
        onSelectCharger={onSelectCharger}
        onMapRightClick={onMapRightClick}
      />
    </div>
  );
}
