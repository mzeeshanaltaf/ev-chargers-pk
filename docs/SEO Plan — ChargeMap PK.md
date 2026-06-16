# SEO Plan — ChargeMap PK

## Context

ChargeMap PK is a Next.js 16 App Router site at https://chargemap-pk.zeeshanai.cloud — a community-driven EV charging station directory for Pakistan. The site needs to be discoverable in search engines (especially for queries like "EV chargers in Karachi", "DC fast chargers Pakistan", individual station names). Today the SEO foundation is largely missing.

Audit findings (current state, verified against the live site):

- **Single global title/description** in `src/app/layout.tsx` — every page in SERPs shows the same title.
- **6 of 7 pages** (`about`, `contact`, `stats`, `privacy`, `terms`, `[id]`) are `"use client"`, which blocks Next.js `metadata`/`generateMetadata` — per-page titles, descriptions, canonical, and JSON-LD cannot be set.
- **No `sitemap.xml`** — `/sitemap.xml` returns the SPA fallback (HTML 200).
- **No `robots.txt`** — same SPA fallback.
- **No JSON-LD structured data** anywhere (verified: `0` matches in live HTML).
- **No Open Graph or Twitter Card tags** (verified: `0` matches in live HTML).
- **No canonical URLs**.
- **No PWA manifest**.
- **Charger detail URLs are raw UUIDs** (`/550e8400-e29b-41d4-a716-446655440000`) — no keywords for crawlers, poor for sharing.
- **Root page has no server-rendered H1** (AppShell is client-only).
- **No OG/social-share image** in `public/`.

User decisions confirmed:
1. **Refactor all client pages to server + client split** — get real per-page metadata + JSON-LD.
2. **Slug-based charger URLs** — `/chargers/[city]/[slug]` canonical, with old `/[uuid]` URLs 301-redirected to canonical.
3. **Static OG image + dynamic per-charger OG image** via Next.js `opengraph-image` generators.

Target: discoverable, shareable, ranks for both site-wide queries ("EV chargers Pakistan") and per-station long-tail queries ("Tesla supercharger Malir Karachi").

---

## Implementation Plan

### Phase 1 — Foundations (no architecture changes)

**1.1 Root metadata** — `src/app/layout.tsx`
Replace the current minimal `metadata` export with:
- `metadataBase: new URL("https://chargemap-pk.zeeshanai.cloud")`
- `title: { default: "ChargeMap PK — EV Chargers in Pakistan", template: "%s | ChargeMap PK" }`
- `description` (existing)
- `keywords`: ["EV charging Pakistan", "electric vehicle chargers", "Tesla charger Pakistan", "DC fast charger", "AC charger", "Karachi", "Lahore", "Islamabad"]
- `openGraph`: type=website, url, title, description, siteName, locale="en_PK", images=[{ url: "/og-image.png", width: 1200, height: 630 }]
- `twitter`: card="summary_large_image", title, description, images=["/og-image.png"]
- `alternates: { canonical: "/" }`
- `robots: { index: true, follow: true }`
- `themeColor` and `viewport` via the new `export const viewport` API (Next.js 15+ split)
- `manifest: "/manifest.webmanifest"`
- Keep existing `icons` block

**1.2 robots.ts** — create `src/app/robots.ts`
- `userAgent: "*"`, allow all, disallow `/api/`
- `sitemap: "https://chargemap-pk.zeeshanai.cloud/sitemap.xml"`

**1.3 sitemap.ts** — create `src/app/sitemap.ts`
- Static entries: `/`, `/about`, `/stats`, `/credits`, `/contact`, `/privacy`, `/terms` with appropriate `changeFrequency` and `priority`.
- Dynamic entries: fetch all chargers from the existing n8n webhook (server-side `fetch` with the `N8N_WEBHOOK_URL` + `N8N_API_KEY` env vars — same pattern as `src/app/api/chargers/route.ts`). For each charger emit the canonical slug URL `/chargers/{citySlug}/{chargerSlug}` with `lastModified: charger.updated_at`.

**1.4 manifest.ts** — create `src/app/manifest.ts`
- `name: "ChargeMap PK"`, `short_name: "ChargeMap PK"`, `description`, `start_url: "/"`, `display: "standalone"`, `theme_color`, `background_color`, `icons` (re-use `/favicon.png` for now; flag icon backlog item).

**1.5 Static OG image** — `public/og-image.png`
- 1200x630 PNG with logo + tagline. Generation method: ask user to drop in a designed asset, OR add a one-shot Next.js `opengraph-image.tsx` at the app root that renders via `ImageResponse`. Default: use `ImageResponse` (no design asset needed, gradient background + logo + title).

**1.6 Organization JSON-LD** — inject in `layout.tsx`
- Single `<script type="application/ld+json">` with `@type: Organization`, name, url, logo, sameAs (empty for now). Add via a small server component or inline `<script>` block in the layout body.

---

### Phase 2 — Refactor static pages (server + client split)

For each of `about`, `contact`, `stats`, `credits`, `privacy`, `terms`:

**Pure-content pages** (`about`, `credits`, `privacy`, `terms`) — these have no client state. Simply **remove `"use client"`** and add `export const metadata` with page-specific title (uses the layout's `%s | ChargeMap PK` template), description, canonical, OG. They still use `next/link` which works in server components.

**Interactive pages** (`contact`, `stats`) — split:
- `src/app/contact/page.tsx` becomes a server component with `metadata` export, renders a `<ContactClient />` child.
- `src/app/contact/contact-client.tsx` is a new file with `"use client"` containing the existing form logic.
- Same pattern for `src/app/stats/page.tsx` → `stats-client.tsx`.

Per-page `metadata` examples:
- About: `title: "About"`, description focused on mission.
- Stats: `title: "Charger Statistics"`, description with current count snapshot.
- Contact: `title: "Contact Us"`.
- Credits: `title: "Credits"`.
- Privacy: `title: "Privacy Policy"`, `robots: { index: false }` is optional (default index=true is fine since it's standard policy boilerplate).
- Terms: `title: "Terms of Service"`.

**Root page** (`src/app/page.tsx`) — already a server component delegating to `<AppShell />`. Add to it:
- `export const metadata` with explicit map-focused description: "Find EV charging stations across Pakistan — interactive map with filters by province, city, charger type (AC/DC), power, and 24-hour availability."
- A visually-hidden but SSR-rendered `<h1 className="sr-only">EV Charging Stations in Pakistan</h1>` above `<AppShell />` so crawlers see a proper H1 even though the map is client-only.
- A small server-rendered intro paragraph (also `sr-only` or top-of-fold) describing the directory — gives crawlers indexable text content for the homepage.

---

### Phase 3 — Charger detail pages (URL refactor + per-charger metadata)

**3.1 Slug helper** — create `src/lib/slug.ts`
```ts
// Pseudocode
export function slugify(s: string): string  // lowercase, ascii, hyphens
export function chargerSlug(c: Charger): string  // `${slugify(addressOrName)}-${c.id.slice(-5)}`
export function citySlug(c: Charger): string  // slugify(c.city) || "pakistan"
export function chargerCanonicalPath(c: Charger): string  // `/chargers/${citySlug(c)}/${chargerSlug(c)}`
```
The 5-char UUID suffix in the slug guarantees uniqueness even if two chargers share city + address.

**3.2 New canonical route** — create `src/app/chargers/[city]/[slug]/page.tsx`
- **Server component** (no `"use client"`).
- `generateMetadata({ params })`: fetch the charger (by parsing the 5-char id suffix from the slug, then looking up in the chargers list — or by adding a `get_ev_charger_by_id` helper). Return:
  - `title: "${power_kw} kW ${charger_type} Charger — ${address}, ${city}"`
  - `description: "${charger_type} ${power_kw}kW EV charger at ${address}, ${city}, ${province}. ${formatCost(cost_per_kwh)}/kWh. ${is_available_24hrs ? '24/7' : 'Operating hours apply'}. View opening hours, location, and community comments."`
  - `alternates.canonical: chargerCanonicalPath(charger)`
  - `openGraph` with `images: [{ url: \`${chargerCanonicalPath(charger)}/opengraph-image\` }]`
  - `robots`: noindex if charger not found.
- Page body: render the existing detail UI as a server component for the static parts (charger info, address, hours, record metadata) and pass the charger to a small `<CommentsClient charger={charger} />` for the interactive comments section.
- Move comments JSX from `src/app/[id]/page.tsx` into `src/app/chargers/[city]/[slug]/comments-client.tsx` with `"use client"`. This file owns: registration captcha, localStorage user, comment form, reactions.

**3.3 Per-charger OG image** — `src/app/chargers/[city]/[slug]/opengraph-image.tsx`
- Use Next.js `ImageResponse` (Edge runtime) to render a 1200x630 image with: ChargeMap PK logo, charger power + type badge, address + city, cost. Loads charger data via the same fetch helper.

**3.4 JSON-LD on charger pages**
- Server-render a `<script type="application/ld+json">` with schema.org `Place` (or `EVChargingStation` if available — schema.org has `EVChargingStation` as of 2024). Include:
  - `@type: "EVChargingStation"`, `name`, `address` (PostalAddress with city, region "PK-XX"), `geo` (latitude/longitude), `telephone`, `openingHoursSpecification`, `amenityFeature` for AC/DC + power, `priceRange`.

**3.5 Old UUID route → 301 redirect** — replace `src/app/[id]/page.tsx`
- Convert to a **server component** (remove `"use client"`).
- In the page body (or via `redirect()` from `next/navigation`):
  - Fetch the charger by id
  - If found: call `redirect(chargerCanonicalPath(charger), RedirectType.permanent)` — Next.js sends 308 (or `permanent: true` in `next.config.ts` redirects, sends 301).
  - If not found: render the existing 404 UI or `notFound()`.
- This keeps every existing share link working while handing crawlers a single canonical URL per charger.

**3.6 Internal link updates**
- `src/components/charger-card.tsx` line ~199: change `href={\`/${charger.id}\`}` → `href={chargerCanonicalPath(charger)}`.
- `src/components/map/charger-popup.tsx`: same change.
- `src/app/[id]/page.tsx` (now a redirect): no link out.
- This change matters because the homepage is the highest-PageRank page on the site — its outbound links should point at canonical URLs, not at redirected ones.

---

### Phase 4 — City index pages (programmatic SEO)

**4.1 City index route** — create `src/app/chargers/[city]/page.tsx`
- **Server component**.
- `generateStaticParams()` (optional): pre-render the param set from the unique cities in the chargers list. Even without this, dynamic rendering works fine.
- `generateMetadata({ params })`:
  - `title: "EV Chargers in ${cityDisplayName} — ${count} stations"`
  - `description: "Browse ${count} EV charging stations in ${cityDisplayName}, Pakistan. Filter by AC/DC, power output (kW), and 24-hour availability. View pricing, locations, and community reviews."`
  - `alternates.canonical: \`/chargers/${citySlug}\``
  - OpenGraph + Twitter cards.
  - `notFound()` if no chargers match the city slug.
- Body: server-rendered `<h1>EV Chargers in ${cityDisplayName}</h1>`, summary stats (DC count, AC count, 24/7 count, avg cost), then a grid/list of charger cards. Each card is a server-rendered `<a>` linking to the canonical charger URL — every charger detail page is now reachable from the city index, and the city index is reachable from the sitemap and the home page footer.
- Add `ItemList` JSON-LD listing the chargers on the page (helps Google understand it's a station directory page).
- Optional client child only if filters/sort are added later — keep server-only for v1.

**4.2 Sitemap update** — `src/app/sitemap.ts` (from Phase 1)
- Add a city-index entry per unique city: `/chargers/${citySlug}` with `changeFrequency: "weekly"`, `priority: 0.7`. `lastModified` = max `updated_at` across that city's chargers.

**4.3 Internal linking from home + footer**
- `src/components/page-footer.tsx`: add a "Browse by City" section with the top 5–10 cities (sorted by charger count) linking to the city index pages. This makes city pages reachable from every page on the site (high crawl frequency, good link equity flow).

**4.4 Breadcrumbs**
- On the city index page: render a server-side breadcrumb trail `Home / Chargers / {City}` with anchor links and accompanying `BreadcrumbList` JSON-LD.

---

### Phase 5 — Breadcrumbs on charger detail + FAQ + PWA icons

**5.1 BreadcrumbList JSON-LD on charger detail pages**
- In `src/app/chargers/[city]/[slug]/page.tsx`, server-render a visible breadcrumb `Home / Chargers / {City} / {Charger}` (small, above the charger header) and a parallel `<script type="application/ld+json">` with schema.org `BreadcrumbList`. Each list item references the canonical URL of that level.
- Reuse the same breadcrumb component on the city index page (Phase 4.4).

**5.2 FAQPage JSON-LD on the About page**
- Add an FAQ section to `src/app/about/page.tsx` with 5–8 common questions, e.g.:
  - "How accurate is the charger data?"
  - "Can I add a new charger?"
  - "Are the prices live?"
  - "What's the difference between AC and DC charging?"
  - "Do I need to register to leave comments?"
  - "Is there a mobile app?"
- Render the questions/answers as visible `<details>`/`<summary>` accordion blocks (good UX + crawlable text), and emit a `<script type="application/ld+json">` with `@type: "FAQPage"` and a matching `mainEntity` array of `Question`/`Answer` entries. Source the same Q/A array for both renderings (single source of truth in a small const above the JSX) so they never diverge.

**5.3 Real PWA icons** — replace `favicon.png` re-use with proper sizes
- Create the following in `public/icons/`:
  - `icon-192.png` (192x192, maskable-safe padding: keep the lightning logo within the inner 80% safe zone)
  - `icon-512.png` (512x512)
  - `icon-maskable-512.png` (512x512, full-bleed background extending into the 10% safe-zone padding)
  - `apple-touch-icon.png` (180x180, no transparency)
- Update `src/app/manifest.ts` (Phase 1.4) `icons` array to reference these with correct `sizes`, `type: "image/png"`, and `purpose: "any"` / `purpose: "maskable"`.
- Update `src/app/layout.tsx` `icons` block: `apple` points at `/icons/apple-touch-icon.png`, `icon` includes 192 and 512 with proper `sizes` attributes.
- Generation method: ask user to drop in designed PNGs OR run a one-time script using `sharp` to derive them from a single 1024x1024 source SVG/PNG (the existing lightning logo). Default: produce them programmatically from the brand color + `LightningIcon` SVG path via a `scripts/generate-icons.mjs` one-off script (not committed as a build step).

---

### Phase 6 — Polish

**6.1 Better internal anchor text** — currently both card and popup say "View Full Details" (generic). Optional improvement: add `aria-label={\`View details for ${charger.address}\`}` on the link so screen-reader and crawler context improve without changing visible UI.

**6.2 next.config.ts** — add `compress: true` (default in production but explicit), and consider:
- `headers()` to add `Cache-Control` for static assets (Next.js handles this automatically for `/_next/static/`, no action needed for now).

**6.3 Stale dependency cleanup** — remove unused `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` (Next.js scaffold leftovers, not SEO-critical but tidy).

---

## Files to create / modify

**New files:**
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/manifest.ts`
- `src/app/opengraph-image.tsx` (root site-wide OG)
- `src/lib/slug.ts`
- `src/lib/charger-fetch.ts` (shared server-side fetch helper used by sitemap, city/charger pages, and OG generators — wraps the existing n8n call)
- `src/app/chargers/[city]/page.tsx` (city index — Phase 4)
- `src/app/chargers/[city]/[slug]/page.tsx`
- `src/app/chargers/[city]/[slug]/opengraph-image.tsx`
- `src/app/chargers/[city]/[slug]/comments-client.tsx`
- `src/app/contact/contact-client.tsx`
- `src/app/stats/stats-client.tsx`
- `src/components/breadcrumbs.tsx` (shared visual + JSON-LD breadcrumb component — Phase 5.1)
- `public/icons/icon-192.png`, `public/icons/icon-512.png`, `public/icons/icon-maskable-512.png`, `public/icons/apple-touch-icon.png` (Phase 5.3)
- `scripts/generate-icons.mjs` (one-off icon generator, not a build step — Phase 5.3)

**Modified files:**
- `src/app/layout.tsx` — full metadata, viewport export, manifest link, Organization JSON-LD, real PWA icon refs
- `src/app/page.tsx` — add metadata, sr-only H1, intro text
- `src/app/about/page.tsx` — drop `"use client"`, add `metadata`, add FAQ section + FAQPage JSON-LD (Phase 5.2)
- `src/app/credits/page.tsx` — drop `"use client"` if present, add `metadata`
- `src/app/privacy/page.tsx` — drop `"use client"`, add `metadata`
- `src/app/terms/page.tsx` — drop `"use client"`, add `metadata`
- `src/app/contact/page.tsx` — server shell + metadata, render `<ContactClient />`
- `src/app/stats/page.tsx` — server shell + metadata, render `<StatsClient />`
- `src/app/[id]/page.tsx` — convert to server-side 301 redirect to canonical slug URL
- `src/components/charger-card.tsx` — link to canonical slug URL
- `src/components/map/charger-popup.tsx` — link to canonical slug URL
- `src/components/page-footer.tsx` — add "Browse by City" link block (Phase 4.3)

**Existing utilities to reuse:**
- `src/app/api/chargers/route.ts` — same n8n fetch pattern goes into `src/lib/charger-fetch.ts`
- `src/lib/format.ts` — `formatCost`, `formatPower` for the metadata description strings

---

## Verification

1. **Build** — `npm run build` must succeed; check the build output for the new routes (`/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/chargers/[city]/[slug]`, etc.).
2. **Dev smoke test** — `npm run dev`:
   - `curl -s localhost:3000/robots.txt` returns plain text with sitemap line.
   - `curl -s localhost:3000/sitemap.xml` returns valid XML containing the static pages and at least one `/chargers/...` URL.
   - `curl -s localhost:3000/manifest.webmanifest` returns JSON.
   - Visit a known UUID URL (e.g. `localhost:3000/<some-uuid>`) and confirm browser is 308-redirected to the canonical slug URL.
   - Visit the canonical slug URL and view-source — confirm `<title>`, `<meta name="description">`, OG tags, canonical, and JSON-LD `EVChargingStation` block all render server-side.
   - Visit `/about` and confirm view-source has `<title>About | ChargeMap PK</title>`.
3. **OG validation** — after deploy, paste a charger URL into https://www.opengraph.xyz/ and confirm preview renders with the dynamic OG image.
4. **Rich Results** — paste a charger URL into https://search.google.com/test/rich-results and confirm the EVChargingStation schema is detected.
5. **Search Console** — submit `https://chargemap-pk.zeeshanai.cloud/sitemap.xml` to Google Search Console after deploy.

## Backlog (out of scope for this plan)

- AggregateRating schema once comments accumulate enough reactions to compute averages.
- Province-level index pages (e.g. `/chargers/punjab`) in addition to city pages.
- A dedicated charger search/landing page targeting "EV chargers near me" with geolocation server hint.
