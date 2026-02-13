// src/lib/ai-pipeline/enhancer.ts

import type { UINode, UIRole } from "./types";

/* ══════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ══════════════════════════════════════════════════════════ */

function countRoles(children: UINode[], ...roles: UIRole[]): number {
  return children.filter((c) => roles.includes(c.role)).length;
}

function hasRole(children: UINode[], role: UIRole): boolean {
  return children.some((c) => c.role === role);
}

function childrenWithin(children: UINode[], roles: UIRole[]): UINode[] {
  return children.filter((c) => roles.includes(c.role));
}

/* ══════════════════════════════════════════════════════════
   RULE 1: AUTO-CENTER FORMS
   
   Pattern: Root column with heading + inputs + button (≤6 items)
   Enhancement: Wrap in centered, max-width container
   
   Before: Full-width column of elements scattered
   After:  max-w-md mx-auto centered card with shadow
   ══════════════════════════════════════════════════════════ */
function ruleAutoCenterForm(node: UINode): UINode {
  if (node.id !== "root") return node;
  if (node.layout !== "column") return node;
  if (node.children.length > 6) return node;

  const hasHeading = hasRole(node.children, "heading");
  const inputCount = countRoles(node.children, "input");
  const hasButton = hasRole(node.children, "button");

  if (hasHeading && inputCount >= 1 && hasButton) {
    return {
      ...node,
      enhancementHints: [...node.enhancementHints, "centered-form"],
    };
  }

  return node;
}

/* ══════════════════════════════════════════════════════════
   RULE 2: AUTO-CARDIFY GROUPS
   
   Pattern: Container/card with image + heading + paragraph/button
   Enhancement: Upgrade to card styling (shadow, rounded, padding)
   
   Detects "card-like" structures and upgrades them
   ══════════════════════════════════════════════════════════ */
function ruleAutoCardify(node: UINode): UINode {
  const enhanced = {
    ...node,
    children: node.children.map(ruleAutoCardify),
  };

  for (let i = 0; i < enhanced.children.length; i++) {
    const child = enhanced.children[i];

    // Only look at containers/cards with 2-5 children
    if (child.role !== "container" && child.role !== "card") continue;
    if (child.children.length < 2 || child.children.length > 5) continue;

    const hasImage = hasRole(child.children, "image");
    const hasHeading = hasRole(child.children, "heading");
    const hasText = hasRole(child.children, "paragraph");
    const hasButton = hasRole(child.children, "button");

    // If container looks card-like, upgrade it
    if (hasImage && (hasHeading || hasText)) {
      enhanced.children[i] = {
        ...child,
        role: "card",
        enhancementHints: [...child.enhancementHints, "auto-card"],
      };
    } else if (hasHeading && hasText && hasButton) {
      enhanced.children[i] = {
        ...child,
        role: "card",
        enhancementHints: [...child.enhancementHints, "auto-card"],
      };
    }
  }

  return enhanced;
}

/* ══════════════════════════════════════════════════════════
   RULE 3: AUTO-RESPONSIVE GRID
   
   Pattern: 2-4 sibling cards/containers in a ROW
            with similar dimensions (within 20%)
   Enhancement: Convert to responsive grid
                (grid-cols-1 md:grid-cols-N)
   ══════════════════════════════════════════════════════════ */
function ruleAutoResponsiveGrid(node: UINode): UINode {
  const enhanced = {
    ...node,
    children: node.children.map(ruleAutoResponsiveGrid),
  };

  if (enhanced.layout !== "row") return enhanced;

  const cards = childrenWithin(enhanced.children, ["card", "container"]);
  if (cards.length < 2 || cards.length > 4) return enhanced;

  // Check if they have similar widths (within 20%)
  const widths = cards.map((c) => c.width);
  const avgWidth = widths.reduce((s, w) => s + w, 0) / widths.length;
  const allSimilar = widths.every(
    (w) => Math.abs(w - avgWidth) / avgWidth < 0.2
  );

  // Only apply if ALL children are the similar-width cards/containers
  if (allSimilar && cards.length === enhanced.children.length) {
    return {
      ...enhanced,
      enhancementHints: [
        ...enhanced.enhancementHints,
        `responsive-grid-${cards.length}`,
      ],
    };
  }

  return enhanced;
}

/* ══════════════════════════════════════════════════════════
   RULE 4: AUTO-STICKY NAV
   
   Pattern: Nav element is the first child of root
   Enhancement: Add sticky positioning, full-width
   ══════════════════════════════════════════════════════════ */
function ruleAutoStickyNav(node: UINode): UINode {
  if (node.id !== "root") return node;
  if (node.children.length === 0) return node;

  const firstChild = node.children[0];
  if (firstChild.role === "nav") {
    const updatedChildren = [...node.children];
    updatedChildren[0] = {
      ...firstChild,
      enhancementHints: [...firstChild.enhancementHints, "sticky-nav"],
    };
    return { ...node, children: updatedChildren };
  }

  return node;
}

/* ══════════════════════════════════════════════════════════
   RULE 5: AUTO-SECTION SPACING
   
   Pattern: Root column with mixed content types
   Enhancement: Add larger spacing between "sections"
   
   A "section break" = transition between different
   role types, e.g.:
   - button → heading = new section (bigger gap)
   - heading → inputs = same section (keep gap)
   - divider always creates a section break
   ══════════════════════════════════════════════════════════ */
function ruleAutoSectionSpacing(node: UINode): UINode {
  if (node.id !== "root") return node;
  if (node.layout !== "column") return node;
  if (node.children.length <= 2) return node;

  const newGaps = [...node.gaps];

  for (let i = 1; i < node.children.length; i++) {
    const prev = node.children[i - 1];
    const curr = node.children[i];

    // Detect section breaks
    const isSectionBreak =
      (prev.role === "button" && curr.role === "heading") ||
      prev.role === "divider" ||
      curr.role === "divider" ||
      (prev.role === "image" && curr.role === "heading") ||
      (prev.role === "nav" && curr.role !== "nav");

    if (isSectionBreak && i - 1 < newGaps.length) {
      newGaps[i - 1] = Math.max(newGaps[i - 1], 48); // Larger section gap
    }
  }

  return { ...node, gaps: newGaps };
}

/* ══════════════════════════════════════════════════════════
   RULE 6: AUTO HERO SECTION
   
   Pattern: H1 heading + paragraph at the top of root
   Enhancement: Add hero styling (larger text, centered)
   ══════════════════════════════════════════════════════════ */
function ruleAutoHero(node: UINode): UINode {
  if (node.id !== "root") return node;
  if (node.children.length < 2) return node;

  // Check if first 2-3 children form a hero pattern
  const firstIsHeading = node.children[0]?.role === "heading";
  const secondIsText = node.children[1]?.role === "paragraph";
  const thirdIsButton = node.children[2]?.role === "button";

  const isH1 = node.children[0]?.properties?.headingLevel === 1;

  if (firstIsHeading && isH1 && (secondIsText || thirdIsButton)) {
    const updatedChildren = [...node.children];

    // Mark the heading as hero
    updatedChildren[0] = {
      ...updatedChildren[0],
      enhancementHints: [
        ...updatedChildren[0].enhancementHints,
        "hero-heading",
      ],
    };

    // Mark the paragraph as hero text (if present)
    if (secondIsText) {
      updatedChildren[1] = {
        ...updatedChildren[1],
        enhancementHints: [
          ...updatedChildren[1].enhancementHints,
          "hero-text",
        ],
      };
    }

    return { ...node, children: updatedChildren };
  }

  return node;
}

/* ══════════════════════════════════════════════════════════
   RULE 7: AUTO INPUT GROUPS
   
   Pattern: Multiple consecutive inputs in a column
   Enhancement: Group them with consistent 16px spacing
   ══════════════════════════════════════════════════════════ */
function ruleAutoInputGroup(node: UINode): UINode {
  const enhanced = {
    ...node,
    children: node.children.map(ruleAutoInputGroup),
  };

  if (enhanced.layout !== "column") return enhanced;

  // Find consecutive input runs
  let inputRunStart = -1;
  let inputRunLength = 0;

  for (let i = 0; i <= enhanced.children.length; i++) {
    const isInput =
      i < enhanced.children.length && enhanced.children[i].role === "input";

    if (isInput) {
      if (inputRunStart === -1) inputRunStart = i;
      inputRunLength++;
    } else {
      // End of a run — if we found 2+ consecutive inputs, enhance them
      if (inputRunLength >= 2) {
        for (
          let j = inputRunStart;
          j < inputRunStart + inputRunLength;
          j++
        ) {
          enhanced.children[j] = {
            ...enhanced.children[j],
            enhancementHints: [
              ...enhanced.children[j].enhancementHints,
              "input-group-member",
            ],
          };
        }
        // Normalize gaps between grouped inputs to 16px
        for (
          let j = inputRunStart;
          j < inputRunStart + inputRunLength - 1;
          j++
        ) {
          if (j < enhanced.gaps.length) {
            enhanced.gaps[j] = 16;
          }
        }
      }
      inputRunStart = -1;
      inputRunLength = 0;
    }
  }

  return enhanced;
}

/* ══════════════════════════════════════════════════════════
   RULE 8: AUTO FOOTER
   
   Pattern: Divider + text/container at the very bottom of root
   Enhancement: Add footer styling (muted text, top margin)
   ══════════════════════════════════════════════════════════ */
function ruleAutoFooter(node: UINode): UINode {
  if (node.id !== "root") return node;
  if (node.children.length < 3) return node;

  const lastChild = node.children[node.children.length - 1];
  const secondLast = node.children[node.children.length - 2];

  if (
    secondLast.role === "divider" &&
    (lastChild.role === "paragraph" || lastChild.role === "container")
  ) {
    const updatedChildren = [...node.children];
    updatedChildren[updatedChildren.length - 1] = {
      ...lastChild,
      enhancementHints: [...lastChild.enhancementHints, "footer"],
    };
    return { ...node, children: updatedChildren };
  }

  return node;
}


// ══════════════════════════════════════════════════════════
// ADD THESE NEW RULES to src/lib/ai-pipeline/enhancer.ts
// Place them AFTER rule 8 (ruleAutoFooter) and BEFORE enhanceTree
// ══════════════════════════════════════════════════════════

/* ══════════════════════════════════════════════════════════
   RULE 9: CONTENT SECTION DETECTION
   
   Pattern: Image + text side-by-side (row layout)
   Enhancement: Mark as "content-split" with media side
   ══════════════════════════════════════════════════════════ */
function ruleContentSplit(node: UINode): UINode {
  const enhanced = {
    ...node,
    children: node.children.map(ruleContentSplit),
  };

  if (enhanced.layout !== "row") return enhanced;
  if (enhanced.children.length < 2 || enhanced.children.length > 3) return enhanced;

  const hasImage = hasRole(enhanced.children, "image") || hasRole(enhanced.children, "video");
  const hasText = hasRole(enhanced.children, "heading") || hasRole(enhanced.children, "paragraph");

  if (hasImage && hasText) {
    return {
      ...enhanced,
      enhancementHints: [...enhanced.enhancementHints, "content-split"],
    };
  }

  return enhanced;
}

/* ══════════════════════════════════════════════════════════
   RULE 10: CTA SECTION DETECTION
   
   Pattern: Heading + 1-2 buttons, few other elements
   Enhancement: Mark as "cta-section"
   ══════════════════════════════════════════════════════════ */
function ruleCTASection(node: UINode): UINode {
  if (node.id === "root" || node.children.length < 2 || node.children.length > 4) return node;

  const hasHeading = hasRole(node.children, "heading");
  const buttonCount = countRoles(node.children, "button");
  const totalChildren = node.children.length;

  if (hasHeading && buttonCount >= 1 && totalChildren <= 4) {
    return {
      ...node,
      enhancementHints: [...node.enhancementHints, "cta-section"],
    };
  }

  return node;
}

/* ══════════════════════════════════════════════════════════
   RULE 11: STATS/NUMBERS DETECTION
   
   Pattern: 3-4 short headings in a row with small text below each
   Enhancement: Mark as "stats-section"
   ══════════════════════════════════════════════════════════ */
function ruleStatsSection(node: UINode): UINode {
  if (node.layout !== "row") return node;
  
  const headings = childrenWithin(node.children, ["heading"]);
  if (headings.length < 3) return node;

  // Check if headings have short text (likely numbers)
  const allShort = headings.every(h => (h.text || "").length <= 10);
  
  if (allShort) {
    return {
      ...node,
      enhancementHints: [...node.enhancementHints, "stats-section"],
    };
  }

  return node;
}

/* ══════════════════════════════════════════════════════════
   RULE 12: SIDEBAR DETECTION
   
   Pattern: Narrow tall container on left/right edge
   Enhancement: Mark as "sidebar"
   ══════════════════════════════════════════════════════════ */
function ruleSidebar(node: UINode): UINode {
  if (node.id !== "root" || node.layout !== "row") return node;

  const enhanced = { ...node };
  const updatedChildren = [...enhanced.children];

  for (let i = 0; i < updatedChildren.length; i++) {
    const child = updatedChildren[i];
    if (
      (child.role === "container" || child.role === "card") &&
      child.width < node.width * 0.3 &&
      child.height > node.height * 0.6
    ) {
      updatedChildren[i] = {
        ...child,
        enhancementHints: [...child.enhancementHints, "sidebar"],
      };
    }
  }

  return { ...enhanced, children: updatedChildren };
}

/* ══════════════════════════════════════════════════════════
   RULE 13: FEATURE ICON DETECTION
   
   Pattern: Small image/circle + heading + text, repeated 2-4x
   Enhancement: Mark each group as "feature-card"
   ══════════════════════════════════════════════════════════ */
function ruleFeatureIcons(node: UINode): UINode {
  const enhanced = {
    ...node,
    children: node.children.map(ruleFeatureIcons),
  };

  // Look at children that are containers/cards with 2-3 children 
  // including an avatar/image + heading
  for (let i = 0; i < enhanced.children.length; i++) {
    const child = enhanced.children[i];
    if (
      (child.role === "container" || child.role === "card") &&
      child.children.length >= 2 &&
      child.children.length <= 4
    ) {
      const hasSmallImage =
        child.children.some(
          (c) =>
            (c.role === "avatar" || c.role === "image" || c.role === "decorative") &&
            c.width < 80
        );
      const hasHeading = child.children.some((c) => c.role === "heading");

      if (hasSmallImage && hasHeading) {
        enhanced.children[i] = {
          ...child,
          enhancementHints: [...child.enhancementHints, "feature-card"],
        };
      }
    }
  }

  return enhanced;
}

/* ══════════════════════════════════════════════════════════
   MAIN ENHANCER FUNCTION
   
   Applies all 8 rules sequentially.
   Each rule is independent and additive.
   
   Order matters:
   1. Structural rules first (modify tree shape/roles)
   2. Spacing rules last (modify gaps)
   ══════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════
   MAIN ENHANCER FUNCTION — UPDATED
   
   Applies all 13 rules sequentially.
   Each rule is independent and additive.
   
   Order matters:
   1. Structural rules first (modify tree shape/roles)
   2. Pattern detection rules (add hints for section engine)
   3. Spacing rules last (modify gaps)
   ══════════════════════════════════════════════════════════ */
export function enhanceTree(tree: UINode): UINode {
  let enhanced = tree;

  // Structural rules (modify tree shape and roles)
  enhanced = ruleAutoCenterForm(enhanced);
  enhanced = ruleAutoCardify(enhanced);
  enhanced = ruleAutoResponsiveGrid(enhanced);
  enhanced = ruleAutoStickyNav(enhanced);
  enhanced = ruleAutoHero(enhanced);
  enhanced = ruleAutoInputGroup(enhanced);
  enhanced = ruleAutoFooter(enhanced);

  // NEW: Pattern detection rules (add hints for section engine)
  enhanced = ruleContentSplit(enhanced);
  enhanced = ruleCTASection(enhanced);
  enhanced = ruleStatsSection(enhanced);
  enhanced = ruleSidebar(enhanced);
  enhanced = ruleFeatureIcons(enhanced);

  // Spacing rules (modify gaps between children)
  enhanced = ruleAutoSectionSpacing(enhanced);

  return enhanced;
}