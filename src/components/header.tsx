"use client";

import { useState } from "react";
import Link from "next/link";
import { LightningIcon, XIcon, UserIcon, LogOutIcon } from "@/components/icons";
import { useAuth } from "@/components/auth-provider";
import { SignInModal } from "@/components/auth/sign-in-modal";

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
  /** Hide Terms/Privacy from the nav (used on /map to keep it uncluttered). */
  hideLegalLinks?: boolean;
  /**
   * Center the nav with the marketing link set + an "Open the Map" CTA, matching
   * the landing/content pages (used on the /chargers SEO pages).
   */
  centeredNav?: boolean;
}

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/stats", label: "Stats" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact Us" },
];

// Mirrors the landing header (src/components/landing/landing-header.tsx) so the
// charger SEO pages share the same centered nav as /about, /stats, etc.
const MARKETING_NAV = [
  { href: "/map", label: "Map" },
  { href: "/chargers", label: "Chargers" },
  { href: "/about", label: "About" },
  { href: "/stats", label: "Stats" },
  { href: "/contact", label: "Contact Us" },
];

export function Header({ isSidebarVisible, onToggleSidebar, hideLegalLinks, centeredNav }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { user, isAuthenticated, isHydrated, logout } = useAuth();

  const navLinks = centeredNav
    ? MARKETING_NAV
    : hideLegalLinks
      ? NAV_LINKS.filter((l) => l.href !== "/terms" && l.href !== "/privacy")
      : NAV_LINKS;

  return (
    <>
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

      {/* Centered nav (charger SEO pages) — absolutely centered like the landing header */}
      {centeredNav && (
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-1">
        {/* Desktop nav (default left-aligned variant) */}
        {!centeredNav && (
          <nav className="hidden md:flex items-center gap-1 mr-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Open the Map CTA (centered-nav variant; hidden on the map itself).
            Styled to match the landing header's button — literal green values so
            we don't pull the .landing-root-scoped --ld tokens into the app UI. */}
        {centeredNav && !onToggleSidebar && (
          <Link
            href="/map"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03] mr-1"
            style={{
              background: "oklch(0.78 0.2 152)",
              color: "oklch(0.18 0.03 158)",
              boxShadow: "0 0 24px oklch(0.78 0.2 152 / 0.45)",
            }}
          >
            Open the Map
          </Link>
        )}

        {/* Desktop auth */}
        {isHydrated && (
          <div className="hidden md:flex items-center gap-1 mr-1">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-text-secondary max-w-[120px] truncate" title={user?.email}>
                  {user?.name}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                  title="Sign out"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSignInOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Sign In
              </button>
            )}
          </div>
        )}

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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {centeredNav && !onToggleSidebar && (
              <Link
                href="/map"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-semibold"
                style={{ background: "oklch(0.78 0.2 152)", color: "oklch(0.18 0.03 158)" }}
              >
                Open the Map
              </Link>
            )}
            {isHydrated && (
              <div className="border-t border-border mt-1 pt-1">
                {isAuthenticated ? (
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Sign Out ({user?.name})
                  </button>
                ) : (
                  <button
                    onClick={() => { setIsSignInOpen(true); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-raised transition-colors"
                  >
                    <UserIcon className="w-4 h-4" />
                    Sign In
                  </button>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
    <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
    </>
  );
}
