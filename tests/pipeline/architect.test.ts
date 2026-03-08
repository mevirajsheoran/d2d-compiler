import { describe, it, expect } from "vitest";
import { buildHierarchy } from "@/lib/design-engine-pipeline/architect";
import { classifyShapes } from "@/lib/design-engine-pipeline/classifier";
import { extractShapesFromFrame } from "@/lib/design-engine-pipeline/extractor";
import { LANDING_PAGE_FRAME, LANDING_PAGE_SHAPES } from "../fixtures/shapes";

function findNodeById(node: any, id: string): any | null {
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

describe("Architect (Phase 3)", () => {
  it("produces a root node", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const tree = buildHierarchy(classified, 1200, 900);
    expect(tree.id).toBe("root");
    expect(tree.role).toBe("container");
  });

  it("detects column layout for vertically stacked elements", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const tree = buildHierarchy(classified, 1200, 900);
    expect(tree.layout).toBe("column");
  });

  it("calculates per-pair gaps (length = children - 1)", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const tree = buildHierarchy(classified, 1200, 900);
    expect(tree.gaps).toHaveLength(Math.max(0, tree.children.length - 1));
    expect(tree.gaps.every((g: number) => g >= 0)).toBe(true);
  });

  it("stores frame dimensions in root properties", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const tree = buildHierarchy(classified, 1200, 900);
    expect(tree.properties.frameWidth).toBe(1200);
    expect(tree.properties.frameHeight).toBe(900);
  });

  it("returns empty root for no components", () => {
    const tree = buildHierarchy([], 1200, 800);
    expect(tree.id).toBe("root");
    expect(tree.children).toHaveLength(0);
  });
});
