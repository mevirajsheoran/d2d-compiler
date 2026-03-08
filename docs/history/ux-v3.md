D2D v3.0 — UX & Capability Expansion: Product & Technical Document
CLASSIFICATION
text

Document Type:     Product & Technical Specification
Version:           v3.0 — UX & Capability Expansion
Audience:          Investors, Technical Evaluators, Engineering Leads
Status:            PLANNED — ARCHITECTURE VALIDATED, BUILD-READY
Predecessor:       MVP Product Document (v1.0) — SHIPPED
                   Pipeline v2.0 Document — SHIPPED
Last Updated:      2025
TABLE OF CONTENTS
text

PART 1: EXECUTIVE OVERVIEW
  1.1  What v3.0 Is
  1.2  The Strategic Thesis
  1.3  Key Results (Projected)

PART 2: THE PROBLEM v3.0 SOLVES
  2.1  Where v2.0 Plateaus
  2.2  The Missing Context Layer
  2.3  What No Competitor Does

PART 3: THE DESIGN AGENCY INSIGHT
  3.1  How Professional Design Agencies Work
  3.2  How D2D Replicates This in 60 Seconds
  3.3  The Four-Step Guided Flow

PART 4: THE DESIGN BRIEF
  4.1  Concept and Purpose
  4.2  Five Fields, Complete Specification
  4.3  Visual Brief — Not a Form, an Experience
  4.4  How Brief Feeds Into the Pipeline

PART 5: INDUSTRY-SPECIFIC CONTENT ENGINE
  5.1  The Content Gap
  5.2  Ten Industry Content Banks (Complete Data)
  5.3  Content Selection Logic
  5.4  Brand Identity Permeation

PART 6: SMART SUGGESTIONS SYSTEM
  6.1  The Mapping Intelligence
  6.2  Complete Suggestion Table (30 Mappings)
  6.3  Suggestion UI and One-Click Application

PART 7: DESIGN PRESET SELECTOR
  7.1  Moodboard Transformation
  7.2  Six Preset Cards with Live Previews
  7.3  Recommended Badge Logic

PART 8: LIVE PREVIEW — THE KILLER FEATURE
  8.1  Why This Changes Everything
  8.2  Fixed Template Approach
  8.3  Real-Time Update Mechanism

PART 9: MULTI-VARIATION GENERATION
  9.1  The MidJourney Insight
  9.2  Intelligent Preset Selection (Contrast Mapping)
  9.3  Three Variations in 300 Milliseconds
  9.4  "Try Another Style" — Instant Switching

PART 10: THE GENERATION PAGE
  10.1 From Popup to Destination
  10.2 Page Layout and Interaction Design
  10.3 Responsive Preview Toggle
  10.4 Export Options (Four Formats)
  10.5 Quality Score Visualization
  10.6 The Loading Animation — Engineering Anticipation
  10.7 "Explain My Design" Panel

PART 11: COMPLETE USER JOURNEY (FOUR-STEP FLOW)
  11.1 Step 1: Canvas (Minor Changes)
  11.2 Step 2a: Frame Selector (Conditional Modal)
  11.3 Step 2b: Style Guide Page (Overhauled)
  11.4 Step 3: Generation Page (New)
  11.5 Step 4: Export
  11.6 Navigation and Back-Flow

PART 12: STATE PERSISTENCE AND DATA ARCHITECTURE
  12.1 The Multi-Page Challenge
  12.2 Data Inventory — Where Each Piece Lives
  12.3 Force Save Strategy (Direct Convex Mutation)
  12.4 Generation Result Caching
  12.5 Zero Schema Changes

PART 13: PIPELINE MODIFICATIONS
  13.1 What Changes in the Pipeline
  13.2 Content Inferrer Upgrade
  13.3 Design Identity Upgrade
  13.4 Builder Upgrade (Section Composition)
  13.5 Variation Generator (New Module)
  13.6 Orchestrator Changes

PART 14: SECURITY AND PERFORMANCE
  14.1 XSS Prevention (User-Supplied Text)
  14.2 Preview Iframe Sandboxing
  14.3 Three-Iframe Performance Analysis
  14.4 CDN Caching Strategy

PART 15: EDGE CASES AND ERROR HANDLING
  15.1 Twelve Edge Case Matrix
  15.2 Graceful Degradation Philosophy
  15.3 Error Messages and Recovery Paths

PART 16: FILES ARCHITECTURE AND BUILD PLAN
  16.1 Files to Delete (Clean Slate)
  16.2 New Files Manifest (15 Files)
  16.3 Modified Files Manifest (8 Files)
  16.4 Dependency-Safe Build Order (6 Batches)
  16.5 Build Timeline

PART 17: PRODUCTION ARCHITECTURE AT SCALE
  17.1 Load Analysis for 500 Concurrent Users
  17.2 Client-Side vs Server-Side Load Distribution
  17.3 Infrastructure Cost Model
  17.4 Auto-Save Path Optimization (Future)
  17.5 Architecture Validation Table

PART 18: QUALITY PROJECTION
  18.1 Scoring Before and After v3.0
  18.2 Eight Quality Dimensions
  18.3 Remaining Gap Analysis

PART 19: COMPETITIVE POSITION AFTER v3.0
  19.1 Full Competitive Comparison Table
  19.2 Eight Unique Advantages
  19.3 The Technical Moat Deepens

PART 20: BUSINESS IMPACT AND OUTLOOK
  20.1 The "WOW" Moment — Engineered Virality
  20.2 Revenue Model Enhancement
  20.3 What Comes After v3.0
  20.4 Key Metrics Summary

APPENDIX A: ARCHITECTURE DIAGRAMS                 (See end of document)
APPENDIX B: DATA FLOW DIAGRAMS                    (See end of document)

PART 1: EXECUTIVE OVERVIEW
1.1 WHAT V3.0 IS
The v3.0 release transforms D2D from a code generation tool
into a guided design intelligence platform.

The MVP (v1.0) shipped the application shell — canvas,
projects, authentication, payments, and style guide.
Pipeline v2.0 shipped the generation engine — seven
deterministic phases that convert hand-drawn wireframes
into production-ready React components with Tailwind CSS.

v3.0 adds the CONTEXT layer.

The pipeline already knows WHERE shapes are positioned.
It already knows WHAT each shape represents semantically.
What it does not know is WHY the user is drawing.
A restaurant's booking page and a fintech startup's
landing page produce nearly identical output because
the pipeline has no awareness of industry, brand,
or design intent.

v3.0 solves this through four interconnected capabilities.

First, a Design Brief — a structured visual form that
captures page type, industry, tone, brand name, and tagline.
This is not a text prompt. It is a deterministic set of
dropdown and card selections that unambiguously communicate
design intent without AI interpretation.

Second, an Industry-Specific Content Engine — ten complete
content banks with hero headings, feature descriptions,
call-to-action text, navigation links, footer content,
and icon suggestions, each tailored to a specific industry.
The same wireframe with "restaurant" selected produces
"Reserve a Table" instead of "Get Started."

Third, Multi-Variation Generation — three complete
professional designs from a single wireframe, generated
in under 300 milliseconds at zero cost. Each variation
uses a different design preset, intelligently selected
for maximum visual contrast. The user sees three complete
website designs side by side, like a design agency
presenting creative directions.

Fourth, a Full Generation Page — replacing the current
popup overlay with a dedicated page that accommodates
three-variation comparison, responsive preview toggling,
multiple export formats, quality scoring, and instant
style switching across all six design presets.

Every feature in v3.0 is deterministic. Every feature
runs in the user's browser. Every feature costs exactly
zero rupees per invocation. The fundamental cost structure
advantage established in v2.0 is preserved entirely.

The v3.0 changes comprise approximately 3,420 lines of
new and modified TypeScript across 23 files. Zero new
dependencies are added. Zero schema changes are required.
Zero breaking changes to existing features are introduced.
The estimated build timeline is 15 to 17 working days.

1.2 THE STRATEGIC THESIS
text

v1.0 PROVED:  "We can build and ship a working product."
v2.0 PROVED:  "We can generate professional code from drawings."
v3.0 PROVES:  "We can generate BRANDED, CONTEXTUAL, INDUSTRY-SPECIFIC
               code with multiple design variations — and the user
               controls it all through a guided agency workflow."
The strategic thesis of v3.0 is that the highest-leverage
improvement to generation quality is not more sophisticated
CSS output or deeper layout detection. It is CONTEXT.

The same wireframe rendered with the right industry content,
the right brand name woven throughout, the right tone
expressed in typography and spacing, and the right design
preset selected by the user — that wireframe becomes
a website that looks like it was designed by a professional
agency for that specific business.

This context costs nothing to add to a deterministic pipeline.
It is pure data — lookup tables, string mappings, and
structured configuration. But the impact on perceived
quality is the single largest improvement in D2D's history.

Quality score projection moves from approximately 62 out
of 100 to approximately 85 out of 100. The improvement
comes almost entirely from two dimensions that were
previously at their lowest: content relevance (40 to 85)
and brand personality (20 to 70). Structural quality,
which was already strong from v2.0, remains unchanged.

The competitive position after v3.0 is unprecedented.
No existing tool combines spatial intent from hand-drawn
wireframes with structured brand context, industry-specific
content, live preview before generation, three-variation
simultaneous output, and instant style switching — all
at zero marginal cost with sub-second generation speed.

1.3 KEY RESULTS (PROJECTED)
text

┌─────────────────────────────────────────────────────────────┐
│  D2D v3.0 — PROJECTED KEY RESULTS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  QUALITY                                                    │
│  ├── Quality score:          62/100 → 85/100 (+37%)        │
│  ├── Content relevance:      40/100 → 85/100 (+112%)       │
│  ├── Brand personality:      20/100 → 70/100 (+250%)       │
│  ├── Visual coherence:       60/100 → 75/100 (+25%)        │
│  ├── User confidence:        50/100 → 100/100 (+100%)      │
│  ├── Structural quality:     Unchanged (already high)       │
│  └── Responsive output:      Unchanged (already high)       │
│                                                             │
│  CAPABILITIES (NEW)                                         │
│  ├── Industry content banks: 10 industries                  │
│  ├── Design Brief fields:    5 structured inputs            │
│  ├── Smart suggestions:      30 industry×tone mappings      │
│  ├── Variations per generation: 3 simultaneous              │
│  ├── Total accessible presets: 6 (instant switching)        │
│  ├── Export formats:         4 (TSX, HTML, Copy, Tokens)    │
│  ├── Responsive preview:     3 sizes (desktop/tablet/mobile)│
│  └── Live preview:           Real-time (100ms debounce)     │
│                                                             │
│  PERFORMANCE (UNCHANGED)                                    │
│  ├── Single generation:      < 100 milliseconds             │
│  ├── Three variations:       < 300 milliseconds             │
│  ├── Cost per generation:    ₹0 (zero)                      │
│  ├── Processing location:    Client browser (no server)     │
│  ├── API calls required:     Zero                           │
│  ├── Deterministic output:   Yes (100% reproducible)        │
│  └── Offline capable:        Yes                            │
│                                                             │
│  ENGINEERING                                                │
│  ├── New + modified code:    ~3,420 lines TypeScript        │
│  ├── New files:              15                             │
│  ├── Modified files:         8                              │
│  ├── New dependencies:       Zero                           │
│  ├── Schema changes:         Zero                           │
│  ├── Breaking changes:       Zero                           │
│  ├── Build timeline:         15-17 working days             │
│  └── Post-launch polish:     ~990 additional lines          │
│                                                             │
│  BUSINESS                                                   │
│  ├── Generation cost:        Still ₹0 at any scale          │
│  ├── Gross margin:           Still >96%                     │
│  ├── Infrastructure (500):   ~$46-101/month                 │
│  ├── Break-even:             Still ~10 Pro subscribers      │
│  └── Competitive advantages: 8 unique (no competitor has)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
PART 2: THE PROBLEM v3.0 SOLVES
2.1 WHERE V2.0 PLATEAUS
The v2.0 pipeline produces structurally correct, responsive,
section-aware React components with professional Tailwind CSS
styling. The architecture is sound. The performance is instant.
The cost is zero.

But every wireframe produces generic-looking output regardless
of what the user is building.

text

THE SAME WIREFRAME (nav + hero + 3 cards + footer):

  As a RESTAURANT website:
    v2.0 produces: "Build something amazing" hero heading
                   "Feature 1", "Feature 2", "Feature 3" cards
                   "Get Started" button
                   Generic tech icons (zap, shield, rocket)

  As a MEDICAL platform:
    v2.0 produces: IDENTICAL output.
                   Same "Build something amazing"
                   Same generic icons
                   Same "Get Started" button

  As a FINANCE dashboard:
    v2.0 produces: IDENTICAL output again.
The structural quality is high. The layout is correct.
The responsiveness works. The design system is applied.
But the CONTENT and PERSONALITY are indistinguishable
across completely different business domains.

This is because the pipeline has no awareness of context.
It knows WHERE shapes are. It knows WHAT they represent
structurally. It does not know WHY they are being drawn.

2.2 THE MISSING CONTEXT LAYER
text

WHAT THE PIPELINE KNOWS (from v2.0):

  SPATIAL DATA (from Redux shapes state):
    ✅ Exact position of every element (x, y coordinates)
    ✅ Exact dimensions (width, height)
    ✅ Shape type (rectangle, text, button, input, frame)
    ✅ Containment relationships (what is inside what)
    ✅ Proximity relationships (what is near what)
    ✅ Layout direction (row vs column)
    ✅ Per-gap spacing (exact pixel distances)

  DESIGN PREFERENCES (from style guide):
    ✅ Color palette (primary, secondary, accent, neutral)
    ✅ Typography (heading font, body font)
    ✅ Design preset (startup-modern, minimal-elegant, etc.)

WHAT THE PIPELINE DOES NOT KNOW:

  SEMANTIC CONTEXT (missing):
    ❌ What type of page is this? (landing, dashboard, login)
    ❌ What industry is this for? (tech, medical, restaurant)
    ❌ What is the brand name? (should appear in nav, footer)
    ❌ What is the tagline? (should appear in hero subtitle)
    ❌ What tone should the content have? (professional, playful)
    ❌ What specific icons fit this industry?
    ❌ What call-to-action language is appropriate?
    ❌ What navigation links make sense?
    ❌ What footer content is expected?
v0 by Vercel gets this context from the user's text prompt.
When a user types "build a restaurant landing page for
La Maison, an elegant French bistro," the LLM extracts
industry, brand, tone, and page type from the natural
language.

D2D cannot use an LLM. The pipeline is deterministic.
But D2D can collect the same information through a
structured form — a Design Brief — that captures
industry, brand, tone, and page type through explicit,
unambiguous user selections.

This is actually BETTER than a text prompt because
structured selections are deterministic. The same
selections always produce the same output. There is
no interpretation variance. No misunderstanding of
ambiguous phrasing. No creative drift between invocations.

2.3 WHAT NO COMPETITOR DOES
A comprehensive analysis of every competitor reveals a
universal gap in the market. No existing tool offers the
combination of capabilities D2D v3.0 delivers.

text

v0 BY VERCEL:
  ❌ Does not let you configure design system BEFORE generation
  ❌ Does not show how choices affect output BEFORE generating
  ❌ Does not collect structured context (industry, tone, page type)
  ❌ Does not give you a guided step-by-step flow
  ❌ Does not show LIVE PREVIEW as you adjust settings
  ❌ Does not generate multiple variations simultaneously
  ❌ Does not let you switch styles instantly after generation

FIGMA AI:
  ❌ Cannot generate from rough wireframes
  ❌ Does not produce code output
  ❌ None of the above capabilities

BUILDER.IO:
  ❌ Requires a completed Figma design as input
  ❌ Pure export tool, no design intelligence
  ❌ None of the above capabilities

LOCOFY:
  ❌ Requires Figma/XD file as starting point
  ❌ Conversion tool, not generation tool
  ❌ None of the above capabilities

FRAMER:
  ❌ No sketch-to-design capability
  ❌ No code generation or export
  ❌ None of the above capabilities

D2D v3.0 DOES ALL OF THESE:
  ✅ Structured context collection (industry, tone, brand, page type)
  ✅ Design system configuration BEFORE generation
  ✅ Live preview showing how choices affect output
  ✅ Industry-specific content banks (10 industries)
  ✅ Guided four-step agency workflow
  ✅ Three simultaneous variations (MidJourney-style)
  ✅ Instant style switching across six presets
  ✅ Zero cost, sub-second generation, fully deterministic

EVERY SINGLE ONE IS DETERMINISTIC.
EVERY SINGLE ONE RUNS IN THE BROWSER.
EVERY SINGLE ONE COSTS ZERO.
PART 3: THE DESIGN AGENCY INSIGHT
3.1 HOW PROFESSIONAL DESIGN AGENCIES WORK
The most effective way to understand what D2D v3.0 should
feel like is to study how professional design agencies
work with clients.

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
    Client picks which mood board and style tile
    they prefer. Agency narrows to one direction.

  Step 5: WIREFRAME APPLICATION
    Agency takes the rough layout and applies the
    selected design direction. Typography, colors,
    spacing, and content are applied to the wireframes.

  Step 6: CLIENT REVIEW
    Client sees the result and provides feedback.
    "Can we try a different color?" "What about bolder type?"

  Step 7: ITERATE
    Try different directions, refine until approved.
    Typically 2-3 revision rounds.

  TOTAL: 2-4 weeks, $5,000-$15,000, 3-5 meetings.
3.2 HOW D2D REPLICATES THIS IN 60 SECONDS
text

D2D v3.0 WORKFLOW (costs ₹0, takes under 60 seconds):

  Step 1: USER DRAWS WIREFRAME
    Canvas exists. User sketches layout in 5-10 minutes.
    Maps to agency Step 5 input (rough layout).

  Step 2: USER FILLS DESIGN BRIEF
    Five-field visual form: page type, industry, tone,
    brand name, tagline.
    Takes 30 seconds.
    Maps to agency Step 1 (client brief).

  Step 3: SYSTEM SUGGESTS DESIGN SETTINGS
    Smart Suggestions engine recommends preset, colors, fonts
    based on industry × tone combination.
    One-click "Apply All" button.
    Maps to agency Steps 2 + 3 (mood boards + style tiles).

  Step 4: USER SELECTS DESIGN PRESET
    Six preset cards with live mini-previews.
    "Recommended" badge on the suggested preset.
    User clicks to select.
    Maps to agency Step 4 (direction selection).

  Step 5: SYSTEM GENERATES THREE VARIATIONS
    Pipeline runs three times with three different presets.
    Total time: under 300 milliseconds.
    Three professional websites appear simultaneously.
    Maps to agency Step 5 (wireframe application) × 3.

  Step 6: USER REVIEWS WITH LIVE PREVIEW
    Responsive toggle shows desktop, tablet, mobile.
    Code view shows exact output.
    Quality score quantifies output quality.
    Maps to agency Step 6 (client review).

  Step 7: USER SWITCHES STYLES INSTANTLY
    "Try Another Style" cycles through all six presets.
    Each switch takes under 100 milliseconds.
    Maps to agency Step 7 (iteration).

  TOTAL: Under 60 seconds, ₹0, zero meetings.
3.3 THE FOUR-STEP GUIDED FLOW
The agency workflow condenses into four concrete steps
in the application interface.

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
PART 4: THE DESIGN BRIEF
4.1 CONCEPT AND PURPOSE
The Design Brief is a structured visual form that captures
five fields of semantic context. It is the single
highest-impact new component in v3.0 because it provides
the data that transforms generic output into contextual,
branded, industry-specific output.

text

WHY A STRUCTURED FORM BEATS A TEXT PROMPT:

  Text prompt:     "Make a restaurant landing page"
  Interpretation:  AI guesses what "restaurant" means
  Result:          Non-deterministic, varies each time

  Structured form: Industry = Restaurant (dropdown)
  Interpretation:  Exact lookup into restaurant content bank
  Result:          100% deterministic, identical every time

  Text prompt:     "Make it elegant and sophisticated"
  Interpretation:  AI guesses what "elegant" means
  Result:          Might be serif, might be thin sans, might be gold

  Structured form: Tone = Elegant (card selection)
  Interpretation:  Exact mapping to minimal-elegant preset
  Result:          Always Playfair Display serif, always muted palette

  Structured forms trade creative flexibility for reliability.
  For a deterministic pipeline, this is the correct tradeoff.
  Users who want creative flexibility use v0.
  Users who want reliable, professional, branded output use D2D.
4.2 FIVE FIELDS, COMPLETE SPECIFICATION
text

FIELD 1: PAGE TYPE
──────────────────
  Input:    Visual icon cards in a grid (click to select)
  Values:   Landing Page, Dashboard, Login / Sign Up,
            Blog / Article, Portfolio, E-commerce,
            SaaS Product, Agency, Restaurant, Pricing
  Default:  None (optional field)
  Max:      Single selection

  Controls:
    Section template selection and layout assumptions.
    Landing Page → hero + features + CTA pattern expected.
    Dashboard → sidebar + grid + stats pattern expected.
    Login → centered form pattern expected.

  Pipeline usage:
    Content inferrer selects page-type-appropriate text.
    Section engine gets hints about expected patterns.
    Builder adjusts section order and emphasis.


FIELD 2: INDUSTRY
─────────────────
  Input:    Emoji icon chips in a horizontal wrap (click to select)
  Values:   💻 Technology / Software
            🏥 Healthcare / Medical
            📚 Education / Learning
            🍽️ Food & Beverage
            👗 Fashion / Lifestyle
            💰 Finance / Banking
            🏠 Real Estate
            ✈️ Travel / Hospitality
            💪 Fitness / Sports
            🎨 Creative / Art
            ⚖️ Legal / Consulting
            🔧 Agency / Services
  Default:  None (optional, falls back to Technology)
  Max:      Single selection

  Controls:
    Content bank selection for all text output.
    Icon registry filters industry-appropriate icons.
    Smart suggestions recommend industry-appropriate colors.
    Placeholder content matches industry context.


FIELD 3: TONE
─────────────
  Input:    Visual cards with mini live previews (click to select)
  Values:   Professional → maps to startup-modern or corporate-clean
            Playful → maps to bold-creative
            Minimal → maps to minimal-elegant
            Bold → maps to bold-creative
            Elegant → maps to minimal-elegant
            Futuristic → maps to glass-gradient
  Default:  None (optional, falls back to Professional)
  Max:      Single selection

  Controls:
    Design identity preset recommendation.
    Typography weight and spacing adjustments.
    Content tone (elegant = refined language, playful = casual).


FIELD 4: BRAND NAME
───────────────────
  Input:    Styled text input
  Max:      30 characters
  Default:  Empty (falls back to "Brand" in generated output)
  Placeholder: "e.g. Acme, La Maison"

  Controls:
    Navigation logo text: "◆ {brandName}"
    Footer brand: "© 2025 {brandName}. All rights reserved."
    Hero heading: "Welcome to {brandName}" (contextual)
    CTA button: "Try {brandName}" or "Join {brandName}"
    Code comment: // Generated by D2D for {brandName}

  Security:
    HTML-escaped before insertion into generated code.
    Prevents cross-site scripting from malicious input.


FIELD 5: TAGLINE
────────────────
  Input:    Styled text input
  Max:      100 characters
  Default:  Empty (falls back to industry-specific default)
  Placeholder: Dynamic based on industry selection

  Controls:
    Hero section subtitle.
    CTA section description.
    Code comment metadata.

  Security:
    HTML-escaped identically to brand name.


DATA STRUCTURE:

  interface DesignBrief {
    pageType: string;      // "landing" | "dashboard" | "login" | etc.
    industry: string;      // "tech" | "medical" | "restaurant" | etc.
    tone: string;          // "professional" | "playful" | etc.
    brandName: string;     // "Acme" | "La Maison" | etc.
    tagline: string;       // "Build better products" | etc.
  }

STORAGE:
  Stored inside the existing styleGuide JSON string field
  in Convex. No schema changes required.

  StyleGuide type extended:
    interface StyleGuide {
      colors: ColorSection;
      typography: TypographySection[];
      brief?: DesignBrief;        // NEW
      preset?: string;            // NEW
    }
4.3 VISUAL BRIEF — NOT A FORM, AN EXPERIENCE
The brief must feel like a creative exercise, not paperwork.
Every input is visual. Users feel the difference between
options rather than reading labels in a dropdown.

text

PAGE TYPE — ICON CARDS:

  Not a dropdown. Clickable cards with mini wireframe icons.

  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
  │ ┌─────┐ │  │ ┌──┬──┐ │  │ ┌─────┐ │  │ ┌─────┐ │
  │ │     │ │  │ │  │  │ │  │ │ □□□ │ │  │ │ ≡≡≡ │ │
  │ │ ═══ │ │  │ ├──┼──┤ │  │ │ ─── │ │  │ │ ═══ │ │
  │ │ □□□ │ │  │ │  │  │ │  │ │ □   │ │  │ │ ≡≡≡ │ │
  │ Landing │  │Dashboard │  │  Login  │  │  Blog   │
  └─────────┘  └─────────┘  └─────────┘  └─────────┘

  Each card is 80×80 pixels with a mini wireframe SVG icon
  and the page type label below.
  Selected card receives a primary ring border and light
  primary background tint with a subtle scale transform.
  Grid layout: 4 columns on desktop, 3 on tablet, 2 on mobile.


INDUSTRY — ICON CHIPS:

  Horizontal wrapping row of clickable chips with emoji and label.

  💻 Technology    🏥 Healthcare    🍽️ Restaurant
  📚 Education     💰 Finance       🏠 Real Estate
  ✈️ Travel        💪 Fitness       🎨 Creative
  🛍️ E-commerce    ⚖️ Legal         🔧 Agency

  Each chip is an inline-flex element with rounded-full corners.
  Selected chip receives primary background with primary text.
  Only one can be selected at a time.
  Chips wrap to multiple rows on narrow screens.
  Native emoji provides universal support without an icon library.


TONE — VISUAL PREVIEW CARDS:

  The most important visual element. Each tone shows a mini
  live preview of what that aesthetic looks like.

  Each card renders a tiny live HTML preview (not an image)
  of a fixed template (navigation bar, heading, and button)
  styled with that tone's actual identity settings.

  Professional card: Inter font, blue colors, rounded-lg corners.
  Playful card: Rounded-full, vibrant colors, bouncy appearance.
  Minimal card: Generous whitespace, thin serif, understated.
  Bold card: Heavy font, vivid gradients, strong shadows.
  Elegant card: Playfair Display serif, muted tones, no shadow.
  Futuristic card: Dark background, purple glow, glass effect.

  Implementation: six micro-iframes (120×80 pixels each)
  with CSS scale factor of 0.4. Each loads a fixed template
  rendered with that tone's identity settings.

  Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile.


BRAND NAME + TAGLINE — STYLED TEXT INPUTS:

  Simple but elegant. Each input has a label, a description
  of where the text appears, and a character counter.

  As the user types, the live preview sidebar updates
  in real-time — their brand name appears in the preview
  navigation bar immediately.

  Tagline placeholder text changes dynamically based on
  the selected industry. Selecting "Restaurant" changes
  the placeholder from "Build better products" to
  "A culinary journey awaits."
4.4 HOW BRIEF FEEDS INTO THE PIPELINE
text

The brief is stored inside the existing styleGuide parameter.
No function signature changes are required. Each pipeline
layer extracts what it needs from styleGuide.brief.

generateFromFrame(frame, allShapes, styleGuide)
  │
  │  styleGuide now contains:
  │  {
  │    colors: { ... },
  │    typography: [ ... ],
  │    preset: "startup-modern",
  │    brief: {
  │      pageType: "landing",
  │      industry: "tech",
  │      tone: "professional",
  │      brandName: "Acme",
  │      tagline: "Build better products"
  │    }
  │  }
  │
  ├─→ Design Identity Builder:
  │     Reads: brief.tone → preset auto-detection fallback
  │     Reads: brief.brandName → identity.content.brandName
  │     Reads: styleGuide.colors → palette generation
  │     Reads: styleGuide.typography → font selection
  │
  ├─→ Section Engine:
  │     Reads: (no brief data needed, purely geometric)
  │     Could use: brief.pageType as detection hint (future)
  │
  └─→ Code Builder:
        │
        ├─→ Content Inferrer:
        │     Reads: brief.industry → selects industry content bank
        │     Reads: brief.brandName → nav logo, footer brand, CTA text
        │     Reads: brief.tagline → hero subtitle
        │     Reads: brief.pageType → section template hints
        │
        └─→ Icon Selection:
              Reads: brief.industry → industry-appropriate icons

BACKWARD COMPATIBILITY:
  If brief is undefined (user skipped the Design Brief),
  every layer falls back to generic defaults.
  Industry defaults to "tech."
  Brand name defaults to "Brand."
  Tone defaults to "professional."
  The pipeline ALWAYS produces valid output.
PART 5: INDUSTRY-SPECIFIC CONTENT ENGINE
5.1 THE CONTENT GAP
text

CURRENT STATE (v2.0):
  Content inferrer has approximately 20 generic strings.
  Every wireframe gets: "Build something amazing" hero heading.
  Every button gets: "Get Started" or "Learn More."
  Every icon uses: zap, shield, rocket, code.
  Every nav gets: "Product", "Pricing", "About."
  Every footer gets: "Privacy", "Terms", "Contact."

  This content is contextually wrong for most industries.
  A restaurant wireframe should say "Reserve a Table."
  A medical platform should say "Book Appointment."
  A fitness app should say "Join Now."

v3.0 STATE:
  Ten industry content banks with five to eight options
  per content category. Total: approximately 500 to 600
  lines of structured content data.

  Content selection is deterministic. The pipeline uses a
  position-based hash to select from the content bank.
  Same frame position always selects the same content string.
  No randomness. Reproducible output.
5.2 TEN INDUSTRY CONTENT BANKS (COMPLETE DATA)
text

Each industry bank follows an identical structure:

  heroHeadings:         4-6 options
  heroSubtexts:         3-4 options
  featureTitles:        6-8 options
  featureDescriptions:  3-4 options
  ctaPrimary:           3-4 options
  ctaSecondary:         3-4 options
  navLinks:             4-6 options
  footerLinks:          4-6 options
  icons:                4-5 preferred icon names
  colorSuggestion:      Primary color hex
  fontSuggestion:       [heading font, body font]


TECHNOLOGY / SOFTWARE:
  heroHeadings:
    "Ship faster, grow smarter"
    "Build the future of software"
    "Developer tools that just work"
    "Scale with confidence"
  heroSubtexts:
    "The modern platform for teams who build"
    "Everything you need to ship products people love"
    "Trusted by thousands of developers worldwide"
  featureTitles:
    "Lightning Fast"  "Enterprise Security"  "Scalable Infrastructure"
    "Developer First"  "Real-time Analytics"  "99.9% Uptime"
  ctaPrimary:    "Start Free Trial"  "Get Started"  "Try for Free"
  ctaSecondary:  "View Documentation"  "See Pricing"  "Book Demo"
  navLinks:      "Product"  "Pricing"  "Docs"  "Blog"  "Changelog"
  footerLinks:   "Privacy"  "Terms"  "GitHub"  "Twitter"  "Status"
  icons:         zap, shield-check, rocket, code, globe
  colorSuggestion: #3b82f6
  fontSuggestion: ["Inter", "Inter"]


HEALTHCARE / MEDICAL:
  heroHeadings:
    "Healthcare you can trust"
    "Your health, our priority"
    "Modern care, personal touch"
    "Better health starts here"
  heroSubtexts:
    "Compassionate care backed by cutting-edge technology"
    "Board-certified specialists available 24/7"
    "Putting patients first since day one"
  featureTitles:
    "24/7 Support"  "Board Certified"  "Patient First"
    "Telehealth"  "Secure Records"  "Easy Scheduling"
  ctaPrimary:    "Book Appointment"  "Find a Doctor"  "Get Care Now"
  ctaSecondary:  "Learn More"  "View Services"  "Patient Portal"
  navLinks:      "Services"  "Doctors"  "Locations"  "Patient Portal"
  footerLinks:   "Privacy"  "HIPAA"  "Accessibility"  "Careers"
  icons:         shield-check, heart, user, phone, calendar
  colorSuggestion: #0891b2
  fontSuggestion: ["Inter", "Inter"]


FOOD & BEVERAGE / RESTAURANT:
  heroHeadings:
    "A culinary journey awaits"
    "Taste the extraordinary"
    "Where flavor meets artistry"
    "Farm to table, heart to soul"
  heroSubtexts:
    "Experience dining reimagined with locally sourced ingredients"
    "Award-winning cuisine in an unforgettable atmosphere"
    "Reserve your table for an evening to remember"
  featureTitles:
    "Fresh Ingredients"  "Award Winning"  "Private Dining"
    "Seasonal Menu"  "Wine Selection"  "Chef's Table"
  ctaPrimary:    "Reserve a Table"  "View Menu"  "Order Now"
  ctaSecondary:  "See Hours"  "Private Events"  "Gift Cards"
  navLinks:      "Menu"  "Reservations"  "About"  "Events"  "Gallery"
  footerLinks:   "Hours"  "Location"  "Careers"  "Instagram"
  icons:         star, heart, map-pin, clock, calendar
  colorSuggestion: #92400e
  fontSuggestion: ["Playfair Display", "Inter"]


EDUCATION / LEARNING:
  heroHeadings:
    "Learn without limits"
    "Knowledge is your superpower"
    "Education for everyone, everywhere"
    "Master new skills today"
  heroSubtexts:
    "Join millions of learners transforming their careers"
    "Expert-led courses with hands-on projects"
    "Flexible learning that fits your schedule"
  featureTitles:
    "Expert Instructors"  "Flexible Schedule"  "Certified Programs"
    "Hands-on Projects"  "Community Support"  "Career Guidance"
  ctaPrimary:    "Enroll Now"  "Start Learning"  "Browse Courses"
  ctaSecondary:  "View Curriculum"  "Free Preview"  "Talk to Advisor"
  navLinks:      "Courses"  "Programs"  "Instructors"  "Community"
  footerLinks:   "Privacy"  "Terms"  "Careers"  "Blog"  "Help"
  icons:         globe, star, check, play, user
  colorSuggestion: #7c3aed
  fontSuggestion: ["Inter", "Inter"]


E-COMMERCE / STORE:
  heroHeadings:
    "Discover your style"
    "Shop the new collection"
    "Curated for you"
    "Elevate your everyday"
  heroSubtexts:
    "Premium products handpicked for quality and design"
    "Free shipping on orders over $50"
    "New arrivals dropping every week"
  featureTitles:
    "Free Shipping"  "Easy Returns"  "Premium Quality"
    "Secure Checkout"  "24/7 Support"  "Loyalty Rewards"
  ctaPrimary:    "Shop Now"  "Browse Collection"  "Add to Cart"
  ctaSecondary:  "View Sale"  "Gift Guide"  "Track Order"
  navLinks:      "Shop"  "New Arrivals"  "Collections"  "Sale"
  footerLinks:   "Shipping"  "Returns"  "Size Guide"  "FAQ"
  icons:         heart, star, credit-card, download, share
  colorSuggestion: #be123c
  fontSuggestion: ["Plus Jakarta Sans", "Inter"]


FINANCE / BANKING:
  heroHeadings:
    "Your money, simplified"
    "Smart banking for everyone"
    "Financial freedom starts here"
    "Banking built for you"
  heroSubtexts:
    "Modern banking with zero hidden fees"
    "Grow your wealth with intelligent tools"
    "Trusted by over a million customers"
  featureTitles:
    "Secure Transactions"  "Low Fees"  "24/7 Access"
    "Smart Investing"  "Bill Pay"  "Instant Transfers"
  ctaPrimary:    "Open Account"  "Get Started"  "Apply Now"
  ctaSecondary:  "Compare Plans"  "Learn More"  "Calculator"
  navLinks:      "Personal"  "Business"  "Invest"  "Cards"
  footerLinks:   "Security"  "Privacy"  "FDIC"  "Careers"
  icons:         shield-check, credit-card, chart-bar, lock
  colorSuggestion: #1e40af
  fontSuggestion: ["Inter", "Inter"]


AGENCY / SERVICES:
  heroHeadings:
    "We build brands that matter"
    "Design that delivers results"
    "Your vision, our expertise"
    "Digital experiences, crafted"
  heroSubtexts:
    "Full-service creative agency for ambitious brands"
    "Strategy, design, and development under one roof"
    "Turning ideas into impactful digital products"
  featureTitles:
    "Strategy"  "Design"  "Development"
    "Marketing"  "Analytics"  "Support"
  ctaPrimary:    "Let's Talk"  "View Our Work"  "Get a Quote"
  ctaSecondary:  "Case Studies"  "Our Process"  "Meet the Team"
  navLinks:      "Work"  "Services"  "About"  "Blog"  "Contact"
  footerLinks:   "Privacy"  "Careers"  "Dribbble"  "LinkedIn"
  icons:         palette, code, rocket, globe, sparkles
  colorSuggestion: #6d28d9
  fontSuggestion: ["Plus Jakarta Sans", "Inter"]


FITNESS / SPORTS:
  heroHeadings:
    "Push your limits"
    "Transform your body and mind"
    "Strength starts here"
    "Your fitness journey begins"
  heroSubtexts:
    "Expert-led training programs for every fitness level"
    "Join a community of thousands achieving their goals"
    "State-of-the-art facilities and personalized coaching"
  featureTitles:
    "Personal Training"  "Group Classes"  "Nutrition Plans"
    "Recovery"  "Progress Tracking"  "Community"
  ctaPrimary:    "Join Now"  "Free Trial"  "Start Today"
  ctaSecondary:  "View Classes"  "Membership Options"  "Tour"
  navLinks:      "Classes"  "Trainers"  "Membership"  "Schedule"
  footerLinks:   "Privacy"  "Terms"  "Careers"  "Instagram"
  icons:         zap, heart, star, calendar, user
  colorSuggestion: #dc2626
  fontSuggestion: ["Plus Jakarta Sans", "Inter"]


REAL ESTATE:
  heroHeadings:
    "Find your dream home"
    "Where life happens"
    "Modern living, redefined"
    "Your perfect space awaits"
  heroSubtexts:
    "Browse thousands of listings in your area"
    "Expert agents guiding you every step of the way"
    "From first viewing to closing, we're with you"
  featureTitles:
    "Virtual Tours"  "Expert Agents"  "Market Insights"
    "Mortgage Calculator"  "Neighborhood Guide"  "Instant Alerts"
  ctaPrimary:    "Browse Listings"  "Find a Home"  "Get Started"
  ctaSecondary:  "Sell Your Home"  "Market Report"  "Contact Agent"
  navLinks:      "Buy"  "Sell"  "Rent"  "Agents"  "Insights"
  footerLinks:   "Privacy"  "Terms"  "Licensing"  "Careers"
  icons:         home, map-pin, search, heart, star
  colorSuggestion: #059669
  fontSuggestion: ["Inter", "Inter"]


TRAVEL / HOSPITALITY:
  heroHeadings:
    "Adventure awaits"
    "Discover the world"
    "Travel made extraordinary"
    "Your journey starts here"
  heroSubtexts:
    "Curated experiences in the world's most beautiful destinations"
    "Book with confidence — free cancellation on most trips"
    "Over 10,000 unique stays and experiences"
  featureTitles:
    "Unique Stays"  "Local Experiences"  "Flexible Booking"
    "24/7 Concierge"  "Best Price Guarantee"  "Verified Reviews"
  ctaPrimary:    "Explore Now"  "Book a Trip"  "Start Planning"
  ctaSecondary:  "View Destinations"  "Gift Cards"  "Travel Guide"
  navLinks:      "Destinations"  "Stays"  "Experiences"  "Flights"
  footerLinks:   "Privacy"  "Terms"  "Help"  "Careers"
  icons:         globe, map-pin, star, calendar, heart
  colorSuggestion: #0284c7
  fontSuggestion: ["Plus Jakarta Sans", "Inter"]
5.3 CONTENT SELECTION LOGIC
text

Content selection is deterministic using position-based hashing.

  function selectContent(
    options: string[],
    positionHash: number
  ): string {
    return options[positionHash % options.length];
  }

The position hash is derived from the shape's relative
coordinates within the frame. This ensures:

  Same wireframe position → same content selection.
  Different position → different content from the same bank.
  No randomness. Perfectly reproducible output.

Fallback chain:
  1. If brief.industry is set → use that industry's content bank.
  2. If brief.industry is not set → use "tech" as default.
  3. If a specific content category is empty → use generic fallback.

The content inferrer receives the brief as an optional
parameter. Existing pipeline calls without a brief
continue to work with default content.
5.4 BRAND IDENTITY PERMEATION
text

Brand name and tagline are not placed once. They permeate
the entire generated output, making it feel like a real
branded website rather than a template.

BRAND NAME PLACEMENT:
  Nav logo:       "◆ {brandName}"
  Hero heading:   "Welcome to {brandName}" (if contextually appropriate)
  CTA heading:    "Ready to try {brandName}?"
  CTA button:     "Start with {brandName}" or "Join {brandName}"
  Footer brand:   "{brandName}"
  Footer copy:    "© 2025 {brandName}. All rights reserved."
  Code comment:   // Generated by D2D for {brandName}

TAGLINE PLACEMENT:
  Hero subtitle:     "{tagline}"
  CTA description:   "Experience what makes {brandName} special"
  Code comment:      // {tagline}

INDUSTRY + BRAND COMBINED EXAMPLE:
  Industry = Restaurant, Brand = "La Maison":
    Nav:     "◆ La Maison"
    Hero:    "A culinary journey awaits" (from restaurant bank)
    CTA:     "Reserve at La Maison"
    Footer:  "© 2025 La Maison · Menu · Hours · Instagram"

  Industry = Tech, Brand = "Acme":
    Nav:     "◆ Acme"
    Hero:    "Ship faster, grow smarter" (from tech bank)
    CTA:     "Start your free Acme trial"
    Footer:  "© 2025 Acme · Privacy · Terms · GitHub"

SECURITY:
  All user-supplied text is HTML-escaped before insertion.

  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  Input:  '<script>alert("xss")</script>'
  Output: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
  Renders as visible text. Not executed.
PART 6: SMART SUGGESTIONS SYSTEM
6.1 THE MAPPING INTELLIGENCE
When the user fills in industry and tone, the Smart
Suggestions engine recommends the optimal preset,
primary color, and font combination.

This is not artificial intelligence. It is a lookup table
with thirty curated mappings created through design expertise.
Each mapping represents the industry-standard aesthetic
expectation for that combination of industry and tone.

The mapping table is approximately 150 lines of data.
It requires zero computation beyond a key lookup.

6.2 COMPLETE SUGGESTION TABLE (30 MAPPINGS)
text

INDUSTRY          + TONE           → PRESET           + COLOR    + FONTS
──────────────────────────────────────────────────────────────────────────────
tech              + professional   → startup-modern    + #3b82f6  + Inter, Inter
tech              + futuristic    → glass-gradient    + #8b5cf6  + Space Grotesk, Inter
tech              + minimal       → minimal-elegant   + #374151  + Inter, Inter
tech              + bold          → bold-creative     + #f59e0b  + Plus Jakarta Sans, Inter
tech              + playful       → bold-creative     + #6366f1  + Nunito, Inter
tech              + elegant       → minimal-elegant   + #1e293b  + Merriweather, Inter

medical           + professional  → corporate-clean   + #0891b2  + Inter, Inter
medical           + elegant       → minimal-elegant   + #0d9488  + Merriweather, Inter
medical           + minimal       → minimal-elegant   + #0f766e  + Inter, Inter

restaurant        + elegant       → minimal-elegant   + #92400e  + Playfair Display, Inter
restaurant        + playful       → bold-creative     + #ea580c  + Nunito, Inter
restaurant        + professional  → corporate-clean   + #78350f  + Inter, Inter

education         + professional  → startup-modern    + #7c3aed  + Inter, Inter
education         + playful       → bold-creative     + #8b5cf6  + Nunito, Inter
education         + minimal       → minimal-elegant   + #4f46e5  + Inter, Inter

ecommerce         + bold          → bold-creative     + #be123c  + Plus Jakarta Sans, Inter
ecommerce         + elegant       → minimal-elegant   + #78350f  + Playfair Display, Inter
ecommerce         + minimal       → minimal-elegant   + #171717  + Inter, Inter

finance           + professional  → corporate-clean   + #1e40af  + Inter, Inter
finance           + elegant       → minimal-elegant   + #0f172a  + Merriweather, Inter
finance           + minimal       → minimal-elegant   + #1e293b  + Inter, Inter

agency            + bold          → bold-creative     + #6d28d9  + Plus Jakarta Sans, Inter
agency            + professional  → startup-modern    + #4f46e5  + Inter, Inter
agency            + futuristic   → glass-gradient    + #7c3aed  + Space Grotesk, Inter

fitness           + bold          → bold-creative     + #dc2626  + Plus Jakarta Sans, Inter
fitness           + futuristic   → glass-gradient    + #06b6d4  + Space Grotesk, Inter
fitness           + professional  → startup-modern    + #ea580c  + Inter, Inter

realestate        + professional  → corporate-clean   + #059669  + Inter, Inter
realestate        + elegant       → minimal-elegant   + #064e3b  + Merriweather, Inter

travel            + playful       → bold-creative     + #0284c7  + Nunito, Inter
travel            + elegant       → minimal-elegant   + #0c4a6e  + Playfair Display, Inter
travel            + professional  → startup-modern    + #0369a1  + Inter, Inter

DEFAULT (unmatched)                → startup-modern    + #3b82f6  + Inter, Inter
6.3 SUGGESTION UI AND ONE-CLICK APPLICATION
text

After the user selects industry and tone, a suggestion
panel appears immediately below the tone selector:

  ┌──────────────────────────────────────────────────────┐
  │  💡 Based on "Technology" + "Professional":          │
  │                                                      │
  │  🎨 Suggested colors: Blue (#3b82f6)    [Apply]     │
  │  📝 Suggested fonts: Inter + Inter      [Apply]     │
  │  🎭 Suggested style: Startup Modern    [Apply]     │
  │                                                      │
  │  ────────────────────────────────────────────────    │
  │              [✨ Apply All Suggestions]               │
  └──────────────────────────────────────────────────────┘

"Apply All" sets colors, typography, and preset in one action.
Individual "Apply" buttons set only that specific setting.

Suggestions are NON-DESTRUCTIVE. They do not auto-apply.
The user explicitly chooses to accept suggestions.
If the user already has colors or fonts configured,
clicking "Apply" replaces them with the suggested values.

IMPLEMENTATION:
  function getSuggestions(
    industry: string,
    tone: string
  ): { preset: string, primaryColor: string,
       headingFont: string, bodyFont: string }

  Returns the matching row from the suggestion table.
  If no exact match exists, returns the default.
PART 7: DESIGN PRESET SELECTOR
7.1 MOODBOARD TRANSFORMATION
The current Style Guide page has a Mood Board tab that
lets users upload up to five inspiration images. These
images are stored in Convex file storage but the
deterministic pipeline cannot analyze them — there is
no image analysis without AI.

The Mood Board tab is functionally dead weight. It promises
"AI will generate your style guide from these images"
but that feature does not exist and will not exist in v3.0.

v3.0 replaces the Mood Board tab with a Design Style tab
containing a visual preset selector. Instead of uploading
images hoping AI will understand them, users SEE the actual
presets they will receive and choose directly.

This is more honest, more useful, and more delightful.

The Convex mood board infrastructure remains untouched
for potential future use. Only the UI component changes.

7.2 SIX PRESET CARDS WITH LIVE PREVIEWS
text

Each of the six design presets is presented as a card
in a two-by-three grid. Each card contains:

  ┌──────────────────────────────────────┐
  │  ┌──────────────────────────────┐    │
  │  │  Mini live preview            │    │
  │  │  (nav + hero + button)       │    │
  │  │  in THIS preset's style      │    │
  │  └──────────────────────────────┘    │
  │                                      │
  │  Startup Modern                      │
  │  Clean, modern SaaS look with        │
  │  gradients and glass effects         │
  │                                      │
  │  ● ● ● ●  (color dots)              │
  │                                      │
  │  ✓ Recommended for your brief        │
  └──────────────────────────────────────┘

CARD CONTENTS:

  1. Mini live preview rendered in a micro-iframe
     (150×100 pixels, CSS scale 0.3, transform-origin top left).
     Each iframe renders a fixed template (navigation bar,
     heading, and button) using that preset's actual identity.
     All six render simultaneously — they are small and
     have minimal performance impact.

  2. Preset name and one-line description.

  3. Color dots showing the preset's primary palette colors.

  4. "Recommended" badge appears on the preset suggested
     by the Smart Suggestions engine based on the user's
     Brief selections.

INTERACTION:
  Clicking a card selects it. The selected card receives
  a ring-2 ring-primary highlight. The selection saves
  to styleGuide.preset in Convex via the useStyleGuide hook.

  The user can change their selection at any time.
  The live preview sidebar (if present) updates immediately
  to reflect the new preset selection.
7.3 RECOMMENDED BADGE LOGIC
text

The badge appears when:
  1. The user has filled in both industry AND tone in the Brief.
  2. The Smart Suggestions engine returns a recommended preset.
  3. The badge displays on the card matching that preset.

If the user has not filled in the Brief, no badge appears.
If the user ignores the recommendation, the system respects
their choice. The badge is guidance, not enforcement.
PART 8: LIVE PREVIEW — THE KILLER FEATURE
8.1 WHY THIS CHANGES EVERYTHING
No competitor shows the user how their design choices
affect the output BEFORE generation. The user configures
colors, fonts, and presets, then generates, then discovers
whether they like the result. If they do not, they go back,
change settings, and generate again. Each iteration cycle
wastes time and erodes confidence.

The Live Preview eliminates this cycle entirely. It shows
a miniature but faithful representation of the generated
output that updates in real-time as the user adjusts
settings. Change the primary color — the buttons change
color instantly. Switch the heading font — the headings
re-render instantly. Select a different preset — everything
updates instantly. Type a brand name — it appears in the
navigation bar instantly.

This is what makes the Style Guide page feel magical.

8.2 FIXED TEMPLATE APPROACH
text

The live preview does NOT render the user's actual wireframe.
That would require running the full pipeline in real-time
on every setting change, which is feasible performance-wise
(under 100 milliseconds) but requires the shapes data to
be available on the Style Guide page.

Instead, the live preview renders a FIXED TEMPLATE —
a representative website layout that demonstrates the
design system in action:

  ┌──────────────────────────────┐
  │ ◆ Brand    [Login] [Sign Up] │  ← Nav with their brand name
  │──────────────────────────────│
  │                              │
  │   Hero Heading               │  ← Their heading font + color
  │   in their primary color     │
  │                              │
  │   Subtitle text here         │  ← Their body font
  │                              │
  │   [Get Started →]            │  ← Button in their primary color
  │                              │
  │──────────────────────────────│
  │  ┌─────┐  ┌─────┐  ┌─────┐ │  ← Cards with their radius + shadow
  │  │ ⚡  │  │ 🛡  │  │ ✨  │ │
  │  │Fast │  │Safe │  │Easy │ │
  │  └─────┘  └─────┘  └─────┘ │
  │──────────────────────────────│
  │ © Brand · Privacy · Terms    │  ← Footer with their brand
  └──────────────────────────────┘

The template covers:
  Navigation bar with brand name and action buttons.
  Hero section with heading, subtitle, and CTA button.
  Three feature cards with icons.
  Footer with brand name and links.

This template exercises every design token: primary color,
surface color, heading font, body font, border radius,
shadow depth, and spacing density. Changes to any token
are immediately visible across multiple component types.
8.3 REAL-TIME UPDATE MECHANISM
text

IMPLEMENTATION:

  1. Build a fixed HTML template string with placeholder tokens.
  2. Call buildDesignIdentity() with current style guide settings.
  3. Replace tokens with identity values (colors, fonts, classes).
  4. Set the result as the srcdoc of an iframe.
  5. On any setting change, re-run steps 2-4.
  6. Debounce re-renders by 100 milliseconds for performance.

The buildDesignIdentity function already exists in the
pipeline. The live preview simply calls it with the current
settings and renders a fixed template with the result.

The iframe loads Tailwind CSS via CDN (same as the generation
preview). Google Fonts links are included for custom font
rendering.

PERFORMANCE:
  buildDesignIdentity: < 1ms.
  Template string assembly: < 1ms.
  iframe srcdoc update: browser re-render, typically < 50ms.
  Debounce: 100ms after last change.
  Total perceived latency: < 200ms (feels instant).

PLACEMENT:
  The live preview renders as a sidebar on the right side
  of the Style Guide page. It is visible alongside all four
  tabs (Brief, Design Style, Colors, Typography). As the user
  switches tabs and adjusts settings, the preview remains
  visible and updates continuously.

  Responsive: hidden on mobile (insufficient width),
  shown on tablet and desktop.
PART 9: MULTI-VARIATION GENERATION
9.1 THE MIDJOURNEY INSIGHT
MidJourney does not show one image from a prompt. It shows
four. That is what makes it feel magical — the user receives
OPTIONS, not a single take-it-or-leave-it result.

D2D applies this same principle.

The pipeline runs in under 100 milliseconds per invocation.
D2D has six design presets. Running the pipeline three times
with three different presets costs three times zero equals
zero rupees and takes three times 100 milliseconds equals
300 milliseconds total.

D2D generates three complete professional website variations
faster than v0 generates a single one.

9.2 INTELLIGENT PRESET SELECTION (CONTRAST MAPPING)
text

The three presets shown are not random. They are
intelligently selected for maximum visual contrast.

SELECTION LOGIC:

  If the user selected a preset manually:
    Variation 1: Their selected preset (primary choice)
    Variation 2: Best contrasting preset
    Variation 3: Second best contrasting preset

  If the user did not select a preset (only brief filled):
    Variation 1: Recommended preset from Smart Suggestions
    Variation 2: Best contrasting preset
    Variation 3: Second best contrasting preset


CONTRAST MAPPING (which presets contrast best with each):

  startup-modern    contrasts with: minimal-elegant, glass-gradient
  corporate-clean   contrasts with: bold-creative, glass-gradient
  bold-creative     contrasts with: minimal-elegant, corporate-clean
  minimal-elegant   contrasts with: bold-creative, startup-modern
  dashboard-dense   contrasts with: bold-creative, glass-gradient
  glass-gradient    contrasts with: corporate-clean, minimal-elegant

This mapping maximizes the visual difference between
variations. If variation 1 is clean and minimal,
variation 2 will be bold and colorful, and variation 3
will be dark and glowing. The user sees the full range
of what the same wireframe can become.


WHY THREE AND NOT SIX:

  Three is the sweet spot.
  MidJourney uses four, but D2D shows code alongside
  the preview, requiring more horizontal space.
  Three fits cleanly in a row on desktop.
  Three is enough for meaningful comparison without
  overwhelming the user with choices.
  The remaining three presets are accessible via
  "Try Another Style" dropdown for instant switching.
9.3 THREE VARIATIONS IN 300 MILLISECONDS
text

VARIATION GENERATOR MODULE:

  Input:
    frame: FrameShape
    allShapes: Shape[]
    styleGuide: StyleGuide | null

  Process:
    1. Determine the 3 best presets (selectThreePresets)
    2. Run generateFromFrame 3 times, each with a different
       preset override applied to the styleGuide
    3. Collect the code output from each run

  Output:
    Variation[] — array of 3 objects, each containing:
      presetName:        string (e.g., "startup-modern")
      presetLabel:       string (e.g., "Startup Modern")
      presetDescription: string (e.g., "Clean, modern SaaS look")
      code:              string (complete React component)

  Performance:
    Three sequential pipeline runs: < 300ms total.
    All runs share the same extracted and classified shapes.
    Only the styling and content change between runs.
    No API calls. No server load. No network requests.
    Zero marginal cost.

  The preview HTML is NOT pre-generated. It is built
  on the frontend using the existing buildPreviewHtml
  function when the iframe needs to render. This keeps
  the variation data lean (code only, no duplicate HTML).
9.4 "TRY ANOTHER STYLE" — INSTANT SWITCHING
text

After viewing three variations, the user can access all
six presets through a dropdown on the generation page.

  ┌──────────────────────────────────────────┐
  │  Style: Startup Modern ▼                  │
  │  ┌──────────────────────────────────────┐ │
  │  │ ● Startup Modern      (current)     │ │
  │  │ ○ Corporate Clean                   │ │
  │  │ ○ Bold Creative                     │ │
  │  │ ○ Minimal Elegant                   │ │
  │  │ ○ Dashboard Dense                   │ │
  │  │ ○ Glass & Gradient                  │ │
  │  │ ─────────────────────────────────── │ │
  │  │ 🎲 Surprise Me (random preset)      │ │
  │  └──────────────────────────────────────┘ │
  └──────────────────────────────────────────┘

When the user clicks a different preset:

  1. Pipeline runs with the new preset (< 100ms).
  2. Code view updates immediately.
  3. Preview iframe updates immediately.
  4. Preset label in dropdown updates.
  5. No loading state needed — it is instant.

The user can cycle through ALL SIX presets in approximately
three seconds. Click, instant result, click, instant result.

This creates an addictive exploration loop. Users try all
six presets to see the variety. They show colleagues.
They screenshot the contrast between presets.

SIX COMPLETE WEBSITE DESIGNS FROM ONE WIREFRAME
IN THREE SECONDS FOR ZERO RUPEES.

"Surprise Me" picks a random preset excluding the current
one. This adds an element of play and discovery. This is
the one place where randomness is used intentionally —
for fun, not for reproducibility.

The preview iframe transitions smoothly between versions
using a 200-millisecond opacity fade.
PART 10: THE GENERATION PAGE
10.1 FROM POPUP TO DESTINATION
The current generation result appears in a portal popup
overlaying the canvas. While functionally correct, the
popup is cramped and cannot accommodate multiple variations,
responsive preview, export options, or quality scoring
without becoming unusably cluttered.

v3.0 replaces the popup with a dedicated full page.
This page is the PAYOFF of the entire D2D experience —
where the user sees their rough sketch transformed into
professional websites. It should feel like a reveal,
not a popup.

Route: /dashboard/[session]/generate?project=xxx&frames=frame1,frame2

10.2 PAGE LAYOUT AND INTERACTION DESIGN
text

┌──────────────────────────────────────────────────────────┐
│  ← Back to Canvas    D2D Generation    [Style Guide]    │
│──────────────────────────────────────────────────────────│
│                                                          │
│  THREE VARIATION CARDS (side by side):                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │          │    │          │    │          │          │
│  │  Scaled  │    │  Scaled  │    │  Scaled  │          │
│  │ Preview  │    │ Preview  │    │ Preview  │          │
│  │          │    │          │    │          │          │
│  └──────────┘    └──────────┘    └──────────┘          │
│  Startup Modern   Minimal Elegant  Glass Gradient       │
│                                                          │
│  Click any variation to expand:                          │
│                                                          │
│  ┌──────────────────┬───────────────────────┐           │
│  │   Code Editor    │   Live Preview        │           │
│  │   (left half)    │   (right half)        │           │
│  │                  │   🖥 💻 📱 toggle     │           │
│  │                  │                       │           │
│  └──────────────────┴───────────────────────┘           │
│                                                          │
│  [Copy Code] [Download TSX] [Download HTML] [Tokens]     │
│  [Try Another Style ▼]         Quality: 87/100           │
│  [← Back to Style Guide]  [← Back to Canvas]            │
└──────────────────────────────────────────────────────────┘

INTERACTION FLOW:

  1. Page loads with loading animation (1.5 seconds).
  2. Pipeline runs during animation (3 variations, < 300ms).
  3. Results stored in state but NOT displayed yet.
  4. Animation completes. Three variation cards reveal
     with stagger animation (150ms delay between cards).
  5. User clicks a variation card to expand.
  6. Expanded view shows full code editor on the left
     and live preview iframe on the right.
  7. Responsive toggle, export options, quality score,
     and style switching are accessible in the expanded view.
  8. Navigation buttons allow returning to canvas or style guide.

VARIATION CARDS:
  Each card renders a scaled-down preview iframe.
  iframe renders at full size (1440×900) but displays
  at small size using CSS transform scale(0.3).
  This produces pixel-perfect miniatures.
  Loading skeleton shows while iframes load.

EXPANDED VIEW:
  The full-size preview iframe only renders when the user
  clicks a variation to expand. This means initially only
  three small iframes load (lightweight). The full-size
  iframe loads on demand (one at a time).

FRAME TABS (for multi-frame projects):
  If multiple frames were selected, tabs appear at the top
  of the variation view. Each tab shows that frame's
  three variations independently.

DATA SOURCE:
  The generation page reads project data from Convex
  (not Redux — the page may be loaded fresh).
  It reads shapes from projects.sketchesData.
  It reads style guide from projects.styleGuide.
  This ensures data is always fresh from the database
  regardless of how the user navigated to the page.
10.3 RESPONSIVE PREVIEW TOGGLE
text

Three buttons above the preview iframe:

  🖥 Desktop (1440px)   💻 Tablet (768px)   📱 Mobile (375px)

The currently active button receives primary background
and foreground colors. Inactive buttons receive muted styling.

When clicked:
  Desktop: iframe container width = 100% of available space.
  Tablet:  iframe container width = 768px, centered with
           muted background around it.
  Mobile:  iframe container width = 375px, centered with
           muted background around it.

The iframe itself always has width 100%. The container
constrains it. The transition between sizes uses a
300-millisecond CSS transition for smooth resizing.

What the user sees when switching:

  Desktop: Full-width layout. Three-column feature grid.
           Side-by-side hero. Full navigation visible.

  Tablet:  Two-column feature grid. Slightly smaller type.
           Navigation may collapse some items.

  Mobile:  Single-column everything. Stacked hero.
           Full-width buttons. Smaller padding.

This PROVES the generated code is responsive.
The user sees it work at every breakpoint without
downloading or testing externally. This builds trust
in the code quality and differentiates D2D from tools
that generate desktop-only output.
10.4 EXPORT OPTIONS (FOUR FORMATS)
text

EXPORT 1: COPY CODE
  Copies the React/TSX code to the system clipboard.
  Target user: React developers.
  Implementation: navigator.clipboard.writeText(code).
  Existing functionality, carried forward.

EXPORT 2: DOWNLOAD TSX
  Downloads GeneratedUI.tsx file.
  Target user: React developers.
  Implementation: Blob download with text/typescript MIME type.
  Existing functionality, carried forward.

EXPORT 3: DOWNLOAD HTML (NEW)
  Downloads a standalone .html file that works without React,
  without a build step, without any local dependencies.

  Target user: Students, non-developers, quick prototypes.

  Implementation: The buildPreviewHtml function already
  produces complete HTML with DOCTYPE, Tailwind CDN script,
  and Google Fonts links. This HTML is saved as a .html file.
  Approximately 10 lines of new code.

EXPORT 4: DESIGN TOKENS JSON (NEW)
  Downloads a .json file containing the complete design
  identity: colors, typography, spacing, border radius,
  shadows, and component presets.

  Target user: Developers who want to use the design system
  in their own project without the generated code.

  Implementation: JSON.stringify(identity, null, 2).
  Download as design-tokens.json.
  Approximately 15 lines of new code.

All exports are entirely client-side. No API calls.
No server processing. No additional cost.
10.5 QUALITY SCORE VISUALIZATION
text

A collapsible panel on the generation page that quantifies
the output quality across five dimensions.

  ┌────────────────────────────────────────────────────┐
  │  Design Quality Score                    87/100    │
  │  ████████████████████████████████████░░░░░░░░░░   │
  │                                                    │
  │  ▼ View Details                                    │
  │  ┌──────────────────────────────────────────────┐  │
  │  │ ✅ Responsiveness        95/100              │  │
  │  │ ✅ Component Richness    90/100              │  │
  │  │ ✅ Typography            88/100              │  │
  │  │ ✅ Color Harmony         85/100              │  │
  │  │ ⚡ Content Relevance     78/100              │  │
  │  │    💡 Add a tagline for more personalized    │  │
  │  │       content                                │  │
  │  └──────────────────────────────────────────────┘  │
  └────────────────────────────────────────────────────┘

SCORING ALGORITHM:

  Responsiveness (weight 20%):
    Count responsive prefix classes (sm:, md:, lg:, xl:).
    0-5: 40pts. 6-10: 60pts. 11-20: 80pts. 20+: 100pts.

  Component Richness (weight 25%):
    Average Tailwind classes per UI element.
    1-5: 30pts. 6-10: 50pts. 11-15: 70pts. 16-20: 85pts. 20+: 100pts.

  Typography (weight 15%):
    Distinct font-size values used.
    1-2: 40pts. 3-4: 70pts. 5+: 90pts.
    Bonus 10pts if font-weight varies.

  Color Harmony (weight 15%):
    Distinct background colors used.
    1: 30pts. 2: 60pts. 3: 80pts. 4+: 95pts.
    Bonus 5pts if colored shadows present.

  Content Relevance (weight 25%):
    Brand name set and appears in output: +25pts.
    Tagline set and appears: +20pts.
    Industry content bank used: +30pts.
    Industry icons present: +15pts.
    Generic defaults used: +10pts.

  Total: weighted average of five dimensions.

TIPS:
  If content < 80: "Add a tagline in your Design Brief."
  If typography < 70: "Add more text elements to your wireframe."
  If color < 70: "Add colors in the Style Guide Colors tab."

The scoring function analyzes the generated code string
using regex and string matching. Approximately 60 lines.
No external dependencies.
10.6 THE LOADING ANIMATION — ENGINEERING ANTICIPATION
text

Even though generation takes under 300 milliseconds for
three variations, the generation page adds an intentional
1.5-second animated loading sequence.

WHY ADD DELAY:

  Instant results feel cheap.
  "It can't be that good if it takes no time."
  The animation builds anticipation, making the reveal
  more satisfying. MidJourney, ChatGPT, and v0 all have
  loading animations even when they could show results faster.
  The animation also shows the pipeline stages, which is
  educational and impressive.

THE ANIMATION:

  ┌──────────────────────────────────────────┐
  │                                          │
  │   ◆ Analyzing your wireframe...          │
  │   ━━━━━━━━━━━━━━━━━━━━░░░░░░░ 72%       │
  │                                          │
  │   ✅ Layout analyzed           0.1s      │
  │   ✅ 5 sections identified     0.2s      │
  │   ✅ Brand identity applied    0.3s      │
  │   ⏳ Generating 3 variations...          │
  │                                          │
  └──────────────────────────────────────────┘

  Step timing (artificial delays, total 1.5 seconds):
    0.0s: "Analyzing layout..."
    0.3s: "✅ Layout analyzed" → "Detecting sections..."
    0.6s: "✅ Sections identified" → "Applying brand..."
    0.9s: "✅ Brand applied" → "Generating variations..."
    1.2s: "✅ 3 variations ready"
    1.5s: Animation fades out, variations REVEAL

  The steps shown are REAL. The pipeline actually does
  analyze layout, detect sections, and apply brand identity.
  The timing is artificial, but the content is truthful.

REVEAL ANIMATION:
  After the loading animation, the three variation cards
  appear with a stagger effect:
    Card 1: delay 0ms, fade up from 20px below.
    Card 2: delay 150ms, fade up.
    Card 3: delay 300ms, fade up.

IMPLEMENTATION:
  1. Generation page starts with loading state = true.
  2. Pipeline runs immediately (all 3 variations, < 300ms).
  3. Results stored in state but NOT displayed yet.
  4. Animated progress component runs for 1.5 seconds.
  5. After animation completes, loading state = false.
  6. Variations render with stagger animation.

  The actual generation happens DURING the animation.
  By the time the animation finishes, results are ready.
  The user never waits — they see a satisfying animation
  that masks a near-instantaneous computation.
10.7 "EXPLAIN MY DESIGN" PANEL
text

A collapsible panel that shows HOW the pipeline interpreted
the wireframe. This builds trust, educates the user, and
helps with debugging.

  📋 How D2D interpreted your wireframe:

  ✅ Navigation detected (top bar with 3 elements)
     → Glass-style sticky nav with logo + links + CTA

  ✅ Hero section detected (large heading + image area)
     → Split hero: heading left, image right

  ✅ Feature grid detected (3 similar cards)
     → 3-column responsive grid with icons

  ✅ Form section detected (2 inputs + button)
     → Centered login form with email + password

  ✅ Footer detected (bottom elements)
     → 4-column footer with brand + links

  🎨 Design: Startup Modern
  📝 Content: Technology industry bank
  🏷️ Brand: "Acme" applied to nav, footer, CTA

IMPLEMENTATION:
  Each pipeline layer already makes decisions internally.
  A DecisionLog collects these decisions as the pipeline runs.

  interface PipelineDecision {
    icon: string;          // ✅ or ⚠️
    title: string;         // "Navigation detected"
    detail: string;        // "(top bar with 3 elements)"
    output: string;        // "Glass-style sticky nav..."
  }

  The pipeline returns decisions alongside code:

  interface GenerationResult {
    code: string;
    decisions: PipelineDecision[];
  }

WHY IT MATTERS:
  Trust: User sees the pipeline understood their sketch.
  Education: User learns UI design vocabulary.
  Debugging: If something looks wrong, user sees why.
  Uniqueness: No competitor explains their generation.
PART 11: COMPLETE USER JOURNEY (FOUR-STEP FLOW)
11.1 STEP 1: CANVAS (MINOR CHANGES)
text

The canvas remains the starting point. The user draws
wireframes inside frames. All existing canvas functionality
is unchanged — ten drawing tools, infinite canvas, auto-save,
keyboard shortcuts, zoom, pan.

CHANGES:

  The "Generate" button behavior changes.
  Currently: opens a popup with generation results.
  v3.0: triggers a force save and navigates to the
  Style Guide page (or Frame Selector if multiple frames).

  Generate button click flow:
    1. Force save current state (direct Convex mutation, awaited).
    2. Check frame count in the current project.
    3. If zero frames: toast error
       "Draw a frame first (press F) to define your artboard."
    4. If one frame: navigate directly to Style Guide page
       with frame ID in URL params.
    5. If two or more frames: show Frame Selector modal.

  The button shows "Saving..." with a spinner during the
  force save. It is disabled during save to prevent double clicks.
  If the save fails, an error toast appears and the user
  stays on the canvas. Their work is still in Redux (not lost).
11.2 STEP 2a: FRAME SELECTOR (CONDITIONAL MODAL)
text

The Frame Selector appears ONLY when the project has
two or more frames. It is a modal overlay on the canvas
page (does not navigate away).

CONTENTS:
  Each frame displayed as a card with:
    Frame number (or user-assigned name).
    A checkbox for selection.
    An optional text input for naming ("Home", "About").

  "Continue to Style Guide →" button at the bottom.

BEHAVIOR:
  At least one frame must be selected.
  Clicking "Continue" navigates to the Style Guide page
  with selected frame IDs passed as URL parameters:
  ?project=xxx&frames=frame1,frame2

  Frame names, if entered, are passed as additional params:
  &names=Home,About

  In v3.0, frame names are stored and displayed but are
  NOT yet used in navigation link generation. Multi-page
  website generation is a future feature. The architecture
  supports it — the generation page has frame tabs — but
  full cross-page navigation is deferred.
11.3 STEP 2b: STYLE GUIDE PAGE (OVERHAULED)
text

URL: /dashboard/{session}/style-guide?project=xxx&frames=f1,f2

The Style Guide page is reorganized with four tabs
and an optional live preview sidebar.

  Tab 1: Design Brief (NEW)
    Page type, industry, tone, brand name, tagline.
    Smart Suggestions panel appears after industry and
    tone are selected. "Apply All Suggestions" button.

  Tab 2: Design Style (NEW, replaces Mood Board)
    Six preset cards with mini live previews.
    "Recommended" badge based on Smart Suggestions.
    Click to select with ring highlight.

  Tab 3: Colors (EXISTING, enhanced)
    Current color picker works as-is.
    Pre-populated from suggestions if "Apply All" was clicked.

  Tab 4: Typography (EXISTING, enhanced)
    Current font selector works as-is.
    Pre-populated from suggestions if "Apply All" was clicked.

  Right sidebar: Live Mini Preview (NEW)
    Updates in real-time as settings change.
    Hidden on mobile, shown on tablet and desktop.

  Bottom: "Generate Design →" button.
    Navigates to the Generation page with project
    and frame IDs in URL params.

All style guide data auto-saves to Convex via the
existing debounced auto-save mechanism (800ms after
last change). The data persists across page navigations
because it is read from Convex on mount.
11.4 STEP 3: GENERATION PAGE (NEW)
text

URL: /dashboard/{session}/generate?project=xxx&frames=f1,f2

The Generation page is described in full in Part 10.
Summary of contents:

  1. Loading animation (1.5 seconds, engineering anticipation).
  2. Three variation cards with scaled preview iframes.
  3. Click to expand into full code + preview split view.
  4. Responsive toggle (desktop, tablet, mobile).
  5. Four export options (copy, TSX, HTML, tokens).
  6. "Try Another Style" dropdown for instant switching.
  7. Quality score panel (collapsible).
  8. "Explain My Design" panel (collapsible).
  9. Navigation back to canvas or style guide.

DATA SOURCE:
  Reads project data from Convex (not Redux).
  Reads shapes from projects.sketchesData.
  Reads style guide from projects.styleGuide.

CACHING:
  Generation results are cached to
  projects.generatedDesignData in Convex.
  A hash of the inputs (shapes + styleGuide) is stored
  alongside the results. On page reload, if the hash
  matches, cached results display immediately without
  regeneration. If the hash differs (user changed shapes
  or settings), the pipeline regenerates fresh results.

  Cache structure stores code only, not HTML.
  HTML is rebuilt from code using buildPreviewHtml
  when iframes need to render. This keeps cache size small
  (approximately 30KB for three variations per frame,
  well within Convex's 1MB document size limit).
11.5 STEP 4: EXPORT
text

Export happens on the Generation page.
The user copies code, downloads files, or exports tokens.
All exports are client-side. No API calls. No server cost.

After export, the user can:
  Continue exploring variations (try other presets).
  Return to Style Guide (adjust settings, regenerate).
  Return to Canvas (modify wireframe, start over).
  Create a new project from the dashboard.
11.6 NAVIGATION AND BACK-FLOW
text

Every step supports back-navigation:

  Generation → "Back to Style Guide"
    Style guide settings are preserved in Convex.
    User can adjust any setting and regenerate.

  Generation → "Back to Canvas"
    Shapes and viewport are preserved in Convex.
    User can modify the wireframe and restart the flow.

  Style Guide → "Back to Canvas"
    Style guide settings auto-saved before navigation.
    Canvas loads shapes from Convex.

Data never goes out of sync because every page reads
from Convex on mount. There is no stale Redux state
to worry about across page transitions.
PART 12: STATE PERSISTENCE AND DATA ARCHITECTURE
12.1 THE MULTI-PAGE CHALLENGE
The v3.0 user journey spans three separate pages:
Canvas, Style Guide, and Generation Page. Each page
navigation is a full route change in Next.js. React
component state (useState, Redux) is destroyed when
the user navigates away from a page.

Data must survive navigation between pages without
loss or inconsistency.

12.2 DATA INVENTORY — WHERE EACH PIECE LIVES
text

SHAPES (drawings on canvas):
  Runtime:     Redux shapes slice (in-memory)
  Persistent:  Convex projects.sketchesData (v.any())
  Sync:        Auto-save every 30 seconds via API route
  Risk:        If user navigates before auto-save fires,
               unsaved shapes could be lost
  Solution:    Force save (direct Convex mutation) before navigation

VIEWPORT (zoom and pan state):
  Runtime:     Redux viewport slice (in-memory)
  Persistent:  Convex projects.viewportData (v.optional(v.any()))
  Sync:        Saved alongside shapes in auto-save
  Risk:        Same as shapes — solved by same force save

STYLE GUIDE (colors, typography, brief, preset):
  Runtime:     useState in useStyleGuide hook
  Persistent:  Convex projects.styleGuide (v.optional(v.string()))
               Stored as JSON string
  Sync:        Debounced auto-save (800ms after last change)
               via updateProject mutation (direct Convex)
  Risk:        Low — style guide page saves directly to Convex

GENERATION RESULTS (generated code):
  Runtime:     useState on generation page
  Persistent:  Convex projects.generatedDesignData (v.optional(v.any()))
  Sync:        Saved after generation completes
  Risk:        Minimal — generation takes under 1 second

SELECTED FRAMES (which frames to generate):
  No persistent storage needed.
  Passed via URL params: ?frames=frameId1,frameId2
  URL params survive page navigation.

PROJECT ID:
  Already in URL params: ?project=xxx
  Survives all navigation.
12.3 FORCE SAVE STRATEGY (DIRECT CONVEX MUTATION)
text

The force save before canvas navigation uses a direct
Convex mutation — not the existing auto-save API route.

EXISTING AUTO-SAVE PATH:
  Browser → fetch("/api/project") → Next.js API Route
  → tries Inngest → falls back to ConvexHttpClient
  → calls autosaveProject mutation

  Hops: 3-4
  Latency: 200-500ms
  Failure points: API route, Inngest, ConvexHttpClient

FORCE SAVE PATH (v3.0):
  Browser → useMutation(api.projects.updateProject) → Convex

  Hops: 1
  Latency: 50-100ms
  Failure points: Only Convex itself

WHY THE DIRECT PATH IS BETTER:
  Faster: Direct WebSocket vs HTTP round trip (3-5x faster).
  Simpler: One call, no fallback chain.
  More secure: Uses real auth token, not userId in body.
  Already available: useMutation hook exists in the component.
  Awaitable: Returns promise that resolves when save completes.
  No Inngest dependency.

IMPLEMENTATION:
  const updateProject = useMutation(api.projects.updateProject);

  async function handleGenerate() {
    const sketchesData = {
      shapes: shapesState.shapes,
      tool: shapesState.tool,
      frameCounter: shapesState.frameCounter,
    };
    const viewportData = {
      translate: viewportState.translate,
      scale: viewportState.scale,
    };

    await updateProject({
      projectId: projectId,
      sketchesData,
      viewportData,
    });

    // Data is now safely in Convex. Navigate.
    router.push(`/dashboard/${session}/style-guide?project=${projectId}`);
  }

COEXISTENCE WITH AUTO-SAVE:
  The existing auto-save continues running on its 30-second
  interval. After force save, auto-save detects no changes
  (dirty check passes) and skips. There is no conflict.
12.4 GENERATION RESULT CACHING
text

The generation page caches results to Convex for instant
reload when the user returns.

CACHE STRUCTURE:
  interface GenerationCache {
    inputHash: string;         // Hash of shapes + styleGuide
    generatedAt: number;       // Timestamp
    frames: {
      [frameId: string]: {
        variations: {
          presetName: string;
          presetLabel: string;
          code: string;         // No HTML — rebuilt on render
        }[];
      };
    };
  }

CACHE FLOW:
  1. Page loads.
  2. Read project from Convex (shapes + styleGuide + cache).
  3. Compute inputHash from current shapes + styleGuide.
  4. If cache exists AND inputHash matches:
     → Show cached results immediately (no generation).
     → Display: "Showing cached results · [Regenerate]"
  5. If no cache OR hash mismatch:
     → Run generation pipeline (3 variations, < 300ms).
     → Show loading animation (1.5 seconds).
     → Save results to generatedDesignData in Convex.

HASH FUNCTION:
  A simple deterministic hash — not cryptographic, only
  for change detection:

  function hashInputs(shapes: any, styleGuide: any): string {
    const str = JSON.stringify({ shapes, styleGuide });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString(36);
  }

SIZE ANALYSIS:
  3 variations × 1 frame ≈ 3 × 10KB = 30KB of code text.
  3 frames × 30KB = 90KB.
  Convex document size limit: 1MB.
  Well within limits.

STORAGE:
  Uses the existing generatedDesignData field.
  No schema changes required.
12.5 ZERO SCHEMA CHANGES
text

The existing Convex schema perfectly accommodates v3.0.

  projects.styleGuide: v.optional(v.string())
    Currently stores: JSON of { colors, typography }
    v3.0 stores: JSON of { colors, typography, brief, preset }
    No schema change. More keys in the same JSON string.

  projects.generatedDesignData: v.optional(v.any())
    Currently: unused or has old data.
    v3.0 stores: GenerationCache object.
    Field already exists. Just use it.

  projects.sketchesData: v.any()
    No change.

  projects.viewportData: v.optional(v.any())
    No change.

  projects.moodBoardImages: v.optional(v.array(v.string()))
    Kept as-is. Not used by v3.0 but preserves data.

Zero schema changes. Zero Convex migrations. Zero risk
of breaking existing data. Existing users' projects
are completely unaffected.
PART 13: PIPELINE MODIFICATIONS
13.1 WHAT CHANGES IN THE PIPELINE
text

The v2.0 seven-phase pipeline architecture remains intact.
No phases are removed or replaced. Modifications are
additive — existing phases receive additional parameters
and produce richer output.

UNCHANGED:
  Phase 1: Extractor (reads shapes from Redux)
  Phase 2: Classifier (assigns semantic roles)
  Phase 3: Architect (builds tree hierarchy)
  Phase 3.5: Enhancer (applies 8 design pattern rules)

MODIFIED:
  Phase 4: Stylist / Design Identity Builder
    → Accepts brief for brandName and tone-based fallback.
  Phase 5: Builder
    → Section composition (alternating backgrounds).
    → Entrance animation staggering.
    → Brand name permeation in nav, footer, CTA.
  Phase 6: Display
    → Generation page replaces popup.

NEW MODULE:
  Variation Generator
    → Runs the pipeline 3 times with 3 different presets.
    → Returns an array of Variation objects.

MODIFIED SUPPORT:
  Content Inferrer (called inside Builder)
    → Accepts DesignBrief parameter.
    → Selects from industry content banks.
    → Uses brandName and tagline.
  Orchestrator (index.ts)
    → Extracts brief from styleGuide.
    → Passes brief to content inferrer and identity builder.
13.2 CONTENT INFERRER UPGRADE
text

CURRENT (v2.0):
  Content inferrer has ~20 generic strings.
  Every wireframe receives the same content.

v3.0 UPGRADE:
  function inferContent(
    role: string,
    section: Section,
    brief?: DesignBrief     // NEW parameter
  ): string {
    const industry = brief?.industry || 'tech';
    const bank = INDUSTRY_CONTENT[industry];

    // Select from industry-specific bank based on role + section
    if (role === 'button' && section.type === 'hero') {
      return selectContent(bank.ctaPrimary, positionHash);
    }
    if (role === 'heading' && section.type === 'hero') {
      return selectContent(bank.heroHeadings, positionHash);
    }
    // ... similar mappings for all roles and sections
  }

  Brand name and tagline are HTML-escaped before use:
    const safeBrand = escapeHtml(brief?.brandName || 'Brand');
    const safeTagline = escapeHtml(brief?.tagline || '');

CHANGES: approximately 100 lines of modifications
to existing content-inferrer.ts.
13.3 DESIGN IDENTITY UPGRADE
text

CURRENT (v2.0):
  buildDesignIdentity accepts styleGuide and preset name.
  Returns identity with colors, typography, and component styles.

v3.0 UPGRADE:
  buildDesignIdentity additionally:
    - Reads brief.brandName and includes it in identity.content.
    - Uses brief.tone as a fallback for preset auto-detection
      if no explicit preset is selected.

  This means the identity object now carries:
    identity.content.brandName = "Acme" (or "Brand")
    identity.content.tagline = "Build better products" (or "")

  The builder reads these values when generating nav, footer,
  and CTA sections.

CHANGES: approximately 50 lines of modifications
to existing design-identity.ts.
13.4 BUILDER UPGRADE (SECTION COMPOSITION)
text

The builder receives two significant upgrades.

UPGRADE 1: SECTION COMPOSITION (alternating backgrounds)

  BEFORE (v2.0): All sections have the same background.
    [Nav]       ← white
    [Hero]      ← white
    [Features]  ← white
    [CTA]       ← white
    [Footer]    ← white

  AFTER (v3.0): Sections have composed backgrounds.
    [Nav]       ← transparent/glass (overlays hero)
    [Hero]      ← accent or gradient background
    [Features]  ← light surface-alt background
    [Content]   ← white
    [CTA]       ← dark accent background (stands out)
    [Footer]    ← darkest (gray-900)

  Implementation: A composeSections function maps each
  detected section to a background, padding, and optional
  text color override based on section TYPE and ORDER.

  Hero sections receive the identity's hero background.
  Content sections alternate between white and surface-alt.
  CTA sections receive dark/accent background with white text.
  Footer always receives the darkest background.

  This single change makes output look three times more
  designed. The eye naturally separates sections.
  Approximately 100 lines in builder.ts.


UPGRADE 2: ENTRANCE ANIMATION STAGGERING

  BEFORE (v2.0): All sections animate simultaneously
  when the preview loads.

  AFTER (v3.0): Each section receives an animation-delay
  based on its position in the page.

    <nav style="animation-delay: 0ms">...</nav>
    <section style="animation-delay: 100ms">...</section>
    <section style="animation-delay: 200ms">...</section>
    <section style="animation-delay: 300ms">...</section>
    <footer style="animation-delay: 400ms">...</footer>

  The stagger animation makes the preview feel like a real
  website loading, not a static page appearing all at once.
  Approximately 20 lines added to builder.ts.


UPGRADE 3: BRAND NAME PERMEATION

  The builder uses identity.content.brandName (from the
  design identity upgrade) when generating:
    Nav logo: "◆ {brandName}"
    Footer: "© 2025 {brandName}. All rights reserved."
    CTA: "Ready to try {brandName}?"
  Approximately 30 lines of changes.

TOTAL BUILDER CHANGES: approximately 150 lines.
13.5 VARIATION GENERATOR (NEW MODULE)
text

New file: src/lib/ai-pipeline/variation-generator.ts

PURPOSE:
  Generate three variations from one wireframe by running
  the pipeline three times with three different presets.

FUNCTIONS:

  selectThreePresets(
    selectedPreset: PresetName | undefined,
    suggestedPreset: PresetName | undefined
  ): [PresetName, PresetName, PresetName]

  Selects the primary preset (user's choice or suggestion)
  and two contrasting presets from the contrast mapping.

  generateVariations(
    frame: FrameShape,
    allShapes: Shape[],
    styleGuide: StyleGuide | null
  ): Variation[]

  Runs generateFromFrame three times, each with a different
  preset override. Returns array of three Variation objects.

APPROXIMATELY 150 LINES.
13.6 ORCHESTRATOR CHANGES
text

The pipeline orchestrator (index.ts) receives minor changes.

  BEFORE:
    generateFromFrame(frame, allShapes, styleGuide)
    → passes styleGuide to identity builder and stylist

  AFTER:
    generateFromFrame(frame, allShapes, styleGuide)
    → extracts brief: const brief = styleGuide?.brief
    → passes brief to content inferrer
    → passes brief to identity builder
    → logs brief info for debugging

The function signature does not change. The brief rides
inside the existing styleGuide parameter. Backward
compatible — if brief is undefined, everything falls
back to generic defaults.

APPROXIMATELY 30 LINES OF CHANGES.
PART 14: SECURITY AND PERFORMANCE
14.1 XSS PREVENTION (USER-SUPPLIED TEXT)
text

The generated code is 100% deterministic. Every character
comes from the pipeline — component library templates,
content bank strings, and identity values. The ONLY
user-supplied strings are brand name and tagline.

If these two strings are HTML-escaped, XSS is impossible.

ESCAPE FUNCTION:
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

APPLICATION POINTS:
  content-inferrer.ts: escapeHtml applied to brandName
  and tagline before any string interpolation.

ATTACK VECTORS COVERED:
  Brand name '<script>alert("xss")</script>':
    Escaped to &lt;script&gt;... Renders as visible text.
  Tagline with HTML '<img src=x onerror=alert(1)>':
    Escaped. No execution.
  Brand with CSS injection 'a{}</style><script>...':
    Escaped. No injection.
14.2 PREVIEW IFRAME SANDBOXING
text

All preview iframes use the sandbox attribute:

  <iframe
    sandbox="allow-scripts"
    srcdoc={htmlContent}
    title="Preview"
  />

allow-scripts:       Required for Tailwind CDN JIT to work.
allow-same-origin:   NOT included. Prevents iframe from
                     accessing parent page cookies/storage.
allow-forms:         NOT included. No forms submit anywhere.
allow-popups:        NOT included. No links should open.

Content Security Policy in the iframe HTML:
  <meta http-equiv="Content-Security-Policy"
        content="script-src https://cdn.tailwindcss.com;
                 style-src 'unsafe-inline' https://fonts.googleapis.com;
                 font-src https://fonts.gstatic.com;">

This restricts scripts to only the Tailwind CDN.
No inline scripts, no other external scripts can execute.

Even WITHOUT escaping, the sandbox prevents:
  Cookie access, localStorage access, parent page DOM
  access, and parent page navigation.

Defense is layered: escaping + sandboxing + CSP.
14.3 THREE-IFRAME PERFORMANCE ANALYSIS
text

THREE-VARIATION VIEW — LOADING ANALYSIS:

  First iframe loads:
    Tailwind CDN:    ~107KB gzipped (first load)
    Google Fonts:    ~20-50KB (first load)
    Generated HTML:  ~5-20KB
    Total:           ~130-180KB

  Second + third iframes load:
    Tailwind CDN:    CACHED (0KB transfer)
    Google Fonts:    CACHED (0KB transfer)
    Generated HTML:  ~5-20KB each
    Total each:      ~10-40KB

  Total for all three: ~150-260KB

  On 4G (5Mbps):       loads in < 0.5 seconds
  On 3G (1Mbps):       loads in < 2 seconds
  On slow 3G (400Kbps): loads in ~ 5 seconds

OPTIMIZATION STRATEGIES:

  Scaled thumbnails: Variation cards render iframes at full
  size (1440×900) but display at small size using CSS
  transform: scale(0.3). Pixel-perfect miniatures with no
  extra rendering cost.

  Lazy full preview: The three variation cards show
  scaled-down previews. The FULL split view (code + full-size
  preview) only renders when the user CLICKS a variation.
  Initially only three small iframes load.

  Loading skeleton: While iframes load, gray shimmer
  background with "Loading preview..." text. Replaced by
  iframe content when the onload event fires.

  srcdoc: Iframes use srcdoc (inline HTML), not src URLs.
  No network request for the HTML itself. Only external
  requests are Tailwind CDN and Google Fonts (cached).
14.4 CDN CACHING STRATEGY
text

Both Tailwind CDN and Google Fonts are aggressively cached
by browsers. After the first page load in a session,
all subsequent iframes (including "Try Another Style"
switches and responsive toggle changes) load near-instantly
because the heavy assets are already cached.

Tailwind play CDN (cdn.tailwindcss.com):
  JIT compiler that generates only the CSS for classes
  actually used. Loads once, cached for the session.

Google Fonts (fonts.googleapis.com):
  Font files cached with long expiry headers.
  After first load, font changes between presets
  are instant if the font was already loaded.
  New fonts require a small additional download
  (typically 20-50KB per font family).
PART 15: EDGE CASES AND ERROR HANDLING
15.1 TWELVE EDGE CASE MATRIX
text

┌───────────────────────────────────┬───────────────────────────────────────┐
│ Edge Case                         │ Handling                              │
├───────────────────────────────────┼───────────────────────────────────────┤
│ Empty frame (no shapes)           │ If brief exists: generate a full      │
│                                   │ default template page using industry  │
│                                   │ + tone. If no brief: placeholder      │
│                                   │ message "Draw some shapes."           │
│                                   │                                       │
│ No frame drawn                    │ Generate button disabled. Tooltip:    │
│                                   │ "Draw a frame first (press F)."       │
│                                   │                                       │
│ Multiple overlapping frames       │ Each generates independently. Shape   │
│                                   │ assigned to frame with most overlap.  │
│                                   │                                       │
│ Very small frame (< 200px)        │ Warning toast. Generation proceeds.   │
│                                   │                                       │
│ Brand name too long               │ Input max-length 30. Nav truncates    │
│                                   │ to first 2-3 words if still long.     │
│                                   │                                       │
│ XSS in brand name                 │ escapeHtml converts all special       │
│                                   │ characters. Renders as visible text.  │
│                                   │                                       │
│ Convex down during force save     │ Error toast. User stays on canvas.    │
│                                   │ Work preserved in Redux. Retry.       │
│                                   │                                       │
│ 100+ shapes in frame              │ Works. Pipeline is O(n²) in tree      │
│                                   │ building. 100 shapes ≈ 4ms total.    │
│                                   │                                       │
│ Style guide not configured        │ All defaults apply. Preset:           │
│                                   │ startup-modern. Color: blue. Font:    │
│                                   │ Inter. Generation always works.       │
│                                   │                                       │
│ Browser tab close during gen      │ If cache saved: result preserved.     │
│                                   │ If not: regenerates on next visit     │
│                                   │ (< 300ms, no real impact).            │
│                                   │                                       │
│ Two tabs open (canvas + guide)    │ Convex handles concurrent writes.     │
│                                   │ Each mutation updates only its own    │
│                                   │ fields. No cross-field overwrites.    │
│                                   │                                       │
│ Slow network (preview loading)    │ Loading skeleton per iframe. Code     │
│                                   │ view appears immediately. Toast if    │
│                                   │ CDN completely unavailable.           │
└───────────────────────────────────┴───────────────────────────────────────┘
15.2 GRACEFUL DEGRADATION PHILOSOPHY
text

PRINCIPLE: Never show a blank screen. Never show a raw error.
Always show a helpful message with a clear action.

Every error path provides:
  1. A user-friendly message (no stack traces).
  2. A specific action the user can take.
  3. Data preservation (work is never lost).

EXAMPLES:
  Save fails → "Unable to save. Check connection. Try again."
  No frames → "Draw a frame first (press F)."
  CDN offline → "Preview styles couldn't load. Code is correct."
  Cache stale → Silently regenerate (< 300ms, unnoticeable).
15.3 ERROR MESSAGES AND RECOVERY PATHS
text

Every error message follows a template:
  WHAT HAPPENED + WHAT TO DO

  ❌ "Failed to save your work. Check your connection
      and try again."
      [Retry] button re-enables.

  ❌ "Draw a frame first (press F) to define your artboard."
      Generate button stays disabled.

  ❌ "Preview styles couldn't load. The generated code
      is still correct — try downloading the HTML file."
      Export options remain functional.

  ⚠️ "Frame is very small. For best results, draw a frame
      at least 200×200 pixels."
      Generation proceeds regardless.
PART 16: FILES ARCHITECTURE AND BUILD PLAN
16.1 FILES TO DELETE (CLEAN SLATE)
text

DELETE THESE FILES:
  1. src/lib/ai-pipeline/moodboard-analyzer.ts
  2. src/lib/ai-pipeline/design-brain.ts
  3. src/app/api/design-brain/route.ts (entire folder)
  4. src/app/api/generate/redesign/route.ts (entire folder)

REMOVE IMPORTS:
  In src/lib/ai-pipeline/index.ts: remove any import of
    moodboard-analyzer or design-brain.
  In src/components/generation/generation-button.tsx: remove
    any import of design-brain.
  Search codebase for "moodboard-analyzer" and "design-brain"
    to catch remaining references.

KEEP (infrastructure for potential future use):
  convex/moodboard.ts
  src/hooks/use-mood-board.ts
  src/hooks/use-project-moodboard.ts
  src/components/style-guide/mood-board.tsx
  src/components/style-guide/image-card.tsx

  These are retained until v3.0 is working. They are unused
  but harmless. Removal is post-launch cleanup.

TOTAL: 4 files deleted, approximately 4-6 import lines removed.
16.2 NEW FILES MANIFEST (15 FILES)
text

PIPELINE ADDITIONS:

  src/lib/ai-pipeline/industry-content.ts          ~600 lines
    10 industry content banks.
    Smart suggestion mapping table (30 mappings).
    getSuggestions() function.
    getIndustryContent() function.
    getIndustryIcons() function.
    Type exports.

  src/lib/ai-pipeline/variation-generator.ts        ~150 lines
    selectThreePresets() with contrast mapping.
    generateVariations() — runs pipeline 3 times.
    Returns Variation[] with code per preset.


STYLE GUIDE COMPONENTS:

  src/components/style-guide/design-brief.tsx       ~350 lines
    Page type icon card selector.
    Industry emoji chip selector.
    Tone visual preview card selector.
    Brand name input.
    Tagline input.
    Smart suggestions panel.

  src/components/style-guide/preset-selector.tsx    ~300 lines
    6 preset cards in 2×3 grid.
    Mini live preview per card (micro-iframes).
    Recommended badge from suggestions.
    Click to select with ring highlight.

  src/components/style-guide/live-preview.tsx       ~250 lines
    Fixed template (nav + hero + features + footer).
    Renders with current identity settings.
    iframe with Tailwind CDN.
    Debounced re-render (100ms).


GENERATION COMPONENTS:

  src/components/generation/frame-selector.tsx      ~200 lines
    Modal with frame thumbnails and checkboxes.
    Optional frame naming inputs.
    "Continue to Style Guide" button.

  src/components/generation/variation-view.tsx      ~300 lines
    3 variation cards side by side.
    Scaled-down preview iframes.
    Click to expand to full split view.
    Preset name and description labels.

  src/components/generation/responsive-toggle.tsx   ~80 lines
    Desktop / Tablet / Mobile buttons.
    Controls preview iframe container width.
    Smooth CSS transition between sizes.

  src/components/generation/quality-score.tsx        ~150 lines
    Score bar visualization.
    5 metric breakdown.
    Actionable improvement tips.
    Collapsible panel.

  src/components/generation/export-options.tsx       ~100 lines
    Copy Code button.
    Download TSX button.
    Download HTML button.
    Design Tokens JSON button.


PAGES:

  src/app/(protected)/dashboard/[session]/
    (workspace)/generate/layout.tsx                 ~30 lines
    Minimal layout wrapper for generation page.

  src/app/(protected)/dashboard/[session]/
    (workspace)/generate/page.tsx                   ~500 lines
    Full generation page.
    Loading animation (1.5s with pipeline steps).
    3-variation view with expand interaction.
    Responsive toggle, export, quality score.
    "Try Another Style" dropdown.
    Cache read/write to Convex.
    Navigation to canvas and style guide.


TOTAL NEW FILES: 15 files, approximately 3,010 lines.
16.3 MODIFIED FILES MANIFEST (8 FILES)
text

  src/types/style-guide.ts                          +50 lines
    Add DesignBrief interface.
    Add preset field to StyleGuide type.
    Add brief field to StyleGuide type.

  src/hooks/use-style-guide.ts                      +100 lines
    Add setBrief, updateBriefField operations.
    Add setPreset operation.
    Include brief and preset in default state.
    Parse brief and preset from loaded JSON.

  src/lib/ai-pipeline/content-inferrer.ts           +100 lines
    Accept DesignBrief parameter.
    Import and use industry content banks.
    Use brandName and tagline with HTML escaping.

  src/lib/ai-pipeline/design-identity.ts            +50 lines
    Read brief.brandName, brief.tone.
    identity.content.brandName, tagline.
    Tone fallback for preset.

  src/lib/ai-pipeline/builder.ts                    +150 lines
    Section composition (alternating backgrounds).
    Entrance animation staggering.
    Brand name permeation (nav, footer, CTA).

  src/lib/ai-pipeline/index.ts                      +30 lines
    Extract brief from styleGuide.
    Pass brief to content inferrer and identity builder.

  src/app/(protected)/dashboard/[session]/(workspace)/style-guide/
    layout.tsx, page.tsx                            +80 lines
    Four tabs: Brief, Design Style, Colors, Typography.
    Live preview sidebar. "Generate Design" CTA.

  src/components/canvas/shapes/frame/index.tsx      +15 lines
    Generate button → force save then navigate to style-guide
    (or frame selector). No popup.

TOTAL MODIFIED: 8 files, approximately 410 lines.

---

# APPENDIX A: ARCHITECTURE DIAGRAMS

---

## A.1 V3.0 HIGH-LEVEL SYSTEM ARCHITECTURE

```
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │                        D2D v3.0 — FOUR-STEP GUIDED FLOW                          │
  └─────────────────────────────────────────────────────────────────────────────────┘

  STEP 1: CANVAS                    STEP 2: STYLE GUIDE              STEP 3: GENERATE        STEP 4: EXPORT
  ─────────────────                 ─────────────────────             ───────────────         ─────────────
  /dashboard/.../canvas              /dashboard/.../style-guide        /dashboard/.../generate  (on same page)
  ?project=xxx                       ?project=xxx&frames=f1[,f2]       ?project=xxx&frames=...

  ┌─────────────────┐                ┌─────────────────────────┐      ┌──────────────────────────────┐
  │ Draw wireframe  │   Force save   │ Tab 1: Design Brief     │      │ Loading (1.5s)                │
  │ in frame(s)     │ ──────────────► │   pageType, industry,   │      │ → 3 variation cards           │
  │ Generate btn   │   (Convex)     │   tone, brandName,      │      │ → Expand: code + preview      │
  │                 │                │   tagline              │      │ → Responsive toggle           │
  │ If 2+ frames:   │                │ Tab 2: Design Style    │      │ → Export (Copy, TSX, HTML,    │
  │ Frame Selector  │                │   6 presets + live     │      │   Tokens)                     │
  │ modal           │                │   preview cards        │      │ → Try Another Style (6)       │
  └─────────────────┘                │ Tab 3–4: Colors, Fonts │      │ → Quality score, Explain      │
                                     │ Live preview sidebar   │      └──────────────────────────────┘
                                     │ "Generate Design" →    │
                                     └────────────────────────┘
                                               │
                                               ▼
                                     Convex: styleGuide (JSON)
                                     includes brief + preset

  DATA SOURCE: All steps read/write Convex (projects.sketchesData, styleGuide,
  generatedDesignData). Redux used on canvas only; force save before leaving.
```

---

## A.2 PIPELINE + CONTEXT LAYER (v3.0)

```
  ┌──────────────────────────────────────────────────────────────────────────────────┐
  │  CONTEXT LAYER (NEW IN v3.0)                                                       │
  │  Design Brief (pageType, industry, tone, brandName, tagline)                       │
  │  Style Guide (colors, typography, preset)                                          │
  │  Smart Suggestions: industry × tone → preset, color, fonts (30 mappings)            │
  │  Industry Content Banks: 10 industries × hero/CTA/nav/footer/icons                 │
  └─────────────────────────────────────────────┬──────────────────────────────────────┘
                                                │
  ┌─────────────────────────────────────────────▼──────────────────────────────────────┐
  │  VARIATION GENERATOR (NEW)                                                          │
  │  selectThreePresets(selected, suggested) → [P1, P2, P3] (contrast mapping)         │
  │  generateVariations(frame, shapes, styleGuide) → run pipeline 3× with P1, P2, P3    │
  │  Output: Variation[] { presetName, presetLabel, code }                              │
  └─────────────────────────────────────────────┬──────────────────────────────────────┘
                                                │
  ┌─────────────────────────────────────────────▼──────────────────────────────────────┐
  │  v2.0 SEVEN-PHASE PIPELINE (MODIFIED, NOT REPLACED)                                 │
  │  Phase 1: Extractor   Phase 2: Classifier   Phase 3: Architect   Phase 3.5: Enhancer│
  │  Phase 4: Stylist (+brief: brandName, tone)                                         │
  │  Phase 5: Builder (+section composition, animation stagger, brand permeation)       │
  │  Content Inferrer: +brief → industry content bank, brandName, tagline (escaped)     │
  │  Design Identity: +brief → identity.content.brandName, tagline                      │
  └────────────────────────────────────────────────────────────────────────────────────┘
  All phases run in browser. <300ms for 3 variations. ₹0 cost.
```

---

## A.3 GENERATION PAGE LAYOUT (v3.0)

```
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
  │  ┌────────────────────────────┬─────────────────────────────────────────┐          │
  │  │  Code Editor (left)         │  Live Preview (right)                   │          │
  │  │  syntax-highlighted         │  🖥 Desktop  💻 Tablet  📱 Mobile        │          │
  │  │                             │  iframe with generated component        │          │
  │  └────────────────────────────┴─────────────────────────────────────────┘          │
  │                                                                                     │
  │  [Copy] [Download TSX] [Download HTML] [Tokens]    [Try Another Style ▼]            │
  │  Quality: 87/100  ▼    Explain My Design ▼                                          │
  │  [← Back to Style Guide]  [← Back to Canvas]                                        │
  └────────────────────────────────────────────────────────────────────────────────────┘
```

---

## A.4 STATE PERSISTENCE & CONVEX (v3.0)

```
  ┌─────────────────────────────────────────────────────────────────────────────────┐
  │  CONVEX projects (no schema change)                                               │
  ├─────────────────────────────────────────────────────────────────────────────────┤
  │  sketchesData      → shapes + tool + frameCounter (canvas)                        │
  │  viewportData      → translate, scale                                            │
  │  styleGuide        → JSON string: { colors, typography, brief, preset }  ← NEW   │
  │  generatedDesignData → { inputHash, generatedAt, frames: { [id]: variations } }   │
  │  moodBoardImages   → (unchanged, unused in v3.0)                                  │
  └─────────────────────────────────────────────────────────────────────────────────┘

  FORCE SAVE (before leaving canvas):
    useMutation(api.projects.updateProject)({ projectId, sketchesData, viewportData })
    → await → then router.push(style-guide?project=...)

  CACHE FLOW (generation page):
    Read project → inputHash = hash(shapes, styleGuide)
    If cache.inputHash === inputHash → show cached variations
    Else → generateVariations() → save to generatedDesignData
```

---

## A.5 V3.0 FILES & MODULES OVERVIEW

```
  NEW FILES (15):
  ai-pipeline/          industry-content.ts, variation-generator.ts
  style-guide/          design-brief.tsx, preset-selector.tsx, live-preview.tsx
  generation/           frame-selector.tsx, variation-view.tsx, responsive-toggle.tsx,
                        quality-score.tsx, export-options.tsx
  app/.../generate/     layout.tsx, page.tsx

  MODIFIED (8):
  types/style-guide.ts  + DesignBrief, preset, brief
  hooks/use-style-guide.ts  + brief, preset state & setters
  ai-pipeline/          content-inferrer.ts (+brief), design-identity.ts (+brief),
                        builder.ts (+sections, brand), index.ts (+brief pass-through)
  style-guide/         layout.tsx, page.tsx (tabs, sidebar)
  canvas/.../frame/     Generate → force save → navigate

  DELETED (4):
  moodboard-analyzer.ts, design-brain.ts, api/design-brain, api/generate/redesign
```

---

# APPENDIX B: DATA FLOW DIAGRAMS

---

## B.1 END-TO-END USER DATA FLOW (v3.0 FOUR-STEP)

```
  User                Canvas                Convex                 Style Guide           Generate Page
  ────                ──────                ─────                  ────────────          ─────────────
  Draws               Redux shapes          (auto-save 30s)        brief, preset,       (reads project
  frame(s)             viewport             sketchesData          colors, fonts        from Convex)
  Clicks Generate     Force save            updateProject         stored in             generateVariations()
                       (direct mutation)     sketchesData          styleGuide JSON      (3× pipeline)
                       await                                          
  [If 2+ frames]      Frame Selector        —                     —                    —
  Select frames       Continue →            —                     style-guide?project  —
  Style Guide         brief + preset        styleGuide             &frames=...
  Fill brief          Apply suggestions     (debounced save)       Live preview         —
  Select preset       "Generate Design"     —                     → generate page      —
  Generate page        —                     —                     —                   Load; hash match?
  (load)              —                     —                     —                   → cache or run 3×
  See 3 variations    —                     generatedDesignData   —                    Save cache
  Export / Try Style  —                     —                     —                    Copy, download, etc.
```

---

## B.2 DESIGN BRIEF → PIPELINE DATA FLOW

```
  Design Brief (UI)                Style Guide (JSON in Convex)        Pipeline Consumption
  ─────────────────               ───────────────────────────        ────────────────────
  pageType    (card)    ────────► styleGuide.brief.pageType    ──────► Section hints (future)
  industry    (chips)   ────────► styleGuide.brief.industry   ──────► Content inferrer: select
  tone        (cards)   ────────► styleGuide.brief.tone       ──────►   industry content bank
  brandName   (input)   ────────► styleGuide.brief.brandName   ──────► Smart Suggestions: preset/color/font
  tagline     (input)   ────────► styleGuide.brief.tagline     ──────► Identity: content.brandName, tagline
                                                                      Content inferrer: nav, footer, CTA, hero
                                                                      escapeHtml(brandName), escapeHtml(tagline)
  preset      (cards)   ────────► styleGuide.preset            ──────► Design identity, Stylist, Variation pick
```

---

## B.3 MULTI-VARIATION GENERATION DATA FLOW

```
  frame, allShapes, styleGuide
           │
           ▼
  ┌────────────────────────────┐
  │ selectThreePresets(        │
  │   styleGuide.preset,       │
  │   getSuggestions(industry,  │
  │     tone).preset           │
  │ )                          │
  │ → [presetA, presetB,       │
  │    presetC] (contrast)     │
  └────────────┬───────────────┘
               │
     ┌─────────┼─────────┐
     ▼         ▼         ▼
  pipeline   pipeline   pipeline
  (presetA)  (presetB)  (presetC)
     │         │         │
     ▼         ▼         ▼
  code1      code2      code3
     │         │         │
     └─────────┼─────────┘
               ▼
  Variation[] { presetName, presetLabel, code }
  (< 300ms total, all in browser, ₹0)
```

---

## B.4 INDUSTRY CONTENT & SUGGESTIONS FLOW

```
  brief.industry + brief.tone
           │
           ├──────────────────────────────────► getSuggestions(industry, tone)
           │                                    → { preset, primaryColor, headingFont, bodyFont }
           │                                    → UI: "Apply All Suggestions"
           │
           └──────────────────────────────────► getIndustryContent(industry)
                                                 → { heroHeadings, ctaPrimary, navLinks, ... }
                                                 → Content inferrer: selectContent(bank.ctaPrimary, positionHash)
                                                 → Icons: getIndustryIcons(industry)

  brief.brandName + brief.tagline (escaped)
           │
           └──────────────────────────────────► Nav logo, footer, CTA, hero subtitle, code comment
```

---

## B.5 FORCE SAVE VS AUTO-SAVE PATH

```
  AUTO-SAVE (existing, 30s):
  Redux shapes/viewport → fetch("/api/project") → [Inngest or ConvexHttp] → updateProject
  Hops: 3–4. Latency: 200–500ms.

  FORCE SAVE (v3.0, on Generate click):
  Redux shapes/viewport → useMutation(api.projects.updateProject) → Convex
  Hops: 1. Latency: 50–100ms. Await before router.push(style-guide).
  Ensures no data loss when leaving canvas.
```

---

## B.6 GENERATION CACHE FLOW

```
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
               Show 3 cards + loading animation (1.5s) → reveal
```

---

*End of D2D v3.0 Product & Technical Document.*
*Context layer. Design Brief. Industry content. Three variations. Full generation page.*
*Zero cost. Sub-second. Deterministic. Build-ready.*