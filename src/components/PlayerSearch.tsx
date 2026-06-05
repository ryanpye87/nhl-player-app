import { useState, useMemo } from "react";
import { Player } from "../types";

interface Props {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
}

function PlayerSearch({ players, onPlayerSelect }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("All");

  const teams = useMemo(() => {
    const abbrevs = [...new Set(players.map((p) => p.teamAbbrev))].sort();
    return ["All", ...abbrevs];
  }, [players]);

  const filtered = useMemo(
    () =>
      players.filter((p) => {
        const matchesTeam =
          selectedTeam === "ALL" || p.teamAbbrev === selectedTeam;
        const matchesQuery = p.fullName
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesTeam && matchesQuery;
      }),
    [players, selectedTeam, query],
  );

  function handleSelect(player: Player) {
    onPlayerSelect(player);
    setQuery(player.fullName);
    setIsOpen(false);
  }

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
      <select
        value={selectedTeam}
        onChange={(e) => {
          setSelectedTeam(e.target.value);
          setIsOpen(true);
        }}
        style={{ height: "32px" }}
      >
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
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
              zIndex: 10,
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
    </div>
  );
}

export default PlayerSearch;
