import { useState } from "react";
import { Player } from "../types";

interface Props {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
}

function PlayerSearch({ players, onPlayerSelect }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = players.filter((p) =>
    p.fullName.toLowerCase().includes(query.toLowerCase()),
  );

  function handleSelect(player: Player) {
    onPlayerSelect(player);
    setQuery(player.fullName);
    setIsOpen(false);
  }

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        type="text"
        value={query}
        placeholder="Search for a player..."
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            background: "white",
            border: "1px solid #ccc",
            maxHeight: "200px",
            overflowY: "auto",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {filtered.map((player) => (
            <li
              key={player.id}
              onClick={() => handleSelect(player)}
              style={{ padding: "8px", cursor: "pointer" }}
            >
              {player.fullName} - {player.teamAbbrev}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlayerSearch;
