import {
  polarToCartesian,
  getPolygonPoints,
  getAxisAngles,
  pointsToSvg,
} from "@/lib/radar"

export interface RadarAxis {
  key: string
  label: string
  description?: string // full stat name for tooltips (falls back to label)
}

export interface RadarPlayerData {
  label: string
  color: string
  values: Record<string, number> // axis key → 0–99 normalized value
}

export interface RadarChartProps {
  axes: RadarAxis[]
  players: RadarPlayerData[]
  size?: number
  radius?: number
  rings?: number
}

function RadarChart({
  axes,
  players,
  size = 300,
  radius = 120,
  rings = 10,
}: RadarChartProps) {
  if (axes.length === 0) return null

  const cx = size / 2
  const cy = size / 2
  const angles = getAxisAngles(axes.length)
  const labelRadius = radius + 14

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="overflow-visible"
      role="img"
      aria-label={
        players.length > 0
          ? `Radar chart comparing ${players.map((p) => p.label).join(" and ")}`
          : "Radar chart"
      }
    >
      {/* Background rings */}
      {Array.from({ length: rings }, (_, i) => {
        const r = (radius / rings) * (i + 1)
        const ringPoints = getPolygonPoints(cx, cy, r, axes.length)
        return (
          <polygon
            key={`ring-${i}`}
            points={pointsToSvg(ringPoints)}
            fill="none"
            stroke="var(--border)"
            strokeWidth={i === rings - 1 ? 1.5 : 0.5}
          />
        )
      })}

      {/* Axis lines */}
      {angles.map((angle, i) => {
        const tip = polarToCartesian(cx, cy, radius, angle)
        return (
          <line
            key={`axis-${i}`}
            x1={cx}
            y1={cy}
            x2={tip.x}
            y2={tip.y}
            stroke="var(--border)"
            strokeWidth={1}
          />
        )
      })}

      {/* Axis labels */}
      {angles.map((angle, i) => {
        const pos = polarToCartesian(cx, cy, labelRadius, angle)
        // Determine text-anchor based on which half of the chart the label falls on
        const anchor =
          pos.x < cx - 4 ? "end" : pos.x > cx + 4 ? "start" : "middle"
        return (
          <text
            key={`label-${i}`}
            x={pos.x}
            y={pos.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-muted-foreground"
            style={{ fontSize: "10px" }}
          >
            {axes[i].label}
          </text>
        )
      })}

      {/* Player polygons */}
      {players.map((player) => {
        const dataPoints = axes.map((axis, i) => {
          const value = player.values[axis.key] ?? 0
          const angle = angles[i]
          return polarToCartesian(cx, cy, (value / 99) * radius, angle)
        })

        return (
          <g key={player.label}>
            {/* Filled polygon */}
            <polygon
              points={pointsToSvg(dataPoints)}
              fill={player.color}
              fillOpacity={0.2}
              stroke={player.color}
              strokeWidth={2}
              strokeLinejoin="round"
            />
            {/* Data point dots + tooltips */}
            {dataPoints.map((pt, i) => {
              const rawValue = player.values[axes[i].key] ?? 0
              return (
                <circle
                  key={`dot-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={3}
                  fill={player.color}
                  stroke="var(--background)"
                  strokeWidth={1}
                >
                  <title>
                    {player.label}: {axes[i].description ?? axes[i].label} — {rawValue}
                  </title>
                </circle>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

export { RadarChart }
