"use client";

import { CircleShape } from "@/redux/slice/shapes";

interface CircleProps {
  shape: CircleShape;
  isSelected?: boolean;
}

export function CircleComponent({ shape }: CircleProps) {
  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        backgroundColor: shape.fill || "transparent",
        border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        borderRadius: "50%",
      }}
    />
  );
}