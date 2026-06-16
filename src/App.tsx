import { useState } from "react";
import { Player } from "./types";
import { usePlayerData } from "./hooks/usePlayerData";
import PlayerSearch from "./components/PlayerSearch";
import PlayerDisplay from "./components/PlayerDisplay";
import { RadarChart } from "./components/RadarChart";
import type { RadarAxis, RadarPlayerData } from "./components/RadarChart";

const SMOKE_AXES: RadarAxis[] = [
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "points", label: "PTS" },
  { key: "shots", label: "S" },
  { key: "shootingPctg", label: "SH%" },
  { key: "toi", label: "TOI/G" },
  { key: "hits", label: "HIT" },
  { key: "blocks", label: "BKS" },
  { key: "plusMinus", label: "+/−" },
  { key: "pim", label: "PIM" },
]

const SMOKE_PLAYERS: RadarPlayerData[] = [
  {
    label: "Connor McDavid",
    color: "hsl(25 90% 50%)",
    values: { goals: 90, assists: 99, points: 98, shots: 85, shootingPctg: 72, toi: 88, hits: 40, blocks: 30, plusMinus: 78, pim: 65 },
  },
  {
    label: "Sidney Crosby",
    color: "hsl(200 80% 45%)",
    values: { goals: 75, assists: 82, points: 80, shots: 70, shootingPctg: 60, toi: 78, hits: 35, blocks: 45, plusMinus: 62, pim: 55 },
  },
]

function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { players, playerDetail, loading, error } = usePlayerData(selectedId);

  function handlePlayerSelect(player: Player) {
    setSelectedId(player.id);
  }

  function handleReset() {
    setSelectedId(null);
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🏒 NHL Player Stats</h1>

        {/* Smoke test — radar chart with hardcoded data */}
        <div className="mb-8 p-4 border border-border rounded-xl">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Radar Chart Smoke Test
          </h2>
          <RadarChart axes={SMOKE_AXES} players={SMOKE_PLAYERS} />
        </div>

        <PlayerSearch
          players={players}
          onPlayerSelect={handlePlayerSelect}
          onReset={handleReset}
        />
        {loading && (
          <p className="mt-6 text-muted-foreground animate-pulse">Loading...</p>
        )}
        {error && <p className="mt-6 text-destructive">{error}</p>}
        {playerDetail && !loading && (
          <div className="mt-6">
            <PlayerDisplay detail={playerDetail} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
