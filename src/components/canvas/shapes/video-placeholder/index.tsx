"use client";

import { VideoPlaceholderShape } from "@/redux/slice/shapes";

interface VideoPlaceholderProps {
  shape: VideoPlaceholderShape;
  isSelected?: boolean;
}

export function VideoPlaceholder({ shape }: VideoPlaceholderProps) {
  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        backgroundColor: shape.fill || "rgba(255,255,255,0.05)",
        border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Play button */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.15)",
          border: `2px solid ${shape.stroke}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={shape.stroke}>
          <polygon points="5,3 19,12 5,21" />
        </svg>
      </div>
    </div>
  );
}