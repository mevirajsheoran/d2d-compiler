"use client";

import { ImagePlaceholderShape } from "@/redux/slice/shapes";

interface ImagePlaceholderProps {
  shape: ImagePlaceholderShape;
  isSelected?: boolean;
}

export function ImagePlaceholder({ shape }: ImagePlaceholderProps) {
  const padding = shape.strokeWidth;

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
        overflow: "hidden",
      }}
    >
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* X pattern */}
        <line
          x1={0} y1={0} x2="100%" y2="100%"
          stroke={shape.stroke}
          strokeWidth={1}
          opacity={0.3}
        />
        <line
          x1="100%" y1={0} x2={0} y2="100%"
          stroke={shape.stroke}
          strokeWidth={1}
          opacity={0.3}
        />
      </svg>
      {/* Image icon in center */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: 0.5,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={shape.stroke} strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span style={{ fontSize: 10, color: shape.stroke }}>Image</span>
      </div>
    </div>
  );
}