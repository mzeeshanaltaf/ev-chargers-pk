"use client";

import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(
  () => import("@/components/add-charger/location-picker-map"),
  { ssr: false, loading: () => <div className="w-full h-48 rounded-lg bg-surface-raised animate-pulse" /> }
);

interface LocationPickerProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">
        Location (click map to set)
      </label>
      <div className="w-full h-48 rounded-lg overflow-hidden border border-border">
        <LocationPickerMap
          latitude={latitude}
          longitude={longitude}
          onLocationChange={onLocationChange}
        />
      </div>
      <div className="flex gap-2 text-xs text-text-secondary">
        <span>Lat: {latitude || "—"}</span>
        <span>Lng: {longitude || "—"}</span>
      </div>
    </div>
  );
}
