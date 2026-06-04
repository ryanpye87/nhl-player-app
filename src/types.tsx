export interface Player {
  id: number;
  fullName: string;
  teamAbbrev: string;
  position: string;
}

export interface PlayerStats {
  season: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  shots: number;
  shootingPctg: number;
}

export interface PlayerDetail {
  player: Player;
  stats: PlayerStats;
  imageUrl: string;
}
