"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ArrowDown,
  Check,
  X,
  Zap,
  Layers,
  Palette,
  Code2,
  Eye,
  Download,
  Shield,
  Timer,
  Boxes,
  Binary,
  Scan,
  GitBranch,
  Grid3X3,
  PenTool,
  Paintbrush,
  MonitorSmartphone,
  Sparkles,
} from "lucide-react";
import { FadeInOnScroll, GradientText } from "@/components/landing/animated";
import { Magnetic } from "@/components/landing/magnetic";
import { LiveCanvas } from "@/components/landing/live-canvas";
import { useState, useEffect } from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden page-enter">
      {/* ── Background ──────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-500/8 rounded-full blur-[180px] glow-pulse" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />
      </div>

      {/* ═════════════════════════════════════════════════════
           NAVIGATION
           ═════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/5">
              <Binary className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">D2D</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              How it works
            </Link>
            <Link
              href="#features"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:inline"
            >
              Pricing
            </Link>
            <Link
              href="/auth/sign-in"
              className="text-sm hover:opacity-60 transition-opacity"
            >
              Sign In
            </Link>
            <Magnetic strength={0.4}>
              <Link href="/auth/sign-up">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-white/90 rounded-full px-5 h-9 text-sm font-medium"
                >
                  Start Free
                </Button>
              </Link>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* ═════════════════════════════════════════════════════
           HERO
           ═════════════════════════════════════════════════════ */}
      <section className="min-h-screen relative flex items-center">
        {/* Left content */}
        <div className="w-full lg:w-1/2 px-8 lg:px-16 pt-32 pb-20 lg:py-0">
          <div className="max-w-xl">
            {/* Overline badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-8 animate-fade-in">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              The first deterministic UI compiler
            </div>

            <h1 className="animate-fade-in-delay-1">
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9]">
                Draw wireframes.
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.9] mt-2">
                <GradientText>Compile to React.</GradientText>
              </span>
            </h1>

            <p className="mt-8 text-lg text-gray-400 leading-relaxed max-w-md animate-fade-in-delay-2">
              D2D compiles hand-drawn wireframe sketches into production-ready
              React + Tailwind CSS components. Zero AI. Zero cost. Under 300ms.
              Same input, same output — every time.
            </p>

            {/* Key stats inline */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm animate-fade-in-delay-2">
              {[
                { value: "< 300ms", label: "compilation" },
                { value: "₹0", label: "per generation" },
                { value: "100%", label: "deterministic" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="text-gray-600">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-4 animate-fade-in-delay-3">
              <Magnetic strength={0.3}>
                <Link href="/auth/sign-up">
                  <div className="glow-border rounded-full">
                    <Button className="h-12 px-8 bg-black text-white hover:bg-black/90 rounded-full text-base font-medium relative z-10 border-0">
                      Start Compiling
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Link>
              </Magnetic>
              <span className="text-sm text-gray-600">
                Free forever — no credit card
              </span>
            </div>
          </div>
        </div>

        {/* Right side — Terminal pipeline animation */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[52%]">
          <div className="absolute inset-0 bg-gradient-to-l from-violet-500/5 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center px-12">
            <PipelineTerminal />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-8 lg:left-16 flex items-center gap-2 text-gray-600 text-sm animate-fade-in-delay-4">
          <ArrowDown className="h-4 w-4 animate-bounce" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════
           MARQUEE
           ═════════════════════════════════════════════════════ */}
      <section className="py-16 border-t border-gray-900 overflow-hidden">
        <div className="flex whitespace-nowrap animate-scroll">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-8 px-8 text-6xl md:text-7xl font-bold text-gray-900 tracking-tighter select-none"
            >
              <span>Draw</span>
              <span className="text-violet-500/60">→</span>
              <span>Compile</span>
              <span className="text-cyan-500/60">→</span>
              <span>Ship</span>
              <span className="text-emerald-500/60">•</span>
              <span className="text-gray-800">Zero AI</span>
              <span className="text-pink-500/60">•</span>
              <span className="text-gray-800">Zero Cost</span>
              <span className="text-violet-500/60">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════
           HOW IT WORKS — 3 Steps
           ═════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-20">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                How it works
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Three steps. That&apos;s it.
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                title: "Draw",
                description:
                  "Open the canvas. Draw a Frame. Sketch shapes inside it — rectangles become containers, small ones become buttons, wide ones become inputs. The pipeline reads geometry, not pixels.",
                icon: <PenTool className="h-5 w-5" />,
                color: "violet",
                visual: (
                  <div className="relative h-40 flex items-center justify-center">
                    {/* Frame illustration */}
                    <div className="w-52 h-32 border-2 border-dashed border-violet-500/30 rounded-lg relative">
                      <div className="absolute -top-2.5 left-3 px-1.5 py-0.5 bg-black text-[9px] text-violet-400 font-mono">
                        Frame 1
                      </div>
                      <div className="absolute top-3 left-3 right-3 h-6 rounded bg-white/5 border border-white/10" />
                      <div className="absolute top-12 left-3 w-20 h-2.5 rounded bg-white/10" />
                      <div className="absolute top-17 left-3 w-28 h-2 rounded bg-white/5" />
                      <div className="absolute bottom-3 left-3 w-14 h-6 rounded bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                        <span className="text-[8px] text-violet-400">
                          Button
                        </span>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                step: "02",
                title: "Style",
                description:
                  "Open the Style Guide. Pick colors, fonts, and a design preset. Tell D2D your brand name, industry, and page type. The pipeline builds a 100+ token design system from your choices.",
                icon: <Paintbrush className="h-5 w-5" />,
                color: "cyan",
                visual: (
                  <div className="relative h-40 flex items-center justify-center">
                    {/* Style guide cards */}
                    <div className="flex gap-2">
                      {[
                        {
                          label: "Primary",
                          color: "#6366f1",
                        },
                        {
                          label: "Accent",
                          color: "#06b6d4",
                        },
                        {
                          label: "Font",
                          color: null,
                          text: "Aa",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="w-16 rounded-lg border border-white/10 bg-white/[0.03] p-2 text-center"
                        >
                          {item.color ? (
                            <div
                              className="w-10 h-10 rounded-md mx-auto mb-1.5"
                              style={{ backgroundColor: item.color }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-md mx-auto mb-1.5 bg-white/5 flex items-center justify-center text-lg font-serif text-white/60">
                              {item.text}
                            </div>
                          )}
                          <span className="text-[8px] text-gray-500">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                step: "03",
                title: "Generate",
                description:
                  "Click Generate. The 6-phase pipeline compiles your wireframe into a complete React + Tailwind component in under 300ms. Preview it, switch between 3 style variations, export the code.",
                icon: <Code2 className="h-5 w-5" />,
                color: "emerald",
                visual: (
                  <div className="relative h-40 flex items-center justify-center">
                    {/* Code output preview */}
                    <div className="w-56 rounded-lg border border-white/10 bg-[#0a0a0a] overflow-hidden">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/5">
                        <div className="w-2 h-2 rounded-full bg-red-500/60" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                        <div className="w-2 h-2 rounded-full bg-green-500/60" />
                        <span className="text-[8px] text-gray-600 ml-2 font-mono">
                          GeneratedUI.tsx
                        </span>
                      </div>
                      <div className="p-2.5 font-mono text-[9px] leading-[1.6] text-gray-400">
                        <div>
                          <span className="text-purple-400">export default</span>{" "}
                          <span className="text-cyan-400">function</span>{" "}
                          <span className="text-yellow-300">UI</span>() {"{"}
                        </div>
                        <div className="pl-3">
                          <span className="text-purple-400">return</span> (
                        </div>
                        <div className="pl-5">
                          &lt;<span className="text-cyan-400">div</span>{" "}
                          <span className="text-emerald-400">className</span>=
                          <span className="text-orange-300">
                            &quot;min-h-screen...&quot;
                          </span>
                          &gt;
                        </div>
                        <div className="pl-7 text-gray-600">
                          {"// 200+ lines of production code"}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((item) => (
              <FadeInOnScroll key={item.step} delay={Number(item.step) * 0.1}>
                <div className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300">
                  {/* Step number */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl bg-${item.color}-500/10 text-${item.color}-400`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-mono text-gray-600">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Visual */}
                  {item.visual}
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>

      {/* ═════════════════════════════════════════════════════
           LIVE CANVAS DEMO
           ═════════════════════════════════════════════════════ */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInOnScroll>
              <div>
                <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                  Try it yourself
                </p>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-6">
                  See how it
                  <br />
                  <GradientText>feels to draw</GradientText>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
                  This is a tiny preview of the canvas. In the full app, you get
                  25+ shape tools, infinite pan &amp; zoom, frames, snap guides,
                  undo/redo, and auto-save.
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-violet-500" />
                    Click &amp; drag to draw
                  </div>
                  <span className="text-gray-800">•</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-500" />
                    Pick a color
                  </div>
                </div>
              </div>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.15}>
              <LiveCanvas />
            </FadeInOnScroll>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>

      {/* ═════════════════════════════════════════════════════
           PIPELINE VISUALIZATION
           ═════════════════════════════════════════════════════ */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Under the hood
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
  Purpose-built
  <br />
  <GradientText>compiler engineering.</GradientText>
</h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-6">
                19 TypeScript files. 6 compilation phases. Pure geometry analysis
                and template composition. Every CSS class is deterministically
                derived — no randomness, no network calls, no token costs.
              </p>
            </div>
          </FadeInOnScroll>

          {/* Pipeline phases */}
          <FadeInOnScroll delay={0.15}>
            <div className="mt-16 relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent hidden lg:block" />

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    phase: "1",
                    name: "Extract",
                    description: "Find shapes inside frame, normalize coordinates",
                    icon: <Scan className="h-4 w-4" />,
                    color: "violet",
                  },
                  {
                    phase: "2",
                    name: "Classify",
                    description: "Assign semantic UI roles — button, input, heading",
                    icon: <Layers className="h-4 w-4" />,
                    color: "indigo",
                  },
                  {
                    phase: "3",
                    name: "Architect",
                    description:
                      "Build hierarchy tree with layout detection",
                    icon: <GitBranch className="h-4 w-4" />,
                    color: "blue",
                  },
                  {
                    phase: "4",
                    name: "Identity",
                    description:
                      "Build 100+ token design system from your style guide",
                    icon: <Palette className="h-4 w-4" />,
                    color: "cyan",
                  },
                  {
                    phase: "5",
                    name: "Sections",
                    description:
                      "Detect page sections — nav, hero, features, footer",
                    icon: <Grid3X3 className="h-4 w-4" />,
                    color: "teal",
                  },
                  {
                    phase: "6",
                    name: "Build",
                    description:
                      "Assemble final React + Tailwind component code",
                    icon: <Code2 className="h-4 w-4" />,
                    color: "emerald",
                  },
                ].map((item, i) => (
                  <div
                    key={item.phase}
                    className="relative group"
                    style={{
                      animationDelay: `${i * 100}ms`,
                    }}
                  >
                    <div className="relative z-10 rounded-xl border border-white/5 bg-white/[0.02] p-4 hover:border-white/10 hover:bg-white/[0.04] transition-all text-center">
                      {/* Phase dot */}
                      <div
                        className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-${item.color}-500/10 text-${item.color}-400 group-hover:bg-${item.color}-500/20 transition-colors`}
                      >
                        {item.icon}
                      </div>

                      <div className="text-[10px] font-mono text-gray-600 mb-1">
                        Phase {item.phase}
                      </div>
                      <h4 className="text-sm font-semibold mb-1.5">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm">
                {[
                  { value: "19", label: "TypeScript files" },
                  { value: "6", label: "compilation phases" },
                  { value: "13", label: "enhancement rules" },
                  { value: "100+", label: "design tokens" },
                  { value: "30+", label: "component templates" },
                  { value: "0", label: "API calls" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center gap-2 text-gray-500"
                  >
                    <span className="font-mono font-bold text-white text-lg">
                      {stat.value}
                    </span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Divider */}
            {/* ═════════════════════════════════════════════════════
           ENGINEERING DEPTH
           ═════════════════════════════════════════════════════ */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Engineering
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
                Purpose-built
                <br />
                <GradientText>compiler engineering.</GradientText>
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto mt-6">
                D2D isn&apos;t a prompt wrapper. It&apos;s a multi-phase compiler
                built on novel algorithms and purpose-built data structures —
                every one hand-written, every one tested.
              </p>
            </div>
          </FadeInOnScroll>

          {/* ── Novel Algorithms ──────────────────────────── */}
          <FadeInOnScroll delay={0.1}>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
                <h3 className="text-sm font-mono text-violet-400 tracking-widest uppercase shrink-0">
                  Novel Algorithms
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "Gaussian Decay Alignment",
                    description:
                      "Measures spatial alignment between hand-drawn shapes using Gaussian falloff (σ=10px). Tolerates imprecise drawing while detecting true alignment cliques.",
                    formula: "strength = e^(−δ² / 2σ²)",
                    complexity: "O(n²) pairwise",
                    phase: "Phase 2.5",
                  },
                  {
                    name: "CV-Based Grid Detection",
                    description:
                      "Identifies CSS Grid patterns from imprecise layouts using Coefficient of Variation thresholds (CV ≤ 0.30 width, ≤ 0.35 gaps) to validate grid consistency.",
                    formula: "CV = σ / μ",
                    complexity: "O(n log n)",
                    phase: "Phase 2.75",
                  },
                  {
                    name: "Containment Ratio Hierarchy",
                    description:
                      "Builds parent-child trees from flat shape lists using intersection-area-over-child-area ratios. 70% threshold with smallest-parent selection.",
                    formula: "ratio = A∩ / A_child ≥ 0.70",
                    complexity: "O(n²)",
                    phase: "Phase 3",
                  },
                  {
                    name: "13-Rule Enhancement Engine",
                    description:
                      "Applies 13 sequential pattern-detection rules in 3 categories (structural → pattern → spacing) to upgrade the tree with design intelligence.",
                    formula: "structural → pattern → spacing",
                    complexity: "O(n) per rule",
                    phase: "Phase 3.5",
                  },
                  {
                    name: "9-Detector Section Engine",
                    description:
                      "Priority-ordered detectors consume nodes greedily: nav → footer → hero → form → features → stats → content-split → card-grid → CTA → generic.",
                    formula: "9 detectors, priority queue",
                    complexity: "O(n × d)",
                    phase: "Phase 5",
                  },
                  {
                    name: "Recipe-Wireframe Merger",
                    description:
                      "Fuzzy type-matching (TYPE_MATCH_MAP) merges wireframe sections onto recipe skeletons. Order inference via ORDER_HINTS with collision avoidance.",
                    formula: "wireframe overrides recipe",
                    complexity: "O(r × w)",
                    phase: "v5.0",
                  },
                  {
                    name: "Deterministic Content Pick",
                    description:
                      "Selects placeholder content using hash-based indexing from stable node IDs. Zero Math.random() — guarantees identical output across runs.",
                    formula: "hash(nodeId) % arr.length",
                    complexity: "O(1)",
                    phase: "Phase 6",
                  },
                ].map((algo) => (
                  <div
                    key={algo.name}
                    className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-violet-500/20 hover:bg-violet-500/[0.02] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {algo.name}
                      </h4>
                      <span className="text-[9px] font-mono text-gray-600 bg-white/5 px-1.5 py-0.5 rounded shrink-0 ml-2">
                        {algo.phase}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {algo.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <code className="text-[10px] font-mono text-violet-400/80 bg-violet-500/5 px-2 py-0.5 rounded">
                        {algo.formula}
                      </code>
                      <span className="text-[10px] font-mono text-gray-600">
                        {algo.complexity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          {/* ── Data Structures ───────────────────────────── */}
          <FadeInOnScroll delay={0.15}>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
                <h3 className="text-sm font-mono text-cyan-400 tracking-widest uppercase shrink-0">
                  Purpose-Built Data Structures
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    name: "SpatialConstraintGraph",
                    fields: "nodes[] · edges[] · topAlignedCliques[] · leftAlignedCliques[]",
                    purpose: "O(n²) pairwise relationship graph with Gaussian-weighted edges and alignment clique detection for grid discovery",
                  },
                  {
                    name: "UINode",
                    fields: "children[] · layout · gaps[] · enhancementHints[] · properties{}",
                    purpose: "Recursive hierarchy tree with layout direction, per-child gap arrays, and enhancement metadata — the compiler's AST",
                  },
                  {
                    name: "DetectedGrid",
                    fields: "rows · cols · rowGap · colGap · assignment[][] · confidence",
                    purpose: "Row-major assignment matrix mapping element IDs to grid cells with confidence scoring from alignment strength × gap consistency",
                  },
                  {
                    name: "DesignIdentity",
                    fields: "colors(18) · typography(14) · spacing(12) · elevation(7) · components · sections · content",
                    purpose: "100+ token design system object built from user preferences — every CSS class in the output derives from this single structure",
                  },
                  {
                    name: "MergedSection",
                    fields: "type · source · detected? · recipeConfig? · bg · order",
                    purpose: "Dual-source section representation that tracks whether each page section comes from the wireframe or recipe, enabling seamless override semantics",
                  },
                  {
                    name: "ColorPalette",
                    fields: "base · hover · light · lighter · dark · glow · ring · contrast",
                    purpose: "8-variant color system generated from a single hex via HSL manipulation with WCAG-compliant contrast computation",
                  },
                ].map((ds) => (
                  <div
                    key={ds.name}
                    className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 hover:border-cyan-500/20 hover:bg-cyan-500/[0.02] transition-all"
                  >
                    <h4 className="text-sm font-semibold text-cyan-400 font-mono mb-1">
                      {ds.name}
                    </h4>
                    <p className="text-[10px] font-mono text-gray-600 mb-3">
                      {ds.fields}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {ds.purpose}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          {/* ── Complexity & Stats ────────────────────────── */}
          <FadeInOnScroll delay={0.2}>
            <div className="mt-20">
              <div className="flex items-center gap-3 mb-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <h3 className="text-sm font-mono text-emerald-400 tracking-widest uppercase shrink-0">
                  By the Numbers
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { value: "55+", label: "Test Cases", sub: "determinism verified" },
                  { value: "7", label: "Novel Algorithms", sub: "purpose-built" },
                  { value: "6", label: "Data Structures", sub: "custom-designed" },
                  { value: "O(n²)", label: "Time Complexity", sub: "spatial graph dominated" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center hover:border-emerald-500/20 transition-colors"
                  >
                    <div className="text-2xl font-bold font-mono text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-gray-300 mb-0.5">
                      {stat.label}
                    </div>
                    <div className="text-[10px] text-gray-600">{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Open source banner */}
              <div className="mt-10 rounded-xl border border-white/5 bg-gradient-to-r from-violet-500/[0.03] to-cyan-500/[0.03] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                    <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Open Source · MIT License
                    </p>
                    <p className="text-xs text-gray-500">
                      Read the code, learn from it, contribute to it. Every algorithm is documented.
                    </p>
                  </div>
                </div>
                <Magnetic strength={0.3}>
                  <Link
                    href="https://github.com/mevirajsheoran/d2d-compiler"
                    target="_blank"
                    className="inline-block"
                  >
                    <Button
                      size="sm"
                      className="bg-white/10 text-white hover:bg-white/15 rounded-full px-5 border border-white/10 gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View on GitHub
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>
      

      {/* ═════════════════════════════════════════════════════
           FEATURES
           ═════════════════════════════════════════════════════ */}
      <section id="features" className="py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <FadeInOnScroll>
            <div className="max-w-2xl mb-24">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Everything built in
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                No plugins.
                <br />
                <span className="text-gray-600">No extensions. Just works.</span>
              </h2>
            </div>
          </FadeInOnScroll>

          <div className="space-y-0">
            {[
              {
                number: "01",
                title: "25+ Shape Tools",
                description:
                  "Rectangles, circles, text, buttons, inputs, checkboxes, image placeholders, dividers, device frames, sticky notes — every shape maps to a UI component.",
                icon: <PenTool className="h-5 w-5" />,
              },
              {
                number: "02",
                title: "6 Design Presets",
                description:
                  "Startup Modern, Corporate Clean, Bold Creative, Minimal Elegant, Dashboard Dense, Glass & Gradient — each generates a completely different design system with 100+ tokens.",
                icon: <Palette className="h-5 w-5" />,
              },
              {
                number: "03",
                title: "3 Instant Variations",
                description:
                  "Every generation produces 3 visually contrasting variations in parallel. Same wireframe, different design identity. All three in under 300ms combined.",
                icon: <Boxes className="h-5 w-5" />,
              },
              {
                number: "04",
                title: "Recipe System",
                description:
                  "Specify a page type and industry — get a complete professional page without drawing anything. 8 page types × 10 industries = 80 recipe combinations, each with rich content.",
                icon: <Sparkles className="h-5 w-5" />,
              },
              {
                number: "05",
                title: "Responsive Preview",
                description:
                  "Toggle between Desktop, Tablet, and Mobile views instantly. The generated code uses responsive Tailwind breakpoints — it works on every screen size.",
                icon: <MonitorSmartphone className="h-5 w-5" />,
              },
              {
                number: "06",
                title: "Export Anything",
                description:
                  "Copy the React component to your clipboard, download as a standalone HTML file with Tailwind CDN, or download the .tsx component file ready for your project.",
                icon: <Download className="h-5 w-5" />,
              },
            ].map((feature) => (
              <FadeInOnScroll key={feature.number}>
                <div className="group border-t border-gray-800 py-8 md:py-12 grid md:grid-cols-12 gap-6 items-start hover:bg-white/[0.015] transition-colors px-4 -mx-4 rounded-lg">
                  <div className="md:col-span-1 text-sm text-gray-600 font-mono">
                    {feature.number}
                  </div>
                  <div className="md:col-span-4 flex items-center gap-3">
                    <div className="text-gray-500 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl md:text-2xl font-medium group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="text-gray-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>

      {/* ═════════════════════════════════════════════════════
           COMPARISON TABLE
           ═════════════════════════════════════════════════════ */}
      <section className="py-32 px-8">
        <div className="max-w-[1400px] mx-auto">
          <FadeInOnScroll>
            <div className="text-center mb-16">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Comparison
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                Why D2D?
              </h2>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.1}>
            <div className="overflow-x-auto">
              <table className="w-full max-w-4xl mx-auto text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 pr-4 text-gray-500 font-normal w-1/5">
                      Capability
                    </th>
                    <th className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <Binary className="h-3 w-3 text-violet-400" />
                        <span className="font-semibold text-violet-400">
                          D2D
                        </span>
                      </div>
                    </th>
                    <th className="py-4 px-4 text-center text-gray-400 font-medium">
                      Figma
                    </th>
                    <th className="py-4 px-4 text-center text-gray-400 font-medium">
                      ChatGPT
                    </th>
                    <th className="py-4 px-4 text-center text-gray-400 font-medium">
                      v0.dev
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Output",
                      d2d: "React + Tailwind",
                      figma: "Images only",
                      chatgpt: "Code (varies)",
                      v0: "React + Tailwind",
                    },
                    {
                      feature: "From drawings",
                      d2d: true,
                      figma: false,
                      chatgpt: false,
                      v0: false,
                    },
                    {
                      feature: "Speed",
                      d2d: "< 300ms",
                      figma: "N/A",
                      chatgpt: "10-30s",
                      v0: "5-15s",
                    },
                    {
                      feature: "Cost per generation",
                      d2d: "₹0",
                      figma: "N/A",
                      chatgpt: "~₹2-5",
                      v0: "~₹3-8",
                    },
                    {
                      feature: "Deterministic",
                      d2d: true,
                      figma: "N/A",
                      chatgpt: false,
                      v0: false,
                    },
                    {
                      feature: "Works offline",
                      d2d: true,
                      figma: false,
                      chatgpt: false,
                      v0: false,
                    },
                    {
                      feature: "Privacy",
                      d2d: "Browser only",
                      figma: "Cloud",
                      chatgpt: "Sent to API",
                      v0: "Sent to API",
                    },
                    {
                      feature: "Design system",
                      d2d: "100+ tokens",
                      figma: "Manual",
                      chatgpt: "Inconsistent",
                      v0: "Limited",
                    },
                  ].map((row) => (
                    <tr
                      key={row.feature}
                      className="border-b border-gray-800/50"
                    >
                      <td className="py-3.5 pr-4 text-gray-400">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {typeof row.d2d === "boolean" ? (
                          row.d2d ? (
                            <Check className="h-4 w-4 text-emerald-400 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-400/60 mx-auto" />
                          )
                        ) : (
                          <span className="text-white font-medium">
                            {row.d2d}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-500">
                        {typeof row.figma === "boolean" ? (
                          row.figma ? (
                            <Check className="h-4 w-4 text-emerald-400/60 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-400/40 mx-auto" />
                          )
                        ) : (
                          row.figma
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-500">
                        {typeof row.chatgpt === "boolean" ? (
                          row.chatgpt ? (
                            <Check className="h-4 w-4 text-emerald-400/60 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-400/40 mx-auto" />
                          )
                        ) : (
                          row.chatgpt
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center text-gray-500">
                        {typeof row.v0 === "boolean" ? (
                          row.v0 ? (
                            <Check className="h-4 w-4 text-emerald-400/60 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-400/40 mx-auto" />
                          )
                        ) : (
                          row.v0
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="line-glow" />
      </div>

      {/* ═════════════════════════════════════════════════════
           PRICING
           ═════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <FadeInOnScroll>
            <div className="max-w-2xl mb-20">
              <p className="text-sm text-gray-500 mb-4 tracking-widest uppercase">
                Pricing
              </p>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                Free to start.
                <br />
                <span className="text-gray-600">
                  Free to generate. Forever.
                </span>
              </h2>
              <p className="mt-6 text-gray-500 text-lg">
                Because the pipeline runs in your browser, there are no API
                costs. Generations are unlimited on every plan.
              </p>
            </div>
          </FadeInOnScroll>

          <FadeInOnScroll>
            <div className="border-t border-gray-800">
              <PricingRow
                name="Free"
                price="₹0"
                period="forever"
                features={[
                  "Unlimited generations",
                  "3 projects",
                  "All 25+ shape tools",
                  "All 6 design presets",
                  "Export code & HTML",
                  "Auto-save",
                ]}
                buttonText="Start Free"
                buttonLink="/auth/sign-up"
              />

              <PricingRow
                name="Pro"
                price="₹499"
                period="/month"
                features={[
                  "Unlimited generations",
                  "Unlimited projects",
                  "Recipe system (80 combos)",
                  "Priority support",
                  "Moodboard uploads",
                  "Team sharing (soon)",
                ]}
                highlighted
                buttonText="Upgrade to Pro"
                buttonLink="/auth/sign-up"
              />

              <PricingRow
                name="Pro Yearly"
                price="₹4,999"
                period="/year"
                features={[
                  "Everything in Pro",
                  "Save 17%",
                  "Annual billing",
                  "Priority roadmap input",
                ]}
                badge="Save 17%"
                buttonText="Get Annual"
                buttonLink="/auth/sign-up"
              />
            </div>
          </FadeInOnScroll>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════
           FINAL CTA
           ═════════════════════════════════════════════════════ */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-500/5 via-transparent to-transparent" />

        <FadeInOnScroll>
          <div className="relative max-w-[1400px] mx-auto px-8 text-center">
            {/* Terminal output */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 mb-10 font-mono">
              <span className="text-emerald-400">✓</span>
              <span>
                Output: <span className="text-white">GeneratedUI.tsx</span> ·
                Time: <span className="text-white">142ms</span> · Cost:{" "}
                <span className="text-emerald-400">₹0</span>
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
              Ready to compile?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-lg mx-auto">
              Your next production UI is one sketch away. Draw it, compile it,
              ship it.
            </p>

            <Magnetic strength={0.3}>
              <Link href="/auth/sign-up" className="inline-block">
                <div className="glow-border rounded-full">
                  <Button className="h-14 px-10 bg-black text-white hover:bg-black/90 rounded-full text-lg font-medium relative z-10 border-0">
                    Start Compiling — Free
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </Link>
            </Magnetic>

            <p className="mt-6 text-sm text-gray-600">
              No credit card · Unlimited generations · Works in your browser
            </p>
          </div>
        </FadeInOnScroll>
      </section>

      {/* ═════════════════════════════════════════════════════
           FOOTER
           ═════════════════════════════════════════════════════ */}
            {/* ═════════════════════════════════════════════════════
           FOOTER
           ═════════════════════════════════════════════════════ */}
      <footer className="py-12 px-8 border-t border-gray-900">
        <div className="max-w-[1400px] mx-auto">
          {/* Top row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Binary className="h-5 w-5 text-violet-400" />
                <span className="text-lg font-bold">D2D</span>
                <span className="text-[10px] font-mono text-gray-700 bg-white/5 px-1.5 py-0.5 rounded">
                  v5.0
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                The first deterministic UI compiler. Draw wireframes, compile to
                production React + Tailwind CSS.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Link
                  href="https://github.com/mevirajsheoran/d2d-compiler"
                  target="_blank"
                  className="text-gray-600 hover:text-white transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Product
              </h4>
              <div className="space-y-2.5">
                {[
                  { label: "Canvas", href: "#how-it-works" },
                  { label: "Style Guide", href: "#how-it-works" },
                  { label: "Pipeline", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-gray-600 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Engineering */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Engineering
              </h4>
              <div className="space-y-2.5">
                <Link
                  href="https://github.com/mevirajsheoran/d2d-compiler"
                  target="_blank"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  GitHub
                </Link>
                <Link
                  href="https://github.com/mevirajsheoran/d2d-compiler#contributing"
                  target="_blank"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Contribute
                </Link>
                <Link
                  href="https://github.com/mevirajsheoran/d2d-compiler/blob/main/ROADMAP.md"
                  target="_blank"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Roadmap
                </Link>
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  MIT License
                </span>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Company
              </h4>
              <div className="space-y-2.5">
                <Link
                  href="/about"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/terms"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="/privacy"
                  className="block text-sm text-gray-600 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-700">
              © {new Date().getFullYear()} D2D — Deterministic Design Compiler.
              Built by{" "}
              <Link
                href="https://github.com/mevirajsheoran"
                target="_blank"
                className="text-gray-500 hover:text-white transition-colors"
              >
                Viraj Sheoran
              </Link>
            </span>
          
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PIPELINE TERMINAL — Hero right side animated component
   ════════════════════════════════════════════════════════════ */

function PipelineTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  const lines = [
    { text: "$ d2d compile --frame \"Desktop\"", type: "command" as const },
    { text: "", type: "blank" as const },
    {
      text: "[1/6] Extracting shapes...      ✓ 14 shapes found",
      type: "step" as const,
    },
    {
      text: "[2/6] Classifying roles...       ✓ nav, hero, features, footer",
      type: "step" as const,
    },
    {
      text: "[3/6] Building hierarchy...      ✓ 4 levels deep",
      type: "step" as const,
    },
    {
      text: "[4/6] Applying design system...  ✓ startup-modern (100+ tokens)",
      type: "step" as const,
    },
    {
      text: "[5/6] Detecting sections...      ✓ 6 sections mapped",
      type: "step" as const,
    },
    {
      text: "[6/6] Generating React code...   ✓ 312 lines",
      type: "step" as const,
    },
    { text: "", type: "blank" as const },
    {
      text: "Output:  GeneratedUI.tsx",
      type: "result" as const,
    },
    {
      text: "Format:  React + Tailwind CSS",
      type: "result" as const,
    },
    { text: "Time:    142ms", type: "result" as const },
    { text: "Cost:    ₹0", type: "success" as const },
    { text: "", type: "blank" as const },
    {
      text: "✓ 3 variations ready. Open preview →",
      type: "success" as const,
    },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    lines.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setVisibleLines(i + 1),
          800 + i * 200
        )
      );
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-lg rounded-2xl border border-white/5 bg-[#060606] overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-[11px] text-gray-500 ml-3 font-mono">
          d2d — pipeline output
        </span>
      </div>

      {/* Terminal body */}
      <div className="p-5 font-mono text-[12px] leading-[1.8] min-h-[340px]">
        {lines.slice(0, visibleLines).map((line, i) => {
          if (line.type === "blank") {
            return <div key={i} className="h-[1.8em]" />;
          }

          let colorClass = "text-gray-400";
          if (line.type === "command") colorClass = "text-white";
          if (line.type === "step") colorClass = "text-gray-400";
          if (line.type === "result") colorClass = "text-gray-300";
          if (line.type === "success") colorClass = "text-emerald-400";

          return (
            <div
              key={i}
              className={`${colorClass} transition-all duration-300`}
              style={{
                opacity: 0,
                animation: `d2dFadeUp 0.3s ease-out ${i * 0.05}s forwards`,
              }}
            >
              {line.type === "step" && (
                <span className="text-violet-400">
                  {line.text.split("✓")[0]}
                </span>
              )}
              {line.type === "step" && (
                <span className="text-emerald-400">
                  ✓{line.text.split("✓")[1]}
                </span>
              )}
              {line.type !== "step" && line.text}
              {i === visibleLines - 1 && (
                <span className="inline-block w-2 h-4 bg-white/60 ml-0.5 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   PRICING ROW
   ════════════════════════════════════════════════════════════ */

function PricingRow({
  name,
  price,
  period,
  features,
  highlighted = false,
  badge,
  buttonText,
  buttonLink,
}: {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  buttonText?: string;
  buttonLink?: string;
}) {
  return (
    <div
      className={`border-b border-gray-800 py-8 grid md:grid-cols-12 gap-6 items-center ${
        highlighted ? "bg-white/[0.02]" : ""
      } px-4 -mx-4 rounded-lg`}
    >
      <div className="md:col-span-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium">{name}</span>
          {badge && (
            <Badge className="text-[10px] py-0 px-2 bg-violet-500 text-white border-0">
              {badge}
            </Badge>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <span className="text-2xl font-bold">{price}</span>
        <span className="text-sm text-gray-500 ml-1">{period}</span>
      </div>

      <div className="md:col-span-5">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
          {features.map((f, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 text-emerald-400" />
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 flex md:justify-end">
        {buttonLink && (
          <Magnetic strength={0.3}>
            <Link href={buttonLink}>
              <Button
                size="sm"
                className={`rounded-full px-6 ${
                  highlighted
                    ? "bg-white text-black hover:bg-white/90"
                    : "bg-white/10 text-white hover:bg-white/15 border border-white/10"
                }`}
              >
                {buttonText}
                <ArrowRight className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </Magnetic>
        )}
      </div>
    </div>
  );
}