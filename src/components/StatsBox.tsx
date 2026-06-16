import { Player, PlayerStats } from "../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

interface Props {
  player: Player;
  stats: PlayerStats;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-8 text-muted-foreground text-sm">{label}</td>
      <td className="py-2 text-foreground font-semibold text-sm">{value}</td>
    </tr>
  );
}

function SkaterRows({
  stats,
}: {
  stats: Extract<PlayerStats, { type: "skater" }>;
}) {
  return (
    <>
      <StatRow label="Games Played" value={stats.gamesPlayed} />
      <StatRow label="Goals" value={stats.goals} />
      <StatRow label="Assists" value={stats.assists} />
      <StatRow label="Points" value={stats.points} />
      <StatRow label="+/–" value={stats.plusMinus} />
      <StatRow label="Shots" value={stats.shots} />
      <StatRow
        label="Shooting %"
        value={`${(stats.shootingPctg * 100).toFixed(1)}%`}
      />
    </>
  );
}

function GoalieRows({
  stats,
}: {
  stats: Extract<PlayerStats, { type: "goalie" }>;
}) {
  return (
    <>
      <StatRow label="Games Played" value={stats.gamesPlayed} />
      <StatRow label="Wins" value={stats.wins} />
      <StatRow label="Losses" value={stats.losses} />
      <StatRow label="OT Losses" value={stats.otLosses} />
      <StatRow label="Shutouts" value={stats.shutouts} />
      <StatRow label="Save %" value={stats.savePctg.toFixed(3)} />
      <StatRow label="GAA" value={stats.goalsAgainstAverage.toFixed(2)} />
    </>
  );
}

function StatsBox({ player, stats }: Props) {
  const season =
    stats.season !== "N/A"
      ? `${stats.season.slice(0, 4)}–${stats.season.slice(4)}`
      : "N/A";

  return (
    <Card className="min-w-[260px]">
      <CardHeader>
        <CardTitle>{player.fullName}</CardTitle>
        <CardDescription>
          {player.position} · {player.teamAbbrev}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {season} Regular Season
        </p>
        <table className="w-full">
          <tbody>
            {stats.type === "skater" ? (
              <SkaterRows stats={stats} />
            ) : (
              <GoalieRows stats={stats} />
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

export default StatsBox;
