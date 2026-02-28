"use client";

import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  Shape,
  Tool,
  setTool,
  selectShape,
  addToSelection,
  deselectShape,
  clearSelection,
  addBoundedShape,
  addLineLikeShape,
  addText,
  addFreeDrawShape,
  addHighlighterShape,
  updateShape,
  removeShape,
  deleteSelected,
  startFreeDraw,
  continueFreeDraw,
  endFreeDraw,
  undo,
  redo,
  saveHistorySnapshot,
  FreeDrawShape,
  HighlighterShape,
  ArrowShape,
  LineShape,
  ConnectorShape,
  TextShape,
  FrameShape,
  RectShape,
  EllipseShape,
  BOUNDED_DRAW_TOOLS,
  LINE_DRAW_TOOLS,
  FREEHAND_TOOLS,
} from "@/redux/slice/shapes";
import {
  panStart,
  panMove,
  panEnd,
  wheelZoom,
  wheelPan,
  zoomIn,
  zoomOut,
  resetView,
  Point,
} from "@/redux/slice/viewport";
import { nanoid } from "@reduxjs/toolkit";

/* ======================================================
   Types
====================================================== */
interface DraftShape {
  type: Tool;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

type ResizeCorner = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";

interface ResizingData {
  shapeId: string;
  corner: ResizeCorner;
  initialBounds: { x: number; y: number; w: number; h: number };
  startPoint: Point;
}

interface MarqueeRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

// Snap guide lines rendered on canvas
export interface SnapGuide {
  type: "vertical" | "horizontal";
  position: number; // x for vertical, y for horizontal
  start: number;    // start of the line (y for vertical, x for horizontal)
  end: number;      // end of the line
}

/* ======================================================
   Constants
====================================================== */
const FREEHAND_INTERVAL_MS = 16;
const HIT_THRESHOLD = 8;
const PASTE_OFFSET = 20;
const GRID_SIZE = 8;
const SNAP_THRESHOLD = 6;

/* ======================================================
   Helper: Shape type checks
====================================================== */
const BOUNDED_SHAPE_TYPES = [
  "frame", "rect", "roundedRect", "ellipse", "circle",
  "triangle", "star", "polygon", "divider",
  "stickyNote", "speechBubble",
  "imagePlaceholder", "videoPlaceholder", "chartPlaceholder",
  "buttonShape", "inputField", "checkbox", "hamburgerMenu", "deviceFrame",
  "generatedui", "text",
];

const LINE_SHAPE_TYPES = ["arrow", "line", "connector"];
const FREEHAND_SHAPE_TYPES = ["freedraw", "highlighter"];

function isBoundedShape(shape: Shape): shape is Shape & { x: number; y: number; w: number; h: number } {
  return BOUNDED_SHAPE_TYPES.includes(shape.type);
}

function isLineShape(shape: Shape): shape is ArrowShape | LineShape | ConnectorShape {
  return LINE_SHAPE_TYPES.includes(shape.type);
}

function isFreehandShape(shape: Shape): shape is FreeDrawShape | HighlighterShape {
  return FREEHAND_SHAPE_TYPES.includes(shape.type);
}

/* ======================================================
   Helper: Get bounding box of any shape
====================================================== */
function getShapeBounds(shape: Shape): { x: number; y: number; w: number; h: number } | null {
  if (isBoundedShape(shape)) {
    const s = shape as any;
    return { x: s.x, y: s.y, w: s.w || 100, h: s.h || 24 };
  }

  if (isLineShape(shape)) {
    const line = shape as ArrowShape | LineShape | ConnectorShape;
    const x = Math.min(line.startX, line.endX);
    const y = Math.min(line.startY, line.endY);
    const w = Math.abs(line.endX - line.startX);
    const h = Math.abs(line.endY - line.startY);
    return { x, y, w: Math.max(w, 1), h: Math.max(h, 1) };
  }

  if (isFreehandShape(shape)) {
    const free = shape as FreeDrawShape | HighlighterShape;
    if (free.points.length === 0) return null;
    const xs = free.points.map((p) => p.x);
    const ys = free.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return {
      x: minX,
      y: minY,
      w: Math.max(Math.max(...xs) - minX, 1),
      h: Math.max(Math.max(...ys) - minY, 1),
    };
  }

  return null;
}

/* ======================================================
   Helper: Check if shape is fully inside a rectangle
====================================================== */
function isShapeInsideRect(
  shape: Shape,
  rect: { x: number; y: number; w: number; h: number }
): boolean {
  const bounds = getShapeBounds(shape);
  if (!bounds) return false;

  return (
    bounds.x >= rect.x &&
    bounds.y >= rect.y &&
    bounds.x + bounds.w <= rect.x + rect.w &&
    bounds.y + bounds.h <= rect.y + rect.h
  );
}

/* ======================================================
   Helper: Clone a shape with new ID and offset
====================================================== */
function cloneShapeWithOffset(shape: Shape, offsetX: number, offsetY: number): Shape {
  const newId = nanoid();

  if (isBoundedShape(shape)) {
    const s = shape as any;
    return {
      ...JSON.parse(JSON.stringify(s)),
      id: newId,
      x: s.x + offsetX,
      y: s.y + offsetY,
    };
  }

  if (isLineShape(shape)) {
    const line = shape as ArrowShape | LineShape | ConnectorShape;
    return {
      ...JSON.parse(JSON.stringify(line)),
      id: newId,
      startX: line.startX + offsetX,
      startY: line.startY + offsetY,
      endX: line.endX + offsetX,
      endY: line.endY + offsetY,
    };
  }

  if (isFreehandShape(shape)) {
    const free = shape as FreeDrawShape | HighlighterShape;
    return {
      ...JSON.parse(JSON.stringify(free)),
      id: newId,
      points: free.points.map((p) => ({
        x: p.x + offsetX,
        y: p.y + offsetY,
      })),
    };
  }

  return {
    ...JSON.parse(JSON.stringify(shape)),
    id: newId,
  };
}

/* ======================================================
   Helper: Snap value to grid
====================================================== */
function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/* ======================================================
   Helper: Apply shift constraint to bounded drawing
   Forces perfect square (w === h)
====================================================== */
function applyBoundedConstraint(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { endX: number; endY: number } {
  const dx = endX - startX;
  const dy = endY - startY;
  const size = Math.max(Math.abs(dx), Math.abs(dy));
  return {
    endX: startX + size * Math.sign(dx || 1),
    endY: startY + size * Math.sign(dy || 1),
  };
}

/* ======================================================
   Helper: Apply shift constraint to line drawing
   Locks to 0°, 45°, 90°, 135°, 180°, etc.
====================================================== */
function applyLineConstraint(
  startX: number,
  startY: number,
  endX: number,
  endY: number
): { endX: number; endY: number } {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) return { endX, endY };

  const angle = Math.atan2(dy, dx);
  const snappedAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);

  return {
    endX: startX + Math.cos(snappedAngle) * length,
    endY: startY + Math.sin(snappedAngle) * length,
  };
}

/* ======================================================
   Helper: Apply shift constraint to resize
   Maintains aspect ratio
====================================================== */
function applyResizeConstraint(
  corner: ResizeCorner,
  initialBounds: { x: number; y: number; w: number; h: number },
  newBounds: { x: number; y: number; w: number; h: number }
): { x: number; y: number; w: number; h: number } {
  const aspectRatio = initialBounds.w / initialBounds.h;
  const result = { ...newBounds };

  // Determine dominant axis based on corner
  const isCorner = ["nw", "ne", "se", "sw"].includes(corner);
  if (!isCorner) return result; // Edge handles don't constrain

  const absW = Math.abs(result.w);
  const absH = Math.abs(result.h);

  if (absW / aspectRatio > absH) {
    // Width is dominant — adjust height
    result.h = (absW / aspectRatio) * Math.sign(result.h || 1);
  } else {
    // Height is dominant — adjust width
    result.w = (absH * aspectRatio) * Math.sign(result.w || 1);
  }

  // Adjust position for corners that move origin
  if (corner === "nw") {
    result.x = initialBounds.x + initialBounds.w - Math.abs(result.w);
    result.y = initialBounds.y + initialBounds.h - Math.abs(result.h);
  } else if (corner === "ne") {
    result.y = initialBounds.y + initialBounds.h - Math.abs(result.h);
  } else if (corner === "sw") {
    result.x = initialBounds.x + initialBounds.w - Math.abs(result.w);
  }
  // "se" doesn't move origin

  return result;
}

/* ======================================================
   Helper: Calculate snap alignment guides
====================================================== */
function calculateSnapGuides(
  draggedBounds: { x: number; y: number; w: number; h: number },
  allShapes: Shape[],
  excludeIds: Set<string>
): { guides: SnapGuide[]; snapDeltaX: number; snapDeltaY: number } {
  const guides: SnapGuide[] = [];
  let snapDeltaX = 0;
  let snapDeltaY = 0;
  let foundX = false;
  let foundY = false;

  const dragLeft = draggedBounds.x;
  const dragRight = draggedBounds.x + draggedBounds.w;
  const dragTop = draggedBounds.y;
  const dragBottom = draggedBounds.y + draggedBounds.h;
  const dragCenterX = draggedBounds.x + draggedBounds.w / 2;
  const dragCenterY = draggedBounds.y + draggedBounds.h / 2;

  // Collect all edges and centers from other shapes
  for (const shape of allShapes) {
    if (excludeIds.has(shape.id)) continue;

    const bounds = getShapeBounds(shape);
    if (!bounds) continue;

    const otherLeft = bounds.x;
    const otherRight = bounds.x + bounds.w;
    const otherTop = bounds.y;
    const otherBottom = bounds.y + bounds.h;
    const otherCenterX = bounds.x + bounds.w / 2;
    const otherCenterY = bounds.y + bounds.h / 2;

    // Min/max Y for vertical guide line extent
    const minY = Math.min(dragTop, otherTop) - 20;
    const maxY = Math.max(dragBottom, otherBottom) + 20;
    // Min/max X for horizontal guide line extent
    const minX = Math.min(dragLeft, otherLeft) - 20;
    const maxX = Math.max(dragRight, otherRight) + 20;

    // ─── VERTICAL ALIGNMENT (X axis snapping) ───
    if (!foundX) {
      // Left-to-left
      if (Math.abs(dragLeft - otherLeft) < SNAP_THRESHOLD) {
        snapDeltaX = otherLeft - dragLeft;
        guides.push({ type: "vertical", position: otherLeft, start: minY, end: maxY });
        foundX = true;
      }
      // Left-to-right
      else if (Math.abs(dragLeft - otherRight) < SNAP_THRESHOLD) {
        snapDeltaX = otherRight - dragLeft;
        guides.push({ type: "vertical", position: otherRight, start: minY, end: maxY });
        foundX = true;
      }
      // Right-to-left
      else if (Math.abs(dragRight - otherLeft) < SNAP_THRESHOLD) {
        snapDeltaX = otherLeft - dragRight;
        guides.push({ type: "vertical", position: otherLeft, start: minY, end: maxY });
        foundX = true;
      }
      // Right-to-right
      else if (Math.abs(dragRight - otherRight) < SNAP_THRESHOLD) {
        snapDeltaX = otherRight - dragRight;
        guides.push({ type: "vertical", position: otherRight, start: minY, end: maxY });
        foundX = true;
      }
      // Center-to-center X
      else if (Math.abs(dragCenterX - otherCenterX) < SNAP_THRESHOLD) {
        snapDeltaX = otherCenterX - dragCenterX;
        guides.push({ type: "vertical", position: otherCenterX, start: minY, end: maxY });
        foundX = true;
      }
    }

    // ─── HORIZONTAL ALIGNMENT (Y axis snapping) ───
    if (!foundY) {
      // Top-to-top
      if (Math.abs(dragTop - otherTop) < SNAP_THRESHOLD) {
        snapDeltaY = otherTop - dragTop;
        guides.push({ type: "horizontal", position: otherTop, start: minX, end: maxX });
        foundY = true;
      }
      // Top-to-bottom
      else if (Math.abs(dragTop - otherBottom) < SNAP_THRESHOLD) {
        snapDeltaY = otherBottom - dragTop;
        guides.push({ type: "horizontal", position: otherBottom, start: minX, end: maxX });
        foundY = true;
      }
      // Bottom-to-top
      else if (Math.abs(dragBottom - otherTop) < SNAP_THRESHOLD) {
        snapDeltaY = otherTop - dragBottom;
        guides.push({ type: "horizontal", position: otherTop, start: minX, end: maxX });
        foundY = true;
      }
      // Bottom-to-bottom
      else if (Math.abs(dragBottom - otherBottom) < SNAP_THRESHOLD) {
        snapDeltaY = otherBottom - dragBottom;
        guides.push({ type: "horizontal", position: otherBottom, start: minX, end: maxX });
        foundY = true;
      }
      // Center-to-center Y
      else if (Math.abs(dragCenterY - otherCenterY) < SNAP_THRESHOLD) {
        snapDeltaY = otherCenterY - dragCenterY;
        guides.push({ type: "horizontal", position: otherCenterY, start: minX, end: maxX });
        foundY = true;
      }
    }

    if (foundX && foundY) break; // Found both axes, stop early
  }

  return { guides, snapDeltaX, snapDeltaY };
}

/* ======================================================
   Main Hook
====================================================== */
export function useCanvas() {
  const dispatch = useAppDispatch();

  // ============================================
  // REDUX STATE
  // ============================================
  const viewport = useAppSelector((state) => state.viewport);
  const shapesState = useAppSelector((state) => state.shapes);
  const currentTool = useAppSelector((state) => state.shapes.tool);

  const shapeList: Shape[] = useMemo(() => {
    const { ids, entities } = shapesState.shapes;
    const idArray = Array.isArray(ids) ? ids : [];
    return idArray
      .map((id: string) => entities[id])
      .filter((shape): shape is Shape => shape !== undefined && shape !== null);
  }, [shapesState.shapes]);

  const selectedIds = useMemo(() => {
    return Object.keys(shapesState.selected || {});
  }, [shapesState.selected]);

  const shapeEntities = useMemo(
    () => shapesState.shapes.entities,
    [shapesState.shapes.entities]
  );

  const TEXT_EDITABLE_TYPES = ["text", "buttonShape", "inputField", "checkbox", "stickyNote", "speechBubble"];

  const hasSelectedText = useMemo(() => {
    return selectedIds.some((id) => {
      const shape = shapeEntities[id];
      return shape && TEXT_EDITABLE_TYPES.includes(shape.type);
    });
  }, [selectedIds, shapeEntities]);

  // ============================================
  // LOCAL STATE
  // ============================================
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setForceUpdate] = useState(0);

  // ============================================
  // REFS
  // ============================================
  const canvasRef = useRef<HTMLDivElement>(null);
  const draftShapeRef = useRef<DraftShape | null>(null);
  const freePointsRef = useRef<Point[]>([]);

  const spacePressed = useRef(false);
  const shiftPressed = useRef(false);
  const ctrlPressed = useRef(false);

  const drawingRef = useRef(false);
  const movingRef = useRef(false);
  const moveStartRef = useRef<Point | null>(null);
  const initialShapePositionsRef = useRef<Map<string, any>>(new Map());
  const erasingRef = useRef(false);
  const erasedShapesRef = useRef<Set<string>>(new Set());
  const resizingRef = useRef(false);
  const resizingDataRef = useRef<ResizingData | null>(null);

  const lineEndpointDragRef = useRef<{
    shapeId: string;
    endpoint: "start" | "end";
  } | null>(null);

  const freehandAnimationRef = useRef<number | null>(null);
  const lastFreehandFrameRef = useRef<number>(0);
  const panAnimationRef = useRef<number | null>(null);

  const currentFreehandToolRef = useRef<Tool>("freedraw");

  // Marquee
  const marqueeRef = useRef<MarqueeRect | null>(null);
  const marqueeActiveRef = useRef(false);

  // Clipboard
  const clipboardRef = useRef<Shape[]>([]);
  const pasteCountRef = useRef(0);

  // Snap guides (visible lines during drag)
  const snapGuidesRef = useRef<SnapGuide[]>([]);

  // Alt+drag duplicate tracking
  const altDuplicatedRef = useRef(false);

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const requestRender = useCallback(() => {
    setForceUpdate((n) => (n + 1) % 1000000);
  }, []);

  const screenToCanvas = useCallback(
    (clientX: number, clientY: number): Point => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return { x: clientX, y: clientY };
      return {
        x: (clientX - rect.left - viewport.translate.x) / viewport.scale,
        y: (clientY - rect.top - viewport.translate.y) / viewport.scale,
      };
    },
    [viewport.translate.x, viewport.translate.y, viewport.scale]
  );

  const getLocalPoint = useCallback(
    (e: { clientX: number; clientY: number }): Point => {
      return screenToCanvas(e.clientX, e.clientY);
    },
    [screenToCanvas]
  );

  // ============================================
  // HIT TESTING
  // ============================================

  const distanceToLineSegment = useCallback(
    (point: Point, lineStart: Point, lineEnd: Point): number => {
      const a = point.x - lineStart.x;
      const b = point.y - lineStart.y;
      const c = lineEnd.x - lineStart.x;
      const d = lineEnd.y - lineStart.y;

      const dot = a * c + b * d;
      const lenSq = c * c + d * d;
      let param = -1;
      if (lenSq !== 0) param = dot / lenSq;

      let xx: number, yy: number;
      if (param < 0) { xx = lineStart.x; yy = lineStart.y; }
      else if (param > 1) { xx = lineEnd.x; yy = lineEnd.y; }
      else { xx = lineStart.x + param * c; yy = lineStart.y + param * d; }

      return Math.sqrt((point.x - xx) ** 2 + (point.y - yy) ** 2);
    },
    []
  );

  const isPointInShape = useCallback(
    (point: Point, shape: Shape): boolean => {
      if (isBoundedShape(shape)) {
        const s = shape as any;
        const w = s.w || 100;
        const h = s.h || 24;
        return (
          point.x >= s.x &&
          point.x <= s.x + w &&
          point.y >= s.y &&
          point.y <= s.y + h
        );
      }

      if (isFreehandShape(shape)) {
        const freeShape = shape as FreeDrawShape | HighlighterShape;
        for (let i = 0; i < freeShape.points.length - 1; i++) {
          const distance = distanceToLineSegment(
            point,
            freeShape.points[i],
            freeShape.points[i + 1]
          );
          if (distance < HIT_THRESHOLD) return true;
        }
        return false;
      }

      if (isLineShape(shape)) {
        const lineShape = shape as ArrowShape | LineShape | ConnectorShape;
        const distance = distanceToLineSegment(
          point,
          { x: lineShape.startX, y: lineShape.startY },
          { x: lineShape.endX, y: lineShape.endY }
        );
        return distance < HIT_THRESHOLD;
      }

      return false;
    },
    [distanceToLineSegment]
  );

  const getShapeAtPoint = useCallback(
    (point: Point): Shape | null => {
      for (let i = shapeList.length - 1; i >= 0; i--) {
        if (isPointInShape(point, shapeList[i])) {
          return shapeList[i];
        }
      }
      return null;
    },
    [shapeList, isPointInShape]
  );

  // ============================================
  // CLIPBOARD OPERATIONS
  // ============================================

  const copySelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const shapesToCopy: Shape[] = [];
    selectedIds.forEach((id) => {
      const shape = shapeEntities[id];
      if (shape) {
        shapesToCopy.push(JSON.parse(JSON.stringify(shape)));
      }
    });
    clipboardRef.current = shapesToCopy;
    pasteCountRef.current = 0;
  }, [selectedIds, shapeEntities]);

  const pasteClipboard = useCallback(() => {
    if (clipboardRef.current.length === 0) return;

    pasteCountRef.current += 1;
    const offset = PASTE_OFFSET * pasteCountRef.current;

    dispatch(saveHistorySnapshot());
    dispatch(clearSelection());

    clipboardRef.current.forEach((originalShape) => {
      const cloned = cloneShapeWithOffset(originalShape, offset, offset);

      if (isBoundedShape(cloned)) {
        const s = cloned as any;
        dispatch(addBoundedShape({
          tool: cloned.type as Tool,
          x: s.x, y: s.y, w: s.w || 100, h: s.h || 24,
        }));
      } else if (isLineShape(cloned)) {
        const line = cloned as ArrowShape | LineShape | ConnectorShape;
        dispatch(addLineLikeShape({
          tool: cloned.type as Tool,
          startX: line.startX, startY: line.startY,
          endX: line.endX, endY: line.endY,
        }));
      } else if (isFreehandShape(cloned)) {
        const free = cloned as FreeDrawShape | HighlighterShape;
        if (cloned.type === "highlighter") {
          dispatch(addHighlighterShape({ points: [...free.points] }));
        } else {
          dispatch(addFreeDrawShape({ points: [...free.points] }));
        }
      }
    });
  }, [dispatch]);

  const duplicateSelected = useCallback(() => {
    copySelected();
    pasteCountRef.current = 0;
    pasteClipboard();
  }, [copySelected, pasteClipboard]);

  // ============================================
  // ANIMATION HELPERS
  // ============================================

  const schedulePanMove = useCallback(
    (newPoint: Point) => {
      if (panAnimationRef.current !== null) return;
      panAnimationRef.current = window.requestAnimationFrame(() => {
        panAnimationRef.current = null;
        dispatch(panMove(newPoint));
      });
    },
    [dispatch]
  );

  const freehandTick = useCallback(() => {
    const now = performance.now();
    if (now - lastFreehandFrameRef.current >= FREEHAND_INTERVAL_MS) {
      if (freePointsRef.current.length > 0) {
        requestRender();
      }
      lastFreehandFrameRef.current = now;
    }
    if (drawingRef.current) {
      freehandAnimationRef.current = window.requestAnimationFrame(freehandTick);
    }
  }, [requestRender]);

  // ============================================
  // WHEEL EVENTS
  // ============================================

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        dispatch(
          wheelZoom({
            deltaY: e.deltaY,
            originScreen: { x: e.clientX, y: e.clientY },
          })
        );
      } else {
        dispatch(wheelPan({ dx: -e.deltaX, dy: -e.deltaY }));
      }
    },
    [dispatch]
  );

  // ============================================
  // POINTER EVENTS
  // ============================================

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      const isButton = target.tagName === "BUTTON" || target.closest("button");
      if (isButton) return;

      e.preventDefault();
      canvasRef.current?.setPointerCapture(e.pointerId);

      const world = getLocalPoint(e);

      // Pan
      const isPanButton = e.button === 1 || e.button === 2;
      const isPanBySpace = spacePressed.current && e.button === 0;

      if (isPanButton || isPanBySpace || currentTool === "pan") {
        dispatch(panStart({ screen: { x: e.clientX, y: e.clientY } }));
        return;
      }

      if (e.button === 0) {
        // ============================================
        // SELECT TOOL
        // ============================================
        if (currentTool === "select") {
          const hitShape = getShapeAtPoint(world);

          if (hitShape) {
            const isAlreadySelected = selectedIds.includes(hitShape.id);

            // ── Alt+drag: duplicate then drag ──
            if (e.altKey && (isAlreadySelected || !e.shiftKey)) {
              // Duplicate all currently selected shapes (or just hit shape)
              const idsToDuplicate = isAlreadySelected ? selectedIds : [hitShape.id];

              if (!isAlreadySelected) {
                dispatch(clearSelection());
                dispatch(selectShape(hitShape.id));
              }

              dispatch(saveHistorySnapshot());

              // Create duplicates at same position
              const newShapeIds: string[] = [];
              idsToDuplicate.forEach((id) => {
                const shape = shapeEntities[id];
                if (!shape) return;

                if (isBoundedShape(shape)) {
                  const s = shape as any;
                  dispatch(addBoundedShape({
                    tool: shape.type as Tool,
                    x: s.x, y: s.y, w: s.w || 100, h: s.h || 24,
                  }));
                } else if (isLineShape(shape)) {
                  const line = shape as ArrowShape | LineShape | ConnectorShape;
                  dispatch(addLineLikeShape({
                    tool: shape.type as Tool,
                    startX: line.startX, startY: line.startY,
                    endX: line.endX, endY: line.endY,
                  }));
                } else if (isFreehandShape(shape)) {
                  const free = shape as FreeDrawShape | HighlighterShape;
                  if (shape.type === "highlighter") {
                    dispatch(addHighlighterShape({ points: [...free.points] }));
                  } else {
                    dispatch(addFreeDrawShape({ points: [...free.points] }));
                  }
                }
              });

              altDuplicatedRef.current = true;

              // The originals stay in place, user drags the newly created shapes
              // Since addBoundedShape etc. auto-select the last one,
              // the user effectively starts dragging the duplicate.
              // For single shape this works perfectly.
              // For multi-shape, only last duplicate is selected — acceptable for v3.0.

              // Set up move tracking for the current selection
              movingRef.current = true;
              moveStartRef.current = world;
              initialShapePositionsRef.current = new Map();

              // We need to capture the newly selected shape's position
              // Since we can't predict the new ID, we rely on the auto-selection
              // from the last addBoundedShape call. The move handler reads
              // from initialShapePositionsRef which we set up on next tick.
              // Actually, let's just use the original positions since duplicates
              // are created at the same spot.
              const currentSelected = isAlreadySelected ? selectedIds : [hitShape.id];
              currentSelected.forEach((id) => {
                const shape = shapeEntities[id];
                if (!shape) return;
                if (isBoundedShape(shape)) {
                  const s = shape as any;
                  initialShapePositionsRef.current.set(id, { x: s.x, y: s.y });
                } else if (isFreehandShape(shape)) {
                  const freeShape = shape as FreeDrawShape | HighlighterShape;
                  initialShapePositionsRef.current.set(id, { points: [...freeShape.points] });
                } else if (isLineShape(shape)) {
                  const lineShape = shape as ArrowShape | LineShape | ConnectorShape;
                  initialShapePositionsRef.current.set(id, {
                    startX: lineShape.startX, startY: lineShape.startY,
                    endX: lineShape.endX, endY: lineShape.endY,
                  });
                }
              });

              return;
            }

            // ── Normal selection logic ──
            if (e.shiftKey) {
              if (isAlreadySelected) {
                dispatch(deselectShape(hitShape.id));
                return;
              } else {
                dispatch(addToSelection(hitShape.id));
              }
            } else {
              if (!isAlreadySelected) {
                dispatch(clearSelection());
                dispatch(selectShape(hitShape.id));
              }
            }

            dispatch(saveHistorySnapshot());

            movingRef.current = true;
            moveStartRef.current = world;
            initialShapePositionsRef.current = new Map();
            altDuplicatedRef.current = false;

            let idsToMove: string[];
            if (e.shiftKey && !isAlreadySelected) {
              idsToMove = [...selectedIds, hitShape.id];
            } else if (!e.shiftKey && !isAlreadySelected) {
              idsToMove = [hitShape.id];
            } else {
              idsToMove = selectedIds;
            }

            idsToMove.forEach((id) => {
              const shape = shapeEntities[id];
              if (!shape) return;

              if (isBoundedShape(shape)) {
                const s = shape as any;
                initialShapePositionsRef.current.set(id, { x: s.x, y: s.y });
              } else if (isFreehandShape(shape)) {
                const freeShape = shape as FreeDrawShape | HighlighterShape;
                initialShapePositionsRef.current.set(id, { points: [...freeShape.points] });
              } else if (isLineShape(shape)) {
                const lineShape = shape as ArrowShape | LineShape | ConnectorShape;
                initialShapePositionsRef.current.set(id, {
                  startX: lineShape.startX, startY: lineShape.startY,
                  endX: lineShape.endX, endY: lineShape.endY,
                });
              }
            });
          } else {
            // Empty area — marquee
            if (!e.shiftKey) {
              dispatch(clearSelection());
            }
            marqueeActiveRef.current = true;
            marqueeRef.current = {
              startX: world.x, startY: world.y,
              endX: world.x, endY: world.y,
            };
            requestRender();
          }
        }

        // ERASER TOOL
        else if (currentTool === "eraser") {
          erasingRef.current = true;
          erasedShapesRef.current.clear();
          const hitShape = getShapeAtPoint(world);
          if (hitShape) {
            dispatch(removeShape(hitShape.id));
            erasedShapesRef.current.add(hitShape.id);
          }
        }

        // TEXT TOOL
        else if (currentTool === "text") {
          dispatch(addText({ x: snapToGrid(world.x), y: snapToGrid(world.y) }));
          dispatch(setTool("select"));
        }

        // BOUNDED DRAWING TOOLS
        else if (BOUNDED_DRAW_TOOLS.includes(currentTool)) {
          drawingRef.current = true;
          draftShapeRef.current = {
            type: currentTool,
            startX: snapToGrid(world.x),
            startY: snapToGrid(world.y),
            endX: snapToGrid(world.x),
            endY: snapToGrid(world.y),
          };
          requestRender();
        }

        // LINE-LIKE DRAWING TOOLS
        else if (LINE_DRAW_TOOLS.includes(currentTool)) {
          drawingRef.current = true;
          draftShapeRef.current = {
            type: currentTool,
            startX: snapToGrid(world.x),
            startY: snapToGrid(world.y),
            endX: snapToGrid(world.x),
            endY: snapToGrid(world.y),
          };
          requestRender();
        }

        // FREEHAND TOOLS (no grid snap — freehand should be free)
        else if (FREEHAND_TOOLS.includes(currentTool)) {
          drawingRef.current = true;
          currentFreehandToolRef.current = currentTool;
          freePointsRef.current = [world];
          lastFreehandFrameRef.current = performance.now();
          freehandAnimationRef.current = window.requestAnimationFrame(freehandTick);
          requestRender();
        }
      }
    },
    [
      currentTool,
      selectedIds,
      shapeEntities,
      dispatch,
      getLocalPoint,
      getShapeAtPoint,
      requestRender,
      freehandTick,
    ]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const world = getLocalPoint(e);

      // Panning
      if (viewport.mode === "panning" || viewport.mode === "shiftPanning") {
        schedulePanMove({ x: e.clientX, y: e.clientY });
        return;
      }

      // ── Resizing / Line endpoint dragging ──
      if (resizingRef.current) {
        if (lineEndpointDragRef.current) {
          const { shapeId, endpoint } = lineEndpointDragRef.current;
          let endPoint = { x: snapToGrid(world.x), y: snapToGrid(world.y) };

          // Shift constraint for line endpoints
          if (shiftPressed.current) {
            const shape = shapeEntities[shapeId] as ArrowShape | LineShape | ConnectorShape;
            if (shape) {
              if (endpoint === "start") {
                const constrained = applyLineConstraint(shape.endX, shape.endY, endPoint.x, endPoint.y);
                endPoint = { x: constrained.endX, y: constrained.endY };
              } else {
                const constrained = applyLineConstraint(shape.startX, shape.startY, endPoint.x, endPoint.y);
                endPoint = { x: constrained.endX, y: constrained.endY };
              }
            }
          }

          if (endpoint === "start") {
            dispatch(updateShape({ id: shapeId, patch: { startX: endPoint.x, startY: endPoint.y } }));
          } else {
            dispatch(updateShape({ id: shapeId, patch: { endX: endPoint.x, endY: endPoint.y } }));
          }
          return;
        }

        if (resizingDataRef.current) {
          const { shapeId, corner, initialBounds } = resizingDataRef.current;
          let newBounds = { ...initialBounds };

          const snappedX = snapToGrid(world.x);
          const snappedY = snapToGrid(world.y);

          switch (corner) {
            case "nw":
              newBounds.w = initialBounds.w + (initialBounds.x - snappedX);
              newBounds.h = initialBounds.h + (initialBounds.y - snappedY);
              newBounds.x = snappedX;
              newBounds.y = snappedY;
              break;
            case "n":
              newBounds.h = initialBounds.h + (initialBounds.y - snappedY);
              newBounds.y = snappedY;
              break;
            case "ne":
              newBounds.w = snappedX - initialBounds.x;
              newBounds.h = initialBounds.h + (initialBounds.y - snappedY);
              newBounds.y = snappedY;
              break;
            case "e":
              newBounds.w = snappedX - initialBounds.x;
              break;
            case "se":
              newBounds.w = snappedX - initialBounds.x;
              newBounds.h = snappedY - initialBounds.y;
              break;
            case "s":
              newBounds.h = snappedY - initialBounds.y;
              break;
            case "sw":
              newBounds.w = initialBounds.w + (initialBounds.x - snappedX);
              newBounds.h = snappedY - initialBounds.y;
              newBounds.x = snappedX;
              break;
            case "w":
              newBounds.w = initialBounds.w + (initialBounds.x - snappedX);
              newBounds.x = snappedX;
              break;
          }

          // Shift constraint: maintain aspect ratio
          if (shiftPressed.current) {
            newBounds = applyResizeConstraint(corner, initialBounds, newBounds);
          }

          if (newBounds.w < 10) newBounds.w = 10;
          if (newBounds.h < 10) newBounds.h = 10;

          dispatch(
            updateShape({
              id: shapeId,
              patch: {
                x: newBounds.x,
                y: newBounds.y,
                w: Math.abs(newBounds.w),
                h: Math.abs(newBounds.h),
              },
            })
          );
          return;
        }
      }

      // ── Marquee selection dragging ──
      if (marqueeActiveRef.current && marqueeRef.current) {
        marqueeRef.current.endX = world.x;
        marqueeRef.current.endY = world.y;
        requestRender();
        return;
      }

      // ── Erasing ──
      if (erasingRef.current && currentTool === "eraser") {
        const hitShape = getShapeAtPoint(world);
        if (hitShape && !erasedShapesRef.current.has(hitShape.id)) {
          dispatch(removeShape(hitShape.id));
          erasedShapesRef.current.add(hitShape.id);
        }
      }

      // ── Moving shapes (with snap guides) ──
      if (movingRef.current && moveStartRef.current && currentTool === "select") {
        let deltaX = world.x - moveStartRef.current.x;
        let deltaY = world.y - moveStartRef.current.y;

        // Grid snap the delta
        deltaX = snapToGrid(deltaX);
        deltaY = snapToGrid(deltaY);

        // Calculate snap guides for the first selected bounded shape
        snapGuidesRef.current = [];
        const excludeIds = new Set(selectedIds);

        // Get the would-be position of the first bounded shape for snap calculation
        let primaryBounds: { x: number; y: number; w: number; h: number } | null = null;
        for (const [id, initialPos] of initialShapePositionsRef.current.entries()) {
          const shape = shapeEntities[id];
          if (shape && isBoundedShape(shape)) {
            const s = shape as any;
            primaryBounds = {
              x: initialPos.x + deltaX,
              y: initialPos.y + deltaY,
              w: s.w || 100,
              h: s.h || 24,
            };
            break;
          }
        }

        if (primaryBounds) {
          const { guides, snapDeltaX, snapDeltaY } = calculateSnapGuides(
            primaryBounds,
            shapeList,
            excludeIds
          );
          snapGuidesRef.current = guides;

          // Apply snap corrections
          if (snapDeltaX !== 0) deltaX += snapDeltaX;
          if (snapDeltaY !== 0) deltaY += snapDeltaY;
        }

        // Apply movement to all selected shapes
        initialShapePositionsRef.current.forEach((initialPos, id) => {
          const shape = shapeEntities[id];
          if (!shape) return;

          if (isBoundedShape(shape)) {
            dispatch(
              updateShape({
                id,
                patch: {
                  x: initialPos.x + deltaX,
                  y: initialPos.y + deltaY,
                },
              })
            );
          } else if (isFreehandShape(shape)) {
            const newPoints = initialPos.points.map((p: Point) => ({
              x: p.x + deltaX,
              y: p.y + deltaY,
            }));
            dispatch(updateShape({ id, patch: { points: newPoints } }));
          } else if (isLineShape(shape)) {
            dispatch(
              updateShape({
                id,
                patch: {
                  startX: initialPos.startX + deltaX,
                  startY: initialPos.startY + deltaY,
                  endX: initialPos.endX + deltaX,
                  endY: initialPos.endY + deltaY,
                },
              })
            );
          }
        });

        requestRender();
      }

      // ── Drawing draft shapes (bounded + line-like) with grid snap + shift constraint ──
      if (drawingRef.current && draftShapeRef.current) {
        let endX = snapToGrid(world.x);
        let endY = snapToGrid(world.y);

        const draft = draftShapeRef.current;

        // Shift constraint
        if (shiftPressed.current) {
          if (BOUNDED_DRAW_TOOLS.includes(draft.type as Tool)) {
            const constrained = applyBoundedConstraint(draft.startX, draft.startY, endX, endY);
            endX = constrained.endX;
            endY = constrained.endY;
          } else if (LINE_DRAW_TOOLS.includes(draft.type as Tool)) {
            const constrained = applyLineConstraint(draft.startX, draft.startY, endX, endY);
            endX = constrained.endX;
            endY = constrained.endY;
          }
        }

        draft.endX = endX;
        draft.endY = endY;
        requestRender();
      }

      // ── Freehand drawing (no grid snap) ──
      if (FREEHAND_TOOLS.includes(currentTool) && drawingRef.current) {
        freePointsRef.current.push(world);
      }
    },
    [
      currentTool,
      viewport.mode,
      shapeEntities,
      shapeList,
      selectedIds,
      dispatch,
      getLocalPoint,
      getShapeAtPoint,
      schedulePanMove,
      requestRender,
    ]
  );

  const finalizeDrawing = useCallback(() => {
    if (!drawingRef.current) return;
    drawingRef.current = false;

    if (freehandAnimationRef.current) {
      cancelAnimationFrame(freehandAnimationRef.current);
      freehandAnimationRef.current = null;
    }

    const draft = draftShapeRef.current;

    if (draft) {
      const x = Math.min(draft.startX, draft.endX);
      const y = Math.min(draft.startY, draft.endY);
      const w = Math.abs(draft.endX - draft.startX);
      const h = Math.abs(draft.endY - draft.startY);

      if (w > 5 || h > 5) {
        if (BOUNDED_DRAW_TOOLS.includes(draft.type as Tool)) {
          dispatch(
            addBoundedShape({
              tool: draft.type as Tool,
              x: snapToGrid(x),
              y: snapToGrid(y),
              w: snapToGrid(w),
              h: snapToGrid(h),
            })
          );
        } else if (LINE_DRAW_TOOLS.includes(draft.type as Tool)) {
          dispatch(
            addLineLikeShape({
              tool: draft.type as Tool,
              startX: draft.startX,
              startY: draft.startY,
              endX: draft.endX,
              endY: draft.endY,
            })
          );
        }
      }

      draftShapeRef.current = null;
    }

    // Freehand finalize
    if (FREEHAND_TOOLS.includes(currentTool) && freePointsRef.current.length > 1) {
      if (currentFreehandToolRef.current === "highlighter") {
        dispatch(addHighlighterShape({ points: [...freePointsRef.current] }));
      } else {
        dispatch(addFreeDrawShape({ points: [...freePointsRef.current] }));
      }
      freePointsRef.current = [];
    }

    requestRender();
  }, [currentTool, dispatch, requestRender]);

  const finalizeMarquee = useCallback(() => {
    if (!marqueeActiveRef.current || !marqueeRef.current) return;

    const m = marqueeRef.current;
    const rectX = Math.min(m.startX, m.endX);
    const rectY = Math.min(m.startY, m.endY);
    const rectW = Math.abs(m.endX - m.startX);
    const rectH = Math.abs(m.endY - m.startY);

    if (rectW > 3 || rectH > 3) {
      const selectionRect = { x: rectX, y: rectY, w: rectW, h: rectH };
      shapeList.forEach((shape) => {
        if (isShapeInsideRect(shape, selectionRect)) {
          dispatch(addToSelection(shape.id));
        }
      });
    }

    marqueeActiveRef.current = false;
    marqueeRef.current = null;
    requestRender();
  }, [shapeList, dispatch, requestRender]);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      canvasRef.current?.releasePointerCapture(e.pointerId);

      if (viewport.mode === "panning" || viewport.mode === "shiftPanning") {
        dispatch(panEnd());
      }

      if (movingRef.current) {
        movingRef.current = false;
        moveStartRef.current = null;
        initialShapePositionsRef.current = new Map();
        altDuplicatedRef.current = false;
        // Clear snap guides when done moving
        snapGuidesRef.current = [];
        requestRender();
      }

      if (resizingRef.current) {
        resizingRef.current = false;
        resizingDataRef.current = null;
        lineEndpointDragRef.current = null;
      }

      if (erasingRef.current) {
        erasingRef.current = false;
        erasedShapesRef.current.clear();
      }

      finalizeMarquee();
      finalizeDrawing();
    },
    [viewport.mode, dispatch, finalizeDrawing, finalizeMarquee, requestRender]
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      onPointerUp(e);
    },
    [onPointerUp]
  );

  // ============================================
  // RESIZE HANDLERS
  // ============================================

  const startResize = useCallback(
    (shapeId: string, corner: ResizeCorner, e: React.PointerEvent) => {
      e.stopPropagation();
      const shape = shapeEntities[shapeId];
      if (!shape) return;

      dispatch(saveHistorySnapshot());

      resizingRef.current = true;
      resizingDataRef.current = {
        shapeId,
        corner,
        initialBounds: {
          x: (shape as any).x,
          y: (shape as any).y,
          w: (shape as any).w,
          h: (shape as any).h,
        },
        startPoint: getLocalPoint(e),
      };
    },
    [shapeEntities, getLocalPoint, dispatch]
  );

  // ============================================
  // LINE ENDPOINT DRAG
  // ============================================

  const startLineEndpointDrag = useCallback(
    (shapeId: string, endpoint: "start" | "end", e: React.PointerEvent) => {
      e.stopPropagation();
      dispatch(saveHistorySnapshot());
      lineEndpointDragRef.current = { shapeId, endpoint };
      resizingRef.current = true;
    },
    [dispatch]
  );

  // ============================================
  // KEYBOARD EVENTS
  // ============================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        spacePressed.current = true;
      }
      if (e.shiftKey) shiftPressed.current = true;
      if (e.ctrlKey || e.metaKey) ctrlPressed.current = true;

      // Delete
      if (e.code === "Delete" || e.code === "Backspace") {
        if (selectedIds.length > 0) {
          e.preventDefault();
          dispatch(deleteSelected());
        }
      }

      // Escape
      if (e.code === "Escape") {
        dispatch(clearSelection());
        dispatch(setTool("select"));
      }

      // ── Arrow Key Nudge ──
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        if (selectedIds.length > 0) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const dx = e.key === "ArrowRight" ? step : e.key === "ArrowLeft" ? -step : 0;
          const dy = e.key === "ArrowDown" ? step : e.key === "ArrowUp" ? -step : 0;

          // Save history only on first arrow press (not on repeats)
          if (!e.repeat) {
            dispatch(saveHistorySnapshot());
          }

          selectedIds.forEach((id) => {
            const shape = shapeEntities[id];
            if (!shape) return;

            if (isBoundedShape(shape)) {
              const s = shape as any;
              dispatch(updateShape({
                id,
                patch: { x: s.x + dx, y: s.y + dy },
              }));
            } else if (isLineShape(shape)) {
              const line = shape as ArrowShape | LineShape | ConnectorShape;
              dispatch(updateShape({
                id,
                patch: {
                  startX: line.startX + dx,
                  startY: line.startY + dy,
                  endX: line.endX + dx,
                  endY: line.endY + dy,
                },
              }));
            } else if (isFreehandShape(shape)) {
              const free = shape as FreeDrawShape | HighlighterShape;
              dispatch(updateShape({
                id,
                patch: {
                  points: free.points.map((p) => ({
                    x: p.x + dx,
                    y: p.y + dy,
                  })),
                },
              }));
            }
          });
        }
      }

      // ── Ctrl/Cmd Shortcuts ──
      if (e.ctrlKey || e.metaKey) {
        // Undo
        if (e.key === "z" && !e.shiftKey) {
          e.preventDefault();
          dispatch(undo());
        }
        // Redo (Ctrl+Shift+Z)
        if (e.key === "z" && e.shiftKey) {
          e.preventDefault();
          dispatch(redo());
        }
        // Redo (Ctrl+Y)
        if (e.key === "y") {
          e.preventDefault();
          dispatch(redo());
        }
        // Copy
        if (e.key === "c" && !e.shiftKey) {
          e.preventDefault();
          copySelected();
        }
        // Paste
        if (e.key === "v" && !e.shiftKey) {
          if (clipboardRef.current.length > 0) {
            e.preventDefault();
            pasteClipboard();
          }
        }
        // Duplicate
        if (e.key === "d") {
          e.preventDefault();
          duplicateSelected();
        }
        // Zoom
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          dispatch(zoomIn());
        }
        if (e.key === "-") {
          e.preventDefault();
          dispatch(zoomOut());
        }
        if (e.key === "0") {
          e.preventDefault();
          dispatch(resetView());
        }
      }

      // ── Tool Shortcuts (no modifier) ──
      if (!e.ctrlKey && !e.metaKey) {
        switch (e.code) {
          case "KeyV": dispatch(setTool("select")); break;
          case "KeyH": dispatch(setTool("pan")); break;
          case "KeyF": dispatch(setTool("frame")); break;
          case "KeyR": dispatch(setTool("rect")); break;
          case "KeyO": dispatch(setTool("ellipse")); break;
          case "KeyP": dispatch(setTool("freedraw")); break;
          case "KeyA": dispatch(setTool("arrow")); break;
          case "KeyL": dispatch(setTool("line")); break;
          case "KeyT": dispatch(setTool("text")); break;
          case "KeyE": dispatch(setTool("eraser")); break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") spacePressed.current = false;
      if (!e.shiftKey) shiftPressed.current = false;
      if (!e.ctrlKey && !e.metaKey) ctrlPressed.current = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (freehandAnimationRef.current) cancelAnimationFrame(freehandAnimationRef.current);
      if (panAnimationRef.current) cancelAnimationFrame(panAnimationRef.current);
    };
  }, [selectedIds, shapeEntities, dispatch, copySelected, pasteClipboard, duplicateSelected]);

  // ============================================
  // TEXT SIDEBAR
  // ============================================

  useEffect(() => {
    if (hasSelectedText && !sidebarOpen) setSidebarOpen(true);
    else if (!hasSelectedText && sidebarOpen) setSidebarOpen(false);
  }, [hasSelectedText, sidebarOpen]);

  // ============================================
  // CANVAS REF
  // ============================================

  const attachCanvasRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("wheel", onWheel as any);
      }
      canvasRef.current = element;
      if (element) {
        element.addEventListener("wheel", onWheel as any, { passive: false });
      }
    },
    [onWheel]
  );

  // ============================================
  // HELPERS
  // ============================================

  const selectToolFn = useCallback(
    (tool: Tool) => dispatch(setTool(tool)),
    [dispatch]
  );

  const getDraftShape = useCallback(() => draftShapeRef.current, []);
  const getFreeDrawPoints = useCallback(() => freePointsRef.current, []);
  const getCurrentFreehandTool = useCallback(() => currentFreehandToolRef.current, []);
  const getMarquee = useCallback(() => marqueeRef.current, []);
  const getSnapGuides = useCallback(() => snapGuidesRef.current, []);

  const handleZoomIn = useCallback(() => dispatch(zoomIn()), [dispatch]);
  const handleZoomOut = useCallback(() => dispatch(zoomOut()), [dispatch]);
  const handleResetZoom = useCallback(() => dispatch(resetView()), [dispatch]);

  // ============================================
  // RETURN
  // ============================================

  return {
    viewport,
    shapeList,
    currentTool,
    selectedIds,
    shapeEntities,
    hasSelectedText,
    sidebarOpen,

    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,

    attachCanvasRef,
    selectTool: selectToolFn,
    setSidebarOpen,
    getDraftShape,
    getFreeDrawPoints,
    getCurrentFreehandTool,
    getMarquee,
    getSnapGuides,
    startResize,
    startLineEndpointDrag,

    handleZoomIn,
    handleZoomOut,
    handleResetZoom,

    screenToCanvas,
    getShapeAtPoint,
  };
}