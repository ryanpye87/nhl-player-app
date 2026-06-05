import { PlayerDetail } from "../types";
import PlayerImage from "./PlayerImage";
import StatsBox from "./StatsBox";

interface Props {
  detail: PlayerDetail;
}

function PlayerDisplay({ detail }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-stretch">
      <PlayerImage
        imageUrl={detail.imageUrl}
        playerName={detail.player.fullName}
      />
      <StatsBox player={detail.player} stats={detail.stats} />
    </div>
  );
}

export default PlayerDisplay;
