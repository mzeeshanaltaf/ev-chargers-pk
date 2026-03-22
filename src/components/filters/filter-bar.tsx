"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FilterState } from "@/lib/types";
import { FilterIcon, ChevronDownIcon } from "@/components/icons";
import { SelectFilter } from "@/components/filters/select-filter";
import { RangeSlider } from "@/components/filters/range-slider";
import { ToggleFilter } from "@/components/filters/toggle-filter";
import { FilterChip } from "@/components/filters/filter-chip";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  filters: FilterState;
  availableProvinces: string[];
  availableCities: string[];
  availableLocationTypes: string[];
  costBounds: [number, number];
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  filters,
  availableProvinces,
  availableCities,
  availableLocationTypes,
  costBounds,
  onUpdateFilter,
  onClearFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (filters.province) activeChips.push({ label: filters.province, onRemove: () => onUpdateFilter("province", null) });
  if (filters.city) activeChips.push({ label: filters.city, onRemove: () => onUpdateFilter("city", null) });
  if (filters.locationType) activeChips.push({ label: filters.locationType, onRemove: () => onUpdateFilter("locationType", null) });
  if (filters.costRange) activeChips.push({ label: `PKR ${filters.costRange[0]}-${filters.costRange[1]}`, onRemove: () => onUpdateFilter("costRange", null) });
  if (filters.is24hrs !== null) activeChips.push({ label: filters.is24hrs ? "24hr Only" : "Not 24hr", onRemove: () => onUpdateFilter("is24hrs", null) });
  if (filters.isActive !== null) activeChips.push({ label: filters.isActive ? "Active Only" : "Inactive Only", onRemove: () => onUpdateFilter("isActive", null) });
  if (filters.minPower !== null) activeChips.push({ label: `${filters.minPower}+ kW`, onRemove: () => onUpdateFilter("minPower", null) });

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-3 hover:bg-surface-raised transition-colors"
      >
        <div className="flex items-center gap-2">
          <FilterIcon className="w-4 h-4 text-text-secondary" />
          <span className="text-sm font-medium text-text-primary">Filters</span>
          {hasActiveFilters && (
            <span className="w-5 h-5 rounded-full bg-brand text-white text-xs flex items-center justify-center font-medium">
              {activeChips.length}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <SelectFilter
                label="Province"
                value={filters.province}
                options={availableProvinces}
                onChange={(v) => onUpdateFilter("province", v)}
                placeholder="All Provinces"
              />
              <SelectFilter
                label="City"
                value={filters.city}
                options={availableCities}
                onChange={(v) => onUpdateFilter("city", v)}
                placeholder="All Cities"
              />
              <SelectFilter
                label="Location Type"
                value={filters.locationType}
                options={availableLocationTypes}
                onChange={(v) => onUpdateFilter("locationType", v)}
                placeholder="All Types"
              />
              <RangeSlider
                label="Cost (PKR/kWh)"
                min={costBounds[0]}
                max={costBounds[1]}
                value={filters.costRange}
                onChange={(v) => onUpdateFilter("costRange", v)}
              />
              <ToggleFilter
                label="24hr Available"
                value={filters.is24hrs}
                onChange={(v) => onUpdateFilter("is24hrs", v)}
              />
              <ToggleFilter
                label="Active Status"
                value={filters.isActive}
                onChange={(v) => onUpdateFilter("isActive", v)}
              />

              {hasActiveFilters && (
                <div className="pt-2 space-y-3">
                  <div className="flex flex-wrap gap-1.5">
                    {activeChips.map((chip) => (
                      <FilterChip key={chip.label} label={chip.label} onRemove={chip.onRemove} />
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={onClearFilters} className="w-full">
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
