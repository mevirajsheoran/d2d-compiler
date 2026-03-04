// src/lib/design-engine-pipeline/extractor.ts

import type {
  Shape,
  FrameShape,
  FreeDrawShape,
  HighlighterShape,
  TextShape,
} from "@/redux/slice/shapes";
import type { ExtractedShape } from "./types";

/* ──────────────────────────────────────────────────────────
   Get bounding box for ANY shape type.
   Returns null for frames and generatedui (we skip those).
   ────────────────────────────────────────────────────────── */
export function getShapeBounds(
  shape: Shape
): { x: number; y: number; w: number; h: number } | null {
  // Skip frames and generatedui — they are containers, not content
  if (shape.type === "frame" || shape.type === "generatedui") return null;

  // ── Bounded shapes (have x, y, w, h directly) ──
  // Covers: rect, roundedRect, ellipse, circle, triangle, star,
  //   polygon, divider, stickyNote, speechBubble, imagePlaceholder,
  //   videoPlaceholder, chartPlaceholder, buttonShape, inputField,
  //   checkbox, hamburgerMenu, deviceFrame
  if ("x" in shape && "y" in shape && "w" in shape && "h" in shape) {
    const s = shape as { x: number; y: number; w: number; h: number };
    return { x: s.x, y: s.y, w: s.w, h: s.h };
  }

  // ── Line-like shapes (have startX, startY, endX, endY) ──
  // Covers: arrow, line, connector
  if (
    "startX" in shape &&
    "startY" in shape &&
    "endX" in shape &&
    "endY" in shape
  ) {
    const s = shape as {
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };
    const minX = Math.min(s.startX, s.endX);
    const minY = Math.min(s.startY, s.endY);
    const maxX = Math.max(s.startX, s.endX);
    const maxY = Math.max(s.startY, s.endY);
    return {
      x: minX,
      y: minY,
      w: Math.max(maxX - minX, 1),
      h: Math.max(maxY - minY, 1),
    };
  }

  // ── Freehand shapes (have points[]) ──
  // Covers: freedraw, highlighter
  if ("points" in shape && Array.isArray((shape as FreeDrawShape).points)) {
    const s = shape as FreeDrawShape | HighlighterShape;
    if (!s.points || s.points.length === 0) return null;
    const xs = s.points.map((p) => p.x);
    const ys = s.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return {
      x: minX,
      y: minY,
      w: Math.max(Math.max(...xs) - minX, 1),
      h: Math.max(Math.max(...ys) - minY, 1),
    };
  }

  // ── Text shape (has x, y but no w, h — we estimate) ──
  if (shape.type === "text") {
    const s = shape as TextShape;
    const textWidth = Math.max(100, s.text.length * s.fontSize * 0.55);
    const lines = s.text.split("\n").length;
    const textHeight = s.fontSize * s.lineHeight * lines;
    return { x: s.x, y: s.y, w: textWidth, h: textHeight };
  }

  return null;
}

/* ──────────────────────────────────────────────────────────
   Check if shape overlaps with frame using OVERLAP RATIO.
   
   A shape is "inside" the frame if >= 50% of its area
   overlaps with the frame area.
   
   This is better than center-point check because a shape
   can be mostly inside but its center outside (or vice versa).
   ────────────────────────────────────────────────────────── */
function isInsideFrame(shape: Shape, frame: FrameShape): boolean {
  const bounds = getShapeBounds(shape);
  if (!bounds) return false;

  // Calculate intersection rectangle
  const intersectX1 = Math.max(bounds.x, frame.x);
  const intersectY1 = Math.max(bounds.y, frame.y);
  const intersectX2 = Math.min(bounds.x + bounds.w, frame.x + frame.w);
  const intersectY2 = Math.min(bounds.y + bounds.h, frame.y + frame.h);

  // No intersection at all
  if (intersectX2 <= intersectX1 || intersectY2 <= intersectY1) return false;

  const intersectionArea =
    (intersectX2 - intersectX1) * (intersectY2 - intersectY1);
  const shapeArea = bounds.w * bounds.h;

  // Avoid division by zero
  if (shapeArea === 0) return false;

  // Shape is "inside" if >= 50% of it overlaps with frame
  return intersectionArea / shapeArea >= 0.5;
}

/* ──────────────────────────────────────────────────────────
   MAIN EXTRACTOR FUNCTION
   
   Takes: the target frame + all shapes on canvas
   Returns: shapes inside the frame with coordinates
            normalized relative to frame origin (0,0)
   
   Skips: the frame itself, other frames, generatedui shapes,
          and shapes with near-zero dimensions
   ────────────────────────────────────────────────────────── */
export function extractShapesFromFrame(
  frame: FrameShape,
  allShapes: Shape[]
): ExtractedShape[] {
  const extracted: ExtractedShape[] = [];

  for (const shape of allShapes) {
    // Skip the frame itself
    if (shape.id === frame.id) continue;
    // Skip other frames (they're containers, not content)
    if (shape.type === "frame") continue;
    // Skip generated UI shapes
    if (shape.type === "generatedui") continue;

    // Check if this shape is inside our target frame
    if (!isInsideFrame(shape, frame)) continue;

    const bounds = getShapeBounds(shape);
    if (!bounds) continue;

    // Skip shapes with near-zero dimensions (probably accidental clicks)
    if (bounds.w < 2 && bounds.h < 2) continue;

    // Normalize coordinates: make them relative to frame's top-left corner
    extracted.push({
      originalShape: shape,
      relX: bounds.x - frame.x,
      relY: bounds.y - frame.y,
      width: bounds.w,
      height: bounds.h,
      centerX: bounds.x + bounds.w / 2 - frame.x,
      centerY: bounds.y + bounds.h / 2 - frame.y,
    });
  }

  // Sort: top-to-bottom first, then left-to-right for same row
  // Using 10px tolerance for "same row" during sorting
  extracted.sort((a, b) => {
    const yDiff = a.relY - b.relY;
    if (Math.abs(yDiff) > 10) return yDiff;
    return a.relX - b.relX;
  });

  return extracted;
}