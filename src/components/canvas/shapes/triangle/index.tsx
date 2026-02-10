"use client";

import { TriangleShape } from "@/redux/slice/shapes";

interface TriangleProps {
  shape: TriangleShape;
  isSelected?: boolean;
}

export function Triangle({ shape }: TriangleProps) {
  const padding = shape.strokeWidth + 2;
  const w = shape.w + padding * 2;
  const h = shape.h + padding * 2;

  // Triangle points: top-center, bottom-left, bottom-right
  const points = `${shape.w / 2 + padding},${padding} ${padding},${shape.h + padding} ${shape.w + padding},${shape.h + padding}`;

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