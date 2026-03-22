"use client";

import { ClockIcon } from "@/components/icons";

export function Badge24hr() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-brand/15 text-brand">
      <ClockIcon className="w-3 h-3" />
      24HR
    </span>
  );
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
      isActive
        ? "bg-brand/15 text-brand"
        : "bg-danger/15 text-danger"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-brand" : "bg-danger"}`} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export function LocationTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-raised text-text-secondary border border-border">
      {type}
    </span>
  );
}
