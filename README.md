# ChargeMap PK — EV Chargers in Pakistan

A community-driven directory for discovering and adding EV charging stations across Pakistan: a marketing landing page at `/` plus an interactive map app at `/map`. Built with Next.js 16, Leaflet, and Tailwind CSS.

![ChargeMap PK](public/favicon.png)

## Features

- **Marketing Landing** — Dedicated landing page at `/` with live stats, feature highlights, popular cities, and clear paths into the app (the interactive map lives at `/map`)
- **Interactive Map** — Full-screen Leaflet map of Pakistan with bounded navigation
- **Charger Markers** — Green (active) and gray (inactive) pins with hover popups and click-to-select
- **Sidebar List** — Scrollable card list synced with the map; clicking a card flies to that charger
- **Collapsible Sidebar** — Toggle sidebar on desktop; draggable bottom sheet on mobile
- **Filters** — Filter by province, city, location type, cost range, and 24-hour availability
- **My Location** — Geolocation button centers the map on the user's position with a blue dot
- **Fit All** — One-click button zooms to show all chargers on screen
- **Dark / Light Theme** — System-aware theme toggle with matching CartoDB map tiles
- **City & Charger Pages** — SEO-friendly city lists (`/chargers/[city]`) and per-charger detail pages (`/chargers/[city]/[slug]`) with full info, record metadata (added/updated by), `EVChargingStation` JSON-LD, and community comments
- **Comments & Reactions** — Any visitor can register with a name + math captcha, leave comments, and like/dislike reactions with toggle support
- **Stats Page** — Live statistics: total chargers, DC/AC split, 24-hour availability, currently open, and breakdowns by province and location type
- **Authentication** — Sign in with email/password; only authorized users can add chargers
- **Add Charger** — Form with embedded location picker map; supports click or right-click to drop a pin (authenticated users only)
- **Static Pages** — About, Stats, Credits, Terms of Service, Privacy Policy, and Contact Us
- **Contact Form** — Bot protection via honeypot field and math captcha challenge

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 (CSS variable theming) |
| Map | Leaflet + react-leaflet v5 |
| Data Fetching | SWR (client-side, localStorage-persisted cache) |
| Animations | Framer Motion |
| Fonts | App: DM Sans (body) + Space Grotesk (headings); Landing: Hanken Grotesk + Bricolage Grotesque |
| Map Tiles | CartoDB Positron (light) / Dark All (dark) |

## Getting Started

### Prerequisites

- Node.js 18+
- An n8n instance with webhooks configured (see [API Integration](#api-integration) below)

### Environment Variables

Create a `.env.local` file in the project root:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance/webhook/your-webhook-id
N8N_API_KEY=your-api-key
```

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/route.ts       # Proxy to n8n authenticate_user webhook
│   │   ├── chargers/route.ts   # Proxy to n8n charger webhook
│   │   ├── comments/route.ts   # Proxy to n8n get_comments / add_comment / add_comment_reaction
│   │   ├── contact/route.ts    # Proxy to n8n contact webhook
│   │   └── users/route.ts      # Proxy to n8n register_user webhook
│   ├── page.tsx                # Marketing landing page (server component)
│   ├── map/page.tsx            # Interactive map app (AppShell)
│   ├── chargers/[city]/        # City list + [slug] detail page (+ OG image)
│   ├── [id]/page.tsx           # Legacy redirect to canonical charger path
│   ├── about/ contact/ credits/ privacy/ stats/ terms/   # Info pages
│   ├── sitemap.ts robots.ts manifest.ts opengraph-image.tsx
│   ├── globals.css             # Theme tokens (app) + landing (.landing-root)
│   └── layout.tsx              # Fonts + global metadata + JSON-LD
├── components/
│   ├── add-charger/            # Add charger modal + form + location picker
│   ├── edit-charger/           # Edit charger modal
│   ├── auth/                   # Sign-in modal
│   ├── filters/                # Filter bar, dropdowns, range slider, toggles
│   ├── map/                    # Leaflet map wrapper, markers, popups
│   ├── landing/                # Landing page sections (hero, stats, features…)
│   ├── ui/                     # Shared UI (button, input, modal, toast)
│   ├── auth-provider.tsx       # Auth context + localStorage persistence
│   └── ...                     # Header, app shell, charger cards, etc.
├── hooks/
│   ├── use-chargers.ts         # SWR data hook with optimistic add/edit/delete
│   ├── use-filters.ts          # Filter state + filterChargers()
│   └── use-toast.ts
└── lib/
    ├── charger-fetch.ts        # Server-side fetchChargers() (cached)
    ├── slug.ts                 # Canonical city/charger paths + slugs
    ├── map-constants.ts        # Pakistan bounds, zoom levels, tile URLs
    ├── types.ts
    ├── format.ts
    └── validate.ts
```

Strategic and visual design context for the project lives in `PRODUCT.md` and
`DESIGN.md` at the repo root; agent/contributor guidance lives in `CLAUDE.md`.

## API Integration

All requests are proxied through Next.js Route Handlers to keep the API key server-side.

| Route | Method | n8n Event |
|---|---|---|
| `/api/chargers` | GET | `get_ev_chargers` |
| `/api/chargers` | POST | `insert_ev_charger` |
| `/api/auth` | POST | `authenticate_user` |
| `/api/contact` | POST | Contact form submission |
| `/api/comments` | GET | `get_comments` |
| `/api/comments` | POST | `add_comment` / `add_comment_reaction` |
| `/api/users` | POST | `register_user` |

All requests to n8n include an `x-api-key` header for authentication.

### Authentication (n8n side)

The `authenticate_user` webhook branch expects a `users` table:

```sql
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  is_admin    BOOLEAN DEFAULT false,  -- only admins can add chargers
  is_active   BOOLEAN DEFAULT true,   -- soft-disable without deleting
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

n8n workflow for `authenticate_user`:
1. Query DB by email where `is_active = true`
2. Compare submitted password against stored bcrypt hash (Function node with `bcryptjs`)
3. Return `{ "authorized": true, "user": { ... } }` if credentials are valid **and** `is_admin = true`
4. Return `{ "authorized": false, "message": "Invalid email or password" }` otherwise

Users are pre-created by an admin — there is no self-registration flow.

## Deployment

The app can be deployed on [Vercel](https://vercel.com) or any Node.js host. Set the environment variables in your hosting provider's dashboard.

```bash
# Vercel
vercel --prod
```

## License

MIT
