"use client";

import { ArrowShape } from "@/redux/slice/shapes";

interface ArrowProps {
  shape: ArrowShape;
  isSelected?: boolean;
}

export function Arrow({ shape, isSelected }: ArrowProps) {
  const minX = Math.min(shape.startX, shape.endX);
  const minY = Math.min(shape.startY, shape.endY);
  const maxX = Math.max(shape.startX, shape.endX);
  const maxY = Math.max(shape.startY, shape.endY);
  const padding = shape.strokeWidth + 20;

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const x1 = shape.startX - minX + padding;
  const y1 = shape.startY - minY + padding;
  const x2 = shape.endX - minX + padding;
  const y2 = shape.endY - minY + padding;

  const angle = Math.atan2(y2 - y1, x2 - x1);
  const headLength = 12;

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
      {/* Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        strokeLinecap="round"
      />
      {/* Arrowhead */}
      <polygon
        points={`
          ${x2},${y2}
          ${x2 - headLength * Math.cos(angle - Math.PI / 6)},${y2 - headLength * Math.sin(angle - Math.PI / 6)}
          ${x2 - headLength * Math.cos(angle + Math.PI / 6)},${y2 - headLength * Math.sin(angle + Math.PI / 6)}
        `}
        fill={shape.stroke}
      />
    </svg>
  );
}