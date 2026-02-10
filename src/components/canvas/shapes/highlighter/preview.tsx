import { Point } from "@/redux/slice/viewport";

interface HighlighterPreviewProps {
  points: Point[];
}

export function HighlighterPreview({ points }: HighlighterPreviewProps) {
  if (points.length < 2) return null;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const padding = 30;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const pathData = points
    .map((point, i) => {
      const x = point.x - minX + padding;
      const y = point.y - minY + padding;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

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
        d={pathData}
        stroke="#facc15"
        strokeWidth={20}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.4}
      />
    </svg>
  );
}