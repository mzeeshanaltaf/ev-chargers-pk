"use client";

import type { Charger } from "@/lib/types";
import { formatPower, formatCost, formatPhone } from "@/lib/format";

interface ChargerPopupProps {
  charger: Charger;
}

export function ChargerPopup({ charger }: ChargerPopupProps) {
  return (
    <div className="min-w-[200px] p-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base font-bold tabular-nums">
          {formatPower(charger.power_kw)} kW
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
          charger.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {charger.is_active ? "Active" : "Inactive"}
        </span>
      </div>
      <p className="text-sm mb-1 leading-snug">{charger.address}</p>
      <p className="text-xs text-gray-500 mb-2">{charger.city}, {charger.province_territory}</p>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-green-600">{formatCost(charger.cost_per_kwh)}/kWh</span>
        {charger.is_available_24hrs && (
          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">24HR</span>
        )}
      </div>
      {charger.phone_number && (
        <p className="text-xs text-gray-500 mt-1">{formatPhone(charger.phone_number)}</p>
      )}
    </div>
  );
}
