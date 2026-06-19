@AGENTS.md

# ChargeMap PK

Pakistan's community-driven EV charging directory: an interactive map plus
per-city and per-charger pages, with a marketing landing page at `/`.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**.
  This Next.js has breaking changes; read `node_modules/next/dist/docs/` before
  writing framework code (see AGENTS.md).
- **Tailwind CSS v4** (CSS-variable theming, no `tailwind.config`; tokens live
  in `src/app/globals.css` under `@theme inline`).
- **Framer Motion** (animation), **Leaflet** + **react-leaflet** (map),
  **SWR** (client data), **next-themes** wrapper for light/dark.
- Deployed on Vercel. `@vercel/analytics` is wired in the root layout.

## Commands

- `npm run dev` — dev server (Turbopack).
- `npm run build` — production build (runs TypeScript + prerender).
- `npm run lint` — ESLint. Note: there are pre-existing `set-state-in-effect`
  errors in `theme-provider.tsx` / `theme-toggle.tsx`; don't attribute them to
  your change. Keep new code lint-clean.

## Data flow

- No direct DB. The browser/server calls **n8n webhooks**, proxied through
  Next.js route handlers so the API key never reaches the client.
- Env (in `.env.local`): `N8N_WEBHOOK_URL`, `N8N_API_KEY`. When unset,
  `fetchChargers()` returns `[]` so pages still render. `SESSION_SECRET` signs
  the admin session cookie (`src/lib/session.ts`) that gates charger mutations;
  when unset, `verifySession` rejects every token so all mutations return 401.
- Route handlers live in `src/app/api/*/route.ts` (`chargers`, `auth`,
  `comments`, `contact`, `users`). The chargers handler sends
  `event_type` payloads (`get_ev_chargers`, `insert_ev_charger`,
  `update_ev_charger`, `delete_ev_charger`).
- **Server reads:** `src/lib/charger-fetch.ts#fetchChargers` (cached 5 min) is
  used by the landing, sitemap, city/detail pages, and OG image generation.
- **Client reads:** `src/hooks/use-chargers.ts` (SWR, optimistic add/edit/delete)
  powers the live map app.

## Routes

- `/` — marketing **landing** (`src/app/page.tsx`, server component, real stats).
- `/map` — the interactive map app (`AppShell`). This is the product surface.
- `/chargers/[city]` and `/chargers/[city]/[slug]` — SEO city lists + detail
  pages with `EVChargingStation` JSON-LD and dynamic OG images.
- `/[id]` — legacy redirect to the canonical `/chargers/[city]/[slug]` path.
- `/about` `/stats` `/contact` `/credits` `/terms` `/privacy` — info pages.
- `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx` are file-based
  metadata routes. PWA `start_url` is `/map` (the app, not the landing).

## Key directories

- `src/app/` — routes + metadata files.
- `src/components/` — UI. Notables: `app-shell.tsx` (map app orchestrator),
  `header.tsx` / `page-footer.tsx` (shared chrome), `charger-card.tsx`,
  `badges.tsx`, `info-tip.tsx` (tentative-price tooltip), `icons.tsx`
  (inline SVG icon set, no icon library), `ui/` (Button, Input, Select,
  Modal, Toast), `filters/`, `map/`, `add-charger/`, `edit-charger/`, `auth/`.
- `src/components/landing/` — the landing page sections (see below).
- `src/hooks/` — `use-chargers`, `use-filters`, `use-toast`.
- `src/lib/` — `types.ts` (`Charger`, `PROVINCES`, `CHARGER_TYPES`,
  `LOCATION_TYPES`), `slug.ts` (canonical paths/slugs), `format.ts`,
  `validate.ts`, `map-constants.ts`, `charger-fetch.ts`.

## Conventions

- **Reuse `src/lib` helpers** for slugs/paths (`citySlug`, `chargerCanonicalPath`)
  and formatting (`formatPower`, `formatCost`) — don't re-derive them.
- **Icons** come from `src/components/icons.tsx`; add new ones there rather than
  pulling in a dependency.
- **Hydration:** any client tree using browser-only/non-deterministic values at
  init must avoid SSR mismatch (theme, random, time). The app uses
  `suppressHydrationWarning` on `<html>` and an `isHydrated` gate for auth/theme.
- **File references in chat** use markdown links, not backticks.

## Design system

Strategic and visual context live in **PRODUCT.md** (register, users, brand,
principles, anti-references) and **DESIGN.md** (Stitch-format tokens: colors,
typography, components, do's/don'ts). Read them before design work; the
`impeccable` skill loads them automatically.

- **App theme:** tokens in `src/app/globals.css` (`--theme-*` mapped to
  `--color-*`). Light + dark, dark-default. Brand green `#00C853` (dark
  `#69F0AE`) is the single earned accent. AC=blue, DC=green are *functional*
  encodings, never decoration.
- **Fonts:** app UI uses **Space Grotesk** (`--font-heading`) + **DM Sans**
  (`--font-body`), loaded in `src/app/layout.tsx`.
- **Landing is scoped and self-contained.** Everything under `.landing-root`
  uses its own dark OKLCH `--ld-*` palette and marketing fonts **Bricolage
  Grotesque** (`--font-landing-display`) + **Hanken Grotesk**
  (`--font-landing-body`). The wrapper also carries `dark` so the reused
  `PageFooter` resolves dark theme tokens. These must **never** leak into the
  app, and app fonts/tokens must never carry the landing. No Leaflet on `/`
  (the hero uses a CSS/SVG glowing-pin visual for performance).
- **Style guardrails (from DESIGN.md):** flat surfaces with 1px hairlines;
  no gradient text, no decorative glassmorphism, no colored side-stripe borders;
  never `#000`/`#fff`; respect `prefers-reduced-motion`; keep
  `focus:ring-2 ring-brand` on interactive elements.
