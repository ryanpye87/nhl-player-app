import { Card } from "./ui/card";

interface Props {
  imageUrl: string;
  playerName: string;
}

function PlayerImage({ imageUrl, playerName }: Props) {
  return (
    <Card className="shrink-0 w-full sm:w-[270px] p-0">
      <img
        src={imageUrl}
        alt={playerName}
        width={270}
        height={270}
        className="object-cover w-full h-full max-h-[270px] sm:max-h-none rounded-xl"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/270?text=No+Image";
        }}
      />
    </Card>
  );
}

export default PlayerImage;
