import { describe, it, expect } from "vitest";
import { generateFromFrame } from "@/lib/design-engine-pipeline/index";
import {
  LANDING_PAGE_FRAME, LANDING_PAGE_SHAPES,
  EMPTY_FRAME, EMPTY_SHAPES,
  MINIMAL_FRAME, MINIMAL_SHAPES,
  FORM_FRAME, FORM_SHAPES,
} from "../fixtures/shapes";
import {
  TECH_LANDING_GUIDE,
  RESTAURANT_LANDING_GUIDE,
  NO_BRIEF_GUIDE,
  SAAS_GUIDE,
  LOGIN_GUIDE,
} from "../fixtures/style-guides";

describe("Integration: Full Pipeline", () => {
  it("generates valid JSX from landing page shapes + brief", async () => {
    const code = await generateFromFrame(
      LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code).toContain("export default function GeneratedUI");
    expect(code).toContain("return (");
    expect(code).toContain("className=");
  });

  it("generates complete page even with empty wireframe (recipe fills everything)", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code).toContain("export default function GeneratedUI");
    expect(code).toContain("<nav");
    expect(code).toContain("<main");
    expect(code).toContain("<footer");
  });

  it("includes brand name from brief", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code).toContain("Acme");
  });

  it("uses restaurant content for restaurant industry", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], RESTAURANT_LANDING_GUIDE
    );
    expect(code).toContain("La Maison");
  });

  it("falls back to legacy mode when no brief", async () => {
    const code = await generateFromFrame(
      LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[], NO_BRIEF_GUIDE
    );
    expect(code).toContain("export default function GeneratedUI");
  });

  it("has responsive classes", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code).toMatch(/sm:/);
    expect(code).toMatch(/lg:/);
  });

  it("has hover states", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code).toMatch(/hover:/);
  });

  it("SaaS page type includes pricing section", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], SAAS_GUIDE
    );
    expect(code).toContain("Starter");
    expect(code).toContain("Pro");
    expect(code).toContain("Enterprise");
  });

  it("login page type produces auth card", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], LOGIN_GUIDE
    );
    expect(code).toContain("Sign in");
    expect(code).toContain("password");
  });

  it("wireframe sections override recipe defaults", async () => {
    const code = await generateFromFrame(
      LANDING_PAGE_FRAME as any, LANDING_PAGE_SHAPES as any[], TECH_LANDING_GUIDE
    );
    expect(code).toContain("Welcome to Our Product");
  });

  it("output is reasonable length (100-800 lines)", async () => {
    const code = await generateFromFrame(
      EMPTY_FRAME as any, EMPTY_SHAPES as any[], TECH_LANDING_GUIDE
    );
    const lines = code.split("\n").length;
    expect(lines).toBeGreaterThan(100);
    expect(lines).toBeLessThan(800);
  });
});
