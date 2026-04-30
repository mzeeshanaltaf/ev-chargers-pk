"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Charger } from "@/lib/types";
import { chargerCanonicalPath } from "@/lib/slug";
import { formatPower, formatCost, formatDayHours, formatPhone } from "@/lib/format";
import { Badge24hr, ActiveBadge, ChargerTypeBadge, LocationTypeBadge } from "@/components/badges";
import { LightningIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

function MapsButton({ charger }: { charger: Charger }) {
  return (
    <a
      href={`https://www.google.com/maps?q=${charger.latitude},${charger.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title="Open in Google Maps"
      className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      Maps
    </a>
  );
}

interface ChargerCardProps {
  charger: Charger;
  isSelected: boolean;
  onSelect: (charger: Charger) => void;
  index: number;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ChargerCard({ charger, isSelected, onSelect, index, onEdit, onDelete }: ChargerCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const shortId = charger.id.slice(-5).toUpperCase();
  const oh = charger.opening_hours;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={() => onSelect(charger)}
      className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
        isSelected
          ? "border-brand bg-brand/5 shadow-md shadow-brand/10"
          : "border-border bg-surface-raised hover:border-brand/50 hover:shadow-md"
      }`}
    >
      {isSelected && (
        <div className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-brand" />
      )}

      {/* Inline delete confirmation overlay */}
      {confirmDelete && (
        <div className="absolute inset-0 z-10 rounded-xl bg-surface-raised/95 flex flex-col items-center justify-center gap-3 p-4">
          <p className="text-sm font-medium text-text-primary text-center">Delete this charger?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border text-text-secondary hover:bg-border/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-danger text-white hover:bg-danger/90 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <LightningIcon className="w-4 h-4 text-brand" fill="currentColor" />
          <span className="text-lg font-bold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
            {formatPower(charger.power_kw)}
            <span className="text-sm font-normal text-text-secondary ml-1">kW</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ChargerTypeBadge type={charger.charger_type} />
          {charger.is_available_24hrs && <Badge24hr />}
          <ActiveBadge isActive={charger.is_open} />
          {(onEdit || onDelete) && (
            <div className="flex items-center gap-0.5 ml-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                  title="Edit charger"
                  className="p-1 rounded text-text-secondary hover:text-brand hover:bg-brand/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                  title="Delete charger"
                  className="p-1 rounded text-text-secondary hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-text-primary mb-1 line-clamp-2 leading-snug">
        {charger.address}
      </p>

      <div className="flex items-center gap-1.5 mb-1">
        <MapPinIcon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
        <span className="text-xs text-text-secondary">
          {charger.city}, {charger.province_territory}
        </span>
      </div>

      {charger.phone_number && (
        <div className="flex items-center gap-1.5 mb-3">
          <PhoneIcon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
          <span className="text-xs text-text-secondary">{formatPhone(charger.phone_number)}</span>
        </div>
      )}
      {!charger.phone_number && <div className="mb-3" />}

      {/* Opening hours for non-24hr chargers */}
      {!charger.is_available_24hrs && oh && (
        <div className="text-xs text-text-secondary mb-2 space-y-0.5">
          {[
            { label: "Weekdays", key: "weekday" as const },
            { label: "Friday", key: "friday" as const },
            { label: "Weekend", key: "weekend" as const },
          ].map(({ label, key }) => {
            const hours = formatDayHours(oh[key]);
            return hours ? (
              <div key={key} className="flex justify-between gap-2">
                <span className="font-medium shrink-0">{label}:</span>
                <span className={oh[key]?.closed ? "text-danger" : ""}>{hours}</span>
              </div>
            ) : null;
          })}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-brand tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
            {formatCost(charger.cost_per_kwh)}/kWh
          </span>
          {charger.cost_per_kwh_peak != null && (
            <span className="text-xs font-semibold text-amber-500 tabular-nums">
              {formatCost(charger.cost_per_kwh_peak)}/kWh (Peak hours)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <MapsButton charger={charger} />
          <LocationTypeBadge type={charger.location_type} />
        </div>
      </div>

      {charger.notes && (
        <div className="flex items-start gap-1.5 mt-2">
          <svg className="w-3.5 h-3.5 text-text-secondary shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p className="text-xs text-text-secondary italic line-clamp-2">{charger.notes}</p>
        </div>
      )}

      <div className="flex justify-end mt-2">
        <Link
          href={chargerCanonicalPath(charger)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`View full details for ${charger.address}`}
          className="text-xs text-text-secondary/40 hover:text-brand transition-colors hover:underline underline-offset-2"
        >
          View Full Details
        </Link>
      </div>
    </motion.div>
  );
}
