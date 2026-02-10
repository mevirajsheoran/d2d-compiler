"use client";

import { FreeDrawShape } from "@/redux/slice/shapes";

interface StrokeProps {
  shape: FreeDrawShape;
  isSelected?: boolean;
}

export function Stroke({ shape, isSelected }: StrokeProps) {
  if (shape.points.length < 2) return null;

  // Calculate bounds
  const xs = shape.points.map((p) => p.x);
  const ys = shape.points.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const padding = shape.strokeWidth + 10;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  // Build path with relative coordinates
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
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}