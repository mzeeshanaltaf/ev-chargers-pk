"use client";

import { useState, useCallback, useRef } from "react";
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
import { EditChargerModal } from "@/components/edit-charger/edit-charger-modal";
import { ToastContainer } from "@/components/ui/toast";
import { SidebarSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/components/auth-provider";

export function AppShell() {
  const { isAuthenticated } = useAuth();
  const { chargers, isLoading, addCharger, updateCharger, deleteCharger } = useChargers();
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
  const [editingCharger, setEditingCharger] = useState<Charger | null>(null);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const [addModalInitial, setAddModalInitial] = useState<{
    lat?: string;
    lng?: string;
    address?: string;
  }>({});

  const handleSelectCharger = useCallback((charger: Charger) => {
    setSelectedCharger(charger);
  }, []);

  const handleMapRightClick = useCallback((lat: number, lng: number) => {
    if (!isAuthenticated) return;
    setAddModalInitial({ lat: lat.toFixed(6), lng: lng.toFixed(6) });
    setIsAddModalOpen(true);
  }, [isAuthenticated]);

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

  const handleUpdateCharger = useCallback(
    async (id: string, payload: Omit<ChargerInsertPayload, "event_type">) => {
      await updateCharger(id, payload);
      setEditingCharger(null);
      showToast("Charger updated successfully!");
    },
    [updateCharger, showToast]
  );

  const handleDeleteCharger = useCallback(
    async (charger: Charger) => {
      await deleteCharger(charger.id);
      if (selectedCharger?.id === charger.id) setSelectedCharger(null);
      showToast("Charger deleted.");
    },
    [deleteCharger, selectedCharger, showToast]
  );

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
              onEditCharger={isAuthenticated ? setEditingCharger : undefined}
              onDeleteCharger={undefined}
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
            sidebarVisible={sidebarVisible}
          />
        </div>
      </div>

      {/* Mobile bottom sheet — collapsed by default, tap handle to expand */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[400] bg-surface rounded-t-2xl border-t border-border shadow-2xl transition-[max-height] duration-300 ease-in-out ${mobileSheetOpen ? "max-h-[70vh]" : "max-h-12"} overflow-hidden`}
      >
        {/* Drag handle / toggle */}
        <button
          type="button"
          aria-label={mobileSheetOpen ? "Collapse panel" : "Expand panel"}
          className="w-full flex flex-col items-center py-2 cursor-pointer"
          onClick={() => setMobileSheetOpen((v) => !v)}
          onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
          onTouchEnd={(e) => {
            if (touchStartY.current === null) return;
            const delta = e.changedTouches[0].clientY - touchStartY.current;
            if (delta < -30) setMobileSheetOpen(true);
            if (delta > 30) setMobileSheetOpen(false);
            touchStartY.current = null;
          }}
        >
          <div className="w-10 h-1 rounded-full bg-border" />
          <span className="text-[10px] text-text-secondary mt-1">
            {mobileSheetOpen ? "Swipe down to close" : `${filteredChargers.length} chargers — tap to view`}
          </span>
        </button>

        {/* Content only rendered when open to avoid scroll issues */}
        {mobileSheetOpen && (
          <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 3rem)" }}>
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
                onSelectCharger={(charger) => {
                  handleSelectCharger(charger);
                  setMobileSheetOpen(false);
                }}
                totalCount={chargers.length}
                onClearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                onEditCharger={isAuthenticated ? setEditingCharger : undefined}
                onDeleteCharger={undefined}
              />
            )}
          </div>
        )}
      </div>

      {isAuthenticated && <AddChargerButton onClick={handleOpenAddModal} />}

      <AddChargerModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setAddModalInitial({}); }}
        onSubmit={handleAddCharger}
        initialLat={addModalInitial.lat}
        initialLng={addModalInitial.lng}
        initialAddress={addModalInitial.address}
      />

      <EditChargerModal
        charger={editingCharger}
        onClose={() => setEditingCharger(null)}
        onSubmit={handleUpdateCharger}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
