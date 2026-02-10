interface ConnectorPreviewProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function ConnectorPreview({ startX, startY, endX, endY }: ConnectorPreviewProps) {
  const minX = Math.min(startX, endX);
  const minY = Math.min(startY, endY);
  const maxX = Math.max(startX, endX);
  const maxY = Math.max(startY, endY);
  const padding = 20;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const x1 = startX - minX + padding;
  const y1 = startY - minY + padding;
  const x2 = endX - minX + padding;
  const y2 = endY - minY + padding;

  const midX = (x1 + x2) / 2;
  const pathD = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: minX - padding,
        top: minY - padding,
        width,
        height,
        overflow: "visible",
      }}
    >
      <path
        d={pathD}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeDasharray="6 4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={x1} cy={y1} r={4} fill="hsl(var(--primary))" opacity={0.5} />
      <circle cx={x2} cy={y2} r={4} fill="hsl(var(--primary))" opacity={0.5} />
    </svg>
  );
}