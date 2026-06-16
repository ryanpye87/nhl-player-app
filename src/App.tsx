import { useState, useMemo } from "react"
import { PlayerDetail, SkaterStats, GoalieStats } from "./types"
import { usePlayerList } from "./hooks/usePlayerData"
import { usePlayerBatch } from "./hooks/usePlayerBatch"
import PlayerSearch from "./components/PlayerSearch"
import { RadarChart } from "./components/RadarChart"
import type { RadarAxis, RadarPlayerData } from "./components/RadarChart"
import { Card, CardHeader, CardTitle, CardContent } from "./components/ui/card"
import { Button } from "./components/ui/button"
import { ArrowLeftRight } from "lucide-react"
import { getTeamColor } from "./lib/teams"

// ── Radar axes ──────────────────────────────────────────────────────

const SKATER_AXES: RadarAxis[] = [
  { key: "goals", label: "G", description: "Goals" },
  { key: "assists", label: "A", description: "Assists" },
  { key: "points", label: "PTS", description: "Points" },
  { key: "shots", label: "S", description: "Shots" },
  { key: "shootingPctg", label: "SH%", description: "Shooting %" },
  { key: "avgToi", label: "TOI/G", description: "Time on Ice / Game" },
  { key: "hits", label: "HIT", description: "Hits" },
  { key: "blockedShots", label: "BKS", description: "Blocked Shots" },
  { key: "plusMinus", label: "+/−", description: "Plus/Minus" },
  { key: "pim", label: "PIM", description: "Penalty Minutes" },
]

const GOALIE_AXES: RadarAxis[] = [
  { key: "wins", label: "W", description: "Wins" },
  { key: "losses", label: "L", description: "Losses" },
  { key: "otLosses", label: "OTL", description: "OT Losses" },
  { key: "shutouts", label: "SO", description: "Shutouts" },
  { key: "savePctg", label: "SV%", description: "Save %" },
  { key: "goalsAgainstAvg", label: "GAA", description: "Goals Against Avg" },
  { key: "avgToi", label: "TOI/G", description: "Time on Ice / Game" },
  { key: "gamesPlayed", label: "GP", description: "Games Played" },
]

// ── Helpers ─────────────────────────────────────────────────────────

function buildRadarPlayer(
  detail: PlayerDetail | null,
  percentiles: Record<string, number> | null,
  color: string,
): RadarPlayerData | null {
  if (!detail || !percentiles) return null
  return {
    label: detail.player.fullName,
    color,
    values: percentiles,
  }
}

function formatStatValue(key: string, stats: SkaterStats | GoalieStats): string {
  const v = (stats as any)[key]
  if (v == null) return "—"
  if (key === "shootingPctg") return `${(v * 100).toFixed(1)}%`
  if (key === "savePctg") return v.toFixed(3)
  if (key === "goalsAgainstAvg") return v.toFixed(2)
  if (key === "avgToi") return `${Math.floor(v)}:${String(Math.round((v % 1) * 60)).padStart(2, "0")}`
  return String(v)
}

// ── App ─────────────────────────────────────────────────────────────

function App() {
  const { players, loading: listLoading } = usePlayerList()

  const [idA, setIdA] = useState<number | null>(null)
  const [idB, setIdB] = useState<number | null>(null)

  const {
    detailA, detailB,
    pctA, pctB,
    loading: batchLoading,
  } = usePlayerBatch(idA, idB)

  // Goalie locking — enforce same position type
  const posA = detailA?.player.position
  const posB = detailB?.player.position
  const filterA: "skater" | "goalie" | undefined =
    posB === "G" ? "goalie" : posB && posB !== "G" ? "skater" : undefined
  const filterB: "skater" | "goalie" | undefined =
    posA === "G" ? "goalie" : posA && posA !== "G" ? "skater" : undefined

  // Axes depend on position type
  const isGoalie = posA === "G" || posB === "G"
  const axes = isGoalie ? GOALIE_AXES : SKATER_AXES

  // Build radar players
  const radarPlayers = useMemo(() => {
    const list: RadarPlayerData[] = []
    const colorA = detailA ? getTeamColor(detailA.player.teamAbbrev) : "#888"
    const colorB = detailB ? getTeamColor(detailB.player.teamAbbrev) : "#888"
    const a = buildRadarPlayer(detailA, pctA, colorA)
    const b = buildRadarPlayer(detailB, pctB, colorB)
    if (a) list.push(a)
    if (b) list.push(b)
    return list
  }, [detailA, pctA, detailB, pctB])

  // Stats table data
  const statKeys = useMemo(() => {
    if (!detailA?.stats || !detailB?.stats) return []
    const isG = detailA.stats.type === "goalie"
    if (isG) {
      return [
        "gamesPlayed", "wins", "losses", "otLosses", "shutouts",
        "savePctg", "goalsAgainstAvg", "avgToi",
      ] as const
    }
    return [
      "gamesPlayed", "goals", "assists", "points", "plusMinus",
      "shots", "shootingPctg", "avgToi", "hits", "blockedShots", "pim",
    ] as const
  }, [detailA?.stats, detailB?.stats])

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🏒 NHL Player Compare</h1>

        {/* Player selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Player A
            </p>
            <PlayerSearch
              players={players}
              onPlayerSelect={(p) => setIdA(p.id)}
              onReset={() => setIdA(null)}
              positionFilter={filterA}
              placeholder={filterA === "goalie" ? "Search goalies..." : "Search skaters..."}
            />
            {detailA && (
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={detailA.imageUrl}
                  alt={detailA.player.fullName}
                  className="w-10 h-10 rounded-full object-cover bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <div>
                  <p className="font-semibold text-sm">
                    {detailA.player.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{detailA.player.id} · {detailA.player.position} ·{" "}
                    {detailA.player.teamAbbrev}
                  </p>
                </div>
              </div>
            )}
            {batchLoading && (
              <p className="text-xs text-muted-foreground mt-1 animate-pulse">
                Loading...
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Player B
              </p>
              {(idA || idB) && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    setIdA(idB)
                    setIdB(idA)
                  }}
                  title="Swap players"
                >
                  <ArrowLeftRight className="size-3" />
                </Button>
              )}
            </div>
            <PlayerSearch
              players={players}
              onPlayerSelect={(p) => setIdB(p.id)}
              onReset={() => setIdB(null)}
              positionFilter={filterB}
              placeholder={filterB === "goalie" ? "Search goalies..." : "Search skaters..."}
            />
            {detailB && (
              <div className="flex items-center gap-3 mt-3">
                <img
                  src={detailB.imageUrl}
                  alt={detailB.player.fullName}
                  className="w-10 h-10 rounded-full object-cover bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <div>
                  <p className="font-semibold text-sm">
                    {detailB.player.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{detailB.player.id} · {detailB.player.position} ·{" "}
                    {detailB.player.teamAbbrev}
                  </p>
                </div>
              </div>
            )}
            {batchLoading && (
              <p className="text-xs text-muted-foreground mt-1 animate-pulse">
                Loading...
              </p>
            )}
          </div>
        </div>

        {/* Radar chart */}
        {radarPlayers.length > 0 && !listLoading && (
          <div className="flex justify-center mb-8">
            <RadarChart axes={axes} players={radarPlayers} />
          </div>
        )}

        {/* Stats comparison table */}
        {detailA?.stats && detailB?.stats && detailA.stats.type === detailB.stats.type && (
          <Card>
            <CardHeader>
              <CardTitle>Stat Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="text-center py-2 px-2 font-medium">
                        {detailA.player.fullName.split(" ").pop()}
                      </th>
                      <th className="text-center py-2 px-2 font-medium">Stat</th>
                      <th className="text-center py-2 px-2 font-medium">
                        {detailB.player.fullName.split(" ").pop()}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statKeys.map((key) => {
                      const vA = (detailA.stats as any)[key] ?? 0
                      const vB = (detailB.stats as any)[key] ?? 0
                      const isInverted =
                        key === "pim" ||
                        key === "goalsAgainstAvg" ||
                        key === "losses"
                      const aBetter = isInverted ? vA < vB : vA > vB
                      const bBetter = isInverted ? vB < vA : vB > vA
                      const label = key.replace(/([A-Z])/g, " $1").replace("Pctg", "%").replace("Avg", " Avg").trim()

                      return (
                        <tr key={key} className="border-b border-border/50">
                          <td
                            className={`py-2 px-2 text-center tabular-nums ${
                              aBetter ? "font-bold text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {formatStatValue(key, detailA.stats)}
                          </td>
                          <td className="py-2 px-2 text-center text-muted-foreground capitalize">
                            {label}
                          </td>
                          <td
                            className={`py-2 px-2 text-center tabular-nums ${
                              bBetter ? "font-bold text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {formatStatValue(key, detailB.stats)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App
