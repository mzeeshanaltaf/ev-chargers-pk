"use client";

import type { Charger } from "@/lib/types";
import { formatPower, formatCost, formatPhone, formatDayHours } from "@/lib/format";
import { chargerCanonicalPath } from "@/lib/slug";

interface ChargerPopupProps {
  charger: Charger;
}

function MapsButton({ charger }: { charger: Charger }) {
  return (
    <a
      href={`https://www.google.com/maps?q=${charger.latitude},${charger.longitude}`}
      target="_blank"
      rel="noopener noreferrer"
      title="Open in Google Maps"
      className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors"
    >
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      Maps
    </a>
  );
}

export function ChargerPopup({ charger }: ChargerPopupProps) {
  const oh = charger.opening_hours;
  const shortId = charger.id.slice(-5).toUpperCase();

  return (
    <div className="min-w-[200px] p-1">
      {/* Header: power + charger type + Open/Closed + 24HR */}
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-base font-bold tabular-nums">
          {formatPower(charger.power_kw)} kW
        </span>
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${
          charger.charger_type === "DC" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700"
        }`}>
          {charger.charger_type === "DC" ? (
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 8" fill="currentColor">
              <rect x="0" y="1" width="12" height="1.5" rx="0.75" />
              <rect x="0" y="5.5" width="5" height="1.5" rx="0.75" />
              <rect x="7" y="5.5" width="5" height="1.5" rx="0.75" />
            </svg>
          ) : (
             <svg className="w-3 h-3 shrink-0" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 4 C3 1.5 5 1.5 6 4 S9 6.5 11 4" />
             </svg>
          )}
          {charger.charger_type}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
          charger.is_open ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {charger.is_open ? "Open" : "Closed"}
        </span>
        {charger.is_available_24hrs && (
          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">24HR</span>
        )}
      </div>

      {/* Address */}
      <p className="text-sm mb-1 leading-snug">{charger.address}</p>

      {/* City / Province */}
      <p className="text-xs text-gray-500 mb-1">{charger.city}, {charger.province_territory}</p>

      {/* Phone */}
      {charger.phone_number && (
        <div className="flex items-center gap-1 mb-2">
          <svg className="w-3 h-3 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="text-xs text-gray-500">{formatPhone(charger.phone_number)}</span>
        </div>
      )}

      {/* Cost */}
      <div className="flex flex-col gap-0.5 mb-1">
        <span className="text-xs font-semibold text-green-600">{formatCost(charger.cost_per_kwh)}/kWh</span>
        {charger.cost_per_kwh_peak != null && (
          <span className="text-xs font-semibold text-amber-500">{formatCost(charger.cost_per_kwh_peak)}/kWh (Peak hours)</span>
        )}
      </div>

      {/* Opening hours */}
      {!charger.is_available_24hrs && oh && (
        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
          {[
            { label: "Weekdays", key: "weekday" as const },
            { label: "Friday", key: "friday" as const },
            { label: "Weekend", key: "weekend" as const },
          ].map(({ label, key }) => {
            const hours = formatDayHours(oh[key]);
            return hours ? (
              <div key={key} className="flex justify-between gap-3">
                <span className="font-medium shrink-0">{label}:</span>
                <span className={oh[key]?.closed ? "text-red-500" : ""}>{hours}</span>
              </div>
            ) : null;
          })}
        </div>
      )}

      {/* Notes — second last */}
      {charger.notes && (
        <div className="flex items-center gap-1 mt-1">
          <svg className="w-3 h-3 text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="text-xs text-gray-500 italic">{charger.notes}</span>
        </div>
      )}

      {/* Location type + Maps link */}
      <div className="flex items-center justify-between mt-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          {charger.location_type}
        </span>
        <MapsButton charger={charger} />
      </div>

      {/* Short ID — last */}
      <div className="flex justify-end mt-1">
        <a
          href={chargerCanonicalPath(charger)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View full details for ${charger.address}`}
          className="text-xs text-gray-400 hover:text-green-600 transition-colors hover:underline"
        >
          View Full Details
        </a>
      </div>
    </div>
  );
}
