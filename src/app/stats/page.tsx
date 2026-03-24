"use client";

import Link from "next/link";
import { LightningIcon } from "@/components/icons";
import { PageFooter } from "@/components/page-footer";
import { useChargers } from "@/hooks/use-chargers";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-raised p-5 flex flex-col gap-1">
      <span className="text-xs text-text-secondary font-medium uppercase tracking-wide">{label}</span>
      <span className="text-3xl font-bold text-text-primary tabular-nums" style={{ fontFamily: "var(--font-heading)" }}>
        {value}
      </span>
      {sub && <span className="text-xs text-text-secondary">{sub}</span>}
    </div>
  );
}

function BreakdownRow({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-primary w-40 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-text-primary tabular-nums w-8 text-right">{count}</span>
      <span className="text-xs text-text-secondary tabular-nums w-10 text-right">{pct}%</span>
    </div>
  );
}

export default function StatsPage() {
  const { chargers, isLoading } = useChargers();

  const total = chargers.length;
  const dc = chargers.filter((c) => c.charger_type === "DC").length;
  const ac = chargers.filter((c) => c.charger_type === "AC").length;
  const available24hr = chargers.filter((c) => c.is_available_24hrs).length;
  const openNow = chargers.filter((c) => c.is_open).length;

  const byProvince = Object.entries(
    chargers.reduce<Record<string, number>>((acc, c) => {
      acc[c.province_territory] = (acc[c.province_territory] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const byLocationType = Object.entries(
    chargers.reduce<Record<string, number>>((acc, c) => {
      acc[c.location_type] = (acc[c.location_type] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-surface/80 backdrop-blur-xl border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <LightningIcon className="w-4.5 h-4.5 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            ChargeMap<span className="text-brand ml-0.5">PK</span>
          </span>
        </Link>
        <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
          &larr; Back to Map
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-text-primary mb-2" style={{ fontFamily: "var(--font-heading)" }}>
          Charger Statistics
        </h1>
        <p className="text-text-secondary mb-10 leading-relaxed">
          Live statistics computed from all EV charging stations listed on ChargeMap PK.
        </p>

        {isLoading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-surface-raised p-5 h-24 animate-pulse" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard label="Total Chargers" value={total} />
              <StatCard label="DC Chargers" value={dc} sub={total > 0 ? `${Math.round((dc / total) * 100)}% of total` : undefined} />
              <StatCard label="AC Chargers" value={ac} sub={total > 0 ? `${Math.round((ac / total) * 100)}% of total` : undefined} />
              <StatCard label="24hr Available" value={available24hr} sub={total > 0 ? `${Math.round((available24hr / total) * 100)}% of total` : undefined} />
              <StatCard label="Currently Open" value={openNow} sub={total > 0 ? `${Math.round((openNow / total) * 100)}% of total` : undefined} />
            </div>

            {/* Province breakdown */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                By Province / Territory
              </h2>
              <div className="space-y-3">
                {byProvince.map(([province, count]) => (
                  <BreakdownRow key={province} label={province} count={count} total={total} />
                ))}
              </div>
            </div>

            {/* Location type breakdown */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                By Location Type
              </h2>
              <div className="space-y-3">
                {byLocationType.map(([type, count]) => (
                  <BreakdownRow key={type} label={type} count={count} total={total} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <PageFooter />
    </div>
  );
}
