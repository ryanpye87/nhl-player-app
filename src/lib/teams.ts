/** NHL team primary colors — used for radar chart player overlays. */
const TEAM_COLORS: Record<string, string> = {
  ANA: "#F47A38",
  BOS: "#FFB81C",
  BUF: "#003087",
  CAR: "#E03A3E",
  CBJ: "#041E42",
  CGY: "#D2001C",
  CHI: "#CF0A2C",
  COL: "#6F263D",
  DAL: "#006847",
  DET: "#CE1126",
  EDM: "#FF4C00",
  FLA: "#C8102E",
  LAK: "#000000",
  MIN: "#154734",
  MTL: "#A6192E",
  NSH: "#FFB81C",
  NJD: "#CE1126",
  NYI: "#00468B",
  NYR: "#0038A8",
  OTT: "#C52032",
  PHI: "#F74902",
  PIT: "#000000",
  SEA: "#001628",
  SJS: "#006D75",
  STL: "#002F87",
  TBL: "#002868",
  TOR: "#00205B",
  UTA: "#71B82C",
  VAN: "#00205B",
  VGK: "#B4975A",
  WPG: "#041E42",
  WSH: "#C8102E",
}

/** Default color when a team isn't in the map. */
const FALLBACK = "#888888"

export function getTeamColor(teamAbbrev: string): string {
  return TEAM_COLORS[teamAbbrev] ?? FALLBACK
}
