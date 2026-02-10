"use client";

import { StarShape } from "@/redux/slice/shapes";

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

interface StarProps {
  shape: StarShape;
  isSelected?: boolean;
}

export function Star({ shape }: StarProps) {
  const padding = shape.strokeWidth + 2;
  const w = shape.w + padding * 2;
  const h = shape.h + padding * 2;

  const cx = shape.w / 2 + padding;
  const cy = shape.h / 2 + padding;
  const outerR = Math.min(shape.w, shape.h) / 2;
  const innerR = outerR * shape.innerRadiusRatio;

  const points = generateStarPoints(cx, cy, outerR, innerR, shape.points);

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