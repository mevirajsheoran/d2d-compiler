D2D Deterministic Pipeline — Complete Technical Documentation
The Complete Data Flow: From Sketch to Production React Code
Table of Contents
Executive Summary
Pipeline Overview
File Manifest & Roles
Phase-by-Phase Deep Dive
Phase 1: Extractor
Phase 2: Classifier
Phase 3: Architect
Phase 3.5: Enhancer
Phase 4: Design Identity
Phase 5: Section Engine
Phase 6: Builder
Supporting Modules
Variation Layer
End-to-End Walkthrough
Type System & Data Contracts
1. Executive Summary
The D2D pipeline transforms hand-drawn wireframe shapes into production-ready React + Tailwind CSS components through 6 deterministic phases running entirely in the browser.

text

INPUT:  Frame (artboard) + Shapes (drawn by user) + StyleGuide (colors, fonts, brief)
OUTPUT: React component string (100-500 lines, 25-40 Tailwind classes per element)

Time:   < 300ms
Cost:   ₹0 (zero AI API calls)
Guarantee: Same input → Same output, every time
The pipeline works like a compiler for UI wireframes:

text

Shapes (raw geometry) 
  → Semantic roles (button, input, heading)
    → Hierarchy tree (parent-child nesting)
      → Enhanced patterns (form, card grid, hero)
        → Design system (colors, typography, spacing classes)
          → Page sections (nav, hero, features, footer)
            → Production React + Tailwind code
2. Pipeline Overview
Architecture Diagram
text

┌─────────────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATOR (index.ts)                          │
│                                                                         │
│  generateFromFrame(frame, allShapes, styleGuide)                       │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  GEOMETRY PIPELINE (shape → tree)                                │   │
│  │                                                                  │   │
│  │  Phase 1    Phase 2      Phase 3       Phase 3.5                │   │
│  │  EXTRACTOR → CLASSIFIER → ARCHITECT  → ENHANCER                │   │
│  │  shapes in   semantic     hierarchy     pattern                 │   │
│  │  frame       roles        tree          detection               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  STYLING PIPELINE (config → design system)                       │   │
│  │                                                                  │   │
│  │  Phase 4                                                         │   │
│  │  DESIGN IDENTITY                                                │   │
│  │  StyleGuide + brief → 100+ token DesignIdentity object          │   │
│  │  Uses: color-utils, industry-content                            │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  ASSEMBLY PIPELINE (tree + identity → code)                      │   │
│  │                                                                  │   │
│  │  Phase 5        Phase 6                                          │   │
│  │  SECTION       → BUILDER                                        │   │
│  │  ENGINE          Assembles JSX using:                            │   │
│  │  tree → sections   • component-library (templates)              │   │
│  │  with slots        • content-inferrer (smart text)              │   │
│  │                    • icon-registry (inline SVGs)                 │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  Output: string (React + Tailwind component)                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                     VARIATION LAYER (variation-generator.ts)            │
│                                                                         │
│  Runs the ENTIRE pipeline 3× with different presets                    │
│  Contrast mapping ensures maximum visual variety                       │
│  Output: 3 Variation objects (presetName + code)                       │
└─────────────────────────────────────────────────────────────────────────┘
Data Type Flow
text

Shape[]                          (raw canvas shapes)
    │ Phase 1
    ▼
ExtractedShape[]                 (frame-relative, bounded)
    │ Phase 2
    ▼
ClassifiedComponent[]            (semantic UI role assigned)
    │ Phase 3
    ▼
UINode                           (nested tree with layout)
    │ Phase 3.5
    ▼
UINode                           (enhanced with pattern hints)
    │ Phase 5
    ▼
DetectedSection[]                (page sections with slots)
    │
    │         StyleGuide ──── Phase 4 ────▶ DesignIdentity
    │                                            │
    ▼                                            ▼
   Phase 6: BUILDER(tree, identity, sections) → string
                Uses: content-inferrer, component-library, icon-registry
3. File Manifest & Roles
File	Phase	Role	Input → Output
index.ts	Orchestrator	Entry point. Calls all phases in sequence, measures performance, logs results	(frame, shapes, styleGuide) → code string
extractor.ts	Phase 1	Extracts shapes inside a frame, normalizes coordinates to frame origin	(frame, allShapes) → ExtractedShape[]
classifier.ts	Phase 2	Assigns semantic UI role to each shape based on type + geometry	ExtractedShape[] → ClassifiedComponent[]
architect.ts	Phase 3	Builds parent-child hierarchy tree, detects row/column layout, calculates gaps	ClassifiedComponent[] → UINode tree
enhancer.ts	Phase 3.5	Applies 13 pattern-detection rules (auto-card, auto-hero, auto-form, etc.)	UINode → UINode (with hints)
design-identity.ts	Phase 4	Builds complete design system (100+ tokens) from StyleGuide + preset	StyleGuide → DesignIdentity
section-engine.ts	Phase 5	Detects page sections (nav, hero, form, features, etc.) and assigns slots	UINode tree → DetectedSection[]
builder.ts	Phase 6	Assembles final React + Tailwind code from sections + identity	(tree, identity, sections) → code string
component-library.ts	Phase 6 helper	JSX template functions for every UI component (button, input, nav, hero, etc.)	(identity, props) → JSX string
content-inferrer.ts	Phase 6 helper	Fills blank shapes with contextually appropriate text, icons, variants	(slot, sectionType, identity) → InferredContent
icon-registry.ts	Phase 6 helper	40 inline SVG icons + inference functions for buttons/inputs/features	iconName → SVG string
color-utils.ts	Phase 4 helper	Color math: hex↔RGB↔HSL conversion, palette generation, Tailwind class helpers	hex → ColorPalette
industry-content.ts	Phase 4 helper	10 industry content banks + 60 smart suggestion mappings	(industry, tone) → Suggestions
types.ts	All phases	Type definitions: UINode, DesignIdentity, DetectedSection, etc.	TypeScript interfaces
variation-generator.ts	Variation layer	Runs pipeline 3× with contrasting presets for multi-variation output	(frame, shapes, styleGuide) → Variation[]
preview-builder.tsx	UI layer	Preview rendering (not part of deterministic pipeline)	—
stylist.ts	Legacy	v2.0 stylist (superseded by design-identity.ts in v3.0)	—
4. Phase-by-Phase Deep Dive
Phase 1: EXTRACTOR
File: extractor.ts
Purpose: Find all shapes inside the target frame and normalize their coordinates.

Why this phase exists: The canvas contains potentially hundreds of shapes across multiple frames. The extractor isolates only the shapes relevant to the target frame and transforms their absolute canvas coordinates into frame-relative coordinates (origin at frame's top-left corner).

Algorithm
text

For each shape on canvas:
  1. Skip the frame itself, other frames, and generatedui shapes
  2. Calculate bounding box (getShapeBounds)
  3. Check if shape overlaps frame by ≥50% of its area (isInsideFrame)
  4. Skip shapes with near-zero dimensions (w<2 && h<2)
  5. Normalize: relX = shape.x - frame.x, relY = shape.y - frame.y
  6. Sort: top-to-bottom, then left-to-right (10px row tolerance)
Bounding Box Strategies (getShapeBounds)
The function handles every shape type the canvas supports:

Shape Category	Examples	How Bounds Are Calculated
Bounded (has x, y, w, h)	rect, ellipse, buttonShape, inputField, checkbox, imagePlaceholder, videoPlaceholder, chartPlaceholder, divider, stickyNote, deviceFrame	Direct property read
Line-like (has startX/Y, endX/Y)	arrow, line, connector	min/max of endpoints
Freehand (has points[])	freedraw, highlighter	min/max across all points
Text (has x, y but no w/h)	text	Estimated: width = chars × fontSize × 0.55, height = fontSize × lineHeight × lines
Excluded	frame, generatedui	Returns null (skipped)
Overlap Test (isInsideFrame)
Not a simple center-point check. Calculates the intersection rectangle between shape and frame:

text

intersectionArea = (intersectX2 - intersectX1) × (intersectY2 - intersectY1)
shapeArea = shape.width × shape.height
overlapRatio = intersectionArea / shapeArea

Shape is "inside" if overlapRatio ≥ 0.50
This correctly handles shapes that straddle the frame border — a shape that's 80% inside but whose center is technically outside still gets captured.

Output
TypeScript

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

Phase 2: CLASSIFIER
File: classifier.ts
Purpose: Assign a semantic UI role to each extracted shape.

Why this phase exists: The extractor gives us geometry (rectangles, circles, lines). The classifier answers: "What does this shape mean in UI terms?" A 200×40px rectangle could be an input field, a button, or just a container — the classifier decides.

Three Classification Strategies
Strategy 1: Direct Mapping — The shape type explicitly declares its UI intent.

text

buttonShape     → "button"     (with text, variant from shape)
inputField      → "input"      (with placeholder, label from shape)
checkbox        → "checkbox"   (with label, checked state)
hamburgerMenu   → "nav"
imagePlaceholder → "image"
videoPlaceholder → "video"
chartPlaceholder → "chart"     (with chartType)
divider         → "divider"    (with direction)
deviceFrame     → "device-wrapper" (with device type)
text            → classifyText() → "heading" (levels 1-4) or "paragraph"
Text Sub-Classification:

text

fontSize ≥ 32 AND fontWeight ≥ 600  →  heading level 1
fontSize ≥ 24 AND fontWeight ≥ 600  →  heading level 2
fontSize ≥ 20 AND fontWeight ≥ 500  →  heading level 3
fontSize ≥ 18 AND fontWeight ≥ 500  →  heading level 4
Otherwise                           →  paragraph
Text shapes carry rich metadata: fontSize, fontWeight, fontFamily, textAlign, fontStyle, textDecoration, textTransform, lineHeight, letterSpacing.

Strategy 2: Heuristic Mapping — Infer role from geometry when the shape type is generic.

For rect:

text

Width > 150 AND Height 30-60    →  "input" (wide + short = text field)
Width ≤ 200 AND Height 25-60    →  "button" (small + short = clickable)
Everything else                 →  "container"
For roundedRect:

text

Width ≤ 200 AND Height ≤ 60    →  "button" (primary variant)
Everything else                →  "card"
For ellipse / circle:

text

Width/Height < 60              →  "avatar"
Otherwise                     →  "decorative"
Other geometric shapes: line → "divider", triangle/star/polygon → "decorative"

Strategy 3: Annotation Exclusion — Design notes are dropped entirely.

text

stickyNote, speechBubble, arrow, connector, freedraw, highlighter
→ role = "annotation" → SKIPPED (not included in output)
Output
TypeScript

ClassifiedComponent {
  id: string                    // Shape ID
  role: UIRole                  // "button" | "input" | "heading" | "card" | ...
  relX, relY, width, height    // From extractor
  centerX, centerY             // From extractor
  text?: string                // For text shapes and buttons
  properties: Record<string, unknown>  // Role-specific metadata
  originalShape: Shape         // Full shape reference
}
The properties object carries role-specific data:

Buttons: { text, variant }
Inputs: { placeholder, label }
Headings: { headingLevel, fontSize, fontWeight, textAlign, ... }
Charts: { chartType }
Phase 3: ARCHITECT
File: architect.ts
Purpose: Convert the flat list of classified components into a nested hierarchy tree with layout information.

Why this phase exists: UI components don't exist in isolation — a button might be inside a card, which is inside a feature grid. The architect recreates the parent-child relationships from pure geometry and determines whether children are laid out as a row or column.

Algorithm
text

Step 1: FIND PARENT for each component
  For each child:
    For each candidate parent:
      - Must be container/card/device-wrapper role
      - Calculate containmentRatio(parent, child)
      - Must be ≥ 0.70 (70% of child area inside parent)
      - Pick SMALLEST qualifying parent (tightest fit)
    Result: parentMap<childId → parentId | null>

Step 2: GROUP CHILDREN by parent
  childrenOf<parentId → ClassifiedComponent[]>
  null key = root-level children (no parent)

Step 3: RECURSIVELY BUILD TREE
  For each node:
    a. Get direct children from childrenOf map
    b. detectLayout(children, frameHeight) → "row" or "column"
    c. Sort children by position (X for row, Y for column)
    d. calculateGaps(sorted, direction) → per-pair spacing array
    e. Recurse into each child

Step 4: BUILD ROOT NODE
  Root wraps all parentless children with its own layout + gaps
Containment Ratio
text

containmentRatio(parent, child):
  - If parent === child → 0 (can't contain yourself)
  - If parent.role not in [container, card, device-wrapper] → 0
  - Calculate intersection rectangle area
  - Return intersectionArea / childArea
  - Must be ≥ 0.70 to qualify
  - Among all qualifying parents, pick the SMALLEST (tightest fit)
Why "smallest parent"? Consider:

text

┌─── Root container (1000×800) ───────────────────┐
│  ┌─── Card (300×200) ────┐                      │
│  │  [Button 100×40]      │                      │
│  └───────────────────────┘                      │
└─────────────────────────────────────────────────┘

Both root (1000×800) and card (300×200) contain the button at >70%.
But card (300×200) is SMALLER → it's the correct parent.
Layout Detection (detectLayout)
Uses an adaptive threshold instead of a fixed pixel value:

text

threshold = min(5% of frameHeight, 50% of averageChildHeight)

For each consecutive pair of children:
  If |childA.relY - childB.relY| < threshold → count as "same row"

If > 50% of pairs are "same row" → layout = "row"
Else → layout = "column"
Why adaptive? A fixed 30px threshold would misclassify elements on different frame sizes. 5% of 812px (phone) = 40px, while 5% of 400px (small section) = 20px — the threshold scales with context.

Per-Gap Calculation
Instead of averaging all gaps into one number, each gap between consecutive pairs is preserved individually:

text

Children sorted by layout direction:
  [Child A]──gap[0]──[Child B]──gap[1]──[Child C]

gap[i] = Child[i+1].position - (Child[i].position + Child[i].size)

Each gap snapped to Tailwind spacing scale:
  [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
  (picks nearest value)
This preserves intentional design decisions:

40px gap after heading → breathing room
16px gap between form fields → tight grouping
32px before submit button → visual separation
Output
TypeScript

UINode {
  id: string                    // "root" or shape ID
  role: UIRole                  // Semantic role
  relX, relY, width, height    // Position and size
  text?: string                // Text content
  properties: Record<string, unknown>
  children: UINode[]           // Nested children (recursive)
  layout: "row" | "column"    // How children are arranged
  gaps: number[]              // Spacing between each child pair
  enhancementHints: string[]  // Empty at this stage
}
Phase 3.5: ENHANCER
File: enhancer.ts
Purpose: Apply 13 pattern-detection rules that upgrade the tree with design intelligence.

Why this phase exists: The architect produces a mechanically accurate tree, but it doesn't understand design patterns. The enhancer recognizes common UI patterns (forms, heroes, feature grids) and adds hints that help later phases produce better output.

13 Rules (Applied Sequentially)
Structural Rules (modify tree shape/roles):

#	Rule	Pattern	Enhancement
1	Auto-Center Form	Root column with heading + ≥1 input + button, ≤6 items	Adds hint "centered-form"
2	Auto-Cardify	Container with (image + heading/text) or (heading + text + button), 2-5 children	Upgrades role to "card", adds hint "auto-card"
3	Auto-Responsive Grid	Row with 2-4 cards/containers with similar widths (±20%), all children are the similar items	Adds hint "responsive-grid-N"
4	Auto-Sticky Nav	First child of root is "nav" role	Adds hint "sticky-nav"
5	Auto-Hero	H1 heading + paragraph at root top	Adds hints "hero-heading", "hero-text" on respective nodes
6	Auto-Input Group	≥2 consecutive inputs in column	Adds hint "input-group-member" to each, normalizes gaps to 16px
7	Auto-Footer	Divider + text/container at root bottom	Adds hint "footer"
Pattern Detection Rules (add hints for section engine):

#	Rule	Pattern	Enhancement
8	Content Split	Image + text side-by-side in row layout	Adds hint "content-split"
9	CTA Section	Heading + ≥1 button, ≤4 total children (non-root)	Adds hint "cta-section"
10	Stats Section	≥3 short headings (≤10 chars each) in a row	Adds hint "stats-section"
11	Sidebar	Narrow (<30% width) + tall (>60% height) container at root level in row	Adds hint "sidebar"
12	Feature Icons	Small image/avatar + heading in 2-4 child containers	Adds hint "feature-card"
Spacing Rules (modify gaps):

#	Rule	Pattern	Enhancement
13	Auto-Section Spacing	Transitions between content types at root level	Sets gap ≥48px at section boundaries (button→heading, divider boundaries, nav→content)
Rule Application Order Matters
text

1. Structural rules first — they may change roles (container → card)
   which affects what pattern detection rules see

2. Pattern detection next — they add hints based on current roles

3. Spacing last — modifies gaps based on final tree structure
Rules are additive and safe — they only add to enhancementHints[] arrays or occasionally upgrade a role. They never remove nodes or break the tree structure.

Phase 4: DESIGN IDENTITY
File: design-identity.ts
Helpers: color-utils.ts, industry-content.ts
Purpose: Build a complete design system (the DesignIdentity object) from the user's StyleGuide configuration.

Why this phase exists: The pipeline needs concrete CSS classes to generate code, but the user only provides abstract preferences (a hex color, a font name, a preset choice). This phase expands those preferences into a comprehensive design system with 100+ tokens covering every visual decision.

The DesignIdentity Object Structure
text

DesignIdentity (100+ tokens)
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
│   │   (each is a complete responsive Tailwind class string like
│   │    "text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]")
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
│   ├── Button: 5 variants (primary, secondary, ghost, link, danger) × 3 sizes
│   ├── Input: 3 variants (default, error, search) × 3 sizes
│   ├── Card: 4 variants (elevated, bordered, ghost, interactive)
│   ├── Badge: 4 variants
│   ├── Nav: 7 sub-components (wrapper, container, logo, logoIcon, link, linkActive, mobileToggle)
│   ├── Avatar: 3 sizes
│   ├── Image: 3 variants (default, hero, card)
│   └── Divider, Checkbox, Video, Chart
│
├── Sections (9 wrappers): nav, hero, features, form, content, cardGrid, cta, footer, generic
├── Page: wrapper, innerWrapper, mainContent, fontImports
│
└── Content: ContentPreset (themed placeholder text for all sections)
Every single Tailwind class in the final output comes from this object. No hardcoded colors, no hardcoded spacing anywhere in the builder or component library.

6 Preset Builders
Each preset is a complete function that produces a fully different DesignIdentity:

Preset	Inspiration	Key Visual Differences
startup-modern	Linear, Vercel, Raycast	rounded-2xl, blue gradients, py-24 sections, colored shadows, glass nav (backdrop-blur-xl), gradient CTA buttons, hover lift animations, bg-gray-50 page
corporate-clean	Stripe, GitHub, Notion	rounded-lg, navy/slate palette, py-16 sections, subtle gray shadows, solid nav, solid-color buttons, minimal animations, white page
bold-creative	Framer, Figma, Webflow	rounded-full buttons, rounded-3xl cards, vibrant multi-color gradients, py-28 sections, strong shadows, bouncy scale animations, gradient mesh backgrounds
minimal-elegant	Apple, Medium, Squarespace	rounded (barely), monochrome + single accent, py-28 generous spacing, no/near-invisible shadows, serif headings, border-bottom inputs (no box), fade-only animations
dashboard-dense	Linear Dashboard, Jira	rounded-md, compact py-4 sections, gap-3, h-8 compact buttons, no hover lift/scale, gray-100 page, monospace accents, text-sm base body
glass-gradient	Apple Vision Pro, Arc	Dark bg-gray-950, bg-white/[0.08] glass cards, backdrop-blur-xl, glow shadows (shadow-[primary.glow]), white text, gradient mesh backgrounds, border-white/[0.1] borders
Concrete Example: How a Button Differs Across Presets
text

STARTUP-MODERN primary button:
  "inline-flex items-center justify-center gap-2 whitespace-nowrap 
   text-sm font-medium h-10 px-6 rounded-xl 
   bg-gradient-to-b from-[#3b82f6] to-[#3574d4]
   text-white shadow-md shadow-[rgba(59,130,246,0.25)]
   hover:shadow-lg hover:shadow-[rgba(59,130,246,0.25)]
   hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm
   focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2
   transition-all duration-200 disabled:opacity-50"

MINIMAL-ELEGANT primary button:
  "inline-flex items-center justify-center gap-2 whitespace-nowrap 
   text-sm font-medium tracking-wide h-11 px-7 rounded
   bg-[#3b82f6] text-white hover:bg-[#3574d4]
   focus-visible:outline-none focus-visible:ring-1 
   focus-visible:ring-[#3b82f6] focus-visible:ring-offset-4
   transition-colors duration-300 disabled:opacity-50"

GLASS-GRADIENT primary button:
  "inline-flex items-center justify-center gap-2 whitespace-nowrap 
   text-sm font-medium h-10 px-6 rounded-xl
   bg-gradient-to-b from-[#3b82f6] to-[#3574d4]
   text-white shadow-lg shadow-[rgba(59,130,246,0.25)]
   hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
   focus-visible:outline-none focus-visible:ring-2 
   focus-visible:ring-[#3b82f6]/50 focus-visible:ring-offset-2 
   focus-visible:ring-offset-gray-950
   transition-all duration-300 disabled:opacity-50"
Same button role, same primary color — completely different visual personality.

Main Build Function (buildDesignIdentity)
text

buildDesignIdentity(styleGuide, presetName?)
│
├── Step 1: Extract brief from styleGuide
│
├── Step 2: Determine preset
│   Priority chain:
│   a. Explicit presetName parameter (from variation generator)
│   b. styleGuide.preset (user selected in Style Guide)
│   c. Brief tone mapping (professional→startup-modern, 
│      elegant→minimal-elegant, futuristic→glass-gradient)
│   d. detectPresetFromStyleGuide (auto-detect from colors/fonts)
│   e. Fallback: "startup-modern"
│
├── Step 3: Extract user colors
│   styleGuide.colors.primary[0].hexColor → primaryHex
│   styleGuide.colors.secondary[0].hexColor → secondaryHex
│   styleGuide.colors.accent[0].hexColor → accentHex
│   (or DEFAULT_COLORS: #3b82f6, #6b7280, #f59e0b)
│
├── Step 4: Generate full palettes (via color-utils.ts)
│   primaryHex → generatePalette() → ColorPalette {
│     base: "#3b82f6",          (original)
│     hover: "#3574d4",         (h, s+5, l-8)
│     light: "#eff4fe",         (h, s-30, l=95)
│     lighter: "#f5f8fe",       (h, s-35, l=97)
│     dark: "#1e3a8a",          (h, s+5, l-20)
│     glow: "rgba(59,130,246,0.25)",
│     ring: "rgba(59,130,246,0.1)",
│     contrast: "#ffffff"       (WCAG luminance check)
│   }
│
├── Step 5: Extract user fonts
│   styleGuide.typography[0].styles[0].fontFamily → headingFont
│   styleGuide.typography[0].styles[1].fontFamily → bodyFont
│   (or defaults: "Inter", "Inter")
│
├── Step 6: Build preset
│   PRESET_BUILDERS[resolvedPreset](
│     primaryPalette, secondaryPalette, accentPalette,
│     headingFont, bodyFont
│   ) → DesignIdentity
│
└── Step 7: Apply brief overrides (applyBriefToContent)
    If brief has brandName:
      → identity.content.navBrand = "MyBrand"
      → identity.content.footerCopy = "© 2025 MyBrand..."
      → identity.content.ctaPrimary += ["Try MyBrand", "Start with MyBrand"]
      → identity.content.formHeadings prepend ["Welcome to MyBrand", ...]
    If brief has industry:
      → getIndustryContent("restaurant")
      → Override: heroHeadings, ctaPrimary/Secondary, navLinks, 
                  footerLinks, featureTitles, featureTexts
    If brief has tagline:
      → Prepend to heroSubtexts
Supporting: Color Utils (color-utils.ts)
Pure math functions for color manipulation:

text

hexToRGB("#3b82f6") → [59, 130, 246]
hexToHSL("#3b82f6") → { h: 217, s: 91, l: 60 }
hslToHex(217, 91, 60) → "#3b82f6"

generatePalette(hex) → {
  base, hover (l-8), light (l=95), lighter (l=97), 
  dark (l-20), glow (rgba 0.25), ring (rgba 0.1), 
  contrast (#fff or #000 via WCAG)
}

generateSecondaryFromPrimary(hex) → hue+30, s-40, l+10
generateAccentFromPrimary(hex) → hue+150, s+10, l=55

Tailwind helpers:
  bg(hex) → "bg-[#hex]"
  text(hex) → "text-[#hex]"
  border(hex) → "border-[#hex]"
  gradient(a, b) → "bg-gradient-to-br from-[#a] to-[#b]"
Supporting: Industry Content (industry-content.ts)
10 Industry Content Banks:

Each bank contains ~50 pieces of contextually appropriate content:

tech, medical, restaurant, education, ecommerce
finance, agency, fitness, realestate, travel
Example (restaurant):

text

heroHeadings: ["A culinary journey awaits", "Taste the extraordinary", ...]
ctaPrimary: ["Reserve a Table", "View Menu", "Order Now"]
navLinks: ["Menu", "Reservations", "About", "Events", "Gallery"]
featureTitles: ["Fresh Ingredients", "Award Winning", "Private Dining", ...]
colorSuggestion: "#92400e"
fontSuggestion: ["Playfair Display", "Inter"]
60+ Smart Suggestion Mappings:

text

(industry × tone) → { preset, primaryColor, headingFont, bodyFont }

"restaurant-elegant" → {
  preset: "minimal-elegant",
  primaryColor: "#92400e",
  headingFont: "Playfair Display",
  bodyFont: "Inter"
}

"tech-futuristic" → {
  preset: "glass-gradient",
  primaryColor: "#8b5cf6",
  headingFont: "Space Grotesk",
  bodyFont: "Inter"
}
Phase 5: SECTION ENGINE
File: section-engine.ts
Purpose: Detect page-level sections from the UI tree and assign elements to named slots within section templates.

Why this phase exists: The architect gives us a tree of "what elements exist and how they nest." The section engine answers: "What kind of page is this?" — detecting that the top elements form a navigation bar, the middle elements form a hero section, etc.

Algorithm
text

1. FLATTEN the entire tree into FlatNode[]
   - Each node gets absolute position (absX, absY)
   - Skip root container, keep all descendants
   - This allows position-based detection regardless of nesting depth

2. RUN 9 DETECTORS in priority order
   - Each detector examines available (unconsumed) nodes
   - Successful detection → nodes consumed (removed from pool)
   - Returns DetectedSection with SlotAssignment[]

3. REMAINING nodes → "generic" section (catch-all)

4. SORT sections by orderIndex for rendering order
9 Detectors (Priority Order)
text

┌─────┬──────────────────┬──────────────────────────────────────────┐
│ Pri │ Detector          │ How It Works                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  1  │ NAV              │ Elements in top 12% of frame             │
│     │                  │ Looks for: nav role, buttons, text       │
│     │                  │ Assigns: logo, nav-link×N, cta-primary/  │
│     │                  │   secondary                               │
│     │                  │ orderIndex: 0                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  2  │ FOOTER           │ Elements in bottom 18% of frame          │
│     │                  │ Looks for: divider above, text, buttons  │
│     │                  │ Assigns: footer-text×N, footer-link×N    │
│     │                  │ orderIndex: 99                            │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  3  │ HERO             │ Large heading (H1/H2) in top 45%        │
│     │                  │ Searches within 200px below heading for  │
│     │                  │   paragraph, buttons, image              │
│     │                  │ Sub-types:                                │
│     │                  │   centered: no image or image not split  │
│     │                  │   split: image on opposite side of frame │
│     │                  │     center from heading                  │
│     │                  │ Assigns: heading, subtext, cta-primary,  │
│     │                  │   cta-secondary, media                   │
│     │                  │ orderIndex: 1                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  4  │ FORM             │ 2+ inputs vertically stacked             │
│     │                  │ Gap < 150px between consecutive inputs   │
│     │                  │ X alignment within 200px                  │
│     │                  │ Searches above: heading, description     │
│     │                  │ Searches below: submit button, secondary │
│     │                  │ Assigns: heading, description, field-0   │
│     │                  │   through field-N, checkbox, submit,     │
│     │                  │   secondary-action                       │
│     │                  │ orderIndex: 5                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  5  │ FEATURES         │ Strategy 1: 2-4 cards/containers in row │
│     │                  │   Same vertical band (±50px)             │
│     │                  │   Similar widths (±30%)                  │
│     │                  │   Each < 60% frame width                 │
│     │                  │ Strategy 2: 2+ (image + heading) pattern │
│     │                  │   Images in row, headings below each     │
│     │                  │ Assigns: section-heading, section-desc,  │
│     │                  │   feature-N or feature-icon/title/text-N │
│     │                  │ orderIndex: 3                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  6  │ STATS            │ 3+ short headings (≤10 chars) in row    │
│     │                  │ Same vertical band (±40px)               │
│     │                  │ Searches for label paragraphs below each │
│     │                  │ Assigns: stat-value-N, stat-label-N      │
│     │                  │ orderIndex: 4                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  7  │ CONTENT SPLIT    │ Image/video + heading/paragraph          │
│     │                  │ Vertically aligned (±150px)              │
│     │                  │ Horizontally separated (> 20% frame)     │
│     │                  │ Assigns: media, content-heading,         │
│     │                  │   content-text, content-cta              │
│     │                  │ orderIndex: 4                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  8  │ CARD GRID        │ 2+ cards with ≥2 children each          │
│     │                  │ Section heading above (within 120px)     │
│     │                  │ Card children consumed (not re-detected) │
│     │                  │ Assigns: section-heading, card-N          │
│     │                  │ orderIndex: 6                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│  9  │ CTA              │ Heading + 1-3 buttons within 150px      │
│     │                  │ Centered (within 300px horizontally)     │
│     │                  │ Clean section (≤2 other nearby elements) │
│     │                  │ Assigns: heading, subtext, cta-primary,  │
│     │                  │   cta-secondary                          │
│     │                  │ orderIndex: 7                             │
├─────┼──────────────────┼──────────────────────────────────────────┤
│ 10  │ GENERIC          │ All remaining unconsumed nodes           │
│     │                  │ Assigns: generic-child×N                  │
│     │                  │ orderIndex: 50                            │
└─────┴──────────────────┴──────────────────────────────────────────┘
Why Detection Order Matters
Nav and footer are detected first because they have the strongest positional signals (top 12%, bottom 18%). If hero were detected before nav, the hero detector might claim the nav's heading as a "hero heading."

text

WRONG ORDER (hero first):
  Hero claims everything in top 45% → nav heading stolen → broken nav

CORRECT ORDER (nav first, then hero):
  Nav claims top 12% elements → hero only sees remaining upper elements
  → Both detected correctly
Slot Assignment
Each detected section produces SlotAssignment[] — mapping nodes to named template positions:

TypeScript

SlotAssignment {
  slotName: string    // "heading", "cta-primary", "field-0", etc.
  nodeId: string      // Which UINode fills this slot
  node: UINode        // The actual node (for content/properties access)
}
These slot names are the contract between the section engine, content inferrer, and builder. The content inferrer knows that "field-0" in a "form" section should get email content, while "cta-primary" in "hero-centered" should get a bold CTA text.

Phase 6: BUILDER
File: builder.ts
Helpers: component-library.ts, content-inferrer.ts, icon-registry.ts
Purpose: Assemble all sections into a complete React + Tailwind component string.

Why this phase exists: All previous phases prepared the data — the tree structure, the design system, the section layout. The builder is where it all comes together into actual code output.

Assembly Flow
text

generateCode(tree, identity, sections)
│
├── 1. Page Wrapper
│   renderPageWrapper(identity) → { open, close }
│   Opens: <div min-h-screen bg-gray-50 antialiased>
│            <div flex flex-col min-h-screen>
│
├── 2. For each DetectedSection (sorted by orderIndex):
│   │
│   ├── a. Infer content
│   │   inferSectionContent(slots, sectionType, identity)
│   │   → Map<nodeId, InferredContent>
│   │   (fills blank text, icons, variants for every slot)
│   │
│   ├── b. Get section background
│   │   getSectionBackground(identity, sectionType, index)
│   │   → alternating backgrounds for visual rhythm
│   │
│   ├── c. Wrap in section container
│   │   renderSectionWrapper(identity, sectionType, bg)
│   │   → <section className="py-16 bg-gray-50">
│   │       <div className="max-w-6xl mx-auto px-4...">
│   │
│   ├── d. Dispatch to section renderer
│   │   renderSection() → switch(sectionType):
│   │     nav          → renderNavSection()
│   │     hero-centered → renderHeroSection()
│   │     hero-split   → renderHeroSection()
│   │     form         → renderFormSectionContent()
│   │     features     → renderFeaturesSection()
│   │     footer       → renderFooterSection()
│   │     stats        → renderStatsSection()
│   │     cta          → renderCTASection()
│   │     content-split→ renderContentSplitSection()
│   │     card-grid    → renderCardGridSection()
│   │     generic      → renderGenericSection()
│   │
│   └── e. Add animation stagger
│       style={{ animationDelay: "${sectionIndex * 100}ms" }}
│
├── 3. Structural wrapping
│   <main> wraps all content sections (between nav and footer)
│
├── 4. Close page wrapper
│
├── 5. Assemble as component
│   "export default function GeneratedUI() { return ( ... ) }"
│
└── 6. Measure quality metrics
    totalClasses, responsivePrefixes, hoverStates, focusStates,
    sectionsDetected, outputLines, backgroundVariations, typographyLevels
Section Background Composition
Creates visual rhythm by alternating backgrounds:

text

nav:             → own wrapper (no extra bg)
hero:            → identity.backgrounds.hero (gradient)
features:        → identity.backgrounds.subtle (light gray)
content-split:   → alternating (even=white, odd=subtle)
stats:           → identity.backgrounds.accent
cta:             → identity.backgrounds.cta (primary color)
footer:          → identity.backgrounds.inverse (dark)
card-grid:       → alternating (even=subtle, odd=white)
Section Renderer Pattern (each follows the same approach)
text

1. Extract slots from section (getSlot, getSlotsWithPrefix)
2. For each slot, get inferred content (contentMap.get(nodeId))
3. Determine text: user-drawn text > inferred text > identity default
4. Delegate to component-library renderers
5. Return assembled JSX string
Example — Nav Section Renderer:

text

1. Logo slot → get brand name from slot text or identity.content.navBrand
2. Nav link slots → get text from each or use identity defaults
3. CTA button slots → render with proper variant (ghost/primary)
4. If no CTAs from drawing → add default "Log In" (ghost) + "Sign Up" (primary)
5. Call renderNav(identity, brandName, ctaButtons, navLinks) → JSX string
Supporting: Content Inferrer (content-inferrer.ts)
The "intelligence" layer that makes generated code feel contextual. For every slot in a section, it determines smart placeholder content when the user left shapes blank.

Inference rules per role:

text

BUTTON:
  In nav as cta-primary    → content.ctaPrimary[deterministic hash]
  In hero as cta-primary   → content.ctaPrimary[deterministic hash]
  In form as submit        → "Sign In"
  In footer                → content.footerLinks[deterministic hash]
  + Icon inference: "Get Started"→arrow-right, "Download"→download
  + Variant inference: cta-primary→"primary", nav→"ghost"

INPUT:
  In form, field-0 (blank) → Email / you@example.com / mail icon
  In form, field-1 (blank) → Password / •••••••• / lock icon
  In form, field-2 (blank) → Full Name / John Doe / user icon
  User provided "phone"    → phone icon, type="tel"

HEADING:
  In hero (blank)          → content.heroHeadings[deterministic hash]
  In features as title     → content.featureTitles[index]
  In form (blank)          → content.formHeadings[deterministic hash]

PARAGRAPH:
  In hero (blank)          → content.heroSubtexts[deterministic hash]
  In features as desc      → content.featureTexts[index]
  In footer                → content.footerCopy
Deterministic selection ensures same input → same output:

JavaScript

function deterministicPick(arr, nodeId) {
  let hash = 0;
  for (char of nodeId) hash = (hash << 5) - hash + charCode;
  return arr[abs(hash) % arr.length];
}
No Math.random() anywhere. The node's ID (which is stable) determines which content string is selected.

Blank text detection — these values are treated as "not set" and get replaced:

text

"", "Type here...", "Button", "Label", "Heading", "Text",
"Enter text...", "Placeholder", "Checkbox label", "Option", "Brand"
XSS protection — all user text goes through escapeHtml() before insertion.

Supporting: Component Library (component-library.ts)
JSX template functions that produce the actual HTML strings. Every function follows the same contract:

TypeScript

renderXxx(identity: DesignIdentity, indent: number, ...props): string
Component catalog:

Category	Functions	Key Features
Primitives	renderButton, renderInput, renderHeading, renderParagraph, renderCheckbox, renderAvatar, renderDivider, renderImage, renderVideo, renderChart	5 button variants, icon integration, focus rings, responsive type scale
Composites	renderNav, renderHeroCentered, renderHeroSplit, renderFormSection, renderFeatureCard, renderFeatureGrid, renderFooter, renderStats, renderCTA, renderContentSplit	Full responsive layouts, multi-element structures
Structural	renderSectionWrapper, renderPageWrapper, renderCard	{ open, close } wrapper pairs
Fallback	renderGenericNode	Dispatches any UINode to its appropriate renderer, handles recursive children
Key design pattern: No component has hardcoded colors. Everything reads from identity:

TypeScript

// Button reads ~8 identity properties:
identity.components.button.primary     // Full class string for primary variant
identity.components.button.sizes.md    // Size-specific classes
identity.typography.bodyFont           // Font family class
identity.colors.primary.base           // For focus ring color
Supporting: Icon Registry (icon-registry.ts)
40 inline SVG icons organized in 3 tiers, plus inference functions:

text

Tier 1 (14 essential): arrow-right, menu, check, search, user, mail, lock, ...
Tier 2 (14 common): phone, calendar, star, heart, download, settings, ...
Tier 3 (12 specific): github, twitter, sparkles, zap, globe, rocket, ...
All icons use stroke="currentColor" so they inherit text color from Tailwind classes.

Three inference functions:

inferButtonIcon(text) — "Get Started" → arrow-right
inferInputIcon(label, type, position) — email→mail, password→lock, position 0→mail
getFeatureIcons(count) — rotating pool: zap, shield-check, sparkles, ...
5. Supporting Modules
types.ts
Defines all TypeScript interfaces that form the contracts between phases:

Type	Created By	Used By	Purpose
ExtractedShape	Extractor	Classifier	Shape with frame-relative coordinates
ClassifiedComponent	Classifier	Architect	Shape with semantic UI role
UINode	Architect	Enhancer, Section Engine, Builder	Tree node with children, layout, gaps
DesignIdentity	Design Identity	Builder, Component Library	Complete design system (100+ tokens)
DetectedSection	Section Engine	Builder	Page section with slot assignments
SlotAssignment	Section Engine	Content Inferrer, Builder	Maps nodes to template slots
InferredContent	Content Inferrer	Builder	Smart placeholder content overrides
ContentPreset	Design Identity	Content Inferrer	Themed text for all section types
ColorPalette	Color Utils	Design Identity	8 color variants from one hex
QualityMetrics	Builder	Logging	Output quality measurements
color-utils.ts
Pure math color manipulation:

Color conversions: hex↔RGB↔HSL
generatePalette(hex) → 8 variants (base, hover, light, lighter, dark, glow, ring, contrast)
Color analysis: temperature (warm/cool/neutral), contrast (WCAG), light/dark detection
Secondary/accent generation from primary
Tailwind class helpers: bg(), text(), border(), gradient()
industry-content.ts
Data module with:

10 industry content banks (~500 pieces of content total)
60+ suggestion mappings (industry × tone → preset + color + fonts)
Lookup functions: getSuggestions(), getIndustryContent(), getIndustryIcons()
6. Variation Layer
File: variation-generator.ts
Purpose: Generate 3 visually contrasting variations from a single wireframe.

How It Works
text

1. SELECT 3 PRESETS with maximum visual contrast

   User selects: "startup-modern"
   Contrast map:
     startup-modern → [minimal-elegant, glass-gradient]
   Result: ["startup-modern", "minimal-elegant", "glass-gradient"]

2. RUN PIPELINE 3× (in parallel via Promise.all)

   For each preset:
     - Clone StyleGuide with preset override
     - Call generateFromFrame(frame, shapes, modifiedStyleGuide)
     - Full pipeline: Extract → Classify → Architect → Enhance →
                      Identity → Sections → Build
     - Return Variation { presetName, presetLabel, description, code }

3. Total time: < 300ms for all 3
   Total cost: ₹0
Contrast Mapping
text

startup-modern  → [minimal-elegant,  glass-gradient]   // modern vs refined vs dark
corporate-clean → [bold-creative,    glass-gradient]   // clean vs vibrant vs dark
bold-creative   → [minimal-elegant,  corporate-clean]  // vibrant vs refined vs clean
minimal-elegant → [bold-creative,    startup-modern]   // refined vs vibrant vs modern
dashboard-dense → [bold-creative,    glass-gradient]   // compact vs vibrant vs dark
glass-gradient  → [corporate-clean,  minimal-elegant]  // dark vs clean vs refined
Preset Selection Fallback
text

1. User explicitly selected preset → use it
2. No preset? Check brief.industry + brief.tone → getSuggestions().preset
3. Nothing at all → "startup-modern"
Key Optimization
The tree structure (Phases 1-3.5) is identical for all 3 variations — only the Design Identity (Phase 4) changes, which cascades different CSS classes through the builder.

7. End-to-End Walkthrough
Let's trace a complete example: User draws a simple landing page wireframe.

User's Drawing (inside a frame)
text

┌──────────────────────────────────────────┐  Frame: 1200×900px
│  ┌────────────────────────────────────┐  │
│  │ [text "Logo"]  [text "About"] [btn]│  │  Top band (~60px)
│  └────────────────────────────────────┘  │
│                                          │
│         [text "Welcome to Our App"]      │  H1 heading (~200px)
│         [text "Build faster"]            │  Subtitle (~250px)
│         [btn "Get Started"]              │  CTA button (~300px)
│                                          │
│   ┌──────┐   ┌──────┐   ┌──────┐       │
│   │ [img] │   │ [img] │   │ [img] │     │  3 feature cards (~550px)
│   │ [txt] │   │ [txt] │   │ [txt] │     │
│   │ [txt] │   │ [txt] │   │ [txt] │     │
│   └──────┘   └──────┘   └──────┘       │
│                                          │
│  ─────────────────────────────────────── │  Divider (~800px)
│  [text "© 2025"]                         │  Footer text (~850px)
└──────────────────────────────────────────┘
StyleGuide: { preset: "startup-modern", colors: { primary: "#4F46E5" }, brief: { industry: "tech", brandName: "Acme", tagline: "Ship faster" } }

Phase 1: Extractor
text

Input: 15 shapes on canvas, 1 frame
Output: 13 ExtractedShape[] (frame itself and 1 off-frame shape excluded)

Each shape gets frame-relative coordinates:
  text "Logo" → { relX: 30, relY: 15, width: 60, height: 25, ... }
  text "About" → { relX: 200, relY: 18, width: 70, height: 20, ... }
  btn (no text) → { relX: 350, relY: 12, width: 100, height: 35, ... }
  text "Welcome..." → { relX: 100, relY: 180, width: 400, height: 50, ... }
  ...etc
  
Sorted top-to-bottom, left-to-right
Phase 2: Classifier
text

text "Logo" (fontSize: 16, fontWeight: 600) → heading level 4
text "About" (fontSize: 14, fontWeight: 400) → paragraph
btn (no text, 100×35) → button (heuristic: small + short)
text "Welcome..." (fontSize: 36, fontWeight: 700) → heading level 1
text "Build faster" (fontSize: 18, fontWeight: 400) → paragraph  
btn "Get Started" → button (direct: buttonShape)
3× rect containers (200×250) → container (heuristic: too large for button)
3× imagePlaceholder → image (direct)
6× text shapes → heading/paragraph (by fontSize)
divider → divider (direct)
text "© 2025" (fontSize: 12) → paragraph
Phase 3: Architect
text

Containment analysis:
  - 3 images + 6 texts are inside the 3 containers (>70% overlap)
  - Container at top contains "Logo" + "About" + button (>70%)
  - Everything else is at root level

Tree structure:
root (column, 1200×900)
├── container-1 (row) → "Logo", "About", button
├── heading "Welcome..." (H1)
├── paragraph "Build faster"
├── button "Get Started"
├── container-2 (column) → image + text + text (feature 1)
├── container-3 (column) → image + text + text (feature 2)
├── container-4 (column) → image + text + text (feature 3)
├── divider
└── paragraph "© 2025"

Layout detection:
  container-1 children: similar Y → row
  containers 2-4: similar Y → root has mixed, but overall column
  
Gaps calculated between each consecutive root child
Phase 3.5: Enhancer (13 rules)
text

Rule 4 (Auto-Sticky Nav): container-1 has button at root top → not nav role, skip
  (Actually container-1 doesn't have nav role, but it's first child with button)
Rule 2 (Auto-Cardify): containers 2-4 have image+text → role upgraded to "card"
Rule 3 (Auto-Responsive Grid): containers 2-4 in row, similar widths → "responsive-grid-3"
Rule 5 (Auto-Hero): H1 heading at root top + paragraph → "hero-heading", "hero-text"
Rule 7 (Auto-Footer): divider + text at bottom → "footer" hint
Rule 12 (Feature Icons): cards have image+heading → "feature-card" hint
Rule 13 (Section Spacing): gaps increased at section boundaries (≥48px)
Phase 4: Design Identity
text

Input: StyleGuide { preset: "startup-modern", primary: "#4F46E5", brief: { industry: "tech", brandName: "Acme" } }

1. Preset resolved: "startup-modern"
2. Primary color: #4F46E5 → generatePalette():
   base: #4F46E5, hover: #4338CA, light: #EEF0FB, lighter: #F5F6FD,
   dark: #312E81, glow: rgba(79,70,229,0.25), contrast: #ffffff
3. Fonts: Inter (default)
4. Build: buildStartupModern(primaryPalette, ...) → DesignIdentity
5. Apply brief:
   - navBrand = "Acme"
   - footerCopy = "© 2025 Acme. All rights reserved."
   - Industry "tech" → heroHeadings: ["Ship faster, grow smarter", ...],
     ctaPrimary: ["Start Free Trial", ...], navLinks: ["Product", "Pricing", "Docs", "Blog"]
   - Tagline "Ship faster" → prepended to heroSubtexts
Phase 5: Section Engine
text

Flatten tree → 13 FlatNode[]

Detector 1 (NAV): Elements in top 12% (108px):
  "Logo" (y=15), "About" (y=18), button (y=12) → all in top band
  Detected! Slots: logo→"Logo", nav-link→"About", cta-secondary→button
  Consumed: 3 nodes

Detector 2 (FOOTER): Elements in bottom 18% (>738px):
  "© 2025" (y=850), divider (y=800) → bottom band
  Detected! Slots: footer-text→"© 2025"
  Consumed: 2 nodes (+ divider)

Detector 3 (HERO): Large heading in top 45%:
  "Welcome..." is H1 at y=180 → detected!
  Nearby: "Build faster" (paragraph, y=250), "Get Started" (button, y=300)
  No adjacent image → hero-centered
  Slots: heading→H1, subtext→paragraph, cta-primary→button
  Consumed: 3 nodes

Detector 5 (FEATURES): 3 cards in row:
  containers 2-4 are cards, similar widths, same vertical band
  Detected! Slots: feature-0, feature-1, feature-2
  Children consumed too (images + texts)
  Consumed: 3 cards + 9 children

Remaining: 0 nodes → no generic section needed

Result: [nav(0), hero-centered(1), features(3), footer(99)]
Sorted by orderIndex: nav → hero → features → footer
Phase 6: Builder
text

For each section:

NAV:
  inferSectionContent(navSlots, "nav", identity)
    → logo: "Logo" → user text, keep it
    → nav-link: "About" → user text, keep it
    → cta-secondary: blank button → inferred: "Log In" (ghost variant)
  Defaults added: + "Sign Up" (primary, arrow-right icon)
  renderNav(identity, "Logo", [loginBtn, signupBtn], ["About"])
  → <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl...">

HERO:
  inferSectionContent(heroSlots, "hero-centered", identity)
    → heading: "Welcome..." → user text, keep it
    → subtext: "Build faster" → user text, keep it  
    → cta-primary: "Get Started" → user text, keep + arrow-right icon
  renderHeroCentered(identity, "Welcome...", "Build faster", { text: "Get Started", icon: "arrow-right" })
  → <div className="text-center space-y-8 max-w-3xl mx-auto">
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight...">

FEATURES:
  inferSectionContent(featureSlots, "features", identity)
    → No user text on cards → all inferred from tech content bank:
      featureTitles: ["Lightning Fast", "Enterprise Security", "Auto Scaling"]
      featureTexts: ["Built on the edge for sub-millisecond...", ...]
    → Icons: zap, shield-check, sparkles (from getFeatureIcons)
  renderFeatureGrid(identity, "Everything you need", desc, [card1, card2, card3], 3)
  → <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

FOOTER:
  inferSectionContent(footerSlots, "footer", identity)
    → footer-text: "© 2025" → user text → replaced by identity.content.footerCopy:
      "© 2025 Acme. All rights reserved."
    → Default footer links: ["Privacy", "Terms", "GitHub", "Twitter", "Status"]
  renderFooter(identity, "Acme", links, copyright)

Assembly:
  Page wrapper → nav → <main> → hero section → features section → </main> → footer → close wrapper

Quality metrics logged:
  classes: ~280, responsive: ~35, hover: ~20, focus: ~15,
  sections: 4, lines: ~180, backgrounds: 6, typography: 8
Final Output (abbreviated)
React

export default function GeneratedUI() {
  return (
    {/* Fonts: Inter */}
    <div className="min-h-screen bg-gray-50 antialiased">
      <div className="flex flex-col min-h-screen">
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl...">
          <!-- Logo + Nav Links + CTA Buttons + Hamburger -->
        </nav>

        <main className="flex-1">
          <section className="py-24 sm:py-32 bg-gradient-to-b from-white via-[#f5f6fd] to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <!-- Hero: heading + subtext + CTA group -->
            </div>
          </section>

          <section className="py-16 sm:py-24 bg-gray-50/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <!-- Features: section heading + 3 feature cards grid -->
            </div>
          </section>
        </main>

        <footer className="py-12 sm:py-16 bg-gray-900 text-gray-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Brand + links + copyright -->
          </div>
        </footer>
      </div>
    </div>
  );
}
180 lines, ~280 Tailwind classes, 4 detected sections, fully responsive, with hover/focus/active states, SVG icons, gradient backgrounds, and tech-specific content — all in under 300ms with zero AI calls.

8. Type System & Data Contracts
How Types Flow Between Phases
text

Phase 1                    Phase 2                    Phase 3
Shape ──────────────► ExtractedShape ──────────► ClassifiedComponent ──────────►
  canvas shape             + relX, relY,              + role (UIRole)
  (any type)               + width, height,           + text, properties
                           + centerX, centerY         + same position data

Phase 3                   Phase 3.5                  Phase 5
──► UINode ──────────────► UINode ──────────────────► DetectedSection[]
    + children: UINode[]     same type,                 + type (SectionType)
    + layout: row|column     + enhancementHints[]       + slots: SlotAssignment[]
    + gaps: number[]         populated                  + confidence, position
    + enhancementHints: []                              + orderIndex

                                                     Phase 6
StyleGuide ──── Phase 4 ──►  DesignIdentity ─────────►
  colors, fonts,               100+ tokens              Builder reads every
  brief, preset                (all Tailwind classes)   token to produce JSX

                  Phase 6 helpers
                  InferredContent ─► text, icon, variant overrides
                  ContentPreset ──► themed placeholder strings
                  ColorPalette ───► 8 color variants per hue
The Complete DesignIdentity is the Central Contract
Every downstream function reads from DesignIdentity:

text

component-library.ts:
  renderButton reads → identity.components.button.primary
                       identity.components.button.sizes[size]
                       identity.typography.bodyFont
                       
  renderHeading reads → identity.typography.display/h1/h2/h3/h4
                        identity.colors.textPrimary
                        identity.typography.headingFont
                        identity.typography.headingMaxW

  renderNav reads → identity.components.nav.wrapper
                    identity.components.nav.container
                    identity.components.nav.logo
                    identity.components.nav.logoIcon
                    identity.components.nav.link
                    identity.components.nav.mobileToggle
                    identity.colors.textPrimary
                    identity.spacing.elementGap

  renderSectionWrapper reads → identity.sections[sectionType]
                               identity.spacing.container/containerSm
                               identity.spacing.stackLg

builder.ts:
  getSectionBackground reads → identity.backgrounds.hero/subtle/accent/cta/inverse

content-inferrer.ts:
  inferContent reads → identity.content.heroHeadings
                       identity.content.ctaPrimary
                       identity.content.navBrand
                       identity.content.footerCopy
                       identity.content.featureTitles
                       etc.
Change the DesignIdentity → change every class in the output.
This is what enables the variation system: same tree, different identity, completely different visual output.

This document covers the complete deterministic pipeline of D2D v3.0. Every phase, every file, every data transformation — from raw canvas shapes to production-ready React + Tailwind code — running in under 300ms with zero AI calls and zero cost.