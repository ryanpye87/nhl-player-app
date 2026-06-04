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

  return (
    <div
      style={{ fontFamily: "sans-serif", padding: "32px", maxWidth: "800px" }}
    >
      <h1>🏒 NHL Player Stats</h1>
      <PlayerSearch players={players} onPlayerSelect={handlePlayerSelect} />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {playerDetail && !loading && <PlayerDisplay detail={playerDetail} />}
    </div>
  );
}

export default App;
