"use client";

import { motion } from "framer-motion";
import { LightningIcon, ClockIcon } from "@/components/icons";

// Decorative pins, positioned by percentage on the map panel.
// Loosely mirrors Pakistan's geography: Islamabad/Rawalpindi north,
// Lahore/Faisalabad east, Karachi/Quetta south.
const PINS = [
  { left: 62, top: 20, kw: "120 kW", featured: true }, // Islamabad
  { left: 70, top: 34 }, // Lahore
  { left: 58, top: 40 }, // Faisalabad
  { left: 44, top: 30 }, // Peshawar
  { left: 30, top: 70 }, // Quetta
  { left: 52, top: 82 }, // Karachi
  { left: 40, top: 55 }, // Multan-ish
  { left: 75, top: 24 }, // AJK
];

// Faint routes between a few pins.
const ROUTES = [
  [62, 20, 70, 34],
  [62, 20, 44, 30],
  [70, 34, 58, 40],
  [58, 40, 40, 55],
  [40, 55, 52, 82],
  [40, 55, 30, 70],
];

function Pin({ left, top, featured }: { left: number; top: number; featured?: boolean }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
      <span
        className="ld-pin-ring absolute inset-0 rounded-full"
        style={{ background: "var(--ld-green)" }}
      />
      <span
        className="relative block rounded-full"
        style={{
          width: featured ? 14 : 9,
          height: featured ? 14 : 9,
          background: "var(--ld-green-bright)",
          boxShadow: "0 0 12px var(--ld-glow), 0 0 4px var(--ld-green-bright)",
          border: "2px solid var(--ld-bg-deep)",
        }}
      />
    </div>
  );
}

export function MapGlowVisual() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border"
      style={{
        aspectRatio: "4 / 3.4",
        background: "linear-gradient(160deg, var(--ld-surface) 0%, var(--ld-bg-deep) 100%)",
        borderColor: "var(--ld-border)",
        boxShadow: "0 40px 120px -30px var(--ld-glow), inset 0 1px 0 oklch(1 0 0 / 0.04)",
      }}
    >
      {/* graticule grid */}
      <div className="ld-grid absolute inset-0" />

      {/* ambient glow */}
      <div
        className="absolute -inset-10 opacity-70"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 60% 30%, var(--ld-glow), transparent 70%)",
        }}
      />

      {/* routes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {ROUTES.map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--ld-green)"
            strokeWidth={0.25}
            strokeOpacity={0.35}
            strokeDasharray="1.5 1.5"
          />
        ))}
      </svg>

      {/* pins */}
      {PINS.map((p, i) => (
        <Pin key={i} {...p} />
      ))}

      {/* featured pin popup */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute"
        style={{ left: "62%", top: "20%", transform: "translate(-50%, -135%)" }}
      >
        <div
          className="rounded-xl px-3 py-2 whitespace-nowrap"
          style={{
            background: "var(--ld-surface-2)",
            border: "1px solid var(--ld-border-strong)",
            boxShadow: "0 12px 30px -8px oklch(0 0 0 / 0.6)",
          }}
        >
          <div className="flex items-center gap-1.5">
            <LightningIcon className="w-3.5 h-3.5" style={{ color: "var(--ld-green-bright)" }} fill="currentColor" />
            <span className="text-[13px] font-semibold" style={{ color: "var(--ld-text)" }}>120 kW DC</span>
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "var(--ld-text-dim)" }}>Islamabad · Open now</div>
        </div>
      </motion.div>

      {/* floating chip */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-5 left-5"
      >
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{ background: "var(--ld-surface-2)", border: "1px solid var(--ld-border)" }}
        >
          <ClockIcon className="w-3.5 h-3.5" style={{ color: "var(--ld-green-bright)" }} />
          <span className="text-[12px] font-medium" style={{ color: "var(--ld-text-muted)" }}>24/7 charging</span>
        </div>
      </motion.div>
    </div>
  );
}
