"use client";

import { useState } from "react";
import Link from "next/link";
import { LightningIcon, XIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

interface HeaderProps {
  isSidebarVisible?: boolean;
  onToggleSidebar?: () => void;
}

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact Us" },
];

export function Header({ isSidebarVisible, onToggleSidebar }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-surface/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center gap-2">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors"
            aria-label={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
            title={isSidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4.5 h-4.5">
              {isSidebarVisible ? (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                </>
              ) : (
                <>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="3" x2="9" y2="21" />
                  <polyline points="14 9 17 12 14 15" />
                </>
              )}
            </svg>
          </button>
        )}

        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <LightningIcon className="w-4.5 h-4.5 text-white" fill="currentColor" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            ChargeMap
            <span className="text-brand ml-0.5">PK</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 mr-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface-raised text-text-secondary transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-surface border-b border-border shadow-lg z-40 md:hidden">
          <nav className="flex flex-col p-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
