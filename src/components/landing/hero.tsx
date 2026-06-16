"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapGlowVisual } from "./map-glow-visual";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ chargerCount, cityCount, lastAddedLabel }: { chargerCount: number; cityCount: number; lastAddedLabel?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 50% at 75% 0%, var(--ld-glow), transparent 60%), radial-gradient(50% 40% at 0% 20%, oklch(0.42 0.12 154 / 0.25), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8 pt-14 md:pt-20 pb-16 md:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium"
              style={{
                background: "color-mix(in oklch, var(--ld-green) 12%, transparent)",
                border: "1px solid color-mix(in oklch, var(--ld-green) 35%, transparent)",
                color: "var(--ld-green-bright)",
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="ld-pin-ring absolute inline-flex h-full w-full rounded-full" style={{ background: "var(--ld-green)" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: "var(--ld-green-bright)" }} />
              </span>
              {chargerCount > 0 ? `${chargerCount}+ stations mapped nationwide` : "Community-driven EV charging map"}
            </motion.div>

            {lastAddedLabel && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.12 }}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px]"
                style={{
                  background: "var(--ld-surface)",
                  border: "1px solid var(--ld-border)",
                  color: "var(--ld-text-dim)",
                }}
              >
                Last charger added {lastAddedLabel}
              </motion.p>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.06 }}
              className="ld-display mt-6 text-[clamp(2.6rem,7vw,5rem)] font-extrabold"
              style={{ color: "var(--ld-text)" }}
            >
              Never wonder
              <br />
              where to{" "}
              <span style={{ color: "var(--ld-green-bright)", textShadow: "0 0 40px var(--ld-glow)" }}>
                charge
              </span>{" "}
              again.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.14 }}
              className="mt-6 max-w-[34rem] text-[clamp(1.05rem,2.2vw,1.25rem)] leading-relaxed"
              style={{ color: "var(--ld-text-muted)" }}
            >
              The community map of every AC and DC charging station across Pakistan.
              Filter by power, price, and connector, see what&apos;s open right now, and
              plan your route with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.22 }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-transform hover:scale-[1.03]"
                style={{ background: "var(--ld-green)", color: "var(--ld-on-green)", boxShadow: "0 0 40px var(--ld-glow)" }}
              >
                Explore the Map
              </Link>
              <Link
                href="#cities"
                className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold transition-colors"
                style={{ background: "var(--ld-surface)", color: "var(--ld-text)", border: "1px solid var(--ld-border-strong)" }}
              >
                Browse by City
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="mt-5 text-[13px]"
              style={{ color: "var(--ld-text-dim)" }}
            >
              Free and open. Covering {cityCount > 0 ? `${cityCount} cities` : "cities"} and growing,
              one community contribution at a time.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.1 }}
          >
            <MapGlowVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
