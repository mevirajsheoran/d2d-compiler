"use client";

import { HighlighterShape } from "@/redux/slice/shapes";

interface HighlighterProps {
  shape: HighlighterShape;
  isSelected?: boolean;
}

export function Highlighter({ shape }: HighlighterProps) {
  if (shape.points.length < 2) return null;

  const xs = shape.points.map((p) => p.x);
  const ys = shape.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const padding = shape.strokeWidth + 10;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const pathData = shape.points
    .map((point, i) => {
      const x = point.x - minX + padding;
      const y = point.y - minY + padding;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg
      className="absolute pointer-events-auto"
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
        stroke={shape.highlighterColor}
        strokeWidth={shape.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.4}
      />
    </svg>
  );
}