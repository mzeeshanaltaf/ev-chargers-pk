"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useThemeContext as useTheme } from "@/components/theme-provider";
import {
  PAKISTAN_CENTER,
  PAKISTAN_BOUNDS,
  MIN_ZOOM,
  MAX_ZOOM,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from "@/lib/map-constants";

import "leaflet/dist/leaflet.css";

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: string, lng: string) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
    },
  });
  return null;
}

function FlyToMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 12, { duration: 0.5 });
    }
  }, [map, lat, lng]);
  return null;
}

function TileLayerThemed() {
  const { resolvedTheme } = useTheme();
  return <TileLayer attribution={TILE_ATTRIBUTION} url={resolvedTheme === "dark" ? TILE_URLS.dark : TILE_URLS.light} />;
}

interface LocationPickerMapProps {
  latitude: string;
  longitude: string;
  onLocationChange: (lat: string, lng: string) => void;
}

export default function LocationPickerMap({ latitude, longitude, onLocationChange }: LocationPickerMapProps) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const hasPosition = !isNaN(lat) && !isNaN(lng);

  const markerIcon = useMemo(() => L.divIcon({
    className: "custom-marker",
    html: `<div style="width:24px;height:24px;border-radius:50%;background:#00C853;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  }), []);

  return (
    <MapContainer
      center={hasPosition ? [lat, lng] : PAKISTAN_CENTER}
      zoom={hasPosition ? 12 : 6}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={PAKISTAN_BOUNDS}
      maxBoundsViscosity={1.0}
      className="w-full h-full z-0"
    >
      <TileLayerThemed />
      <ClickHandler onLocationChange={onLocationChange} />
      {hasPosition && (
        <>
          <Marker position={[lat, lng]} icon={markerIcon} />
          <FlyToMarker lat={lat} lng={lng} />
        </>
      )}
    </MapContainer>
  );
}
