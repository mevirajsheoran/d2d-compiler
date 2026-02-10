interface ArrowPreviewProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function ArrowPreview({ startX, startY, endX, endY }: ArrowPreviewProps) {
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

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 12;

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
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
      <polygon
        points={`
          ${x2},${y2}
          ${x2 - headLength * Math.cos(angle - Math.PI / 6)},${y2 - headLength * Math.sin(angle - Math.PI / 6)}
          ${x2 - headLength * Math.cos(angle + Math.PI / 6)},${y2 - headLength * Math.sin(angle + Math.PI / 6)}
        `}
        fill="hsl(var(--primary))"
        opacity={0.5}
      />
    </svg>
  );
}