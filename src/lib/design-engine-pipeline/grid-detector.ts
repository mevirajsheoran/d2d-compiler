// src/lib/design-engine-pipeline/grid-detector.ts

/* ══════════════════════════════════════════════════════════════════════════════
   GRID DETECTOR

   Takes the spatial constraint graph and detects CSS Grid layouts.

   Algorithm:
   1. Get row cliques (top-aligned groups) from the graph
   2. Filter to rows with compatible element types and similar sizes
   3. Try combining rows into grids (check column alignment + gap consistency)
   4. Return detected grids

   Complexity: O(k² × N) where k = row cliques, N = max row size. Negligible.
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  SpatialConstraintGraph,
  SpatialNode,
  AlignmentClique,
  DetectedGrid,
  UIRole,
} from "./types";

/* ── Configuration ── */

const MIN_GRID_ROWS = 2;
const MIN_GRID_COLS = 2;

/** Max X deviation between column-aligned elements (px) */
const COLUMN_ALIGNMENT_TOLERANCE = 20;

/** Max coefficient of variation for gap consistency */
const GAP_CV_THRESHOLD = 0.35;

/** Max coefficient of variation for element widths */
const WIDTH_CV_THRESHOLD = 0.30;

/** Roles that can form a grid together */
const GRID_ROLES: Set<UIRole> = new Set([
  "card", "container", "image", "video", "chart",
]);

/* ── Main Function ── */

export function detectGrids(graph: SpatialConstraintGraph): DetectedGrid[] {
  const { topAlignedCliques } = graph;
  if (topAlignedCliques.length < MIN_GRID_ROWS) return [];

  // Filter to candidate rows
  const candidateRows = topAlignedCliques.filter((clique) => {
    if (clique.memberIds.length < MIN_GRID_COLS) return false;
    const members = getMembers(clique, graph.nodes);
    if (!areRolesGridCompatible(members)) return false;
    if (!areWidthsConsistent(members)) return false;
    return true;
  });

  if (candidateRows.length < MIN_GRID_ROWS) return [];

  // Sort by Y position
  candidateRows.sort((a, b) => a.referenceValue - b.referenceValue);

  // Try to form grids from compatible consecutive rows
  const grids: DetectedGrid[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < candidateRows.length; i++) {
    if (usedIndices.has(i)) continue;

    const gridRows: AlignmentClique[] = [candidateRows[i]];

    for (let j = i + 1; j < candidateRows.length; j++) {
      if (usedIndices.has(j)) continue;
      if (isRowCompatible(candidateRows[j], gridRows, graph.nodes)) {
        gridRows.push(candidateRows[j]);
      }
    }

    if (gridRows.length >= MIN_GRID_ROWS) {
      const grid = buildGrid(gridRows, graph.nodes);
      if (grid) {
        grids.push(grid);
        for (const row of gridRows) {
          const idx = candidateRows.indexOf(row);
          if (idx >= 0) usedIndices.add(idx);
        }
      }
    }
  }

  return grids;
}

/* ── Grid Validation ── */

function isRowCompatible(
  candidate: AlignmentClique,
  existing: AlignmentClique[],
  allNodes: SpatialNode[]
): boolean {
  const first = existing[0];

  // Same column count
  if (candidate.memberIds.length !== first.memberIds.length) return false;

  // Column alignment check
  const candMembers = getMembers(candidate, allNodes).sort((a, b) => a.x - b.x);
  const firstMembers = getMembers(first, allNodes).sort((a, b) => a.x - b.x);

  for (let col = 0; col < candMembers.length; col++) {
    if (Math.abs(candMembers[col].x - firstMembers[col].x) > COLUMN_ALIGNMENT_TOLERANCE) {
      return false;
    }
  }

  // Width consistency across all rows
  const allWidths = [
    ...existing.flatMap((r) => getMembers(r, allNodes).map((m) => m.width)),
    ...candMembers.map((m) => m.width),
  ];
  if (cv(allWidths) > WIDTH_CV_THRESHOLD) return false;

  return true;
}

function buildGrid(
  rows: AlignmentClique[],
  allNodes: SpatialNode[]
): DetectedGrid | null {
  const M = rows.length;
  const N = rows[0].memberIds.length;

  const sortedRows = rows.map((row) =>
    getMembers(row, allNodes).sort((a, b) => a.x - b.x)
  );

  // Row gap consistency
  const rowGaps: number[] = [];
  for (let i = 1; i < M; i++) {
    const prevBottom = Math.max(...sortedRows[i - 1].map((n) => n.y + n.height));
    const currTop = Math.min(...sortedRows[i].map((n) => n.y));
    rowGaps.push(Math.max(0, currTop - prevBottom));
  }
  if (rowGaps.length > 1 && cv(rowGaps) > GAP_CV_THRESHOLD) return null;

  // Column gap consistency
  const colGaps: number[] = [];
  for (const row of sortedRows) {
    for (let j = 1; j < row.length; j++) {
      colGaps.push(Math.max(0, row[j].x - (row[j - 1].x + row[j - 1].width)));
    }
  }
  if (colGaps.length > 1 && cv(colGaps) > GAP_CV_THRESHOLD) return null;

  // Build assignment matrix
  const assignment = sortedRows.map((row) => row.map((n) => n.id));
  const memberIds = sortedRows.flatMap((row) => row.map((n) => n.id));

  // Confidence
  const avgStrength = rows.reduce((s, r) => s + r.avgStrength, 0) / rows.length;
  const gapScore =
    1 -
    ((rowGaps.length > 1 ? cv(rowGaps) : 0) +
      (colGaps.length > 1 ? cv(colGaps) : 0)) /
      2;
  const confidence = avgStrength * 0.6 + gapScore * 0.4;

  return {
    rows: M,
    cols: N,
    rowGap: snapTw(median(rowGaps)),
    colGap: snapTw(median(colGaps)),
    assignment,
    memberIds,
    confidence,
  };
}

/* ── Helpers ── */

function getMembers(clique: AlignmentClique, allNodes: SpatialNode[]): SpatialNode[] {
  return clique.memberIds
    .map((id) => allNodes.find((n) => n.id === id))
    .filter((n): n is SpatialNode => n !== undefined);
}

function areRolesGridCompatible(nodes: SpatialNode[]): boolean {
  return nodes.some((n) => GRID_ROLES.has(n.role));
}

function areWidthsConsistent(nodes: SpatialNode[]): boolean {
  return cv(nodes.map((n) => n.width)) <= WIDTH_CV_THRESHOLD;
}

/** Coefficient of variation */
function cv(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  if (mean === 0) return 0;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance) / mean;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

function snapTw(px: number): number {
  const scale = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64];
  return scale.reduce((prev, curr) =>
    Math.abs(curr - px) < Math.abs(prev - px) ? curr : prev
  );
}