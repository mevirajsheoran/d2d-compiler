interface TrianglePreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function TrianglePreview({ x, y, w, h }: TrianglePreviewProps) {
  const points = `${w / 2},0 0,${h} ${w},${h}`;

  return (
    <svg
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        overflow: "visible",
      }}
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