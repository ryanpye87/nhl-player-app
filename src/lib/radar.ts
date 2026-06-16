/**
 * Convert polar coordinates to cartesian.
 *
 * @param cx      Center x
 * @param cy      Center y
 * @param radius  Distance from center
 * @param angleDeg Angle in degrees, where 0° = top (12 o'clock), proceeding clockwise
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  }
}

/**
 * Generate the vertex points of a regular polygon centered at (cx, cy).
 *
 * @param cx     Center x
 * @param cy     Center y
 * @param radius Circumradius
 * @param sides  Number of sides
 */
export function getPolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  const step = 360 / sides
  for (let i = 0; i < sides; i++) {
    points.push(polarToCartesian(cx, cy, radius, i * step))
  }
  return points
}

/**
 * Compute the angle for each axis. Axes are distributed uniformly starting
 * from the top (0° = 12 o'clock), proceeding clockwise.
 */
export function getAxisAngles(count: number): number[] {
  const step = 360 / count
  return Array.from({ length: count }, (_, i) => i * step)
}

/**
 * Convert an array of { x, y } points into an SVG polygon `points` attribute string.
 */
export function pointsToSvg(points: { x: number; y: number }[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ")
}
