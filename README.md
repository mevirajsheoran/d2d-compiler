  # D2D — Drawing to Design

  **Turn your rough sketch into production-ready React code in under a second — with zero AI cost and zero guesswork.**

  D2D is a web application that transforms hand-drawn wireframes into styled, responsive React components. You draw on an infinite canvas, configure context and style through a guided flow, and generate clean React + Tailwind CSS code — with industry-specific content, brand permeation, and multiple design variations — all deterministic and running in the browser.

  ---

  ## Table of Contents

  - [What D2D Does](#what-d2d-does)
  - [v3.0: UX & Capability Expansion](#v30-ux--capability-expansion)
  - [The Four-Step Guided Flow](#the-four-step-guided-flow)
  - [Features in Detail](#features-in-detail)
  - [Pipeline Architecture](#pipeline-architecture)
  - [State & Data Architecture](#state--data-architecture)
  - [Security & Performance](#security--performance)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
  - [Documentation](#documentation)

  ---

  ## What D2D Does

  - **Canvas** — Draw wireframes with 10+ tools (select, pan, pen, rectangle, ellipse, arrow, line, text, frame, eraser) on an infinite canvas. Frames define artboards for generation.
  - **Context & style** — Capture *why* you’re drawing (industry, tone, brand, page type) via a **Design Brief**, then choose colors, typography, and a **design preset** with live preview.
  - **Generation** — Deterministic pipeline turns shapes + style guide + brief into production-ready React + Tailwind. **Three variations** per run (different presets, contrast-selected), in &lt;300ms, **₹0 cost**.
  - **Export** — Copy code, download TSX, download standalone HTML, or export design tokens JSON. Responsive preview (desktop/tablet/mobile) and “Try Another Style” across all six presets.

  No AI API calls. No server-side generation. Same input → same output, every time.

  ---

  ## v3.0: UX & Capability Expansion

  v3.0 adds the **context layer** on top of the v2.0 generation engine.

  | Layer | v2.0 | v3.0 |
  |-------|------|------|
  | **Spatial intent** | ✅ Position, dimensions, containment | Same |
  | **Design preferences** | ✅ Colors, typography, preset | Same + **Design Brief**, **Smart Suggestions** |
  | **Semantic context** | ❌ Generic content for all wireframes | ✅ **Industry**, **tone**, **brand**, **tagline**, **page type** |
  | **Output** | Single generation (popup) | **Three variations** + **dedicated Generation page** |
  | **Preview** | After generate | **Live preview** as you change settings (Style Guide) |
  | **Export** | Copy, TSX | + **Download HTML**, **Design Tokens JSON** |

  **Projected quality impact (from version3.0.docs):**

  - Overall quality score: **62/100 → 85/100**
  - Content relevance: **40 → 85**
  - Brand personality: **20 → 70**
  - User confidence: **50 → 100**

  **Engineering (v3.0 scope):**

  - ~3,420 lines new/modified TypeScript across 23 files
  - 15 new files, 8 modified, 4 deleted (design-brain, moodboard-analyzer, related API routes)
  - Zero new dependencies, zero Convex schema changes, zero breaking changes to existing features

  ---

  ## The Four-Step Guided Flow

  The product mirrors a design-agency workflow in under 60 seconds:

  ```
    STEP 1            STEP 2              STEP 3              STEP 4
    Canvas        →   Style Guide    →   Generation     →   Export
    (draw)            (configure)        (reveal)           (use)

    5–10 min          30–60 sec          < 1 sec             instant
  ```

  ### Step 1: Canvas

  - **URL:** `/dashboard/[session]/canvas?project=xxx`
  - Draw wireframes inside **frames** (press F). All existing tools and shortcuts unchanged.
  - **Generate** button: force-saves to Convex, then:
    - **0 frames:** Error toast — “Draw a frame first (press F).”
    - **1 frame:** Navigate to Style Guide with `?project=xxx&frames=frameId`.
    - **2+ frames:** **Frame Selector** modal → select frames (optional names) → “Continue to Style Guide” with `?project=xxx&frames=id1,id2`.

  ### Step 2: Style Guide

  - **URL:** `/dashboard/[session]/style-guide?project=xxx&frames=...`
  - **Tab 1 — Design Brief:** Page type (icon cards), industry (emoji chips), tone (visual preview cards), brand name, tagline. **Smart Suggestions** panel: “Apply All” sets preset, color, fonts from industry×tone (30 mappings).
  - **Tab 2 — Design Style:** Six preset cards with **mini live previews**; “Recommended” badge from suggestions. Replaces Mood Board tab.
  - **Tab 3–4:** Colors, Typography (existing, can be pre-filled by suggestions).
  - **Right sidebar:** **Live preview** — fixed template (nav, hero, features, footer) with current identity; updates in real time (100ms debounce).
  - **Bottom:** “Generate Design →” navigates to Generation page with same `project` and `frames` params.

  ### Step 3: Generation Page

  - **URL:** `/dashboard/[session]/generate?project=xxx&frames=...`
  - **Loading:** 1.5s animated sequence (pipeline runs in &lt;300ms during it).
  - **Three variation cards** side by side (scaled preview iframes). Click one to expand:
    - **Left:** Code (syntax-highlighted).
    - **Right:** Live preview + **responsive toggle** (desktop 1440px / tablet 768px / mobile 375px).
  - **Export:** Copy code, Download TSX, **Download HTML**, **Design Tokens JSON**.
  - **“Try Another Style”** dropdown: switch to any of the six presets; re-run pipeline (&lt;100ms), update code and preview.
  - **Quality score** (collapsible): overall + 5 dimensions (responsiveness, component richness, typography, color harmony, content relevance) with tips.
  - **“Explain My Design”** (collapsible): how the pipeline interpreted sections (nav, hero, features, etc.) and which preset/content/brand was applied.
  - **Navigation:** “Back to Style Guide”, “Back to Canvas”. Data read from Convex; generation results cached in `projects.generatedDesignData` keyed by input hash.

  ### Step 4: Export

  - All export actions are on the Generation page (copy, TSX, HTML, tokens). No separate export step; user can then go back to Style Guide or Canvas, or create a new project.

  ---

  ## Features in Detail

  ### Design Brief (five fields)

  | Field | Input | Purpose |
  |-------|------|--------|
  | **Page type** | Icon cards (Landing, Dashboard, Login, Blog, Portfolio, E-commerce, etc.) | Section template hints, content selection |
  | **Industry** | Emoji chips (Technology, Healthcare, Food & Beverage, Education, E-commerce, Finance, Agency, Fitness, Real Estate, Travel, Legal, etc.) | Content bank selection, icons, suggestion mapping |
  | **Tone** | Visual preview cards (Professional, Playful, Minimal, Bold, Elegant, Futuristic) | Maps to preset + content tone |
  | **Brand name** | Text input (max 30 chars) | Nav logo, footer, CTA, code comment; HTML-escaped |
  | **Tagline** | Text input (max 100 chars) | Hero subtitle, CTA; HTML-escaped |

  Stored in `styleGuide.brief` (JSON in Convex). Optional; missing values fall back to defaults (e.g. industry `"tech"`, brand `"Brand"`).

  ### Industry content engine

  - **10 industry content banks** (e.g. Technology, Healthcare, Food & Beverage, Education, E-commerce, Finance, Agency, Fitness, Real Estate, Travel).
  - Each bank: `heroHeadings`, `heroSubtexts`, `featureTitles`, `featureDescriptions`, `ctaPrimary`, `ctaSecondary`, `navLinks`, `footerLinks`, `icons`, `colorSuggestion`, `fontSuggestion`.
  - **Content selection:** deterministic position-based hash (same wireframe position → same string). No randomness.
  - **Brand permeation:** brand name and tagline used in nav, hero, CTA, footer, and code comments.

  ### Smart suggestions

  - **30 mappings:** `(industry, tone) → (preset, primaryColor, headingFont, bodyFont)`.
  - After user selects industry and tone, a suggestion panel shows recommended preset, color, and fonts with “Apply” / “Apply All”. Non-destructive until user clicks.

  ### Design preset selector

  - **Six presets:** e.g. Startup Modern, Corporate Clean, Bold Creative, Minimal Elegant, Dashboard Dense, Glass Gradient.
  - Each card: mini live preview (micro-iframe), name, short description, color dots. “Recommended” badge when suggestion matches.
  - Selection stored in `styleGuide.preset`.

  ### Live preview (Style Guide)

  - **Fixed template** (nav, hero, 3 feature cards, footer) rendered with current identity (colors, fonts, radius, shadow).
  - Renders in a sidebar iframe; updates on any setting change (100ms debounce). Hidden on mobile.

  ### Multi-variation generation

  - **Three variations** per generation. Presets chosen for **contrast** (e.g. startup-modern vs minimal-elegant vs glass-gradient).
  - Logic: user’s selected preset (or suggested) as primary; other two from contrast mapping.
  - **Variation generator** runs pipeline three times with three preset overrides; total &lt;300ms, client-side only.

  ### Generation page specifics

  - **Responsive preview:** Desktop / Tablet / Mobile toggle; iframe container width and layout reflect breakpoints.
  - **Export formats:** Copy code, Download TSX, **Download HTML** (standalone with Tailwind CDN), **Design Tokens JSON**.
  - **Quality score:** Responsiveness, component richness, typography, color harmony, content relevance; actionable tips.
  - **Explain My Design:** Collapsible list of pipeline decisions (sections detected, preset, content bank, brand).

  ---

  ## Pipeline Architecture

  The v2.0 **seven-phase pipeline** is unchanged in structure; v3.0 adds context and a variation layer.

  **Unchanged phases:** Extractor → Classifier → Architect → Enhancer.

  **Modified:**

  - **Stylist / Design Identity:** Accepts `brief`; uses `brief.brandName`, `brief.tone` (preset fallback); identity includes `content.brandName`, `content.tagline`.
  - **Builder:** Section composition (alternating backgrounds), entrance animation stagger, brand name in nav/footer/CTA. **Content Inferrer** accepts `DesignBrief`; selects from industry content banks; uses escaped brand/tagline.
  - **Orchestrator (index.ts):** Extracts `brief` from `styleGuide`, passes to content inferrer and identity builder.

  **New module:**

  - **Variation generator:** `selectThreePresets(selected, suggested)` (contrast mapping), `generateVariations(frame, allShapes, styleGuide)` → runs pipeline 3×, returns `Variation[]` (presetName, presetLabel, code).

  **New pipeline-related files (from version3.0.docs):**

  - `src/lib/ai-pipeline/industry-content.ts` — Content banks, suggestion table, `getSuggestions`, `getIndustryContent`, `getIndustryIcons`.
  - `src/lib/ai-pipeline/variation-generator.ts` — `selectThreePresets`, `generateVariations`.

  ---

  ## State & Data Architecture

  - **Shapes / viewport:** Runtime in Redux (canvas). Persisted in Convex `projects.sketchesData`, `projects.viewportData`. **Force save** (direct `updateProject` mutation) before leaving canvas so nothing is lost.
  - **Style guide:** Runtime in `useStyleGuide`; persisted as JSON string in `projects.styleGuide` (includes `colors`, `typography`, `brief`, `preset`). Debounced save (e.g. 800ms).
  - **Selected frames:** Not stored in DB; passed via URL `?frames=id1,id2`.
  - **Generation results:** Cached in `projects.generatedDesignData`: `inputHash`, `generatedAt`, `frames[frameId].variations[]` (presetName, presetLabel, code). On load, if `hash(shapes, styleGuide) === cache.inputHash`, show cache; else run `generateVariations()` and save.
  - **Convex:** No schema changes; `styleGuide` gains keys, `generatedDesignData` used for cache.

  ---

  ## Security & Performance

  - **XSS:** All user-supplied text (brand name, tagline) is HTML-escaped before insertion into generated code and previews.
  - **Preview iframes:** `sandbox="allow-scripts"` (no `allow-same-origin`); CSP in iframe HTML limits scripts to Tailwind CDN and styles/fonts to known origins.
  - **Performance:** Three variation previews: first iframe loads Tailwind + fonts (~130–180KB); second and third reuse cache. Scaled thumbnails (CSS transform); full-size preview only when user expands a variation. Loading skeletons while iframes load.

  ---

  ## Tech Stack

  | Layer | Technology |
  |-------|------------|
  | Framework | Next.js 16 (App Router), React 19 |
  | Styling | Tailwind CSS 4, Radix UI, Framer Motion |
  | Backend | Convex (real-time BaaS) |
  | Auth | Convex Auth (Google OAuth + email/password) |
  | Payments | Razorpay |
  | State | Redux Toolkit (canvas/shapes), React state |
  | Background jobs | Inngest |

  ---

  ## Getting Started

  ### Prerequisites

  - Node.js 20+
  - npm / pnpm / yarn / bun
  - [Convex](https://convex.dev) account
  - (Optional) Razorpay for subscriptions

  ### 1. Clone and install

  ```bash
  git clone <your-repo-url>
  cd d2d
  npm install
  ```

  ### 2. Environment variables

  Create `.env.local`:

  ```env
  # Required — from Convex dashboard
  NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

  # Optional — Billing
  NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
  RAZORPAY_PRO_MONTHLY_PLAN_ID=plan_xxx
  RAZORPAY_PRO_YEARLY_PLAN_ID=plan_yyy
  ```

  ### 3. Convex

  ```bash
  npx convex dev
  ```

  Log in, link or create a project; this can set `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.

  ### 4. Run the app

  ```bash
  npm run dev
  ```

  Open [http://localhost:3000](http://localhost:3000). Sign in, create a project, draw a frame, and use **Generate** to follow the four-step flow.

  ### Scripts

  | Command | Description |
  |--------|-------------|
  | `npm run dev` | Next.js dev server (Turbopack) |
  | `npm run build` | Production build |
  | `npm run start` | Production server |
  | `npm run lint` | ESLint |

  Keep `npx convex dev` running while developing.

  ---

  ## Project Structure (high level)

  ```
  d2d/
  ├── src/
  │   ├── app/                    # App Router: landing, dashboard, canvas, style-guide, generate
  │   ├── components/
  │   │   ├── canvas/             # Canvas, shapes, toolbar, frame (Generate → force save → navigate)
  │   │   ├── generation/        # Frame selector, variation view, responsive toggle, export, quality score
  │   │   ├── style-guide/        # Design brief, preset selector, (live preview), colors, typography
  │   │   └── ...
  │   ├── convex/                # Convex React client
  │   ├── hooks/                  # useCanvas, useStyleGuide (brief + preset), useAuth, ...
  │   ├── lib/
  │   │   └── ai-pipeline/        # Extractor, Classifier, Architect, Enhancer, Stylist, Builder,
  │   │                           # content-inferrer, design-identity, industry-content,
  │   │                           # variation-generator, preview-builder
  │   ├── redux/                  # Canvas state (shapes, viewport, history)
  │   └── types/                  # style-guide (DesignBrief, StyleGuide), etc.
  ├── convex/                     # Auth, projects, schema, subscriptions, moodboard
  ├── mvp.docs                    # Product & technical spec (MVP)
  ├── v2.0.docs                   # AI pipeline v2.0
  └── version3.0.docs             # v3.0 UX & capability expansion (this README’s source)
  ```

  ---

  ## Documentation

  | Document | Description |
  |----------|-------------|
  | **mvp.docs** | Full product and technical spec: user journey, features, stack, deployment, business model. |
  | **v2.0.docs** | Generation pipeline v2.0: seven phases, data flow, type system, file manifest. |
  | **version3.0.docs** | v3.0: Design Brief, industry content, Smart Suggestions, presets, live preview, multi-variation, Generation page, state persistence, pipeline changes, security, file architecture, build plan, quality projection, competitive position. |

  ---

  ## License

  Private. All rights reserved.
