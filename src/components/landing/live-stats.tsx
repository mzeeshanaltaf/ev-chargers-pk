"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { animate, useInView } from "framer-motion";

export interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function LiveStats({ stats }: { stats: Stat[] }) {
  return (
    <section id="stats" className="mx-auto max-w-6xl px-5 md:px-8 py-4 scroll-mt-20">
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden"
        style={{ background: "var(--ld-border)", border: "1px solid var(--ld-border)" }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            className="px-6 py-7 md:py-9"
            style={{ background: "var(--ld-surface)" }}
          >
            <div
              className="ld-display text-[clamp(2.2rem,5vw,3.2rem)] font-bold"
              style={{ color: "var(--ld-green-bright)" }}
            >
              <CountUp value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-1 text-[13px] md:text-sm" style={{ color: "var(--ld-text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-right">
        <Link href="/stats" className="text-[13px] font-medium" style={{ color: "var(--ld-text-dim)" }}>
          See the full live statistics →
        </Link>
      </div>
    </section>
  );
}
