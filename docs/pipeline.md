# D2D Deterministic Pipeline — Complete Technical Documentation v5.0

_The Complete Data Flow: From Sketch to Production React Code_

## Table of Contents

Executive Summary
Pipeline Overview & Architecture
What Changed: v3.0 → v4.0 → v5.0
File Manifest & Roles
Phase-by-Phase Deep Dive
Phase 1: Extractor
Phase 2: Classifier
Phase 2.5: Spatial Graph (v4.0)
Phase 2.75: Grid Detector (v4.0)
Phase 3: Architect
Phase 3.5: Enhancer
Phase 4: Design Identity
Phase 5: Section Engine
Phase 6: Builder
v5.0 Recipe System (Complete)
Page Recipes
Recipe Merger
Recipe Content (Industry Data)
Recipe Templates (Component Library)
Merged Code Generation
Supporting Modules
Content Inferrer
Icon Registry
Color Utilities
Industry Content
Preview Builder
Variation Layer
Dual Pipeline Architecture
Type System & Data Contracts
End-to-End Walkthrough (v5.0 Recipe Mode)
End-to-End Walkthrough (Legacy Wireframe Mode)
Test Suite Architecture

## 1. Executive Summary

The D2D pipeline transforms hand-drawn wireframe shapes into production-ready React + Tailwind CSS components through a deterministic, multi-phase compilation process running entirely in the browser.

v5.0 introduces a dual-pipeline architecture: a new Recipe-based pipeline runs alongside the legacy wireframe-only pipeline. When the user specifies a page type (landing, SaaS, blog, etc.) and/or industry (tech, restaurant, medical, etc.), the recipe system generates a complete page skeleton with professional sections, then merges any wireframe-drawn sections on top — giving users the best of both worlds: professional defaults with wireframe customization.

```

INPUT:  Frame (artboard) + Shapes (drawn by user) + StyleGuide (colors, fonts, brief)
OUTPUT: React component string (100-700 lines, 25-40 Tailwind classes per element)

Time:   < 300ms
Cost:   ₹0 (zero AI API calls)
Guarantee: Same input → Same output, every time
v5.0 key capabilities:

Capability	v3.0	v4.0	v5.0
Wireframe → Code	✅	✅	✅
CSS Grid detection	❌	✅	✅
Spatial constraint graph	❌	✅	✅
Page recipe templates	❌	❌	✅ (8 page types)
Industry-aware content	partial	partial	✅ (10 industries × rich content)
Recipe + Wireframe merge	❌	❌	✅
14 recipe section renderers	❌	❌	✅
Extended section types	12	12	28+
Test suite	❌	❌	✅ (55+ tests)
Extended gap scale	❌	✅	✅
Frame ratio awareness	❌	✅	✅
The pipeline works like a compiler for UI wireframes:

```

Shapes (raw geometry)
→ Semantic roles (button, input, heading)
→ Spatial graph (alignment cliques, gap analysis)
→ CSS Grid detection (row×col patterns)
→ Hierarchy tree (parent-child nesting + grid injection)
→ Enhanced patterns (form, card grid, hero)
→ Design system (colors, typography, spacing classes)
→ Page sections (nav, hero, features, footer)
↓ ↓
[WIREFRAME SECTIONS] [PAGE RECIPE]
↓ ↓
└──────── MERGE ────────────────────┘
↓
Production React + Tailwind code

## 2. Pipeline Overview & Architecture

#### Architecture Diagram

```

┌──────────────────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATOR (index.ts)                               │
│                                                                              │
│  generateFromFrame(frame, allShapes, styleGuide)                            │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  Decision: useRecipeMode = hasPageType || hasIndustry               │    │
│  │                                                                      │    │
│  │  YES → runRecipePipeline()      NO → runLegacyPipeline()           │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  GEOMETRY PIPELINE (shape → tree) — shared by both paths            │    │
│  │                                                                      │    │
│  │  Phase 1      Phase 2       Phase 2.5      Phase 2.75              │    │
│  │  EXTRACTOR  → CLASSIFIER → SPATIAL      → GRID                    │    │
│  │  shapes in    semantic      GRAPH          DETECTOR                │    │
│  │  frame        roles         pairwise       CSS Grid                │    │
│  │                             alignment      patterns                │    │
│  │                                                                      │    │
│  │  Phase 3         Phase 3.5                                          │    │
│  │  ARCHITECT     → ENHANCER                                          │    │
│  │  hierarchy +     13 pattern                                        │    │
│  │  grid inject     rules                                             │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  STYLING PIPELINE (config → design system)                           │    │
│  │                                                                      │    │
│  │  Phase 4                                                             │    │
│  │  DESIGN IDENTITY                                                    │    │
│  │  StyleGuide + brief → 100+ token DesignIdentity object             │    │
│  │  Uses: color-utils, industry-content                               │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  LEGACY PATH (wireframe-only)                                        │    │
│  │                                                                      │    │
│  │  Phase 5        Phase 6                                              │    │
│  │  SECTION      → BUILDER.generateCode()                             │    │
│  │  ENGINE         tree + identity + sections → code                  │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐    │
│  │  v5.0 RECIPE PATH                                                    │    │
│  │                                                                      │    │
│  │  PAGE RECIPES → RECIPE MERGER → BUILDER.generateMergedCode()       │    │
│  │  getPageRecipe()  merge(recipe,    merged sections + identity      │    │
│  │  (page type +     wireframe        + brief → code                  │    │
│  │   industry)       sections)        Uses: renderRecipeXxx()         │    │
│  │                                          renderWireframeSection()  │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Output: string (React + Tailwind component)                                │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                     VARIATION LAYER (variation-generator.ts)                  │
│                                                                              │
│  Runs the ENTIRE pipeline 3× with different presets                         │
│  Contrast mapping ensures maximum visual variety                            │
│  Brief flows through to recipe pipeline (v5.0 update)                       │
│  Output: 3 Variation objects (presetName + code)                            │
└──────────────────────────────────────────────────────────────────────────────┘
#### Data Type Flow
```

Shape[] (raw canvas shapes)
│ Phase 1
▼
ExtractedShape[] (frame-relative, bounded)
│ Phase 2
▼
ClassifiedComponent[] (semantic UI role assigned)
│ Phase 2.5
├──────────────────────────▶ SpatialConstraintGraph
│ Phase 2.75 │ (alignment cliques)
│ ▼
│ DetectedGrid[]
│ Phase 3 │ (CSS Grid patterns)
▼ │
UINode │
│ (buildHierarchy) │
│◄──────────────────────────────┘ (injectGridContainers)
│ Phase 3.5
▼
UINode (enhanced with pattern hints)
│
│ Phase 5
▼
DetectedSection[] (page sections with slots)
│
│ StyleGuide ──── Phase 4 ────▶ DesignIdentity
│ │
│ │
▼ ▼
┌─── LEGACY ──────────────────────────────────────────────┐
│ Phase 6: generateCode(tree, identity, sections) → code │
└─────────────────────────────────────────────────────────┘

┌─── v5.0 RECIPE ─────────────────────────────────────────┐
│ getPageRecipe(pageType, industry) → SectionRecipe[] │
│ │ │
│ ▼ │
│ mergeRecipeWithWireframe(recipe, wireframeSections) │
│ │ │
│ ▼ │
│ MergedSection[] │
│ │ │
│ ▼ │
│ generateMergedCode(merged, identity, brief) → code │
└─────────────────────────────────────────────────────────┘ 3. What Changed: v3.0 → v4.0 → v5.0

#### v4.0 Changes (retained in v5.0)

Area Change Why
Spatial Graph (new file) O(n²) pairwise relationship computation with Gaussian decay alignment scoring Enables CSS Grid detection from imprecise hand-drawn layouts
Grid Detector (new file) Finds row-aligned cliques → validates column alignment → builds DetectedGrid Converts 2D card layouts into proper CSS Grid instead of flexbox
Architect injectGridContainers() post-processing step Groups grid member nodes into a single grid container UINode
Architect Extended gap snap scale: added 80, 96, 128, 160, 192, 256px Tall frames preserve intentional blank space instead of capping at 64px
Architect Root node stores frameWidth, frameHeight, frameRatio in properties Downstream phases can scale spacing for tall/narrow frames
Builder spacingFactor calculation from frame ratio Sections get proportionally taller padding on tall frames (ratio > 1.8)
Builder renderGridFeaturesSection() for CSS Grid-based features Grid-detected feature sections render as grid instead of flex
Section Engine Hero detector checks headings inside containers Handles user drawing text inside rectangles
Section Engine Grid container detection in features detector Grid nodes get priority feature section treatment
Enhancer Rule 3 handles isGrid property on detected grid containers Adds css-grid-RxC hints for grid containers

#### v5.0 Changes (new in this version)

Area Change Why
types.ts Added RecipeSectionType (28+ section types), SectionRecipe, PageRecipe, MergedSection, RecipeContent interfaces Foundation types for the recipe system
page-recipes.ts (new) 8 page type recipes + 10 industry overrides + getPageRecipe() Knowledge layer: what sections each page type needs
recipe-merger.ts (new) mergeRecipeWithWireframe() with type matching + order inference Core merge logic: wireframe overrides recipe where drawn
industry-content.ts Extended with RecipeContent per industry (stats, testimonials, badges, newsletter, logo cloud) Rich content for recipe section renderers
component-library.ts 14 new renderRecipeXxx() functions Template renderers for recipe-only sections
builder.ts generateMergedCode() + renderSectionFromRecipe() dispatcher Assembles merged sections into final code
index.ts Dual pipeline: runRecipePipeline() vs runLegacyPipeline() Backward compatible — no pageType → old behavior
section-engine.ts Nav detector consumes adjacent dividers below nav Prevents divider leaking to generic section
component-library.ts Removed all style={{ width: }} / style={{ height: }} All dimensions now use responsive Tailwind classes
variation-generator.ts Brief flows through to recipe pipeline Variations work correctly in recipe mode

## 4. File Manifest & Roles

File Phase Role Input → Output
index.ts Orchestrator Entry point. Decides recipe vs legacy mode, calls all phases, logs results (frame, shapes, styleGuide) → code string
extractor.ts Phase 1 Extracts shapes inside frame, normalizes coordinates (frame, allShapes) → ExtractedShape[]
classifier.ts Phase 2 Assigns semantic UI role to each shape ExtractedShape[] → ClassifiedComponent[]
spatial-graph.ts Phase 2.5 Builds pairwise spatial relationship graph (ClassifiedComponent[], fw, fh) → SpatialConstraintGraph
grid-detector.ts Phase 2.75 Detects CSS Grid layouts from alignment cliques SpatialConstraintGraph → DetectedGrid[]
architect.ts Phase 3 Builds parent-child hierarchy, detects layout, injects grid containers (ClassifiedComponent[], fw, fh) → UINode tree
enhancer.ts Phase 3.5 Applies 13 pattern-detection rules UINode → UINode (with hints)
design-identity.ts Phase 4 Builds complete design system (100+ tokens) from StyleGuide StyleGuide → DesignIdentity
section-engine.ts Phase 5 Detects page sections and assigns slots (UINode, fw, fh) → DetectedSection[]
builder.ts Phase 6 Assembles final React + Tailwind code (tree, identity, sections) → code or (merged, identity, brief) → code
page-recipes.ts v5.0 Recipe Page type recipe definitions + industry overrides (pageType, industry) → SectionRecipe[]
recipe-merger.ts v5.0 Merge Merges recipe with wireframe-detected sections (recipe, wireframeSections) → MergedSection[]
component-library.ts Phase 6 helper JSX template functions (primitives + composites + 14 recipe renderers) (identity, props) → JSX string
content-inferrer.ts Phase 6 helper Fills blank shapes with contextually appropriate text/icons (slot, sectionType, identity) → InferredContent
icon-registry.ts Phase 6 helper 40 inline SVG icons + inference functions iconName → SVG string
color-utils.ts Phase 4 helper Color math: hex↔RGB↔HSL, palette generation, Tailwind helpers hex → ColorPalette
industry-content.ts Phase 4+6 helper 10 industry content banks + 60 suggestion mappings + recipe content (industry, tone) → Suggestions + RecipeContent
types.ts All phases TypeScript interfaces: UINode, DesignIdentity, MergedSection, etc. Type definitions
variation-generator.ts Variation layer Runs pipeline 3× with contrasting presets (frame, shapes, styleGuide) → Variation[]
preview-builder.tsx UI layer Converts React+Tailwind JSX into standalone HTML for iframe preview code → HTML string
stylist.ts Legacy v2.0 stylist (superseded by design-identity.ts) —

## 5. Phase-by-Phase Deep Dive

### Phase 1: EXTRACTOR

File: extractor.ts
Purpose: Find all shapes inside the target frame and normalize their coordinates.

Why this phase exists: The canvas contains potentially hundreds of shapes across multiple frames. The extractor isolates only the shapes relevant to the target frame and transforms their absolute canvas coordinates into frame-relative coordinates (origin at frame's top-left corner).

#### Algorithm

```

For each shape on canvas:
## 1. Skip the frame itself, other frames, and generatedui shapes
    2. Calculate bounding box (getShapeBounds)
    3. Check if shape overlaps frame by ≥50% of its area (isInsideFrame)
    4. Skip shapes with near-zero dimensions (w<2 && h<2)
## 5. Normalize: relX = shape.x - frame.x, relY = shape.y - frame.y
    6. Sort: top-to-bottom, then left-to-right (10px row tolerance)
#### Bounding Box Strategies (getShapeBounds)
The function handles every shape type the canvas supports:

Shape Category	Examples	How Bounds Are Calculated
Bounded (has x, y, w, h)	rect, ellipse, buttonShape, inputField, checkbox, imagePlaceholder, videoPlaceholder, chartPlaceholder, divider, stickyNote, deviceFrame	Direct property read
Line-like (has startX/Y, endX/Y)	arrow, line, connector	min/max of endpoints, minimum 1px dimension
Freehand (has points[])	freedraw, highlighter	min/max across all points, minimum 1px dimension
Text (has x, y but no w/h)	text	Estimated: width = max(100, chars × fontSize × 0.55), height = fontSize × lineHeight × lines
Excluded	frame, generatedui	Returns null (skipped)
#### Overlap Test (isInsideFrame)
Not a simple center-point check. Calculates the intersection rectangle between shape and frame:

```

intersectionArea = (intersectX2 - intersectX1) × (intersectY2 - intersectY1)
shapeArea = shape.width × shape.height
overlapRatio = intersectionArea / shapeArea

Shape is "inside" if overlapRatio ≥ 0.50
This correctly handles shapes that straddle the frame border — a shape that's 80% inside but whose center is technically outside still gets captured.

#### Output

```typescript

ExtractedShape {
    originalShape: Shape       // Reference to full shape data
    relX: number              // X position relative to frame (0,0)
    relY: number              // Y position relative to frame
    width: number             // Bounding width
    height: number            // Bounding height
    centerX: number           // Center X relative to frame
    centerY: number           // Center Y relative to frame
}
Sorted top-to-bottom, left-to-right, ready for classification.

### Phase 2: CLASSIFIER
File: classifier.ts
Purpose: Assign a semantic UI role to each extracted shape.

Why this phase exists: The extractor gives us geometry (rectangles, circles, lines). The classifier answers: "What does this shape mean in UI terms?" A 200×40px rectangle could be an input field, a button, or just a container — the classifier decides.

#### Three Classification Strategies
#### Strategy 1: Direct Mapping — The shape type explicitly declares its UI intent.

```

buttonShape → "button" (with text, variant from shape)
inputField → "input" (with placeholder, label from shape)
checkbox → "checkbox" (with label, checked state)
hamburgerMenu → "nav"
imagePlaceholder → "image"
videoPlaceholder → "video"
chartPlaceholder → "chart" (with chartType)
divider → "divider" (with direction)
deviceFrame → "device-wrapper" (with device type)
text → classifyText() → "heading" (levels 1-4) or "paragraph"

#### Text Sub-Classification:

```

fontSize ≥ 32 AND fontWeight ≥ 600  →  heading level 1
fontSize ≥ 24 AND fontWeight ≥ 600  →  heading level 2
fontSize ≥ 20 AND fontWeight ≥ 500  →  heading level 3
fontSize ≥ 18 AND fontWeight ≥ 500  →  heading level 4
Otherwise                           →  paragraph
Text shapes carry rich metadata: fontSize, fontWeight, fontFamily, textAlign, fontStyle, textDecoration, textTransform, lineHeight, letterSpacing.

#### Strategy 2: Heuristic Mapping — Infer role from geometry when the shape type is generic.

For rect:

```

Width > 150 AND Height 30-60 → "input" (wide + short = text field)
Width ≤ 200 AND Height 25-60 → "button" (small + short = clickable)
Everything else → "container"
For roundedRect:

```

Width ≤ 200 AND Height ≤ 60    →  "button" (primary variant)
Everything else                →  "card"
For ellipse / circle:

```

Width/Height < 60 → "avatar"
Otherwise → "decorative"
Other: line → "divider", triangle/star/polygon → "decorative"

#### Strategy 3: Annotation Exclusion — Design notes are dropped entirely.

````

stickyNote, speechBubble, arrow, connector, freedraw, highlighter
→ role = "annotation" → SKIPPED (not included in output)
#### Output
```typescript

ClassifiedComponent {
    id: string                    // Shape ID
    role: UIRole                  // "button" | "input" | "heading" | "card" | ...
    relX, relY, width, height    // From extractor
    centerX, centerY             // From extractor
    text?: string                // For text shapes and buttons
    properties: Record<string, unknown>  // Role-specific metadata
    originalShape: Shape         // Full shape reference
}
### Phase 2.5: SPATIAL GRAPH (v4.0)
File: spatial-graph.ts
Purpose: Build a graph of pairwise spatial relationships between classified components to enable CSS Grid detection.

Why this phase exists (v4.0 addition): The architect's containment-based tree works for nested layouts but cannot detect CSS Grid patterns — a 2×3 grid of cards that are all siblings at the same level. The spatial graph measures alignment, spacing, and size similarity between every pair of elements, then groups them into alignment cliques that feed into grid detection.

#### Algorithm
````

Step 1: Create SpatialNode[] from ClassifiedComponent[]
Each node stores: id, role, x, y, width, height, centerX, centerY

Step 2: O(n²) pairwise relationship computation
For each pair (i, j) where j > i:
Compute 10 SpatialRelation measurements: - 6 alignment axes: top, bottom, left, right, center-x, center-y - 2 size similarity: same-width, same-height - 1 horizontal gap (if horizontally separated) - 1 vertical gap (if vertically separated)
If any relation has strength > 0.5 → create edge

Step 3: Find alignment cliques - Top-aligned cliques (nodes sharing similar Y) - Left-aligned cliques (nodes sharing similar X)

#### Alignment Strength via Gaussian Decay

```

strength = exp(-(delta² / (2 × tolerance²)))

Where:
    delta = pixel distance between alignment values
    tolerance = 10px (accommodates hand-drawing imprecision)

Results:
    0px delta → strength 1.0  (perfect alignment)
    5px delta → strength ~0.88 (close enough)
    10px delta → strength ~0.61 (borderline)
    20px delta → strength ~0.14 (not aligned)

Threshold: strength ≥ 0.5 to count as "aligned"
This Gaussian decay is crucial for hand-drawn wireframes where elements are never pixel-perfect.

#### Clique Detection
```

1. Sort nodes by alignment axis value (Y for top-aligned, X for left-aligned)

## 2. Sweep through sorted list:

    - If next node is within Gaussian tolerance of group reference → add to group
    - Otherwise → finalize current group, start new

## 3. Groups with ≥ 2 members become AlignmentClique objects

## 4. Each clique stores: type, memberIds[], avgStrength, referenceValue

#### Output

```typescript

SpatialConstraintGraph {
    nodes: SpatialNode[]                    // All classified components as graph nodes
    edges: SpatialEdge[]                    // Pairwise relationships (filtered to strong ones)
    topAlignedCliques: AlignmentClique[]    // Groups sharing top alignment
    leftAlignedCliques: AlignmentClique[]   // Groups sharing left alignment
}
Complexity: O(n²) pairwise + O(n log n) clique detection. For 30 elements: < 1ms.

### Phase 2.75: GRID DETECTOR (v4.0)
File: grid-detector.ts
Purpose: Take alignment cliques from the spatial graph and detect CSS Grid layouts.

Why this phase exists (v4.0 addition): When a user draws 6 cards in a 2×3 arrangement, the architect would create them as 6 siblings in a column. The grid detector recognizes the 2D grid pattern and produces a DetectedGrid object that the architect uses to inject a proper grid container.

#### Algorithm
```

1. Get top-aligned cliques (row candidates) from spatial graph

## 2. Filter to candidate rows:

    - ≥ 2 members (MIN_GRID_COLS)
    - Members have grid-compatible roles (card, container, image, video, chart)
    - Member widths are consistent (CV ≤ 0.30)

## 3. Sort candidate rows by Y position

## 4. Try combining consecutive rows into grids:

    a. Same column count
    b. Column alignment check (each column X within ±20px of first row)
    c. Width consistency across all rows (CV ≤ 0.30)

## 5. Validate grid:

    a. Row gap consistency (CV ≤ 0.35)
    b. Column gap consistency (CV ≤ 0.35)

## 6. Build DetectedGrid with:

    - rows, cols, rowGap, colGap (snapped to Tailwind scale)
    - assignment matrix (row-major order)
    - memberIds
    - confidence score (alignment strength × 0.6 + gap consistency × 0.4)

#### Coefficient of Variation (CV)

Used throughout for consistency checks:

````

CV = standardDeviation / mean

CV = 0     → all values identical (perfect grid)
CV = 0.15  → ~15% variation (acceptable for hand-drawing)
CV = 0.30  → threshold for width consistency
CV = 0.35  → threshold for gap consistency
CV > 0.35  → too inconsistent to be a grid
#### Grid-Compatible Roles
Only certain roles can form grid cells:

```typescript

const GRID_ROLES: Set<UIRole> = new Set([
    "card", "container", "image", "video", "chart"
]);
Headings, buttons, inputs etc. are filtered out — they don't form 2D grid patterns.

#### Output
```typescript

DetectedGrid {
    rows: number               // e.g., 2
    cols: number               // e.g., 3
    rowGap: number             // Snapped to Tailwind scale (e.g., 24)
    colGap: number             // Snapped to Tailwind scale (e.g., 24)
    assignment: string[][]     // Row-major: assignment[row][col] = elementId
    memberIds: string[]        // All element IDs in the grid
    confidence: number         // 0-1 quality score
}
### Phase 3: ARCHITECT
File: architect.ts
Purpose: Convert the flat list of classified components into a nested hierarchy tree with layout information, then inject grid containers from detected grids.

#### Core Algorithm (unchanged from v3.0)
````

Step 1: FIND PARENT for each component
For each child:
For each candidate parent: - Must be container/card/device-wrapper role - Calculate containmentRatio(parent, child) - Must be ≥ 0.70 (70% of child area inside parent) - Pick SMALLEST qualifying parent (tightest fit)
Result: parentMap<childId → parentId | null>

Step 2: GROUP CHILDREN by parent
childrenOf<parentId → ClassifiedComponent[]>
null key = root-level children (no parent)

Step 3: RECURSIVELY BUILD TREE
For each node:
a. Get direct children
b. detectLayout(children, frameHeight) → "row" or "column"
c. Sort children by position (X for row, Y for column)
d. calculateGaps(sorted, direction) → per-pair spacing array
e. Recurse into each child

Step 4: BUILD ROOT NODE
Root stores frameWidth, frameHeight, frameRatio in properties

#### Layout Detection (adaptive threshold)

```

threshold = min(5% of frameHeight, 50% of averageChildHeight)

For each consecutive pair:
    If |childA.relY - childB.relY| < threshold → "same row"

If > 50% of pairs are "same row" → layout = "row"
Else → layout = "column"
#### v4.0: Extended Gap Scale
```

v3.0 scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
v4.0 scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256]
Tall frames (like mobile screens with lots of content) can now preserve intentional 100px+ gaps between sections.

#### v4.0: Grid Container Injection (injectGridContainers)

After the tree is built normally, this post-processing step:

````

For each DetectedGrid:
## 1. Recursively find the parent node whose direct children contain ALL grid members
## 2. Extract those children from the parent
## 3. Create a new UINode with:
      - id: "grid-{rows}x{cols}-{y}"
      - role: "container"
      - properties: { isGrid: true, gridRows, gridCols, gridRowGap, gridColGap, gridAssignment }
      - children: grid members in row-major order (preserving each member's internal children)
## 4. Replace the extracted children with the single grid container
## 5. Recalculate parent's gaps
This is critical because it preserves the internal structure of each card (heading, text, image inside it) while grouping them into a CSS Grid wrapper.

#### Output
```typescript

UINode {
    id: string                    // "root" or shape ID or "grid-2x3-200"
    role: UIRole                  // Semantic role
    relX, relY, width, height    // Position and size
    text?: string                // Text content
    properties: Record<string, unknown>  // includes frameWidth/Height/Ratio on root, isGrid/gridRows/gridCols on grid containers
    children: UINode[]           // Nested children (recursive)
    layout: "row" | "column"    // How children are arranged
    gaps: number[]              // Spacing between each child pair
    enhancementHints: string[]  // Empty at this stage
}
### Phase 3.5: ENHANCER
File: enhancer.ts
Purpose: Apply 13 pattern-detection rules that upgrade the tree with design intelligence.

Why this phase exists: The architect produces a mechanically accurate tree, but it doesn't understand design patterns. The enhancer recognizes common UI patterns and adds hints that help later phases produce better output.

#### 13 Rules (Applied Sequentially)
#### Structural Rules (modify tree shape/roles):

#	Rule	Pattern	Enhancement
1	Auto-Center Form	Root column with heading + ≥1 input + button, ≤6 items	Adds hint "centered-form"
2	Auto-Cardify	Container with (image + heading/text) or (heading + text + button), 2-5 children	Upgrades role to "card", adds hint "auto-card"
3	Auto-Responsive Grid	Row with 2-4 cards/containers with similar widths (±20%), all children are the similar items. v4.0: Also detects isGrid property and adds css-grid-RxC hint.	Adds hint "responsive-grid-N" or "css-grid-RxC"
4	Auto-Sticky Nav	First child of root has "nav" role	Adds hint "sticky-nav"
5	Auto-Hero	H1 heading + paragraph at root top	Adds hints "hero-heading", "hero-text" on respective nodes
6	Auto-Input Group	≥2 consecutive inputs in column	Adds hint "input-group-member" to each, normalizes gaps to 16px
7	Auto-Footer	Divider + text/container at root bottom	Adds hint "footer"
#### Pattern Detection Rules (add hints for section engine):

#	Rule	Pattern	Enhancement
8	Content Split	Image + text side-by-side in row layout, 2-3 children	Adds hint "content-split"
9	CTA Section	Heading + ≥1 button, ≤4 total children (non-root)	Adds hint "cta-section"
10	Stats Section	≥3 short headings (≤10 chars each) in a row	Adds hint "stats-section"
11	Sidebar	Narrow (<30% width) + tall (>60% height) container at root level in row	Adds hint "sidebar"
12	Feature Icons	Small image/avatar (<80px) + heading in 2-4 child containers	Adds hint "feature-card"
#### Spacing Rules (modify gaps):

#	Rule	Pattern	Enhancement
13	Auto-Section Spacing	Transitions between content types at root level	Sets gap ≥48px at section boundaries (button→heading, divider boundaries, nav→content, image→heading)
#### Rule Application Order
````

1. Structural rules first (1-7) — may change roles (container → card)
   which affects what pattern detection rules see

2. Pattern detection rules next (8-12) — add hints based on current roles

3. Spacing rules last (13) — modifies gaps based on final tree structure
   Rules are additive and safe — they only add to enhancementHints[] arrays or occasionally upgrade a role. They never remove nodes or break the tree structure.

### Phase 4: DESIGN IDENTITY

File: design-identity.ts
Helpers: color-utils.ts, industry-content.ts
Purpose: Build a complete design system (the DesignIdentity object) from the user's StyleGuide configuration.

Why this phase exists: The pipeline needs concrete CSS classes to generate code, but the user only provides abstract preferences (a hex color, a font name, a preset choice). This phase expands those preferences into a comprehensive design system with 100+ tokens covering every visual decision.

#### The DesignIdentity Object Structure (100+ tokens)

```

DesignIdentity
│
├── Meta: name, label, description
│
├── Colors (18 categories)
│   ├── primary: ColorPalette    ← 8 variants (base, hover, light, lighter, dark, glow, ring, contrast)
│   ├── secondary: ColorPalette  ← 8 variants
│   ├── accent: ColorPalette     ← 8 variants
│   ├── Surfaces: pageBg, cardBg, cardBgHover, elevatedBg, inverseBg, accentBg
│   ├── Text: textPrimary, textSecondary, textTertiary, textInverse, textLink, textLinkHover
│   └── Borders: borderLight, borderDefault, borderStrong, borderAccent
│
├── Typography (14 tokens)
│   ├── Fonts: headingFont, bodyFont, monoFont (as Tailwind font classes)
│   ├── Scale: display, h1, h2, h3, h4, bodyLg, body, bodySm, caption, overline
│   │   (each is a complete responsive Tailwind class string)
│   └── Readability: headingMaxW, bodyMaxW
│
├── Spacing (12 tokens)
│   ├── Sections: sectionSm, sectionMd, sectionLg
│   ├── Containers: container, containerSm, containerLg
│   ├── Gaps: elementGap, groupGap, sectionGap
│   └── Stacks: stackSm, stackMd, stackLg
│
├── Elevation (7 levels): none, sm, md, lg, xl, glow, inner
├── Borders: radius (10 contexts) + widths (thin, medium)
├── Animation: transition, hoverLift, hoverScale, activePress, focusRing
├── Backgrounds (8 types): page, subtle, accent, inverse, pattern, mesh, hero, cta
│
├── Components (pre-composed class strings)
│   ├── Button: 5 variants × 3 sizes
│   ├── Input: 3 variants × 3 sizes
│   ├── Card: 4 variants
│   ├── Badge: 4 variants
│   ├── Nav: 7 sub-components
│   ├── Avatar: 3 sizes
│   ├── Image: 3 variants
│   └── Divider, Checkbox, Video, Chart
│
├── Sections (9 wrappers): nav, hero, features, form, content, cardGrid, cta, footer, generic
├── Page: wrapper, innerWrapper, mainContent, fontImports
│
└── Content: ContentPreset (themed placeholder text for all sections)
#### 6 Preset Builders
Preset	Inspiration	Key Visual Differences
startup-modern	Linear, Vercel, Raycast	rounded-2xl, blue gradients, py-24 sections, colored shadows, glass nav (backdrop-blur-xl), gradient CTA buttons, hover lift animations, bg-gray-50 page
corporate-clean	Stripe, GitHub, Notion	rounded-lg, navy/slate palette, py-16 sections, subtle gray shadows, solid nav, solid-color buttons, minimal animations, white page
bold-creative	Framer, Figma, Webflow	rounded-full buttons, rounded-3xl cards, vibrant multi-color gradients, py-28 sections, strong shadows, bouncy scale animations, gradient mesh backgrounds
minimal-elegant	Apple, Medium, Squarespace	rounded (barely), monochrome + single accent, py-28 generous spacing, no shadows, serif headings, border-bottom inputs, fade-only animations
dashboard-dense	Linear Dashboard, Jira	rounded-md, compact py-4 sections, gap-3, h-8 compact buttons, no hover lift/scale, gray-100 page, monospace accents, text-sm base body
glass-gradient	Apple Vision Pro, Arc	Dark bg-gray-950, bg-white/[0.08] glass cards, backdrop-blur-xl, glow shadows, white text, gradient mesh backgrounds, border-white/[0.1]
#### Build Flow
```

buildDesignIdentity(styleGuide, presetName?)
│
├── Step 1: Extract brief from styleGuide
├── Step 2: Resolve preset (explicit → brief mapping → auto-detect → "startup-modern")
├── Step 3: Extract user colors (primary/secondary/accent hex, or defaults)
├── Step 4: Generate full palettes via generatePalette()
│ hex → { base, hover, light, lighter, dark, glow, ring, contrast }
├── Step 5: Extract user fonts (heading + body, or defaults)
├── Step 6: Call PRESET_BUILDERS[resolvedPreset](palettes, fonts) → DesignIdentity
└── Step 7: Apply brief overrides (brandName, industry content, tagline)

### Phase 5: SECTION ENGINE

File: section-engine.ts
Purpose: Detect page-level sections from the UI tree and assign elements to named slots within section templates.

#### Algorithm

````

## 1. FLATTEN the entire tree into FlatNode[]
    - Each node gets absolute position (absX, absY)
    - Skip root container, keep all descendants
    - This allows position-based detection regardless of nesting depth

## 2. RUN 9 DETECTORS in priority order
    - Each detector examines available (unconsumed) nodes
    - Successful detection → nodes consumed (removed from pool)
    - Returns DetectedSection with SlotAssignment[]

3. REMAINING nodes → "generic" section (catch-all)

## 4. SORT sections by orderIndex for rendering order
#### 9 Detectors (Priority Order)
Pri	Detector	How It Works	Order
1	NAV	Elements in top 12% of frame. Looks for nav role, buttons, text. v5.0: Consumes dividers immediately below nav.	0
2	FOOTER	Elements in bottom 18% of frame. Divider above, text, buttons.	99
3	HERO	Large heading (H1/H2/v4.0: H3) in top 45%. v4.0: Also checks headings inside containers. Sub-types: centered (no image) vs split (image on opposite side).	1
4	FORM	2+ inputs vertically stacked, gap < 150px, X aligned within 200px. Heading above, submit button below.	5
5	FEATURES	Strategy 1: 2-4 cards/containers in row, similar widths (±30%), each < 60% frame width. Strategy 2: 2+ (image + heading) pattern. v4.0: Grid container detection takes priority.	3
6	STATS	3+ short headings (≤10 chars) in row, same vertical band (±40px). Labels below each.	4
7	CONTENT SPLIT	Image/video + heading/paragraph, vertically aligned (±150px), horizontally separated (> 20% frame).	4
8	CARD GRID	2+ cards with ≥2 children each. Section heading above (within 120px). Card children consumed.	6
9	CTA	Heading + 1-3 buttons within 150px, centered, clean section (≤2 other nearby elements).	7
10	GENERIC	All remaining unconsumed nodes.	50
#### v5.0 Patch: Nav Divider Consumption
```typescript

// After nav detection, consume dividers immediately below nav
const navBottom = Math.max(...nodeIds.map(id => {
    const n = available.find(a => a.node.id === id);
    return n ? n.absY + n.node.height : 0;
}));
const dividersBelowNav = withRole(available, "divider").filter(
    d => !nodeIds.includes(d.node.id) && d.absY >= navBottom && d.absY <= navBottom + 30
);
for (const d of dividersBelowNav) {
    nodeIds.push(d.node.id);
}
This prevents a divider drawn immediately below a nav bar from leaking into a generic section.

### Phase 6: BUILDER
File: builder.ts
Helpers: component-library.ts, content-inferrer.ts, icon-registry.ts
Purpose: Assemble all sections into a complete React + Tailwind component string.

The builder has two code generation paths in v5.0:

Function	Path	Used When
generateCode()	Legacy	No pageType/industry in brief
generateMergedCode()	v5.0 Recipe	pageType or industry present
Legacy Path: generateCode(tree, identity, sections)
````

1. Page wrapper (min-h-screen, bg, antialiased, fonts)
2. For each DetectedSection (sorted by orderIndex):
   a. Infer content: inferSectionContent(slots, sectionType, identity)
   b. Get section background: getSectionBackground(identity, type, index)
   c. Wrap in section container: renderSectionWrapper(identity, type, bg, spacingFactor)
   d. Dispatch to section renderer: renderSection() → switch(type)
   e. Add animation stagger: style={{ animationDelay: "${index * 100}ms" }}

## 3. Nav renders outside <main>, content sections inside <main>, footer after </main>

## 4. Close page wrapper

5. Wrap in: export default function GeneratedUI() { return ( ... ) }

## 6. Log quality metrics

v5.0 Recipe Path: generateMergedCode(mergedSections, identity, brief)
Detailed in Section 6: v5.0 Recipe System.

#### Section Background Composition

Creates visual rhythm by alternating backgrounds:

```

nav:             → own wrapper (no extra bg)
hero:            → identity.backgrounds.hero (gradient)
features:        → identity.backgrounds.subtle
stats:           → identity.backgrounds.accent
cta:             → identity.backgrounds.cta (primary color)
footer:          → identity.backgrounds.inverse (dark)
content-split:   → alternating (even=white, odd=subtle)
card-grid:       → alternating (even=subtle, odd=white)
generic:         → alternating for visual rhythm
#### v4.0: Frame Ratio Spacing Scaling
```

frameRatio = frameHeight / frameWidth

For tall frames (ratio > 1.8):
spacingFactor = 1 + (ratio - 1.8) × 0.5

    ratio 1.0 → factor 1.0 (no change)
    ratio 2.0 → factor 1.1
    ratio 3.0 → factor 1.6

All section py-XX values are scaled by this factor,
snapped to valid Tailwind values.

#### Generic Section Renderer (v4.1 Intelligence)

The generic section renderer doesn't just dump elements vertically. It analyzes the slots and applies intelligent patterns:

```

## 1. Categorize slots by role: headings, paragraphs, buttons, media, containers, dividers, other
2. Extract nested content from containers (text inside rectangles)
## 3. Pattern matching:
    a. Hero-like (heading + text + buttons ± media):
        - With media → split layout (grid lg:grid-cols-2)
        - Without media → centered layout (text-center max-w-3xl mx-auto)
    b. Card grid (2+ containers/cards):
        → responsive grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-N)
    c. Fallback → vertical stack with proper grouping
4. Skip decorative/device-wrapper elements (they produce noise)
## 5. Apply identity styling to everything
## 6. v5.0 Recipe System
The recipe system is the major v5.0 addition. It enables the pipeline to generate complete, professional pages even with minimal wireframe input by combining page-type knowledge with industry-specific content.

Conceptual Model
```

USER PROVIDES:
pageType: "landing" ← What kind of page?
industry: "restaurant" ← What business domain?
brandName: "Bella's" ← What's the brand?
(optional) wireframe shapes ← Any specific layout wishes?

PIPELINE PRODUCES:

## 1. Recipe: "A restaurant landing page needs nav, hero, features, stats,

              testimonial, CTA, newsletter, footer"

## 2. Wireframe analysis: "User drew a hero and a form"

## 3. Merge: "Use user's hero and form, fill rest from recipe"

## 4. Code: Complete page with 8-10 professional sections

Page Recipes
File: page-recipes.ts

A page recipe is a pure data definition of what sections a page type should contain, in what order, with what background, and whether the wireframe can override each section.

SectionRecipe Interface

```typescript

SectionRecipe {
    type: RecipeSectionType     // "nav", "hero-split", "testimonial", etc.
    order: number               // Display order (0=top, 99=bottom)
    overridable: boolean        // Can wireframe replace this section?
    config: Record<string, unknown>  // Section-specific config (columns, variant, etc.)
    bg?: "hero" | "page" | "subtle" | "accent" | "cta" | "inverse"  // Background intent
}
8 Page Type Recipes
1. Landing Page (base)

```

nav(0) → hero-split(1) → logo-cloud(2) → features(3) → stats(4) →
testimonial(5) → cta(7) → newsletter(8) → footer(99)
With 10 industry-specific overrides. Example for restaurant:

```

- hero-split: config.variant = "restaurant"
- features: config = { columns: 3, variant: "menu-highlights" }
## 2. SaaS Product

```

nav(0) → hero-split(1) → logo-cloud(2) → features(3) → stats(4) →
testimonial(5) → pricing-cards(6) → faq(7) → cta(8) → footer(99)

## 3. Pricing

```

nav(0) → hero-centered(1) → pricing-cards(2) → features-comparison(3) →
faq(4) → cta(5) → footer(99)
## 4. Blog

```

nav(0) → hero-centered(1) → features(2, variant:"blog-posts") →
newsletter(3) → footer(99)

## 5. Portfolio

```

nav(0) → hero-centered(1) → features(2, variant:"projects") → stats(3) →
testimonial(4) → cta(5, variant:"contact") → footer(99)
## 6. Dashboard

```

nav(0, variant:"dashboard") → stats(1, variant:"metrics") →
features(2, columns:2, variant:"dashboard-cards") → footer(99)

## 7. Login / Signup

```

auth-card(0, variant:"login")     // Full page, no nav/footer
auth-card(0, variant:"signup")
## 8. E-commerce

```

nav(0, variant:"ecommerce") → hero-split(1, variant:"product") →
features(2, columns:4, variant:"categories") → stats(3) →
testimonial(4) → newsletter(5) → footer(99)
Industry Landing Page Overrides
For the landing page recipe, industry-specific overrides modify section configs:

```typescript

const INDUSTRY_LANDING_OVERRIDES = {
    restaurant: [
      { type: "hero-split", config: { variant: "restaurant" } },
      { type: "features", config: { columns: 3, variant: "menu-highlights" } },
    ],
    medical: [
      { type: "trust-badges", order: 2.5 },  // NEW section inserted
      { type: "features", config: { columns: 3, variant: "services" } },
    ],
    finance: [
      { type: "trust-badges", order: 2.5 },  // Trust is critical in finance
    ],
    // ... etc for all 10 industries
};
getPageRecipe() Algorithm
```

1. Normalize pageType string ("Landing Page" → "landing")

## 2. Select base recipe:

    - "landing" → LANDING_PAGE_BASE
    - "saas" → SAAS_RECIPE
    - "pricing" → PRICING_RECIPE
    - ... etc
    - unknown → LANDING_PAGE_BASE (safe default)

## 3. For landing pages only: apply industry overrides

    - Find matching override for normalized industry
    - Merge overrides into base recipe (update existing or add new sections)

## 4. Sort by order

5. Return structuredClone (never mutate the constants)
   Recipe Merger
   File: recipe-merger.ts

The merger is the critical bridge between the recipe's "ideal page" and the user's "drawn wireframe." It decides, for each section, whether to use the wireframe version or the recipe default.

Strategy

````

Pass 1: For each recipe section
    ├── If NOT overridable → always use recipe (e.g., testimonial, logo-cloud)
    └── If overridable:
        ├── Find matching wireframe section (via TYPE_MATCH_MAP)
        │   ├── Match found → use wireframe version (preserve user intent)
        │   └── No match → use recipe default (fill the gap)

Pass 2: For each unused wireframe section
    └── Insert at inferred order position (via ORDER_HINTS)

Final: Sort all by order, return MergedSection[]
Type Matching Map
Wireframe-detected section types don't always match recipe types 1:1. The matcher handles this:

```typescript

const TYPE_MATCH_MAP = {
    "hero-split":    ["hero-split", "hero-centered"],  // Either hero type matches
    "hero-centered": ["hero-centered", "hero-split"],
    features:        ["features", "card-grid"],         // Card grid counts as features
    newsletter:      ["form"],                          // A form can serve as newsletter
    "auth-card":     ["form"],                          // A form can serve as auth
    testimonial:     [],                                // Never overridden by wireframe
    "logo-cloud":    [],                                // Never overridden by wireframe
    // ...
};
MergedSection Interface
```typescript

MergedSection {
    type: RecipeSectionType       // Section type to render
    source: "wireframe" | "recipe"  // Where data comes from
    detected?: DetectedSection    // If wireframe: the detected section data
    recipeConfig?: Record<string, unknown>  // If recipe: the recipe config
    bg?: "hero" | "page" | "subtle" | "accent" | "cta" | "inverse"
    order: number                 // Render order
}
Key behavior: When a wireframe section overrides a recipe section, the wireframe's detected type is preserved. If the recipe says hero-split but the user drew a centered layout detected as hero-centered, the merged section uses hero-centered. This preserves user intent.

Order Inference for Unmatched Wireframe Sections
```typescript

const ORDER_HINTS = {
    nav: 0,
    "hero-centered": 1,
    "hero-split": 1,
    features: 3,
    stats: 4,
    "content-split": 4.5,
    form: 5,
    "card-grid": 6,
    cta: 7,
    sidebar: 50,
    generic: 50,
    footer: 99,
};
If a wireframe section doesn't match any recipe section, it gets inserted at the position suggested by ORDER_HINTS, with collision avoidance (incrementing by 0.1 until unique).

Recipe Content
File: industry-content.ts (extended section)

Each of the 10 industries has a RecipeContent object providing rich data for recipe section renderers:

```typescript

RecipeContent {
    // Stats section data
    statsItems: Array<{ value: string; label: string }>      // e.g., "10K+ | Developers"

    // Testimonial section data
    testimonialQuote: string
    testimonialAuthor: string
    testimonialRole: string
    testimonialCompany: string

    // Trust / Logo cloud data
    trustBadges: string[]          // e.g., ["SOC 2 Certified", "GDPR Compliant"]
    logoCloudNames: string[]       // e.g., ["Vercel", "Stripe", "Linear"]
    logoCloudLabel: string         // e.g., "Trusted by developers at"

    // Newsletter section data
    newsletterHeading: string
    newsletterSubtext: string
    newsletterPlaceholder: string
    newsletterButton: string

    // Features section header
    featuresSectionHeading: string
    featuresSectionSubtext: string

    // CTA section
    ctaHeading: string
    ctaSubtext: string

    // Footer structure
    footerLinkGroups: string[][]    // Grouped footer links (3 columns)
    socialLinks: string[]           // Social media platform names
}
Example — Restaurant RecipeContent:

```typescript

{
    statsItems: [
      { value: "15+", label: "Years of Excellence" },
      { value: "200+", label: "Menu Items" },
      { value: "50K+", label: "Happy Guests" },
      { value: "4.9★", label: "Average Rating" },
    ],
    testimonialQuote: "An unforgettable dining experience...",
    testimonialAuthor: "James Chen",
    testimonialRole: "Food Critic",
    testimonialCompany: "Gourmet Magazine",
    trustBadges: ["Michelin Guide", "James Beard Nominee", "OpenTable Choice", "Zagat Rated"],
    logoCloudNames: ["Michelin Guide", "Zagat", "OpenTable", "Yelp Elite", "TripAdvisor"],
    logoCloudLabel: "Featured in",
    // ...
}
Accessed via getRecipeContent(industry) with fallback to tech.

Recipe Templates (Component Library)
File: component-library.ts (14 new renderRecipeXxx functions)

These render complete, professional sections WITHOUT wireframe data. They read from DesignIdentity tokens + RecipeContent for industry context. Every CSS class comes from identity — change preset → change entire look.

#	Function	What It Renders
1	renderRecipeNav	Full nav with logo, links, Log In + Get Started CTAs, mobile hamburger
2	renderRecipeHeroCentered	Overline badge + H1 + subtitle + dual CTA group, centered
3	renderRecipeHeroSplit	Badge + H1 + subtitle + CTAs (left) + product preview placeholder (right)
4	renderRecipeLogoCloud	"Trusted by" label + 5 company name spans with hover opacity
5	renderRecipeFeatures	Section header + responsive grid of feature cards with icons
6	renderRecipeStats	Grid of stat values + labels (delegates to renderStats)
7	renderRecipeTestimonial	Quote icon + blockquote + avatar + author info
8	renderRecipeCTA	Heading + subtext + white-on-primary button + ghost secondary, inverted colors
9	renderRecipeNewsletter	Heading + subtext + email input + subscribe button + "no spam" note
10	renderRecipeFooter	Brand column with description + social links + 3 link group columns + copyright bar
11	renderRecipeTrustBadges	Flex row of shield-check icon + badge text items
12	renderRecipePricingCards	Header + 3-tier pricing grid (Starter/Pro/Enterprise) with feature lists
13	renderRecipeFAQ	Header + accordion <details> elements with plus icon rotation
14	renderRecipeAuthCard	Full-page centered auth: logo + heading + Google OAuth button + divider + email/password fields + submit + alternate link
15	renderRecipeFeaturesComparison	Comparison table with Starter/Pro/Enterprise columns
Each function follows the pattern:

```typescript

function renderRecipeXxx(
    identity: DesignIdentity,  // All styling comes from here
    indent: number,            // Current indentation level
    brandName: string,         // From brief
    industry: string           // For content lookup
): string                    // Complete JSX string
Merged Code Generation
File: builder.ts, function generateMergedCode()

The merged code generator assembles the final page from MergedSection[]:

````

generateMergedCode(mergedSections, identity, brief)
│
├── 1. Page Wrapper (renderPageWrapper)
│
├── 2. Special case: Auth pages (single auth-card section)
│ └── Render directly, no nav/main/footer structure
│
├── 3. Separate sections: nav / content / footer
│
├── 4. Render nav sections
│ ├── source === "wireframe" → renderWireframeSection(detected, identity)
│ └── source === "recipe" → renderSectionFromRecipe(type, config, identity, brief)
│
├── 5. Render content sections (inside <main>)
│ For each content section:
│ ├── Get background: getRecipeSectionBackground(identity, bg, type, index)
│ ├── Map to wrapper type: mapToWrapperType(recipeSectionType → SectionType)
│ ├── Wrap in section container + animation stagger
│ ├── source === "wireframe" → renderWireframeSection()
│ └── source === "recipe" → renderSectionFromRecipe()
│
├── 6. Render footer sections
│
├── 7. Close page wrapper
│
├── 8. Assemble: export default function GeneratedUI() { return (...) }
│
└── 9. Log quality metrics
Section Type Mapping for Wrappers
Recipe section types need mapping to the existing SectionType for section wrappers:

````typescript

const wrapperMap = {
    // Direct mappings
    "hero-centered": "hero-centered",
    features: "features",
    stats: "stats",

    // Recipe-only → closest wrapper
    "logo-cloud": "generic",
    testimonial: "generic",
    newsletter: "generic",
    "trust-badges": "generic",
    "pricing-cards": "generic",
    faq: "generic",
    "auth-card": "generic",

    // Page-type specific
    "blog-hero": "hero-centered",
    "blog-grid": "card-grid",
    "portfolio-grid": "card-grid",
    "dashboard-metrics": "stats",
    skills: "features",
    // ...
};
Recipe Section Rendering Dispatch
```typescript

function renderSectionFromRecipe(type, config, identity, brief) {
    switch (type) {
      case "nav":              return renderRecipeNav(identity, indent, brandName, industry);
      case "hero-split":       return renderRecipeHeroSplit(identity, indent, brandName, industry);
      case "hero-centered":    return renderRecipeHeroCentered(identity, indent, brandName, industry);
      case "logo-cloud":       return renderRecipeLogoCloud(identity, indent, industry);
      case "features":         return renderRecipeFeatures(identity, indent, industry, config);
      case "stats":            return renderRecipeStats(identity, indent, industry);
      case "testimonial":      return renderRecipeTestimonial(identity, indent, industry);
      case "cta":              return renderRecipeCTA(identity, indent, brandName, industry);
      case "newsletter":       return renderRecipeNewsletter(identity, indent, industry);
      case "footer":           return renderRecipeFooter(identity, indent, brandName, industry);
      case "trust-badges":     return renderRecipeTrustBadges(identity, indent, industry);
      case "pricing-cards":    return renderRecipePricingCards(identity, indent, brandName);
      case "faq":              return renderRecipeFAQ(identity, indent, brandName);
      case "auth-card":        return renderRecipeAuthCard(identity, indent, brandName, config);
      case "features-comparison": return renderRecipeFeaturesComparison(identity, indent);
      default:                 return renderRecipeFeatures(identity, indent, industry, config);
    }
}
## 7. Supporting Modules
Content Inferrer
File: content-inferrer.ts

The "intelligence" layer that makes generated code feel contextual. For every slot in a section, it determines smart placeholder content when the user left shapes blank.

Blank Text Detection
These values are treated as "not set" and get replaced:

````

"", "Type here...", "Button", "Label", "Heading", "Text",
"Enter text...", "Placeholder", "Checkbox label", "Option", "Brand"
Deterministic Selection
JavaScript

function deterministicPick(arr, nodeId) {
let hash = 0;
for (char of nodeId) hash = (hash << 5) - hash + charCode;
return arr[Math.abs(hash) % arr.length];
}
No Math.random() anywhere. The node's ID (which is stable) determines which content string is selected.

Inference Rules by Role
Button:

```

In nav as cta-primary    → content.ctaPrimary[hash]
In hero as cta-primary   → content.ctaPrimary[hash] + arrow-right icon
In form as submit        → "Sign In" + primary variant
In footer                → content.footerLinks[hash] + link variant
Input (form context):

```

field-0 (blank) → Email / you@example.com / mail icon
field-1 (blank) → Password / •••••••• / lock icon
field-2 (blank) → Full Name / John Doe / user icon
field-3 (blank) → Phone / +1 (555) 000-0000 / phone icon
field-4 (blank) → Message / Tell us about... / mail icon
User provided "phone" → phone icon, type="tel"
Heading:

```

In hero (blank)     → content.heroHeadings[hash]
In features title   → content.featureTitles[index]
In form (blank)     → content.formHeadings[hash]
Paragraph:

```

In hero (blank) → content.heroSubtexts[hash]
In features desc → content.featureTexts[index]
In footer → content.footerCopy
XSS protection — all user text goes through escapeHtml() before insertion.

Batch Inference

````typescript

inferSectionContent(slots, sectionType, identity) → Map<nodeId, InferredContent>
Processes all slots in a section at once, counting features for icon rotation.

Icon Registry
File: icon-registry.ts

40 inline SVG icons organized in 3 tiers:

Tier	Count	Examples
Tier 1 (Essential)	14	arrow-right, menu, check, search, user, mail, lock, plus, image, play
Tier 2 (Common)	15	phone, calendar, star, heart, download, settings, bell, home, chart-bar, credit-card, shield-check
Tier 3 (Specific)	11	github, twitter, linkedin, sparkles, zap, globe, code, palette, rocket, external-link
All icons: 24×24 viewBox, stroke-based with currentColor, Tailwind-compatible sizing.

Three Inference Functions
```typescript

inferButtonIcon(text)
    "Get Started" → arrow-right
    "Download" → download
    "Search" → search
    "Log In" → arrow-right

inferInputIcon(label, type, position)
    "email" → mail
    "password" → lock
    position 0 → mail (default first input)
    position 1 → lock (default second input)

getFeatureIcons(count) → IconName[]
    Returns rotating pool: [zap, shield-check, sparkles, rocket, globe, code, ...]
Color Utilities
File: color-utils.ts

Pure math functions for color manipulation:

````

hexToRGB("#3b82f6") → [59, 130, 246]
hexToHSL("#3b82f6") → { h: 217, s: 91, l: 60 }
hslToHex(217, 91, 60) → "#3b82f6"

generatePalette(hex) → {
base: "#3b82f6", (original)
hover: hslToHex(h, s+5, l-8),
light: hslToHex(h, s-30, 95),
lighter: hslToHex(h, s-35, 97),
dark: hslToHex(h, s+5, l-20),
glow: "rgba(59,130,246,0.25)",
ring: "rgba(59,130,246,0.1)",
contrast: getContrastColor(hex) // "#ffffff" or "#000000" via WCAG luminance
}

generateSecondaryFromPrimary(hex) → hue+30, s-40, l+10
generateAccentFromPrimary(hex) → hue+150, s+10, l=55

Tailwind helpers:
bg(hex) → "bg-[#hex]"
text(hex) → "text-[#hex]"
border(hex) → "border-[#hex]"
gradient(a, b) → "bg-gradient-to-br from-[#a] to-[#b]"
Analysis functions: getColorTemperature() (warm/cool/neutral), isLightColor(), isDarkColor().

Industry Content
File: industry-content.ts

10 industry content banks with ~500 pieces of content each:

```

tech, medical, restaurant, education, ecommerce,
finance, agency, fitness, realestate, travel
Each bank provides: heroHeadings, heroSubtexts, featureTitles, featureDescriptions, ctaPrimary, ctaSecondary, navLinks, footerLinks, inputLabels, icons, colorSuggestion, fontSuggestion.

60+ smart suggestion mappings (industry × tone):

```

"restaurant-elegant" → { preset: "minimal-elegant", primaryColor: "#92400e", headingFont: "Playfair Display", bodyFont: "Inter" }
"tech-futuristic" → { preset: "glass-gradient", primaryColor: "#8b5cf6", headingFont: "Space Grotesk", bodyFont: "Inter" }
Available tones: professional, playful, minimal, bold, elegant, futuristic.

Exported utility functions: getSuggestions(), getIndustryContent(), getIndustryIcons(), getAvailableIndustries(), getAvailableTones(), getAvailablePageTypes(), getRecipeContent().

Preview Builder
File: preview-builder.tsx

Converts generated React + Tailwind JSX into standalone HTML for iframe preview:

buildPreviewHtml(code) Algorithm

```

## 1. Strip React function wrapper:
    - Remove "export default function GeneratedUI() {"
    - Remove "return (" and closing ");" and "}"

2. Extract font families from {/* Fonts: ... */} comments

## 3. Convert React JSX to HTML:
    - className=" → class="
    - <input ... /> → <input ...>  (self-closing to void)
    - <hr ... /> → <hr ...>
    - style={{ camelCase: value }} → style="kebab-case: value"
    - strokeLinecap → stroke-linecap (SVG attributes)
    - defaultChecked → checked
    - ={number} → ="number" (JSX expressions to attributes)

## 4. Build standalone HTML page:
    - <!DOCTYPE html>
    - Tailwind CDN <script>
    - Google Fonts <link> tags (Inter default + any detected fonts)
    - CSS: box-sizing reset, Inter font, revealSection animation
    - <body> with processed content
highlightCode(line) Function
Simple syntax highlighter for JSX/TSX code display. Returns React elements with colored spans for: keywords (purple), JSX tags (teal), strings (orange), attributes (blue), numbers (green), brackets (gold), operators (gray).

## 8. Variation Layer
File: variation-generator.ts

Generates 3 visually contrasting variations from a single wireframe by running the entire pipeline 3 times with different design presets.

Contrast Mapping
```

startup-modern → [minimal-elegant, glass-gradient]
corporate-clean → [bold-creative, glass-gradient]
bold-creative → [minimal-elegant, corporate-clean]
minimal-elegant → [bold-creative, startup-modern]
dashboard-dense → [bold-creative, glass-gradient]
glass-gradient → [corporate-clean, minimal-elegant]
Preset Selection Fallback

````

1. User explicitly selected preset → use it
2. No preset? Check brief.industry + brief.tone → getSuggestions().preset
3. Nothing at all → "startup-modern"
v5.0 Update: Brief Passthrough
The variation generator creates a modified StyleGuide for each preset but preserves the brief from the original. This ensures:

Recipe mode activates correctly (pageType/industry flow through)
Brand name carries through all 3 variations
Industry content is consistent across variations
```typescript

const modifiedGuide: StyleGuide = {
    colors: styleGuide?.colors || { ... },
    typography: styleGuide?.typography || [],
    brief: styleGuide?.brief,          // ← PRESERVED, not overridden
    preset: presetName,                // ← Only this changes
    theme: styleGuide?.theme,
    description: styleGuide?.description,
};
Key Optimization
The tree structure (Phases 1-3.5) is identical for all 3 variations — only the Design Identity (Phase 4) changes, which cascades different CSS classes through the builder. In recipe mode, the recipe and merger also produce the same structure; only rendering differs.

## 9. Dual Pipeline Architecture
File: index.ts

The orchestrator decides which pipeline to run based on the user's brief:

```typescript

const hasPageType = brief?.pageType && brief.pageType.trim() !== "";
const hasIndustry = brief?.industry && brief.industry.trim() !== "";
const useRecipeMode = hasPageType || hasIndustry;

if (useRecipeMode) {
    return runRecipePipeline(...);
} else {
    return runLegacyPipeline(...);
}
Recipe Pipeline Flow
````

1. Build Design Identity (Phase 4) — needed early
2. Get page recipe: getPageRecipe(pageType, industry)
3. Analyze wireframe (if shapes exist):
   a. Extract → Classify → Spatial Graph → Grid Detect →
   Build Hierarchy → Inject Grids → Enhance → Detect Sections
4. Merge: mergeRecipeWithWireframe(recipe, wireframeSections)
5. Generate: generateMergedCode(merged, identity, brief)
6. Log: section counts (wireframe vs recipe), line count, timing
   Legacy Pipeline Flow (unchanged from v4.0)

```

1. Extract (Phase 1) — empty frame → EMPTY_FRAME_CODE
2. Classify (Phase 2)
3. Spatial Graph + Grid Detection (Phase 2.5-2.75)
4. Build Hierarchy + Inject Grids (Phase 3)
5. Enhance (Phase 3.5)
6. Build Design Identity (Phase 4)
7. Detect Sections (Phase 5)
8. Generate Code (Phase 6)
## 9. Log: section count, line count, timing, preset
Empty Frame Fallback
If no shapes are found inside the frame (legacy mode only), the pipeline returns a graceful placeholder:

React

export default function GeneratedUI() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-400">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
            <svg ...>+</svg>
          </div>
          <p className="text-sm">Draw some shapes inside the frame to generate a design</p>
        </div>
      </div>
    );
}
In recipe mode, an empty frame still generates a full page — the recipe provides all sections.

## 10. Type System & Data Contracts
Complete Type Flow Between Phases
```

Phase 1 Phase 2 Phase 2.5
Shape ──────────────► ExtractedShape ──────────► ClassifiedComponent ──────►
canvas shape + relX, relY, + role (UIRole) │
(any type) + width, height, + text, properties │ + centerX, centerY + same position data │
│
┌────────────┘
▼
SpatialConstraintGraph + nodes[] + edges[] + topAlignedCliques[] + leftAlignedCliques[]
│ Phase 2.75
▼
DetectedGrid[] + rows, cols + rowGap, colGap + assignment[][] + memberIds[] + confidence

Phase 3 Phase 3.5 Phase 5
──► UINode ──────────────► UINode ──────────────────► DetectedSection[] + children: UINode[] same type, + type (SectionType) + layout: row|column + enhancementHints[] + slots: SlotAssignment[] + gaps: number[] populated + confidence, position + enhancementHints: [] + roles may upgrade + orderIndex + properties.isGrid (container→card)

StyleGuide ──── Phase 4 ──► DesignIdentity ─────────► Builder
colors, fonts, 100+ tokens reads every token
brief, preset to produce JSX

v5.0 Recipe System:
PageRecipe  
 + pageType  
 + SectionRecipe[] ──► RecipeMerger ──► MergedSection[]
↑ + type
DetectedSection[] ────────────────┘ + source
(from wireframe) + detected? / recipeConfig? + bg, order

MergedSection[] ──► generateMergedCode() ──► code string
v5.0 New Types

```typescript

// Extended section types (recipe-only)
type RecipeSectionType =
    | SectionType                    // All 12 existing types
    | "logo-cloud" | "testimonial" | "newsletter"
    | "trust-badges" | "pricing-cards" | "faq"
    | "auth-card" | "blog-hero" | "blog-grid"
    | "portfolio-grid" | "dashboard-header"
    | "dashboard-metrics" | "dashboard-chart"
    | "dashboard-table" | "product-grid"
    | "skills" | "features-comparison"
    | "reservation-form" | "code-preview";

// Recipe section definition
interface SectionRecipe {
    type: RecipeSectionType;
    order: number;
    overridable: boolean;
    config: Record<string, unknown>;
    bg?: "hero" | "page" | "subtle" | "accent" | "cta" | "inverse";
}

// Merged result
interface MergedSection {
    type: RecipeSectionType;
    source: "wireframe" | "recipe";
    detected?: DetectedSection;
    recipeConfig?: Record<string, unknown>;
    bg?: string;
    order: number;
}

// Rich industry content for recipe renderers
interface RecipeContent {
    statsItems: Array<{ value: string; label: string }>;
    testimonialQuote: string;
    testimonialAuthor: string;
    testimonialRole: string;
    testimonialCompany: string;
    trustBadges: string[];
    logoCloudNames: string[];
    logoCloudLabel: string;
    newsletterHeading: string;
    newsletterSubtext: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    featuresSectionHeading: string;
    featuresSectionSubtext: string;
    ctaHeading: string;
    ctaSubtext: string;
    footerLinkGroups: string[][];
    socialLinks: string[];
}
11. End-to-End Walkthrough (v5.0 Recipe Mode)
Scenario: User provides brief with pageType: "landing", industry: "restaurant", brandName: "Bella's", and draws a hero section and a contact form inside the frame.

Step 1: Orchestrator Decision
```

brief.pageType = "landing" → hasPageType = true → useRecipeMode = true
→ runRecipePipeline()
Step 2: Design Identity (Phase 4)

```

preset: detected from brief → "minimal-elegant" (restaurant-elegant suggestion)
primary: #92400e (restaurant color suggestion)
headingFont: "Playfair Display"
bodyFont: "Inter"

→ DesignIdentity with serif headings, rounded corners, warm amber palette
→ Content overridden with restaurant industry content:
    navBrand: "Bella's"
    heroHeadings: ["A culinary journey awaits", ...]
    ctaPrimary: ["Reserve a Table", "View Menu", ...]
    navLinks: ["Menu", "Reservations", "About", "Events", "Gallery"]
Step 3: Get Page Recipe
```

getPageRecipe("landing", "restaurant"):

Base: LANDING_PAGE_BASE
nav(0) → hero-split(1) → logo-cloud(2) → features(3) → stats(4) →
testimonial(5) → cta(7) → newsletter(8) → footer(99)

Restaurant overrides applied:
hero-split: config.variant = "restaurant"
features: config = { columns: 3, variant: "menu-highlights" }

Result: 9 SectionRecipe objects
Step 4: Analyze Wireframe
User drew 8 shapes: an H1 heading ("Welcome to Bella's"), a paragraph, a CTA button, an image (hero section), plus 3 input fields and a submit button (form section).

```

### Phase 1: 8 ExtractedShapes
Phase 2: 8 ClassifiedComponents (heading, paragraph, button, image, 3 inputs, button)
### Phase 2.5: Spatial graph (8 nodes, ~28 edges)
### Phase 2.75: No grid detected (inputs are vertical, not grid)
### Phase 3: UINode tree with hero elements at top, form elements in middle
### Phase 3.5: Auto-Hero (H1 + paragraph), Auto-Center Form (inputs + button)
### Phase 5: 3 DetectedSections:
    - hero-split (heading + paragraph + button + image)
    - form (3 inputs + submit button)
    - generic (none remaining)
Step 5: Merge
```

mergeRecipeWithWireframe(9 recipe sections, 2 wireframe sections):

Recipe nav(0): overridable=true, no wireframe nav → SOURCE: recipe
Recipe hero-split(1): overridable=true, wireframe hero-split → SOURCE: wireframe ✓
Recipe logo-cloud(2): overridable=false → SOURCE: recipe
Recipe features(3): overridable=true, no wireframe features → SOURCE: recipe
Recipe stats(4): overridable=true, no wireframe stats → SOURCE: recipe
Recipe testimonial(5):overridable=false → SOURCE: recipe
Recipe cta(7): overridable=true, no wireframe cta → SOURCE: recipe
Recipe newsletter(8): overridable=false → SOURCE: recipe
Recipe footer(99): overridable=true, no wireframe footer → SOURCE: recipe

Unmatched wireframe: form section → inserted at order 5 (from ORDER_HINTS)

Result: 10 MergedSections
nav(0, recipe) → hero-split(1, wireframe) → logo-cloud(2, recipe) →
features(3, recipe) → stats(4, recipe) → form(5, wireframe) →
testimonial(5.1, recipe) → cta(7, recipe) → newsletter(8, recipe) →
footer(99, recipe)
Step 6: Generate Code

```

generateMergedCode(10 merged sections, identity, brief):

For hero-split(wireframe):
    → renderWireframeSection() → detectSections slots + inferSectionContent
    → Uses user's "Welcome to Bella's" heading text
    → Uses user's drawn image as media placeholder

For form(wireframe):
    → renderWireframeSection() → form section renderer
    → Uses user's 3 input fields
    → Infers: Email, Password, Name labels based on position

For all recipe sections:
    → renderSectionFromRecipe() → renderRecipeXxx()
    → Nav: "Bella's" brand, ["Menu", "Reservations", "About", "Events"] links
    → Logo Cloud: "Featured in" + ["Michelin Guide", "Zagat", ...]
    → Features: "A culinary experience like no other" + 3 restaurant features
    → Stats: 15+ Years | 200+ Menu Items | 50K+ Guests | 4.9★
    → Testimonial: "An unforgettable dining experience..." — James Chen, Food Critic
    → CTA: "Reserve your table tonight" with inverted color buttons
    → Newsletter: "Get exclusive offers" + email input + "Join" button
    → Footer: 3 link columns + social links + copyright

Output: ~500 lines of React + Tailwind code
    10 sections, fully responsive, restaurant-themed content,
    Playfair Display headings, warm amber palette,
    all in < 300ms with zero AI calls.
12. End-to-End Walkthrough (Legacy Wireframe Mode)
Scenario: User draws a simple landing page wireframe with no brief.pageType or brief.industry set.

User's Drawing (inside a frame 1200×900px)
```

┌──────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ [text "Logo"] [text "About"] [btn]│ │ Top band (~60px)
│ └────────────────────────────────────┘ │
│ │
│ [text "Welcome to Our App"] │ H1 heading (~200px)
│ [text "Build faster"] │ Subtitle (~250px)
│ [btn "Get Started"] │ CTA button (~300px)
│ │
│ ┌──────┐ ┌──────┐ ┌──────┐ │
│ │ [img] │ │ [img] │ │ [img] │ │ 3 feature cards (~550px)
│ │ [txt] │ │ [txt] │ │ [txt] │ │
│ │ [txt] │ │ [txt] │ │ [txt] │ │
│ └──────┘ └──────┘ └──────┘ │
│ │
│ ─────────────────────────────────────── │ Divider (~800px)
│ [text "© 2025"] │ Footer text (~850px)
└──────────────────────────────────────────┘
StyleGuide: { preset: "startup-modern", colors: { primary: "#4F46E5" }, brief: { brandName: "Acme", tagline: "Ship faster" } }

Pipeline Execution

````

Decision: no pageType, no industry → useRecipeMode = false → runLegacyPipeline()

Phase 1 (Extract): 13 shapes inside frame, sorted top-to-bottom
Phase 2 (Classify): heading, paragraph, buttons, containers→cards, images, divider
Phase 2.5 (Spatial): Graph with alignment cliques for 3 feature containers
Phase 2.75 (Grid): No grid (only 1 row of 3, needs 2+ rows)
Phase 3 (Architect): Tree with nav container, hero elements, 3 card children, footer
Phase 3.5 (Enhance): Auto-Cardify(containers→cards), Auto-Hero(H1+paragraph),
                        Auto-Responsive-Grid(3 cards), Auto-Footer(divider+text)
Phase 4 (Identity): startup-modern preset with #4F46E5, brandName "Acme"
Phase 5 (Sections): nav(0), hero-centered(1), features(3), footer(99)
Phase 6 (Build): generateCode(tree, identity, sections) → ~180 lines

Output: 4 sections, ~280 Tailwind classes, fully responsive
## 13. Test Suite Architecture
Directory: __tests__/

The v5.0 test suite covers the pipeline end-to-end with 55+ tests across 10 test files.

Test Files
File	Tests	What It Validates
fixtures/shapes.ts	—	Mock shapes: landing page, grid, form, empty, messy grid
fixtures/style-guides.ts	—	Mock style guides: tech, restaurant, empty
extractor.test.ts	6	Shape extraction, overlap calculation, sorting, filtering
classifier.test.ts	6	Role assignment, text classification, heuristic sizing
architect.test.ts	7	Hierarchy building, containment ratio, layout detection, gap calculation
spatial-graph.test.ts	5	Pairwise relations, Gaussian decay, clique detection
grid-detector.test.ts	5	Grid detection, gap consistency, confidence scoring
page-recipes.test.ts	7	Recipe selection, industry overrides, fallback behavior
recipe-merger.test.ts	6	Merge strategy, type matching, order inference, override behavior
integration.test.ts	9	Full pipeline end-to-end: both legacy and recipe paths
determinism.test.ts	4	Same input → same output, verified across multiple runs
Determinism Tests
The most critical tests verify the pipeline's core guarantee:

```typescript

// Run pipeline 3 times with identical inputs
const code1 = await generateFromFrame(frame, shapes, styleGuide);
const code2 = await generateFromFrame(frame, shapes, styleGuide);
const code3 = await generateFromFrame(frame, shapes, styleGuide);

// All three outputs must be character-identical
expect(code1).toBe(code2);
expect(code2).toBe(code3);
This is guaranteed by:

No Math.random() anywhere in the pipeline
deterministicPick() using hash-based selection from stable node IDs
All sorting algorithms using stable comparators
All conditional logic based on deterministic geometry
This document covers the complete deterministic pipeline of D2D v5.0. Every phase, every file, every data transformation, every new recipe system component — from raw canvas shapes to production-ready React + Tailwind code — running in under 300ms with zero AI calls and zero cost.
````
