interface Props {
  imageUrl: string;
  playerName: string;
}

function PlayerImage({ imageUrl, playerName }: Props) {
  return (
    <div className="rounded-xl overflow-hidden shrink-0 bg-gray-800 w-[270px] h-[270px]">
      <img
        src={imageUrl}
        alt={playerName}
        width={270}
        height={270}
        className="object-cover w-full h-full"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "https://via.placeholder.com/270?text=No+Image";
        }}
      />
    </div>
  );
}

export default PlayerImage;
