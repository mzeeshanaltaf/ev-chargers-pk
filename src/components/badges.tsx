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
      {isActive ? "Open" : "Closed"}
    </span>
  );
}

export function ChargerTypeBadge({ type }: { type: string }) {
  const isDC = type === "DC";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
      isDC ? "bg-brand/15 text-brand" : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
    }`}>
      {isDC ? (
        /* DC symbol: two horizontal lines */
        <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 8" fill="currentColor">
          <rect x="0" y="1" width="12" height="1.5" rx="0.75" />
          <rect x="0" y="5.5" width="5" height="1.5" rx="0.75" />
          <rect x="7" y="5.5" width="5" height="1.5" rx="0.75" />
        </svg>
      ) : (
        /* AC symbol: sine wave ~ */
         <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 8" fill="none"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 4 C3 1.5 5 1.5 6 4 S9 6.5 11 4" />
          </svg>
      )}
      {type}
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
