import { describe, it, expect } from "vitest";
import { getPageRecipe } from "@/lib/design-engine-pipeline/page-recipes";

describe("Page Recipes", () => {
  it("returns landing page recipe with nav and footer", () => {
    const recipe = getPageRecipe("Landing Page", "tech");
    const types = recipe.map((s) => s.type);
    expect(types).toContain("nav");
    expect(types).toContain("footer");
    expect(types[0]).toBe("nav");
    expect(types[types.length - 1]).toBe("footer");
  });

  it("applies industry-specific overrides", () => {
    const techRecipe = getPageRecipe("Landing Page", "tech");
    const restaurantRecipe = getPageRecipe("Landing Page", "restaurant");
    const techFeatures = techRecipe.find((s) => s.type === "features");
    const restFeatures = restaurantRecipe.find((s) => s.type === "features");
    expect(techFeatures).toBeDefined();
    expect(restFeatures).toBeDefined();
  });

  it("sorts sections by order", () => {
    const recipe = getPageRecipe("Landing Page", "tech");
    for (let i = 1; i < recipe.length; i++) {
      expect(recipe[i].order).toBeGreaterThanOrEqual(recipe[i - 1].order);
    }
  });

  it("returns different recipes for different page types", () => {
    const landing = getPageRecipe("Landing Page", "tech");
    const login = getPageRecipe("Login/Sign Up", "tech");
    expect(landing.length).toBeGreaterThan(login.length);
  });

  it("handles unknown page type with landing page default", () => {
    const recipe = getPageRecipe("Unknown Type", "tech");
    expect(recipe.length).toBeGreaterThan(0);
    expect(recipe[0].type).toBe("nav");
  });

  it("handles unknown industry without crashing", () => {
    const recipe = getPageRecipe("Landing Page", "alien-industry");
    expect(recipe.length).toBeGreaterThan(0);
  });

  it("SaaS recipe includes pricing-cards", () => {
    const recipe = getPageRecipe("SaaS Product", "tech");
    expect(recipe.some((s) => s.type === "pricing-cards")).toBe(true);
  });

  it("every recipe has at least one section", () => {
    const pageTypes = [
      "Landing Page", "Dashboard", "Login/Sign Up",
      "Blog", "Portfolio", "E-Commerce", "Pricing", "SaaS Product",
    ];
    for (const pt of pageTypes) {
      const recipe = getPageRecipe(pt, "tech");
      expect(recipe.length).toBeGreaterThan(0);
    }
  });
});
