# D2D — Deterministic Design Compiler

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-45%20passing-brightgreen)](tests/)

**Turn a rough sketch into production-ready React code in under a second — zero AI cost, zero guesswork.**

D2D is a deterministic design compiler that transforms hand-drawn wireframes into styled, responsive React + Tailwind CSS components. Everything runs in the browser. No API calls. No LLMs. Same input → same output, every time.

---

## Features

- **Infinite canvas** — 10 drawing tools, keyboard shortcuts, zoom, pan, auto-save
- **Design Brief** — Structured context: page type, industry, tone, brand name, tagline
- **Deterministic pipeline** — 7-phase engine: extract → classify → architect → enhance → style → build → display
- **Multi-variation output** — 3 simultaneous design variations with instant style switching across 6 presets
- **Industry-aware content** — 10 industry content banks replace generic placeholder text
- **Brand permeation** — Your brand name woven into nav, hero, footer, and CTAs automatically
- **Live preview** — Responsive preview (desktop / tablet / mobile) with code editor
- **Export** — Copy code, download TSX, download HTML, or export design tokens JSON
- **Zero cost** — All generation is client-side. No server compute. No per-generation fees.

---

## Architecture

```
Canvas (Redux)
   │
   ▼
┌──────────────────────────────────────────────────────┐
│  DETERMINISTIC PIPELINE (runs in browser, <100ms)    │
│                                                      │
│  1. Extractor    — shapes inside frame → normalized  │
│  2. Classifier   — shape → semantic UI role (17)     │
│  3. Architect    — flat list → nested tree + layout  │
│  4. Enhancer     — 8 design pattern rules            │
│  5. Stylist      — style guide → Tailwind classes    │
│  6. Builder      — tree → React + Tailwind JSX       │
│  7. Display      — live preview + code panel         │
└──────────────────────────────────────────────────────┘
   │
   ▼
React + Tailwind CSS Component
(responsive, interactive, production-ready)
```



---

## How It Works

1. **Draw** — Sketch your wireframe on the infinite canvas using rectangles, text, frames, and more.
2. **Configure** — Fill in the Design Brief (industry, tone, brand) and choose a design preset with live preview.
3. **Generate** — Click generate. The pipeline produces 3 styled variations in <300ms.
4. **Export** — Copy the React + Tailwind code, download as TSX/HTML, or export design tokens.

---

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 15, React 19               |
| Language  | TypeScript                         |
| Styling   | Tailwind CSS                       |
| State     | Redux Toolkit                      |
| Backend   | Convex (real-time BaaS)            |
| Auth      | Convex Auth (Google OAuth + email) |
| Payments  | Razorpay                           |
| Testing   | Vitest                             |
| Hosting   | Vercel                             |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
git clone https://github.com/mevirajsheoran/d2d-compiler.git
cd d2d-compiler
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

Fill in your Convex deployment URL and auth configuration.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Running Tests

```bash
npm test
```

**45 tests** across 11 test files covering the full deterministic pipeline:

| Suite                | Tests | Covers                                                                                      |
| -------------------- | ----- | ------------------------------------------------------------------------------------------- |
| `tests/pipeline/`    | 30    | Extractor, classifier, architect, spatial graph, grid detector, page recipes, recipe merger |
| `tests/integration/` | 11    | End-to-end pipeline: brief → code generation, brand permeation, responsive output           |
| `tests/determinism/` | 4     | Identical output verification across repeated runs                                          |

---

## Project Structure

```
d2d-compiler/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── components/             # React components
│   ├── lib/
│   │   └── design-engine-pipeline/  # Deterministic generation engine
│   └── store/                  # Redux state management
├── convex/                     # Convex backend (schema, functions, auth)
├── tests/                      # Test suites
│   ├── pipeline/               # Pipeline phase tests
│   ├── determinism/            # Determinism verification
│   └── integration/            # End-to-end pipeline tests
├── docs/                       # Technical documentation
│   ├── product.md              # Complete product docs (v5.0)
│   ├── pipeline.md             # Pipeline technical deep dive (v5.0)
│   ├── code-stats.md           # Codebase statistics
│   └── history/                # Older version documentation
├── assets/                     # README media (demo GIF, diagrams)
├── examples/                   # Sample wireframe data
├── CONTRIBUTING.md
├── CHANGELOG.md
├── ROADMAP.md
└── LICENSE
```

---

## Documentation

### Primary

| Document                            | Description                                         |
| ----------------------------------- | --------------------------------------------------- |
| [product.md](docs/product.md)       | Complete D2D product documentation (v5.0)           |
| [pipeline.md](docs/pipeline.md)     | Design engine pipeline — technical deep dive (v5.0) |
| [code-stats.md](docs/code-stats.md) | Codebase statistics                                 |

### Version History

| Document                                                    | Description                       |
| ----------------------------------------------------------- | --------------------------------- |
| [architecture-v1-v3.md](docs/history/architecture-v1-v3.md) | Architecture overview (v1–v3 era) |
| [pipeline-v2.md](docs/history/pipeline-v2.md)               | Pipeline v2.0 specification       |
| [pipeline-v3.md](docs/history/pipeline-v3.md)               | Pipeline v3.0 specification       |
| [ux-v3.md](docs/history/ux-v3.md)                           | v3.0 UX and capability expansion  |
| [version-comparison.md](docs/history/version-comparison.md) | MVP → v2.0 → v3.0 evolution       |
| [mvp-history.md](docs/history/mvp-history.md)               | Original MVP product document     |

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing, and PR guidelines.

See [ROADMAP.md](ROADMAP.md) for planned features.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---
