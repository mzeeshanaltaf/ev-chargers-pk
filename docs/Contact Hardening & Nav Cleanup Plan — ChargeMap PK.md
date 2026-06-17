# Contact hardening, nav/footer cleanup, sidebar note & landing freshness

## Context

A batch of UX + anti-spam improvements for ChargeMap PK:

1. The `/contact` form uses a client-only math captcha for spam protection — trivially
   bypassed by bots that POST directly to `/api/contact` (the route does **zero**
   validation, just forwards to n8n). Replace it with a server-enforced honeypot +
   Upstash IP rate limiting. Env vars `UPSTASH_REDIS_REST_URL` /
   `UPSTASH_REDIS_REST_TOKEN` are already in `.env.local`.
2. Navigation polish: surface "Contact Us" in the marketing navbar, align the footer
   links with the navbar, and declutter the `/map` navbar (drop Terms/Privacy there).
3. Make it clear that adding chargers needs admin access, and tell users to use Contact
   to request a new/updated charger.
4. Show "Last EV charger added …" on the landing hero so visitors trust the site is
   actively maintained.

There are **two** headers: `LandingHeader` (landing + all info pages, incl. `/contact`)
and the shared `Header` (used on `/map` **and** the `/chargers/[city]` SEO pages).

---

## 1. Contact form: drop captcha, add honeypot + Upstash rate limiting

### Install deps
- `npm install @upstash/ratelimit @upstash/redis`

### New helper — `src/lib/rate-limit.ts`
- Create a singleton `Ratelimit` using `Redis.fromEnv()` (reads the two `UPSTASH_*`
  env vars automatically) with a sliding window — **5 requests / 1 hour per IP**
  (`prefix: "ratelimit:contact"`). Export an async `checkRateLimit(ip: string)`
  returning `{ success }`.
- Guard for missing env: if either `UPSTASH_*` var is unset, export a no-op that
  returns `{ success: true }` so local dev / preview without Redis still works
  (mirrors the `fetchChargers()` graceful-degradation convention in
  [charger-fetch.ts](src/lib/charger-fetch.ts)).

### Route — [src/app/api/contact/route.ts](src/app/api/contact/route.ts)
- Read client IP from headers: `x-forwarded-for` (first hop) → fall back to
  `x-real-ip` → `"unknown"` (Vercel sets `x-forwarded-for`).
- Call `checkRateLimit(ip)`; on failure return `429` with
  `{ error: "Too many requests. Please try again later." }`.
- After parsing the body, **server-side honeypot check**: if `body.website` is a
  non-empty string, return a fake `200` success (silently drop — don't tell the bot).
- Strip `website` from the payload before forwarding to n8n; keep existing forward logic.

### Client — [src/app/contact/contact-client.tsx](src/app/contact/contact-client.tsx)
- Remove the math-captcha entirely: `generateChallenge`, `useMemo` challenge,
  `captchaInput` state, the `captcha` error field/handling, and the captcha `<div>`
  (lines ~194–206). Remove the now-unused `useMemo` import.
- Keep the existing hidden honeypot `<input name="website">` (already present,
  lines 190–192) and keep the early `if (honeypot) return;` client guard.
- Include `website: honeypot` in the POST body so the server can also enforce it.
- Handle the `429` response: show a friendly "_form" message like
  "You've sent a few messages already — please try again later."
- Update the lede copy (line 113–115) to mention charger requests, e.g.:
  "Found a bug, want to **add a new charger or update an existing one**, or just want
  to say hi? We'd love to hear from you." Also tweak the textarea placeholder to hint
  at "add a new charger / correct charger details".

---

## 2. Navbar: add Contact Us (marketing) + drop Terms/Privacy on /map only

### [src/components/landing/landing-header.tsx](src/components/landing/landing-header.tsx)
- Add `{ href: "/contact", label: "Contact Us" }` to the `NAV` array (after Stats).
  Renders automatically in both desktop and mobile nav.

### [src/components/header.tsx](src/components/header.tsx) (shared app/SEO header)
- Add an optional prop `hideLegalLinks?: boolean`. When true, filter `NAV_LINKS` to
  exclude `/terms` and `/privacy` before rendering (both desktop nav line ~80 and
  mobile dropdown line ~135 map over the same list — derive a `navLinks` const once
  at top of component and use it in both places).
- Charger SEO pages keep passing nothing → Terms/Privacy still show there (per decision).

### [src/components/app-shell.tsx](src/components/app-shell.tsx)
- Pass `hideLegalLinks` to the `<Header …>` used on `/map` (around line 95).

---

## 3. Footer: align with navbar + keep legal/contact

### [src/components/page-footer.tsx](src/components/page-footer.tsx)
- Replace the nav row (lines 54–60) so it mirrors the landing navbar plus legal/contact:
  **Map, Cities, How it works, About, Stats, Contact, Terms, Privacy.**
  - Map → `/map`; Cities → `/#cities`; How it works → `/#how`; About → `/#about`;
    Stats → `/#stats` (match the hash targets used by `LandingHeader`); Contact →
    `/contact`; Terms → `/terms`; Privacy → `/privacy`.
  - Note: footer also renders on `/chargers` pages via... (it does not — footer is on
    landing + info pages only). Hash links resolve to the landing sections, consistent
    with how `LandingHeader` already links from sub-pages.
- Allow the row to wrap (`flex-wrap`) since it now has 8 links.

---

## 4. Sign-In sidebar: admin-access note

### [src/components/auth/sign-in-modal.tsx](src/components/auth/sign-in-modal.tsx)
- Below the existing description (line 51–53), add a small note styled like an info
  callout: "**Admin access required** to add or edit EV charging stations. Want a
  charger added or updated? [Contact us](/contact)." Use a muted/info style
  (`bg-surface-raised` or a subtle border) consistent with the modal's tokens; link
  to `/contact`. The modal is rendered via the right-sliding `Modal` ("sidebar" the
  user refers to).

---

## 5. Landing: "Last EV charger added X ago"

### New formatter — [src/lib/format.ts](src/lib/format.ts)
- Add `relativeTimeAgo(dateStr: string): string` with coarse granularity:
  today → "today", 1 day → "yesterday", `<7d` → "N days ago",
  `<5wk` → "N week(s) ago", `<12mo` → "N month(s) ago", else "N year(s) ago".
  (Existing private `timeAgo` in `comments-client.tsx` is minute/hour grained and
  stays as-is; this is the coarse landing variant.)

### [src/app/page.tsx](src/app/page.tsx)
- After `fetchChargers()`, compute the newest `created_at`:
  `chargers.reduce(...)` over valid `created_at` values → `lastAdded` Date.
  If no chargers / no valid dates, pass `undefined`.
- Build `lastAddedLabel = lastAdded ? relativeTimeAgo(...) : undefined` and pass to
  `<LandingPage lastAddedLabel={…} />`.

### [src/components/landing/landing-page.tsx](src/components/landing/landing-page.tsx)
- Add `lastAddedLabel?: string` to props; forward to `<Hero …>`.

### [src/components/landing/hero.tsx](src/components/landing/hero.tsx)
- Accept `lastAddedLabel?: string`. Render a small pill **under the existing green
  pulsing "+stations mapped" badge** (the `motion.div` at lines 23–39), only when
  `lastAddedLabel` is set, e.g. a subtle muted chip: "Last charger added
  {lastAddedLabel}". Use `--ld-text-dim`/`--ld-surface` tokens; keep it understated so
  it doesn't compete with the headline. Animate in with the existing framer pattern.

---

## Verification

1. `npm install` succeeds; `npm run build` passes (TypeScript + prerender) and
   `npm run lint` is clean for new code (ignore the known `theme-*` lint errors).
2. `npm run dev`:
   - `/contact`: math question is gone; submitting valid name/email/message succeeds.
     Lede mentions adding/updating a charger.
   - Rate limit: `for` loop / repeated `curl -X POST http://localhost:3000/api/contact`
     with JSON body > 5 times within the hour returns `429` (only when `UPSTASH_*` set;
     otherwise no-op passes — verify the guard path too).
   - Honeypot: `curl` POST with `{"website":"x", ...}` returns 200 but nothing is
     forwarded to n8n.
   - `/map`: navbar shows About, Stats, Contact Us (no Terms/Privacy). A
     `/chargers/karachi` page still shows Terms/Privacy.
   - Landing + info pages: navbar shows Contact Us; footer shows the 8-link row and
     wraps cleanly on mobile.
   - Click "Sign In": modal shows the admin-access note linking to `/contact`.
   - Landing hero shows "Last charger added …" pill under the status badge (with live
     data). Confirm it's hidden gracefully when `fetchChargers()` returns `[]`.
3. Confirm landing `--ld-*` tokens didn't leak into the app and app `/map` still uses
   app fonts/tokens.
