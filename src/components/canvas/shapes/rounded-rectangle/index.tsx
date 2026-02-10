"use client";

import { RoundedRectShape } from "@/redux/slice/shapes";

interface RoundedRectangleProps {
  shape: RoundedRectShape;
  isSelected?: boolean;
}

export function RoundedRectangle({ shape }: RoundedRectangleProps) {
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
        borderRadius: shape.borderRadius,
      }}
    />
  );
}