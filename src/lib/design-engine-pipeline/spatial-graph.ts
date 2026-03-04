// src/lib/design-engine-pipeline/spatial-graph.ts

/* ══════════════════════════════════════════════════════════════════════════════
   SPATIAL CONSTRAINT GRAPH

   Builds a graph of pairwise spatial relationships between classified
   components. Finds alignment cliques (groups sharing top/left alignment)
   that feed into grid detection.

   Complexity: O(n²) pairwise + O(n log n) clique detection.
   For 30 elements: < 1ms.
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  ClassifiedComponent,
  SpatialNode,
  SpatialEdge,
  SpatialRelation,
  AlignmentType,
  AlignmentClique,
  SpatialConstraintGraph,
} from "./types";

/* ── Configuration ── */

/** Pixel tolerance for alignment. 10px accommodates hand-drawing imprecision. */
const ALIGNMENT_TOLERANCE = 10;

/** Minimum Gaussian strength to consider two elements aligned. */
const ALIGNMENT_THRESHOLD = 0.5;

/** Minimum group size to form a clique. */
const MIN_CLIQUE_SIZE = 2;

/* ── Main Function ── */

export function buildSpatialGraph(
  components: ClassifiedComponent[],
  _frameWidth: number,
  _frameHeight: number
): SpatialConstraintGraph {
  // Step 1: Create nodes
  const nodes: SpatialNode[] = components.map((c) => ({
    id: c.id,
    role: c.role,
    x: c.relX,
    y: c.relY,
    width: c.width,
    height: c.height,
    centerX: c.centerX,
    centerY: c.centerY,
    component: c,
  }));

  // Step 2: Compute pairwise relationships
  const edges: SpatialEdge[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const relations = computeAllRelations(nodes[i], nodes[j]);
      if (relations.some((r) => r.strength > ALIGNMENT_THRESHOLD)) {
        edges.push({
          sourceId: nodes[i].id,
          targetId: nodes[j].id,
          relations,
        });
      }
    }
  }

  // Step 3: Find alignment cliques
  const topAlignedCliques = findAlignmentCliques(nodes, "top");
  const leftAlignedCliques = findAlignmentCliques(nodes, "left");

  return { nodes, edges, topAlignedCliques, leftAlignedCliques };
}

/* ── Relation Computation ── */

function computeAllRelations(
  a: SpatialNode,
  b: SpatialNode
): SpatialRelation[] {
  const relations: SpatialRelation[] = [];

  // 6 alignment axes
  const axes: AlignmentType[] = [
    "top", "bottom", "left", "right", "center-x", "center-y",
  ];
  for (const type of axes) {
    const delta = getAlignmentDelta(a, b, type);
    relations.push({ type, strength: gaussian(delta, ALIGNMENT_TOLERANCE), rawValue: delta });
  }

  // Size similarity
  const wRatio = Math.min(a.width, b.width) / Math.max(a.width, b.width);
  relations.push({
    type: "same-width",
    strength: wRatio > 0.7 ? wRatio : 0,
    rawValue: wRatio,
  });

  const hRatio = Math.min(a.height, b.height) / Math.max(a.height, b.height);
  relations.push({
    type: "same-height",
    strength: hRatio > 0.7 ? hRatio : 0,
    rawValue: hRatio,
  });

  // Horizontal gap
  const aRight = a.x + a.width;
  const bRight = b.x + b.width;
  if (aRight <= b.x || bRight <= a.x) {
    const left = a.x < b.x ? a : b;
    const right = a.x < b.x ? b : a;
    const hGap = right.x - (left.x + left.width);
    relations.push({ type: "h-gap", strength: 1, rawValue: Math.max(0, hGap) });
  }

  // Vertical gap
  const aBottom = a.y + a.height;
  const bBottom = b.y + b.height;
  if (aBottom <= b.y || bBottom <= a.y) {
    const top = a.y < b.y ? a : b;
    const bottom = a.y < b.y ? b : a;
    const vGap = bottom.y - (top.y + top.height);
    relations.push({ type: "v-gap", strength: 1, rawValue: Math.max(0, vGap) });
  }

  return relations;
}

function getAlignmentDelta(
  a: SpatialNode,
  b: SpatialNode,
  type: AlignmentType
): number {
  switch (type) {
    case "top":      return Math.abs(a.y - b.y);
    case "bottom":   return Math.abs((a.y + a.height) - (b.y + b.height));
    case "left":     return Math.abs(a.x - b.x);
    case "right":    return Math.abs((a.x + a.width) - (b.x + b.width));
    case "center-x": return Math.abs(a.centerX - b.centerX);
    case "center-y": return Math.abs(a.centerY - b.centerY);
  }
}

/**
 * Gaussian decay: 1.0 at delta=0, ~0.88 at 5px, ~0.14 at 20px.
 * Gracefully handles hand-drawing imprecision.
 */
function gaussian(delta: number, tolerance: number): number {
  return Math.exp(-(delta * delta) / (2 * tolerance * tolerance));
}

/* ── Clique Detection ── */

function findAlignmentCliques(
  nodes: SpatialNode[],
  type: "top" | "left"
): AlignmentClique[] {
  if (nodes.length < MIN_CLIQUE_SIZE) return [];

  const sorted = [...nodes].sort((a, b) =>
    type === "top" ? a.y - b.y : a.x - b.x
  );

  const cliques: AlignmentClique[] = [];
  let group: SpatialNode[] = [sorted[0]];
  let refValue = type === "top" ? sorted[0].y : sorted[0].x;

  for (let i = 1; i < sorted.length; i++) {
    const value = type === "top" ? sorted[i].y : sorted[i].x;
    const strength = gaussian(Math.abs(value - refValue), ALIGNMENT_TOLERANCE);

    if (strength >= ALIGNMENT_THRESHOLD) {
      group.push(sorted[i]);
    } else {
      if (group.length >= MIN_CLIQUE_SIZE) {
        cliques.push(buildClique(group, type));
      }
      group = [sorted[i]];
      refValue = value;
    }
  }

  if (group.length >= MIN_CLIQUE_SIZE) {
    cliques.push(buildClique(group, type));
  }

  return cliques;
}

function buildClique(
  nodes: SpatialNode[],
  type: "top" | "left"
): AlignmentClique {
  const values = nodes.map((n) => (type === "top" ? n.y : n.x));
  const avg = values.reduce((s, v) => s + v, 0) / values.length;

  let totalStr = 0;
  let pairs = 0;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      totalStr += gaussian(Math.abs(values[i] - values[j]), ALIGNMENT_TOLERANCE);
      pairs++;
    }
  }

  return {
    type: type === "top" ? "top" : "left",
    memberIds: nodes.map((n) => n.id),
    avgStrength: pairs > 0 ? totalStr / pairs : 1,
    referenceValue: avg,
  };
}