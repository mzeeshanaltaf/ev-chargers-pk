"use client";

import { LightningIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-raised flex items-center justify-center mb-4 border border-border">
        <LightningIcon className="w-8 h-8 text-text-secondary/40" />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        No chargers found
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        {hasActiveFilters
          ? "Try adjusting your filters to find chargers"
          : "No EV chargers are available yet"}
      </p>
      {hasActiveFilters && (
        <Button variant="secondary" size="sm" onClick={onClearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
