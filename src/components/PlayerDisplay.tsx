import { PlayerDetail } from "../types";
import PlayerImage from "./PlayerImage";
import StatsBox from "./StatsBox";

interface Props {
  detail: PlayerDetail;
}

function PlayerDisplay({ detail }: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: "32px",
        alignItems: "flex-start",
        marginTop: "24px",
      }}
    >
      <PlayerImage
        imageUrl={detail.imageUrl}
        playerName={detail.player.fullName}
      />
      <StatsBox player={detail.player} stats={detail.stats} />
    </div>
  );
}

export default PlayerDisplay;
