# D2D AI Generation Pipeline v2.0 — Product & Technical Document

---

## CLASSIFICATION

```
Document Type:     Product & Technical Specification
Version:           Pipeline v2.0 — Deterministic Generation Engine
Audience:          Investors, Technical Evaluators, Engineering Leads
Status:            SHIPPED & DEPLOYED IN PRODUCTION
Predecessor:       MVP Product Document (v1.0)
Last Updated:      2025
```

---

## TABLE OF CONTENTS

```
PART 1: EXECUTIVE OVERVIEW
  1.1  What v2.0 Is                                (Line 38)
  1.2  The Strategic Decision                      (Line 75)
  1.3  Key Results                                 (Line 115)

PART 2: THE ENGINEERING PROBLEM
  2.1  Why Generation Is Hard                      (Line 145)
  2.2  Three Approaches Considered                  (Line 185)
  2.3  Why Deterministic Won                       (Line 260)

PART 3: PIPELINE ARCHITECTURE
  3.1  Seven-Phase Overview                        (Line 310)
  3.2  Data Flow (End to End)                      (Line 355)
  3.3  File Manifest                               (Line 405)

PART 4: SHARED TYPE SYSTEM
  4.1  Core Interfaces                             (Line 440)
  4.2  Type Safety Guarantees                      (Line 510)

PART 5: PHASE 1 — EXTRACTOR
  5.1  Purpose and Contract                        (Line 540)
  5.2  Universal Bounding Box                      (Line 565)
  5.3  Overlap-Ratio Containment                   (Line 605)
  5.4  Coordinate Normalization                    (Line 635)

PART 6: PHASE 2 — CLASSIFIER
  6.1  Purpose and Contract                        (Line 665)
  6.2  Direct Mapping (Known Types)                (Line 690)
  6.3  Heuristic Mapping (Generic Types)           (Line 730)
  6.4  Text Intelligence                           (Line 760)
  6.5  Annotation Exclusion                        (Line 790)

PART 7: PHASE 3 — ARCHITECT
  7.1  Purpose and Contract                        (Line 815)
  7.2  Three Critical Fixes From v1                (Line 840)
  7.3  Tree Construction Algorithm                  (Line 905)

PART 8: PHASE 3.5 — ENHANCER
  8.1  Why This Phase Exists                       (Line 950)
  8.2  The Eight Enhancement Rules                 (Line 990)
  8.3  Impact Demonstration                        (Line 1120)

PART 9: PHASE 4 — STYLIST
  9.1  Purpose and Contract                        (Line 1155)
  9.2  Design Token Derivation                     (Line 1180)
  9.3  Semantic Color Mapping                      (Line 1215)
  9.4  Seeded Variation Engine                     (Line 1245)
  9.5  Per-Role Class Generation                   (Line 1275)

PART 10: PHASE 5 — BUILDER
  10.1 Purpose and Contract                        (Line 1325)
  10.2 JSX Generation Strategy                     (Line 1345)
  10.3 Gap Strategy (Uniform vs Per-Gap)           (Line 1380)
  10.4 Output Format                               (Line 1410)

PART 11: PHASE 6 — DISPLAY
  11.1 Sandpack Live Preview                       (Line 1440)
  11.2 Generation Panel UI                         (Line 1465)
  11.3 Generation Button Integration               (Line 1495)

PART 12: PIPELINE ORCHESTRATOR
  12.1 Main Function                               (Line 1525)
  12.2 Empty Frame Handling                        (Line 1555)
  12.3 Error Boundaries                            (Line 1575)

PART 13: INTEGRATION & DEPLOYMENT
  13.1 Codebase Integration                        (Line 1600)
  13.2 Dependency Footprint                        (Line 1625)
  13.3 Build and Test Execution                    (Line 1645)

PART 14: QUALITY, EDGE CASES, TESTING
  14.1 Edge Case Matrix                            (Line 1690)
  14.2 Seven Verification Scenarios                (Line 1730)
  14.3 Quality Metrics                             (Line 1790)

PART 15: BUSINESS IMPACT & OUTLOOK
  15.1 Cost Structure Advantage                    (Line 1825)
  15.2 Competitive Technical Moat                  (Line 1860)
  15.3 Roadmap From v2.0 Forward                   (Line 1895)

APPENDIX A: ARCHITECTURE DIAGRAMS                 (See end of document)
APPENDIX B: DATA FLOW DIAGRAMS                    (See end of document)
APPENDIX C: V2.0 PIPELINE SUMMARY                 (See end of document)
```

---

# PART 1: EXECUTIVE OVERVIEW

---

## 1.1 WHAT V2.0 IS

The v2.0 release is the AI Generation Pipeline — the core engine
that converts hand-drawn wireframes into production-ready React
code with Tailwind CSS styling.

This is the product's central value proposition made real.
The MVP (v1.0) shipped the application shell: canvas, projects,
authentication, payments, and style guide. The pipeline is the
engine that turns all of that infrastructure into a product
users actually pay for.

The pipeline is a seven-phase deterministic processing system
that takes raw shape data from the drawing canvas and produces
a complete, styled, responsive React component.
It runs entirely in the user's browser.
It makes zero API calls to any external service.
It completes in under one hundred milliseconds.
It costs exactly zero rupees per generation.
It produces identical output for identical input every time.

The pipeline is not a wrapper around a large language model.
It is not a thin layer on top of computer vision.
It is a purpose-built layout intelligence engine that reads
structured spatial data and applies deterministic design rules
to produce professional-quality code output.

The system comprises approximately 1,300 lines of TypeScript
across eleven files, with a clean separation of concerns
across seven sequential processing phases. Each phase has
a single responsibility, typed inputs and outputs, and can be
tested, debugged, and improved independently.

---

## 1.2 THE STRATEGIC DECISION

The most consequential technical decision in D2D's development
was choosing deterministic processing over AI-dependent approaches.

Three paths were evaluated. The first was computer vision
with YOLO object detection and OCR text recognition,
with a large language model fallback. The second was a direct
deterministic pipeline reading structured data from the
application's own state management system. The third was a
hybrid approach using the deterministic pipeline for structure
with Google Gemini for styling enhancement.

The deterministic approach was selected for five reasons.

```
REASON 1: DATA QUALITY
  The application's Redux state contains precise, typed,
  structured data for every shape on the canvas.
  Position, size, type, color, text content — all stored
  as exact numerical values in a normalized state tree.

  Computer vision would attempt to RECOVER this data
  from a screenshot. The data already exists in structured
  form. Using CV to detect what we already know is
  architecturally backwards.

REASON 2: COST STRUCTURE
  LLM APIs charge per request. At scale, this creates
  variable costs that directly oppose margin expansion.
  A deterministic pipeline has zero marginal cost.
  The cost per generation is the same whether we serve
  one user or one million users: zero.

REASON 3: SPEED
  LLM generation takes 5-30 seconds per request.
  Deterministic processing takes under 100 milliseconds.
  This is a 50-300x speed advantage that directly impacts
  user experience and perceived product quality.

REASON 4: RELIABILITY
  LLM output is non-deterministic. The same prompt produces
  different results on each invocation. This makes debugging
  impossible, quality control unpredictable, and user
  expectations unmanageable.
  Deterministic output is perfectly reproducible.
  Same input always produces same output.

REASON 5: INDEPENDENCE
  LLM dependency means dependency on a third-party provider.
  API changes, pricing changes, rate limits, outages, and
  deprecations are all outside our control.
  A deterministic pipeline runs in the browser with zero
  external dependencies. It works offline.
```

This decision created a permanent structural advantage.
Competitors using LLM-based generation cannot replicate
our cost structure, speed, or reliability without
fundamentally rebuilding their architecture.

---

## 1.3 KEY RESULTS

```
┌────────────────────────────────────────────────────────────┐
│  PIPELINE v2.0 — KEY RESULTS                              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  PERFORMANCE                                               │
│  ├── Generation time:        < 100 milliseconds            │
│  ├── Cost per generation:    ₹0 (zero)                     │
│  ├── Processing location:    Client browser (no server)    │
│  ├── API calls required:     Zero                          │
│  ├── Network requests:       Zero                          │
│  ├── Deterministic output:   Yes (100% reproducible)       │
│  └── Offline capable:        Yes                           │
│                                                            │
│  CODE QUALITY                                              │
│  ├── Output format:          React + Tailwind CSS          │
│  ├── Output size:            50-300 lines per generation   │
│  ├── Responsive classes:     Yes (mobile-first)            │
│  ├── Interactive states:    Hover, focus, transitions     │
│  ├── Semantic HTML:          Proper heading levels, labels │
│  ├── Accessibility:         Focus rings, ARIA hints       │
│  └── Design patterns:        Auto-detected and applied     │
│                                                            │
│  ENGINEERING                                               │
│  ├── Total pipeline code:   ~1,300 lines TypeScript       │
│  ├── Files:                  11 (8 pipeline + 3 UI)        │
│  ├── New dependencies:      1 (Sandpack for preview)       │
│  ├── Redux changes:          Zero                          │
│  ├── Schema changes:         Zero                          │
│  ├── Breaking changes:       Zero                          │
│  ├── Test scenarios:        7 verification cases          │
│  └── Edge cases handled:    14 documented cases            │
│                                                            │
│  INTELLIGENCE                                               │
│  ├── Shape types supported: 26 (of 26 in the system)      │
│  ├── UI roles classified:    17 semantic categories         │
│  ├── Enhancement rules:     8 design pattern detectors     │
│  ├── Layout detection:      Row, column, grid, centered   │
│  ├── Section detection:     Nav, hero, form, footer        │
│  └── Spacing preservation:  Per-gap (not averaged)        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

# PART 2: THE ENGINEERING PROBLEM

---

## 2.1 WHY GENERATION IS HARD

Converting a visual wireframe to production code is not
a simple template-mapping problem. The difficulty lies in
four compounding challenges that interact with each other.

```
CHALLENGE 1: SHAPE DIVERSITY
  The D2D canvas supports 26 distinct shape types.
  Each shape type has different properties, different
  coordinate systems, and different semantic meanings.

  A rectangle might be a button, an input field, a container,
  a card, or a decorative element. Its meaning depends on
  its size, position, and relationship to other shapes.

  The pipeline must handle bounded shapes (x,y,w,h),
  line-like shapes (startX,startY,endX,endY),
  freehand shapes (points array), and text shapes
  (position only, dimensions calculated from content).


CHALLENGE 2: SPATIAL REASONING
  A flat list of shapes must be converted into a nested
  hierarchy. Containment (what is inside what), adjacency
  (what is next to what), and layout direction (row vs column)
  must all be inferred from raw coordinate data.

  This is fundamentally a geometric computation problem.
  Getting it wrong produces broken layouts where elements
  appear outside their containers or in wrong reading order.


CHALLENGE 3: DESIGN INTELLIGENCE
  Structurally correct code is not the same as professionally
  designed code. A login form that is technically functional
  but renders as a full-width column of elements with no
  centering, no card wrapper, and no spacing hierarchy
  looks amateur regardless of structural correctness.

  The pipeline must recognize design PATTERNS and apply
  design BEST PRACTICES — centering forms, responsifying grids,
  sticking navigation bars, grouping related inputs.


CHALLENGE 4: STYLE APPLICATION
  Users configure colors and typography in a style guide.
  These preferences must map SEMANTICALLY — primary color
  goes on buttons and links, not on background. Heading font
  goes on headings, not on body text. Border color goes on
  borders, not on text.

  Naive mapping (first color goes everywhere) produces
  visually incoherent output.
```

---

## 2.2 THREE APPROACHES CONSIDERED

```
APPROACH 1: COMPUTER VISION + LLM

  Architecture:
    Screenshot of canvas frame → YOLO v8-Nano for element
    detection → PaddleOCR for text extraction → Rule-based
    classifier → Layout builder → Code templates.
    Fallback: Send screenshot to GPT-4 Vision or Claude
    for direct code generation.

  Five-phase design:
    Phase 1 (Eye):     YOLO detects UI components from pixels
    Phase 2 (Reader):  OCR reads text labels from regions
    Phase 3 (Judge):   Rules combine detection + OCR evidence
    Phase 4 (Architect): Organize into nested structure
    Phase 5 (Builder): Templates produce React code

  Why it was rejected:

    DATA REDUNDANCY:
    The Redux state already contains exact type, position,
    size, and text for every shape. Using computer vision
    to re-detect this information from a screenshot is
    recovering data we already have — with lower accuracy
    and higher computational cost.

    TRAINING DATA GAP:
    YOLO requires thousands of labeled training images
    of hand-drawn wireframes. This dataset does not exist.
    Creating it would take weeks of manual annotation work
    with no guarantee of detection quality.

    LLM COST:
    GPT-4 Vision costs $0.01-0.03 per image analysis.
    At 1,000 daily generations, that is $10-30 per day
    or $300-900 per month — before any user revenue.
    At scale, costs grow linearly with usage.

    DEPLOYMENT COMPLEXITY:
    YOLO and PaddleOCR require Python backend infrastructure.
    This adds a second language, a second deployment target,
    model file hosting, GPU considerations, and a cross-
    language API boundary to maintain.

    INCONSISTENCY:
    LLM output varies between identical requests.
    Two users with the same wireframe would get different code.
    Quality control becomes impossible.

  Status: ABANDONED. Lessons retained for future upload feature.


APPROACH 2: DETERMINISTIC PIPELINE (SELECTED)

  Architecture:
    Redux state → Structured extraction → Rule-based
    classification → Geometric hierarchy building →
    Pattern enhancement → Style application → Code generation.

  Why it was selected:

    ZERO COST:
    All processing runs in the user's browser.
    No server computation. No API calls. No variable costs.

    INSTANT SPEED:
    String concatenation and array iteration complete in
    under 100 milliseconds. No network latency.

    PERFECT DETERMINISM:
    Identical inputs always produce identical outputs.
    Debuggable, testable, predictable.

    RICHER DATA:
    Shape type, variant, text content, font properties,
    dimensions — all available directly. No detection needed.

    ZERO DEPENDENCIES:
    No external AI services. No model hosting. No API keys.
    Works offline. Works without internet.

  Status: SELECTED AND SHIPPED.


APPROACH 3: DETERMINISTIC + GEMINI HYBRID

  Architecture:
    Deterministic pipeline produces base code → Structured
    prompt sent to Google Gemini free tier → Gemini returns
    enhanced styling suggestions → Applied to output.

  Why it was rejected:

    MARGINAL IMPROVEMENT:
    Multiple prompt engineering iterations produced only
    small CSS improvements. The output was slightly better
    but not transformatively different.

    RATE LIMITS:
    Gemini free tier allows 15 requests per minute.
    This is insufficient for production usage and would
    create visible delays and errors for users.

    SERVICE DEPENDENCY:
    Google's free tier availability is not guaranteed.
    Building a production feature on a free API is a
    business risk. The tier could be deprecated, throttled,
    or removed at any time.

    WRONG DIAGNOSIS:
    The core problem was not that AI was needed.
    The problem was that the deterministic pipeline
    produced too few Tailwind classes per element.
    The fix was richer deterministic output, not AI overlay.

  Status: ABANDONED. Insight about CSS volume retained.
```

---

## 2.3 WHY DETERMINISTIC WON

The selection of the deterministic approach is not a compromise.
It is a structural competitive advantage.

```
COMPARISON: DETERMINISTIC vs LLM-BASED GENERATION

  ┌──────────────────────────┬───────────────┬───────────────┐
  │ Dimension                │ Deterministic │ LLM-Based     │
  ├──────────────────────────┼───────────────┼───────────────┤
  │ Cost per generation      │ ₹0            │ ₹1-10         │
  │ Speed per generation     │ <100ms        │ 5-30 seconds  │
  │ Reproducibility          │ 100%          │ ~0%           │
  │ Offline capability       │ Yes           │ No            │
  │ Rate limits              │ None          │ Provider-set  │
  │ Third-party dependency   │ None          │ Critical      │
  │ Debugging difficulty     │ Low           │ Very high     │
  │ Quality floor            │ Consistent    │ Variable      │
  │ Quality ceiling          │ Design-bound  │ Model-bound   │
  │ Scaling cost             │ $0 additional │ Linear growth │
  │ Infrastructure           │ Browser only  │ API + backend │
  └──────────────────────────┴───────────────┴───────────────┘

  The only advantage of LLM approaches is a potentially
  higher quality ceiling for open-ended generation.
  But D2D's generation is NOT open-ended — it is constrained
  by the user's spatial layout. The user already drew the
  layout. We do not need to invent one.

  For constrained generation from structured input,
  deterministic processing is strictly superior.
```

---

# PART 3: PIPELINE ARCHITECTURE

---

## 3.1 SEVEN-PHASE OVERVIEW

The pipeline processes shapes through seven sequential phases.
Each phase has a single responsibility, accepts typed input,
and produces typed output. No phase depends on external services.

```
USER CLICKS "GENERATE" ON A FRAME
        │
        ▼
PHASE 1: EXTRACTOR
  Input:   Frame shape + all canvas shapes
  Logic:   Filter shapes inside frame using overlap ratio
  Output:  ExtractedShape[] (positions relative to frame origin)
        │
        ▼
PHASE 2: CLASSIFIER
  Input:   ExtractedShape[]
  Logic:   Map each shape to a semantic UI role using type +
           geometry heuristics
  Output:  ClassifiedComponent[] (each shape has a UI role)
        │
        ▼
PHASE 3: ARCHITECT
  Input:   ClassifiedComponent[]
  Logic:   Build parent-child tree using overlap containment,
           detect row vs column layout, calculate per-gap spacing
  Output:  UINode tree (nested hierarchy with layout metadata)
        │
        ▼
PHASE 3.5: ENHANCER
  Input:   UINode tree
  Logic:   Apply 8 deterministic design pattern rules that
           upgrade raw layout into polished design
  Output:  UINode tree (same structure, enhanced with hints)
        │
        ▼
PHASE 4: STYLIST
  Input:   UINode tree + user's StyleGuide configuration
  Logic:   Derive design tokens from style guide, generate
           Tailwind CSS class strings for every node
  Output:  UINode tree (each node now has tailwindClasses)
        │
        ▼
PHASE 5: BUILDER
  Input:   Styled UINode tree
  Logic:   Recursive JSX generation with semantic HTML,
           gap handling, dimension styles
  Output:  String (complete React + Tailwind component)
        │
        ▼
PHASE 6: DISPLAY
  Input:   Generated code string
  Logic:   Sandpack live editor + preview iframe
  Output:  Visual panel with code editing and live rendering

ALL PHASES RUN IN THE BROWSER. NO API. NO SERVER. ₹0.
```

---

## 3.2 DATA FLOW (END TO END)

```
SOURCE: Redux store → state.shapes.entities
  Contains every shape on the canvas with full metadata.
  This is the ONLY data source for the entire pipeline.
  No screenshots. No image processing. No file uploads.

PHASE 1 OUTPUT: ExtractedShape[]
  Each element contains:
    originalShape    Full Redux shape object (preserved for Phase 2)
    relX, relY       Position relative to frame top-left corner
    width, height    Absolute dimensions
    centerX, centerY Calculated center point

  Shapes are sorted top-to-bottom, then left-to-right.
  This natural reading order propagates through all phases.

PHASE 2 OUTPUT: ClassifiedComponent[]
  Each element adds:
    id               Shape's unique identifier
    role             Semantic UI role (button, input, heading, etc.)
    text             Extracted text content (if applicable)
    properties       Role-specific metadata (variant, label, etc.)

  Annotation shapes (sticky notes, arrows, freehand) are
  EXCLUDED at this stage. They are design notes, not UI elements.

PHASE 3 OUTPUT: UINode (tree root)
  Flat list becomes nested tree:
    children[]       Direct child nodes
    layout           "row" or "column" for this node's children
    gaps[]           Pixel spacing between each consecutive child pair
    enhancementHints Empty array (populated by Phase 3.5)

  Tree root represents the frame boundary itself.
  Containment uses 70% overlap ratio (not center-point).
  Layout detection uses relative threshold (not fixed pixels).
  Gap calculation preserves per-pair spacing (not averaged).

PHASE 3.5 OUTPUT: UINode (enhanced tree)
  Same tree structure with enhancement hints added:
    enhancementHints  String tags like "centered-form",
                      "responsive-grid-3", "sticky-nav",
                      "hero-heading", "auto-card", "footer"

  These hints are READ by Phase 4 (Stylist) to apply
  appropriate CSS classes. The tree structure itself may
  also be modified (role upgrades, gap adjustments).

PHASE 4 OUTPUT: UINode (styled tree)
  Each node gains:
    tailwindClasses   Complete Tailwind class string for this node

  Classes are generated from DesignTokens (derived from
  the user's style guide) combined with enhancement hints.
  Different roles get different class patterns.
  The same role with different hints gets different classes.

PHASE 5 OUTPUT: string
  A complete, self-contained React functional component.
  Exported as default. Named "GeneratedUI".
  Contains only JSX with Tailwind utility classes.
  No imports beyond React (implicit in JSX).
  Ready to paste into any React + Tailwind project.

PHASE 6 OUTPUT: Visual UI
  Sandpack renders the component with live preview.
  User sees code on the left, rendered result on the right.
  Copy to clipboard button. Download as .tsx file.
  Regenerate button for iterating.
```

---

## 3.3 FILE MANIFEST

```
PIPELINE FILES (8 files, ~1,080 lines):

  src/lib/ai-pipeline/
  ├── types.ts           ~70 lines    Shared interfaces and type defs
  ├── extractor.ts       ~100 lines   Phase 1: shape extraction
  ├── classifier.ts      ~160 lines   Phase 2: role classification
  ├── architect.ts       ~170 lines   Phase 3: tree construction
  ├── enhancer.ts        ~250 lines   Phase 3.5: pattern enhancement
  ├── stylist.ts         ~220 lines   Phase 4: style application
  ├── builder.ts         ~200 lines   Phase 5: code generation
  └── index.ts           ~50 lines    Pipeline orchestrator

UI FILES (3 files, ~220 lines):

  src/components/generation/
  ├── generation-panel.tsx    ~80 lines   Sandpack preview panel
  ├── generation-button.tsx   ~60 lines   Trigger button on frames
  └── generation-progress.tsx ~80 lines   Animated progress steps

MODIFIED FILES (2 files, minimal changes):

  src/components/canvas/shapes/frame/index.tsx   +2 lines
    Import and render GenerationButton on selected frames.

  package.json                                   +1 dependency
    @codesandbox/sandpack-react for live preview.

TOTAL: 13 files, ~1,300 lines of new code.
```

---

# PART 4: SHARED TYPE SYSTEM

---

## 4.1 CORE INTERFACES

The type system defines five core interfaces that form the
contract between pipeline phases. Every phase reads typed input
and produces typed output. No untyped data crosses phase boundaries.

```
UI ROLES (17 semantic categories):

  container        Generic grouping element (div wrapper)
  card             Elevated content group (shadow, border, padding)
  button           Interactive click target
  input            Text entry field
  checkbox         Boolean toggle with label
  heading          Text with heading level (h1-h4)
  paragraph        Body text content
  image            Image placeholder
  video            Video placeholder with play indicator
  chart            Data visualization placeholder
  divider          Horizontal separator line
  nav              Navigation bar container
  avatar           Circular user image placeholder
  icon             Small graphic element
  device-wrapper   Device frame (phone, tablet mockup)
  decorative       Non-semantic visual element
  annotation       Design note (excluded from generation)


EXTRACTED SHAPE:
  Produced by Phase 1. Represents a shape with coordinates
  normalized relative to the frame's top-left corner.

  Fields:
    originalShape    The full Redux shape object
    relX, relY       Position relative to frame origin (0,0)
    width, height    Absolute pixel dimensions
    centerX, centerY Calculated center for containment checks


CLASSIFIED COMPONENT:
  Produced by Phase 2. Adds semantic role to extracted shape.

  Fields:
    id               Unique identifier from the shape
    role             One of the 17 UIRole values
    relX, relY       Inherited from extraction
    width, height    Inherited from extraction
    centerX, centerY Inherited from extraction
    text             Content text (optional, for text/button/etc.)
    properties       Role-specific metadata (variant, label, etc.)
    originalShape    Preserved for downstream reference


UI NODE:
  Produced by Phase 3. Tree structure with layout metadata.

  Fields:
    id               Identifier
    role             Semantic role
    relX, relY       Position
    width, height    Dimensions
    text             Content (optional)
    properties       Role metadata
    children         Array of child UINode (tree structure)
    layout           "row" or "column" layout direction
    gaps             Per-gap pixel spacing between children
    enhancementHints Array of string hints (populated by Phase 3.5)
    tailwindClasses  Tailwind class string (populated by Phase 4)


DESIGN TOKENS:
  Produced by Phase 4 from the user's style guide.

  Fields:
    colors.primary       Primary action color (buttons, links)
    colors.secondary     Secondary action color
    colors.accent        Accent highlight color
    colors.background    Page background
    colors.surface       Card and container background
    colors.textHeading   Heading text color
    colors.textBody      Body text color
    colors.textMuted     Caption and helper text color
    colors.border        Border and divider color
    font.heading         Heading font family name
    font.body            Body font family name
    variation.borderRadius  Global radius setting (sm/md/lg/xl)
    variation.shadow     Global shadow setting (none/sm/md/lg)
    variation.spacing    Global density setting (compact/comfortable/spacious)
```

---

## 4.2 TYPE SAFETY GUARANTEES

```
Every phase boundary is type-checked at compile time.

  Phase 1 returns ExtractedShape[].
  Phase 2 accepts ExtractedShape[] and returns ClassifiedComponent[].
  Phase 3 accepts ClassifiedComponent[] and returns UINode.
  Phase 3.5 accepts UINode and returns UINode.
  Phase 4 accepts UINode and returns UINode (with tailwindClasses).
  Phase 5 accepts UINode and returns string.

If any phase changes its output shape, TypeScript catches
the mismatch at the next phase's input boundary.
This makes refactoring safe and regressions detectable
before the code ever runs.

No 'any' types are used in the pipeline except where
the Redux Shape type itself uses 'any' for flexible
shape property storage. The pipeline normalizes this
into typed interfaces at the extraction boundary.
```

---

# PART 5: PHASE 1 — EXTRACTOR

---

## 5.1 PURPOSE AND CONTRACT

```
RESPONSIBILITY:
  Given a frame and all shapes on the canvas, extract only
  the shapes that are inside the frame and normalize their
  coordinates relative to the frame's top-left corner.

INPUT:
  frame: FrameShape       The generation target frame
  allShapes: Shape[]      Every shape on the canvas

OUTPUT:
  ExtractedShape[]        Shapes inside frame with relative coords

EXCLUSIONS:
  The frame itself is excluded from its own extraction.
  Other frames are excluded (frames are artboards, not content).
  GeneratedUI shapes are excluded (previous generation output).
  Shapes with near-zero dimensions (< 2px) are excluded.
```

---

## 5.2 UNIVERSAL BOUNDING BOX

The canvas supports 26 shape types across four different
coordinate systems. The extractor provides a universal
bounding box calculator that handles all of them.

```
COORDINATE SYSTEM 1: BOUNDED SHAPES (x, y, w, h)
  Covers 18 shape types: rect, roundedRect, ellipse, circle,
  triangle, star, polygon, divider, stickyNote, speechBubble,
  imagePlaceholder, videoPlaceholder, chartPlaceholder,
  buttonShape, inputField, checkbox, hamburgerMenu, deviceFrame.
  Bounding box: direct from shape properties.

COORDINATE SYSTEM 2: LINE-LIKE (startX, startY, endX, endY)
  Covers: arrow, line, connector.
  Bounding box: min/max of start and end points; min dimension 1px.

COORDINATE SYSTEM 3: POINT-ARRAY (points[])
  Covers: freedraw, highlighter.
  Bounding box: min/max of all points; empty arrays return null.

COORDINATE SYSTEM 4: TEXT (x, y, fontSize, text)
  Covers: text.
  Width: char count × fontSize × 0.55; height: fontSize × lineHeight × lines.
  Min width 100px.
```

---

## 5.3 OVERLAP-RATIO CONTAINMENT

```
Center-point containment fails for shapes that are mostly
inside but have center past the edge. Fix: overlap ratio.

  Intersection area = shape bbox ∩ frame bbox.
  Ratio = intersection / shape area.
  If ratio >= 50%, shape is "inside" the frame.
```

---

## 5.4 COORDINATE NORMALIZATION

```
relX = shape.absoluteX - frame.x
relY = shape.absoluteY - frame.y
centerX = relX + width/2, centerY = relY + height/2

Shapes sorted: primary by relY (top-to-bottom), secondary by relX
(left-to-right). Same vertical line = within 10px relY.
```

---

# PART 6: PHASE 2 — CLASSIFIER

---

## 6.1 PURPOSE AND CONTRACT

```
RESPONSIBILITY: Assign semantic UI role to every extracted shape.
INPUT: ExtractedShape[]
OUTPUT: ClassifiedComponent[] (roles assigned)
EXCLUSION: Annotation shapes (stickyNote, speechBubble, arrow,
connector, freedraw, highlighter) excluded — design notes, not UI.
```

---

## 6.2 DIRECT MAPPING (KNOWN TYPES)

```
buttonShape → button; inputField → input; checkbox → checkbox;
hamburgerMenu → nav; imagePlaceholder → image; videoPlaceholder → video;
chartPlaceholder → chart; divider → divider; deviceFrame → device-wrapper;
text → see 6.4. Direct mappings preserve text, variant, label, etc.
```

---

## 6.3 HEURISTIC MAPPING (GENERIC TYPES)

```
rect: w>150 and h 30–60 → input; w≤200 and h 25–60 → button; else container.
roundedRect: w≤200 and h≤60 → button; else card.
ellipse/circle: w,h<60 → avatar; else decorative.
triangle, star, polygon → decorative.
```

---

## 6.4 TEXT INTELLIGENCE

```
Heading: fontSize≥32 and fontWeight≥600 → h1; ≥24 and ≥600 → h2;
≥20 and ≥500 → h3; ≥18 and ≥500 → h4; else paragraph.
All text props (content, fontSize, fontWeight, fontFamily, etc.) preserved.
```

---

## 6.5 ANNOTATION EXCLUSION

```
Six types classified as annotation and excluded: stickyNote, speechBubble,
arrow, connector, freedraw, highlighter. Filter runs before output array.
```

---

# PART 7: PHASE 3 — ARCHITECT

---

## 7.1 PURPOSE AND CONTRACT

```
RESPONSIBILITY: Convert flat ClassifiedComponent[] into nested UINode tree.
INPUT: ClassifiedComponent[], frameWidth, frameHeight
OUTPUT: UINode (root with children, layout, gaps)
```

---

## 7.2 THREE CRITICAL FIXES FROM V1

```
FIX 1: Overlap ratio containment (≥70% of child area in parent)
  instead of center-point containment.

FIX 2: Relative row threshold = min(5% frame height, 50% avg child height)
  instead of fixed 30px. Majority rule for row vs column.

FIX 3: Per-gap array (gaps[i] = space between child i and i+1),
  snapped to Tailwind scale; Builder uses gap-X or per-child margin.
```

---

## 7.3 TREE CONSTRUCTION ALGORITHM

```
Step 1: For each component, find smallest containing parent (≥70% overlap).
  Only container, card, device-wrapper can be parents.
Step 2: Group by parent; no parent → root children.
Step 3: For each parent, build UINode: detect layout, sort children, per-gap.
Step 4: Root = frame boundary, role container, root children attached.
Empty frame → minimal root with no children.
```

---

# PART 8: PHASE 3.5 — ENHANCER

---

## 8.1 WHY THIS PHASE EXISTS

Bridges "structurally correct" to "professionally designed":
centered forms, responsive grids, sticky nav, hero typography,
card elevation, section spacing, input groups, footer treatment.
Eight deterministic pattern rules; additive, independent.

---

## 8.2 THE EIGHT ENHANCEMENT RULES

```
RULE 1: AUTO-CENTER FORM — root column with heading+inputs+button (≤6)
  → "centered-form" (max-w-md mx-auto rounded shadow).
RULE 2: AUTO-CARDIFY — container with image+heading/text or heading+text+button
  → role to card, "auto-card" (shadow, rounded, hover).
RULE 3: AUTO-RESPONSIVE GRID — 2–4 similar cards in row → "responsive-grid-N".
RULE 4: AUTO-STICKY NAV — first root child is nav → "sticky-nav" (sticky top-0 z-50).
RULE 5: AUTO-SECTION SPACING — section breaks (button→heading, divider, etc.) → gap≥48px.
RULE 6: AUTO HERO — first 2–3 root: h1+paragraph+(button) → "hero-heading", "hero-text".
RULE 7: AUTO INPUT GROUPS — consecutive inputs in column → "input-group-member", 16px gaps.
RULE 8: AUTO FOOTER — last root child after divider → "footer" (mt-auto pt-6 text-center muted).
```

---

## 8.3 IMPACT DEMONSTRATION

Before: full-width form column. After: centered card, max-w-md, shadow.
Before: 3 cards in flex row. After: grid grid-cols-1 md:grid-cols-3, card hover.

---

# PART 9: PHASE 4 — STYLIST

---

## 9.1 PURPOSE AND CONTRACT

Input: UINode tree + StyleGuide. Output: UINode tree with tailwindClasses on every node.

---

## 9.2 DESIGN TOKEN DERIVATION

Primary/secondary/accent from style guide swatches; surface/border from neutral;
background white; textHeading/textBody/textMuted fixed; fonts from typography;
fallbacks: blue primary, Inter, medium radius/shadow/spacing.

---

## 9.3 SEMANTIC COLOR MAPPING

primary → buttons, links, focus rings; secondary → secondary buttons;
accent → highlights; surface → cards; border → inputs, dividers;
textHeading/Body/Muted for typography. Tailwind arbitrary values: bg-[#hex], etc.

---

## 9.4 SEEDED VARIATION ENGINE

seed = hash(frame.id). Deterministic choice of: border radius (sm|md|lg|xl),
shadow (none|sm|md|lg), spacing (compact|comfortable|spacious). Same frame = same variation.

---

## 9.5 PER-ROLE CLASS GENERATION

Container, card, button (primary/secondary/outline/ghost), input, heading (levels),
paragraph, image, video, nav, divider, avatar, chart, decorative — each role gets
token-based Tailwind classes; enhancement hints add centered-form, grid, sticky, hero, footer, etc.

---

# PART 10: PHASE 5 — BUILDER

---

## 10.1 PURPOSE AND CONTRACT

Input: styled UINode tree. Output: string (complete React component).

---

## 10.2 JSX GENERATION STRATEGY

Role → tag: heading→h1–h4, paragraph→p, button→button, input→input(+label),
checkbox→label+input+span, image/video/chart→div+placeholder, divider→hr,
nav→nav+Logo+hamburger, avatar→div+initial, container/card→div+children.
Text escaped for JSX. 2-space indent. Inline dimensions for image, video, avatar, chart, decorative.

---

## 10.3 GAP STRATEGY (UNIFORM VS PER-GAP)

Uniform gaps → single gap-X on parent. Non-uniform → no parent gap; each child (except first) gets mt-X or ml-X from Tailwind scale.

---

## 10.4 OUTPUT FORMAT

export default function GeneratedUI() { return ( ... ); }
Default export, no imports, no state/effects; portable starting point.

---

# PART 11: PHASE 6 — DISPLAY

---

## 11.1 SANDPACK LIVE PREVIEW

Sandpack: react-ts, dark theme, /App.tsx = generated code, /styles.css = Tailwind CDN.
Live edit + preview, hot reload.

---

## 11.2 GENERATION PANEL UI

Header: status, Regenerate, Copy Code, Download .tsx, Close. Body: Sandpack. Toasts for copy/download.

---

## 11.3 GENERATION BUTTON INTEGRATION

On selected frame toolbar; reads Redux shapes, calls generateFromFrame(frame, allShapes, styleGuide);
400ms delay then panel with code. Integrated in frame/index.tsx (import + render).

---

# PART 12: PIPELINE ORCHESTRATOR

---

## 12.1 MAIN FUNCTION

generateFromFrame(frame, allShapes, styleGuide) → string. Chains: extract → classify → buildHierarchy → enhanceTree → buildDesignTokens + applyStyles → generateCode. Synchronous; <100ms.

---

## 12.2 EMPTY FRAME HANDLING

No shapes → placeholder "Empty frame — add some shapes!". All annotations → "No UI components found — try buttons, inputs, or text."

---

## 12.3 ERROR BOUNDARIES

try/catch around pipeline; toast on error. Defensive null checks, defaults, clamping throughout.

---

# PART 13: INTEGRATION & DEPLOYMENT

---

## 13.1 CODEBASE INTEGRATION

Two points: (1) frame component + GenerationButton, (2) read-only Redux. No Convex, API, Inngest, auth, or payment in pipeline.

---

## 13.2 DEPENDENCY FOOTPRINT

One new dependency: @codesandbox/sandpack-react (~200KB, lazy when panel opens).

---

## 13.3 BUILD AND TEST EXECUTION

Day 1: types + extractor. Day 2: classifier + architect. Day 3: enhancer + stylist. Day 4: builder + orchestrator. Day 5: Sandpack + button + panel + frame. Day 6–7: testing, edge cases, feedback. Total 7 days, ~1,300 lines.

---

# PART 14: QUALITY, EDGE CASES, TESTING

---

## 14.1 EDGE CASE MATRIX

Empty frame, only annotations, single shape, 100+ shapes, overlapping shapes, same-Y, uneven spacing, no style guide, only decorative, special chars in text, deep nesting, login form, card grid, nav at top — all handled (placeholder, exclusion, ratio, threshold, per-gap, defaults, escaping, enhancer rules).

---

## 14.2 SEVEN VERIFICATION SCENARIOS

1) Login form → centered card. 2) Card grid → responsive-grid-3 + auto-card. 3) Nav+hero → sticky nav, hero heading. 4) Empty frame → placeholder. 5) Mixed annotations → only button+input. 6) Nested containers → div>card>button. 7) Style guide → primary and font in output.

---

## 14.3 QUALITY METRICS

Structural correctness >90%; valid JSX + Tailwind 100%; responsive + interactive + semantic. Quality score ~60/100; v2.5/v3.0 target 85→90.

---

# PART 15: BUSINESS IMPACT & OUTLOOK

---

## 15.1 COST STRUCTURE ADVANTAGE

D2D: ₹0 at 100/1k/10k/100k gen/day. LLM competitor: ₹500–5M scale. Margins improve with scale; >96% gross at 500 Pro users.

---

## 15.2 COMPETITIVE TECHNICAL MOAT

Replicating requires: structured canvas, 26-shape bbox, 17-role classifier, overlap-ratio tree, 8 enhancement rules, semantic tokens, per-gap builder. Enhancer encodes design expertise; LLM cannot use structured data; no shortcut.

---

## 15.3 ROADMAP FROM V2.0 FORWARD

v2.0 (shipped): 7 phases, 8 rules, Sandpack, ~60 quality. v2.5: design presets, section detection, content inference, icons, 85 target. v3.0: design brief, industry content, 3 variations, full generation page, 90 target. Additive; same zero cost and speed.

---

# APPENDIX A: ARCHITECTURE DIAGRAMS

---

## A.1 SEVEN-PHASE PIPELINE ARCHITECTURE (v2.0)

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                        USER CLICKS "GENERATE" ON FRAME                       │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  SOURCE: Redux store (state.shapes.entities) — ONLY data source             │
  │  No screenshots. No API. No server. No file uploads.                        │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 1: EXTRACTOR                                                          │
  │  Input:  frame + allShapes[]     Output: ExtractedShape[]                    │
  │  Logic:  overlap-ratio containment, universal bbox, coord normalization    │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 2: CLASSIFIER                                                         │
  │  Input:  ExtractedShape[]         Output: ClassifiedComponent[]              │
  │  Logic:  direct mapping (10 types) + heuristics (rect, roundedRect, etc.)   │
  │          + text intelligence; annotations EXCLUDED                          │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 3: ARCHITECT                                                           │
  │  Input:  ClassifiedComponent[]     Output: UINode (tree root)                 │
  │  Logic:  70% overlap containment, smallest parent, row/column, per-gap       │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 3.5: ENHANCER                                                         │
  │  Input:  UINode tree               Output: UINode tree (enhanced)             │
  │  Logic:  8 rules: centered-form, auto-card, responsive-grid, sticky-nav,     │
  │          section spacing, hero, input-group, footer                           │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 4: STYLIST                                                            │
  │  Input:  UINode + StyleGuide       Output: UINode (tailwindClasses set)      │
  │  Logic:  design tokens, semantic color mapping, seeded variation, per-role   │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 5: BUILDER                                                            │
  │  Input:  styled UINode tree       Output: string (React component)          │
  │  Logic:  recursive JSX, role→tag, gap strategy, text escape, export default  │
  └─────────────────────────────────────┬───────────────────────────────────────┘
                                        │
  ┌─────────────────────────────────────▼───────────────────────────────────────┐
  │  PHASE 6: DISPLAY                                                             │
  │  Input:  code string               Output: Visual panel (Sandpack)            │
  │  Logic:  Sandpack live editor + preview iframe, Copy, Download .tsx          │
  └───────────────────────────────────────────────────────────────────────────────┘

  ALL PHASES RUN IN BROWSER. <100ms. ₹0. ZERO EXTERNAL CALLS.
```

---

## A.2 PIPELINE FILE & MODULE ARCHITECTURE

```
  src/lib/ai-pipeline/
  ├── types.ts           ExtractedShape, ClassifiedComponent, UINode, DesignTokens, UIRole
  ├── extractor.ts       getBoundingBox(), extractShapesFromFrame()
  ├── classifier.ts      classifyShapes() — direct + heuristic + text + annotation filter
  ├── architect.ts       buildHierarchy() — containment, layout, gaps
  ├── enhancer.ts        enhanceTree() — 8 pattern rules
  ├── stylist.ts         buildDesignTokens(), applyStyles()
  ├── builder.ts         generateCode()
  └── index.ts           generateFromFrame() — orchestrator

  src/components/generation/
  ├── generation-button.tsx    On frame toolbar; reads Redux, calls generateFromFrame
  ├── generation-panel.tsx     Sandpack + Copy + Download + Regenerate + Close
  └── generation-progress.tsx  Animated steps (optional)

  INTEGRATION:
  src/components/canvas/shapes/frame/index.tsx  → imports & renders GenerationButton
  Redux (read-only) ← shapes.entities
```

---

## A.3 TYPE FLOW ACROSS PHASES

```
  Redux Shape (any)           →  Phase 1  →  ExtractedShape[]
    originalShape, relX, relY, width, height, centerX, centerY

  ExtractedShape[]             →  Phase 2  →  ClassifiedComponent[]
    + id, role (UIRole), text, properties; annotations removed

  ClassifiedComponent[]        →  Phase 3  →  UINode (tree)
    + children[], layout (row|column), gaps[]

  UINode                       →  Phase 3.5 →  UINode
    + enhancementHints[] (centered-form, responsive-grid-3, etc.)

  UINode                       →  Phase 4  →  UINode
    + tailwindClasses (string per node)

  UINode                       →  Phase 5  →  string
    "export default function GeneratedUI() { return ( ... ); }"

  string                       →  Phase 6  →  Sandpack UI (code editor + live preview)
```

---

## A.4 ENHANCER RULES → STYLIST IMPACT

```
  Enhancement Hint           │  Stylist / Builder behavior
  ──────────────────────────┼────────────────────────────────────────────────────
  centered-form              │  Root: max-w-md mx-auto rounded shadow surface bg
  auto-card                  │  Role→card; shadow, rounded, hover:shadow-lg
  responsive-grid-N          │  Parent: grid grid-cols-1 md:grid-cols-N (not flex)
  sticky-nav                 │  Nav node: sticky top-0 z-50
  hero-heading / hero-text   │  Heading: text-5xl text-center; paragraph: max-w-2xl muted
  input-group-member         │  Normalized 16px gap between consecutive inputs
  footer                     │  mt-auto pt-6 text-center text-muted
  (section spacing)          │  Larger gaps at section breaks (e.g. 48px)
```

---

# APPENDIX B: DATA FLOW DIAGRAMS

---

## B.1 END-TO-END PIPELINE DATA FLOW (v2.0)

```
  Canvas (Frame selected)     Redux (shapes)        Style Guide (optional)
           │                        │                        │
           │    "Generate" click    │                        │
           └────────────────────────┼────────────────────────┘
                                    ▼
                    ┌───────────────────────────────┐
                    │ generateFromFrame(            │
                    │   frame, allShapes, styleGuide│
                    │ )                             │
                    └───────────────┬───────────────┘
                                    │
     ┌──────────────────────────────┼──────────────────────────────┐
     ▼                              ▼                              ▼
  extractShapesFromFrame      (frame bounds,              (used in Phase 4
  (frame, allShapes)           overlap ≥50%)                only)
     │
     ▼  ExtractedShape[]  (sorted top→bottom, left→right)
  classifyShapes(extracted)
     │  annotations dropped
     ▼  ClassifiedComponent[]
  buildHierarchy(classified, frame.w, frame.h)
     │  70% overlap, smallest parent, row/column, per-gap
     ▼  UINode (root)
  enhanceTree(tree)
     │  8 rules → enhancementHints
     ▼  UINode
  buildDesignTokens(styleGuide, seed) + applyStyles(tree, tokens)
     │  tailwindClasses on every node
     ▼  UINode
  generateCode(styled)
     │
     ▼  string (React component)
  setGeneratedCode(code) → GenerationPanel opens → Sandpack
     │
     ▼  User: Copy | Download .tsx | Regenerate | Close
```

---

## B.2 EXTRACTOR → CLASSIFIER → ARCHITECT DATA FLOW

```
  ExtractedShape (per shape)              ClassifiedComponent              UINode (per node)
  ─────────────────────────              ───────────────────              ─────────────────
  originalShape (Redux)                    id                                id
  relX, relY                              role (button|input|heading|…)     role
  width, height                           relX, relY, width, height         relX, relY, width, height
  centerX, centerY                        text, properties                  text, properties
                                          originalShape                     children[] (UINode[])
                                                                           layout: "row" | "column"
                                                                           gaps[] (per-pair pixels)
                                                                           enhancementHints[]
                                                                           tailwindClasses (after Phase 4)
```

---

## B.3 STYLIST → BUILDER DATA FLOW

```
  StyleGuide (user)          DesignTokens                 UINode (styled)           JSX string
  ───────────────            ─────────────                ───────────────           ──────────
  colors.primary              colors.primary               node.tailwindClasses      "<div className=\"...\">"
  colors.secondary            colors.secondary             (from tokens +             "  <h1 className=\"...\">"
  colors.accent               colors.surface                role + hints)             "    Escaped text"
  typography.fonts            font.heading, body           Recursive visit            "  </h1>"
  (optional)                  variation.radius,            each node →               "  <button ...>..."
                               shadow, spacing              open/close tag            "</div>"
  seed = hash(frame.id)       Seeded variation            + gap/margin              export default function
                              (same frame = same)          handling                   GeneratedUI() { return (...); }
```

---

## B.4 USER INTERACTION FLOW (GENERATE BUTTON → PANEL)

```
  User                    Canvas / Frame              Redux                 Pipeline                 UI
  ────                    ───────────────             ────                  ─────────               ──
  Selects frame           Frame selected              shapes.entities       (idle)
  Clicks "Generate"       Toolbar visible             read                  generateFromFrame()
                          Button: "Generating..."                           extract → classify
                                                                             → architect → enhance
                                                                             → stylist → builder
  (wait <100ms)           Spinner                      —                     returns string
  Sees toast "Generated"  —                            —                     setGeneratedCode(code)
  Panel opens             —                            —                     GenerationPanel mounts
  Sees code + preview     Sandpack (App.tsx = code)    —                     Sandpack renders
  Copy / Download /       —                            —                     clipboard / blob download
  Regenerate / Close      Panel closes                 —                     state cleared, panel unmounts
```

---

## APPENDIX C: V2.0 PIPELINE SUMMARY

```
┌─────────────────────────────────────────────────────────────┐
│   D2D AI GENERATION PIPELINE v2.0                           │
│   Phases: 7 | Code: ~1,300 lines | Files: 11 | Deps: 1       │
│   Shape types: 26 | UI roles: 17 | Enhancement rules: 8     │
│   Speed: <100ms | Cost: ₹0 | Deterministic: Yes | Offline: Yes│
│   Quality: ~60/100 | Fixes: overlap ratio, relative threshold, per-gap │
│   Margin: >96% at 500 users | Moat: 7-phase architecture    │
└─────────────────────────────────────────────────────────────┘
```

---

*End of Pipeline v2.0 Product & Technical Document.*
*Seven phases. Eight enhancement rules. Three critical fixes.*
*Zero cost. Under 100ms. Fully deterministic.*
*The engine that turns rough sketches into professional code.*
