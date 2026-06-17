"use client";

import { useState } from "react";
import Link from "next/link";
import { LightningIcon, XIcon } from "@/components/icons";

// Page links route to their own pages, so this header works from any page that
// reuses it (landing, /about, /stats, etc.).
const NAV = [
  { href: "/map", label: "Map" },
  { href: "/chargers", label: "Chargers" },
  { href: "/about", label: "About" },
  { href: "/stats", label: "Stats" },
  { href: "/contact", label: "Contact Us" },
];

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function LandingHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <div
        className="flex items-center justify-between gap-4 px-5 md:px-8 h-16 border-b"
        style={{
          background: "color-mix(in oklch, var(--ld-bg) 78%, transparent)",
          borderColor: "var(--ld-border)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: "var(--ld-green)", boxShadow: "0 0 20px var(--ld-glow)" }}
          >
            <LightningIcon className="w-[18px] h-[18px]" style={{ color: "var(--ld-on-green)" }} fill="currentColor" />
          </span>
          <span className="ld-display text-[19px]" style={{ color: "var(--ld-text)" }}>
            ChargeMap<span style={{ color: "var(--ld-green-bright)" }}>PK</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-sm transition-colors"
              style={{ color: "var(--ld-text-muted)" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/map"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03]"
            style={{ background: "var(--ld-green)", color: "var(--ld-on-green)", boxShadow: "0 0 24px var(--ld-glow)" }}
          >
            Open the Map
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg"
            style={{ color: "var(--ld-text)" }}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="md:hidden border-b"
          style={{ background: "var(--ld-bg)", borderColor: "var(--ld-border)" }}
        >
          <nav className="flex flex-col p-3">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-[15px]"
                style={{ color: "var(--ld-text-muted)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/map"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
              style={{ background: "var(--ld-green)", color: "var(--ld-on-green)" }}
            >
              Open the Map
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
