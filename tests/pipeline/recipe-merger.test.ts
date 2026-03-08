import { describe, it, expect } from "vitest";
import { mergeRecipeWithWireframe } from "@/lib/design-engine-pipeline/recipe-merger";
import { getPageRecipe } from "@/lib/design-engine-pipeline/page-recipes";
import type { DetectedSection } from "@/lib/design-engine-pipeline/types";

function makeDetected(type: string, orderIndex: number): DetectedSection {
  return {
    type: type as any,
    confidence: 0.9,
    nodeIds: [`node-${type}`],
    slots: [],
    position: "middle" as const,
    orderIndex,
  };
}

describe("Recipe Merger", () => {
  const recipe = getPageRecipe("Landing Page", "tech");

  it("uses all recipe sections when wireframe is empty", () => {
    const merged = mergeRecipeWithWireframe(recipe, []);
    expect(merged.length).toBe(recipe.length);
    expect(merged.every((m) => m.source === "recipe")).toBe(true);
  });

  it("wireframe nav overrides recipe nav", () => {
    const wireframeNav = makeDetected("nav", 0);
    const merged = mergeRecipeWithWireframe(recipe, [wireframeNav]);
    const navSection = merged.find((m) => m.type === "nav");
    expect(navSection).toBeDefined();
    expect(navSection!.source).toBe("wireframe");
  });

  it("recipe fills sections wireframe did not draw", () => {
    const wireframeNav = makeDetected("nav", 0);
    const wireframeHero = makeDetected("hero-centered", 1);
    const merged = mergeRecipeWithWireframe(recipe, [wireframeNav, wireframeHero]);

    // Nav and hero from wireframe
    expect(merged.find((m) => m.type === "nav")!.source).toBe("wireframe");

    // Everything else from recipe
    const recipeSections = merged.filter((m) => m.source === "recipe");
    expect(recipeSections.length).toBeGreaterThan(0);
    expect(recipeSections.some((m) => m.type === "footer")).toBe(true);
  });

  it("merged sections are sorted by order", () => {
    const merged = mergeRecipeWithWireframe(recipe, []);
    for (let i = 1; i < merged.length; i++) {
      expect(merged[i].order).toBeGreaterThanOrEqual(merged[i - 1].order);
    }
  });

  it("wireframe section not in recipe gets inserted", () => {
    const wireframeForm = makeDetected("form", 5);
    const merged = mergeRecipeWithWireframe(recipe, [wireframeForm]);
    expect(merged.some((m) => m.type === "form" && m.source === "wireframe")).toBe(true);
  });

  it("non-overridable recipe sections always use recipe", () => {
    const merged = mergeRecipeWithWireframe(recipe, []);
    const logoCloud = merged.find((m) => m.type === "logo-cloud");
    expect(logoCloud).toBeDefined();
    expect(logoCloud!.source).toBe("recipe");
  });
});
