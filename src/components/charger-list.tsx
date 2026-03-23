"use client";

import type { Charger } from "@/lib/types";
import { ChargerCard } from "@/components/charger-card";
import { ChargerCount } from "@/components/charger-count";
import { EmptyState } from "@/components/empty-state";

interface ChargerListProps {
  chargers: Charger[];
  selectedId: string | null;
  onSelectCharger: (charger: Charger) => void;
  totalCount: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  onEditCharger?: (charger: Charger) => void;
  onDeleteCharger?: (charger: Charger) => void;
}

export function ChargerList({
  chargers,
  selectedId,
  onSelectCharger,
  totalCount,
  onClearFilters,
  hasActiveFilters,
  onEditCharger,
  onDeleteCharger,
}: ChargerListProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChargerCount filtered={chargers.length} total={totalCount} />
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-thin">
        {chargers.length === 0 ? (
          <EmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={onClearFilters}
          />
        ) : (
          chargers.map((charger, i) => (
            <ChargerCard
              key={charger.id}
              charger={charger}
              isSelected={selectedId === charger.id}
              onSelect={onSelectCharger}
              index={i}
              onEdit={onEditCharger ? () => onEditCharger(charger) : undefined}
              onDelete={onDeleteCharger ? () => onDeleteCharger(charger) : undefined}
            />
          ))
        )}
      </div>
    </div>
  );
}
