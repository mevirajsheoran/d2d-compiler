"use client";

import { useAppSelector } from "@/redux/store";
import { Shape, FreeDrawShape, ArrowShape, LineShape } from "@/redux/slice/shapes";
import { cn } from "@/lib/utils";

type ResizeCorner = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

// Extended to include line endpoint handles
type HandleType = ResizeCorner | "line-start" | "line-end";

interface SelectionOverlayProps {
  onResizeStart: (shapeId: string, corner: ResizeCorner, e: React.PointerEvent) => void;
  onLineEndpointDrag?: (shapeId: string, endpoint: "start" | "end", e: React.PointerEvent) => void;
}

export function SelectionOverlay({ onResizeStart, onLineEndpointDrag }: SelectionOverlayProps) {
  const selected = useAppSelector((state) => state.shapes.selected);
  const entities = useAppSelector((state) => state.shapes.shapes.entities);

  const selectedIds = Object.keys(selected || {});

  if (selectedIds.length === 0) return null;

  return (
    <>
      {selectedIds.map((id) => {
        const shape = entities[id];
        if (!shape) return null;

        // Use specialized selection for line/arrow
        if (shape.type === "line" || shape.type === "arrow") {
          return (
            <LineSelectionBox
              key={id}
              shape={shape as ArrowShape | LineShape}
              onEndpointDrag={(endpoint, e) => onLineEndpointDrag?.(id, endpoint, e)}
            />
          );
        }

        return (
          <SelectionBox
            key={id}
            shape={shape}
            onResizeStart={(corner, e) => onResizeStart(id, corner, e)}
          />
        );
      })}
    </>
  );
}

/* ======================================================
   Standard Selection Box (rect, ellipse, frame, text, freedraw)
====================================================== */
interface SelectionBoxProps {
  shape: Shape;
  onResizeStart: (corner: ResizeCorner, e: React.PointerEvent) => void;
}

function SelectionBox({ shape, onResizeStart }: SelectionBoxProps) {
  let bounds = { x: 0, y: 0, w: 0, h: 0 };

  if (["frame", "rect", "ellipse", "text", "generatedui"].includes(shape.type)) {
    bounds = {
      x: (shape as any).x,
      y: (shape as any).y,
      w: (shape as any).w || 100,
      h: (shape as any).h || 24,
    };
  } else if (shape.type === "freedraw") {
    const freeShape = shape as FreeDrawShape;
    if (freeShape.points.length > 0) {
      const xs = freeShape.points.map((p) => p.x);
      const ys = freeShape.points.map((p) => p.y);
      bounds = {
        x: Math.min(...xs),
        y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs),
        h: Math.max(...ys) - Math.min(...ys),
      };
    }
  }

  const padding = 4;
  const handleSize = 8;
  const halfHandle = handleSize / 2;

  const handles: { corner: ResizeCorner; x: number; y: number; cursor: string }[] = [
    { corner: "nw", x: -halfHandle, y: -halfHandle, cursor: "nwse-resize" },
    { corner: "n", x: bounds.w / 2 - halfHandle, y: -halfHandle, cursor: "ns-resize" },
    { corner: "ne", x: bounds.w - halfHandle, y: -halfHandle, cursor: "nesw-resize" },
    { corner: "e", x: bounds.w - halfHandle, y: bounds.h / 2 - halfHandle, cursor: "ew-resize" },
    { corner: "se", x: bounds.w - halfHandle, y: bounds.h - halfHandle, cursor: "nwse-resize" },
    { corner: "s", x: bounds.w / 2 - halfHandle, y: bounds.h - halfHandle, cursor: "ns-resize" },
    { corner: "sw", x: -halfHandle, y: bounds.h - halfHandle, cursor: "nesw-resize" },
    { corner: "w", x: -halfHandle, y: bounds.h / 2 - halfHandle, cursor: "ew-resize" },
  ];

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: bounds.x - padding,
        top: bounds.y - padding,
        width: bounds.w + padding * 2,
        height: bounds.h + padding * 2,
      }}
    >
      {/* Selection border */}
      <div
        className="absolute inset-0 border-2 rounded-sm"
        style={{ borderColor: "hsl(var(--primary))" }}
      />

      {/* Resize handles */}
      {handles.map(({ corner, x, y, cursor }) => (
        <div
          key={corner}
          className={cn(
            "absolute pointer-events-auto",
            "w-2 h-2 rounded-full",
            "bg-background border-2",
            "transition-transform hover:scale-125"
          )}
          style={{
            left: x + padding,
            top: y + padding,
            cursor,
            borderColor: "hsl(var(--primary))",
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onResizeStart(corner, e);
          }}
        />
      ))}
    </div>
  );
}

/* ======================================================
   Line/Arrow Selection Box - 2 endpoint handles + dashed line
====================================================== */
interface LineSelectionBoxProps {
  shape: ArrowShape | LineShape;
  onEndpointDrag: (endpoint: "start" | "end", e: React.PointerEvent) => void;
}

function LineSelectionBox({ shape, onEndpointDrag }: LineSelectionBoxProps) {
  const handleSize = 10;
  const halfHandle = handleSize / 2;

  return (
    <>
      {/* Dashed selection line along the shape */}
      <svg
        className="absolute pointer-events-none overflow-visible"
        style={{ left: 0, top: 0, width: 1, height: 1 }}
      >
        <line
          x1={shape.startX}
          y1={shape.startY}
          x2={shape.endX}
          y2={shape.endY}
          stroke="hsl(var(--primary))"
          strokeWidth={1}
          strokeDasharray="4 4"
          fill="none"
        />
      </svg>

      {/* Start endpoint handle */}
      <div
        className={cn(
          "absolute pointer-events-auto",
          "rounded-full",
          "bg-background border-2",
          "transition-transform hover:scale-150",
          "cursor-move"
        )}
        style={{
          left: shape.startX - halfHandle,
          top: shape.startY - halfHandle,
          width: handleSize,
          height: handleSize,
          borderColor: "hsl(var(--primary))",
          zIndex: 10,
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onEndpointDrag("start", e);
        }}
      />

      {/* End endpoint handle */}
      <div
        className={cn(
          "absolute pointer-events-auto",
          "rounded-full",
          "bg-background border-2",
          "transition-transform hover:scale-150",
          "cursor-move"
        )}
        style={{
          left: shape.endX - halfHandle,
          top: shape.endY - halfHandle,
          width: handleSize,
          height: handleSize,
          borderColor: "hsl(var(--primary))",
          zIndex: 10,
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onEndpointDrag("end", e);
        }}
      />

      {/* Midpoint indicator (small diamond) */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: (shape.startX + shape.endX) / 2 - 3,
          top: (shape.startY + shape.endY) / 2 - 3,
          width: 6,
          height: 6,
          backgroundColor: "hsl(var(--primary))",
          transform: "rotate(45deg)",
          opacity: 0.5,
        }}
      />
    </>
  );
}