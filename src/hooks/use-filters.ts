"use client";

import { useState, useMemo, useCallback } from "react";
import type { Charger, FilterState } from "@/lib/types";

const defaultFilters: FilterState = {
  province: null,
  city: null,
  costRange: null,
  minPower: null,
  is24hrs: null,
  locationType: null,
  chargerType: null,
  isOpen: null,
};

export function useFilters(chargers: Charger[]) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const availableProvinces = useMemo(() => {
    const set = new Set(chargers.map((c) => c.province_territory));
    return Array.from(set).sort();
  }, [chargers]);

  const availableCities = useMemo(() => {
    const filtered = filters.province
      ? chargers.filter((c) => c.province_territory === filters.province)
      : chargers;
    const set = new Set(filtered.map((c) => c.city));
    return Array.from(set).sort();
  }, [chargers, filters.province]);

  const availableLocationTypes = useMemo(() => {
    const set = new Set(chargers.map((c) => c.location_type));
    return Array.from(set).sort();
  }, [chargers]);

  const costBounds = useMemo((): [number, number] => {
    // Reduce instead of Math.min(...costs) — spreading a large array risks a
    // call-stack overflow. Skip non-finite costs from upstream.
    let min = Infinity;
    let max = -Infinity;
    for (const c of chargers) {
      const cost = c.cost_per_kwh;
      if (!Number.isFinite(cost)) continue;
      if (cost < min) min = cost;
      if (cost > max) max = cost;
    }
    if (min === Infinity) return [0, 200];
    return [Math.floor(min), Math.ceil(max)];
  }, [chargers]);

  const filteredChargers = useMemo(() => {
    return chargers.filter((c) => {
      if (filters.province && c.province_territory !== filters.province) return false;
      if (filters.city && c.city !== filters.city) return false;
      if (filters.locationType && c.location_type !== filters.locationType) return false;
      if (filters.chargerType && c.charger_type !== filters.chargerType) return false;
      if (filters.is24hrs !== null && c.is_available_24hrs !== filters.is24hrs) return false;
      if (filters.isOpen !== null && c.is_open !== filters.isOpen) return false;
      if (filters.minPower !== null && c.power_kw < filters.minPower) return false;
      if (filters.costRange) {
        if (c.cost_per_kwh < filters.costRange[0] || c.cost_per_kwh > filters.costRange[1]) return false;
      }
      return true;
    });
  }, [chargers, filters]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      // Reset city when province changes
      if (key === "province") next.city = null;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters(defaultFilters), []);

  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  return {
    filters,
    filteredChargers,
    availableProvinces,
    availableCities,
    availableLocationTypes,
    costBounds,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}
