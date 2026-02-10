"use client";

import { DividerShape } from "@/redux/slice/shapes";

interface DividerProps {
  shape: DividerShape;
  isSelected?: boolean;
}

export function Divider({ shape }: DividerProps) {
  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.direction === "horizontal" ? shape.w : shape.strokeWidth,
        height: shape.direction === "horizontal" ? shape.strokeWidth : shape.h,
        backgroundColor: shape.stroke,
      }}
    />
  );
}