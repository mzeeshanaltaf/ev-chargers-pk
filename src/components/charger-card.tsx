"use client";

import { motion } from "framer-motion";
import type { Charger } from "@/lib/types";
import { formatPower, formatCost } from "@/lib/format";
import { Badge24hr, ActiveBadge, LocationTypeBadge } from "@/components/badges";
import { LightningIcon, MapPinIcon } from "@/components/icons";

interface ChargerCardProps {
  charger: Charger;
  isSelected: boolean;
  onSelect: (charger: Charger) => void;
  index: number;
}

export function ChargerCard({ charger, isSelected, onSelect, index }: ChargerCardProps) {
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

      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <LightningIcon className="w-4 h-4 text-brand" fill="currentColor" />
          <span className="text-lg font-bold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
            {formatPower(charger.power_kw)}
            <span className="text-sm font-normal text-text-secondary ml-1">kW</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {charger.is_available_24hrs && <Badge24hr />}
          <ActiveBadge isActive={charger.is_active} />
        </div>
      </div>

      <p className="text-sm text-text-primary mb-1 line-clamp-2 leading-snug">
        {charger.address}
      </p>

      <div className="flex items-center gap-1.5 mb-3">
        <MapPinIcon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
        <span className="text-xs text-text-secondary">
          {charger.city}, {charger.province_territory}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-brand tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
          {formatCost(charger.cost_per_kwh)}
          <span className="text-xs font-normal text-text-secondary">/kWh</span>
        </span>
        <LocationTypeBadge type={charger.location_type} />
      </div>
    </motion.div>
  );
}
