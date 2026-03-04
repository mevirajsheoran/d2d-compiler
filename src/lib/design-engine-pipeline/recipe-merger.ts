// src/lib/design-engine-pipeline/recipe-merger.ts

/* ══════════════════════════════════════════════════════════════════════════════
   RECIPE MERGER — v5.0

   Merges wireframe-detected sections with recipe defaults.

   Strategy:
   - If wireframe detected a section matching a recipe section → use wireframe
   - If recipe has a section the wireframe didn't draw → use recipe (filler)
   - If wireframe detected something not in recipe → insert at inferred position
   - Wireframe sections always use their own detected type (preserving user intent)

   Pure logic. No rendering. No identity tokens.
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  DetectedSection,
  SectionRecipe,
  MergedSection,
  SectionType,
} from "./types";

// ═══════════════════════════════════════════════════════════
// TYPE MATCHING — how wireframe types map to recipe types
// ═══════════════════════════════════════════════════════════

/** For each recipe section type, which wireframe-detected types count as a match? */
const TYPE_MATCH_MAP: Record<string, SectionType[]> = {
  nav: ["nav"],
  "hero-split": ["hero-split", "hero-centered"],
  "hero-centered": ["hero-centered", "hero-split"],
  features: ["features", "card-grid"],
  stats: ["stats"],
  testimonial: [],
  cta: ["cta"],
  form: ["form"],
  footer: ["footer"],
  newsletter: ["form"],
  "content-split": ["content-split"],
  "card-grid": ["card-grid", "features"],
  "logo-cloud": [],
  "trust-badges": [],
  "pricing-cards": [],
  faq: [],
  "auth-card": ["form"],
};

/** Order hints for wireframe sections not found in the recipe */
const ORDER_HINTS: Record<string, number> = {
  nav: 0,
  "hero-centered": 1,
  "hero-split": 1,
  features: 3,
  stats: 4,
  form: 5,
  "content-split": 4.5,
  "card-grid": 6,
  cta: 7,
  sidebar: 50,
  generic: 50,
  footer: 99,
};

// ═══════════════════════════════════════════════════════════
// MAIN MERGE FUNCTION
// ═══════════════════════════════════════════════════════════

export function mergeRecipeWithWireframe(
  recipe: SectionRecipe[],
  wireframeSections: DetectedSection[]
): MergedSection[] {
  const merged: MergedSection[] = [];
  const usedWireframeIndices = new Set<number>();

  // Pass 1: For each recipe section, try to find a wireframe match
  for (const recipeSec of recipe) {
    if (!recipeSec.overridable) {
      // Non-overridable recipe sections always use recipe
      merged.push({
        type: recipeSec.type,
        source: "recipe",
        recipeConfig: recipeSec.config,
        bg: recipeSec.bg,
        order: recipeSec.order,
      });
      continue;
    }

    const match = findWireframeMatch(
      recipeSec.type,
      wireframeSections,
      usedWireframeIndices
    );

    if (match !== null) {
      // Wireframe drew this section — use wireframe version
      // Keep wireframe's detected type (e.g. hero-centered even if recipe says hero-split)
      merged.push({
        type: match.detected.type,
        source: "wireframe",
        detected: match.detected,
        bg: recipeSec.bg,
        order: recipeSec.order,
      });
      usedWireframeIndices.add(match.index);
    } else {
      // No wireframe match — use recipe default
      merged.push({
        type: recipeSec.type,
        source: "recipe",
        recipeConfig: recipeSec.config,
        bg: recipeSec.bg,
        order: recipeSec.order,
      });
    }
  }

  // Pass 2: Add wireframe sections that weren't matched to any recipe section
  for (let i = 0; i < wireframeSections.length; i++) {
    if (usedWireframeIndices.has(i)) continue;

    const ws = wireframeSections[i];
    // Find appropriate order — insert after the last section with a lower order
    const order = inferOrder(ws.type, recipe);

    merged.push({
      type: ws.type,
      source: "wireframe",
      detected: ws,
      order,
    });
  }

  // Sort by order
  return merged.sort((a, b) => a.order - b.order);
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function findWireframeMatch(
  recipeType: string,
  wireframeSections: DetectedSection[],
  alreadyUsed: Set<number>
): { detected: DetectedSection; index: number } | null {
  const acceptableTypes =
    TYPE_MATCH_MAP[recipeType] || ([recipeType] as SectionType[]);

  for (let i = 0; i < wireframeSections.length; i++) {
    if (alreadyUsed.has(i)) continue;
    if (acceptableTypes.includes(wireframeSections[i].type)) {
      return { detected: wireframeSections[i], index: i };
    }
  }

  return null;
}

function inferOrder(sectionType: string, recipe: SectionRecipe[]): number {
  // Try the hints map first
  const hint = ORDER_HINTS[sectionType];
  if (hint !== undefined) {
    // Find a unique order slot (avoid collisions with existing recipe sections)
    let order = hint;
    const existingOrders = new Set(recipe.map((s) => s.order));
    while (existingOrders.has(order)) {
      order += 0.1;
    }
    return order;
  }

  // Default: middle of page
  return 50;
}