# Plan: Marketing Landing Page for ChargeMap PK

## Context

ChargeMap PK is Pakistan's community-driven EV charging directory. Today the root route `/` **is** the interactive map app ([src/app/page.tsx](src/app/page.tsx) renders `AppShell`). There is no marketing/landing surface — a first-time visitor lands directly in a full-screen map with no narrative explaining what this is, why it's trustworthy, or where to go next.

This change introduces a **production-grade marketing landing page at `/`** and **relocates the map app to `/map`**. The landing acts as the front door: it explains the product, shows live proof (real charger/city counts), highlights features, and funnels visitors quickly into the map, city charger lists, and the contribute flow.

**Design register:** brand (design IS the product). Per the impeccable brand register, the landing gets a distinctive voice rather than reusing the app's generic UI fonts.

### Confirmed direction (from user interview)
- **Routing:** Landing at `/`; map moves to `/map`.
- **Theme & color:** Dark, electric green-charged. Committed green accent on a near-black, green-tinted base. Evokes night driving + charging glow.
- **Typography:** Distinctive brand pair for the landing only (app keeps DM Sans / Space Grotesk).
- **Scope:** Full production landing (hero, live stats, features, cities, how-it-works, contribute, FAQ teaser, footer).

### Design brief (brand register)
- **Color strategy:** Committed. Green (`#00C853` / `#69F0AE`) is load-bearing — CTAs, pin glows, key numbers, section accents — on a near-black base tinted toward green (OKLCH, never `#000`/`#fff`). Mitigate the "EV = green" category reflex with a sophisticated dark base, restraint in green's spread, and type/data carrying the voice (not eco clichés).
- **Theme scene sentence:** "A Pakistani EV owner, on their phone at night before a long drive, anxious about where they'll charge, scanning for proof this map actually covers their route." → forces dark, electric, reassuring.
- **Typography:** `--font-landing-display` = **Bricolage Grotesque**, `--font-landing-body` = **Hanken Grotesk** (both Google Fonts, both avoid the impeccable reflex-reject list). Fluid `clamp()` scale, ≥1.25 step ratio, tight tracking on display.
- **Anchor references:** Linear (dark, type-forward, restrained motion), Vercel (monochrome-confident with one accent), Tesla/charging-network map visuals (glowing pins on dark map).
- **Imagery:** Tech-brand lane — voice carried by typography, live data, and a stylized map visual rather than stock photos. Hero uses a CSS/SVG Pakistan map silhouette with animated glowing charger pins (performant, no Leaflet on the landing). At most one optional Unsplash photo in a secondary section; no colored-block placeholders.
- **Anti-goals:** Generic centered icon-title-card grid; hero-metric SaaS template; gradient text; glassmorphism; em dashes in copy; reusing Space Grotesk/DM Sans as the landing voice.

## Implementation

### 1. Relocate the map app to `/map`
- Create `src/app/map/page.tsx`: move the current contents of [src/app/page.tsx](src/app/page.tsx) here (the `AppShell` render + sr-only `<h1>`/`<p>`). Update its `metadata.alternates.canonical` to `/map`.
- The `body:has(.app-shell) { overflow: hidden }` rule in [src/app/globals.css](src/app/globals.css#L49) keeps working since `AppShell` still renders on `/map`.

### 2. Build the landing page at `/`
- Replace [src/app/page.tsx](src/app/page.tsx) with the new landing. Keep it a **Server Component** for SEO; fetch real counts server-side via `fetchChargers()` from [src/lib/charger-fetch.ts](src/lib/charger-fetch.ts) (already used by [src/app/sitemap.ts](src/app/sitemap.ts)) and derive stats with the same logic as [src/app/stats/stats-client.tsx](src/app/stats/stats-client.tsx) (total, DC count, AC count, 24/7 count, distinct cities, distinct provinces). Pass these as props to client sub-components for count-up animation. Update `metadata` to landing-appropriate copy, `canonical: "/"`.
- New components under `src/components/landing/`:
  - `landing-page.tsx` — server orchestrator composing the sections; wraps everything in a `.dark` + landing-font scope container.
  - `landing-header.tsx` — slim marketing header (reuse logo treatment from [src/components/header.tsx](src/components/header.tsx)): logo → `/`, nav to Map / Cities / About / Stats / Contact, primary "Open the Map" CTA → `/map`. Mobile menu.
  - `hero.tsx` (client) — oversized display headline, subhead, dual CTAs ("Explore the Map" → `/map`, "Browse by City" → cities section), and the stylized animated map+pins visual.
  - `map-glow-visual.tsx` (client) — SVG Pakistan silhouette with green glowing pins; subtle staggered pulse using Framer Motion (already a dependency, v12). Respect `prefers-reduced-motion`.
  - `live-stats.tsx` (client) — count-up animated stat row (chargers, cities, provinces, DC fast chargers). Receives server-computed numbers as props (no layout shift, SEO-safe). Links to `/stats`.
  - `features.tsx` — feature highlights using a deliberate asymmetric layout (NOT identical icon-title cards): map + filters, AC/DC + power + pricing, real-time open/24-7 status, community-contributed + transparency (added-by attribution), PWA installable. Reference real fields from [src/lib/types.ts](src/lib/types.ts).
  - `popular-cities.tsx` — grid of major cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Multan, Quetta) linking to `/chargers/[slug]`, reusing the city link logic/slugs already in [src/components/page-footer.tsx](src/components/page-footer.tsx). Show per-city counts if cheaply derivable from fetched chargers.
  - `how-it-works.tsx` — 3-step narrative (Find → Verify/Call → Contribute), using the tentative-pricing/transparency story from [src/components/info-tip.tsx](src/components/info-tip.tsx).
  - `contribute-cta.tsx` — community/contribute band: explain anyone can comment/react; admins add chargers. CTA to `/map` and `/contact`.
  - `faq-teaser.tsx` — 3-4 questions sourced from the FAQ in [src/app/about/page.tsx](src/app/about/page.tsx), with a link to `/about`. Optionally emit FAQPage JSON-LD (mirror the pattern already in about page).
  - Reuse the existing [src/components/page-footer.tsx](src/components/page-footer.tsx) at the bottom.
- Add a single `FAQPage` / keep `Organization` JSON-LD (already global in [src/app/layout.tsx](src/app/layout.tsx)); add `WebSite` + `SearchAction` is optional/nice-to-have.

### 3. Scoped landing typography
- In [src/app/layout.tsx](src/app/layout.tsx): add `Bricolage_Grotesque` and `Hanken_Grotesk` from `next/font/google` with variables `--font-landing-display` and `--font-landing-body`; append both variables to the `<html>` className alongside the existing font variables.
- Landing components reference these via dedicated variables (e.g. `style={{ fontFamily: "var(--font-landing-display)" }}` for headings, body class on the landing wrapper) so the app UI (which uses `--font-heading`/`--font-body`) is unaffected.

### 4. Landing color tokens (dark, committed green)
- Add a small set of landing-only CSS custom properties in [src/app/globals.css](src/app/globals.css) (e.g. `--landing-bg`, `--landing-surface`, `--landing-glow`) defined in OKLCH with a near-black green-tinted base and a green glow, scoped under a `.landing-root` class. Do not alter the existing global theme tokens. Use Framer Motion / CSS transforms for motion (never animate layout properties).

### 5. SEO / routing ripple (must-do)
- [src/app/sitemap.ts](src/app/sitemap.ts): add `${BASE}/map` to `staticPages`; keep `${BASE}` (now the landing) at priority 1.0, set `/map` to a high priority (e.g. 0.9).
- [src/app/manifest.ts](src/app/manifest.ts): change `start_url` from `/` to `/map` (PWA users expect the app, not marketing).
- Update internal links that mean "the map" but point to `/`:
  - [src/app/contact/contact-client.tsx:115-116](src/app/contact/contact-client.tsx#L115) "Back to Map" → `/map`.
  - [src/app/chargers/[city]/page.tsx:65-69](src/app/chargers/[city]/page.tsx#L65) "Browse All Chargers" → `/map`.
  - The header logo link `/` in [src/components/header.tsx:67](src/components/header.tsx#L67) stays `/` (now correctly the landing/home). Verify no other "home = map" assumptions.
- The legacy `/[id]` redirect and `chargerCanonicalPath` are unaffected (they target `/chargers/...`).

## Files
- **New:** `src/app/map/page.tsx`; `src/components/landing/*` (landing-page, landing-header, hero, map-glow-visual, live-stats, features, popular-cities, how-it-works, contribute-cta, faq-teaser).
- **Modified:** `src/app/page.tsx` (becomes landing), `src/app/layout.tsx` (fonts), `src/app/globals.css` (landing tokens), `src/app/sitemap.ts`, `src/app/manifest.ts`, `src/app/contact/contact-client.tsx`, `src/app/chargers/[city]/page.tsx`.
- **Reused as-is:** `src/components/page-footer.tsx`, `src/lib/charger-fetch.ts`, `src/lib/slug.ts`, `src/lib/types.ts`, `src/components/icons.tsx`, Framer Motion.

## Optional (recommended) — establish impeccable design context
The impeccable skill expects a `PRODUCT.md` (and ideally `DESIGN.md`) at the project root; neither exists. Not required to ship, but running `$impeccable teach` / `$impeccable document` after this work would capture the brand brief above for future design tasks. The brief in this plan stands in for it during implementation.

## Verification
1. `npm run dev` (or project dev script). Confirm:
   - `/` renders the new landing (dark, green, Bricolage/Hanken type), with working CTAs and animated stats showing **real** numbers.
   - `/map` renders the full interactive map app exactly as `/` did before (filters, add/edit, mobile bottom sheet).
   - App sub-pages (`/about`, `/stats`, `/chargers/karachi`, etc.) still use DM Sans / Space Grotesk (landing fonts did not leak in).
2. Click every landing CTA/link: Map → `/map`, city cards → `/chargers/[slug]`, FAQ → `/about`, stats → `/stats`, contribute → `/contact`.
3. Resize to mobile: hero, stats, features, and cities reflow; landing header menu works. Check `prefers-reduced-motion` disables pin pulse.
4. Confirm fixed links: contact "Back to Map" and empty-city "Browse All Chargers" both go to `/map`.
5. Visit `/sitemap.xml` and `/manifest.webmanifest`: `/map` present in sitemap; manifest `start_url` is `/map`.
6. `npm run build` succeeds (no hydration warnings; per global guidance, ensure client-only/random/time logic doesn't cause SSR mismatch).
7. Lighthouse/quick check: landing is fast (no Leaflet bundle on `/`), good contrast on the dark theme, headings hierarchy intact.
