"use client";

import { SWRConfig, type Cache } from "swr";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";
import type { ReactNode } from "react";
import { useEffect, useCallback } from "react";

// Shared in-memory cache that persists across navigations within a session
const globalCache = new Map();

export function Providers({ children }: { children: ReactNode }) {
  // Hydrate cache from localStorage once on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("swr-cache");
      if (stored) {
        const entries = JSON.parse(stored);
        for (const [key, value] of entries) {
          if (!globalCache.has(key)) {
            globalCache.set(key, value);
          }
        }
      }
    } catch {}

    const handleUnload = () => {
      try {
        const entries = Array.from(globalCache.entries());
        localStorage.setItem("swr-cache", JSON.stringify(entries));
      } catch {}
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const provider = useCallback(() => globalCache as Cache, []);

  return (
    <SWRConfig value={{ provider }}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
