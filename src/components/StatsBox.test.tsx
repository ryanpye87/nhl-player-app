import { render, screen } from "@testing-library/react";
import StatsBox from "./StatsBox";

const skaterDetail = {
  player: {
    id: 1,
    fullName: "Sidney Crosby",
    teamAbbrev: "PIT",
    position: "C",
  },
  stats: {
    type: "skater",
    season: "20232024",
    gamesPlayed: 82,
    goals: 30,
    assists: 60,
    points: 90,
    plusMinus: 15,
    shots: 180,
    shootingPctg: 0.1667,
  } as const,
};

const goalieDetail = {
  player: {
    id: 2,
    fullName: "Andrei Vasilevskiy",
    teamAbbrev: "TBL",
    position: "G",
  },
  stats: {
    type: "goalie",
    season: "20232024",
    gamesPlayed: 60,
    wins: 40,
    losses: 15,
    otLosses: 5,
    shutouts: 8,
    savePercentage: 0.92,
    goalsAgainstAverage: 2.45,
  } as const,
};

describe("StatsBox", () => {
  it("renders skater stats correctly", () => {
    render(
      <StatsBox player={skaterDetail.player} stats={skaterDetail.stats} />,
    );

    expect(screen.getByText("Sidney Crosby")).toBeInTheDocument();
    expect(screen.getByText("C · PIT")).toBeInTheDocument();
    expect(screen.getByText("2023–2024 Regular Season")).toBeInTheDocument();
    expect(screen.getByText("Goals")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Shooting %")).toBeInTheDocument();
    expect(screen.getByText("16.7%")).toBeInTheDocument();
  });

  it("renders goalie stats correctly", () => {
    render(
      <StatsBox player={goalieDetail.player} stats={goalieDetail.stats} />,
    );

    expect(screen.getByText("Andrei Vasilevskiy")).toBeInTheDocument();
    expect(screen.getByText("G · TBL")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
    expect(screen.getByText("Save %")).toBeInTheDocument();
    expect(screen.getByText("0.920")).toBeInTheDocument();
    expect(screen.getByText("GAA")).toBeInTheDocument();
    expect(screen.getByText("2.45")).toBeInTheDocument();
  });

  it("renders season as N/A when season is unavailable", () => {
    const noSeason = {
      ...skaterDetail,
      stats: { ...skaterDetail.stats, season: "N/A" },
    };

    render(<StatsBox player={noSeason.player} stats={noSeason.stats} />);

    expect(screen.getByText("N/A Regular Season")).toBeInTheDocument();
  });
});
