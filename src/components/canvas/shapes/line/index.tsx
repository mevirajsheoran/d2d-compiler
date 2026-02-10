"use client";

import { LineShape } from "@/redux/slice/shapes";

interface LineProps {
  shape: LineShape;
  isSelected?: boolean;
}

export function Line({ shape, isSelected }: LineProps) {
  // Calculate bounds
  const minX = Math.min(shape.startX, shape.endX);
  const minY = Math.min(shape.startY, shape.endY);
  const maxX = Math.max(shape.startX, shape.endX);
  const maxY = Math.max(shape.startY, shape.endY);
  const padding = shape.strokeWidth + 10;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  // Relative coordinates inside SVG
  const x1 = shape.startX - minX + padding;
  const y1 = shape.startY - minY + padding;
  const x2 = shape.endX - minX + padding;
  const y2 = shape.endY - minY + padding;

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
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}