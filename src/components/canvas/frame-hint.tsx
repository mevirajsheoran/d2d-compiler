"use client";

import { useAppSelector } from "@/redux/store";

export default function FrameHint() {
  const shapeIds = useAppSelector((state) => state.shapes.shapes.ids);
  const entities = useAppSelector((state) => state.shapes.shapes.entities);

  // Check if ANY frame exists on the canvas
  const hasFrame = shapeIds.some(
    (id) => entities[id]?.type === "frame"
  );

  if (hasFrame) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-24 left-1/2 z-[100] -translate-x-1/2"
      style={{ animation: "d2dSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-blue-500/20 bg-neutral-950/90 px-5 py-3 shadow-lg shadow-blue-500/5 backdrop-blur-md">
        {/* Animated arrow */}
        <span className="animate-bounce text-lg">👆</span>
        <div>
          <p className="text-sm font-medium text-neutral-200">
            Start by drawing a{" "}
            <span className="text-blue-400 font-semibold">Frame</span>
          </p>
          <p className="text-xs text-neutral-500">
            Select the Frame tool from the toolbar, then drag on the canvas
          </p>
        </div>
        {/* Pulsing frame icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
          <svg
            className="h-5 w-5 text-blue-400 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
          </svg>
        </div>
      </div>
    </div>
  );
}