"use client";

import { PolygonShape } from "@/redux/slice/shapes";

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

interface PolygonProps {
  shape: PolygonShape;
  isSelected?: boolean;
}

export function Polygon({ shape }: PolygonProps) {
  const padding = shape.strokeWidth + 2;
  const w = shape.w + padding * 2;
  const h = shape.h + padding * 2;

  const cx = shape.w / 2 + padding;
  const cy = shape.h / 2 + padding;
  const radius = Math.min(shape.w, shape.h) / 2;

  const points = generatePolygonPoints(cx, cy, radius, shape.sides);

  return (
    <svg
      className="absolute pointer-events-auto"
      style={{
        left: shape.x - padding,
        top: shape.y - padding,
        width: w,
        height: h,
        overflow: "visible",
      }}
    >
      <polygon
        points={points}
        fill={shape.fill || "transparent"}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}