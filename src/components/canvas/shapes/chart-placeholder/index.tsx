"use client";

import { ChartPlaceholderShape } from "@/redux/slice/shapes";

interface ChartPlaceholderProps {
  shape: ChartPlaceholderShape;
  isSelected?: boolean;
}

export function ChartPlaceholder({ shape }: ChartPlaceholderProps) {
  const innerPadding = 20;
  const chartW = shape.w - innerPadding * 2;
  const chartH = shape.h - innerPadding * 2 - 20;

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
      }}
    >
      {/* Title */}
      <div style={{ padding: "8px 12px 0", opacity: 0.5 }}>
        <span style={{ fontSize: 10, color: shape.stroke }}>
          {shape.chartType === "bar" ? "Bar Chart" : shape.chartType === "line" ? "Line Chart" : "Pie Chart"}
        </span>
      </div>

      <svg
        width={chartW}
        height={chartH}
        style={{ margin: `4px ${innerPadding}px` }}
      >
        {shape.chartType === "bar" && (
          <>
            {[0.6, 0.8, 0.4, 0.9, 0.5, 0.7].map((h, i) => {
              const barW = chartW / 8;
              const barH = chartH * h;
              return (
                <rect
                  key={i}
                  x={i * (chartW / 6) + barW / 2}
                  y={chartH - barH}
                  width={barW}
                  height={barH}
                  fill={shape.stroke}
                  opacity={0.3}
                  rx={2}
                />
              );
            })}
          </>
        )}

        {shape.chartType === "line" && (
          <polyline
            points={[0.3, 0.7, 0.4, 0.8, 0.5, 0.6]
              .map((v, i) => `${(i / 5) * chartW},${chartH - v * chartH}`)
              .join(" ")}
            fill="none"
            stroke={shape.stroke}
            strokeWidth={2}
            opacity={0.5}
          />
        )}

        {shape.chartType === "pie" && (
          <>
            <circle
              cx={chartW / 2} cy={chartH / 2}
              r={Math.min(chartW, chartH) / 2 - 4}
              fill="none"
              stroke={shape.stroke}
              strokeWidth={Math.min(chartW, chartH) / 4}
              strokeDasharray={`${Math.min(chartW, chartH) * 0.8} ${Math.min(chartW, chartH) * 2}`}
              opacity={0.3}
              transform={`rotate(-90 ${chartW / 2} ${chartH / 2})`}
            />
            <circle
              cx={chartW / 2} cy={chartH / 2}
              r={Math.min(chartW, chartH) / 2 - 4}
              fill="none"
              stroke={shape.stroke}
              strokeWidth={Math.min(chartW, chartH) / 4}
              strokeDasharray={`${Math.min(chartW, chartH) * 0.5} ${Math.min(chartW, chartH) * 2}`}
              opacity={0.15}
              transform={`rotate(60 ${chartW / 2} ${chartH / 2})`}
            />
          </>
        )}
      </svg>
    </div>
  );
}