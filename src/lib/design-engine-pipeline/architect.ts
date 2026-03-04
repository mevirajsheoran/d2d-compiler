// src/lib/design-engine-pipeline/architect.ts

import type { ClassifiedComponent, UINode, DetectedGrid } from "./types";

/* ══════════════════════════════════════════════════════════
   OVERLAP RATIO CONTAINMENT (unchanged)
   ══════════════════════════════════════════════════════════ */
function containmentRatio(
  parent: ClassifiedComponent,
  child: ClassifiedComponent
): number {
  if (parent.id === child.id) return 0;
  const containerRoles = ["container", "card", "device-wrapper"];
  if (!containerRoles.includes(parent.role)) return 0;

  const ix1 = Math.max(parent.relX, child.relX);
  const iy1 = Math.max(parent.relY, child.relY);
  const ix2 = Math.min(parent.relX + parent.width, child.relX + child.width);
  const iy2 = Math.min(parent.relY + parent.height, child.relY + child.height);

  if (ix2 <= ix1 || iy2 <= iy1) return 0;

  const intersectionArea = (ix2 - ix1) * (iy2 - iy1);
  const childArea = child.width * child.height;
  if (childArea === 0) return 0;
  return intersectionArea / childArea;
}

/* ══════════════════════════════════════════════════════════
   ADAPTIVE ROW/COLUMN DETECTION (unchanged)
   ══════════════════════════════════════════════════════════ */
function detectLayout(
  nodes: ClassifiedComponent[],
  frameHeight: number
): "row" | "column" {
  if (nodes.length <= 1) return "column";

  const avgHeight =
    nodes.reduce((sum, n) => sum + n.height, 0) / nodes.length;
  const threshold = Math.min(frameHeight * 0.05, avgHeight * 0.5);

  let sameRowPairs = 0;
  for (let i = 1; i < nodes.length; i++) {
    if (Math.abs(nodes[i].relY - nodes[i - 1].relY) < threshold) {
      sameRowPairs++;
    }
  }

  return sameRowPairs > (nodes.length - 1) / 2 ? "row" : "column";
}

/* ══════════════════════════════════════════════════════════
   v4.0: EXTENDED GAP SNAP SCALE
   
   Added larger values (80–256) so tall frames preserve
   intentional blank space instead of capping at 64px.
   ══════════════════════════════════════════════════════════ */
function snapGap(px: number): number {
  const scale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256];
  return scale.reduce((prev, curr) =>
    Math.abs(curr - px) < Math.abs(prev - px) ? curr : prev
  );
}

/* ══════════════════════════════════════════════════════════
   PER-GAP CALCULATION (unchanged logic, extended scale)
   ══════════════════════════════════════════════════════════ */
function calculateGaps(
  nodes: ClassifiedComponent[],
  direction: "row" | "column"
): number[] {
  if (nodes.length <= 1) return [];

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
    gaps.push(snapGap(Math.max(gap, 0)));
  }

  return gaps;
}

/** Same as calculateGaps but works on UINodes (for post-processing) */
function calculateGapsForNodes(
  nodes: UINode[],
  direction: "row" | "column"
): number[] {
  if (nodes.length <= 1) return [];

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
    gaps.push(snapGap(Math.max(gap, 0)));
  }

  return gaps;
}

/* ══════════════════════════════════════════════════════════
   EMPTY ROOT (unchanged)
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
    properties: { frameWidth: w, frameHeight: h, frameRatio: h / w },
    enhancementHints: [],
  };
}

/* ══════════════════════════════════════════════════════════
   MAIN ARCHITECT FUNCTION
   
   v4.0: Root node now stores frame dimensions and ratio
   in properties for downstream blank-space handling.
   ══════════════════════════════════════════════════════════ */
export function buildHierarchy(
  components: ClassifiedComponent[],
  frameWidth: number,
  frameHeight: number
): UINode {
  if (components.length === 0) {
    return makeEmptyRoot(frameWidth, frameHeight);
  }

  // Step 1: Find parent for each component
  const parentMap = new Map<string, string | null>();
  for (const child of components) {
    let bestParent: ClassifiedComponent | null = null;
    let bestArea = Infinity;
    for (const candidate of components) {
      if (candidate.id === child.id) continue;
      const ratio = containmentRatio(candidate, child);
      if (ratio < 0.7) continue;
      const area = candidate.width * candidate.height;
      if (area < bestArea) {
        bestArea = area;
        bestParent = candidate;
      }
    }
    parentMap.set(child.id, bestParent?.id ?? null);
  }

  // Step 2: Group children by parent
  const childrenOf = new Map<string | null, ClassifiedComponent[]>();
  childrenOf.set(null, []);
  for (const comp of components) {
    const pid = parentMap.get(comp.id) ?? null;
    if (!childrenOf.has(pid)) childrenOf.set(pid, []);
    childrenOf.get(pid)!.push(comp);
  }

  // Step 3: Recursively build tree
  function buildNode(comp: ClassifiedComponent): UINode {
    const directChildren = childrenOf.get(comp.id) || [];
    const layout = detectLayout(directChildren, frameHeight);
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

  // Step 4: Build root node
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
    properties: {
      frameWidth,
      frameHeight,
      frameRatio: frameHeight / frameWidth,
    },
    enhancementHints: [],
  };
}

/* ══════════════════════════════════════════════════════════
   v4.0: GRID CONTAINER INJECTION (post-processing)
   
   After the tree is built normally, this function finds
   grid member nodes and groups them into a single grid
   container node — preserving each member's internal
   children (headings, paragraphs, images inside cards).
   ══════════════════════════════════════════════════════════ */
export function injectGridContainers(
  tree: UINode,
  detectedGrids: DetectedGrid[]
): UINode {
  if (!detectedGrids || detectedGrids.length === 0) return tree;

  let result = tree;

  for (const grid of detectedGrids) {
    result = injectOneGrid(result, grid);
  }

  return result;
}

function injectOneGrid(node: UINode, grid: DetectedGrid): UINode {
  // Recursively process children first
  let updated: UINode = {
    ...node,
    children: node.children.map((child) => injectOneGrid(child, grid)),
  };

  // Check if this node's direct children contain ALL grid members
  const childIds = new Set(updated.children.map((c) => c.id));
  const membersHere = grid.memberIds.filter((id) => childIds.has(id));

  if (membersHere.length !== grid.memberIds.length) return updated;

  // All grid members are direct children — group them
  const memberNodes = updated.children.filter((c) =>
    grid.memberIds.includes(c.id)
  );

  const minX = Math.min(...memberNodes.map((n) => n.relX));
  const minY = Math.min(...memberNodes.map((n) => n.relY));
  const maxX = Math.max(...memberNodes.map((n) => n.relX + n.width));
  const maxY = Math.max(...memberNodes.map((n) => n.relY + n.height));

  // Order members in row-major order from the assignment matrix
  const orderedMembers: UINode[] = [];
  for (const row of grid.assignment) {
    for (const memberId of row) {
      const member = memberNodes.find((n) => n.id === memberId);
      if (member) orderedMembers.push(member);
    }
  }

  const gridNode: UINode = {
    id: `grid-${grid.rows}x${grid.cols}-${Math.round(minY)}`,
    role: "container",
    relX: minX,
    relY: minY,
    width: maxX - minX,
    height: maxY - minY,
    text: "",
    properties: {
      isGrid: true,
      gridRows: grid.rows,
      gridCols: grid.cols,
      gridRowGap: grid.rowGap,
      gridColGap: grid.colGap,
      gridAssignment: grid.assignment,
      gridMemberIds: grid.memberIds,
    },
    children: orderedMembers,
    layout: "row",
    gaps: [],
    enhancementHints: [],
  };

  // Replace member nodes with the grid container
  const newChildren: UINode[] = [];
  let gridInserted = false;

  for (const child of updated.children) {
    if (grid.memberIds.includes(child.id)) {
      if (!gridInserted) {
        newChildren.push(gridNode);
        gridInserted = true;
      }
    } else {
      newChildren.push(child);
    }
  }

  // Recalculate gaps for the updated children list
  const newGaps = calculateGapsForNodes(newChildren, updated.layout);

  return { ...updated, children: newChildren, gaps: newGaps };
}