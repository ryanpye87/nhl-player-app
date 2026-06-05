import { Player, PlayerStats } from "../types";

interface Props {
  player: Player;
  stats: PlayerStats;
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <tr className="border-t border-gray-700">
      <td className="py-2 pr-8 text-gray-400 text-sm">{label}</td>
      <td className="py-2 text-white font-semibold text-sm">{value}</td>
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
      <StatRow label="Save %" value={stats.savePercentage.toFixed(3)} />
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
    <div className="bg-gray-800 rounded-xl p-6 min-w-[260px]">
      <h2 className="text-2xl font-bold">{player.fullName}</h2>
      <p className="text-gray-400 text-sm mt-1 mb-4">
        {player.position} · {player.teamAbbrev}
      </p>
      <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
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
    </div>
  );
}

export default StatsBox;
