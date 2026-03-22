"use client";

interface ChargerCountProps {
  filtered: number;
  total: number;
}

export function ChargerCount({ filtered, total }: ChargerCountProps) {
  return (
    <div className="px-4 py-2.5 flex items-center justify-between">
      <span className="text-sm text-text-secondary">
        <span className="font-semibold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
          {filtered}
        </span>
        {filtered !== total && (
          <span className="text-text-secondary"> of {total}</span>
        )}
        {" "}charger{total !== 1 ? "s" : ""}
      </span>
    </div>
  );
}
