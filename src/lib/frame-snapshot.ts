// src/lib/frame-snapshot.ts
"use client";

import {
  Shape,
  FrameShape,
  RectShape,
  RoundedRectShape,
  EllipseShape,
  CircleShape,
  TriangleShape,
  StarShape,
  PolygonShape,
  ArrowShape,
  LineShape,
  ConnectorShape,
  DividerShape,
  TextShape,
  FreeDrawShape,
  HighlighterShape,
  StickyNoteShape,
  SpeechBubbleShape,
  ImagePlaceholderShape,
  VideoPlaceholderShape,
  ChartPlaceholderShape,
  ButtonShapeType,
  InputFieldShape,
  CheckboxShape,
  HamburgerMenuShape,
  DeviceFrameShape,
  BoundedShape,
  LineLikeShape,
} from "@/redux/slice/shapes";

/* ══════════════════════════════════════════════════════════
   GET BOUNDING BOX FOR ANY SHAPE TYPE
   
   Handles all 26 non-frame shape types:
   - Bounded shapes (x, y, w, h): 19 types
   - Line-like shapes (startX, startY, endX, endY): 3 types
   - Freehand shapes (points[]): 2 types
   - Text shapes (x, y + calculated size): 1 type
   ══════════════════════════════════════════════════════════ */
function getShapeBounds(shape: Shape): {
  x: number; y: number; w: number; h: number;
} | null {
  // Skip frames and generatedui
  if (shape.type === "frame" || shape.type === "generatedui") return null;

  // BOUNDED SHAPES — have x, y, w, h directly
  // Covers: rect, roundedRect, ellipse, circle, triangle, star,
  //   polygon, divider, stickyNote, speechBubble, imagePlaceholder,
  //   videoPlaceholder, chartPlaceholder, buttonShape, inputField,
  //   checkbox, hamburgerMenu, deviceFrame
  if ("x" in shape && "y" in shape && "w" in shape && "h" in shape) {
    const s = shape as BoundedShape;
    return { x: s.x, y: s.y, w: s.w, h: s.h };
  }

  // LINE-LIKE SHAPES — have startX, startY, endX, endY
  // Covers: arrow, line, connector
  if ("startX" in shape && "startY" in shape &&
      "endX" in shape && "endY" in shape) {
    const s = shape as LineLikeShape;
    const minX = Math.min(s.startX, s.endX);
    const minY = Math.min(s.startY, s.endY);
    const maxX = Math.max(s.startX, s.endX);
    const maxY = Math.max(s.startY, s.endY);
    return {
      x: minX, y: minY,
      w: Math.max(maxX - minX, 1),
      h: Math.max(maxY - minY, 1),
    };
  }

  // FREEHAND SHAPES — have points[]
  // Covers: freedraw, highlighter
  if ("points" in shape) {
    const s = shape as FreeDrawShape | HighlighterShape;
    if (!s.points || s.points.length === 0) return null;
    const xs = s.points.map((p) => p.x);
    const ys = s.points.map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    return {
      x: minX, y: minY,
      w: Math.max(Math.max(...xs) - minX, 1),
      h: Math.max(Math.max(...ys) - minY, 1),
    };
  }

  // TEXT SHAPE — has x, y but no w, h
  if (shape.type === "text") {
    const s = shape as TextShape;
    const lines = s.text.split("\n").length;
    const textWidth = Math.max(100, s.text.length * s.fontSize * 0.55);
    const textHeight = s.fontSize * s.lineHeight * lines;
    return { x: s.x, y: s.y, w: textWidth, h: textHeight };
  }

  return null;
}

/* ══════════════════════════════════════════════════════════
   CHECK IF SHAPE IS INSIDE FRAME
   
   Uses center-point containment (shape center inside frame)
   Now handles ALL 26 shape types via universal getShapeBounds
   ══════════════════════════════════════════════════════════ */
export const isShapeInsideFrame = (
  shape: Shape,
  frame: FrameShape
): boolean => {
  if (shape.id === frame.id) return false;
  if (shape.type === "frame") return false;

  const bounds = getShapeBounds(shape);
  if (!bounds) return false;

  // Check if shape center is inside frame
  const shapeCenterX = bounds.x + bounds.w / 2;
  const shapeCenterY = bounds.y + bounds.h / 2;

  return (
    shapeCenterX >= frame.x &&
    shapeCenterX <= frame.x + frame.w &&
    shapeCenterY >= frame.y &&
    shapeCenterY <= frame.y + frame.h
  );
};

/* ══════════════════════════════════════════════════════════
   EXPORT COLOR HELPER
   
   Converts white/light colors to dark for white background
   ══════════════════════════════════════════════════════════ */
const getExportColor = (color: string | null | undefined): string => {
  if (!color) return "#000000";
  if (color === "transparent") return "transparent";
  const isLight =
    color === "#ffffff" || color === "#fff" || color === "white" ||
    color === "#FFFFFF" ||
    color.match(/^rgba?\(255,\s*255,\s*255/);
  return isLight ? "#000000" : color;
};

/* ══════════════════════════════════════════════════════════
   DRAW STAR POLYGON ON CANVAS
   ══════════════════════════════════════════════════════════ */
function drawStarPath(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  outerRadius: number, innerRadius: number,
  points: number
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/* ══════════════════════════════════════════════════════════
   DRAW REGULAR POLYGON ON CANVAS
   ══════════════════════════════════════════════════════════ */
function drawPolygonPath(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  radius: number, sides: number
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/* ══════════════════════════════════════════════════════════
   GENERATE FRAME SNAPSHOT
   
   Creates a PNG of the frame and ALL shapes inside it.
   Now handles all 26 shape types.
   ══════════════════════════════════════════════════════════ */
export const generateFrameSnapshot = async (
  frame: FrameShape,
  allShapes: Shape[]
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const padding = 20;
  const scale = 2; // 2x for retina quality

  canvas.width = (frame.w + padding * 2) * scale;
  canvas.height = (frame.h + padding * 2) * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  ctx.scale(scale, scale);

  // White background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, frame.w + padding * 2, frame.h + padding * 2);

  // Light frame border
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 1;
  ctx.strokeRect(padding, padding, frame.w, frame.h);

  // Filter shapes inside this frame
  const shapesInFrame = allShapes.filter((shape) =>
    isShapeInsideFrame(shape, frame)
  );

  // Offset: frame origin → canvas origin
  const offsetX = padding - frame.x;
  const offsetY = padding - frame.y;

  // ──────────────────────────────────────────────────────
  // DRAW EACH SHAPE
  // ──────────────────────────────────────────────────────
  for (const shape of shapesInFrame) {
    ctx.save();

    const strokeColor = getExportColor(shape.stroke);
    const fillColor = shape.fill ? getExportColor(shape.fill) : "transparent";

    switch (shape.type) {
      // ═══════════════════════════════════════════
      // RECTANGLE
      // ═══════════════════════════════════════════
      case "rect": {
        const s = shape as RectShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, s.w, s.h);
        }
        ctx.strokeRect(x, y, s.w, s.h);
        break;
      }

      // ═══════════════════════════════════════════
      // ROUNDED RECTANGLE
      // ═══════════════════════════════════════════
      case "roundedRect": {
        const s = shape as RoundedRectShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const r = Math.min(s.borderRadius || 12, s.w / 2, s.h / 2);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + s.w - r, y);
        ctx.quadraticCurveTo(x + s.w, y, x + s.w, y + r);
        ctx.lineTo(x + s.w, y + s.h - r);
        ctx.quadraticCurveTo(x + s.w, y + s.h, x + s.w - r, y + s.h);
        ctx.lineTo(x + r, y + s.h);
        ctx.quadraticCurveTo(x, y + s.h, x, y + s.h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // ELLIPSE
      // ═══════════════════════════════════════════
      case "ellipse": {
        const s = shape as EllipseShape;
        const cx = s.x + s.w / 2 + offsetX;
        const cy = s.y + s.h / 2 + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // CIRCLE
      // ═══════════════════════════════════════════
      case "circle": {
        const s = shape as CircleShape;
        const radius = Math.min(s.w, s.h) / 2;
        const cx = s.x + s.w / 2 + offsetX;
        const cy = s.y + s.h / 2 + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // TRIANGLE
      // ═══════════════════════════════════════════
      case "triangle": {
        const s = shape as TriangleShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.beginPath();
        ctx.moveTo(x + s.w / 2, y);           // top center
        ctx.lineTo(x + s.w, y + s.h);         // bottom right
        ctx.lineTo(x, y + s.h);               // bottom left
        ctx.closePath();
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // STAR
      // ═══════════════════════════════════════════
      case "star": {
        const s = shape as StarShape;
        const cx = s.x + s.w / 2 + offsetX;
        const cy = s.y + s.h / 2 + offsetY;
        const outerR = Math.min(s.w, s.h) / 2;
        const innerR = outerR * (s.innerRadiusRatio || 0.4);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        drawStarPath(ctx, cx, cy, outerR, innerR, s.points || 5);
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // POLYGON (HEXAGON etc.)
      // ═══════════════════════════════════════════
      case "polygon": {
        const s = shape as PolygonShape;
        const cx = s.x + s.w / 2 + offsetX;
        const cy = s.y + s.h / 2 + offsetY;
        const radius = Math.min(s.w, s.h) / 2;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        drawPolygonPath(ctx, cx, cy, radius, s.sides || 6);
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // LINE
      // ═══════════════════════════════════════════
      case "line": {
        const s = shape as LineShape;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.startX + offsetX, s.startY + offsetY);
        ctx.lineTo(s.endX + offsetX, s.endY + offsetY);
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // ARROW
      // ═══════════════════════════════════════════
      case "arrow": {
        const s = shape as ArrowShape;
        const sx = s.startX + offsetX;
        const sy = s.startY + offsetY;
        const ex = s.endX + offsetX;
        const ey = s.endY + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.lineCap = "round";
        // Line
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        // Arrowhead
        const angle = Math.atan2(ey - sy, ex - sx);
        const headLen = 15;
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(
          ex - headLen * Math.cos(angle - Math.PI / 6),
          ey - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          ex - headLen * Math.cos(angle + Math.PI / 6),
          ey - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        break;
      }

      // ═══════════════════════════════════════════
      // CONNECTOR (ELBOW)
      // ═══════════════════════════════════════════
      case "connector": {
        const s = shape as ConnectorShape;
        const sx = s.startX + offsetX;
        const sy = s.startY + offsetY;
        const ex = s.endX + offsetX;
        const ey = s.endY + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (s.connectorStyle === "elbow") {
          // L-shaped: go horizontal first, then vertical
          const midX = ex;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(midX, sy);
          ctx.lineTo(midX, ey);
          ctx.stroke();
        } else if (s.connectorStyle === "curved") {
          // Bezier curve
          const cpX = (sx + ex) / 2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(cpX, sy, cpX, ey, ex, ey);
          ctx.stroke();
        } else {
          // Straight
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        // Dots at endpoints
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // ═══════════════════════════════════════════
      // DIVIDER
      // ═══════════════════════════════════════════
      case "divider": {
        const s = shape as DividerShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        if (s.direction === "vertical") {
          ctx.moveTo(x + s.w / 2, y);
          ctx.lineTo(x + s.w / 2, y + s.h);
        } else {
          ctx.moveTo(x, y + s.h / 2);
          ctx.lineTo(x + s.w, y + s.h / 2);
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // TEXT
      // ═══════════════════════════════════════════
      case "text": {
        const s = shape as TextShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        ctx.font = `${s.fontStyle || "normal"} ${s.fontWeight || 400} ${s.fontSize || 16}px ${s.fontFamily || "Arial, sans-serif"}`;
        ctx.fillStyle = getExportColor(s.fill || "#ffffff");
        ctx.textBaseline = "top";
        const lines = (s.text || "").split("\n");
        const lineH = s.fontSize * (s.lineHeight || 1.2);
        lines.forEach((line, i) => {
          ctx.fillText(line, x, y + i * lineH);
        });
        // Underline
        if (s.textDecoration === "underline") {
          ctx.strokeStyle = getExportColor(s.fill || "#ffffff");
          ctx.lineWidth = 1;
          lines.forEach((line, i) => {
            const tw = ctx.measureText(line).width;
            const ly = y + (i + 1) * lineH;
            ctx.beginPath();
            ctx.moveTo(x, ly);
            ctx.lineTo(x + tw, ly);
            ctx.stroke();
          });
        }
        break;
      }

      // ═══════════════════════════════════════════
      // FREE DRAW
      // ═══════════════════════════════════════════
      case "freedraw": {
        const s = shape as FreeDrawShape;
        if (!s.points || s.points.length < 2) break;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(s.points[0].x + offsetX, s.points[0].y + offsetY);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineTo(s.points[i].x + offsetX, s.points[i].y + offsetY);
        }
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // HIGHLIGHTER
      // ═══════════════════════════════════════════
      case "highlighter": {
        const s = shape as HighlighterShape;
        if (!s.points || s.points.length < 2) break;
        ctx.globalAlpha = 0.35;
        ctx.strokeStyle = getExportColor(s.highlighterColor || "#facc15");
        ctx.lineWidth = s.strokeWidth || 20;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(s.points[0].x + offsetX, s.points[0].y + offsetY);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineTo(s.points[i].x + offsetX, s.points[i].y + offsetY);
        }
        ctx.stroke();
        ctx.globalAlpha = 1.0;
        break;
      }

      // ═══════════════════════════════════════════
      // STICKY NOTE
      // ═══════════════════════════════════════════
      case "stickyNote": {
        const s = shape as StickyNoteShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        // Yellow background
        ctx.fillStyle = s.noteColor || "#facc15";
        ctx.shadowColor = "rgba(0,0,0,0.15)";
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillRect(x, y, s.w, s.h);
        // Reset shadow
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        // Text
        if (s.text) {
          ctx.fillStyle = "#000000";
          ctx.font = "14px Arial, sans-serif";
          ctx.textBaseline = "top";
          const maxWidth = s.w - 16;
          const words = s.text.split(" ");
          let line = "";
          let lineY = y + 12;
          for (const word of words) {
            const testLine = line + word + " ";
            if (ctx.measureText(testLine).width > maxWidth && line !== "") {
              ctx.fillText(line.trim(), x + 8, lineY);
              line = word + " ";
              lineY += 18;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line.trim(), x + 8, lineY);
        }
        break;
      }

      // ═══════════════════════════════════════════
      // SPEECH BUBBLE
      // ═══════════════════════════════════════════
      case "speechBubble": {
        const s = shape as SpeechBubbleShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const r = 12; // corner radius
        const tailSize = 15;
        // Draw rounded rect body
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        const bodyH = s.h - tailSize;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + s.w - r, y);
        ctx.quadraticCurveTo(x + s.w, y, x + s.w, y + r);
        ctx.lineTo(x + s.w, y + bodyH - r);
        ctx.quadraticCurveTo(x + s.w, y + bodyH, x + s.w - r, y + bodyH);
        // Tail
        if (s.tailDirection === "bottom-left" || s.tailDirection === "bottom-right") {
          const tailX = s.tailDirection === "bottom-left" ? x + 20 : x + s.w - 35;
          ctx.lineTo(tailX + 15, y + bodyH);
          ctx.lineTo(tailX + 5, y + bodyH + tailSize);
          ctx.lineTo(tailX, y + bodyH);
        }
        ctx.lineTo(x + r, y + bodyH);
        ctx.quadraticCurveTo(x, y + bodyH, x, y + bodyH - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        // Text
        if (s.text) {
          ctx.fillStyle = "#000000";
          ctx.font = "14px Arial, sans-serif";
          ctx.textBaseline = "top";
          ctx.fillText(s.text, x + 12, y + 12);
        }
        break;
      }

      // ═══════════════════════════════════════════
      // IMAGE PLACEHOLDER
      // ═══════════════════════════════════════════
      case "imagePlaceholder": {
        const s = shape as ImagePlaceholderShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        // Background
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(x, y, s.w, s.h);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.strokeRect(x, y, s.w, s.h);
        // X pattern
        ctx.strokeStyle = "#d1d5db";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + s.w, y + s.h);
        ctx.moveTo(x + s.w, y);
        ctx.lineTo(x, y + s.h);
        ctx.stroke();
        // Image icon in center
        const iconSize = Math.min(24, s.w * 0.3, s.h * 0.3);
        const icx = x + s.w / 2;
        const icy = y + s.h / 2;
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        // Mountain shape
        ctx.moveTo(icx - iconSize / 2, icy + iconSize / 3);
        ctx.lineTo(icx - iconSize / 4, icy - iconSize / 4);
        ctx.lineTo(icx, icy + iconSize / 6);
        ctx.lineTo(icx + iconSize / 4, icy - iconSize / 3);
        ctx.lineTo(icx + iconSize / 2, icy + iconSize / 3);
        ctx.stroke();
        break;
      }

      // ═══════════════════════════════════════════
      // VIDEO PLACEHOLDER
      // ═══════════════════════════════════════════
      case "videoPlaceholder": {
        const s = shape as VideoPlaceholderShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        // Dark background
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(x, y, s.w, s.h);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.strokeRect(x, y, s.w, s.h);
        // Play button triangle
        const pcx = x + s.w / 2;
        const pcy = y + s.h / 2;
        const triSize = Math.min(30, s.w * 0.15, s.h * 0.2);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(pcx - triSize / 2, pcy - triSize);
        ctx.lineTo(pcx - triSize / 2, pcy + triSize);
        ctx.lineTo(pcx + triSize, pcy);
        ctx.closePath();
        ctx.fill();
        break;
      }

      // ═══════════════════════════════════════════
      // CHART PLACEHOLDER
      // ═══════════════════════════════════════════
      case "chartPlaceholder": {
        const s = shape as ChartPlaceholderShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        // Background
        ctx.fillStyle = "#f9fafb";
        ctx.fillRect(x, y, s.w, s.h);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.strokeRect(x, y, s.w, s.h);

        const chartType = s.chartType || "bar";
        const innerPad = 20;

        if (chartType === "bar") {
          // Draw 4 bars
          const barCount = 4;
          const barW = (s.w - innerPad * 2) / (barCount * 2);
          const maxBarH = s.h - innerPad * 3;
          const heights = [0.6, 0.9, 0.4, 0.75];
          ctx.fillStyle = "#6b7280";
          heights.forEach((h, i) => {
            const bx = x + innerPad + i * barW * 2 + barW / 2;
            const bh = maxBarH * h;
            const by = y + s.h - innerPad - bh;
            ctx.fillRect(bx, by, barW, bh);
          });
        } else if (chartType === "line") {
          // Draw line graph
          ctx.strokeStyle = "#6b7280";
          ctx.lineWidth = 2;
          const points = [0.5, 0.3, 0.7, 0.4, 0.8];
          const maxH = s.h - innerPad * 3;
          ctx.beginPath();
          points.forEach((p, i) => {
            const px = x + innerPad + (i / (points.length - 1)) * (s.w - innerPad * 2);
            const py = y + s.h - innerPad - maxH * p;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          });
          ctx.stroke();
        } else if (chartType === "pie") {
          // Draw pie chart
          const pcx = x + s.w / 2;
          const pcy = y + s.h / 2;
          const pieR = Math.min(s.w, s.h) / 2 - innerPad;
          const slices = [0.35, 0.25, 0.2, 0.2];
          const colors = ["#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb"];
          let startAngle = -Math.PI / 2;
          slices.forEach((slice, i) => {
            const endAngle = startAngle + slice * Math.PI * 2;
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.moveTo(pcx, pcy);
            ctx.arc(pcx, pcy, pieR, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();
            startAngle = endAngle;
          });
        }

        // Label
        ctx.fillStyle = "#9ca3af";
        ctx.font = "11px Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(
          `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart`,
          x + s.w / 2,
          y + 6
        );
        ctx.textAlign = "start";
        break;
      }

      // ═══════════════════════════════════════════
      // BUTTON SHAPE
      // ═══════════════════════════════════════════
      case "buttonShape": {
        const s = shape as ButtonShapeType;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const r = 6;
        // Button background based on variant
        let bgColor = "#3b82f6";
        let txtColor = "#ffffff";
        let borderColor: string | null = null;
        switch (s.variant) {
          case "primary": bgColor = "#3b82f6"; break;
          case "secondary": bgColor = "#6b7280"; break;
          case "outline":
            bgColor = "transparent";
            txtColor = "#000000";
            borderColor = "#000000";
            break;
          case "ghost":
            bgColor = "transparent";
            txtColor = "#000000";
            break;
        }
        // Draw rounded rect
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + s.w - r, y);
        ctx.quadraticCurveTo(x + s.w, y, x + s.w, y + r);
        ctx.lineTo(x + s.w, y + s.h - r);
        ctx.quadraticCurveTo(x + s.w, y + s.h, x + s.w - r, y + s.h);
        ctx.lineTo(x + r, y + s.h);
        ctx.quadraticCurveTo(x, y + s.h, x, y + s.h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (bgColor !== "transparent") {
          ctx.fillStyle = bgColor;
          ctx.fill();
        }
        if (borderColor) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        // Text
        ctx.fillStyle = txtColor;
        ctx.font = "500 14px Inter, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.text || "Button", x + s.w / 2, y + s.h / 2);
        ctx.textAlign = "start";
        break;
      }

      // ═══════════════════════════════════════════
      // INPUT FIELD
      // ═══════════════════════════════════════════
      case "inputField": {
        const s = shape as InputFieldShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const labelH = 20;
        const inputH = s.h - labelH - 4;
        // Label
        ctx.fillStyle = "#374151";
        ctx.font = "500 12px Inter, Arial, sans-serif";
        ctx.textBaseline = "top";
        ctx.fillText(s.label || "Label", x, y);
        // Input box
        const boxY = y + labelH + 4;
        const boxR = 6;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 1;
        ctx.beginPath();
        ctx.moveTo(x + boxR, boxY);
        ctx.lineTo(x + s.w - boxR, boxY);
        ctx.quadraticCurveTo(x + s.w, boxY, x + s.w, boxY + boxR);
        ctx.lineTo(x + s.w, boxY + inputH - boxR);
        ctx.quadraticCurveTo(x + s.w, boxY + inputH, x + s.w - boxR, boxY + inputH);
        ctx.lineTo(x + boxR, boxY + inputH);
        ctx.quadraticCurveTo(x, boxY + inputH, x, boxY + inputH - boxR);
        ctx.lineTo(x, boxY + boxR);
        ctx.quadraticCurveTo(x, boxY, x + boxR, boxY);
        ctx.closePath();
        ctx.fillStyle = "#f9fafb";
        ctx.fill();
        ctx.stroke();
        // Placeholder text
        ctx.fillStyle = "#9ca3af";
        ctx.font = "14px Inter, Arial, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(s.placeholder || "Enter text...", x + 12, boxY + inputH / 2);
        break;
      }

      // ═══════════════════════════════════════════
      // CHECKBOX
      // ═══════════════════════════════════════════
      case "checkbox": {
        const s = shape as CheckboxShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const boxSize = 16;
        const boxY = y + (s.h - boxSize) / 2;
        // Checkbox square
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.strokeRect(x, boxY, boxSize, boxSize);
        // Checkmark if checked
        if (s.checked) {
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(x + 3, boxY + boxSize / 2);
          ctx.lineTo(x + boxSize / 2 - 1, boxY + boxSize - 4);
          ctx.lineTo(x + boxSize - 3, boxY + 3);
          ctx.stroke();
        }
        // Label
        ctx.fillStyle = "#374151";
        ctx.font = "14px Inter, Arial, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(s.label || "Checkbox", x + boxSize + 8, y + s.h / 2);
        break;
      }

      // ═══════════════════════════════════════════
      // HAMBURGER MENU
      // ═══════════════════════════════════════════
      case "hamburgerMenu": {
        const s = shape as HamburgerMenuShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const lineLen = s.w * 0.7;
        const startX = x + (s.w - lineLen) / 2;
        const gap = s.h / 4;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        for (let i = 1; i <= 3; i++) {
          const ly = y + gap * i;
          ctx.beginPath();
          ctx.moveTo(startX, ly);
          ctx.lineTo(startX + lineLen, ly);
          ctx.stroke();
        }
        break;
      }

      // ═══════════════════════════════════════════
      // DEVICE FRAME
      // ═══════════════════════════════════════════
      case "deviceFrame": {
        const s = shape as DeviceFrameShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;
        const device = s.device || "phone";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;

        if (device === "phone") {
          const r = 24;
          // Outer frame
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + s.w - r, y);
          ctx.quadraticCurveTo(x + s.w, y, x + s.w, y + r);
          ctx.lineTo(x + s.w, y + s.h - r);
          ctx.quadraticCurveTo(x + s.w, y + s.h, x + s.w - r, y + s.h);
          ctx.lineTo(x + r, y + s.h);
          ctx.quadraticCurveTo(x, y + s.h, x, y + s.h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fillStyle = "#f9fafb";
          ctx.fill();
          ctx.stroke();
          // Notch
          const notchW = 80;
          const notchH = 6;
          ctx.fillStyle = "#d1d5db";
          ctx.beginPath();
          ctx.roundRect(
            x + (s.w - notchW) / 2, y + 10,
            notchW, notchH, 3
          );
          ctx.fill();
          // Home indicator
          const homeW = 50;
          ctx.fillStyle = "#d1d5db";
          ctx.beginPath();
          ctx.roundRect(
            x + (s.w - homeW) / 2, y + s.h - 18,
            homeW, 4, 2
          );
          ctx.fill();
        } else if (device === "tablet") {
          const r = 16;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + s.w - r, y);
          ctx.quadraticCurveTo(x + s.w, y, x + s.w, y + r);
          ctx.lineTo(x + s.w, y + s.h - r);
          ctx.quadraticCurveTo(x + s.w, y + s.h, x + s.w - r, y + s.h);
          ctx.lineTo(x + r, y + s.h);
          ctx.quadraticCurveTo(x, y + s.h, x, y + s.h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fillStyle = "#f9fafb";
          ctx.fill();
          ctx.stroke();
          // Camera dot
          ctx.fillStyle = "#d1d5db";
          ctx.beginPath();
          ctx.arc(x + s.w / 2, y + 12, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Desktop
          const r = 8;
          const bezelTop = 30;
          // Screen
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + s.w - r, y);
          ctx.quadraticCurveTo(x + s.w, y, x + s.w, y + r);
          ctx.lineTo(x + s.w, y + s.h - r);
          ctx.quadraticCurveTo(x + s.w, y + s.h, x + s.w - r, y + s.h);
          ctx.lineTo(x + r, y + s.h);
          ctx.quadraticCurveTo(x, y + s.h, x, y + s.h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
          ctx.fillStyle = "#f9fafb";
          ctx.fill();
          ctx.stroke();
          // Top bezel with dots
          ctx.fillStyle = "#e5e7eb";
          ctx.fillRect(x, y, s.w, bezelTop);
          ctx.strokeRect(x, y, s.w, bezelTop);
          // Traffic lights
          const dotY = y + bezelTop / 2;
          const dotR = 5;
          [["#ef4444", 16], ["#f59e0b", 30], ["#22c55e", 44]].forEach(
            ([color, dx]) => {
              ctx.fillStyle = color as string;
              ctx.beginPath();
              ctx.arc(x + (dx as number), dotY, dotR, 0, Math.PI * 2);
              ctx.fill();
            }
          );
        }
        break;
      }

      default:
        // Unknown shape — skip
        break;
    }

    ctx.restore();
  }

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create image blob"));
      },
      "image/png",
      1.0
    );
  });
};

/* ══════════════════════════════════════════════════════════
   DOWNLOAD BLOB AS FILE
   ══════════════════════════════════════════════════════════ */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/* ══════════════════════════════════════════════════════════
   CONVERT BLOB TO BASE64 (for API calls)
   ══════════════════════════════════════════════════════════ */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};