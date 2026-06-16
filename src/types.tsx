export interface Player {
  id: number;
  fullName: string;
  teamAbbrev: string;
  position: string;
}

export interface SkaterStats {
  type: "skater";
  season: string;
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  shots: number;
  shootingPctg: number;
  avgToi: number;
  hits: number;
  blockedShots: number;
  pim: number;
}

export interface GoalieStats {
  type: "goalie";
  season: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  otLosses: number;
  shutouts: number;
  savePercentage: number;
  goalsAgainstAverage: number;
  avgToi: number;
}

export interface PlayerDetail {
  player: Player;
  stats: PlayerStats;
  imageUrl: string;
}

export type PlayerStats = SkaterStats | GoalieStats;
