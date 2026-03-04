import { describe, it, expect } from "vitest";
import { generateFromFrame } from "../index";
import {
  LANDING_PAGE_FRAME, LANDING_PAGE_SHAPES,
  EMPTY_FRAME, EMPTY_SHAPES,
} from "@/lib/design-engine-pipeline/__tests__/fixtures/shapes";
import { TECH_LANDING_GUIDE, RESTAURANT_LANDING_GUIDE } from "./fixtures/style-guides";

describe("Determinism: Same Input → Same Output", () => {
  it("produces identical output for landing page with wireframe", async () => {
    const code1 = await generateFromFrame(
      LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[], TECH_LANDING_GUIDE
    );
    const code2 = await generateFromFrame(
      LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code1).toBe(code2);
  });

  it("produces identical output for empty wireframe (pure recipe)", async () => {
    const code1 = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    const code2 = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code1).toBe(code2);
  });

  it("produces identical output across 5 runs", async () => {
    const results: string[] = [];
    for (let i = 0; i < 5; i++) {
      const code = await generateFromFrame(
        EMPTY_FRAME as any, EMPTY_SHAPES as any[], RESTAURANT_LANDING_GUIDE
      );
      results.push(code);
    }
    expect(new Set(results).size).toBe(1);
  });

  it("different inputs produce different outputs", async () => {
    const tech = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    const restaurant = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], RESTAURANT_LANDING_GUIDE
    );
    expect(tech).not.toBe(restaurant);
  });
});