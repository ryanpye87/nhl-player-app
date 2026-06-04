interface Props {
  imageUrl: string;
  playerName: string;
}

function PlayerImage({ imageUrl, playerName }: Props) {
  return (
    <img
      src={imageUrl}
      alt={playerName}
      width={270}
      height={270}
      style={{ borderRadius: "8px", objectFit: "cover" }}
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "https://via.placeholder.com/270?text=No+Image";
      }}
    />
  );
}

export default PlayerImage;
