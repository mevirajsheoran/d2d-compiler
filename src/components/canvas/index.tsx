"use client";

import { useCanvas } from "@/hooks/use-canvas";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useSearchParams } from "next/navigation";
import { TextSidebar } from "./text-sidebar";
import { ShapeRenderer } from "./shapes";
import { SelectionOverlay } from "./shapes/selection";
import { cn } from "@/lib/utils";
import {
  BOUNDED_DRAW_TOOLS,
  LINE_DRAW_TOOLS,
  FREEHAND_TOOLS,
  Tool,
} from "@/redux/slice/shapes";
import type { SnapGuide } from "@/hooks/use-canvas";

// Previews for specific shapes
import { RectanglePreview } from "./shapes/rectangle/preview";
import { EllipsePreview } from "./shapes/ellipse/preview";
import { FramePreview } from "./shapes/frame/preview";
import { ArrowPreview } from "./shapes/arrow/preview";
import { LinePreview } from "./shapes/line/preview";
import { StrokePreview } from "./shapes/stroke/preview";
import { RoundedRectanglePreview } from "./shapes/rounded-rectangle/preview";
import { CirclePreview } from "./shapes/circle/preview";
import { TrianglePreview } from "./shapes/triangle/preview";
import { StarPreview } from "./shapes/star/preview";
import { PolygonPreview } from "./shapes/polygon/preview";
import { ConnectorPreview } from "./shapes/connector/preview";
import { DividerPreview } from "./shapes/divider/preview";
import { HighlighterPreview } from "./shapes/highlighter/preview";
import { GenericBoundedPreview } from "./shapes/generic-preview";

/* ======================================================
   Preview Renderer - picks the right preview for each tool
====================================================== */
function DraftPreview({
  tool,
  startX,
  startY,
  endX,
  endY,
}: {
  tool: Tool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const w = Math.abs(endX - startX);
  const h = Math.abs(endY - startY);

  // Line-like tools use start/end coordinates
  if (LINE_DRAW_TOOLS.includes(tool)) {
    switch (tool) {
      case "arrow":
        return (
          <ArrowPreview
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
          />
        );
      case "line":
        return (
          <LinePreview
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
          />
        );
      case "connector":
        return (
          <ConnectorPreview
            startX={startX}
            startY={startY}
            endX={endX}
            endY={endY}
          />
        );
      default:
        return null;
    }
  }

  // Bounded tools use x, y, w, h
  if (BOUNDED_DRAW_TOOLS.includes(tool)) {
    switch (tool) {
      case "frame":
        return <FramePreview x={x} y={y} w={w} h={h} />;
      case "rect":
        return <RectanglePreview x={x} y={y} w={w} h={h} />;
      case "roundedRect":
        return <RoundedRectanglePreview x={x} y={y} w={w} h={h} />;
      case "ellipse":
        return <EllipsePreview x={x} y={y} w={w} h={h} />;
      case "circle":
        return <CirclePreview x={x} y={y} w={w} h={h} />;
      case "triangle":
        return <TrianglePreview x={x} y={y} w={w} h={h} />;
      case "star":
        return <StarPreview x={x} y={y} w={w} h={h} />;
      case "polygon":
        return <PolygonPreview x={x} y={y} w={w} h={h} />;
      case "divider":
        return <DividerPreview x={x} y={y} w={w} h={h} />;
      default:
        return <GenericBoundedPreview x={x} y={y} w={w} h={h} />;
    }
  }

  return null;
}

/* ======================================================
   Freehand Preview
====================================================== */
function FreehandPreview({
  tool,
  points,
}: {
  tool: Tool;
  points: { x: number; y: number }[];
}) {
  if (points.length < 2) return null;

  if (tool === "highlighter") {
    return <HighlighterPreview points={points} />;
  }

  return <StrokePreview points={points} />;
}

/* ======================================================
   Marquee Selection Rectangle
====================================================== */
function MarqueePreview({
  startX,
  startY,
  endX,
  endY,
}: {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}) {
  const x = Math.min(startX, endX);
  const y = Math.min(startY, endY);
  const w = Math.abs(endX - startX);
  const h = Math.abs(endY - startY);

  if (w < 1 && h < 1) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: "rgba(59, 130, 246, 0.08)",
        border: "1.5px solid rgba(59, 130, 246, 0.6)",
        borderRadius: 2,
      }}
    />
  );
}

/* ======================================================
   Snap Alignment Guide Lines
====================================================== */
function SnapGuidesOverlay({ guides }: { guides: SnapGuide[] }) {
  if (guides.length === 0) return null;

  return (
    <svg
      className="absolute pointer-events-none overflow-visible"
      style={{ left: 0, top: 0, width: 1, height: 1, zIndex: 9999 }}
    >
      {guides.map((guide, i) => {
        if (guide.type === "vertical") {
          return (
            <line
              key={`snap-v-${i}`}
              x1={guide.position}
              y1={guide.start}
              x2={guide.position}
              y2={guide.end}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.8}
            />
          );
        } else {
          return (
            <line
              key={`snap-h-${i}`}
              x1={guide.start}
              y1={guide.position}
              x2={guide.end}
              y2={guide.position}
              stroke="#3b82f6"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.8}
            />
          );
        }
      })}
    </svg>
  );
}

/* ======================================================
   InfiniteCanvas Component
====================================================== */
export function InfiniteCanvas() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const {
    viewport,
    shapeList,
    currentTool,
    selectedIds,
    sidebarOpen,
    setSidebarOpen,
    attachCanvasRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    getDraftShape,
    getFreeDrawPoints,
    getCurrentFreehandTool,
    getMarquee,
    getSnapGuides,
    startResize,
    startLineEndpointDrag,
  } = useCanvas();

  // Auto-save
  useAutoSave({ projectId });

  const draftShape = getDraftShape();
  const freeDrawPoints = getFreeDrawPoints();
  const freehandTool = getCurrentFreehandTool();
  const marquee = getMarquee();
  const snapGuides = getSnapGuides();

  // Cursor based on tool
  const getCursor = () => {
    switch (currentTool) {
      case "pan":
        return "grab";
      case "select":
        return "default";
      case "text":
        return "text";
      case "eraser":
        return "crosshair";
      case "highlighter":
        return "crosshair";
      default:
        return "crosshair";
    }
  };

  return (
    <>
      {/* Text Sidebar */}
      <TextSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Canvas */}
      <div
        ref={attachCanvasRef}
        role="application"
        aria-label="Drawing canvas"
        className={cn("w-full h-full overflow-hidden relative")}
        style={{
          cursor: getCursor(),
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onContextMenu={(e) => e.preventDefault()}
        draggable={false}
      >
        {/* Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--muted-foreground) / 0.3) 1px, transparent 1px)`,
            backgroundSize: `${24 * viewport.scale}px ${24 * viewport.scale}px`,
            backgroundPosition: `${viewport.translate.x}px ${viewport.translate.y}px`,
          }}
        />

        {/* Transformed Layer */}
        <div
          className="absolute origin-top-left"
          style={{
            transform: `translate(${viewport.translate.x}px, ${viewport.translate.y}px) scale(${viewport.scale})`,
          }}
        >
          {/* Render all shapes */}
          {shapeList.map((shape) => (
            <ShapeRenderer
              key={shape.id}
              shape={shape}
              isSelected={selectedIds.includes(shape.id)}
            />
          ))}

          {/* Selection overlay */}
          <SelectionOverlay
            onResizeStart={startResize}
            onLineEndpointDrag={startLineEndpointDrag}
          />

          {/* Draft shape preview (while drawing) */}
          {draftShape && draftShape.type && (
            <DraftPreview
              tool={draftShape.type as Tool}
              startX={draftShape.startX}
              startY={draftShape.startY}
              endX={draftShape.endX}
              endY={draftShape.endY}
            />
          )}

          {/* Freehand preview (while drawing) */}
          {FREEHAND_TOOLS.includes(currentTool) &&
            freeDrawPoints.length > 1 && (
              <FreehandPreview tool={freehandTool} points={freeDrawPoints} />
            )}

          {/* Marquee selection preview */}
          {marquee && (
            <MarqueePreview
              startX={marquee.startX}
              startY={marquee.startY}
              endX={marquee.endX}
              endY={marquee.endY}
            />
          )}

          {/* Snap alignment guides */}
          <SnapGuidesOverlay guides={snapGuides} />
        </div>
      </div>
    </>
  );
}