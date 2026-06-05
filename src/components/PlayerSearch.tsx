import { useState, useMemo } from "react";
import { Player } from "../types";

interface Props {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  onReset: () => void;
}

function PlayerSearch({ players, onPlayerSelect, onReset }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string>("All");
  const isFiltered = query !== "" || selectedTeam !== "All";

  const teams = useMemo(() => {
    const abbrevs = [...new Set(players.map((p) => p.teamAbbrev))].sort();
    return ["All", ...abbrevs];
  }, [players]);

  const filtered = useMemo(
    () =>
      players.filter((p) => {
        const matchesTeam =
          selectedTeam === "All" || p.teamAbbrev === selectedTeam;
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

  function handleReset() {
    setQuery("");
    setSelectedTeam("All");
    setIsOpen(false);
    onReset();
  }

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-start">
      <select
        value={selectedTeam}
        onChange={(e) => {
          setSelectedTeam(e.target.value);
          setQuery("");
          setIsOpen(true);
          onReset();
        }}
        className="w-full sm:w-auto bg-gray-800 border border-gray-700 text-white rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>

      <div className="relative w-full sm:w-72">
        <input
          type="text"
          value={query}
          placeholder="Search for a player..."
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
        />

        {isOpen && filtered.length > 0 && (
          <ul className="absolute w-full bg-gray-800 border border-gray-700 rounded-md mt-1 max-h-52 overflow-y-auto z-10 shadow-lg">
            {filtered.map((player) => (
              <li
                key={player.id}
                onClick={() => handleSelect(player)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-700 text-sm flex justify-between"
              >
                <span>{player.fullName}</span>
                <span className="text-gray-400">{player.teamAbbrev}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isFiltered && (
        <button
          onClick={handleReset}
          className="w-full sm:w-auto h-10 px-3 rounded-md bg-gray-700 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default PlayerSearch;
