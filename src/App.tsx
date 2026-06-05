import { useState } from "react";
import { Player } from "./types";
import { usePlayerData } from "./hooks/usePlayerData";
import PlayerSearch from "./components/PlayerSearch";
import PlayerDisplay from "./components/PlayerDisplay";

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
    <div className="min-h-screen bg-gray-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🏒 NHL Player Stats</h1>
        <PlayerSearch
          players={players}
          onPlayerSelect={handlePlayerSelect}
          onReset={handleReset}
        />
        {loading && (
          <p className="mt-6 text-gray-400 animate-pulse">Loading...</p>
        )}
        {error && <p className="mt-6 text-red-400">{error}</p>}
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
