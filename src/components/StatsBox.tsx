import { PlayerStats, Player } from "../types";

interface Props {
  player: Player;
  stats: PlayerStats;
}

function StatsBox({ player, stats }: Props) {
  const season = `${stats.season.slice(0, 4)} - ${stats.season.slice(4)}`;

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
        </tbody>
      </table>
    </div>
  );
}

export default StatsBox;
