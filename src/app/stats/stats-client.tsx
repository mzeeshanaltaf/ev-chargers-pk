"use client";

import { useChargers } from "@/hooks/use-chargers";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-1"
      style={{ background: "var(--ld-surface)", border: "1px solid var(--ld-border)" }}
    >
      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ld-text-muted)" }}>{label}</span>
      <span className="ld-display text-3xl font-bold tabular-nums" style={{ color: "var(--ld-green-bright)" }}>
        {value}
      </span>
      {sub && <span className="text-xs" style={{ color: "var(--ld-text-dim)" }}>{sub}</span>}
    </div>
  );
}

function BreakdownRow({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm w-40 shrink-0" style={{ color: "var(--ld-text)" }}>{label}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--ld-border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--ld-green)" }} />
      </div>
      <span className="text-sm font-semibold tabular-nums w-8 text-right" style={{ color: "var(--ld-text)" }}>{count}</span>
      <span className="text-xs tabular-nums w-10 text-right" style={{ color: "var(--ld-text-dim)" }}>{pct}%</span>
    </div>
  );
}

export function StatsClient() {
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
    <>
      <h1 className="ld-display text-[clamp(2.2rem,5vw,3.2rem)] font-bold mb-2" style={{ color: "var(--ld-text)" }}>
        Charger Statistics
      </h1>
      <p className="mb-10 leading-relaxed text-[16px]" style={{ color: "var(--ld-text-muted)" }}>
        Live statistics computed from all EV charging stations listed on ChargeMap PK.
      </p>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-5 h-24 animate-pulse"
                style={{ background: "var(--ld-surface)", border: "1px solid var(--ld-border)" }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Chargers" value={total} />
            <StatCard label="DC Chargers" value={dc} sub={total > 0 ? `${Math.round((dc / total) * 100)}% of total` : undefined} />
            <StatCard label="AC Chargers" value={ac} sub={total > 0 ? `${Math.round((ac / total) * 100)}% of total` : undefined} />
            <StatCard label="24hr Available" value={available24hr} sub={total > 0 ? `${Math.round((available24hr / total) * 100)}% of total` : undefined} />
            <StatCard label="Currently Open" value={openNow} sub={total > 0 ? `${Math.round((openNow / total) * 100)}% of total` : undefined} />
          </div>

          <div>
            <h2 className="ld-display text-lg font-semibold mb-4" style={{ color: "var(--ld-text)" }}>
              By Province / Territory
            </h2>
            <div className="space-y-3">
              {byProvince.map(([province, count]) => (
                <BreakdownRow key={province} label={province} count={count} total={total} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="ld-display text-lg font-semibold mb-4" style={{ color: "var(--ld-text)" }}>
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
    </>
  );
}
