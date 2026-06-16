# 🏒 NHL Player Compare

A single-page application for comparing NHL player stats head-to-head using a Football Manager-style attribute polygon (radar chart).

## Features

- **Player search** — typeahead search across all active NHL players
- **Side-by-side comparison** — two player cards flank a shared radar chart
- **Attribute polygon** — 10-axis decagon plotting normalized stats (0–99 percentile scale) with overlaid colored polygons for each player
- **Stat categories** — toggle between Overall, Offense, and Defense views
- **Goalie mode** — selecting a goalie locks both slots to goalie-only comparison with a dedicated goalie stat line
- **Stat table** — side-by-side raw numbers with the higher value highlighted per row
- **Swap** — one-click button to flip the two players

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + shadcn/ui v4 (Base UI primitives) |
| Charts | Hand-rolled SVG radar polygon |
| Icons | Lucide React |
| Testing | Vitest + Testing Library |
| Data | NHL API |

## Getting Started

```bash
npm install
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
npm test           # Run tests
npm run test:watch # Run tests in watch mode
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, Input, Select, …)
│   ├── PlayerSearch.tsx  # Player typeahead + team filter
│   ├── PlayerDisplay.tsx # Side-by-side comparison layout
│   ├── PlayerImage.tsx   # Player headshot card
│   └── StatsBox.tsx      # Stats table card
├── hooks/
│   └── usePlayerData.ts  # NHL API data fetching
├── lib/
│   └── utils.ts          # cn() classname utility
├── App.tsx
├── main.tsx
└── index.css             # Tailwind + shadcn design tokens
```

## Design System

This project uses **shadcn/ui v4** with the `base-vega` style. All colors reference CSS custom properties defined in `src/index.css` — never hardcoded hex values. The dark theme is the default.

See [docs/PRD.md](docs/PRD.md) for the full product requirements document.

## Roadmap

- [x] Player search & display
- [x] shadcn/ui integration (Button, Card, Input, Select)
- [ ] Two-player comparison with radar polygon
- [ ] Goalie-only comparison mode
- [ ] Stat category toggles (Offense / Defense / Overall)
- [ ] Advanced stats (xGF, xGA, Corsi) — needs secondary data source
- [ ] Position-group & rookie normalization filters
