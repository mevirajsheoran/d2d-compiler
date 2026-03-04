// src/lib/design-engine-pipeline/section-engine.ts

/* ══════════════════════════════════════════════════════════════════════════════
   SECTION ENGINE
   
   Detects page-level sections from the UINode tree and assigns
   elements to named slots within section templates.
   
   This is the BRIDGE between:
   - Architect (gives us a tree of classified elements)
   - Builder (needs to know which SECTION TEMPLATE to use)
   
   DETECTION STRATEGY:
   1. Scan all nodes (flat or nested) by their POSITION in the frame
   2. Match against section patterns (nav, hero, form, etc.)
   3. Assign each node to a SLOT within its detected section
   4. Unmatched nodes go into "generic" sections
   
   HANDLES:
   - Flat trees (all elements at root level)
   - Nested trees (elements inside containers)
   - Mixed trees (some nested, some flat)
   
   NEVER produces ugly output — unmatched elements still get
   proper styling through the generic section fallback.
   
   Zero AI. Zero API calls. Pure geometry + role analysis.
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  UINode,
  SectionType,
  DetectedSection,
  SlotAssignment,
  UIRole,
} from "./types";

/* ══════════════════════════════════════════════════════════
   HELPER FUNCTIONS
   ══════════════════════════════════════════════════════════ */

/**
 * Collect ALL nodes from the tree into a flat list.
 * Each node gets its absolute position (relative to frame).
 * This lets us detect sections regardless of nesting.
 */
interface FlatNode {
  node: UINode;
  absX: number;
  absY: number;
  depth: number;
  parentId: string | null;
}

function flattenTree(
  node: UINode,
  offsetX: number = 0,
  offsetY: number = 0,
  depth: number = 0,
  parentId: string | null = null
): FlatNode[] {
  const result: FlatNode[] = [];

  // Skip the root container itself — we want its children
  if (node.id !== "root") {
    result.push({
      node,
      absX: node.relX + offsetX,
      absY: node.relY + offsetY,
      depth,
      parentId,
    });
  }

  for (const child of node.children) {
    // For root node, children positions are already frame-relative
    // For nested containers, we need to add the parent's offset
    const childOffsetX = node.id === "root" ? 0 : node.relX + offsetX;
    const childOffsetY = node.id === "root" ? 0 : node.relY + offsetY;

    result.push(
      ...flattenTree(child, childOffsetX, childOffsetY, depth + 1, node.id)
    );
  }

  return result;
}

/**
 * Get the vertical position of a node as a fraction of frame height.
 * 0.0 = top of frame, 1.0 = bottom of frame.
 */
function verticalPosition(absY: number, frameHeight: number): number {
  if (frameHeight === 0) return 0;
  return Math.max(0, Math.min(1, absY / frameHeight));
}

/**
 * Check if nodes are roughly on the same horizontal band.
 */
function sameVerticalBand(
  nodes: FlatNode[],
  tolerance: number = 30
): boolean {
  if (nodes.length <= 1) return true;
  const ys = nodes.map((n) => n.absY);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return maxY - minY < tolerance;
}

/**
 * Check if a node has a specific role.
 */
function hasRole(nodes: FlatNode[], role: UIRole): boolean {
  return nodes.some((n) => n.node.role === role);
}

/**
 * Filter nodes by role.
 */
function withRole(nodes: FlatNode[], ...roles: UIRole[]): FlatNode[] {
  return nodes.filter((n) => roles.includes(n.node.role));
}

/**
 * Count nodes with specific roles.
 */
function countRoles(nodes: FlatNode[], ...roles: UIRole[]): number {
  return nodes.filter((n) => roles.includes(n.node.role)).length;
}

/**
 * Get the center Y of a group of nodes.
 */
function groupCenterY(nodes: FlatNode[]): number {
  if (nodes.length === 0) return 0;
  const ys = nodes.map((n) => n.absY + n.node.height / 2);
  return ys.reduce((sum, y) => sum + y, 0) / ys.length;
}

/**
 * Check if a text node looks like a heading (H1, H2, or H3).
 * v4.0: Expanded from H1-H2 to also accept H3,
 * because users often draw headings at medium font sizes.
 */
function isLargeHeading(node: UINode): boolean {
  if (node.role !== "heading") return false;
  const level = (node.properties?.headingLevel as number) ?? 5;
  return level <= 3; // was: level <= 2
}
/**
 * Create a slot assignment.
 */
function slot(name: string, flatNode: FlatNode): SlotAssignment {
  return {
    slotName: name,
    nodeId: flatNode.node.id,
    node: flatNode.node,
  };
}

/* ══════════════════════════════════════════════════════════
   SECTION DETECTORS
   
   Each detector examines a set of nodes and determines
   if they match a specific section pattern.
   
   Returns: DetectedSection or null (no match)
   
   IMPORTANT: Detectors consume nodes — once a node is
   assigned to a section, it's removed from the pool.
   This prevents double-assignment.
   ══════════════════════════════════════════════════════════ */

/**
 * DETECTOR 1: Navigation
 * 
 * Trigger: Elements in the top 12% of the frame
 * Sub-checks: has nav role (hamburgerMenu), has buttons, has text
 * Confidence: HIGH if hamburgerMenu present, MEDIUM otherwise
 */
function detectNav(
  available: FlatNode[],
  frameHeight: number
): DetectedSection | null {
  // Find elements in the top band
  const topThreshold = frameHeight * 0.12;
  const topNodes = available.filter(
    (n) => n.absY < topThreshold || n.absY + n.node.height < topThreshold + 30
  );

  if (topNodes.length === 0) return null;

  // Must have nav role OR (buttons in top band)
  const hasNavRole = hasRole(topNodes, "nav");
  const topButtons = withRole(topNodes, "button");
  const topText = withRole(topNodes, "heading", "paragraph");

  if (!hasNavRole && topButtons.length === 0 && topText.length === 0) {
    return null;
  }

  // Build slots
  const slots: SlotAssignment[] = [];
  const nodeIds: string[] = [];

  // Logo slot — nav element or first text in top band
  const navNodes = withRole(topNodes, "nav");
  if (navNodes.length > 0) {
    slots.push(slot("logo", navNodes[0]));
    nodeIds.push(navNodes[0].node.id);
  } else if (topText.length > 0) {
    slots.push(slot("logo", topText[0]));
    nodeIds.push(topText[0].node.id);
  }

  // Nav links — text elements in top band (after first one used as logo)
  const remainingText = topText.filter(
    (n) => !nodeIds.includes(n.node.id)
  );
  for (const textNode of remainingText) {
    slots.push(slot("nav-link", textNode));
    nodeIds.push(textNode.node.id);
  }

  // CTA buttons — buttons in top band
  for (let i = 0; i < topButtons.length; i++) {
    const slotName = i === 0 ? "cta-secondary" : "cta-primary";
    slots.push(slot(slotName, topButtons[i]));
    nodeIds.push(topButtons[i].node.id);
  }

  // Add any remaining top-band elements
  for (const n of topNodes) {
    if (!nodeIds.includes(n.node.id)) {
      slots.push(slot("nav-extra", n));
      nodeIds.push(n.node.id);
    }
  }
    // v5.0: Consume dividers immediately below nav to prevent leaking to generic
  const navBottom = Math.max(...nodeIds.map((id) => {
    const n = available.find((a) => a.node.id === id);
    return n ? n.absY + n.node.height : 0;
  }));
  const dividersBelowNav = withRole(available, "divider").filter(
    (d) => !nodeIds.includes(d.node.id) && d.absY >= navBottom && d.absY <= navBottom + 30
  );
  for (const d of dividersBelowNav) {
    nodeIds.push(d.node.id);
  }

  return {
    type: "nav",
    confidence: hasNavRole ? 0.95 : 0.7,
    nodeIds,
    slots,
    position: "top",
    orderIndex: 0,
  };
}

/**
 * DETECTOR 2: Hero Section
 * 
 * Trigger: Large heading (H1/H2) in the top 45% of frame
 * Sub-types:
 *   - Centered: heading + text/buttons, no adjacent image
 *   - Split: heading + image side by side
 * Confidence: HIGH if H1 found
 */
function detectHero(
  available: FlatNode[],
  frameHeight: number,
  frameWidth: number
): DetectedSection | null {
  // Look for large headings in upper portion
  const upperThreshold = frameHeight * 0.45;
  const upperNodes = available.filter((n) => n.absY < upperThreshold);

  let headings = upperNodes.filter((n) => isLargeHeading(n.node));

  // ═══ v4.0 FIX: If no headings found directly, check if there's a
  // container/card in the upper area that CONTAINS a heading child.
  // This handles the case where user draws a rectangle with text inside. ═══
  if (headings.length === 0) {
    const upperContainers = upperNodes.filter(
      (n) => n.node.role === "container" || n.node.role === "card"
    );
    for (const container of upperContainers) {
      const headingChild = container.node.children.find(
        (c) => c.role === "heading"
      );
      if (headingChild) {
        // Create a synthetic flat node for this heading at the container's position
        headings.push({
          node: headingChild,
          absX: container.absX,
          absY: container.absY,
          depth: container.depth + 1,
          parentId: container.node.id,
        });
      }
    }
  }

  // Also try: any heading at all in the upper portion (even H4)
  if (headings.length === 0) {
    headings = upperNodes.filter((n) => n.node.role === "heading");
  }
  // ═══ v4.0 FIX END ═══
  if (headings.length === 0) return null;

  const heroHeading = headings[0];
  const slots: SlotAssignment[] = [];
  const nodeIds: string[] = [];

  // Heading slot
  slots.push(slot("heading", heroHeading));
  nodeIds.push(heroHeading.node.id);

  // Find nearby elements (within 200px below the heading)
  const nearbyBelow = upperNodes.filter(
    (n) =>
      !nodeIds.includes(n.node.id) &&
      n.absY > heroHeading.absY &&
      n.absY < heroHeading.absY + heroHeading.node.height + 200
  );

  // Subtext — paragraph near heading
  const subtexts = withRole(nearbyBelow, "paragraph");
  if (subtexts.length > 0) {
    slots.push(slot("subtext", subtexts[0]));
    nodeIds.push(subtexts[0].node.id);
  }

  // CTA buttons near heading
  const ctaButtons = withRole(nearbyBelow, "button").filter(
    (n) => !nodeIds.includes(n.node.id)
  );
  for (let i = 0; i < Math.min(ctaButtons.length, 2); i++) {
    slots.push(slot(i === 0 ? "cta-primary" : "cta-secondary", ctaButtons[i]));
    nodeIds.push(ctaButtons[i].node.id);
  }

  // Check for image — determines centered vs split
  const heroImages = withRole(upperNodes, "image", "video").filter(
    (n) => !nodeIds.includes(n.node.id)
  );

  let sectionType: SectionType = "hero-centered";

  if (heroImages.length > 0) {
    const img = heroImages[0];
    // If image is to the right of heading AND wide enough → split
    const headingRight = heroHeading.absX + heroHeading.node.width;
    const imageMidX = img.absX + img.node.width / 2;
    const frameMidX = frameWidth / 2;

    if (
      (imageMidX > frameMidX && heroHeading.absX < frameMidX) ||
      (heroHeading.absX > frameMidX && imageMidX < frameMidX) ||
      img.node.width > frameWidth * 0.35
    ) {
      sectionType = "hero-split";
    }

    slots.push(slot("media", img));
    nodeIds.push(img.node.id);
  }

  // Grab any remaining nearby elements
  const remaining = nearbyBelow.filter(
    (n) => !nodeIds.includes(n.node.id)
  );
  for (const n of remaining) {
    slots.push(slot("hero-extra", n));
    nodeIds.push(n.node.id);
  }

  return {
    type: sectionType,
    confidence: (heroHeading.node.properties?.headingLevel as number) === 1 ? 0.95 : 0.8,
    nodeIds,
    slots,
    position: "top",
    orderIndex: 1,
  };
}

/**
 * DETECTOR 3: Form Section
 * 
 * Trigger: 2+ inputs in vertical arrangement with optional heading + button
 * Sub-types: login (2 inputs), contact (3-5 inputs), settings (5+)
 * Confidence: HIGH if inputs + button found together
 */
function detectForm(
  available: FlatNode[],
  _frameHeight: number
): DetectedSection | null {
  const inputs = withRole(available, "input");
  if (inputs.length < 2) return null;

  // Find clustered inputs (within reasonable vertical distance)
  const sortedInputs = [...inputs].sort((a, b) => a.absY - b.absY);

  // Check if inputs are vertically stacked (not horizontal)
  let clustered = true;
  for (let i = 1; i < sortedInputs.length; i++) {
    const gap = sortedInputs[i].absY - sortedInputs[i - 1].absY;
    // If gap is too large (>150px) or inputs are side by side, not a form
    if (gap > 150) {
      clustered = false;
      break;
    }
    // Check if they're vertically aligned (similar X)
    const xDiff = Math.abs(sortedInputs[i].absX - sortedInputs[i - 1].absX);
    if (xDiff > 200) {
      clustered = false;
      break;
    }
  }

  if (!clustered) return null;

  const slots: SlotAssignment[] = [];
  const nodeIds: string[] = [];

  // Find the vertical range of the form
  const formTopY = sortedInputs[0].absY - 100; // Look above first input
  const formBottomY =
    sortedInputs[sortedInputs.length - 1].absY +
    sortedInputs[sortedInputs.length - 1].node.height +
    100;

  // Heading above inputs
  const headingsAbove = withRole(available, "heading").filter(
    (n) =>
      n.absY < sortedInputs[0].absY &&
      n.absY > formTopY &&
      !nodeIds.includes(n.node.id)
  );

  if (headingsAbove.length > 0) {
    // Sort by proximity to first input — closest is the form heading
    headingsAbove.sort(
      (a, b) =>
        Math.abs(a.absY - sortedInputs[0].absY) -
        Math.abs(b.absY - sortedInputs[0].absY)
    );
    slots.push(slot("heading", headingsAbove[0]));
    nodeIds.push(headingsAbove[0].node.id);
  }

  // Description text above inputs (after heading)
  const textsAbove = withRole(available, "paragraph").filter(
    (n) =>
      n.absY < sortedInputs[0].absY &&
      n.absY > formTopY &&
      !nodeIds.includes(n.node.id)
  );
  if (textsAbove.length > 0) {
    textsAbove.sort(
      (a, b) =>
        Math.abs(a.absY - sortedInputs[0].absY) -
        Math.abs(b.absY - sortedInputs[0].absY)
    );
    slots.push(slot("description", textsAbove[0]));
    nodeIds.push(textsAbove[0].node.id);
  }

  // Checkboxes in the form area
  const checkboxes = withRole(available, "checkbox").filter(
    (n) =>
      n.absY >= formTopY &&
      n.absY <= formBottomY &&
      !nodeIds.includes(n.node.id)
  );

  // Input fields
  for (let i = 0; i < sortedInputs.length; i++) {
    slots.push(slot(`field-${i}`, sortedInputs[i]));
    nodeIds.push(sortedInputs[i].node.id);
  }

  // Checkboxes
  for (const cb of checkboxes) {
    slots.push(slot("checkbox", cb));
    nodeIds.push(cb.node.id);
  }

  // Submit button — look below inputs
  const buttonsBelow = withRole(available, "button").filter(
    (n) =>
      n.absY >= sortedInputs[sortedInputs.length - 1].absY - 20 &&
      n.absY <= formBottomY + 50 &&
      !nodeIds.includes(n.node.id)
  );
  if (buttonsBelow.length > 0) {
    // Closest button below inputs
    buttonsBelow.sort((a, b) => a.absY - b.absY);
    slots.push(slot("submit", buttonsBelow[0]));
    nodeIds.push(buttonsBelow[0].node.id);

    // Second button as secondary
    if (buttonsBelow.length > 1) {
      slots.push(slot("secondary-action", buttonsBelow[1]));
      nodeIds.push(buttonsBelow[1].node.id);
    }
  }

  return {
    type: "form",
    confidence: buttonsBelow.length > 0 ? 0.9 : 0.75,
    nodeIds,
    slots,
    position: "middle",
    orderIndex: 5,
  };
}

/**
 * DETECTOR 4: Feature Grid
 * 
 * Trigger: 2-4 similar containers/cards in a row OR
 *          2-4 groups of (icon/image + heading + text) pattern
 * Confidence: HIGH if cards have similar widths
 */
function detectFeatures(
  available: FlatNode[],
  frameWidth: number
): DetectedSection | null {

  // ═══ v4.0 ADDITION: Grid Container Detection ═══
  const gridNodes = available.filter((n) => n.node.properties?.isGrid);
  if (gridNodes.length > 0) {
    const gridNode = gridNodes[0];
    const slots: SlotAssignment[] = [];
    const nodeIds: string[] = [];

    // Section heading above the grid
    const gridTopY = gridNode.absY;
    const headingsAbove = withRole(available, "heading").filter(
      (n) =>
        n.absY < gridTopY &&
        n.absY > gridTopY - 150 &&
        !nodeIds.includes(n.node.id)
    );
    if (headingsAbove.length > 0) {
      slots.push(slot("section-heading", headingsAbove[0]));
      nodeIds.push(headingsAbove[0].node.id);
    }

    // Section description above the grid
    const descAbove = withRole(available, "paragraph").filter(
      (n) =>
        n.absY < gridTopY &&
        n.absY > gridTopY - 120 &&
        !nodeIds.includes(n.node.id)
    );
    if (descAbove.length > 0) {
      slots.push(slot("section-description", descAbove[0]));
      nodeIds.push(descAbove[0].node.id);
    }

    // Grid container itself
    slots.push(slot("grid-container", gridNode));
    nodeIds.push(gridNode.node.id);

    // Consume all descendants of the grid container
    const allDesc = flattenTree(gridNode.node);
    for (const d of allDesc) {
      if (!nodeIds.includes(d.node.id)) {
        nodeIds.push(d.node.id);
      }
    }

    return {
      type: "features",
      confidence: 0.9,
      nodeIds,
      slots,
      position: "middle",
      orderIndex: 3,
    };
  }
  // ═══ v4.0 ADDITION END ═══

  // Strategy 1: Look for cards/containers in a horizontal row
  const cards = withRole(available, "card", "container").filter(
    (n) => n.node.children.length >= 1 && n.node.width < frameWidth * 0.6
  );

  if (cards.length >= 2 && cards.length <= 4) {
    // Check if they're roughly on the same row
    if (sameVerticalBand(cards, 50)) {
      // Check if similar widths
      const widths = cards.map((c) => c.node.width);
      const avgW = widths.reduce((s, w) => s + w, 0) / widths.length;
      const allSimilar = widths.every(
        (w) => Math.abs(w - avgW) / avgW < 0.3
      );

      if (allSimilar) {
        const slots: SlotAssignment[] = [];
        const nodeIds: string[] = [];

        // Look for a heading above the cards
        const cardsTopY = Math.min(...cards.map((c) => c.absY));
        const sectionHeadings = withRole(available, "heading").filter(
          (n) =>
            n.absY < cardsTopY &&
            n.absY > cardsTopY - 150 &&
            !nodeIds.includes(n.node.id)
        );

        if (sectionHeadings.length > 0) {
          slots.push(slot("section-heading", sectionHeadings[0]));
          nodeIds.push(sectionHeadings[0].node.id);
        }

        // Section description
        const sectionTexts = withRole(available, "paragraph").filter(
          (n) =>
            n.absY < cardsTopY &&
            n.absY > cardsTopY - 120 &&
            !nodeIds.includes(n.node.id)
        );

        if (sectionTexts.length > 0) {
          slots.push(slot("section-description", sectionTexts[0]));
          nodeIds.push(sectionTexts[0].node.id);
        }

        // Feature cards
        for (let i = 0; i < cards.length; i++) {
          slots.push(slot(`feature-${i}`, cards[i]));
          nodeIds.push(cards[i].node.id);

          // Also consume children of each card
          const flatChildren = flattenTree(cards[i].node);
          for (const child of flatChildren) {
            if (!nodeIds.includes(child.node.id)) {
              nodeIds.push(child.node.id);
            }
          }
        }

        return {
          type: "features",
          confidence: 0.85,
          nodeIds,
          slots,
          position: "middle",
          orderIndex: 3,
        };
      }
    }
  }

  // Strategy 2: Look for repeated pattern of (image/avatar + heading + paragraph)
  // This catches icon-feature layouts without explicit containers
  const images = withRole(available, "image", "avatar", "decorative");
  const headings = withRole(available, "heading");

  if (images.length >= 2 && headings.length >= 2) {
    // Check if images are in a row
    if (sameVerticalBand(images, 50)) {
      const slots: SlotAssignment[] = [];
      const nodeIds: string[] = [];

      // Sort images left to right
      const sortedImages = [...images].sort((a, b) => a.absX - b.absX);

      for (let i = 0; i < Math.min(sortedImages.length, 4); i++) {
        const img = sortedImages[i];
        slots.push(slot(`feature-icon-${i}`, img));
        nodeIds.push(img.node.id);

        // Find heading near this image (below it, similar X)
        const nearbyHeading = headings.find(
          (h) =>
            !nodeIds.includes(h.node.id) &&
            Math.abs(h.absX - img.absX) < 100 &&
            h.absY > img.absY &&
            h.absY < img.absY + img.node.height + 80
        );

        if (nearbyHeading) {
          slots.push(slot(`feature-title-${i}`, nearbyHeading));
          nodeIds.push(nearbyHeading.node.id);

          // Find paragraph near this heading
          const nearbyText = withRole(available, "paragraph").find(
            (p) =>
              !nodeIds.includes(p.node.id) &&
              Math.abs(p.absX - nearbyHeading.absX) < 100 &&
              p.absY > nearbyHeading.absY &&
              p.absY < nearbyHeading.absY + nearbyHeading.node.height + 60
          );

          if (nearbyText) {
            slots.push(slot(`feature-text-${i}`, nearbyText));
            nodeIds.push(nearbyText.node.id);
          }
        }
      }

      if (slots.length >= 4) {
        return {
          type: "features",
          confidence: 0.75,
          nodeIds,
          slots,
          position: "middle",
          orderIndex: 3,
        };
      }
    }
  }

  return null;
}

/**
 * DETECTOR 5: Content Split
 * 
 * Trigger: Image/video + text side by side
 * Sub-types: media-left, media-right
 */
function detectContentSplit(
  available: FlatNode[],
  frameWidth: number
): DetectedSection | null {
  const images = withRole(available, "image", "video");
  const texts = withRole(available, "heading", "paragraph");

  if (images.length === 0 || texts.length === 0) return null;

  for (const img of images) {
    // Find text that's on the same vertical band but different horizontal position
    const companionTexts = texts.filter(
      (t) =>
        Math.abs(
          img.absY + img.node.height / 2 - (t.absY + t.node.height / 2)
        ) < 150 &&
        Math.abs(img.absX - t.absX) > frameWidth * 0.2
    );

    if (companionTexts.length >= 1) {
      const slots: SlotAssignment[] = [];
      const nodeIds: string[] = [];

      const imgCenterX = img.absX + img.node.width / 2;
      const frameCenterX = frameWidth / 2;

      // Media slot
      slots.push(slot("media", img));
      nodeIds.push(img.node.id);

      // Text slots
      const heading = companionTexts.find((t) => t.node.role === "heading");
      const paragraph = companionTexts.find(
        (t) => t.node.role === "paragraph"
      );

      if (heading) {
        slots.push(slot("content-heading", heading));
        nodeIds.push(heading.node.id);
      }
      if (paragraph) {
        slots.push(slot("content-text", paragraph));
        nodeIds.push(paragraph.node.id);
      }

      // Buttons near the text
      const nearbyButtons = withRole(available, "button").filter(
        (b) =>
          !nodeIds.includes(b.node.id) &&
          companionTexts.some(
            (t) =>
              Math.abs(b.absX - t.absX) < 200 &&
              b.absY > t.absY &&
              b.absY < t.absY + t.node.height + 100
          )
      );

      for (const btn of nearbyButtons.slice(0, 2)) {
        slots.push(slot("content-cta", btn));
        nodeIds.push(btn.node.id);
      }

      return {
        type: "content-split",
        confidence: 0.8,
        nodeIds,
        slots,
        position: "middle",
        orderIndex: 4,
      };
    }
  }

  return null;
}

/**
 * DETECTOR 6: Card Grid
 * 
 * Trigger: 2+ cards in grid-like arrangement
 * Different from features — cards have internal structure
 */
function detectCardGrid(
  available: FlatNode[],
  _frameWidth: number
): DetectedSection | null {
  const cards = withRole(available, "card").filter(
    (n) => n.node.children.length >= 2
  );

  if (cards.length < 2) return null;

  const slots: SlotAssignment[] = [];
  const nodeIds: string[] = [];

  // Section heading above cards
  const cardsTopY = Math.min(...cards.map((c) => c.absY));
  const headingsAbove = withRole(available, "heading").filter(
    (n) =>
      n.absY < cardsTopY &&
      n.absY > cardsTopY - 120 &&
      !nodeIds.includes(n.node.id)
  );

  if (headingsAbove.length > 0) {
    slots.push(slot("section-heading", headingsAbove[0]));
    nodeIds.push(headingsAbove[0].node.id);
  }

  for (let i = 0; i < cards.length; i++) {
    slots.push(slot(`card-${i}`, cards[i]));
    nodeIds.push(cards[i].node.id);

    // Consume children
    const flatChildren = flattenTree(cards[i].node);
    for (const child of flatChildren) {
      if (!nodeIds.includes(child.node.id)) {
        nodeIds.push(child.node.id);
      }
    }
  }

  return {
    type: "card-grid",
    confidence: 0.8,
    nodeIds,
    slots,
    position: "middle",
    orderIndex: 6,
  };
}

/**
 * DETECTOR 7: CTA Section
 * 
 * Trigger: Heading + 1-2 buttons with few other elements
 * Typically mid-page or near bottom
 */
function detectCTA(
  available: FlatNode[],
  _frameHeight: number
): DetectedSection | null {
  // Look for isolated heading + button clusters
  const headings = withRole(available, "heading");
  const buttons = withRole(available, "button");

  if (headings.length === 0 || buttons.length === 0) return null;

  for (const heading of headings) {
    // Find buttons within 150px below this heading
    const nearbyButtons = buttons.filter(
      (b) =>
        b.absY > heading.absY &&
        b.absY < heading.absY + heading.node.height + 150 &&
        Math.abs(b.absX + b.node.width / 2 - (heading.absX + heading.node.width / 2)) <
        300
    );

    if (nearbyButtons.length >= 1 && nearbyButtons.length <= 3) {
      // Check there aren't too many other elements nearby (that would make it NOT a CTA)
      const nearbyOthers = available.filter(
        (n) =>
          n.node.id !== heading.node.id &&
          !nearbyButtons.some((b) => b.node.id === n.node.id) &&
          Math.abs(n.absY - heading.absY) < 200 &&
          n.node.role !== "divider"
      );

      // CTA sections are clean — heading + buttons + maybe a subtitle
      if (nearbyOthers.length <= 2) {
        const slots: SlotAssignment[] = [];
        const nodeIds: string[] = [];

        slots.push(slot("heading", heading));
        nodeIds.push(heading.node.id);

        // Check for subtitle
        const subtitle = withRole(available, "paragraph").find(
          (p) =>
            p.absY > heading.absY &&
            p.absY < heading.absY + heading.node.height + 60 &&
            !nearbyButtons.some((b) => b.node.id === p.node.id)
        );

        if (subtitle) {
          slots.push(slot("subtext", subtitle));
          nodeIds.push(subtitle.node.id);
        }

        for (let i = 0; i < nearbyButtons.length; i++) {
          slots.push(
            slot(i === 0 ? "cta-primary" : "cta-secondary", nearbyButtons[i])
          );
          nodeIds.push(nearbyButtons[i].node.id);
        }

        return {
          type: "cta",
          confidence: 0.75,
          nodeIds,
          slots,
          position: "middle",
          orderIndex: 7,
        };
      }
    }
  }

  return null;
}

/**
 * DETECTOR 8: Footer
 * 
 * Trigger: Elements in the bottom 18% of frame
 * Sub-checks: divider above, text elements, small text
 */
function detectFooter(
  available: FlatNode[],
  frameHeight: number
): DetectedSection | null {
  const bottomThreshold = frameHeight * 0.82;
  const bottomNodes = available.filter(
    (n) => n.absY > bottomThreshold || n.absY + n.node.height > bottomThreshold
  );

  if (bottomNodes.length === 0) return null;

  // Check for a divider just above the bottom section
  const dividersNearBottom = withRole(available, "divider").filter(
    (n) => n.absY > frameHeight * 0.7 && n.absY < bottomThreshold + 30
  );

  const slots: SlotAssignment[] = [];
  const nodeIds: string[] = [];

  // Include the divider if found
  if (dividersNearBottom.length > 0) {
    nodeIds.push(dividersNearBottom[0].node.id);
  }

  // Text elements in footer
  const footerTexts = withRole(bottomNodes, "heading", "paragraph");
  for (const t of footerTexts) {
    slots.push(slot("footer-text", t));
    nodeIds.push(t.node.id);
  }

  // Buttons in footer (social links, etc.)
  const footerButtons = withRole(bottomNodes, "button");
  for (const b of footerButtons) {
    slots.push(slot("footer-link", b));
    nodeIds.push(b.node.id);
  }

  // Any remaining bottom elements
  for (const n of bottomNodes) {
    if (!nodeIds.includes(n.node.id)) {
      slots.push(slot("footer-extra", n));
      nodeIds.push(n.node.id);
    }
  }

  // Need at least one slot to be a footer
  if (slots.length === 0) return null;

  return {
    type: "footer",
    confidence: dividersNearBottom.length > 0 ? 0.9 : 0.65,
    nodeIds,
    slots,
    position: "bottom",
    orderIndex: 99,
  };
}

/**
 * DETECTOR 9: Stats Section
 * 
 * Trigger: 3-4 short headings with numbers in a row
 */
function detectStats(
  available: FlatNode[],
  _frameHeight: number
): DetectedSection | null {
  const headings = withRole(available, "heading");
  if (headings.length < 3) return null;

  // Check if headings are in a row
  if (!sameVerticalBand(headings.slice(0, 4), 40)) return null;

  // Check if they look like numbers (short text, potentially numeric)
  const potentialStats = headings.filter((h) => {
    const text = h.node.text || "";
    return text.length <= 10; // Short headings
  });

  if (potentialStats.length < 3) return null;

  const slots: SlotAssignment[] = [];
  const nodeIds: string[] = [];

  const sortedStats = [...potentialStats]
    .sort((a, b) => a.absX - b.absX)
    .slice(0, 4);

  for (let i = 0; i < sortedStats.length; i++) {
    slots.push(slot(`stat-value-${i}`, sortedStats[i]));
    nodeIds.push(sortedStats[i].node.id);

    // Find label below each stat
    const label = withRole(available, "paragraph").find(
      (p) =>
        !nodeIds.includes(p.node.id) &&
        Math.abs(p.absX - sortedStats[i].absX) < 80 &&
        p.absY > sortedStats[i].absY &&
        p.absY < sortedStats[i].absY + sortedStats[i].node.height + 50
    );

    if (label) {
      slots.push(slot(`stat-label-${i}`, label));
      nodeIds.push(label.node.id);
    }
  }

  return {
    type: "stats",
    confidence: 0.7,
    nodeIds,
    slots,
    position: "middle",
    orderIndex: 4,
  };
}


/* ══════════════════════════════════════════════════════════
   MAIN SECTION DETECTION FUNCTION
   
   Runs all detectors in priority order.
   Each detector consumes nodes — consumed nodes are
   removed from the pool before the next detector runs.
   
   Priority order matters:
   1. Nav (always top)
   2. Footer (always bottom)
   3. Hero (top area, after nav)
   4. Form (inputs are distinctive)
   5. Features (card groups)
   6. Stats (number groups)
   7. Content Split (image + text)
   8. Card Grid (generic cards)
   9. CTA (heading + buttons)
   
   Remaining nodes → generic section
   ══════════════════════════════════════════════════════════ */
export function detectSections(
  tree: UINode,
  frameWidth: number,
  frameHeight: number
): DetectedSection[] {
  // Flatten the entire tree
  const allNodes = flattenTree(tree);
  const consumed = new Set<string>();
  const sections: DetectedSection[] = [];

  // Helper: get available (unconsumed) nodes
  function getAvailable(): FlatNode[] {
    return allNodes.filter((n) => !consumed.has(n.node.id));
  }

  // Helper: consume detected section's nodes
  function consumeSection(section: DetectedSection | null): boolean {
    if (!section) return false;
    for (const id of section.nodeIds) {
      consumed.add(id);
    }
    sections.push(section);
    return true;
  }

  // ─── Run detectors in priority order ───

  // 1. Nav (top priority — anchors the page)
  consumeSection(detectNav(getAvailable(), frameHeight));

  // 2. Footer (bottom priority — anchors the page)
  consumeSection(detectFooter(getAvailable(), frameHeight));

  // 3. Hero (after nav is consumed, look for hero)
  consumeSection(detectHero(getAvailable(), frameHeight, frameWidth));

  // 4. Form (distinctive pattern)
  consumeSection(detectForm(getAvailable(), frameHeight));

  // 5. Features (card groups)
  consumeSection(detectFeatures(getAvailable(), frameWidth));

  // 6. Stats
  consumeSection(detectStats(getAvailable(), frameHeight));

  // 7. Content Split
  consumeSection(detectContentSplit(getAvailable(), frameWidth));

  // 8. Card Grid
  consumeSection(detectCardGrid(getAvailable(), frameWidth));

  // 9. CTA
  consumeSection(detectCTA(getAvailable(), frameHeight));

  // ─── Remaining nodes → generic section ───
  const remaining = getAvailable();
  if (remaining.length > 0) {
    const genericSlots: SlotAssignment[] = remaining.map((n) =>
      slot("generic-child", n)
    );
    const genericIds = remaining.map((n) => n.node.id);

    sections.push({
      type: "generic",
      confidence: 0.5,
      nodeIds: genericIds,
      slots: genericSlots,
      position: "middle",
      orderIndex: 50,
    });
  }

  // ─── Sort sections by orderIndex for rendering ───
  sections.sort((a, b) => a.orderIndex - b.orderIndex);

  return sections;
}


/* ══════════════════════════════════════════════════════════
   UTILITY: Get section count by type (for quality metrics)
   ══════════════════════════════════════════════════════════ */
export function countSectionTypes(
  sections: DetectedSection[]
): Record<SectionType, number> {
  const counts: Record<string, number> = {};
  for (const s of sections) {
    counts[s.type] = (counts[s.type] || 0) + 1;
  }
  return counts as Record<SectionType, number>;
}