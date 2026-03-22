"use client";

import { useState, useCallback } from "react";
import { useChargers } from "@/hooks/use-chargers";
import { useFilters } from "@/hooks/use-filters";
import { useToast } from "@/hooks/use-toast";
import type { Charger, ChargerInsertPayload } from "@/lib/types";
import { Header } from "@/components/header";
import { FilterBar } from "@/components/filters/filter-bar";
import { ChargerList } from "@/components/charger-list";
import { ChargerMap } from "@/components/map/charger-map";
import { AddChargerButton } from "@/components/add-charger/add-charger-button";
import { AddChargerModal } from "@/components/add-charger/add-charger-modal";
import { ToastContainer } from "@/components/ui/toast";
import { SidebarSkeleton } from "@/components/loading-skeleton";

export function AppShell() {
  const { chargers, isLoading, addCharger } = useChargers();
  const {
    filters,
    filteredChargers,
    availableProvinces,
    availableCities,
    availableLocationTypes,
    costBounds,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  } = useFilters(chargers);
  const { toasts, showToast, dismissToast } = useToast();

  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitial, setAddModalInitial] = useState<{
    lat?: string;
    lng?: string;
    address?: string;
  }>({});

  const handleSelectCharger = useCallback((charger: Charger) => {
    setSelectedCharger(charger);
  }, []);

  const handleMapRightClick = useCallback((lat: number, lng: number) => {
    setAddModalInitial({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    setIsAddModalOpen(true);
  }, []);

  const handleAddCharger = useCallback(
    async (payload: Omit<ChargerInsertPayload, "event_type">) => {
      const result = await addCharger(payload);
      setIsAddModalOpen(false);
      setAddModalInitial({});
      showToast("Charger added successfully!");
      if (result && result[0]) {
        setSelectedCharger(result[0]);
      }
    },
    [addCharger, showToast]
  );

  const handleOpenAddModal = useCallback(() => {
    setAddModalInitial({});
    setIsAddModalOpen(true);
  }, []);

  return (
    <div className="app-shell flex flex-col h-screen bg-surface">
      <Header
        isSidebarVisible={sidebarVisible}
        onToggleSidebar={() => setSidebarVisible((v) => !v)}
      />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className={`${sidebarVisible ? "hidden md:flex" : "hidden"} flex-col w-[400px] min-w-[360px] border-r border-border bg-surface transition-all`}>
          <FilterBar
            filters={filters}
            availableProvinces={availableProvinces}
            availableCities={availableCities}
            availableLocationTypes={availableLocationTypes}
            costBounds={costBounds}
            onUpdateFilter={updateFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
          {isLoading ? (
            <SidebarSkeleton />
          ) : (
            <ChargerList
              chargers={filteredChargers}
              selectedId={selectedCharger?.id || null}
              onSelectCharger={handleSelectCharger}
              totalCount={chargers.length}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <ChargerMap
            chargers={filteredChargers}
            selectedCharger={selectedCharger}
            onSelectCharger={handleSelectCharger}
            onMapRightClick={handleMapRightClick}
          />
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[400] bg-surface rounded-t-2xl border-t border-border shadow-2xl max-h-[60vh] overflow-y-auto">
        <div className="flex justify-center py-2">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>
        <FilterBar
          filters={filters}
          availableProvinces={availableProvinces}
          availableCities={availableCities}
          availableLocationTypes={availableLocationTypes}
          costBounds={costBounds}
          onUpdateFilter={updateFilter}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <ChargerList
            chargers={filteredChargers}
            selectedId={selectedCharger?.id || null}
            onSelectCharger={handleSelectCharger}
            totalCount={chargers.length}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}
      </div>

      <AddChargerButton onClick={handleOpenAddModal} />

      <AddChargerModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setAddModalInitial({}); }}
        onSubmit={handleAddCharger}
        initialLat={addModalInitial.lat}
        initialLng={addModalInitial.lng}
        initialAddress={addModalInitial.address}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
