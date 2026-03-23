"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from "react-leaflet";
import L from "leaflet";
import { useThemeContext as useTheme } from "@/components/theme-provider";
import type { Charger } from "@/lib/types";
import {
  PAKISTAN_CENTER,
  PAKISTAN_BOUNDS,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  TILE_URLS,
  TILE_ATTRIBUTION,
} from "@/lib/map-constants";
import { ChargerPopup } from "@/components/map/charger-popup";

import "leaflet/dist/leaflet.css";

function createMarkerIcon(isActive: boolean): L.DivIcon {
  const color = isActive ? "#00C853" : "#9E9E9E";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
      <div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z"/></svg>
      </div>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

function ThemeReactiveTileLayer() {
  const { resolvedTheme } = useTheme();
  const tileUrl = resolvedTheme === "dark" ? TILE_URLS.dark : TILE_URLS.light;
  return <TileLayer key={tileUrl} attribution={TILE_ATTRIBUTION} url={tileUrl} />;
}

function FlyToHandler({ selectedCharger }: { selectedCharger: Charger | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCharger) {
      map.flyTo([selectedCharger.latitude, selectedCharger.longitude], 14, { duration: 1 });
    }
  }, [map, selectedCharger]);
  return null;
}

function CustomControls({ chargers }: { chargers: Charger[] }) {
  const map = useMap();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);

  const handleFitAll = useCallback(() => {
    if (chargers.length === 0) {
      map.flyTo(PAKISTAN_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
      return;
    }
    const bounds = L.latLngBounds(chargers.map((c) => [c.latitude, c.longitude]));
    map.flyToBounds(bounds, { padding: [50, 50], duration: 0.8 });
  }, [map, chargers]);

  const handleMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(latlng);
        map.flyTo(latlng, 13, { duration: 1 });
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [map]);

  return (
    <>
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control" style={{ marginTop: 10, marginRight: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="leaflet-bar" style={{ pointerEvents: "auto" }}>
            <a
              href="#"
              role="button"
              title="Fit all chargers"
              aria-label="Fit all chargers"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFitAll(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </a>
          </div>
          <div className="leaflet-bar" style={{ pointerEvents: "auto" }}>
            <a
              href="#"
              role="button"
              title="My location"
              aria-label="My location"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleMyLocation(); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                cursor: "pointer",
                opacity: locating ? 0.5 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {userLocation && (
        <CircleMarker
          center={userLocation}
          radius={8}
          pathOptions={{ color: "#4285F4", fillColor: "#4285F4", fillOpacity: 0.9, weight: 2 }}
        />
      )}
    </>
  );
}

function MapClickHandler({ onMapRightClick }: { onMapRightClick?: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (!onMapRightClick) return;
    const handler = (e: L.LeafletMouseEvent) => {
      onMapRightClick(e.latlng.lat, e.latlng.lng);
    };
    map.on("contextmenu", handler);
    return () => { map.off("contextmenu", handler); };
  }, [map, onMapRightClick]);
  return null;
}

interface MapInnerProps {
  chargers: Charger[];
  selectedCharger: Charger | null;
  onSelectCharger: (charger: Charger) => void;
  onMapRightClick?: (lat: number, lng: number) => void;
}

export default function MapInner({
  chargers,
  selectedCharger,
  onSelectCharger,
  onMapRightClick,
}: MapInnerProps) {
  const activeIcon = useMemo(() => createMarkerIcon(true), []);
  const inactiveIcon = useMemo(() => createMarkerIcon(false), []);
  const mapRef = useRef<L.Map | null>(null);

  return (
    <MapContainer
      center={PAKISTAN_CENTER}
      zoom={DEFAULT_ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxBounds={PAKISTAN_BOUNDS}
      maxBoundsViscosity={1.0}
      className="w-full h-full z-0"
      ref={mapRef}
    >
      <ThemeReactiveTileLayer />
      <FlyToHandler selectedCharger={selectedCharger} />
      <MapClickHandler onMapRightClick={onMapRightClick} />
      <CustomControls chargers={chargers} />

      {chargers.map((charger) => (
        <Marker
          key={charger.id}
          position={[charger.latitude, charger.longitude]}
          icon={charger.is_open ? activeIcon : inactiveIcon}
          eventHandlers={{
            click: () => onSelectCharger(charger),
            mouseover: (e) => e.target.openPopup(),
            mouseout: (e) => e.target.closePopup(),
          }}
        >
          <Popup>
            <ChargerPopup charger={charger} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
