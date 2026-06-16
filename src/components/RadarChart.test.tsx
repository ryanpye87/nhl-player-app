import { render, screen } from "@testing-library/react"
import { RadarChart, RadarAxis, RadarPlayerData } from "./RadarChart"

const sampleAxes: RadarAxis[] = [
  { key: "goals", label: "G" },
  { key: "assists", label: "A" },
  { key: "points", label: "PTS" },
  { key: "shots", label: "S" },
  { key: "shootingPctg", label: "SH%" },
]

const playerA: RadarPlayerData = {
  label: "Sidney Crosby",
  color: "hsl(200 80% 50%)",
  values: { goals: 75, assists: 60, points: 68, shots: 80, shootingPctg: 55 },
}

const playerB: RadarPlayerData = {
  label: "Connor McDavid",
  color: "hsl(30 80% 50%)",
  values: { goals: 90, assists: 95, points: 94, shots: 85, shootingPctg: 70 },
}

describe("RadarChart", () => {
  it("returns null when axes is empty", () => {
    const { container } = render(
      <RadarChart axes={[]} players={[playerA]} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it("renders axis lines for each axis", () => {
    const { container } = render(
      <RadarChart axes={sampleAxes} players={[]} />,
    )
    const lines = container.querySelectorAll("line")
    expect(lines).toHaveLength(sampleAxes.length)
  })

  it("renders axis labels", () => {
    render(<RadarChart axes={sampleAxes} players={[]} />)
    for (const axis of sampleAxes) {
      expect(screen.getByText(axis.label)).toBeInTheDocument()
    }
  })

  it("renders background ring polygons (defaults to 10)", () => {
    const { container } = render(
      <RadarChart axes={sampleAxes} players={[]} />,
    )
    // Rings are <polygon> with fill="none" — these are the background rings
    const polygons = container.querySelectorAll("polygon[fill='none']")
    expect(polygons).toHaveLength(10)
  })

  it("renders a filled polygon for each player", () => {
    const { container } = render(
      <RadarChart axes={sampleAxes} players={[playerA, playerB]} />,
    )
    // Player polygons are inside <g> groups — two filled polygons
    const filledPolygons = container.querySelectorAll(
      "polygon:not([fill='none'])",
    )
    expect(filledPolygons).toHaveLength(2)
  })

  it("renders single polygon for a single player", () => {
    const { container } = render(
      <RadarChart axes={sampleAxes} players={[playerA]} />,
    )
    const filledPolygons = container.querySelectorAll(
      "polygon:not([fill='none'])",
    )
    expect(filledPolygons).toHaveLength(1)
  })

  it("handles missing values by defaulting to 0", () => {
    const partialPlayer: RadarPlayerData = {
      label: "Partial Data",
      color: "red",
      values: { goals: 50 },
      // assists, points, shots, shootingPctg missing
    }
    const { container } = render(
      <RadarChart axes={sampleAxes} players={[partialPlayer]} />,
    )
    // Should still render without crashing — polygon exists
    const filledPolygons = container.querySelectorAll(
      "polygon:not([fill='none'])",
    )
    expect(filledPolygons).toHaveLength(1)
  })

  it("renders the SVG with an accessible role", () => {
    render(<RadarChart axes={sampleAxes} players={[playerA]} />)
    expect(screen.getByRole("img")).toBeInTheDocument()
  })

  it("renders data point circles for each player × axis", () => {
    const { container } = render(
      <RadarChart axes={sampleAxes} players={[playerA, playerB]} />,
    )
    // 2 players × 5 axes = 10 circles
    const circles = container.querySelectorAll("circle")
    expect(circles).toHaveLength(10)
  })
})
