"use client";

import { XIcon } from "@/components/icons";

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-brand/15 text-brand border border-brand/25">
      {label}
      <button
        onClick={onRemove}
        className="p-0.5 rounded hover:bg-brand/20 transition-colors"
      >
        <XIcon className="w-3 h-3" />
      </button>
    </span>
  );
}
