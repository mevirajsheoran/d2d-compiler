D2D (Drawing to Design) — Complete Product & Technical Document
CLASSIFICATION
text

Document Type:     Unified Product & Technical Specification
Version:           Complete (v1.0 MVP + v2.0 Pipeline + v3.0 Context)
Audience:          Investors, Technical Evaluators, Engineering Leads
Status:            v1.0 SHIPPED | v2.0 SHIPPED | v3.0 BUILD-READY
Last Updated:      2025
TABLE OF CONTENTS
text

PART 1:  EXECUTIVE OVERVIEW
  1.1  What D2D Is
  1.2  The One-Line Pitch
  1.3  Evolution: v1.0 → v2.0 → v3.0
  1.4  Key Metrics At A Glance

PART 2:  THE OPPORTUNITY
  2.1  Problem Statement
  2.2  Market Context
  2.3  Target Users
  2.4  Competitive Landscape
  2.5  D2D's Unique Position

PART 3:  THE PRODUCT
  3.1  Product Definition
  3.2  The Design Agency Insight
  3.3  The Four-Step Guided Flow
  3.4  Complete User Journey
  3.5  Complete Feature Inventory

PART 4:  TECHNICAL ARCHITECTURE
  4.1  Technology Stack Overview
  4.2  Frontend Architecture
  4.3  Backend Architecture
  4.4  Database Design
  4.5  Authentication System
  4.6  State Management
  4.7  Payment Infrastructure
  4.8  State Persistence Across Pages
  4.9  Project File Structure

PART 5:  AI GENERATION ENGINE
  5.1  The Core Insight
  5.2  The Strategic Decision
  5.3  Approaches Explored
  5.4  Pipeline Architecture (Seven Phases)
  5.5  Shared Type System
  5.6  Phase 1 — Extractor
  5.7  Phase 2 — Classifier
  5.8  Phase 3 — Architect
  5.9  Phase 3.5 — Enhancer
  5.10 Phase 4 — Stylist
  5.11 Phase 5 — Builder
  5.12 Phase 6 — Display
  5.13 Pipeline Orchestrator
  5.14 Pipeline Performance

PART 6:  CONTEXT LAYER
  6.1  The Missing Context Problem
  6.2  The Design Brief
  6.3  Industry-Specific Content Engine
  6.4  Smart Suggestions System
  6.5  Design Preset Selector
  6.6  Live Preview
  6.7  Multi-Variation Generation

PART 7:  THE GENERATION PAGE
  7.1  From Popup to Destination
  7.2  Page Layout and Interaction Design
  7.3  Responsive Preview Toggle
  7.4  Export Options (Four Formats)
  7.5  Quality Score Visualization
  7.6  The Loading Animation
  7.7  "Explain My Design" Panel

PART 8:  DEPLOYMENT & OPERATIONS
  8.1  Deployment Architecture
  8.2  Infrastructure & Cost Model
  8.3  Security Posture

PART 9:  EDGE CASES, TESTING & QUALITY
  9.1  Edge Case Matrix
  9.2  Verification Scenarios
  9.3  Graceful Degradation Philosophy
  9.4  Quality Metrics and Projection

PART 10: BUSINESS MODEL & OUTLOOK
  10.1 Revenue Model
  10.2 Unit Economics
  10.3 Scalability Profile
  10.4 Competitive Position
  10.5 What Comes Next

APPENDIX A: ARCHITECTURE DIAGRAMS
APPENDIX B: DATA FLOW DIAGRAMS
APPENDIX C: CONSOLIDATED METRICS
PART 1: EXECUTIVE OVERVIEW
1.1 WHAT D2D IS
D2D, short for Drawing to Design, is a deployed web application
that transforms hand-drawn wireframes into production-ready
React code with professional styling — augmented by a guided
design intelligence workflow that captures brand context,
industry-specific content, and design intent.

A user sketches a rough layout on an infinite digital canvas.
They fill a five-field Design Brief specifying their industry,
tone, brand name, tagline, and page type. They select a design
preset with a live preview showing how choices affect output.
The system then generates three complete, professionally styled
React components using Tailwind CSS — each in a different
design direction — in under 300 milliseconds at zero cost.

The output is not a rough approximation. It is code a
professional front-end developer would write: hover states,
focus rings, responsive breakpoints, typographic hierarchy,
industry-specific content, brand name permeation, alternating
section backgrounds, entrance animations, and consistent
design system application.

The generation engine is entirely deterministic. It runs in
the user's browser with zero server-side computation. There
are no AI API calls. No GPT. No Claude. No Gemini. The cost
per generation is exactly zero. The time for three complete
variations is under 300 milliseconds. The output is perfectly
reproducible — same input, same output, every time.

The product is fully deployed on Vercel with a Convex backend.
It supports Google OAuth and email/password authentication.
It includes a subscription billing system via Razorpay.
It has been tested end-to-end and is live in production.

D2D addresses a genuine market gap. Existing tools either
require a completed design as input (Figma AI, Builder.io,
Locofy) or rely on ambiguous text prompts to guess layout
intent (v0 by Vercel). D2D is the only tool that captures
precise spatial intent from a hand-drawn wireframe, combines
it with structured brand and industry context, and converts
it to multiple professional code variations — without any AI
inference cost or delay.

1.2 THE ONE-LINE PITCH
text

D2D turns your rough sketch into three professional website
designs in under one second — with zero AI cost, zero
guesswork, and industry-specific content that makes each
output look like it was designed by a professional agency.
1.3 EVOLUTION: V1.0 → V2.0 → V3.0
text

v1.0 (MVP — SHIPPED):
  "We can build and ship a working product."
  Application shell: canvas, projects, authentication,
  payments, style guide, auto-save, theme system.
  Codebase: ~30,000+ lines TypeScript.

v2.0 (Pipeline — SHIPPED):
  "We can generate professional code from drawings."
  Seven-phase deterministic generation pipeline.
  Extractor, Classifier, Architect, Enhancer, Stylist,
  Builder, Display. Eight enhancement rules. Sandpack preview.
  Pipeline code: ~1,300 lines across 11 files.
  Quality score: ~60/100.

v3.0 (Context Layer — BUILD-READY):
  "We can generate BRANDED, CONTEXTUAL, INDUSTRY-SPECIFIC
   code with multiple design variations — and the user
   controls it all through a guided agency workflow."
  Design Brief, Industry Content Engine (10 industries),
  Smart Suggestions (30 mappings), Multi-Variation Generation
  (3 simultaneous), Full Generation Page, Live Preview,
  Quality Scoring, Responsive Preview Toggle.
  New + modified code: ~3,420 lines across 23 files.
  Projected quality score: ~85/100.
1.4 KEY METRICS AT A GLANCE
text

┌─────────────────────────────────────────────────────────────┐
│  METRIC                          │  VALUE                   │
├──────────────────────────────────┼──────────────────────────┤
│  Product Status                  │  v1+v2 LIVE; v3 PLANNED │
│  Generation Cost Per Use         │  ₹0 (zero)              │
│  Generation Speed (3 variations) │  < 300 milliseconds      │
│  AI API Dependency               │  NONE                   │
│  Output Determinism              │  100% reproducible       │
│  Authentication Methods          │  Google OAuth + Email    │
│  Drawing Tools                   │  10 professional tools   │
│  Subscription Tiers              │  3 (Free, Pro, Yearly)   │
│  Auto-Save Interval              │  Every 30 seconds        │
│  Framework                       │  Next.js 15 + React 19   │
│  Backend                         │  Convex (real-time BaaS) │
│  Hosting                         │  Vercel (global CDN)     │
│  Code Output Format              │  React + Tailwind CSS    │
│  Dark Mode Support               │  Yes (system + manual)   │
│  Responsive Output               │  Yes (mobile-first)      │
│  Pipeline Phases                 │  7 sequential layers     │
│  Enhancement Rules               │  8 design patterns       │
│  Industry Content Banks          │  10 industries           │
│  Smart Suggestion Mappings       │  30 industry×tone combos │
│  Design Presets                  │  6 visual identities     │
│  Variations Per Generation       │  3 simultaneous          │
│  Export Formats                  │  4 (TSX, HTML, Copy, JSON)│
│  Responsive Preview Sizes        │  3 (desktop/tablet/mobile)│
│  Live Preview                    │  Real-time (100ms debounce)│
│  Shape Types Supported           │  26                      │
│  UI Roles Classified             │  17 semantic categories  │
│  Total Codebase                  │  ~35,000+ lines          │
│  Quality Score (projected)       │  ~85/100                 │
└──────────────────────────────────┴──────────────────────────┘
PART 2: THE OPPORTUNITY
2.1 PROBLEM STATEMENT
The process of turning a product idea into a functional user
interface is one of the most time-consuming and expensive
steps in software development.

The traditional workflow requires multiple tools, multiple
people, and multiple handoff points, each introducing delay,
miscommunication, and rework.

text

TRADITIONAL WORKFLOW (per screen):

  Step 1: Paper Sketch
    WHO:  Designer or product manager
    TIME: 15-30 minutes
    TOOL: Paper, whiteboard, or basic sketching app

  Step 2: High-Fidelity Mockup
    WHO:  UI/UX designer
    TIME: 2-4 hours
    TOOL: Figma, Sketch, or Adobe XD
    COST: Designer salary ($60-120/hour)

  Step 3: Design-to-Code Handoff
    WHO:  Designer prepares specs for developer
    TIME: 30-60 minutes
    TOOL: Figma inspect, Zeplin, or manual spec docs
    RISK: Information loss, ambiguous specs

  Step 4: Frontend Implementation
    WHO:  Frontend developer
    TIME: 4-8 hours
    TOOL: VS Code, React, CSS framework
    COST: Developer salary ($50-150/hour)

  Step 5: Design Review & Revision
    WHO:  Designer reviews, developer revises
    TIME: 2-4 hours (often multiple rounds)
    RISK: "That's not what I meant" conversations

  TOTAL TIME PER SCREEN:  8-16 hours
  TOTAL COST PER SCREEN:  $400-2,000
  TOTAL PEOPLE INVOLVED:  2-3 minimum
  TOTAL TOOLS REQUIRED:   3-5 separate applications
For a typical MVP with ten screens, the UI implementation
alone costs $4,000 to $20,000 and takes two to six weeks.

text

D2D WORKFLOW (per screen):

  Step 1: Sketch on D2D Canvas
    WHO:  Anyone (no design skills needed)
    TIME: 5-10 minutes
    TOOL: D2D (only tool needed)

  Step 2: Fill Design Brief + Select Style
    WHO:  Same person
    TIME: 30-60 seconds
    TOOL: D2D (same tool)

  Step 3: Generate Three Variations
    WHO:  Same person
    TIME: < 1 second (automated)
    TOOL: D2D (same tool)

  Step 4: Review, Switch Styles, Export
    WHO:  Same person
    TIME: 5-15 minutes
    COST: ₹0 per generation

  TOTAL TIME PER SCREEN:  15-30 minutes
  TOTAL COST PER SCREEN:  ₹0 (included in subscription)
  TOTAL PEOPLE INVOLVED:  1
  TOTAL TOOLS REQUIRED:   1
D2D compresses an eight-to-sixteen-hour, multi-person,
multi-tool workflow into under thirty minutes with a single
person and a single tool. That is a twenty to thirty times
improvement in time efficiency and a near-complete elimination
of communication overhead.

2.2 MARKET CONTEXT
The design-to-code market is experiencing rapid growth driven
by three converging trends.

text

TREND 1: AI-ASSISTED DEVELOPMENT
  The emergence of AI code generation tools (GitHub Copilot,
  v0, Cursor) has created market awareness and demand for
  automated code generation. Users now expect tools that
  generate code intelligently, not just assist with syntax.

TREND 2: NO-CODE / LOW-CODE EXPANSION
  The no-code movement has trained millions of non-developers
  to expect visual interfaces for building software. These
  users want more control than drag-and-drop builders offer
  but lack the skills for hand-coded development.

TREND 3: DESIGN SYSTEM STANDARDIZATION
  Tailwind CSS has become the dominant styling framework,
  used by over 40% of new projects. React remains the
  dominant UI library. This standardization means generated
  code can target a single, widely-adopted stack and be
  immediately useful to the largest possible developer audience.

MARKET SIZE INDICATORS:
  Figma:       Acquired by Adobe for $20B (2022)
  v0:          Launched by Vercel, millions of users
  Canva:       Valued at $26B
  Webflow:     Valued at $4B
  Builder.io:  Raised $14M Series A

  The tools-for-builders market is multi-billion dollar
  and growing. D2D targets the intersection of design tools
  and code generation — a space with clear demand and
  limited competition in the sketch-to-code category.
2.3 TARGET USERS
D2D serves four primary user segments, each with distinct
motivations and willingness to pay.

text

SEGMENT 1: STARTUP FOUNDERS AND ENTREPRENEURS
──────────────────────────────────────────────
  Profile:
    Non-technical or semi-technical founders.
    Building MVPs on tight budgets.
    Need to validate ideas quickly.

  Pain Point:
    Cannot afford a designer AND a developer for early prototyping.
    Hiring a freelancer for UI costs $2,000-10,000 per project.
    Time from idea to testable prototype: 2-6 weeks.

  D2D Value:
    Sketch the idea → configure brand → get three professional
    variations → ship the MVP. Time: hours, not weeks.
    Cost: subscription price only, no per-project freelancer fees.

  Revenue Potential: HIGH


SEGMENT 2: FRONTEND DEVELOPERS
───────────────────────────────
  Profile:
    Professional developers building React applications.
    Spend significant time on boilerplate UI code.
    Need quick wireframing for client presentations.

  Pain Point:
    Writing responsive, accessible, well-styled UI code
    is repetitive and time-consuming even for experienced devs.
    Setting up consistent design systems from scratch takes hours.

  D2D Value:
    Sketch the layout → get a complete starting point.
    Output code uses the exact stack they already work with.
    React plus Tailwind CSS output drops directly into projects.
    Three variations give the client options to choose from.
    Saves 2-4 hours of boilerplate per component.

  Revenue Potential: MEDIUM-HIGH


SEGMENT 3: UI/UX DESIGN STUDENTS
─────────────────────────────────
  Profile:
    Students learning user interface and experience design.
    Working on portfolio projects and coursework.
    Budget-constrained but time-rich.

  Pain Point:
    Can design interfaces but cannot code them.
    Want to see their wireframes come to life.
    Need to understand how designs translate to code.

  D2D Value:
    Draw wireframe → see professional code output instantly.
    Learn design-to-code patterns by examining the output.
    Build portfolio pieces faster.
    "Explain My Design" panel teaches UI vocabulary.

  Revenue Potential: LOW (free tier users, long-term funnel)


SEGMENT 4: EDUCATORS AND TEACHERS
──────────────────────────────────
  Profile:
    Teachers creating visual materials for classes.
    No coding knowledge required.
    Need quick visual prototypes for demonstration.

  Pain Point:
    Cannot create professional-looking UI examples.
    Existing tools require design or coding expertise.
    Need simple, fast results for teaching purposes.

  D2D Value:
    Sketch a concept → generate a real-looking interface.
    No learning curve beyond basic drawing.
    Instant results for classroom demonstrations.
    Download as standalone HTML — no build tools needed.

  Revenue Potential: LOW-MEDIUM
2.4 COMPETITIVE LANDSCAPE
text

v0 BY VERCEL
  Input:      Text prompt (natural language)
  Process:    Large language model generates code
  Output:     React component
  Cost:       $20/month, ~10 generations per day
  Speed:      5-30 seconds per generation
  Strength:   High-quality output, strong brand
  Weakness:   Guesses layout from ambiguous text.
              Non-deterministic (same prompt → different results).
              Each generation costs money (LLM API calls).
              Rate-limited by API capacity.
              No structured context collection.
              No live preview before generation.
              No multi-variation output.
              No instant style switching.

FIGMA AI
  Input:      Existing completed design
  Process:    AI modifies or extends existing design
  Output:     Modified design (not code)
  Weakness:   Requires a completed design as starting input.
              Cannot generate from rough wireframe.
              Does not produce code output.

BUILDER.IO
  Input:      Figma or design file
  Process:    Exports design to code
  Output:     React, Vue, or other framework code
  Weakness:   No design intelligence. Pure export/conversion.
              Requires a completed Figma design first.

LOCOFY
  Input:      Figma or Adobe XD file
  Process:    Converts design to code
  Output:     React or React Native code
  Weakness:   Tightly coupled to Figma/XD as input source.
              Cannot work with hand-drawn wireframes.

FRAMER
  Input:      Visual WYSIWYG editor
  Process:    Direct manipulation editing
  Output:     Live website (hosted on Framer)
  Weakness:   No sketch-to-design capability.
              No code generation or export.
              Locked into Framer's hosting platform.
2.5 D2D'S UNIQUE POSITION
No existing tool occupies the space D2D targets.

text

THE GAP IN THE MARKET:

  Every competitor requires EITHER:
    A) A completed, polished design (Figma AI, Builder, Locofy)
    B) An articulate text description (v0)

  Nobody accepts a rough sketch as input.
  Nobody combines spatial intent with structured brand context.
  Nobody generates multiple variations simultaneously.
  Nobody shows live preview before generation.
  Nobody provides instant style switching after generation.

  D2D does ALL of these. At zero marginal cost.


WHY SPATIAL DATA BEATS TEXT PROMPTS:

  When a user draws a rectangle at the top of a frame
  with a small icon on the left and two buttons on the right,
  they are communicating "this is a navigation bar" through
  precise geometric relationships.

  This spatial data includes:
    Exact X and Y position of every element
    Exact width and height of every element
    Containment relationships (what is inside what)
    Proximity relationships (what is near what)
    Relative sizing (what is bigger/smaller than what)
    Spatial patterns (rows, columns, grids, stacks)

  A text prompt like "make a landing page with a nav bar"
  leaves the layout entirely up to interpretation.
  A D2D sketch SHOWS the layout. There is no guessing.


COMPREHENSIVE COMPETITIVE ADVANTAGE:

  ┌──────────────────────────┬──────────┬──────────┐
  │ Capability               │ v0       │ D2D      │
  ├──────────────────────────┼──────────┼──────────┤
  │ Input Type               │ Text     │ Drawing  │
  │ Layout Precision         │ Guessed  │ Exact    │
  │ Cost Per Generation      │ ~$0.50   │ ₹0       │
  │ Speed (3 variations)     │ 15-90s   │ <0.3s    │
  │ Deterministic            │ No       │ Yes      │
  │ Works Offline            │ No       │ Yes      │
  │ Rate Limited             │ Yes      │ No       │
  │ API Dependency           │ OpenAI   │ None     │
  │ Structured Context       │ No       │ Yes      │
  │ Industry Content Banks   │ No       │ 10       │
  │ Live Preview Before Gen  │ No       │ Yes      │
  │ Multi-Variation Output   │ No       │ 3        │
  │ Instant Style Switching  │ No       │ 6 presets│
  │ Responsive Preview       │ No       │ 3 sizes  │
  │ Quality Score            │ No       │ Yes      │
  │ Design Explanation       │ No       │ Yes      │
  └──────────────────────────┴──────────┴──────────┘

  The competitive story in one line:
  v0 guesses from text. D2D sees from drawing AND knows your brand.
PART 3: THE PRODUCT
3.1 PRODUCT DEFINITION
D2D is a full-stack web application built with Next.js 15
and deployed on Vercel. It provides an infinite drawing canvas
where users sketch wireframes, a guided style configuration
system where users define brand context and design preferences,
and a generation engine that produces multiple production-ready
React components with Tailwind CSS.

The application is a single cohesive product — not a collection
of microservices or disconnected tools. The user signs up,
creates a project, draws on the canvas, fills a design brief,
selects a style, and generates three professional website
variations without ever leaving the D2D environment.

The application supports dark mode and light mode with system
preference detection. It is responsive and functions on desktop
browsers. All user data is stored in Convex, a real-time
backend-as-a-service, providing instant data synchronization
and automatic conflict resolution.

3.2 THE DESIGN AGENCY INSIGHT
The most effective way to understand D2D is to compare it
to how professional design agencies work with clients.

text

AGENCY WORKFLOW (costs $5,000-$15,000, takes 2-4 weeks):

  Step 1: CLIENT BRIEF
    Client describes their brand.
    Industry, values, tone, target audience.
    Written brief document, typically 2-5 pages.

  Step 2: MOOD BOARDS
    Agency creates visual direction options.
    Color palettes, typography samples, photo references.
    Typically 2-3 directions presented.

  Step 3: STYLE TILES
    Agency applies style options to real UI components.
    Buttons, cards, navigation bars rendered in each direction.
    Client sees how abstract "mood" translates to interface.

  Step 4: DIRECTION SELECTION
    Client picks preferred mood board and style tile.
    Agency narrows to one direction.

  Step 5: WIREFRAME APPLICATION
    Agency takes the rough layout and applies the
    selected design direction.

  Step 6: CLIENT REVIEW
    Client sees the result and provides feedback.

  Step 7: ITERATE
    Try different directions, refine until approved.
    Typically 2-3 revision rounds.

  TOTAL: 2-4 weeks, $5,000-$15,000, 3-5 meetings.


D2D WORKFLOW (costs ₹0, takes under 60 seconds):

  Step 1: USER DRAWS WIREFRAME (maps to agency Step 5 input)
    Canvas exists. User sketches layout in 5-10 minutes.

  Step 2: USER FILLS DESIGN BRIEF (maps to agency Step 1)
    Five-field visual form: page type, industry, tone,
    brand name, tagline. Takes 30 seconds.

  Step 3: SYSTEM SUGGESTS DESIGN SETTINGS (maps to Steps 2+3)
    Smart Suggestions engine recommends preset, colors, fonts.
    One-click "Apply All" button.

  Step 4: USER SELECTS DESIGN PRESET (maps to Step 4)
    Six preset cards with live mini-previews.
    "Recommended" badge on the suggested preset.

  Step 5: SYSTEM GENERATES THREE VARIATIONS (maps to Step 5 × 3)
    Pipeline runs three times with three different presets.
    Under 300 milliseconds. Three professional websites appear.

  Step 6: USER REVIEWS WITH LIVE PREVIEW (maps to Step 6)
    Responsive toggle shows desktop, tablet, mobile.
    Quality score quantifies output quality.

  Step 7: USER SWITCHES STYLES INSTANTLY (maps to Step 7)
    "Try Another Style" cycles through all six presets.
    Each switch takes under 100 milliseconds.

  TOTAL: Under 60 seconds, ₹0, zero meetings.
3.3 THE FOUR-STEP GUIDED FLOW
text

┌───────────────────────────────────────────────────────────┐
│                                                           │
│   STEP 1        STEP 2          STEP 3         STEP 4    │
│   Canvas   →   Style Guide  →  Generation  →  Export     │
│   (draw)       (configure)     (reveal)       (use)      │
│                                                           │
│   5-10 min     30-60 sec       < 1 sec        instant    │
│                                                           │
└───────────────────────────────────────────────────────────┘

  Each step builds on the previous.
  Each step adds context that improves output quality.
  The user never feels lost — progress is linear and visible.
  Back-navigation is supported at every step.
  All data persists across steps via Convex.
3.4 COMPLETE USER JOURNEY
text

STEP 1: AUTHENTICATION
────────────────────────
  The user visits D2D and is presented with the landing page.
  They click Sign Up or Sign In.

  Two authentication methods are available:
    Option A: Google OAuth (one-click sign-in via Google account)
    Option B: Email and password (traditional form submission)

  Authentication is handled entirely by Convex Auth.
  Session tokens are stored in the browser.
  Subsequent visits automatically restore the session.
  Protected routes redirect unauthenticated users to sign-in.
  Already authenticated users are redirected away from auth pages.


STEP 2: DASHBOARD AND PROJECT MANAGEMENT
──────────────────────────────────────────
  After authentication, the user lands on their dashboard.
  The dashboard URL includes their username:
    /dashboard/{username}

  The dashboard displays all user projects as visual cards.
  Each card shows:
    A randomly assigned gradient thumbnail for visual identity
    The project name (auto-generated: Project 1, Project 2, etc.)
    Last modified timestamp

  Available actions:
    CREATE:     "New Project" button creates a project instantly.
                Auto-incrementing names via per-user counter in Convex.
                Random gradient assigned. User redirected to canvas.

    DELETE:     Each project card has a delete option.
                Confirmation dialog prevents accidental deletion.

    DUPLICATE:  Projects can be duplicated with all data copied.
                New name and ID. All shapes, viewport, style guide carry over.

    OPEN:       Clicking a project card opens the canvas editor.


STEP 3: CANVAS EDITOR
──────────────────────
  The canvas editor is the primary workspace.
  URL: /dashboard/{username}/canvas?project={projectId}

  The canvas is an infinite two-dimensional drawing surface
  with a dot grid background for spatial reference.

  TEN DRAWING TOOLS:

    SELECT    Click to select shapes. Eight resize handles for resizing.
              Drag to reposition.

    PAN       Click and drag to move the viewport.
              Also accessible via middle mouse button or Space + drag.

    PEN       Freehand drawing at 60fps for smooth curves.

    RECTANGLE Draw rectangular shapes. Used for buttons, containers,
              cards, inputs, navigation bars, and most UI elements.

    ELLIPSE   Draw elliptical or circular shapes.
              Used for avatars, icons, decorative elements.

    ARROW     Draw directional arrows between elements.

    LINE      Draw straight lines for dividers, separators.

    TEXT      Click to place text elements. Content editable via sidebar.

    FRAME     Draw a frame that acts as an artboard boundary.
              Frames define the generation boundary.
              All shapes inside a frame are included in generation.
              Multiple frames per project are supported.

    ERASER    Click on shapes to remove them.

  VIEWPORT CONTROLS:
    Zoom: Ctrl + mouse scroll wheel.
    Pan: middle mouse click or Space + drag.
    Current zoom level displayed in interface.

  KEYBOARD SHORTCUTS for all tools. Undo and redo supported.

  ALL SHAPES stored in Redux state with complete metadata:
    Unique identifier, shape type, position (x, y), dimensions
    (width, height), visual properties (fill, stroke), text content,
    point array (for freehand), z-index for layering.


STEP 4: AUTO-SAVE
──────────────────
  Canvas auto-saves every 30 seconds.
  Visual indicator: "Saving..." during save, "Saved" after.

  Captures: all shapes, current viewport position and zoom.
  Retry logic: up to 3 attempts on failure.
  Manual save available by clicking the status indicator.
  Data persisted to Convex; survives browser closure and device changes.


STEP 5: GENERATE BUTTON → FRAME SELECTOR (CONDITIONAL)
───────────────────────────────────────────────────────
  The "Generate" button triggers a force save (direct Convex
  mutation, awaited) and then navigates based on frame count:

    Zero frames:  Toast error "Draw a frame first (press F)."
    One frame:    Navigate directly to Style Guide page.
    Two+ frames:  Show Frame Selector modal.

  Frame Selector (modal on canvas page):
    Each frame displayed as a card with checkbox.
    Optional text input for naming ("Home", "About").
    "Continue to Style Guide →" button.
    Selected frame IDs passed via URL parameters.


STEP 6: STYLE GUIDE PAGE (OVERHAULED)
──────────────────────────────────────
  URL: /dashboard/{username}/style-guide?project=xxx&frames=f1,f2

  Four tabs with an optional live preview sidebar:

  TAB 1: DESIGN BRIEF (NEW)
    Five fields capturing semantic context:

    Page Type — Visual icon cards in a grid (click to select).
      Values: Landing Page, Dashboard, Login/Sign Up, Blog,
      Portfolio, E-commerce, SaaS Product, Agency, Restaurant, Pricing.

    Industry — Emoji icon chips in a horizontal wrap.
      Values: 💻 Technology, 🏥 Healthcare, 📚 Education,
      🍽️ Food & Beverage, 👗 Fashion, 💰 Finance,
      🏠 Real Estate, ✈️ Travel, 💪 Fitness, 🎨 Creative,
      ⚖️ Legal, 🔧 Agency.

    Tone — Visual cards with mini live previews.
      Values: Professional, Playful, Minimal, Bold, Elegant, Futuristic.
      Each card renders a tiny live HTML preview styled with that
      tone's actual identity settings.

    Brand Name — Styled text input (max 30 characters).
      Appears in nav logo, footer, hero, CTA, code comments.

    Tagline — Styled text input (max 100 characters).
      Placeholder changes dynamically based on selected industry.

    Smart Suggestions panel appears after industry and tone selection.
    "Apply All Suggestions" sets colors, typography, and preset.

  TAB 2: DESIGN STYLE (REPLACES MOOD BOARD)
    Six preset cards in 2×3 grid with mini live previews.
    Presets: Startup Modern, Corporate Clean, Bold Creative,
    Minimal Elegant, Dashboard Dense, Glass & Gradient.
    "Recommended" badge based on Smart Suggestions.
    Click to select with ring highlight.

  TAB 3: COLORS (EXISTING, ENHANCED)
    Five color categories: primary, secondary, accent, neutral, semantic.
    Each supports multiple swatches with hex values and visual pickers.
    Pre-populated from suggestions if "Apply All" was clicked.

  TAB 4: TYPOGRAPHY (EXISTING, ENHANCED)
    Font family selection with preview rendering.
    Google Fonts integration.
    Pre-populated from suggestions if "Apply All" was clicked.

  RIGHT SIDEBAR: LIVE MINI PREVIEW
    Fixed template (nav + hero + features + footer) rendered
    with current identity settings. Updates in real-time (100ms
    debounce) as user adjusts any setting. iframe with Tailwind CDN.
    Hidden on mobile, shown on tablet and desktop.

  BOTTOM: "Generate Design →" button navigates to Generation page.

  All style guide data auto-saves to Convex via debounced auto-save
  (800ms after last change). Data persists across page navigations.


STEP 7: GENERATION PAGE
────────────────────────
  URL: /dashboard/{username}/generate?project=xxx&frames=f1,f2

  1. Loading animation (1.5 seconds, engineering anticipation).
  2. Pipeline runs during animation (3 variations, < 300ms).
  3. Three variation cards reveal with stagger animation.
  4. Click a card to expand into full code + preview split view.
  5. Responsive toggle (desktop 1440px, tablet 768px, mobile 375px).
  6. Four export options (Copy, TSX, HTML, Design Tokens JSON).
  7. "Try Another Style" dropdown for instant switching across 6 presets.
  8. Quality score panel (collapsible, 5 dimensions).
  9. "Explain My Design" panel (collapsible, pipeline decisions).
  10. Navigation back to canvas or style guide.

  Data reads from Convex (not Redux). Cache with hash-based
  invalidation for instant reload without regeneration.


STEP 8: EXPORT
──────────────
  All exports are client-side. No API calls. No server cost.
  Copy Code (clipboard), Download TSX, Download HTML (standalone),
  Design Tokens JSON.

  After export, user can continue exploring variations,
  return to Style Guide, return to Canvas, or create a new project.
3.5 COMPLETE FEATURE INVENTORY
Every feature marked ✅ is implemented, tested, and live.
Features marked 🔜 are v3.0 (architecture validated, build-ready).

text

AUTHENTICATION SYSTEM                              STATUS: ✅ SHIPPED
─────────────────────
  ✅ Email and password registration with validation
  ✅ Email and password login
  ✅ Google OAuth one-click registration and login
  ✅ Session management with persistent tokens
  ✅ Automatic session restoration on return visits
  ✅ Middleware-based route protection
  ✅ Redirect logic (auth pages ↔ protected pages)
  ✅ Secure logout with session cleanup


PROJECT MANAGEMENT                                  STATUS: ✅ SHIPPED
──────────────────
  ✅ Create new projects from dashboard
  ✅ Auto-incrementing project names (Project 1, 2, 3...)
  ✅ Per-user project counter in database
  ✅ Random gradient thumbnail assignment on creation
  ✅ Delete projects with confirmation dialog
  ✅ Duplicate projects with complete data copy
  ✅ Last modified timestamp tracking and display
  ✅ Project cards with visual thumbnail previews


CANVAS EDITOR                                       STATUS: ✅ SHIPPED
─────────────
  ✅ Infinite canvas with dot grid background
  ✅ 10 drawing tools (Select, Pan, Pen, Rectangle, Ellipse,
     Arrow, Line, Text, Frame, Eraser)
  ✅ Shape selection with 8 directional resize handles
  ✅ Zoom (Ctrl + scroll wheel)
  ✅ Pan (middle click, Space + drag)
  ✅ Keyboard shortcuts for all tools
  ✅ Freehand drawing at 60 frames per second
  ✅ Text editing via sidebar panel
  ✅ Frame tool for artboard definition
  ✅ Complete shape metadata storage in Redux
  ✅ Undo and redo support


AUTO-SAVE SYSTEM                                    STATUS: ✅ SHIPPED
────────────────
  ✅ Automatic save every 30 seconds
  ✅ Visual save status indicator (Saving.../Saved)
  ✅ Dirty check (skips save when nothing changed)
  ✅ Retry logic with 3 attempts on failure
  ✅ Manual save via indicator click
  ✅ Saves shapes, viewport state to Convex
  ✅ Data survives browser close and device change
  🔜 Force save (direct Convex mutation) before page navigation


STYLE GUIDE                                         STATUS: ✅+🔜
───────────
  ✅ Colors tab with 5 categories (primary through semantic)
  ✅ Typography tab with font family selection and preview
  ✅ Convex file storage for mood board images
  ✅ Debounced auto-save of all style guide data
  ✅ JSON serialization for flexible data storage
  🔜 Design Brief tab (page type, industry, tone, brand, tagline)
  🔜 Design Style tab (6 preset cards with live previews)
  🔜 Smart Suggestions panel (30 industry×tone mappings)
  🔜 Live preview sidebar (real-time design token rendering)


GENERATION ENGINE                                   STATUS: ✅+🔜
─────────────────
  ✅ 7-phase deterministic pipeline (zero AI API calls)
  ✅ Shape extraction with universal bounding box (26 types)
  ✅ Semantic role classification (17 categories)
  ✅ Parent-child hierarchy tree construction (70% overlap ratio)
  ✅ 8 enhancement rules (form centering, responsive grids, etc.)
  ✅ Design identity system with 6 presets
  ✅ Content inference for blank elements
  ✅ Icon assignment from 40-icon inline registry
  ✅ Component library with v0-level HTML templates
  ✅ Responsive output with breakpoint classes
  ✅ Sandpack live preview panel
  ✅ Code copy and download functionality
  ✅ Sub-100ms single generation time
  🔜 Industry-specific content engine (10 industries, ~600 strings)
  🔜 Brand name permeation (nav, footer, CTA, hero, comments)
  🔜 Section composition (alternating backgrounds)
  🔜 Entrance animation staggering
  🔜 Multi-variation generation (3 simultaneous, < 300ms)
  🔜 Contrast-based intelligent preset selection


GENERATION PAGE                                     STATUS: 🔜
───────────────
  🔜 Full generation page (replaces popup overlay)
  🔜 Three variation cards with scaled preview iframes
  🔜 Click-to-expand full code + preview split view
  🔜 Responsive preview toggle (desktop/tablet/mobile)
  🔜 "Try Another Style" dropdown (6 presets + Surprise Me)
  🔜 Quality score visualization (5 dimensions)
  🔜 "Explain My Design" panel (pipeline decision log)
  🔜 Loading animation (1.5s engineering anticipation)
  🔜 Four export formats (Copy, TSX, HTML, Design Tokens JSON)
  🔜 Generation result caching with hash-based invalidation
  🔜 Frame tabs for multi-frame projects


THEME SYSTEM                                        STATUS: ✅ SHIPPED
────────────
  ✅ Light mode and dark mode support
  ✅ System preference detection on first visit
  ✅ Manual toggle via navigation bar button
  ✅ All components respond to theme changes
  ✅ Persistent theme preference


PAYMENT AND SUBSCRIPTION SYSTEM                     STATUS: ✅ SHIPPED
───────────────────────────────
  ✅ Billing page with 3 plan tier cards
  ✅ Razorpay checkout integration (test mode)
  ✅ Webhook handler for payment event processing
  ✅ Background job processing via Inngest
  ✅ Credit system for tracking generation usage
  ✅ Credit balance display in navigation bar
  ✅ Credit transaction history in database
  ✅ Subscription status tracking and display
  ✅ Plan upgrade and management interface


LANDING PAGE & NAVIGATION                           STATUS: ✅ SHIPPED
─────────────────────────
  ✅ Public landing page at root URL
  ✅ Navigation with auth CTAs
  ✅ SEO elements (title, meta tags, OG tags)
  ✅ Responsive navigation bar
  ✅ Avatar dropdown with logout
  ✅ Credits display connected to Convex
  ✅ Loading skeletons
  ✅ Error handling and error boundaries
PART 4: TECHNICAL ARCHITECTURE
4.1 TECHNOLOGY STACK OVERVIEW
text

LAYER              TECHNOLOGY         VERSION    ROLE
─────────────────────────────────────────────────────────────
UI Framework       Next.js            15         SSR, routing, API routes
UI Library         React              19         Component rendering
Language           TypeScript         5.x        Type safety across codebase
Styling            Tailwind CSS       3.x        Utility-first CSS
Component Kit      ShadCN UI          latest     Accessible UI primitives
State Management   Redux Toolkit      2.x        Client-side state
Backend Database   Convex             latest     Real-time BaaS
Authentication     Convex Auth        latest     OAuth + password auth
Payments           Razorpay           latest     Indian market payments
Background Jobs    Inngest            latest     Webhook processing
Hosting            Vercel             latest     Edge deployment, CDN
Preview            Sandpack           latest     Live code editor + preview
Bundler            Turbopack          latest     Fast development builds
All dependencies are production-grade, actively maintained,
and widely adopted. No experimental or unmaintained libraries.

4.2 FRONTEND ARCHITECTURE
text

NEXT.JS 15 WITH APP ROUTER
───────────────────────────
  File-based routing via src/app/.
  Server-side rendering for fast initial loads.
  Client components ("use client") for interactive features.
  API routes under src/app/api/ for server endpoints.

  Key architectural patterns:
    Route Groups: (protected), (workspace) organize routes
      without affecting URL structure.
    Dynamic Routes: [session] captures username from URL.
    Layouts: Nested layout.tsx files provide shared UI shells.

REACT 19
────────
  All UI is React functional components with hooks.
  Component hierarchy: Page → Feature → UI components.
  Props fully typed with TypeScript interfaces.
  Side effects use useEffect, useCallback, useMemo.

TYPESCRIPT (STRICT MODE)
────────────────────────
  All component props have explicit interface definitions.
  All function parameters and return types annotated.
  Redux state slices have typed selectors and actions.
  Convex queries/mutations auto-typed from schema.
  Pipeline type system enforces phase boundary contracts.

TAILWIND CSS
────────────
  Utility-first CSS applied directly in JSX.
  Responsive design via sm:, md:, lg: breakpoint prefixes.
  Dark mode via dark: prefix tied to theme system.
  Custom theme configuration in tailwind.config.ts.

SHADCN UI
─────────
  Pre-built accessible components copied into the project.
  Full source code ownership — every component customizable.
  Built on Radix UI primitives for accessibility compliance.

PROVIDER ARCHITECTURE
─────────────────────
  Root layout wraps the application in providers
  (outermost to innermost):

    ConvexAuthNextjsServerProvider  (auth SSR support)
      → ThemeProvider               (dark/light mode)
        → ConvexClientProvider       (Convex React hooks)
          → ReduxProvider            (Redux store access)
            → {children}             (page content)
4.3 BACKEND ARCHITECTURE
text

CONVEX (Backend-as-a-Service)
─────────────────────────────
  REAL-TIME DATABASE:
    Automatic sync between server and all clients.
    No manual polling, no WebSocket management.
    All reads are reactive — useQuery hooks auto-update.

  SERVER FUNCTIONS:
    Queries: read-only functions for fetching data.
    Mutations: write functions for creating/updating/deleting.
    Both defined in convex/ as TypeScript, auto-typed from schema.
    Both support authentication via getAuthUserId().

  FILE STORAGE:
    Built-in upload and storage for mood board images.

  AUTHENTICATION:
    Convex Auth handles complete auth lifecycle.
    Google OAuth and password providers configured.

NEXT.JS API ROUTES
──────────────────
    /api/inngest          Inngest webhook receiver.
    /api/project          Project auto-save endpoint.
    /api/generate         AI generation endpoint (optional path).
    /api/webhook/razorpay Payment event webhook.

INNGEST (Background Job Processing)
────────────────────────────────────
    autosave-project:          Processes auto-save events.
    razorpay-webhook-handler:  Processes payment confirmations.
    Automatic retry on failure. Job queuing.
4.4 DATABASE DESIGN
text

CONVEX SCHEMA (convex/schema.ts)
────────────────────────────────

TABLE: projects
───────────────
  name              v.string()              Project display name
  owner             v.id("users")           Owner reference
  sketchesData      v.any()                 Redux shapes state
  viewportData      v.optional(v.any())     Canvas zoom/pan
  styleGuide        v.optional(v.string())  Design prefs (JSON)
    v1-v2: { colors, typography }
    v3.0:  { colors, typography, brief, preset }  ← extended, no schema change
  generatedDesignData v.optional(v.any())   Generation cache
    v3.0:  { inputHash, generatedAt, frames: { [id]: variations } }
  thumbnailGradient v.optional(v.string())  Gradient for card
  lastModified      v.number()              Unix timestamp
  moodBoardImages   v.optional(v.array(v.string()))  Image IDs

  OPERATIONS (convex/projects.ts):
    getProject, getUserProjects, createProject,
    updateProject, deleteProject, duplicateProject


TABLE: project_counters
───────────────────────
  userId            v.string()
  counter           v.number()


TABLE: subscriptions
────────────────────
  userId, plan, status, startDate, endDate, razorpaySubId

  OPERATIONS (convex/subscription.ts):
    hasEntitlement, getSubscription, getCreditBalance,
    getCreditHistory, upsertSubscription, consumeCredits,
    cancelSubscription


TABLE: credits_ledger
─────────────────────
  userId, amount, reason, timestamp, balanceAfter


TABLE: razorpay_orders
──────────────────────
  userId, orderId, amount, status, plan


AUTHENTICATION TABLES (auto-generated by Convex Auth):
  users, sessions, accounts, verificationTokens

ZERO SCHEMA CHANGES required for v3.0.
The existing v.any() and v.optional(v.string()) fields
accommodate all new data structures.
4.5 AUTHENTICATION SYSTEM
text

TWO PROVIDERS:
  1. Password provider (email + password)
  2. Google OAuth provider (one-click via Google)

Configuration:
  convex/auth.config.ts, convex/auth.ts, convex/http.ts

CLIENT-SIDE AUTH FLOW:
  Sign Up (Password): submit → Convex Auth creates user → session token → redirect.
  Sign In (Password): submit → validate → session token → redirect.
  Sign In (Google): click → Google consent → callback → session → redirect.
  Session: HTTP-only cookie. Auto-restored on return visits.

ROUTE PROTECTION (src/middleware.ts):
  Protected: /dashboard/*, /billing
  Public: /, /auth/sign-in, /auth/sign-up
  Redirect: unauthenticated → sign-in; authenticated → dashboard.
4.6 STATE MANAGEMENT
text

REDUX TOOLKIT — FOUR STATE SLICES
──────────────────────────────────

  PROFILE SLICE
    Current authenticated user (avatar, name).

  PROJECTS SLICE
    List of user's projects (dashboard rendering).

  SHAPES SLICE (most critical)
    ALL shapes currently on the canvas.
    Every shape: id, type, position, size, color, text, points.
    This slice is the DIRECT INPUT to the generation pipeline.
    Every drawing action dispatches to this slice.

  VIEWPORT SLICE
    Canvas zoom level (scale) and pan position (translate).

  DATA FLOW:
    User draws → dispatch → reducer updates → components re-render
    → auto-save detects dirty state → persist to Convex

  WHY REDUX:
    Hundreds/thousands of shapes. Predictable reducer updates.
    Redux DevTools for time-travel debugging.
    Selector memoization prevents unnecessary re-renders.
4.7 PAYMENT INFRASTRUCTURE
text

RAZORPAY INTEGRATION
────────────────────
  Native Indian market support. Cards, UPI, net banking.
  Currently in test mode.

  THREE SUBSCRIPTION TIERS:
    Free:         ₹0      5 generations/month
    Pro Monthly:  ₹499/mo  100 generations/month
    Pro Yearly:   ₹4999/yr 1,200 generations/year

  PAYMENT FLOW:
    Subscribe click → Razorpay checkout popup → payment →
    webhook to /api/webhook/razorpay → signature validation →
    Inngest background job → Convex subscription + credits update →
    navbar credit balance updates reactively.

  CREDIT TRACKING:
    Each generation consumes one credit.
    credits_ledger table records every transaction.
    Balance calculated from ledger (not stored directly).
    Users see remaining credits in the navigation bar.

  PRODUCTION READINESS:
    Production requires only Razorpay live API keys. No code changes.
4.8 STATE PERSISTENCE ACROSS PAGES
The v3.0 user journey spans three pages (Canvas, Style Guide,
Generation). React state is destroyed on navigation.

text

DATA INVENTORY:

  SHAPES (canvas drawings):
    Runtime: Redux → Persistent: Convex projects.sketchesData
    Sync: Auto-save every 30s + force save before navigation

  VIEWPORT (zoom/pan):
    Runtime: Redux → Persistent: Convex projects.viewportData
    Sync: Saved alongside shapes

  STYLE GUIDE (colors, typography, brief, preset):
    Runtime: useState → Persistent: Convex projects.styleGuide (JSON)
    Sync: Debounced auto-save (800ms) via direct Convex mutation

  GENERATION RESULTS (code):
    Runtime: useState → Persistent: Convex projects.generatedDesignData
    Sync: Saved after generation completes

  SELECTED FRAMES:
    Via URL params: ?frames=frameId1,frameId2

FORCE SAVE STRATEGY:
  Direct Convex mutation (useMutation) before canvas navigation.
  1 hop, 50-100ms latency (vs auto-save's 3-4 hops, 200-500ms).
  Awaitable — navigation only proceeds after save confirms.
  Coexists with auto-save (dirty check prevents duplicate saves).

GENERATION CACHE:
  Hash of shapes + styleGuide stored with results.
  On page reload: hash match → cached results instantly.
  Hash mismatch → regenerate (< 300ms).
  Cache size: ~30KB per frame (well within Convex's 1MB limit).
4.9 PROJECT FILE STRUCTURE
text

ROOT CONFIGURATION:
  package.json, tsconfig.json, tailwind.config.ts,
  postcss.config.js, next.config.js, .env.local

CONVEX BACKEND (convex/):
  _generated/           Auto-generated types
  schema.ts             Database table definitions
  auth.ts, auth.config.ts, http.ts   Authentication
  projects.ts           Project CRUD operations
  subscription.ts       Billing and credit operations
  moodboard.ts          Image storage operations
  user.ts               User query operations

PIPELINE (src/lib/ai-pipeline/):
  types.ts              Shared interfaces (ExtractedShape, UINode, etc.)
  extractor.ts          Phase 1: shape extraction
  classifier.ts         Phase 2: role classification
  architect.ts          Phase 3: tree construction
  enhancer.ts           Phase 3.5: pattern enhancement
  stylist.ts            Phase 4: style application
  builder.ts            Phase 5: code generation
  index.ts              Pipeline orchestrator
  color-utils.ts        Color palette generation
  design-identity.ts    6 design presets
  content-inferrer.ts   Content + icon inference
  component-library.ts  v0-level HTML templates
  section-engine.ts     Section detection
  🔜 industry-content.ts  10 industry content banks + suggestions
  🔜 variation-generator.ts  Multi-variation generation

FRONTEND SOURCE (src/):
  app/
    page.tsx            Landing page
    layout.tsx          Root layout with providers
    auth/               Sign-in and sign-up pages
    (protected)/
      billing/          Subscription management
      dashboard/
        [session]/
          (dashboard)/  Project cards, New Project
          (workspace)/
            canvas/     Canvas editor
            style-guide/ Style guide (4 tabs + live preview)
            🔜 generate/  Generation page (3 variations)
    api/                Server-side API endpoints

  components/
    ui/                 ShadCN component library
    auth/               Authentication forms
    canvas/             Canvas editor and tools
    generation/         Generation UI components
      generation-panel.tsx     Sandpack preview (v2.0)
      generation-button.tsx    Trigger button on frames
      🔜 frame-selector.tsx    Multi-frame selection modal
      🔜 variation-view.tsx    3-variation cards + expand
      🔜 responsive-toggle.tsx Desktop/tablet/mobile toggle
      🔜 quality-score.tsx     5-dimension quality scoring
      🔜 export-options.tsx    4-format export buttons
    style-guide/        Style configuration components
      🔜 design-brief.tsx     5-field brief form
      🔜 preset-selector.tsx  6-preset visual selector
      🔜 live-preview.tsx     Real-time preview sidebar
    landing/            Landing page sections
    Navbar/             Navigation bar
    projects/           Project cards and management
    theme/              Theme toggle

  hooks/                Custom React hooks
  lib/                  Utility functions + pipeline
  redux/                State management (store, slices, provider)
  types/                TypeScript type definitions
  middleware.ts         Route protection logic
PART 5: AI GENERATION ENGINE
5.1 THE CORE INSIGHT
The generation engine is built on a key insight: the user's
hand-drawn wireframe already contains all the structural
information needed to generate code.

Every shape on the canvas has a type, position, size, color,
and text content — stored as precise numerical data in the
Redux state. When a user draws a rectangle at the top of a
frame spanning the full width with a height of fifty pixels,
containing a small square on the left and two small rectangles
on the right — that geometric arrangement unambiguously
describes a navigation bar with a logo and two action buttons.

No computer vision is needed to detect this. No machine
learning model is needed to classify it. The data is already
structured, typed, and precise.

5.2 THE STRATEGIC DECISION
The most consequential technical decision in D2D's development
was choosing deterministic processing over AI-dependent approaches.

text

REASON 1: DATA QUALITY
  The Redux state contains precise, typed, structured data.
  Computer vision would attempt to RECOVER this data from a
  screenshot — recovering data we already have is backwards.

REASON 2: COST STRUCTURE
  LLM APIs charge per request. A deterministic pipeline has
  zero marginal cost. Same cost at 1 user or 1 million users.

REASON 3: SPEED
  LLMs: 5-30 seconds. Deterministic: under 100 milliseconds.
  50-300x speed advantage.

REASON 4: RELIABILITY
  LLM output is non-deterministic. Same prompt, different results.
  Deterministic output is perfectly reproducible.

REASON 5: INDEPENDENCE
  Zero external dependencies. No API changes, no pricing changes,
  no rate limits, no outages outside our control. Works offline.

COMPETITIVE MOAT:
  Competitors using LLM-based generation cannot replicate our
  cost structure, speed, or reliability without fundamentally
  rebuilding their architecture.

  ┌──────────────────────────┬───────────────┬───────────────┐
  │ Dimension                │ Deterministic │ LLM-Based     │
  ├──────────────────────────┼───────────────┼───────────────┤
  │ Cost per generation      │ ₹0            │ ₹1-10         │
  │ Speed per generation     │ <100ms        │ 5-30 seconds  │
  │ 3 variations             │ <300ms, ₹0    │ 15-90s, ₹3-30 │
  │ Reproducibility          │ 100%          │ ~0%           │
  │ Offline capability       │ Yes           │ No            │
  │ Rate limits              │ None          │ Provider-set  │
  │ Third-party dependency   │ None          │ Critical      │
  │ Scaling cost             │ $0 additional │ Linear growth │
  └──────────────────────────┴───────────────┴───────────────┘
5.3 APPROACHES EXPLORED
Four distinct approaches were evaluated before arriving
at the shipped architecture.

text

APPROACH 1: COMPUTER VISION + LLM FALLBACK
───────────────────────────────────────────
  YOLO v8-Nano for element detection + PaddleOCR for text
  recognition on frame screenshots, with GPT-4 Vision fallback.

  REJECTED:
    Data redundancy (re-detecting what Redux already stores).
    No training dataset for hand-drawn wireframes.
    LLM cost ($0.10-1.00 per generation at scale).
    Python backend adds deployment complexity.
    Non-deterministic output.

  LESSON: Image-based detection is the wrong abstraction.


APPROACH 2: DETERMINISTIC PIPELINE v1
─────────────────────────────────────
  Read shape data from Redux. Classify by type + size + position.
  Build parent-child tree. Generate React with Tailwind.

  RESULT: Structurally correct but visually poor.
  A button got 6 Tailwind classes. No hover states, shadows,
  gradients, or icons.

  LESSON: The pipeline needed OPINIONS about aesthetics,
  not just structural mapping.


APPROACH 3: GEMINI AI ENHANCEMENT
──────────────────────────────────
  Deterministic pipeline output + Google Gemini free tier
  for CSS improvements.

  REJECTED:
    Marginal improvement only.
    Free tier rate limits (15 req/min) impractical.
    Service dependency on Google's free tier.
    Wrong diagnosis — problem was CSS volume, not AI quality.

  LESSON: Richer deterministic output beats AI overlay.


APPROACH 4: DETERMINISTIC PIPELINE v2 (SHIPPED)
────────────────────────────────────────────────
  Same architecture as approach 2 but with dramatically
  richer code generation at every layer.

  KEY REALIZATION:
    v0 looks good because it outputs 25-40 Tailwind classes
    per component. Gradients, colored shadows, hover lifts,
    focus rings, responsive breakpoints, transitions.
    ALL purely deterministic. Zero AI needed.

  RESULT: Quality 10/100 → 60/100. Cost ₹0. Speed <100ms.
5.4 PIPELINE ARCHITECTURE (SEVEN PHASES)
text

USER CLICKS "GENERATE" ON A FRAME
        │
PHASE 1: EXTRACTOR
  Input:   Frame + all canvas shapes
  Logic:   Filter shapes inside frame (overlap ratio ≥50%)
  Output:  ExtractedShape[] (relative to frame origin)
        │
PHASE 2: CLASSIFIER
  Input:   ExtractedShape[]
  Logic:   Map each shape to semantic UI role (17 categories)
  Output:  ClassifiedComponent[] (annotations excluded)
        │
PHASE 3: ARCHITECT
  Input:   ClassifiedComponent[]
  Logic:   Build parent-child tree (70% overlap containment),
           detect row vs column, calculate per-gap spacing
  Output:  UINode tree (nested hierarchy with layout metadata)
        │
PHASE 3.5: ENHANCER
  Input:   UINode tree
  Logic:   Apply 8 deterministic design pattern rules
  Output:  UINode tree (enhanced with hints)
        │
PHASE 4: STYLIST
  Input:   UINode tree + StyleGuide + DesignBrief
  Logic:   Derive design tokens, generate Tailwind classes,
           seeded variation engine, semantic color mapping
  Output:  UINode tree (with tailwindClasses on every node)
        │
PHASE 5: BUILDER
  Input:   Styled UINode tree + DesignBrief
  Logic:   Recursive JSX generation, section composition,
           brand permeation, industry content, entrance animations
  Output:  String (complete React + Tailwind component)
        │
PHASE 6: DISPLAY
  Input:   Generated code string(s)
  Logic:   Generation page with 3 variations, responsive preview,
           export options, quality score, style switching
  Output:  Visual panel with code editing and live rendering

ALL PHASES RUN IN THE BROWSER. NO API. NO SERVER. ₹0.
5.5 SHARED TYPE SYSTEM
text

UI ROLES (17 semantic categories):
  container, card, button, input, checkbox, heading, paragraph,
  image, video, chart, divider, nav, avatar, icon,
  device-wrapper, decorative, annotation

EXTRACTED SHAPE (Phase 1 output):
  originalShape, relX, relY, width, height, centerX, centerY

CLASSIFIED COMPONENT (Phase 2 output):
  id, role, relX, relY, width, height, centerX, centerY,
  text, properties, originalShape

UI NODE (Phase 3+ output):
  id, role, relX, relY, width, height, text, properties,
  children[], layout ("row"|"column"), gaps[],
  enhancementHints[], tailwindClasses

DESIGN TOKENS (Phase 4):
  colors (primary, secondary, accent, background, surface,
  textHeading, textBody, textMuted, border),
  font (heading, body),
  variation (borderRadius, shadow, spacing)

TYPE SAFETY:
  Every phase boundary is type-checked at compile time.
  If any phase changes its output shape, TypeScript catches
  the mismatch at the next phase's input boundary.
  No 'any' types in the pipeline except at the Redux boundary.
5.6 PHASE 1 — EXTRACTOR
text

PURPOSE: Extract shapes inside the frame with normalized coordinates.

UNIVERSAL BOUNDING BOX — four coordinate systems:
  Bounded shapes (18 types): direct x,y,w,h.
  Line-like (arrow, line, connector): min/max of endpoints.
  Point-array (freedraw, highlighter): min/max of all points.
  Text: char count × fontSize × 0.55; height from lineHeight × lines.

OVERLAP-RATIO CONTAINMENT:
  Intersection area / shape area ≥ 50% → shape is "inside."
  (Not center-point, which fails for partially inside shapes.)

COORDINATE NORMALIZATION:
  relX = shape.x - frame.x; relY = shape.y - frame.y
  Shapes sorted top-to-bottom, left-to-right (10px threshold).

EXCLUSIONS:
  Frame itself, other frames, GeneratedUI shapes, near-zero dimensions.
5.7 PHASE 2 — CLASSIFIER
text

PURPOSE: Assign semantic UI role to every extracted shape.

DIRECT MAPPING (10 known types):
  buttonShape→button, inputField→input, checkbox→checkbox,
  hamburgerMenu→nav, imagePlaceholder→image, videoPlaceholder→video,
  chartPlaceholder→chart, divider→divider, deviceFrame→device-wrapper,
  text→heading/paragraph (by font size/weight).

HEURISTIC MAPPING (generic shapes):
  rect: w>150, h 30-60 → input; w≤200, h 25-60 → button; else container.
  roundedRect: w≤200, h≤60 → button; else card.
  ellipse/circle: w,h<60 → avatar; else decorative.
  triangle, star, polygon → decorative.

TEXT INTELLIGENCE:
  fontSize≥32, fontWeight≥600 → h1; ≥24 → h2; ≥20 → h3; ≥18 → h4;
  else paragraph.

ANNOTATION EXCLUSION:
  stickyNote, speechBubble, arrow, connector, freedraw, highlighter
  → classified as annotation and excluded from output.
5.8 PHASE 3 — ARCHITECT
text

PURPOSE: Convert flat list into nested UINode tree.

THREE CRITICAL FIXES FROM v1:
  FIX 1: Overlap ratio containment (≥70% of child area in parent)
         instead of center-point.
  FIX 2: Relative row threshold = min(5% frame height, 50% avg child height)
         instead of fixed 30px. Majority rule for row vs column.
  FIX 3: Per-gap array (gaps[i] = space between child i and i+1),
         snapped to Tailwind scale; Builder uses gap-X or per-child margin.

TREE CONSTRUCTION:
  For each component, find smallest containing parent (≥70% overlap).
  Only container, card, device-wrapper can be parents.
  Group by parent; no parent → root children.
  For each parent: detect layout, sort children, calculate per-gap.
  Root = frame boundary, role container.
5.9 PHASE 3.5 — ENHANCER
text

PURPOSE: Bridge "structurally correct" to "professionally designed."
Eight deterministic pattern rules, additive and independent.

RULE 1: AUTO-CENTER FORM
  Root column with heading+inputs+button (≤6 children)
  → "centered-form" (max-w-md mx-auto rounded shadow)

RULE 2: AUTO-CARDIFY
  Container with image+heading/text or heading+text+button
  → role to card, "auto-card" (shadow, rounded, hover)

RULE 3: AUTO-RESPONSIVE GRID
  2-4 similar cards in row → "responsive-grid-N"

RULE 4: AUTO-STICKY NAV
  First root child is nav → "sticky-nav" (sticky top-0 z-50)

RULE 5: AUTO-SECTION SPACING
  Section breaks (button→heading, divider) → gap≥48px

RULE 6: AUTO HERO
  First 2-3 root: h1+paragraph+(button) → "hero-heading", "hero-text"

RULE 7: AUTO INPUT GROUPS
  Consecutive inputs in column → "input-group-member", 16px gaps

RULE 8: AUTO FOOTER
  Last root child after divider → "footer" (mt-auto pt-6 text-center muted)
5.10 PHASE 4 — STYLIST
text

PURPOSE: Generate Tailwind CSS classes for every node.

DESIGN TOKEN DERIVATION:
  Primary/secondary/accent from style guide swatches.
  Surface/border from neutral. Background white.
  Fonts from typography. Fallbacks for all values.

SEMANTIC COLOR MAPPING:
  Primary → buttons, links, focus rings.
  Secondary → secondary buttons.
  Accent → highlights. Surface → cards.
  Border → inputs, dividers.
  textHeading/Body/Muted for typography.

SEEDED VARIATION ENGINE:
  seed = hash(frame.id). Deterministic choice of:
  border radius (sm|md|lg|xl), shadow (none|sm|md|lg),
  spacing (compact|comfortable|spacious).
  Same frame = same variation, always.

PER-ROLE CLASS GENERATION:
  Container, card, button (primary/secondary/outline/ghost),
  input, heading levels, paragraph, image, video, nav,
  divider, avatar, chart, decorative — each role gets
  token-based Tailwind classes. Enhancement hints add
  centered-form, grid, sticky, hero, footer patterns.
5.11 PHASE 5 — BUILDER
text

PURPOSE: Generate the final React component string.

JSX GENERATION:
  Role → tag: heading→h1-h4, paragraph→p, button→button,
  input→input+label, checkbox→label+input+span,
  image/video/chart→div+placeholder, divider→hr,
  nav→nav+Logo+hamburger, avatar→div+initial,
  container/card→div+children.
  Text escaped for JSX. 2-space indent.

GAP STRATEGY:
  Uniform gaps → single gap-X on parent.
  Non-uniform → per-child mt-X or ml-X.

SECTION COMPOSITION (v3.0):
  Nav → transparent/glass overlay.
  Hero → accent or gradient background.
  Features → light surface-alt.
  Content → white.
  CTA → dark accent background with white text.
  Footer → darkest (gray-900).
  Entrance animation staggering (100ms per section).

BRAND PERMEATION (v3.0):
  Nav logo: "◆ {brandName}"
  Footer: "© 2025 {brandName}. All rights reserved."
  CTA: "Ready to try {brandName}?"
  All user text HTML-escaped.

INDUSTRY CONTENT (v3.0):
  Content inferrer selects from industry-specific bank.
  Position-based hash for deterministic selection.
  Same position → same content, always.

OUTPUT FORMAT:
  export default function GeneratedUI() { return ( ... ); }
  50-500 lines of production-ready React + Tailwind.
5.12 PHASE 6 — DISPLAY
text

v2.0 (SHIPPED):
  Sandpack live editor + preview panel.
  react-ts template, dark theme, Tailwind CDN.
  Copy Code, Download TSX, Regenerate, Close.
  Generation button on selected frame toolbar.

v3.0 (BUILD-READY):
  Full Generation Page replaces popup overlay.
  Three variation cards with scaled preview iframes.
  Click to expand: full code editor + live preview.
  Responsive toggle: desktop (1440px), tablet (768px), mobile (375px).
  Four export formats: Copy, TSX, HTML, Design Tokens JSON.
  "Try Another Style" dropdown for instant preset switching.
  Quality score visualization (5 dimensions).
  "Explain My Design" panel (pipeline decision log).
  Loading animation (1.5s) with stagger card reveal.
  Cache with hash-based invalidation.
5.13 PIPELINE ORCHESTRATOR
text

MAIN FUNCTION:
  generateFromFrame(frame, allShapes, styleGuide) → string

  Chains: extract → classify → buildHierarchy → enhanceTree
  → buildDesignTokens + applyStyles → generateCode.

  Synchronous. <100ms. styleGuide.brief extracted and passed
  to content inferrer and identity builder.

VARIATION GENERATOR (v3.0):
  generateVariations(frame, allShapes, styleGuide) → Variation[]

  selectThreePresets(selected, suggested) using contrast mapping.
  Runs generateFromFrame 3 times with 3 different presets.
  <300ms total. ₹0. All in browser.

EMPTY FRAME: Placeholder message.
ALL ANNOTATIONS: "No UI components found."
ERROR BOUNDARIES: try/catch, toast on error, defensive defaults.
5.14 PIPELINE PERFORMANCE
text

┌───────────────────────────────────┬──────────────────────┐
│ Metric                           │ Value                 │
├───────────────────────────────────┼──────────────────────┤
│ Cost per generation               │ ₹0 (zero)            │
│ Single generation time            │ < 100 milliseconds    │
│ Three variations time             │ < 300 milliseconds    │
│ Processing location               │ Client browser        │
│ Server load per generation        │ Zero                  │
│ API calls per generation          │ Zero                  │
│ Network requests                  │ Zero                  │
│ Output determinism                │ 100% (same in = out)  │
│ Works offline                     │ Yes                   │
│ Rate limits                       │ None                  │
│ Maximum shapes supported          │ Tested to 100+        │
│ Output line count                 │ 50-500 lines          │
│ Avg Tailwind classes/element      │ 15-25                 │
│ Responsive breakpoints            │ 3+ (sm, md, lg)       │
│ Interactive states                │ hover, focus, active   │
│ Shape types supported             │ 26 (of 26)            │
│ UI roles classified               │ 17 categories         │
│ Enhancement rules                 │ 8 design patterns     │
│ Design presets                    │ 6 identities          │
│ Industry content banks            │ 10                    │
└───────────────────────────────────┴──────────────────────┘

BUSINESS IMPACT:
  At 10,000 users × 50 generations/day each,
  D2D's generation cost is still ₹0.
  Competitors using LLMs would pay ₹5,000-50,000/day.
  This is a structural advantage that compounds with every user.
PART 6: CONTEXT LAYER
6.1 THE MISSING CONTEXT PROBLEM
The v2.0 pipeline produces structurally correct, responsive
code. But every wireframe produces generic-looking output
regardless of what the user is building.

text

THE SAME WIREFRAME (nav + hero + 3 cards + footer):

  As a RESTAURANT website:
    v2.0 produces: "Build something amazing" hero heading,
    "Feature 1, 2, 3" cards, "Get Started" button,
    generic tech icons (zap, shield, rocket).

  As a MEDICAL platform:
    v2.0 produces: IDENTICAL output.

  As a FINANCE dashboard:
    v2.0 produces: IDENTICAL output again.

WHAT THE PIPELINE KNOWS (from v2.0):
  ✅ Exact position, dimensions, type of every element
  ✅ Containment, proximity, layout direction
  ✅ Color palette, typography preferences

WHAT THE PIPELINE DOES NOT KNOW:
  ❌ What type of page is this?
  ❌ What industry is this for?
  ❌ What is the brand name?
  ❌ What is the tagline?
  ❌ What tone should the content have?
  ❌ What icons, CTA language, nav links fit this industry?

v0 gets this context from text prompts. D2D collects it
through a structured Design Brief — actually BETTER than
text because structured selections are deterministic.
No interpretation variance. No ambiguity.
6.2 THE DESIGN BRIEF
A structured visual form capturing five fields of semantic context.

text

FIELD 1: PAGE TYPE
  Visual icon cards in a grid (click to select).
  Values: Landing Page, Dashboard, Login/Sign Up, Blog,
  Portfolio, E-commerce, SaaS, Agency, Restaurant, Pricing.
  Controls section template selection and layout assumptions.

FIELD 2: INDUSTRY
  Emoji icon chips in a horizontal wrap.
  12 industries: Technology, Healthcare, Education,
  Food & Beverage, Fashion, Finance, Real Estate,
  Travel, Fitness, Creative, Legal, Agency.
  Controls content bank selection, icon filtering,
  color suggestions.

FIELD 3: TONE
  Visual cards with mini live previews.
  6 tones: Professional, Playful, Minimal, Bold, Elegant, Futuristic.
  Each card renders a tiny live HTML preview styled with
  that tone's actual identity settings.
  Controls design preset recommendation, typography weight,
  content language style.

FIELD 4: BRAND NAME
  Styled text input, max 30 characters.
  Permeates output: nav logo, footer, hero, CTA, code comments.
  HTML-escaped before insertion (XSS prevention).

FIELD 5: TAGLINE
  Styled text input, max 100 characters.
  Placeholder changes based on industry selection.
  Appears in hero subtitle, CTA description.
  HTML-escaped.

STORAGE:
  Stored inside existing styleGuide JSON string in Convex.
  No schema changes required.

  interface DesignBrief {
    pageType: string;
    industry: string;
    tone: string;
    brandName: string;
    tagline: string;
  }

BACKWARD COMPATIBILITY:
  If brief is undefined, all layers fall back to generic defaults.
  Industry → "tech", Brand → "Brand", Tone → "professional".
  Pipeline ALWAYS produces valid output.
6.3 INDUSTRY-SPECIFIC CONTENT ENGINE
Ten industry content banks with five to eight options per
content category. Total: approximately 500-600 lines of
structured content data.

text

EACH BANK CONTAINS:
  heroHeadings (4-6 options), heroSubtexts (3-4),
  featureTitles (6-8), featureDescriptions (3-4),
  ctaPrimary (3-4), ctaSecondary (3-4),
  navLinks (4-6), footerLinks (4-6),
  icons (4-5 preferred names),
  colorSuggestion (hex), fontSuggestion ([heading, body])

TEN INDUSTRIES WITH SAMPLE CONTENT:

  TECHNOLOGY:
    Hero: "Ship faster, grow smarter"
    CTA: "Start Free Trial" | "View Documentation"
    Icons: zap, shield-check, rocket, code, globe

  HEALTHCARE:
    Hero: "Healthcare you can trust"
    CTA: "Book Appointment" | "Find a Doctor"
    Icons: shield-check, heart, user, phone, calendar

  RESTAURANT:
    Hero: "A culinary journey awaits"
    CTA: "Reserve a Table" | "View Menu"
    Icons: star, heart, map-pin, clock, calendar

  EDUCATION:
    Hero: "Learn without limits"
    CTA: "Enroll Now" | "Browse Courses"
    Icons: globe, star, check, play, user

  E-COMMERCE:
    Hero: "Discover your style"
    CTA: "Shop Now" | "Browse Collection"
    Icons: heart, star, credit-card, download, share

  FINANCE:
    Hero: "Your money, simplified"
    CTA: "Open Account" | "Compare Plans"
    Icons: shield-check, credit-card, chart-bar, lock

  AGENCY:
    Hero: "We build brands that matter"
    CTA: "Let's Talk" | "View Our Work"
    Icons: palette, code, rocket, globe, sparkles

  FITNESS:
    Hero: "Push your limits"
    CTA: "Join Now" | "Free Trial"
    Icons: zap, heart, star, calendar, user

  REAL ESTATE:
    Hero: "Find your dream home"
    CTA: "Browse Listings" | "Find a Home"
    Icons: home, map-pin, search, heart, star

  TRAVEL:
    Hero: "Adventure awaits"
    CTA: "Explore Now" | "Book a Trip"
    Icons: globe, map-pin, star, calendar, heart

CONTENT SELECTION (deterministic):
  Position-based hash selects from the bank.
  Same wireframe position → same content selection.
  No randomness. Perfectly reproducible output.

BRAND PERMEATION:
  Brand name and tagline are not placed once. They permeate:
    Nav: "◆ {brandName}"
    Hero: "Welcome to {brandName}" (contextual)
    CTA: "Ready to try {brandName}?"
    Footer: "© 2025 {brandName}. All rights reserved."
    Code: // Generated by D2D for {brandName}
6.4 SMART SUGGESTIONS SYSTEM
When the user selects industry and tone, the Smart Suggestions
engine recommends the optimal preset, primary color, and fonts.

text

30 CURATED MAPPINGS (sample):

  tech + professional    → startup-modern   + #3b82f6 + Inter, Inter
  tech + futuristic     → glass-gradient   + #8b5cf6 + Space Grotesk, Inter
  restaurant + elegant   → minimal-elegant  + #92400e + Playfair Display, Inter
  finance + professional → corporate-clean  + #1e40af + Inter, Inter
  agency + bold          → bold-creative    + #6d28d9 + Plus Jakarta Sans, Inter
  fitness + bold         → bold-creative    + #dc2626 + Plus Jakarta Sans, Inter
  travel + playful       → bold-creative    + #0284c7 + Nunito, Inter

  DEFAULT (unmatched): startup-modern + #3b82f6 + Inter, Inter

UI: Suggestion panel with individual "Apply" buttons and
"Apply All Suggestions" for one-click application.
Non-destructive — user explicitly accepts.
6.5 DESIGN PRESET SELECTOR
Six preset cards in a 2×3 grid, replacing the Mood Board tab.

text

EACH CARD CONTAINS:
  Mini live preview (micro-iframe, 150×100px, CSS scale 0.3)
  rendered with that preset's actual identity.
  Preset name and one-line description.
  Color dots showing the palette.
  "Recommended" badge (from Smart Suggestions, if brief filled).

SIX PRESETS:
  Startup Modern, Corporate Clean, Bold Creative,
  Minimal Elegant, Dashboard Dense, Glass & Gradient.

Click to select with ring-2 highlight. Saves to
styleGuide.preset in Convex. Live preview sidebar
updates immediately.
6.6 LIVE PREVIEW
The killer feature of the Style Guide page. No competitor
shows how design choices affect output BEFORE generation.

text

FIXED TEMPLATE:
  Nav + Hero + 3 Feature Cards + Footer.
  Exercises every design token: primary color, surface,
  heading font, body font, border radius, shadow, spacing.

REAL-TIME UPDATE:
  buildDesignIdentity() called with current settings.
  Tokens injected into template. Set as iframe srcdoc.
  Debounced by 100ms. Total latency <200ms (feels instant).
  Tailwind CSS and Google Fonts via CDN.

  Change color → buttons change color instantly.
  Switch font → headings re-render instantly.
  Select preset → everything updates instantly.
  Type brand name → appears in nav instantly.

PLACEMENT:
  Right sidebar on Style Guide page. Visible alongside
  all four tabs. Hidden on mobile, shown on tablet/desktop.
6.7 MULTI-VARIATION GENERATION
text

THE MIDJOURNEY INSIGHT:
  MidJourney shows four images, not one.
  Users receive OPTIONS, not take-it-or-leave-it.
  D2D applies the same principle.

  Pipeline runs in <100ms. Three runs = <300ms = ₹0.
  Three complete professional websites, faster than
  v0 generates one.

INTELLIGENT PRESET SELECTION (CONTRAST MAPPING):
  If user selected a preset:
    Var 1: Their preset
    Var 2: Best contrasting preset
    Var 3: Second best contrasting preset

  Contrast mapping:
    startup-modern   ↔ minimal-elegant, glass-gradient
    corporate-clean  ↔ bold-creative, glass-gradient
    bold-creative    ↔ minimal-elegant, corporate-clean
    minimal-elegant  ↔ bold-creative, startup-modern
    dashboard-dense  ↔ bold-creative, glass-gradient
    glass-gradient   ↔ corporate-clean, minimal-elegant

"TRY ANOTHER STYLE" — INSTANT SWITCHING:
  Dropdown with all six presets + "Surprise Me."
  Each click: pipeline runs (<100ms), code + preview update.
  User can cycle through ALL SIX presets in ~3 seconds.

  SIX COMPLETE WEBSITE DESIGNS FROM ONE WIREFRAME
  IN THREE SECONDS FOR ZERO RUPEES.

  Preview transitions via 200ms opacity fade.
PART 7: THE GENERATION PAGE
7.1 FROM POPUP TO DESTINATION
The current popup overlay is replaced by a dedicated full page.
Route: /dashboard/[session]/generate?project=xxx&frames=f1,f2

This page is the PAYOFF of the entire D2D experience —
where the user sees their rough sketch transformed into
professional websites. It should feel like a reveal.

7.2 PAGE LAYOUT AND INTERACTION DESIGN
text

┌──────────────────────────────────────────────────────────┐
│  ← Back to Canvas    D2D Generation    [Style Guide]    │
│──────────────────────────────────────────────────────────│
│                                                          │
│  THREE VARIATION CARDS (side by side):                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │  Scaled  │    │  Scaled  │    │  Scaled  │          │
│  │ Preview  │    │ Preview  │    │ Preview  │          │
│  └──────────┘    └──────────┘    └──────────┘          │
│  Startup Modern   Minimal Elegant  Glass Gradient       │
│                                                          │
│  Click any variation to expand:                          │
│  ┌──────────────────┬───────────────────────┐           │
│  │   Code Editor    │   Live Preview        │           │
│  │   (left half)    │   🖥 💻 📱 toggle     │           │
│  └──────────────────┴───────────────────────┘           │
│                                                          │
│  [Copy] [TSX] [HTML] [Tokens]  [Try Another Style ▼]    │
│  Quality: 87/100    Explain My Design ▼                  │
│  [← Back to Style Guide]  [← Back to Canvas]            │
└──────────────────────────────────────────────────────────┘

INTERACTION FLOW:
  1. Page loads with 1.5s loading animation.
  2. Pipeline runs during animation (< 300ms).
  3. Results stored but NOT displayed until animation completes.
  4. Three cards reveal with stagger animation (150ms between).
  5. Click to expand: full code + full preview.
  6. Lazy full preview (only on expand, one iframe at a time).

DATA SOURCE:
  Reads from Convex (not Redux). Shapes from sketchesData,
  style guide from styleGuide. Always fresh from database.
  Cache: hash-based invalidation for instant reload.
7.3 RESPONSIVE PREVIEW TOGGLE
text

Three buttons: 🖥 Desktop (1440px) | 💻 Tablet (768px) | 📱 Mobile (375px)

Iframe always width 100%. Container constrains it.
300ms CSS transition for smooth resizing.

PROVES the generated code is responsive.
User sees three-column → two-column → single-column
without downloading or testing externally.
7.4 EXPORT OPTIONS (FOUR FORMATS)
text

COPY CODE:       Clipboard. Target: React developers.
DOWNLOAD TSX:    GeneratedUI.tsx file. Target: React developers.
DOWNLOAD HTML:   Standalone .html file (Tailwind CDN, no build step).
                 Target: students, non-developers, quick prototypes.
DESIGN TOKENS:   .json file with complete design identity.
                 Target: devs wanting the design system without code.

All exports are entirely client-side. No API calls. No cost.
7.5 QUALITY SCORE VISUALIZATION
text

Collapsible panel, 5 weighted dimensions:

  Responsiveness (20%):      Count responsive prefix classes.
  Component Richness (25%):  Average Tailwind classes per element.
  Typography (15%):          Distinct font-size values.
  Color Harmony (15%):       Distinct background colors.
  Content Relevance (25%):   Brand name, tagline, industry content.

  Total: weighted average.

ACTIONABLE TIPS:
  Content < 80: "Add a tagline in your Design Brief."
  Typography < 70: "Add more text elements to your wireframe."
  Color < 70: "Add colors in the Style Guide Colors tab."

Implementation: regex and string matching on generated code.
~60 lines. No dependencies.
7.6 THE LOADING ANIMATION
text

Even though generation takes <300ms, a 1.5s animated loading
sequence builds anticipation (MidJourney/ChatGPT pattern).

  0.0s: "Analyzing layout..."
  0.3s: "✅ Layout analyzed" → "Detecting sections..."
  0.6s: "✅ Sections identified" → "Applying brand..."
  0.9s: "✅ Brand applied" → "Generating variations..."
  1.2s: "✅ 3 variations ready"
  1.5s: Fade out → cards REVEAL with stagger

Steps shown are REAL pipeline steps. Timing is artificial.
Generation runs DURING animation. By completion, results are ready.
User never waits — they see a satisfying animation masking
near-instantaneous computation.
7.7 "EXPLAIN MY DESIGN" PANEL
text

Collapsible panel showing HOW the pipeline interpreted
the wireframe. Builds trust, educates, helps debugging.

  ✅ Navigation detected (top bar with 3 elements)
     → Glass-style sticky nav with logo + links + CTA

  ✅ Hero section detected (large heading + image area)
     → Split hero: heading left, image right

  ✅ Feature grid detected (3 similar cards)
     → 3-column responsive grid with icons

  🎨 Design: Startup Modern
  📝 Content: Technology industry bank
  🏷️ Brand: "Acme" applied to nav, footer, CTA

Implementation: DecisionLog collected during pipeline run.
No competitor explains their generation.
PART 8: DEPLOYMENT & OPERATIONS
8.1 DEPLOYMENT ARCHITECTURE
text

┌─────────────────────────────────────────────────┐
│ VERCEL (Frontend Hosting)                       │
│  Global CDN, edge functions, serverless APIs    │
│  Automatic HTTPS, git-based deploys             │
└─────────────────┬───────────────────────────────┘
                  │ WebSocket + HTTPS
                  ▼
┌─────────────────────────────────────────────────┐
│ CONVEX (Backend Infrastructure)                 │
│  Real-time database, server functions           │
│  File storage, authentication                   │
│  Automatic scaling and replication              │
└─────────────────┬───────────────────────────────┘
                  │ Webhooks
          ┌───────┴───────┐
          ▼               ▼
┌──────────────────┐  ┌──────────────────┐
│ INNGEST          │  │ RAZORPAY         │
│ Background jobs  │  │ Payment processing│
│ Auto-retry       │  │ Indian market    │
└──────────────────┘  └──────────────────┘
8.2 INFRASTRUCTURE & COST MODEL
text

CURRENT:       ~$1/month (Vercel + Convex free tiers, domain)
AT 500 USERS:  ~$46-101/month
REVENUE (10% Pro): ~$300/month
MARGIN:        ~66-77%
BREAK-EVEN:    ~10 Pro subscribers

Generation runs client-side → zero server cost per generation.
At 100,000 generations/day, generation cost is still ₹0.

CLIENT-SIDE (zero marginal cost):
  Canvas rendering, shape management, pipeline execution,
  preview rendering, export processing.

SERVER-SIDE (scales with users, not generations):
  Page loads, DB operations, authentication,
  auto-save writes, style guide saves.
8.3 SECURITY POSTURE
text

AUTHENTICATION:
  HTTP-only cookies, OAuth 2.0, Convex Auth.

DATA:
  HTTPS everywhere. Encryption at rest (Convex).
  No secrets in client code.

PAYMENTS:
  Razorpay handles all card data. Webhook signature validation.
  No payment data stored in D2D.

XSS PREVENTION:
  All user-supplied text (brand name, tagline) HTML-escaped:
    escapeHtml() replaces &, <, >, ", ' with entities.
  Preview iframes sandboxed:
    sandbox="allow-scripts" (no allow-same-origin).
    Content Security Policy restricts scripts to Tailwind CDN only.
  Defense is layered: escaping + sandboxing + CSP.

INPUT VALIDATION:
  Brand name max 30 characters. Tagline max 100 characters.
  HTML-escaped user content. Preview iframe sandboxed.
PART 9: EDGE CASES, TESTING & QUALITY
9.1 EDGE CASE MATRIX
text

┌───────────────────────────────────┬───────────────────────────────────────┐
│ Edge Case                         │ Handling                              │
├───────────────────────────────────┼───────────────────────────────────────┤
│ Empty frame (no shapes)           │ If brief exists: default template     │
│                                   │ page. If no brief: placeholder.       │
│ No frame drawn                    │ Generate button disabled. Tooltip.    │
│ Multiple overlapping frames       │ Each generates independently. Shape   │
│                                   │ assigned to frame with most overlap.  │
│ Very small frame (< 200px)        │ Warning toast. Generation proceeds.   │
│ Only annotations in frame         │ "No UI components found."             │
│ Single shape                      │ Generates with that one element.      │
│ 100+ shapes in frame              │ Works. O(n²) tree: 100 shapes ≈ 4ms. │
│ Brand name too long               │ Input max-length 30. Nav truncates.   │
│ XSS in brand name                 │ escapeHtml converts. Visible text.    │
│ Convex down during force save     │ Error toast. User stays on canvas.    │
│                                   │ Work preserved in Redux. Retry.       │
│ Style guide not configured        │ All defaults apply. Always works.     │
│ Browser tab close during gen      │ Cache: preserved. No cache: <300ms.   │
│ Two tabs open (canvas + guide)    │ Convex handles concurrent writes.     │
│ Overlapping shapes                │ 70% overlap ratio. Deterministic.     │
│ Same-Y threshold                  │ 10px tolerance for row detection.     │
│ Uneven spacing                    │ Per-gap array preserves real spacing. │
│ Deep nesting                      │ Recursive tree. No depth limit.       │
│ Special chars in text             │ JSX-escaped.                          │
│ Slow network (preview loading)    │ Loading skeleton. Code appears first. │
│ CDN offline                       │ Toast. Code still correct.            │
└───────────────────────────────────┴───────────────────────────────────────┘
9.2 VERIFICATION SCENARIOS
text

1) Login form     → centered card, max-w-md, shadow
2) Card grid      → responsive-grid-3 + auto-card
3) Nav + hero     → sticky nav, hero heading
4) Empty frame    → placeholder message
5) Mixed annotations → only button+input in output
6) Nested containers → div>card>button
7) Style guide    → primary color and font in output
8) Restaurant brief → "Reserve a Table", restaurant icons
9) 3 variations   → 3 different presets, contrast maximized
10) Try Another Style → instant switch, <100ms
9.3 GRACEFUL DEGRADATION PHILOSOPHY
text

PRINCIPLE: Never show a blank screen. Never show a raw error.
Always show a helpful message with a clear action.

Every error message follows: WHAT HAPPENED + WHAT TO DO

  ❌ "Failed to save. Check connection. [Retry]"
  ❌ "Draw a frame first (press F)."
  ❌ "Preview styles couldn't load. Code is still correct."
  ⚠️ "Frame is very small. For best results, 200×200 minimum."
9.4 QUALITY METRICS AND PROJECTION
text

EIGHT QUALITY DIMENSIONS:

  Dimension              v2.0   v3.0(proj)  Change
  ────────────────────   ─────  ──────────  ──────
  Structural Accuracy     85     85          —
  Responsive Design       80     80          —
  Visual Coherence        60     75          +25%
  Component Richness      70     75          +7%
  Typography              65     70          +8%
  Content Relevance       40     85          +112%
  Brand Personality       20     70          +250%
  User Confidence         50     100         +100%

  OVERALL SCORE:          ~62    ~85         +37%

  Biggest gains from context layer:
    Content Relevance: generic → industry-specific (+112%)
    Brand Personality: absent → permeated (+250%)
    User Confidence: popup → full page + 3 variations (+100%)
PART 10: BUSINESS MODEL & OUTLOOK
10.1 REVENUE MODEL
text

Freemium subscription with credits.

  Free:         ₹0       5 generations/month
  Pro Monthly:  ₹499/mo  100 generations/month
  Pro Yearly:   ₹4,999/yr 1,200 generations/year

No feature gating — only generation count limited on free tier.
All features (brief, presets, variations, exports) available to all.
10.2 UNIT ECONOMICS
text

Free user infrastructure cost:   ~₹0.50/month
Pro user infrastructure cost:    ~₹15/month
Pro user revenue:                ₹499/month
Gross margin per Pro user:       ~97%
Generation cost:                 ₹0 (client-side, any scale)
Break-even:                      ~10 Pro subscribers
10.3 SCALABILITY PROFILE
text

CLIENT-SIDE (zero marginal cost):
  Canvas rendering, all 7 pipeline phases, preview rendering,
  3-variation generation, responsive preview, export processing.

SERVER-SIDE (scales with users, not generations):
  Page loads (Vercel CDN/edge), DB reads/writes (Convex),
  authentication (Convex Auth), auto-save + force-save writes.

NO GENERATION API BOTTLENECK.
At 10,000 users × 50 gen/day = 500,000 gen/day → ₹0 server cost.
10.4 COMPETITIVE POSITION
text

EIGHT UNIQUE ADVANTAGES (no competitor has any of these):

  1. Sketch-to-code from hand-drawn wireframes
  2. Zero marginal cost per generation (deterministic, client-side)
  3. Sub-second generation (100-300x faster than LLM competitors)
  4. 100% deterministic output (reproducible, debuggable)
  5. Structured brand context (industry, tone, brand, tagline)
  6. Three simultaneous variations (MidJourney-style)
  7. Live preview before generation (real-time design token preview)
  8. Instant style switching (6 presets, <100ms each)

TECHNICAL MOAT:
  Replicating requires: structured canvas with 26-shape bbox,
  17-role classifier, overlap-ratio tree builder, 8 enhancement
  rules, 6 design identity presets, 10 industry content banks,
  30-mapping suggestion engine, variation generator with
  contrast mapping, per-gap builder, semantic token system.
  No shortcut. No LLM wrapper can replicate this architecture.
10.5 WHAT COMES NEXT
text

v1.0 (SHIPPED):  Application shell — canvas, auth, payments, auto-save.
v2.0 (SHIPPED):  7-phase pipeline — 60/100 quality, <100ms, ₹0.
v3.0 (PLANNED):  Context layer — brief, industry content, 3 variations,
                 generation page, live preview. 85/100 quality target.

POST-v3.0:
  Multi-page website generation (cross-frame navigation).
  Template library (pre-built starting wireframes).
  Collaboration (real-time multi-user canvas).
  Plugin system (custom components, custom content banks).
  Image upload to code (computer vision, optional AI path).
  Export to Figma (reverse pipeline).

All future features maintain the ₹0 generation cost principle.
Every enhancement is additive to the deterministic pipeline.
APPENDIX A: ARCHITECTURE DIAGRAMS
A.1 HIGH-LEVEL SYSTEM ARCHITECTURE
text

                    ┌─────────────────────────────────────────────────────────┐
                    │                    USER BROWSER                         │
                    │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
                    │  │ Next.js App │  │   Redux     │  │ Generation      │ │
                    │  │ (React 19)  │  │   Store     │  │ Pipeline        │ │
                    │  │             │  │ (shapes,    │  │ (client-side,   │ │
                    │  │ Canvas,     │  │  viewport)  │  │  <300ms for 3)  │ │
                    │  │ Style Guide │  └──────┬──────┘  └────────┬────────┘ │
                    │  │ Generation  │         │                  │          │
                    │  └──────┬──────┘         │ Auto-save        │ (no net) │
                    └─────────┼────────────────┼──────────────────┼──────────┘
                              │                │                  │
                    HTTPS     │                │ every 30s        │
                              ▼                ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           VERCEL (Edge + Serverless)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │ Static/SSR   │  │ /api/project │  │ /api/inngest │  │ /api/webhook/      │ │
│  │ Pages        │  │ (PATCH save) │  │ (events)     │  │ razorpay           │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └────────────────────┘ │
└────────────────────────────────┬──────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CONVEX (BaaS)                                      │
│  Real-time DB │ Queries/Mutations │ File Storage │ Convex Auth                  │
│  projects, subscriptions, credits_ledger, users, sessions                      │
└─────────────────────────────────┬───────────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────────┐
          ▼                       ▼                           ▼
│ INNGEST          │  │ RAZORPAY             │  │ Google OAuth          │
│ autosave-project │  │ Checkout + Webhooks  │  │ (Sign in with Google) │
│ razorpay-handler │  │ Credits / Plans      │  │                       │
└──────────────────┘  └──────────────────────┘  └──────────────────────┘
A.2 FRONTEND APPLICATION ARCHITECTURE
text

┌────────────────────────────────────────────────────────────────────────────────┐
│  ROOT LAYOUT (src/app/layout.tsx)                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │ ConvexAuthNextjsServerProvider                                            │  │
│  │   └─ ThemeProvider (dark/light)                                           │  │
│  │        └─ ConvexClientProvider                                            │  │
│  │             └─ ReduxProvider                                               │  │
│  │                  └─ {children}  ← App routes                              │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────┘

ROUTE TREE (App Router)
──────────────────────
  /                    → Landing page (public)
  /auth/sign-in        → Sign-in page (public)
  /auth/sign-up        → Sign-up page (public)
  /dashboard/[session] → Protected layout
      ├─ (dashboard)   → Project cards, New Project
      └─ (workspace)   → Shared workspace layout
            ├─ canvas?project=...      → Canvas editor (STEP 1)
            ├─ style-guide?project=... → Style guide + brief (STEP 2)
            │    &frames=f1[,f2]
            ├─ generate?project=...    → Generation page (STEP 3) [NEW v3.0]
            │    &frames=f1[,f2]
            └─ (legacy popup removed in v3.0)
  /billing            → Subscription plans, Razorpay (protected)

STATE (Redux — canvas page only)
─────────────────────────────────
  profile    → current user (avatar, name)
  projects   → list of user projects (dashboard)
  shapes     → all canvas shapes (ids, types, positions, sizes, colors, text)
  viewport   → zoom (scale), pan (translateX, translateY)

PERSISTENT STATE (Convex — all pages)
──────────────────────────────────────
  projects.sketchesData       → shapes + tool + frameCounter
  projects.viewportData       → translate, scale
  projects.styleGuide         → JSON: { colors, typography, brief, preset }
  projects.generatedDesignData → { inputHash, generatedAt, frames: { variations } }
A.3 FOUR-STEP GUIDED FLOW ARCHITECTURE (v3.0)
text

  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                        D2D — FOUR-STEP GUIDED FLOW                                │
  └─────────────────────────────────────────────────────────────────────────────────┘

  STEP 1: CANVAS                    STEP 2: STYLE GUIDE              STEP 3: GENERATE        STEP 4: EXPORT
  ─────────────────                 ─────────────────────             ───────────────         ─────────────
  /dashboard/.../canvas              /dashboard/.../style-guide        /dashboard/.../generate  (on same page)
  ?project=xxx                       ?project=xxx&frames=f1[,f2]       ?project=xxx&frames=...

  ┌─────────────────┐                ┌─────────────────────────┐      ┌──────────────────────────────┐
  │ Draw wireframe  │   Force save   │ Tab 1: Design Brief     │      │ Loading animation (1.5s)     │
  │ in frame(s)     │ ──────────────►│   pageType, industry,   │      │ → 3 variation cards           │
  │ Generate btn    │   (Convex)     │   tone, brandName,      │      │ → Expand: code + preview      │
  │                 │                │   tagline               │      │ → Responsive toggle           │
  │ If 2+ frames:  │                │ Tab 2: Design Style     │      │ → Export (Copy, TSX, HTML,    │
  │ Frame Selector  │                │   6 presets + live      │      │   Tokens)                     │
  │ modal           │                │   preview cards         │      │ → Try Another Style (6)       │
  └─────────────────┘                │ Tab 3–4: Colors, Fonts  │      │ → Quality score, Explain      │
                                     │ Live preview sidebar    │      └──────────────────────────────┘
                                     │ "Generate Design" →     │
                                     └─────────────────────────┘
                                               │
                                               ▼
                                     Convex: styleGuide (JSON)
                                     includes brief + preset

  DATA SOURCE: All steps read/write Convex (projects.sketchesData, styleGuide,
  generatedDesignData). Redux used on canvas only; force save before leaving.
A.4 DETERMINISTIC GENERATION PIPELINE (ALL LAYERS)
text

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ CONTEXT LAYER (v3.0)                                                         │
  │ Design Brief (pageType, industry, tone, brandName, tagline)                 │
  │ Smart Suggestions: industry × tone → preset, color, fonts (30 mappings)     │
  │ Industry Content Banks: 10 industries × hero/CTA/nav/footer/icons           │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │
  ┌──────────────────────────────────────▼──────────────────────────────────────┐
  │ VARIATION GENERATOR (v3.0)                                                   │
  │ selectThreePresets(selected, suggested) → [P1, P2, P3] (contrast mapping)   │
  │ generateVariations() → run pipeline 3× with P1, P2, P3                     │
  │ Output: Variation[] { presetName, presetLabel, code }                       │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         │ (runs 3×)
  ┌──────────────────────────────────────▼──────────────────────────────────────┐
  │ INPUT: Redux shapes (inside selected frame) + Style guide JSON + Brief       │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 1: Color Utilities                                                     │
  │   Hex → HSL/RGB, palette generation (base, hover, tint, glow, ring)         │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 2: Design Identity                                                     │
  │   6 presets; colors, typography, spacing, elevation, component/section defs  │
  │   + brief.brandName → identity.content.brandName (v3.0)                     │
  │   + brief.tone → preset auto-detection fallback (v3.0)                      │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 3: Extractor                                                           │
  │   Universal bbox for 26 shape types, overlap-ratio containment (≥50%),      │
  │   coordinate normalization, sorted top→bottom, left→right                   │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 4: Classifier                                                          │
  │   17 semantic UI roles; direct mapping (10 types) + heuristics + text       │
  │   intelligence; annotations excluded                                        │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 5: Architect                                                           │
  │   70% overlap containment, smallest parent, row/column detection,           │
  │   per-gap spacing array, snapped to Tailwind scale                          │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 5.5: Enhancer                                                          │
  │   8 rules: centered-form, auto-card, responsive-grid, sticky-nav,          │
  │   section spacing, hero, input-group, footer                                │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 6: Section Engine                                                      │
  │   10 detection rules: nav, hero, feature grid, form, content split,         │
  │   card grid, CTA, footer, sidebar, generic                                 │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 7: Content Inferrer                                                    │
  │   + brief.industry → industry content bank selection (v3.0)                 │
  │   + brief.brandName/tagline → nav, footer, CTA, hero (v3.0, escaped)       │
  │   40-icon inline SVG registry; deterministic position-based hashing         │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 8: Stylist                                                             │
  │   Design tokens from style guide, semantic color mapping, seeded variation, │
  │   per-role Tailwind class generation, enhancement hints → classes            │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ LAYER 9: Component Library + Builder                                         │
  │   v0-level HTML templates; page wrapper + section composition               │
  │   + alternating backgrounds (v3.0); entrance animation stagger (v3.0)       │
  │   + brand name permeation in nav, footer, CTA (v3.0)                        │
  │   Responsive classes, font imports; output: 100–500 lines React + Tailwind  │
  └──────────────────────────────────────┬──────────────────────────────────────┘
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ OUTPUT: React component (JSX) + Tailwind CSS                                 │
  │ → Generation page: 3 variations, preview iframes, code editor               │
  │ → Export: Copy, Download TSX, Download HTML, Design Tokens JSON              │
  └─────────────────────────────────────────────────────────────────────────────┘

  ALL LAYERS RUN IN BROWSER. <100ms SINGLE. <300ms THREE. ₹0. OFFLINE.
A.5 DATABASE ENTITY RELATIONSHIP (CONVEX)
text

  ┌─────────────┐       ┌──────────────────────────────────────────┐
  │   users     │       │    projects                               │
  │ (Convex     │──1:N──│ owner, name, thumbnailGradient            │
  │  Auth)      │       │ sketchesData    (shapes, tool, frames)    │
  └──────┬──────┘       │ viewportData    (translate, scale)        │
         │              │ styleGuide      (JSON: colors, typography,│
         │              │                  brief, preset)  ← v3.0  │
         │              │ generatedDesignData (cache + inputHash)   │
         │              │ moodBoardImages (file refs)               │
         │              │ lastModified    (unix timestamp)          │
         │              └───────────┬──────────────────────────────┘
         │                          │
         │              ┌───────────┴──────────────────────────┐
         │              │  project_counters                     │
         │              │  userId, counter (auto-increment)     │
         │              └──────────────────────────────────────┘
         │
  ┌──────┴──────────────────────────────────────────────────────────┐
  │  subscriptions          credits_ledger          razorpay_orders  │
  │  userId, plan,          userId, amount,         userId, orderId,  │
  │  status, startDate,     reason, timestamp,     amount, plan,     │
  │  endDate, razorpaySubId balanceAfter           status            │
  └─────────────────────────────────────────────────────────────────┘

  AUTHENTICATION TABLES (auto-generated by Convex Auth):
  users, sessions, accounts, verificationTokens
A.6 GENERATION PAGE LAYOUT
text

  ┌────────────────────────────────────────────────────────────────────────────────────┐
  │  ← Back to Canvas    D2D Generation              [Style Guide]                       │
  ├────────────────────────────────────────────────────────────────────────────────────┤
  │                                                                                     │
  │  THREE VARIATION CARDS (side by side)                                               │
  │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                             │
  │  │  Scaled      │   │  Scaled      │   │  Scaled      │                             │
  │  │  Preview     │   │  Preview     │   │  Preview     │                             │
  │  │  (iframe)    │   │  (iframe)    │   │  (iframe)    │                             │
  │  └──────────────┘   └──────────────┘   └──────────────┘                             │
  │  Startup Modern     Minimal Elegant    Glass Gradient                               │
  │                                                                                     │
  │  [Click any card to expand]                                                         │
  │                                                                                     │
  │  ┌────────────────────────────┬─────────────────────────────────────────┐           │
  │  │  Code Editor (left)        │  Live Preview (right)                    │           │
  │  │  syntax-highlighted        │  🖥 Desktop  💻 Tablet  📱 Mobile         │           │
  │  │                            │  iframe with generated component         │           │
  │  └────────────────────────────┴─────────────────────────────────────────┘           │
  │                                                                                     │
  │  [Copy] [Download TSX] [Download HTML] [Tokens]    [Try Another Style ▼]            │
  │  Quality: 87/100  ▼    Explain My Design ▼                                          │
  │  [← Back to Style Guide]  [← Back to Canvas]                                        │
  └────────────────────────────────────────────────────────────────────────────────────┘
A.7 FILES & MODULES OVERVIEW (COMPLETE CODEBASE)
text

ROOT CONFIGURATION FILES:
  package.json, tsconfig.json, tailwind.config.ts, postcss.config.js,
  next.config.js, .env.local

CONVEX BACKEND (convex/):
  _generated/           Auto-generated types (never edit)
  schema.ts             Database table definitions
  auth.ts               Auth initialization
  auth.config.ts        Auth provider configuration
  http.ts               OAuth callback handling
  projects.ts           Project CRUD operations
  subscription.ts       Billing and credit operations
  moodboard.ts          Image storage operations
  user.ts               User query operations

FRONTEND SOURCE (src/):
  app/                  All page routes (Next.js App Router)
    page.tsx            Landing page
    layout.tsx          Root layout with providers
    globals.css         Global styles and Tailwind imports
    auth/               Sign-in and sign-up pages
    (protected)/        Auth-required routes
      billing/          Subscription management
      dashboard/        Project dashboard and workspace
        [session]/      Dynamic username route
          (workspace)/  Canvas, style guide, generation
    api/                Server-side API endpoints

  components/           Reusable UI components
    ui/                 ShadCN component library
    auth/               Authentication forms
    canvas/             Canvas editor and tools
    generation/         Generation components
      generation-button.tsx     Trigger on frames (force save + navigate)
      variation-view.tsx        3 variation cards + expand     [v3.0]
      responsive-toggle.tsx     Desktop/tablet/mobile toggle  [v3.0]
      quality-score.tsx         5-dimension scoring            [v3.0]
      export-options.tsx        4 export formats               [v3.0]
      frame-selector.tsx        Multi-frame selection modal    [v3.0]
    style-guide/        Style configuration components
      design-brief.tsx          5-field brief form             [v3.0]
      preset-selector.tsx       6 preset cards + previews      [v3.0]
      live-preview.tsx          Real-time preview sidebar      [v3.0]
      (colors, typography tabs — existing)
    landing/            Landing page sections
    Navbar/             Navigation bar
    projects/           Project cards and management
    theme/              Theme toggle

  hooks/                Custom React hooks
    use-auth.ts, use-auto-save.ts, use-canvas.ts,
    use-style-guide.ts (+brief, +preset), use-project.ts

  lib/                  Utility functions and pipeline
    ai-pipeline/        Generation engine
      types.ts                  Shared interfaces and type defs
      extractor.ts              Phase 1: shape extraction
      classifier.ts             Phase 2: role classification
      architect.ts              Phase 3: tree construction
      enhancer.ts               Phase 3.5: pattern enhancement
      color-utils.ts            Color palette generation
      design-identity.ts        6 design presets (+brief)
      section-engine.ts         Section detection
      content-inferrer.ts       Content + icons (+brief, +industry) [modified v3.0]
      stylist.ts                Phase 4: style application
      builder.ts                Phase 5: code generation (+sections, +brand) [modified v3.0]
      index.ts                  Pipeline orchestrator (+brief pass-through) [modified v3.0]
      industry-content.ts       10 industry content banks      [v3.0]
      variation-generator.ts    3-variation generator           [v3.0]
    frame-snapshot.ts   PNG export from frames
    permission.ts       Route permission definitions
    thumbnail.ts        Gradient thumbnail generation
    utils.ts            Helper functions

  redux/                State management
    store.ts, provider.tsx, index.ts
    slice/              profile, projects, shapes, viewport

  types/                TypeScript type definitions
    style-guide.ts      (+DesignBrief, +preset)                [modified v3.0]
    razorpay.ts

  middleware.ts         Route protection logic
APPENDIX B: DATA FLOW DIAGRAMS
B.1 END-TO-END USER DATA FLOW (AUTH → GENERATE)
text

  USER                FRONTEND              CONVEX / APIs              OUTPUT
   │                      │                        │                      │
   │  Sign In (Google/    │                        │                      │
   │  Email)              │── Convex Auth ────────►│ users, sessions      │
   │                      │◄── session cookie ────│                      │
   │                      │                        │                      │
   │  Open Dashboard      │── useQuery(projects) ─►│ projects by owner   │
   │                      │◄── project list ───────│                      │
   │                      │                        │                      │
   │  Open Canvas         │── getProject(id) ─────►│ project doc         │
   │                      │◄── shapes, viewport ──│                      │
   │                      │── dispatch(load) ─────►│ Redux store         │
   │                      │                        │                      │
   │  Draw / Edit         │── dispatch(shape       │                      │
   │                      │    actions) ──────────►│ Redux (shapes,      │
   │                      │                        │  viewport)           │
   │                      │                        │                      │
   │  [every 30s]         │── PATCH /api/project   │                      │
   │  Auto-save           │   or Convex mutation ─►│ projects update     │
   │                      │                        │                      │
   │  Click Generate      │── Force save ─────────►│ updateProject       │
   │  (on frame)          │   (direct Convex)      │ (awaited)           │
   │                      │── router.push ────────►│                      │
   │                      │   → style-guide page   │                      │
   │                      │                        │                      │
   │  Style Guide         │── fill brief, select   │                      │
   │  (4 tabs)            │   preset, colors, fonts│                      │
   │                      │── debounced save ─────►│ styleGuide (JSON)   │
   │                      │                        │                      │
   │  Live Preview        │── buildDesignIdentity  │                      │
   │  (sidebar)           │   → iframe srcdoc      │  [all in browser]   │
   │                      │                        │                      │
   │  Click "Generate     │── router.push ────────►│                      │
   │  Design"             │   → generate page      │                      │
   │                      │                        │                      │
   │  Generation Page     │── read project ───────►│ shapes, styleGuide  │
   │  (loads)             │◄── project data ───────│                      │
   │                      │── check cache hash     │ generatedDesignData │
   │                      │   match? → show cached │                      │
   │                      │   no match? → pipeline │                      │
   │                      │   3 variations (<300ms)│                      │
   │                      │── save cache ─────────►│ generatedDesignData │
   │                      │                        │                      │
   │  See 3 variations    │                        │                ─────►│ React code
   │  Copy / Download     │   (clipboard / blob)   │                      │ × 3 presets
   │  Try Another Style   │── pipeline 1× (<100ms) │                      │ + Preview
B.2 AUTO-SAVE AND FORCE-SAVE DATA FLOW
text

  AUTO-SAVE (existing, every 30s):
  ────────────────────────────────
  Redux shapes/viewport
           │
           │  dirty check every 30s (or manual save)
           ▼
  ┌────────────────────┐
  │ Serialize state    │  shapes, viewportData
  └─────────┬──────────┘
            │
            ▼
  ┌────────────────────┐     ┌────────────────────┐
  │ PATCH /api/project │ OR  │ Convex mutation     │
  │ (optional path)    │     │ updateProject(...)  │
  └─────────┬──────────┘     └─────────┬──────────┘
            │                          │
            └────────────┬─────────────┘
                         ▼
            ┌────────────────────────────┐
            │ Convex: projects table     │
            │  sketchesData, viewportData│
            └────────────────────────────┘
            Hops: 3–4. Latency: 200–500ms.

  FORCE SAVE (v3.0, on Generate click):
  ──────────────────────────────────────
  Redux shapes/viewport
           │
           │  useMutation(api.projects.updateProject)
           ▼
  ┌────────────────────────────┐
  │ Convex: projects table     │
  │  sketchesData, viewportData│
  └────────────────────────────┘
  Hops: 1. Latency: 50–100ms. Await → then router.push().
B.3 PAYMENT AND CREDITS DATA FLOW
text

  User                D2D Frontend         Razorpay           D2D Backend           Convex
   │                        │                   │                    │                 │
   │  Subscribe (Pro)       │                   │                    │                 │
   │───────────────────────►│  Create order     │                    │                 │
   │                        │──────────────────►│                    │                 │
   │                        │  Checkout UI      │                    │                 │
   │                        │◄──────────────────│                    │                 │
   │  Pay (card/UPI)        │                   │                    │                 │
   │───────────────────────────────────────────►│                    │                 │
   │                        │                   │  Webhook (payment  │                 │
   │                        │                   │  captured)          │                 │
   │                        │                   │───────────────────►│                 │
   │                        │                   │                    │  Inngest:       │
   │                        │                   │                    │  razorpay-       │
   │                        │                   │                    │  webhook-handler│
   │                        │                   │                    │───────────────►│
   │                        │                   │                    │                 │ subscriptions
   │                        │                   │                    │                 │ credits_ledger
   │                        │  Navbar/credits   │                    │                 │
   │                        │◄─────────────────────────────────────────────────────────│
   │  See new balance       │                   │                    │                 │
B.4 GENERATION PIPELINE DATA FLOW (DETAIL)
text

  Redux (shapes in frame)     Style Guide (JSON + Brief)
           │                            │
           └────────────┬───────────────┘
                        ▼
              ┌──────────────────┐
              │ Extract + filter │  by frame bounds (≥50% overlap)
              │ Universal bbox   │  for 26 shape types
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Classify         │  → 17 UI roles; annotations excluded
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Build tree       │  parent/child (70% overlap), rows/columns
              │                  │  per-gap spacing, Tailwind-snapped
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Enhancer         │  8 rules: centered-form, auto-card,
              │                  │  responsive-grid, sticky-nav, hero,
              │                  │  section spacing, input-group, footer
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Section detection│  nav, hero, feature grid, form, footer, …
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Content inferrer │  + brief.industry → content bank
              │                  │  + brandName/tagline (escaped)
              │                  │  + icons from industry registry
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Stylist          │  design tokens + semantic colors
              │                  │  seeded variation (radius, shadow, spacing)
              │                  │  per-role Tailwind classes
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Builder          │  section composition (alt backgrounds)
              │                  │  entrance animation stagger
              │                  │  brand permeation (nav, footer, CTA)
              │                  │  role→tag, gap strategy, text escape
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │ Output           │  React JSX string (100–500 lines)
              └────────┬─────────┘
                       │
         ┌─────────────┼─────────────────────┐
         ▼             ▼                     ▼
   Preview iframe   Copy / Download        Quality score
   (Tailwind CDN)   (TSX, HTML, Tokens)    + Explain panel
B.5 MULTI-VARIATION GENERATION DATA FLOW
text

  frame, allShapes, styleGuide
           │
           ▼
  ┌────────────────────────────┐
  │ selectThreePresets(        │
  │   styleGuide.preset,      │
  │   getSuggestions(industry, │
  │     tone).preset           │
  │ )                          │
  │ → [P1, P2, P3] (contrast) │
  └────────────┬───────────────┘
               │
     ┌─────────┼─────────┐
     ▼         ▼         ▼
  pipeline   pipeline   pipeline
  (preset1)  (preset2)  (preset3)
     │         │         │
     ▼         ▼         ▼
  code1      code2      code3
     │         │         │
     └─────────┼─────────┘
               ▼
  Variation[] { presetName, presetLabel, code }
  (< 300ms total, all in browser, ₹0)

  CONTRAST MAPPING:
  startup-modern    ↔ minimal-elegant, glass-gradient
  corporate-clean   ↔ bold-creative, glass-gradient
  bold-creative     ↔ minimal-elegant, corporate-clean
  minimal-elegant   ↔ bold-creative, startup-modern
  dashboard-dense   ↔ bold-creative, glass-gradient
  glass-gradient    ↔ corporate-clean, minimal-elegant
B.6 DESIGN BRIEF → PIPELINE CONSUMPTION
text

  Design Brief (UI)                Style Guide (JSON in Convex)        Pipeline Consumption
  ─────────────────               ───────────────────────────        ────────────────────
  pageType    (cards)    ────────► styleGuide.brief.pageType    ──────► Section hints (future)
  industry    (chips)    ────────► styleGuide.brief.industry   ──────► Content inferrer: select
  tone        (cards)    ────────► styleGuide.brief.tone       ──────►   industry content bank
  brandName   (input)    ────────► styleGuide.brief.brandName   ──────► Smart Suggestions: preset/color/font
  tagline     (input)    ────────► styleGuide.brief.tagline     ──────► Identity: content.brandName, tagline
                                                                       Content inferrer: nav, footer, CTA, hero
                                                                       escapeHtml(brandName), escapeHtml(tagline)
  preset      (cards)    ────────► styleGuide.preset            ──────► Design identity, Stylist, Variation pick
B.7 GENERATION CACHE FLOW
text

  Generation page load
           │
           ▼
  Read project from Convex (shapes, styleGuide, generatedDesignData)
           │
           ▼
  inputHash = hash(shapes, styleGuide)
           │
           ├── cache exists AND cache.inputHash === inputHash
           │         │
           │         ▼
           │   Show cached variations immediately
           │   "[Showing cached · Regenerate]"
           │
           └── no cache OR hash mismatch
                     │
                     ▼
               Run generateVariations() (< 300ms)
                     │
                     ▼
               Save to projects.generatedDesignData
               Show loading animation (1.5s) → reveal 3 cards
B.8 INDUSTRY CONTENT & SUGGESTIONS FLOW
text

  brief.industry + brief.tone
           │
           ├──────────────────────────────────► getSuggestions(industry, tone)
           │                                    → { preset, primaryColor, headingFont, bodyFont }
           │                                    → UI: "Apply All Suggestions"
           │                                    → 30-mapping lookup table (150 lines)
           │
           └──────────────────────────────────► getIndustryContent(industry)
                                                 → { heroHeadings, ctaPrimary, navLinks, ... }
                                                 → Content inferrer: selectContent(bank.X, positionHash)
                                                 → Icons: getIndustryIcons(industry)

  brief.brandName + brief.tagline (escaped)
           │
           └──────────────────────────────────► Nav: "◆ {brand}"
                                                 Hero subtitle: "{tagline}"
                                                 CTA: "Ready to try {brand}?"
                                                 Footer: "© 2025 {brand}"
                                                 Code comment: // Generated for {brand}
APPENDIX C: FINAL METRICS SUMMARY
text

┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   D2D — COMPLETE KEY METRICS                                │
│                                                             │
│   PRODUCT                                                   │
│   ├── Status:              v1.0 + v2.0 LIVE IN PRODUCTION   │
│   │                        v3.0 PLANNED (build-ready)       │
│   ├── Features shipped:    12+ major feature groups         │
│   ├── Drawing tools:       10                               │
│   ├── Design presets:      6                                │
│   ├── Pipeline layers:     9 (incl. enhancer + section)     │
│   ├── Enhancement rules:   8                                │
│   ├── Industry content:    10 banks                         │
│   ├── Smart suggestions:   30 industry×tone mappings        │
│   ├── Shape types:         26                               │
│   ├── UI roles:            17                               │
│   └── Codebase:            ~35,000+ lines TypeScript        │
│                                                             │
│   PERFORMANCE                                               │
│   ├── Single generation:   < 100 milliseconds               │
│   ├── Three variations:    < 300 milliseconds               │
│   ├── Generation cost:     ₹0 per use (any scale)           │
│   ├── AI API dependency:   None                             │
│   ├── Offline capable:     Yes                              │
│   ├── Deterministic:       100%                             │
│   └── Output size:         100–500 lines per generation     │
│                                                             │
│   QUALITY                                                   │
│   ├── v2.0 (shipped):      ~62 / 100                        │
│   ├── v3.0 (projected):    ~85 / 100                        │
│   ├── Content relevance:   40 → 85 (+112%)                  │
│   ├── Brand personality:   20 → 70 (+250%)                  │
│   └── User confidence:     50 → 100 (+100%)                 │
│                                                             │
│   BUSINESS                                                  │
│   ├── Revenue model:       Freemium + subscription          │
│   ├── Free tier:           5 generations / month            │
│   ├── Pro Monthly:         ₹499 / 100 generations           │
│   ├── Pro Yearly:          ₹4,999 / 1,200 generations       │
│   ├── Gross margin:        ~97% (zero generation cost)      │
│   ├── Break-even:          ~10 Pro subscribers              │
│   └── Infrastructure:      ~₹80-850/month at 500 users     │
│                                                             │
│   COMPETITIVE ADVANTAGES (8 UNIQUE)                         │
│   ├── 1. Only sketch-to-code tool in market                 │
│   ├── 2. Zero marginal cost per generation                  │
│   ├── 3. 100-300x faster than LLM competitors               │
│   ├── 4. 100% deterministic (reproducible output)           │
│   ├── 5. Structured brand context (brief + industry)        │
│   ├── 6. Three simultaneous variations (MidJourney-style)   │
│   ├── 7. Live preview before generation                     │
│   └── 8. Instant style switching (6 presets, <100ms)        │
│                                                             │
│   ROADMAP                                                   │
│   ├── v1.0 (SHIPPED): App shell, canvas, auth, payments     │
│   ├── v2.0 (SHIPPED): 7-phase pipeline, 60/100 quality      │
│   ├── v3.0 (PLANNED): Context layer, brief, industry,       │
│   │                    3 variations, gen page, 85/100        │
│   └── POST-v3.0: Multi-page gen, templates, collab,         │
│                   plugin system, image upload, Figma export  │
│                                                             │
│   TECHNICAL MOAT                                            │
│   ├── 26-shape universal bounding box                       │
│   ├── 17-role semantic classifier                           │
│   ├── Overlap-ratio tree builder (70% containment)          │
│   ├── 8 design pattern enhancement rules                    │
│   ├── 6 complete design identity presets                    │
│   ├── 10 industry content banks (500+ strings)              │
│   ├── 30-mapping smart suggestion engine                    │
│   ├── Contrast-mapped variation generator                   │
│   ├── Per-gap spacing with Tailwind snapping                │
│   └── Semantic token system with seeded variation           │
│   No LLM wrapper can replicate this architecture.           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
End of D2D Combined Product & Technical Document.

D2D: Drawing to Design.
From rough sketch to three professional branded websites in under one second.
Zero AI cost. Fully deterministic. Industry-aware. Brand-permeated.
Live in production. Build-ready for v3.0.






