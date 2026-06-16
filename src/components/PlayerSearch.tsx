import { useState, useMemo } from "react";
import { Player } from "../types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface Props {
  players: Player[];
  onPlayerSelect: (player: Player) => void;
  onReset: () => void;
}

function PlayerSearch({ players, onPlayerSelect, onReset }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("All");
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
      <Select
        value={selectedTeam}
        onValueChange={(value) => {
          setSelectedTeam((value as string) ?? "All");
          setQuery("");
          setIsOpen(true);
          onReset();
        }}
      >
        <SelectTrigger className="w-full sm:w-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {teams.map((team) => (
            <SelectItem key={team} value={team}>
              {team}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative w-full sm:w-72">
        <Input
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
          <ul className="absolute w-full bg-popover border border-border rounded-md mt-1 max-h-52 overflow-y-auto z-10 shadow-lg">
            {filtered.map((player) => (
              <li
                key={player.id}
                onClick={() => handleSelect(player)}
                className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm flex justify-between"
              >
                <span>{player.fullName}</span>
                <span className="text-muted-foreground">
                  {player.teamAbbrev}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isFiltered && (
        <Button variant="outline" size="default" onClick={handleReset}>
          Clear
        </Button>
      )}
    </div>
  );
}

export default PlayerSearch;
