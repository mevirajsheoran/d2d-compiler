// src/lib/design-engine-pipeline/classifier.ts

import type { TextShape } from "@/redux/slice/shapes";
import type { ExtractedShape, ClassifiedComponent, UIRole } from "./types";

/* ──────────────────────────────────────────────────────────
   TEXT CLASSIFICATION
   
   Determines if text is a heading (and what level) or paragraph
   based on fontSize and fontWeight.
   ────────────────────────────────────────────────────────── */
function getHeadingLevel(
  fontSize: number,
  fontWeight: number
): number | null {
  if (fontSize >= 32 && fontWeight >= 600) return 1;
  if (fontSize >= 24 && fontWeight >= 600) return 2;
  if (fontSize >= 20 && fontWeight >= 500) return 3;
  if (fontSize >= 18 && fontWeight >= 500) return 4;
  return null;
}

function classifyText(shape: TextShape): {
  role: UIRole;
  properties: Record<string, unknown>;
} {
  const level = getHeadingLevel(shape.fontSize, shape.fontWeight);

  if (level !== null) {
    return {
      role: "heading",
      properties: {
        headingLevel: level,
        text: shape.text,
        fontSize: shape.fontSize,
        fontWeight: shape.fontWeight,
        fontFamily: shape.fontFamily,
        textAlign: shape.textAlign,
        fontStyle: shape.fontStyle,
        textDecoration: shape.textDecoration,
        textTransform: shape.textTransform,
      },
    };
  }

  return {
    role: "paragraph",
    properties: {
      text: shape.text,
      fontSize: shape.fontSize,
      fontWeight: shape.fontWeight,
      fontFamily: shape.fontFamily,
      textAlign: shape.textAlign,
      fontStyle: shape.fontStyle,
      textDecoration: shape.textDecoration,
      lineHeight: shape.lineHeight,
      letterSpacing: shape.letterSpacing,
      textTransform: shape.textTransform,
    },
  };
}

/* ──────────────────────────────────────────────────────────
   HEURISTIC CLASSIFICATION
   
   For generic shapes (rect, roundedRect) that don't declare
   their intent, we infer their role from dimensions.
   ────────────────────────────────────────────────────────── */
function classifyRect(
  w: number,
  h: number
): { role: UIRole; properties: Record<string, unknown> } {
  // Wide + short = likely an input field
  if (w > 150 && h >= 30 && h <= 60) {
    return { role: "input", properties: { placeholder: "Enter text..." } };
  }
  // Smallish + short = likely a button
  if (w <= 200 && h >= 25 && h <= 60) {
    return {
      role: "button",
      properties: { text: "Button", variant: "outline" },
    };
  }
  // Everything else = container
  return { role: "container", properties: {} };
}

function classifyRoundedRect(
  w: number,
  h: number
): { role: UIRole; properties: Record<string, unknown> } {
  // Small rounded rect = likely a button
  if (w <= 200 && h <= 60) {
    return {
      role: "button",
      properties: { text: "Button", variant: "primary" },
    };
  }
  // Large rounded rect = likely a card
  return { role: "card", properties: {} };
}

/* ──────────────────────────────────────────────────────────
   MAIN CLASSIFIER FUNCTION
   
   Maps each extracted shape to a semantic UI role.
   
   Three strategies:
   1. DIRECT MAPPING  — shape type declares intent
      (buttonShape → button, inputField → input, etc.)
   
   2. HEURISTIC MAPPING — infer from geometry
      (rect with certain dimensions → input or button)
   
   3. ANNOTATION EXCLUSION — skip design notes
      (stickyNote, speechBubble, arrow, etc.)
   ────────────────────────────────────────────────────────── */
export function classifyShapes(
  extracted: ExtractedShape[]
): ClassifiedComponent[] {
  const classified: ClassifiedComponent[] = [];

  for (const item of extracted) {
    const shape = item.originalShape;
    let role: UIRole;
    let text: string | undefined;
    let properties: Record<string, unknown> = {};

    switch (shape.type) {
      // ═══ DIRECT MAPPINGS (type declares intent) ═══

      case "buttonShape":
        role = "button";
        text = shape.text;
        properties = { variant: shape.variant, text: shape.text };
        break;

      case "inputField":
        role = "input";
        properties = {
          placeholder: shape.placeholder,
          label: shape.label,
        };
        break;

      case "checkbox":
        role = "checkbox";
        properties = { label: shape.label, checked: shape.checked };
        break;

      case "hamburgerMenu":
        role = "nav";
        break;

      case "imagePlaceholder":
        role = "image";
        break;

      case "videoPlaceholder":
        role = "video";
        break;

      case "chartPlaceholder":
        role = "chart";
        properties = { chartType: shape.chartType };
        break;

      case "divider":
        role = "divider";
        properties = { direction: shape.direction };
        break;

      case "deviceFrame":
        role = "device-wrapper";
        properties = { device: shape.device };
        break;

      case "text": {
        const result = classifyText(shape);
        role = result.role;
        text = shape.text;
        properties = result.properties;
        break;
      }

      // ═══ HEURISTIC MAPPINGS (infer from geometry) ═══

      case "rect": {
        const result = classifyRect(item.width, item.height);
        role = result.role;
        properties = result.properties;
        if (result.role === "button") text = "Button";
        break;
      }

      case "roundedRect": {
        const result = classifyRoundedRect(item.width, item.height);
        role = result.role;
        properties = {
          ...result.properties,
          borderRadius: shape.borderRadius,
        };
        if (result.role === "button") text = "Button";
        break;
      }

      case "ellipse":
        role =
          item.width < 60 && item.height < 60 ? "avatar" : "decorative";
        break;

      case "circle":
        role = item.width < 60 ? "avatar" : "decorative";
        break;

      case "line":
        role = "divider";
        break;

      // ═══ DECORATIVE (included but minimal code output) ═══

      case "triangle":
      case "star":
      case "polygon":
        role = "decorative";
        break;

      // ═══ ANNOTATIONS (excluded from code generation) ═══

      case "stickyNote":
      case "speechBubble":
      case "arrow":
      case "connector":
      case "freedraw":
      case "highlighter":
        role = "annotation";
        break;

      default:
        role = "container";
        break;
    }

    // Skip annotations entirely — they are design notes, not UI
    if (role === "annotation") continue;

    classified.push({
      id: shape.id,
      role,
      relX: item.relX,
      relY: item.relY,
      width: item.width,
      height: item.height,
      centerX: item.centerX,
      centerY: item.centerY,
      text,
      properties,
      originalShape: shape,
    });
  }

  return classified;
}