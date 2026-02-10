"use client";

import { HamburgerMenuShape } from "@/redux/slice/shapes";

interface HamburgerMenuProps {
  shape: HamburgerMenuShape;
  isSelected?: boolean;
}

export function HamburgerMenu({ shape }: HamburgerMenuProps) {
  const lineGap = shape.h / 4;
  const lineWidth = shape.w * 0.7;
  const startX = (shape.w - lineWidth) / 2;

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: lineGap * 0.5,
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: lineWidth,
            height: shape.strokeWidth,
            backgroundColor: shape.stroke,
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}