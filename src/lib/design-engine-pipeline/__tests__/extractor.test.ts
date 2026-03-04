import { describe, it, expect } from "vitest";
import { extractShapesFromFrame } from "../extractor";
import { LANDING_PAGE_FRAME, LANDING_PAGE_SHAPES, EMPTY_FRAME, EMPTY_SHAPES } from "@/lib/design-engine-pipeline/__tests__/fixtures/shapes";

describe("Extractor (Phase 1)", () => {
  const frame = LANDING_PAGE_FRAME as any;
  const allShapes = LANDING_PAGE_SHAPES as any[];

  it("extracts only shapes inside the frame", () => {
    const result = extractShapesFromFrame(frame, allShapes);
    expect(result.every((s: any) => s.originalShape.type !== "frame")).toBe(true);
    expect(result.length).toBe(allShapes.length - 1);
  });

  it("normalizes coordinates to frame origin", () => {
    const result = extractShapesFromFrame(frame, allShapes);
    expect(result.every((s: any) => s.relX >= 0)).toBe(true);
    expect(result.every((s: any) => s.relY >= 0)).toBe(true);
  });

  it("sorts top-to-bottom, left-to-right", () => {
    const result = extractShapesFromFrame(frame, allShapes);
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1];
      const curr = result[i];
      const isBelow = curr.relY > prev.relY + 10;
      const isSameRowAndRight = Math.abs(curr.relY - prev.relY) <= 10 && curr.relX >= prev.relX;
      expect(isBelow || isSameRowAndRight).toBe(true);
    }
  });

  it("excludes shapes outside the frame", () => {
    const outsideShape = { id: "outside", type: "rect", x: 5000, y: 5000, w: 100, h: 100 };
    const result = extractShapesFromFrame(frame, [...allShapes, outsideShape] as any[]);
    expect(result.find((s: any) => s.originalShape.id === "outside")).toBeUndefined();
  });

  it("returns empty array for empty frame", () => {
    const result = extractShapesFromFrame(EMPTY_FRAME as any, EMPTY_SHAPES as any[]);
    expect(result).toHaveLength(0);
  });
});