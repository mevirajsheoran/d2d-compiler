# Design Engine Pipeline — Code Statistics

Generated: March 2026

## Overview

| Metric | Count |
|--------|-------|
| **Total Files** | 31 |
| **Total Lines of Code** | 13,056 |
| **Source Files** | 20 |
| **Test Files** | 11 |

---

## Source Files (20 files — 11,049 lines)

| File | Lines | Description |
|------|-------|-------------|
| `design-identity.ts` | 2,726 | Design system presets (colors, typography, spacing, components) |
| `component-library.ts` | 2,216 | React component renderers for all UI elements |
| `builder.ts` | 1,756 | Main code generator — assembles sections into pages |
| `section-engine.ts` | 1,178 | Section-level renderers (hero, features, footer, etc.) |
| `industry-content.ts` | 1,090 | Content banks for different industries |
| `content-inferrer.ts` | 640 | Smart placeholder content inference |
| `types.ts` | 643 | TypeScript type definitions |
| `enhancer.ts` | 542 | UI enhancement and refinement |
| `architect.ts` | 331 | Hierarchy builder — creates tree from classified components |
| `classifier.ts` | 263 | Shape classifier — assigns UI roles to shapes |
| `color-utils.ts` | 276 | Color manipulation utilities |
| `icon-registry.ts` | 256 | SVG icon definitions |
| `index.ts` | 227 | Main pipeline orchestrator (v5.0) |
| `page-recipes.ts` | 242 | Page type recipes (landing, dashboard, etc.) |
| `variation-generator.ts` | 200 | Generates multiple design variations |
| `grid-detector.ts` | 217 | CSS Grid layout detection |
| `spatial-graph.ts` | 216 | Spatial constraint graph for layouts |
| `stylist.ts` | 157 | Style application (simplified) |
| `recipe-merger.ts` | 176 | Merges wireframe with recipe defaults |
| `extractor.ts` | 174 | Phase 1 — extracts shapes from frame |

---

## Test Files (11 files — 2,007 lines)

| File | Lines | Description |
|------|-------|-------------|
| `__tests__/integration.test.ts` | 108 | End-to-end pipeline tests |
| `__tests__/fixtures/style-guides.ts` | 179 | Mock style guides for testing |
| `__tests__/fixtures/shapes.ts` | 168 | Mock shape data for tests |
| `__tests__/recipe-merger.test.ts` | 68 | Recipe merger unit tests |
| `__tests__/page-recipes.test.ts` | 63 | Page recipe tests |
| `__tests__/architect.test.ts` | 53 | Hierarchy builder tests |
| `__tests__/determinism.test.ts` | 50 | Deterministic output tests |
| `__tests__/classifier.test.ts` | 46 | Shape classifier tests |
| `__tests__/extractor.test.ts` | 42 | Shape extractor tests |
| `__tests__/grid-detector.test.ts` | 1 | (empty placeholder) |
| `__tests__/spatial-graph.test.ts` | 1 | (empty placeholder) |

---

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Phase 1: Extractor  (extractor.ts — 174 lines)        │
│  → Extract shapes from frame, calculate positions         │
├─────────────────────────────────────────────────────────┤
│  Phase 2: Classifier (classifier.ts — 263 lines)         │
│  → Assign UI roles (button, heading, input, etc.)        │
├─────────────────────────────────────────────────────────┤
│  Phase 3: Architect  (architect.ts — 331 lines)         │
│  → Build hierarchy tree, detect layouts                  │
├─────────────────────────────────────────────────────────┤
│  Phase 4: Grid Detector (grid-detector.ts — 217 lines)   │
│  → Detect CSS Grid patterns                              │
├─────────────────────────────────────────────────────────┤
│  Phase 5: Section Engine (section-engine.ts — 1178 lines)│
│  → Detect page sections (nav, hero, features, footer)     │
├─────────────────────────────────────────────────────────┤
│  Phase 6: Builder      (builder.ts — 1756 lines)           │
│  → Generate production React/Tailwind code               │
└─────────────────────────────────────────────────────────┘
```

---

## Largest Files by Line Count

1. `design-identity.ts` — 2,726 lines (design system)
2. `component-library.ts` — 2,216 lines (UI components)
3. `builder.ts` — 1,756 lines (code generator)
4. `section-engine.ts` — 1,178 lines (section renderers)
5. `industry-content.ts` — 1,090 lines (content banks)

---

*Statistics auto-generated from src/lib/design-engine-pipeline/*
