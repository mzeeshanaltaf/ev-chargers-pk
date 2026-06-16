---
name: ChargeMap PK
description: Pakistan's community-driven EV charging map and directory
colors:
  brand: "#00C853"
  brand-muted: "#E8F5E9"
  surface: "#FFFFFF"
  surface-raised: "#F5F5F5"
  text-primary: "#212121"
  text-secondary: "#757575"
  border: "#E0E0E0"
  danger: "#FF5252"
  warning: "#FFD740"
  ac-accent: "#0369A1"
  peak-accent: "#F59E0B"
typography:
  display:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  marketing-display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 5rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  marketing-body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "#FFFFFF"
    rounded: "{rounded.xl}"
    padding: "8px 16px"
  button-secondary:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "8px 16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "16px"
  marketing-cta:
    backgroundColor: "{colors.brand}"
    textColor: "#0E1A12"
    rounded: "{rounded.full}"
    padding: "14px 24px"
---

# Design System: ChargeMap PK

## 1. Overview

**Creative North Star: "The Charged Field Map"**

ChargeMap PK looks like instrumentation for drivers, not a brochure. The app
surface is a calm, high-legibility dashboard wrapped around a live map: tinted
neutrals, a single decisive green for anything actionable or "good", and
generous breathing room so the answer (where, open, how fast, how much) is never
buried. It is theme-aware and dark-default, because the typical session is a
phone glance, often at night, before a drive.

The marketing surface (`/`) is the one place the system raises its voice: a
dark, green-charged brand world that evokes charging glow and night driving,
carrying its character through oversized display type, live data, and a
stylized glowing map rather than stock photography.

This system explicitly rejects the things that make tools look generic: the
hero-metric template, identical icon-title card grids, gradient text,
decorative glassmorphism, eco-greenwashing motifs, and colored side-stripe
borders. Green is earned, not sprayed.

**Key Characteristics:**
- Tinted-neutral base with one load-bearing green accent.
- Dark-default, fully themed (light + dark) via CSS variables.
- Flat-by-default surfaces; depth from borders and state, not heavy shadow.
- Data-forward: real counts and live status carry the message.
- Two type registers: a functional app voice and a louder marketing voice.

## 2. Colors

A tinted-neutral palette anchored by a single electric green; everything else
is grayscale tuned per theme. Values in the frontmatter are the light-theme
(`:root`) primitives; each token carries a dark-theme counterpart, noted below.

### Primary
- **Electric Green** (`#00C853`, dark `#69F0AE`): the brand and the only
  "action / good / active" color. CTAs, active markers, selected state, key
  numbers, links. In dark mode it brightens to stay legible on near-black.
- **Green Wash** (`#E8F5E9`, dark `#1B5E20`): faint green fill behind
  brand-tinted chips, badges, and muted highlights.

### Secondary
- **AC Blue** (`#0369A1` on `#E0F2FE`; dark `sky-400` on `sky-900/30`): reserved
  exclusively to distinguish AC chargers from DC. Never decorative.
- **Peak Amber** (`#F59E0B`): peak-hour pricing only. A caution signal, not a
  general accent.

### Neutral
- **Ink** (`#212121`, dark `#E0E0E0`): primary text.
- **Slate** (`#757575`, dark `#9E9E9E`): secondary text, labels, muted icons.
- **Surface** (`#FFFFFF`, dark `#121212`): page background.
- **Raised Surface** (`#F5F5F5`, dark `#1E1E1E`): cards, inputs, hover fills.
- **Hairline** (`#E0E0E0`, dark `#333333`): borders and dividers.

### Status
- **Danger** (`#FF5252`, dark `#FF8A80`): errors, closed status, destructive
  actions. **Warning** (`#FFD740`, dark `#FFE57F`): non-blocking warnings.

### Marketing palette (landing only, dark, OKLCH)
Scoped under `.landing-root`, this layer is a committed-green dark world and is
intentionally separate from the app theme tokens:
- **Charged Base** (`oklch(0.155 0.012 158)`) and deep (`oklch(0.12 0.011 158)`):
  near-black tinted toward the green hue, never pure `#000`.
- **Glow Green** (`oklch(0.78 0.2 152)`) / bright (`oklch(0.87 0.18 155)`):
  load-bearing on CTAs, pins, key numbers, and glow shadows.
- Surfaces, borders, and muted text are green-tinted neutrals stepped in OKLCH.

### Named Rules
**The Earned-Green Rule.** Green means action, "good", or live status, nothing
else. In the app it stays a single accent on a neutral field. The landing is the
only surface permitted to make green load-bearing (Committed strategy); even
there it is restraint plus glow, never a wash over every element.

**The AC/DC Rule.** Blue is for AC, green for DC. These two are functional
encodings and must never be repurposed as decoration.

## 3. Typography

**App Display Font:** Space Grotesk (`--font-heading`, with system-ui fallback)
**App Body Font:** DM Sans (`--font-body`, with system-ui fallback)
**Marketing Display Font:** Bricolage Grotesque (`--font-landing-display`)
**Marketing Body Font:** Hanken Grotesk (`--font-landing-body`)

**Character:** The app pairing is clean and quietly technical, optimized for
dense, legible data. The marketing pairing is more characterful, Bricolage's
quirky grotesque shapes give the landing a distinct, modern-infrastructure voice
that the app fonts deliberately avoid.

### Hierarchy
- **Marketing Display** (800, `clamp(2.6rem,7vw,5rem)`, 0.98): landing hero only.
- **Display** (700, ~1.875rem, 1.15): page titles, section headings in the app.
- **Headline** (600, ~1.25rem): card titles, dialog headers.
- **Title** (600, ~1.125rem): sub-section labels.
- **Body** (400, 0.875rem, 1.5): default copy and UI text. Cap long-form
  reading measures at ~65–75ch on info pages.
- **Label** (500, 0.75rem, often uppercase with wide tracking): chips, badges,
  metadata, eyebrows.

### Named Rules
**The Two-Voice Rule.** App UI uses Space Grotesk + DM Sans via
`--font-heading` / `--font-body`. The marketing fonts live only under
`.landing-root` via `--font-landing-*` and must never leak into the app, and the
app fonts must never carry the landing.

## 4. Elevation

Flat by default. Depth comes from hairline borders and tonal layering
(`surface` to `surface-raised`), not ambient shadow. Shadows appear only as a
response to state or true elevation.

### Shadow Vocabulary
- **Selected glow** (`box-shadow: shadow-md + shadow-brand/10`): on the selected
  charger card, paired with a brand border, never a side stripe.
- **Overlay** (`shadow-2xl`, modals; `shadow-lg`, dropdowns): floating surfaces.
- **Map popup** (`0 8px 32px rgba(0,0,0,0.15)`): Leaflet popups and controls.
- **Landing glow** (`0 0 24–40px` of the green glow token): CTAs and pins on the
  marketing surface only; this is the one place shadow is colored and decorative.

### Named Rules
**The Flat-By-Default Rule.** Resting surfaces are flat with a 1px hairline.
If something has a drop shadow at rest, it is wrong unless it genuinely floats
(modal, popup, dropdown) or is a landing CTA/pin.

## 5. Components

### Buttons
- **Shape:** rounded-xl (12px); marketing CTAs are full pills (9999px).
- **Primary:** brand background, white text, `8px 16px`, `hover:brightness-110`.
- **Secondary / Ghost:** raised-surface or transparent, `hover:bg-surface-raised`.
- **Danger:** danger background for destructive actions.
- **Hover / Focus:** `transition-all duration-200`, `focus:ring-2 ring-brand`.
- **Loading:** inline spinner via the `isLoading` prop.

### Chips / Badges
- **Style:** small rounded pills. Brand-wash fill for "good" states (24/7),
  AC-blue vs DC-green for charger type, neutral border for location type.
- **Status:** Open uses brand with a status dot; Closed uses danger.

### Cards / Containers
- **Corner Style:** rounded-xl (12px). Never nest cards.
- **Background:** surface, on the page or raised-surface field.
- **Shadow Strategy:** flat at rest; selected state adds a brand border plus the
  selected-glow shadow (see Elevation).
- **Border:** 1px hairline.
- **Internal Padding:** 16px (`md`).

### Inputs / Fields
- **Style:** rounded-lg (8px), surface background, 1px hairline border, label
  above.
- **Focus:** `focus:ring-2 ring-brand`. **Error:** danger border + message.

### Navigation
- **App header:** sticky, 56px tall, `bg-surface/80 backdrop-blur-xl`, hairline
  bottom border. Logo (green lightning tile + wordmark), text nav links with
  `hover:bg-surface-raised`, theme toggle, auth. Mobile collapses to a hamburger
  dropdown.
- **Landing header:** taller (64px), transparent-blur over the charged base,
  pill "Open the Map" CTA, anchor links to in-page sections.

### Signature Components
- **Charger Card:** the primary app object. Power + type badge, address,
  open/24-7 status, tentative price (with confirm-by-call tooltip), and
  contributor attribution. Entrance animates `opacity` + `y` (Framer Motion).
- **Glowing Map Pin (landing):** green dot with a pulsing ring
  (`ld-pin-ring`), green glow, and optional info popup. Pure CSS/SVG, no Leaflet.
- **Bento Feature Grid (landing):** deliberately uneven tiles (a 2x2 lead tile
  plus smaller ones), the antithesis of the identical-card grid.

## 6. Do's and Don'ts

### Do:
- **Do** keep green as a single earned accent in the app; only the landing may
  go Committed-green, and even there with restraint plus glow.
- **Do** use AC-blue vs DC-green strictly as functional charger-type encoding.
- **Do** keep surfaces flat with 1px hairlines; reserve shadow for true
  floating elements, selected state, and landing CTAs/pins.
- **Do** scope marketing fonts under `.landing-root` only; keep the app on
  Space Grotesk + DM Sans.
- **Do** respect `prefers-reduced-motion` for pin pulses, count-ups, and
  reveals, and keep `focus:ring-2 ring-brand` on interactive elements.
- **Do** mark tentative prices as tentative and show contributor attribution.

### Don't:
- **Don't** use the hero-metric template (giant number, tiny label, gradient
  accent) or endless identical icon-title-text card grids.
- **Don't** use gradient text (`background-clip: text`) anywhere.
- **Don't** use decorative glassmorphism; blur is for functional sticky headers
  and map overlays only.
- **Don't** use colored side-stripe borders (`border-left` > 1px) as accents;
  use full borders, background tints, or status dots instead.
- **Don't** lean on greenwashing eco-clichés (leaves, "save the planet" stock)
  or reflexive bright-green-on-white "because EV".
- **Don't** use `#000` or `#fff` directly; use the tinted surface/ink tokens.
- **Don't** let marketing fonts leak into the app, or app fonts into the
  landing.
- **Don't** write marketing copy with em dashes or sentences that restate the
  heading.
