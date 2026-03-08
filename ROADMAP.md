# Roadmap

This document outlines planned improvements for D2D. Priorities may shift based on community feedback.

## Near-Term

- [ ] **Image upload pipeline** — Accept uploaded wireframe images via computer vision (YOLO + OCR) as an alternative input path
- [ ] **Component library expansion** — Extend classified UI roles beyond the current 17 (e.g., tabs, modals, dropdowns, accordions)
- [ ] **Export format expansion** — Add Vue, Svelte, and plain HTML export targets alongside React + Tailwind
- [ ] **Accessibility audit** — Ensure generated code meets WCAG 2.1 AA standards (ARIA labels, focus management, contrast ratios)

## Mid-Term

- [ ] **Plugin system** — Allow community-contributed pipeline phases (custom classifiers, enhancers, stylist presets)
- [ ] **Collaborative editing** — Real-time multi-user canvas powered by Convex's real-time subscriptions
- [ ] **Design token import/export** — Import existing design systems (Figma tokens, Style Dictionary) and export D2D tokens
- [ ] **CLI tool** — Command-line interface for batch generation from saved project files

## Long-Term

- [ ] **AI-assisted enhancement** — Optional LLM pass for content suggestions (keeping the deterministic pipeline as the core)
- [ ] **Self-hosted option** — Docker-based deployment for teams that need on-premise hosting
- [ ] **Figma plugin** — Import Figma frames directly into the D2D canvas

## Completed

- [x] **v1.0 — MVP** — Canvas, projects, authentication, payments, style guide
- [x] **v2.0 — Deterministic Pipeline** — 7-phase generation engine, <100ms, ₹0 cost
- [x] **v3.0 — Context Layer** — Design brief, industry content, multi-variation generation, brand permeation
