function generatePolygonPoints(
  cx: number,
  cy: number,
  radius: number,
  sides: number
): string {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(" ");
}

interface PolygonPreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function PolygonPreview({ x, y, w, h }: PolygonPreviewProps) {
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.min(w, h) / 2;

  const points = generatePolygonPoints(cx, cy, radius, 6);

  return (
    <svg
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: w, height: h, overflow: "visible" }}
    >
      <polygon
        points={points}
        fill="hsl(var(--primary) / 0.1)"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeDasharray="6 4"
        strokeLinejoin="round"
      />
    </svg>
  );
}