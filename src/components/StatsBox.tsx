import { PlayerStats, Player } from "../types";

interface Props {
  player: Player;
  stats: PlayerStats;
}

function SkaterRows({
  stats,
}: {
  stats: Extract<PlayerStats, { type: "skater" }>;
}) {
  return (
    <>
      {[
        ["Games Played", stats.gamesPlayed],
        ["Goals", stats.goals],
        ["Assists", stats.assists],
        ["Points", stats.points],
        ["+/-", stats.plusMinus],
        ["Shots", stats.shots],
        ["Shooting %", `${(stats.shootingPctg * 100).toFixed(1)}%`],
      ].map(([label, value]) => (
        <tr key={label}>
          <td style={{ paddingRight: "16px", color: "#666" }}>{label}</td>
          <td>
            <strong>{value}</strong>
          </td>
        </tr>
      ))}
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
      {[
        ["Games Played", stats.gamesPlayed],
        ["Wins", stats.wins],
        ["Losses", stats.losses],
        ["OT Losses", stats.otLosses],
        ["Shutouts", stats.shutouts],
        ["Save %", stats.savePercentage.toFixed(3)],
        ["GAA", stats.goalsAgainstAverage.toFixed(2)],
      ].map(([label, value]) => (
        <tr key={label}>
          <td style={{ paddingRight: "16px", color: "#666" }}>{label}</td>
          <td>
            <strong>{value}</strong>
          </td>
        </tr>
      ))}
    </>
  );
}

function StatsBox({ player, stats }: Props) {
  const season =
    stats.season !== "N/A"
      ? `${stats.season.slice(0, 4)}–${stats.season.slice(4)}`
      : "N/A";

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        minWidth: "220px",
      }}
    >
      <h2>{player.fullName}</h2>
      <p>
        {player.position} · {player.teamAbbrev}
      </p>
      <h3>{season} Season</h3>
      <table>
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
