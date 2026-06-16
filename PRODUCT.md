# Product

## Register

product

> The core deliverable is a tool: an interactive map and directory that drivers
> use to get a job done, so design serves the product. The marketing landing
> page at `/` is the one **brand** surface (design IS the product there); treat
> that route as a per-task `brand` override. Everything else (the map app,
> charger detail pages, stats, forms, legal pages) is `product`.

## Users

- **EV drivers and prospective buyers in Pakistan.** On their phone, often
  before or during a trip, frequently anxious about whether they can charge
  along their route. They want a fast answer to "where can I charge, is it open,
  what power, what price" without friction.
- **Community contributors and admins.** EV enthusiasts who add and maintain
  charger listings, confirm prices, and leave comments/reactions. They value
  accuracy, attribution, and low-ceremony editing directly on the map.

The job to be done: remove range anxiety by making charging-station information
discoverable, current, and trustworthy.

## Product Purpose

ChargeMap PK is Pakistan's community-driven directory of EV charging stations,
presented as an interactive map plus per-city and per-charger pages. It exists
because reliable, nationwide charging data did not exist in one accessible
place, and that gap slows EV adoption. Success looks like a driver finding a
usable charger in seconds, trusting the data enough to act on it, and the
community keeping it current. It is free, open, and installable as a PWA.

## Brand Personality

Trustworthy, community-powered, energetic. The voice is plain-spoken and
practical, never hype: it states what is known, flags what is tentative (prices
are community-entered, confirm by phone), and credits the people behind the
data. It should feel like infrastructure built by people who actually drive
EVs, not a venture-funded app trying to look slick.

Emotional goal: turn range anxiety into route confidence.

## Anti-references

- Generic AI/SaaS landing-page clichés: the hero-metric template (giant number,
  small label, gradient accent), endless identical icon-title-text card grids.
- Greenwashing eco-clichés: leaf motifs, "save the planet" stock imagery, the
  reflexive "EV therefore bright eco-green on white".
- Gradient text (`background-clip: text`), decorative glassmorphism, and
  colored side-stripe borders (`border-left` > 1px) as accents.
- Cluttered, control-heavy map UIs that bury the answer under chrome.
- Marketing copy padded with em dashes and adjectives that restate the heading.

## Design Principles

- **Proof over promise.** Lead with real, live numbers (station counts, cities,
  DC chargers, open-now status), not marketing claims. The data is the pitch.
- **Range confidence first.** Surface what a driver decides on (power, price,
  open-now, connector) earliest and most prominently. Reduce anxiety, fast.
- **Honest by default.** Mark tentative data as tentative, show who added or
  updated each listing, and make confirming (a phone number, a call) one tap.
- **Mobile-first and fast.** Drivers are on phones, sometimes on slow
  connections. Pages must be quick, touch-friendly, and never block the answer.
- **Community in the loop.** Make contributing, commenting, and correcting
  feel native and welcome; the product is only as good as its contributors.

## Accessibility & Inclusion

- Target WCAG 2.1 AA: sufficient contrast in both light and dark themes,
  visible focus rings (`focus:ring-2` on interactive elements), and semantic
  HTML with proper headings and labels.
- Respect `prefers-reduced-motion`: decorative motion (pin pulses, count-ups,
  entrance reveals) must degrade gracefully.
- Support light and dark themes with system-preference detection.
- Keep tap targets comfortable on mobile; the bottom sheet and filters must be
  usable one-handed.
