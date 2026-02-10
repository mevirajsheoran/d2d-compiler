"use client";

import { ConnectorShape } from "@/redux/slice/shapes";

interface ConnectorProps {
  shape: ConnectorShape;
  isSelected?: boolean;
}

export function Connector({ shape }: ConnectorProps) {
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

  let pathD = "";

  if (shape.connectorStyle === "elbow") {
    const midX = (x1 + x2) / 2;
    pathD = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  } else if (shape.connectorStyle === "curved") {
    const cx1 = x1 + (x2 - x1) * 0.5;
    const cy1 = y1;
    const cx2 = x1 + (x2 - x1) * 0.5;
    const cy2 = y2;
    pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
  } else {
    pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  // Small circles at endpoints
  const dotRadius = 4;

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
        d={pathD}
        stroke={shape.stroke}
        strokeWidth={shape.strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* Start dot */}
      <circle cx={x1} cy={y1} r={dotRadius} fill={shape.stroke} />
      {/* End dot */}
      <circle cx={x2} cy={y2} r={dotRadius} fill={shape.stroke} />
    </svg>
  );
}