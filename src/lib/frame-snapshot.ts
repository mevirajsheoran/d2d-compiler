// src/lib/frame-snapshot.ts
"use client";

import {
  Shape,
  FrameShape,
  RectShape,
  EllipseShape,
  ArrowShape,
  LineShape,
  TextShape,
  FreeDrawShape,
} from "@/redux/slice/shapes";

/**
 * Check if a shape overlaps with a frame's boundaries
 * Uses "partially inside" instead of "fully inside" for better results
 */
export const isShapeInsideFrame = (
  shape: Shape,
  frame: FrameShape
): boolean => {
  if (shape.id === frame.id) return false;
  if (shape.type === "frame") return false; // Don't include nested frames

  let shapeBounds: { x: number; y: number; w: number; h: number };

  switch (shape.type) {
    case "rect":
    case "ellipse": {
      const s = shape as RectShape | EllipseShape;
      shapeBounds = { x: s.x, y: s.y, w: s.w, h: s.h };
      break;
    }

    case "arrow":
    case "line": {
      const s = shape as ArrowShape | LineShape;
      const minX = Math.min(s.startX, s.endX);
      const minY = Math.min(s.startY, s.endY);
      const maxX = Math.max(s.startX, s.endX);
      const maxY = Math.max(s.startY, s.endY);
      shapeBounds = {
        x: minX,
        y: minY,
        w: Math.max(maxX - minX, 1),
        h: Math.max(maxY - minY, 1),
      };
      break;
    }

    case "text": {
      const s = shape as TextShape;
      const textWidth = Math.max(100, s.text.length * s.fontSize * 0.6);
      const textHeight = s.fontSize * 1.5;
      shapeBounds = { x: s.x, y: s.y, w: textWidth, h: textHeight };
      break;
    }

    case "freedraw": {
      const s = shape as FreeDrawShape;
      if (!s.points || s.points.length === 0) return false;
      const xs = s.points.map((p) => p.x);
      const ys = s.points.map((p) => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      shapeBounds = {
        x: minX,
        y: minY,
        w: Math.max(Math.max(...xs) - minX, 1),
        h: Math.max(Math.max(...ys) - minY, 1),
      };
      break;
    }

    default:
      return false;
  }

  // Check overlap (shape center is inside frame)
  const shapeCenterX = shapeBounds.x + shapeBounds.w / 2;
  const shapeCenterY = shapeBounds.y + shapeBounds.h / 2;

  return (
    shapeCenterX >= frame.x &&
    shapeCenterX <= frame.x + frame.w &&
    shapeCenterY >= frame.y &&
    shapeCenterY <= frame.y + frame.h
  );
};

/**
 * Generate a PNG snapshot of a frame and its contents
 * Draws shapes with BLACK stroke on WHITE background for visibility
 */
export const generateFrameSnapshot = async (
  frame: FrameShape,
  allShapes: Shape[]
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const padding = 20;
  const scale = 2; // 2x for higher quality

  canvas.width = (frame.w + padding * 2) * scale;
  canvas.height = (frame.h + padding * 2) * scale;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Scale for high DPI
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

  console.log(`[Export] Found ${shapesInFrame.length} shapes in frame`);

  // Calculate offset (frame origin → canvas origin)
  const offsetX = padding - frame.x;
  const offsetY = padding - frame.y;

  // Helper: Convert white/light strokes to dark for export
  const getExportColor = (color: string): string => {
    if (!color) return "#000000";
    // If stroke is white or very light, make it dark for white background
    const isLight =
      color === "#ffffff" ||
      color === "#fff" ||
      color === "white" ||
      color === "#FFFFFF" ||
      color.match(/^rgba?\(255,\s*255,\s*255/);
    return isLight ? "#000000" : color;
  };

  // Draw each shape
  for (const shape of shapesInFrame) {
    ctx.save();

    const strokeColor = getExportColor(shape.stroke);
    const fillColor = shape.fill ? getExportColor(shape.fill) : "transparent";

    switch (shape.type) {
      case "rect": {
        const s = shape as RectShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;

        if (fillColor && fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fillRect(x, y, s.w, s.h);
        }
        ctx.strokeRect(x, y, s.w, s.h);
        break;
      }

      case "ellipse": {
        const s = shape as EllipseShape;
        const centerX = s.x + s.w / 2 + offsetX;
        const centerY = s.y + s.h / 2 + offsetY;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;

        ctx.beginPath();
        ctx.ellipse(centerX, centerY, s.w / 2, s.h / 2, 0, 0, Math.PI * 2);

        if (fillColor && fillColor !== "transparent") {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        ctx.stroke();
        break;
      }

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

      case "arrow": {
        const s = shape as ArrowShape;
        const startX = s.startX + offsetX;
        const startY = s.startY + offsetY;
        const endX = s.endX + offsetX;
        const endY = s.endY + offsetY;

        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = s.strokeWidth || 2;
        ctx.lineCap = "round";

        // Line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Arrowhead
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15;

        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        break;
      }

      case "text": {
        const s = shape as TextShape;
        const x = s.x + offsetX;
        const y = s.y + offsetY;

        ctx.font = `${s.fontStyle || "normal"} ${s.fontWeight || 400} ${s.fontSize || 16}px ${s.fontFamily || "Arial, sans-serif"}`;
        ctx.fillStyle = getExportColor(s.fill || "#ffffff");
        ctx.textBaseline = "top";

        // Handle multi-line text
        const lines = (s.text || "").split("\n");
        const lineHeight = s.fontSize * (s.lineHeight || 1.2);

        lines.forEach((line, i) => {
          ctx.fillText(line, x, y + i * lineHeight);
        });

        // Underline
        if (s.textDecoration === "underline") {
          lines.forEach((line, i) => {
            const textWidth = ctx.measureText(line).width;
            const lineY = y + (i + 1) * lineHeight;
            ctx.strokeStyle = getExportColor(s.fill || "#ffffff");
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, lineY);
            ctx.lineTo(x + textWidth, lineY);
            ctx.stroke();
          });
        }
        break;
      }

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

/**
 * Download a blob as a file
 */
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

/**
 * Convert blob to base64 string (for API calls)
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};