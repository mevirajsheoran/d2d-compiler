function generateStarPoints(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  numPoints: number
): string {
  const points: string[] = [];
  const step = Math.PI / numPoints;

  for (let i = 0; i < numPoints * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }

  return points.join(" ");
}

interface StarPreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function StarPreview({ x, y, w, h }: StarPreviewProps) {
  const cx = w / 2;
  const cy = h / 2;
  const outerR = Math.min(w, h) / 2;
  const innerR = outerR * 0.4;

  const points = generateStarPoints(cx, cy, outerR, innerR, 5);

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