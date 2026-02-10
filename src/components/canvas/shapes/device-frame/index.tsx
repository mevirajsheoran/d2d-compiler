"use client";

import { DeviceFrameShape } from "@/redux/slice/shapes";

interface DeviceFrameProps {
  shape: DeviceFrameShape;
  isSelected?: boolean;
}

export function DeviceFrame({ shape }: DeviceFrameProps) {
  const getDeviceStyles = () => {
    switch (shape.device) {
      case "phone":
        return {
          borderRadius: 24,
          notchHeight: 28,
          homeBar: true,
        };
      case "tablet":
        return {
          borderRadius: 16,
          notchHeight: 20,
          homeBar: false,
        };
      case "desktop":
        return {
          borderRadius: 8,
          notchHeight: 32,
          homeBar: false,
        };
    }
  };

  const styles = getDeviceStyles();

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        backgroundColor: shape.fill || "rgba(255,255,255,0.03)",
        border: `${shape.strokeWidth}px solid ${shape.stroke}`,
        borderRadius: styles.borderRadius,
        overflow: "hidden",
      }}
    >
      {/* Top bar / notch area */}
      <div
        style={{
          height: styles.notchHeight,
          backgroundColor: "rgba(255,255,255,0.05)",
          borderBottom: `1px solid ${shape.stroke}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {shape.device === "phone" && (
          <div
            style={{
              width: 60,
              height: 6,
              backgroundColor: shape.stroke,
              borderRadius: 3,
              opacity: 0.3,
            }}
          />
        )}
        {shape.device === "desktop" && (
          <div style={{ display: "flex", gap: 6, marginLeft: 12, position: "absolute", left: 0 }}>
            {["#ff5f57", "#ffbd2e", "#28c840"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: c,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: shape.h - styles.notchHeight - (styles.homeBar ? 20 : 0),
        }}
      >
        <span style={{ fontSize: 12, color: shape.stroke, opacity: 0.4 }}>
          {shape.device === "phone" ? "375 × 812" : shape.device === "tablet" ? "768 × 1024" : "1440 × 900"}
        </span>
      </div>

      {/* Home bar (phone only) */}
      {styles.homeBar && (
        <div
          style={{
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 100,
              height: 4,
              backgroundColor: shape.stroke,
              borderRadius: 2,
              opacity: 0.3,
            }}
          />
        </div>
      )}
    </div>
  );
}