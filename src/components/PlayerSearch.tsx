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
  players: Player[]
  onPlayerSelect: (player: Player) => void
  onReset: () => void
  positionFilter?: "skater" | "goalie"
  placeholder?: string
}

function PlayerSearch({
  players,
  onPlayerSelect,
  onReset,
  positionFilter,
  placeholder = "Search for a player...",
}: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("All");
  const isFiltered = query !== "" || selectedTeam !== "All";

  // Apply position filter to available players
  const eligible = useMemo(() => {
    if (!positionFilter) return players
    if (positionFilter === "goalie") return players.filter((p) => p.position === "G")
    return players.filter((p) => p.position !== "G")
  }, [players, positionFilter])

  const teams = useMemo(() => {
    const abbrevs = [...new Set(eligible.map((p) => p.teamAbbrev))].sort()
    return ["All", ...abbrevs]
  }, [eligible])

  const filtered = useMemo(
    () =>
      eligible.filter((p) => {
        const matchesTeam =
          selectedTeam === "All" || p.teamAbbrev === selectedTeam
        const matchesQuery = p.fullName
          .toLowerCase()
          .includes(query.toLowerCase())
        return matchesTeam && matchesQuery
      }),
    [eligible, selectedTeam, query],
  )

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
          placeholder={placeholder}
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
