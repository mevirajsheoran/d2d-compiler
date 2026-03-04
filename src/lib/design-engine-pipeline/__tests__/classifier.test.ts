import { describe, it, expect } from "vitest";
import { classifyShapes } from "../classifier";
import { extractShapesFromFrame } from "../extractor";
import {
  LANDING_PAGE_FRAME, LANDING_PAGE_SHAPES,
  FORM_FRAME, FORM_SHAPES,
} from "@/lib/design-engine-pipeline/__tests__/fixtures/shapes";

describe("Classifier (Phase 2)", () => {
  it("classifies buttonShape as button", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const btn = classified.find((c) => c.id === "hero-btn");
    expect(btn).toBeDefined();
    expect(btn!.role).toBe("button");
  });

  it("classifies large text as heading", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const heading = classified.find((c) => c.id === "hero-h1");
    expect(heading).toBeDefined();
    expect(heading!.role).toBe("heading");
  });

  it("classifies inputField as input", () => {
    const extracted = extractShapesFromFrame(FORM_FRAME as any, FORM_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const inputs = classified.filter((c) => c.role === "input");
    expect(inputs).toHaveLength(3);
  });

  it("classifies roundedRect by heuristic", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const cards = classified.filter((c) => c.role === "card");
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  it("preserves text content from shapes", () => {
    const extracted = extractShapesFromFrame(LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[]);
    const classified = classifyShapes(extracted);
    const h1 = classified.find((c) => c.id === "hero-h1");
    expect(h1?.text).toBe("Welcome to Our Product");
  });
});