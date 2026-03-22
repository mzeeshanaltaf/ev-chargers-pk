# ChargeMap PK — EV Chargers in Pakistan

An interactive map application for discovering and adding EV charging stations across Pakistan. Built with Next.js 15, Leaflet, and Tailwind CSS.

![ChargeMap PK](public/favicon.png)

## Features

- **Interactive Map** — Full-screen Leaflet map of Pakistan with bounded navigation
- **Charger Markers** — Green (active) and gray (inactive) pins with hover popups and click-to-select
- **Sidebar List** — Scrollable card list synced with the map; clicking a card flies to that charger
- **Filters** — Filter by province, city, location type, cost range, and 24-hour availability
- **Add Charger** — Form with an embedded location picker map (click or right-click to drop a pin)
- **My Location** — Geolocation button centers the map on the user's position with a blue dot
- **Fit All** — One-click button zooms to show all chargers on screen
- **Dark / Light Theme** — System-aware theme toggle with matching CartoDB map tiles
- **Static Pages** — About, Terms of Service, Privacy Policy, and Contact Us pages

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 (CSS variable theming) |
| Map | Leaflet + react-leaflet v5 |
| Data Fetching | SWR (client-side, localStorage-persisted cache) |
| Animations | Framer Motion |
| Fonts | DM Sans (body) + Space Grotesk (headings) |
| Map Tiles | CartoDB Positron (light) / Dark All (dark) |

## Getting Started

### Prerequisites

- Node.js 18+
- An n8n instance with a webhook configured to handle EV charger data

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
│   │   ├── chargers/route.ts   # Proxy to n8n charger webhook
│   │   └── contact/route.ts    # Proxy to n8n contact webhook
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── add-charger/            # Add charger modal + form + location picker
│   ├── filters/                # Filter bar, dropdowns, range slider, toggles
│   ├── map/                    # Leaflet map wrapper, markers, popups
│   ├── ui/                     # Shared UI (button, input, modal, toast)
│   └── ...                     # Header, app shell, charger cards, etc.
├── hooks/
│   ├── use-chargers.ts         # SWR data hook with optimistic add
│   ├── use-filters.ts          # Filter state + filterChargers()
│   └── use-toast.ts
└── lib/
    ├── map-constants.ts        # Pakistan bounds, zoom levels, tile URLs
    ├── types.ts
    ├── format.ts
    └── validate.ts
```

## API Integration

The app uses Next.js Route Handlers as server-side proxies to keep API keys out of the browser.

| Route | n8n Event |
|---|---|
| `GET /api/chargers` | `get_ev_chargers` |
| `POST /api/chargers` | Insert new charger |
| `POST /api/contact` | Contact form submission |

All requests to n8n include an `x-api-key` header for authentication.

## Deployment

The app can be deployed on [Vercel](https://vercel.com) or any Node.js host. Set the environment variables in your hosting provider's dashboard.

```bash
# Vercel
vercel --prod
```

## License

MIT
