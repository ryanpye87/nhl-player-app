# 🏒 NHL Player Compare

A single-page application for comparing NHL player stats head-to-head using a Football Manager-style attribute polygon (radar chart).

## Features

- **Player search** — typeahead search with team filter across all active NHL players
- **Position locking** — selecting a goalie locks both slots to goalie-only comparison with a dedicated goalie stat line
- **Side-by-side comparison** — two player headshots and cards flank a shared radar chart
- **Attribute polygon** — SVG radar chart with 10 axes for skaters (8 for goalies), plotting percentile ranks (0–99) with overlaid colored polygons per player
- **Stat comparison table** — side-by-side raw numbers with the higher value bolded per row
- **Swap** — one-click button to flip the two players

## Architecture

```
nhl-player-api/ (Express 5 + MongoDB)
  POST /players/aggregate     Seed aggregated stats from NHL API
  POST /players/batch         Batch fetch: aggregated stats + percentiles
  GET  /players/percentiles/:id  Single-player percentile ranks

nhl-player-app/ (React 19 + Vite 6)
  usePlayerList()             → GET /players
  usePlayerBatch(idA, idB)    → POST /players/batch  (one call, not N+1)
```

The frontend makes **2 API calls total** for any two-player comparison (player list + batch), down from the original 7 calls. Percentile computation shares peer queries across players of the same position type.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + shadcn/ui v4 (Base UI primitives) |
| Charts | Hand-rolled SVG radar polygon |
| Icons | Lucide React |
| Unit / integration tests | Vitest + Testing Library (fast, every save) |
| E2E tests | Playwright (real browser, pre-push) |
| API | Express 5 + Mongoose 9 |
| Database | MongoDB Atlas |
| Data | NHL API (stats + landing endpoints) |

## Getting Started

The frontend depends on the API server running at `http://localhost:3001`.

```bash
# 1. Start the API (separate terminal)
cd ../nhl-player-api
npm run dev                          # Express on port 3001

# 2. Seed player data (first time only)
npm run seed                         # Populates the Player collection
curl -X POST http://localhost:3001/players/aggregate  # Populates AggregatedStats

# 3. Start the frontend
cd ../nhl-player-app
npm install
npm run dev                          # Vite on port 5173

# 4. Run tests
npm test                             # Vitest (unit + integration, ~2s)
npx playwright test                  # Playwright (E2E, ~11s)
npm run test:watch                   # Vitest in watch mode
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, Input, Select, …)
│   ├── PlayerSearch.tsx  # Player typeahead + team filter
│   ├── PlayerDisplay.tsx # Side-by-side comparison layout
│   ├── PlayerImage.tsx   # Player headshot card
│   ├── StatsBox.tsx      # Stats table card
│   └── RadarChart.tsx    # SVG radar polygon (hand-rolled)
├── hooks/
│   ├── usePlayerData.ts  # Player list + single-player detail
│   └── usePlayerBatch.ts # Batch fetch: aggregated stats + percentiles
├── lib/
│   ├── utils.ts          # cn() classname utility
│   ├── radar.ts          # Radar polygon coordinate math
│   └── teams.ts          # Team color map
├── App.tsx               # Root — wires hooks to components
├── main.tsx
└── index.css             # Tailwind + shadcn design tokens
e2e/
└── smoke.spec.ts         # Playwright E2E smoke tests
docs/
└── PRD.md                # Full product requirements + testing strategy
```

The companion API lives in `../nhl-player-api/`:
```
src/
├── routes/
│   ├── players.ts        # GET /players, POST /players/batch
│   └── stats.ts          # POST /aggregate, GET /percentiles/:id
├── models/
│   ├── Player.ts         # Player roster (seeded from NHL API)
│   ├── AggregatedStats.ts # Pre-computed season stats
│   └── PlayerCache.ts    # NHL landing API cache (per-player, 24h TTL)
├── utils/
│   └── percentiles.ts    # Shared percentile computation
└── seed.ts               # Populates Player + AggregatedStats collections
```

## Design System

This project uses **shadcn/ui v4** with the `base-vega` style. All colors reference CSS custom properties defined in `src/index.css` — never hardcoded hex values. The dark theme is the default.

See [docs/PRD.md](docs/PRD.md) for the full product requirements document.

## Roadmap

- [x] Player search & display
- [x] shadcn/ui integration (Button, Card, Input, Select)
- [x] Two-player comparison with radar polygon
- [x] Goalie-only comparison mode with position locking
- [x] Percentile-based normalization (0–99 scale)
- [x] Batch API endpoint (eliminates N+1 per-player calls)
- [x] E2E smoke tests (Playwright)
- [ ] Stat category toggles (Offense / Defense / Overall)
- [ ] Advanced stats (xGF, xGA, Corsi) — needs secondary data source
- [ ] Position-group & rookie normalization filters
