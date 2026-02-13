// src/lib/ai-pipeline/architect.ts

import type { ClassifiedComponent, UINode } from "./types";

/* ══════════════════════════════════════════════════════════
   FIX 1: OVERLAP RATIO CONTAINMENT
   
   Instead of checking if child's center is inside parent,
   we check if >= 70% of child's area overlaps with parent.
   
   This prevents false negatives where a shape is mostly
   inside a container but its center falls outside.
   ══════════════════════════════════════════════════════════ */
function containmentRatio(
  parent: ClassifiedComponent,
  child: ClassifiedComponent
): number {
  // Can't contain yourself
  if (parent.id === child.id) return 0;

  // Only containers, cards, and device-wrappers can be parents
  const containerRoles = ["container", "card", "device-wrapper"];
  if (!containerRoles.includes(parent.role)) return 0;

  // Calculate intersection rectangle
  const ix1 = Math.max(parent.relX, child.relX);
  const iy1 = Math.max(parent.relY, child.relY);
  const ix2 = Math.min(parent.relX + parent.width, child.relX + child.width);
  const iy2 = Math.min(
    parent.relY + parent.height,
    child.relY + child.height
  );

  // No intersection
  if (ix2 <= ix1 || iy2 <= iy1) return 0;

  const intersectionArea = (ix2 - ix1) * (iy2 - iy1);
  const childArea = child.width * child.height;

  if (childArea === 0) return 0;
  return intersectionArea / childArea;
}

/* ══════════════════════════════════════════════════════════
   FIX 2: RELATIVE ROW/COLUMN THRESHOLD
   
   Instead of a fixed 30px threshold for "same row",
   we use an adaptive threshold based on frame size
   and average child height.
   
   threshold = min(5% of frame height, 50% of avg child height)
   
   This works correctly for both phone frames (812px)
   and desktop frames (900px).
   ══════════════════════════════════════════════════════════ */
function detectLayout(
  nodes: ClassifiedComponent[],
  frameHeight: number
): "row" | "column" {
  if (nodes.length <= 1) return "column";

  // Calculate adaptive threshold
  const avgHeight =
    nodes.reduce((sum, n) => sum + n.height, 0) / nodes.length;
  const threshold = Math.min(frameHeight * 0.05, avgHeight * 0.5);

  // Count how many consecutive pairs share similar Y positions
  let sameRowPairs = 0;
  for (let i = 1; i < nodes.length; i++) {
    if (Math.abs(nodes[i].relY - nodes[i - 1].relY) < threshold) {
      sameRowPairs++;
    }
  }

  // If more than half of pairs are on same row → row layout
  if (sameRowPairs > (nodes.length - 1) / 2) {
    return "row";
  }

  return "column";
}

/* ══════════════════════════════════════════════════════════
   Snap a pixel value to the nearest Tailwind spacing unit
   ══════════════════════════════════════════════════════════ */
function snapGap(px: number): number {
  const scale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
  return scale.reduce((prev, curr) =>
    Math.abs(curr - px) < Math.abs(prev - px) ? curr : prev
  );
}

/* ══════════════════════════════════════════════════════════
   FIX 3: PER-GAP PRESERVATION
   
   Instead of averaging all gaps into one number,
   we calculate the gap between each consecutive pair
   and store them as a gaps[] array.
   
   This preserves intentional spacing differences like:
   - 40px after a heading
   - 16px between form fields
   - 32px before a submit button
   ══════════════════════════════════════════════════════════ */
function calculateGaps(
  nodes: ClassifiedComponent[],
  direction: "row" | "column"
): number[] {
  if (nodes.length <= 1) return [];

  // Sort by position in the layout direction
  const sorted = [...nodes].sort((a, b) =>
    direction === "row" ? a.relX - b.relX : a.relY - b.relY
  );

  const gaps: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    let gap: number;
    if (direction === "row") {
      gap = curr.relX - (prev.relX + prev.width);
    } else {
      gap = curr.relY - (prev.relY + prev.height);
    }

    // Snap each individual gap to Tailwind scale
    gaps.push(snapGap(Math.max(gap, 0)));
  }

  return gaps;
}

/* ══════════════════════════════════════════════════════════
   Create an empty root node (for empty frames)
   ══════════════════════════════════════════════════════════ */
function makeEmptyRoot(w: number, h: number): UINode {
  return {
    id: "root",
    role: "container",
    relX: 0,
    relY: 0,
    width: w,
    height: h,
    children: [],
    layout: "column",
    gaps: [],
    properties: {},
    enhancementHints: [],
  };
}

/* ══════════════════════════════════════════════════════════
   MAIN ARCHITECT FUNCTION
   
   Converts a flat list of classified components into
   a nested tree (UINode) structure.
   
   Algorithm:
   1. For each component, find the SMALLEST container
      that contains >= 70% of its area → that's its parent
   2. Group children by their parent
   3. Recursively build tree nodes
   4. Detect row vs column layout per group
   5. Calculate per-gap spacing
   ══════════════════════════════════════════════════════════ */
export function buildHierarchy(
  components: ClassifiedComponent[],
  frameWidth: number,
  frameHeight: number
): UINode {
  // Empty frame
  if (components.length === 0) {
    return makeEmptyRoot(frameWidth, frameHeight);
  }

  // ─── Step 1: Find parent for each component ───
  // Each child gets assigned to its SMALLEST containing parent
  const parentMap = new Map<string, string | null>();

  for (const child of components) {
    let bestParent: ClassifiedComponent | null = null;
    let bestArea = Infinity;

    for (const candidate of components) {
      if (candidate.id === child.id) continue;

      const ratio = containmentRatio(candidate, child);
      if (ratio < 0.7) continue; // Must be >= 70% contained

      const area = candidate.width * candidate.height;
      if (area < bestArea) {
        bestArea = area;
        bestParent = candidate;
      }
    }

    parentMap.set(child.id, bestParent?.id ?? null);
  }

  // ─── Step 2: Group children by parent ───
  const childrenOf = new Map<string | null, ClassifiedComponent[]>();
  childrenOf.set(null, []);

  for (const comp of components) {
    const pid = parentMap.get(comp.id) ?? null;
    if (!childrenOf.has(pid)) childrenOf.set(pid, []);
    childrenOf.get(pid)!.push(comp);
  }

  // ─── Step 3: Recursively build tree ───
  function buildNode(comp: ClassifiedComponent): UINode {
    const directChildren = childrenOf.get(comp.id) || [];
    const layout = detectLayout(directChildren, frameHeight);

    // Sort children by position in their layout direction
    const sorted = [...directChildren].sort((a, b) =>
      layout === "row" ? a.relX - b.relX : a.relY - b.relY
    );

    const gaps = calculateGaps(sorted, layout);

    return {
      id: comp.id,
      role: comp.role,
      relX: comp.relX,
      relY: comp.relY,
      width: comp.width,
      height: comp.height,
      text: comp.text,
      properties: comp.properties,
      children: sorted.map(buildNode),
      layout,
      gaps,
      enhancementHints: [],
    };
  }

  // ─── Step 4: Build root node from top-level children ───
  const rootChildren = childrenOf.get(null) || [];
  const rootLayout = detectLayout(rootChildren, frameHeight);

  const sortedRoot = [...rootChildren].sort((a, b) =>
    rootLayout === "row" ? a.relX - b.relX : a.relY - b.relY
  );

  const rootGaps = calculateGaps(sortedRoot, rootLayout);

  return {
    id: "root",
    role: "container",
    relX: 0,
    relY: 0,
    width: frameWidth,
    height: frameHeight,
    children: sortedRoot.map(buildNode),
    layout: rootLayout,
    gaps: rootGaps,
    properties: {},
    enhancementHints: [],
  };
}
