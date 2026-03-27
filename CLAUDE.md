# BlockedOff Sports

Sports calendar subscription platform. Users pick a tournament, pick a country, then get a live-updating calendar (webcal://) for their country's games.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **React:** 19
- **Styling:** Tailwind CSS v4 with CSS custom properties (`@theme inline`)
- **Calendar:** `ical-generator` v10 for ICS generation
- **Language:** TypeScript 5
- **No database** — all data is static JSON files in `src/data/`

## Project Structure

```
src/
├── app/
│   ├── page.tsx           # Main UI — single "use client" component with 3-step wizard
│   ├── layout.tsx         # Root layout with Geist fonts
│   ├── globals.css        # CSS variables + Tailwind v4 theme mapping
│   └── api/
│       ├── calendar/route.ts   # ICS generation endpoint (webcal + download)
│       ├── events/route.ts     # Filtered events JSON endpoint
│       └── tournaments/route.ts # Tournaments list endpoint
├── data/
│   ├── countries.ts       # 30 countries with alpha-3 codes, flag emoji generation
│   ├── countryColors.ts   # Accent color schemes per country (accent, hover, text contrast)
│   ├── schedule.json      # All events across tournaments (scores/stats for past events)
│   └── tournaments.json   # Tournament definitions (3 tournaments)
└── lib/
    └── types.ts           # TypeScript interfaces (Tournament, ScheduleEvent, Country, PlayerStat)
```

## Key Architecture Decisions

- **Theming via CSS variables:** The entire accent color system uses `--accent`, `--accent-hover`, and `--accent-text` on `:root`. These are dynamically set via `document.documentElement.style` when a country is selected, enabling per-country color theming with zero class changes.
- **URL-driven state:** Tournament, country, sports filter, and knockouts flag are all stored in URL search params for shareability and persistence.
- **Static data with optional enrichment:** Events have optional `score`, `result`, and `playerStats` fields. Past events include these; future events omit them.
- **ICS subscription:** The `/api/calendar` route outputs RFC 5545 ICS with `REFRESH-INTERVAL:PT6H` and `X-PUBLISHED-TTL:PT6H` so calendar apps auto-refresh.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

## Conventions

- Single-file UI in `page.tsx` — all state, handlers, and JSX in one `ScheduleApp` component
- Dark theme only (background `#0f172a`)
- Country colors must have good contrast on dark backgrounds; yellow-accent countries (BRA, DEU, SWE, BEL) use dark text on accent via `--accent-text`
- Event scores use `"W" | "L" | "D" | "N/A"` result maps keyed by country alpha-3 code
- ICS events include scores and player stats in the description for completed events
