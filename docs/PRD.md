# Product Requirements Document — NHL Player Comparison

## Overview

**NHL Player Compare** is a single-page application (SPA) that lets a user select two NHL players and displays them side by side with a shared attribute polygon (radar chart) in the center. The polygon plots each player's key stats on independent axes, with lines connecting each player's values to form two overlaid colored polygons — identical to the Football Manager player attribute chart.

---

## User Stories

### US-1: Select two players
As a user, I can search for and select two NHL players so that I can compare them head-to-head.

**Acceptance criteria:**
- Two independent player search fields are visible (Player A / Player B)
- Each search field supports typeahead filtering by player name
- Selecting a player populates that slot with the player's name, team, position, and headshot
- A "Swap" button lets the user flip the two players
- **Position locking:** selecting a goalie in one slot filters the other slot's search to goalies only. Skaters and goalies cannot be cross-compared — they play fundamentally different games with different stat lines. If a skater is selected first, the second slot shows only skaters; if a goalie is selected first, the second slot shows only goalies
- If only one player is selected, the polygon shows just that player

### US-2: View the attribute polygon
As a user, I can see a radar/spider chart that plots each player's key stats on labeled axes, so I can visually compare their strengths and weaknesses.

**Acceptance criteria:**
- The chart renders as a regular polygon with 10 axes radiating from center at 36° intervals (Overall view). Category-specific views (Offense, Defense) may use fewer axes
- Each axis is labeled with the stat name at its outer tip
- Axis values are normalized to a 0–99 scale using percentile rank among all qualified NHL players (min 10 GP for skaters, min 5 GP for goalies)
- Player A's values are connected with one color (e.g., team primary or a fixed accent)
- Player B's values are connected with a contrasting color
- The area inside each polygon is semi-transparent so overlap is visible
- A legend identifies which color belongs to which player
- Hovering a vertex shows a tooltip with: player name, stat name, raw value, and percentile

### US-3: Read the stat summary
As a user, I can see a table or list of the compared stats with both players' values, so I can read the exact numbers.

**Acceptance criteria:**
- A stats table sits below (or beside) the polygon chart
- Each row shows: stat name → Player A value → Player B value
- The higher value in each row is visually highlighted (green text or bold)
- Stats are grouped by category (e.g., Offense, Defense, Physical)

### US-4: Toggle stat categories
As a user, I can choose which category of stats to display on the polygon (Offense / Defense / Overall), so I can focus on specific aspects of the game.

**Acceptance criteria:**
- A segmented control or tab bar lets the user choose: Offense | Defense | Overall
- "Overall" shows 10 stats spanning all categories (the default view)
- Switching categories re-renders the polygon with the relevant axes
- The stat table updates accordingly

### US-5: Handle empty and edge cases
As a user, I get clear feedback when something goes wrong or data is unavailable.

**Acceptance criteria:**
- If a player has no stats for the current season, the slot shows "No 2025–26 data" 
- If the API is unavailable, an error banner appears with a retry button
- If two players are selected but one has incomplete data, missing stats display as "—" and are excluded from the polygon for that player (the axis still renders, but that player's point sits at zero)
- A loading skeleton is shown while player data is fetching

---

## Data & Stats

### API Source
NHL API (already integrated via `usePlayerData` hook). The existing API returns player info, team, position, image, and season stats.

### Stat Categories & Axes

**Overall (10 axes — the default polygon):**

| # | Axis | Stat | Category |
|---|------|------|----------|
| 1 | G | Goals | Offense |
| 2 | A | Assists | Offense |
| 3 | PTS | Points | Offense |
| 4 | S | Shots on Goal | Offense |
| 5 | SH% | Shooting Percentage | Offense |
| 6 | TOI/G | Time on Ice per Game | Usage |
| 7 | HIT | Hits | Physical |
| 8 | BKS | Blocked Shots | Defense |
| 9 | +/– | Plus/Minus | Defense |
| 10 | PIM* | Penalty Minutes (inverted) | Discipline |

*\*PIM is inverted: fewer penalty minutes = higher rating.*

**Goalie Overall (separate axes — only shown when both slots are goalies):**

| # | Axis | Stat | Category |
|---|------|------|----------|
| 1 | W | Wins | Results |
| 2 | GAA* | Goals Against Average (inverted) | Performance |
| 3 | SV% | Save Percentage | Performance |
| 4 | SO | Shutouts | Results |
| 5 | GSAA | Goals Saved Above Average | Advanced |
| 6 | GS | Games Started | Usage |
| 7 | TOI/G | Time on Ice per Game | Usage |
| 8 | QS% | Quality Start % | Consistency |

*\*GAA is inverted: lower GAA = higher rating.*

**Offense view** (subset focused on scoring):
Goals, Assists, Points, Shots, Shooting %, Time on Ice per Game, Power Play Goals, Game-Winning Goals

**Defense view** (subset focused on defensive play):
+/–, Blocked Shots, Hits, Takeaways, Giveaways\* (inverted), Faceoff %, Shorthanded TOI/G, PIM\* (inverted)

*\*Inverted stats: lower raw value = higher normalized score.*

### Future Stats (v2+)

These require an additional data source (e.g., Natural Stat Trick, Evolving-Hockey, or NHL's edge data API):

| Stat | Description |
|------|-------------|
| xGF | Expected Goals For — shot quality weighted by location, type, and context |
| xGA | Expected Goals Against — same model applied to shots against |
| Corsi (CF%) | Shot attempt share (shots + blocks + misses) while player is on ice |
| Fenwick (FF%) | Unblocked shot attempt share (Corsi minus blocked shots) |
| PDO | On-ice save% + shooting% — a proxy for luck/sustainability |
| oZS% | Offensive zone start percentage — context for possession stats |

These would be added as a new category toggle: **Advanced**.

### Normalization

- Raw stats (goals, assists, etc.) are normalized to a **0–99 scale**
- Normalization uses **percentile rank among all qualified NHL players** (min 10 GP for skaters, min 5 GP for goalies) for the current season — not split by position
- The 99th-percentile player in each stat gets a score of 99; the 1st-percentile player gets a score of 1
- If percentile data is unavailable (API limitation), fall back to **min-max normalization** within the league
- Goalie stats are normalized against all qualified goalies (separate pool from skaters)

### Future: Position & Rookie Filtering (v2+)

The v1 baseline compares against the entire league. A future enhancement will let the user scope the normalization pool:
- **Position-group comparison** — compare a center only against other centers, a defenseman against defensemen, etc. This answers "how good is this player *for their role*" rather than "how good is this player vs. everyone"
- **Rookie comparison** — normalize against first-year players only, useful for Calder Trophy debates
- **Age-group comparison** — U21 / U24 / 30+ brackets

These filters will be presented as a dropdown or segmented control near the category toggle, defaulting to "All Players."

---

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  🏒 NHL Player Compare                                  │
├────────────────────┬───────────────┬────────────────────┤
│                    │               │                    │
│   [Player A]       │               │   [Player B]       │
│   ┌───────────┐    │               │   ┌───────────┐    │
│   │  Search   │    │   [SWAP ⇄]    │   │  Search   │    │
│   └───────────┘    │               │   └───────────┘    │
│                    │               │                    │
│   ┌───────────┐    │   ┌───────┐   │   ┌───────────┐    │
│   │  Photo    │    │   │       │   │   │  Photo    │    │
│   │           │    │   │ Radar │   │   │           │    │
│   │ #87 C     │    │   │ Chart │   │   │ #97 C     │    │
│   │ PIT       │    │   │       │   │   │ EDM       │    │
│   └───────────┘    │   └───────┘   │   └───────────┘    │
│                    │               │                    │
├────────────────────┴───────────────┴────────────────────┤
│  [ Offense │ Defense │ Overall ]   ← category toggle     │
│                                                         │
│  Stat           Player A        Player B                │
│  ─────────────────────────────────────                  │
│  Goals            42 ██          64 ████  ← higher bold │
│  Assists          38 ██          89 █████                │
│  Points           80 ███        153 ██████               │
│  ...                                                    │
└─────────────────────────────────────────────────────────┘
```

---

## Component Architecture

```
App
├── PlayerSlot (×2)           ← search input + player card
│   ├── Input                  ← shadcn Input (reuse existing)
│   ├── PlayerImage             ← shadcn Card + img (reuse existing)
│   └── PlayerQuickStats        ← name, position, team badge
├── CompareView               ← the central comparison area
│   ├── SwapButton             ← shadcn Button (icon only)
│   ├── RadarChart             ← the octagon/polygon (new)
│   │   ├── RadarAxes           ← SVG axes + labels
│   │   ├── RadarPolygon        ← SVG polygon for one player
│   │   └── RadarTooltip        ← hover tooltip
│   └── StatCategoryToggle     ← segmented control (new)
├── StatsTable                ← side-by-side stat rows
│   └── StatRow (×N)           ← single stat comparison row
└── ErrorBanner               ← error/empty states (shadcn Alert)
```

### New shadcn components needed
- `Tabs` or `ToggleGroup` — for the stat category switcher
- `Tooltip` — for hover details on polygon vertices
- `Badge` — for team abbreviation chips
- `Alert` — for error/empty state banners
- `Skeleton` — for loading states

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Chart rendering | **SVG** (hand-rolled) | Full control over polygon axes (10-sided for Overall, 8-sided for category views), labels, and polygon styling; no heavy chart library needed for a shape this simple |
| State management | **React context + useReducer** | Two player selections + stats + category toggle is complex enough to warrant a reducer |
| Normalization | **Percentile rank** with min-max fallback | Percentiles are more intuitive for "how good is this player" comparisons |
| Responsive layout | **CSS Grid** with stacked layout on mobile | Side-by-side comparison collapses to vertical on narrow viewports |
| Data fetching | Extend existing `usePlayerData` hook | Already fetches from NHL API; add a second player + stats normalization |

### SVG Radar Chart Spec

```
Canvas: 300×300 viewBox centered at (150, 150)
Radius: 120px
Axes (Overall): 10 lines from center at 36° intervals (0°, 36°, 72°, ..., 324°)
  - Axis 0 starts at top (12 o'clock) and proceeds clockwise
  - Category views (Offense/Defense) use 8 axes at 45° intervals
Background rings: 5 concentric polygons at 20%, 40%, 60%, 80%, 100% radius
  - Each ring is a decagon (Overall) or octagon (category views)
  - Rings rendered as <polygon> elements with light stroke, no fill
Labels: positioned at 132px radius along each axis, text-anchor depends on quadrant
Polygon: connect the N (r, θ) points for each player's normalized values
Colors: Player A = hsl(var(--primary)), Player B = hsl(var(--chart-2))
Fill opacity: 0.2
Stroke width: 2px
```

---

## Testing Strategy

### Test Layers

```
┌─────────────────────────────────────────┐
│  E2E (Playwright)                       │
│  Real browser ↔ real API ↔ real MongoDB │  ← catches: routing, API contracts,
│                                          │     rendering, user interactions
├─────────────────────────────────────────┤
│  Integration (Vitest + Testing Library) │
│  Render components, mock fetch          │  ← catches: component logic, state,
│                                          │     hooks, edge cases
├─────────────────────────────────────────┤
│  Unit (Vitest)                          │
│  Pure functions, utilities, types       │  ← catches: normalization, formatting,
│                                          │     data transforms
└─────────────────────────────────────────┘
```

**Why each layer matters:**

- **Unit tests** are fast and precise but can't catch integration failures — like the `ReturnType<typeof usePlayerDetail>` type reference breaking the component tree, or `POST /batch` returning 404 because the route was in the wrong Express router.
- **Component integration tests** verify hooks wire up correctly and components render with mock data, but they mock `fetch` — so API contract mismatches (wrong endpoint, wrong response shape) are invisible.
- **E2E tests** use a real browser against real servers. They catch every class of bug the other layers miss. The trade-off is speed (~10–30s per test), so they run on PRs and merges, not on every file save.

### Playwright E2E Tests

**Setup:** Playwright starts the Vite dev server and hits the real API + MongoDB. Test data is seeded via `POST /players/aggregate` before the test run.

**Core smoke tests (block merging if these fail):**

| Test | What it verifies |
|------|-----------------|
| App loads | Player list populates in both search dropdowns |
| Select two skaters | Radar chart + stats table render with percentile data |
| Select two goalies | Goalie axes render, position locking works |
| Swap players | Swap button flips Player A and Player B |
| Single player | Radar shows one polygon when only one player is selected |
| API error | Error banner appears when the API is unreachable |

**Test data strategy:** Tests use the real NHL API data seeded into MongoDB. This avoids maintaining fake data that drifts from the real API shape. The aggregate job is idempotent — re-running it refreshes the test data.

### Existing Vitest Suite (unchanged)

- `usePlayerData.test.tsx` — player list and detail fetching
- `StatsBox.test.tsx` — stat table rendering
- `RadarChart.test.tsx` — SVG polygon rendering
- `PlayerSearch.test.tsx` — search/dropdown UX
- `PlayerImage.test.tsx` — image fallback behavior

These continue to run on every file save via `vitest watch`. They're fast (< 3s total) and catch component-level regressions.

### Running Tests

```bash
# Unit + integration (fast, every save)
npm test

# E2E (slower, before push/merge)
npx playwright test

# All together
npm test && npx playwright test
```

## Out of Scope (v1)

- Comparing more than 2 players
- Historical season comparison (v1 uses current season only)
- Player career trend sparklines
- Sharing comparison via URL
- Printing/exporting the comparison as an image
- Mobile app (PWA can come later)

---

## Success Metrics

- A user can select two players and see the radar chart in under 3 seconds from selection
- The radar chart accurately reflects real NHL stats normalized to 0–99
- Side-by-side layout works on viewports ≥ 768px wide; stacks vertically below that
- All states are handled: loading, empty, error, single-player, and two-player comparison
