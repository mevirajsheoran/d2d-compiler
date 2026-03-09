import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Binary,
  GitBranch,
  Users,
  Zap,
  Shield,
  Globe,
  BookOpen,
  Check,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-500/8 rounded-full blur-[150px]" />
      </div>

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav className="relative z-10 border-b border-gray-900">
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Binary className="h-4 w-4 text-violet-400" />
            <span className="font-bold">D2D</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </Link>
        </div>
      </nav>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="relative z-10 max-w-4xl mx-auto px-8 py-20">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm text-violet-400 font-mono mb-4">
            /about
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            About D2D
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
            D2D (Draw to Design) is the first deterministic UI compiler — a
            browser-based tool that transforms hand-drawn wireframe sketches
            into production-ready React + Tailwind CSS components in under
            300ms, with zero AI calls and zero cost.
          </p>
        </div>

        {/* ── The Problem ────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-400" />
            The Problem
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              The gap between &ldquo;what I imagine&rdquo; and &ldquo;working
              code&rdquo; has always been vast. Design tools like Figma produce
              images, not code. AI code generators like ChatGPT are
              non-deterministic, expensive, and slow. Component libraries like
              shadcn require manual assembly.
            </p>
            <p>
              None of these let you{" "}
              <em className="text-white not-italic font-medium">
                draw what you want and get code that works
              </em>
              . D2D does.
            </p>
          </div>
        </section>

        {/* ── The Approach ───────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <GitBranch className="h-5 w-5 text-cyan-400" />
            The Approach: Compilation, Not Generation
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              D2D treats UI wireframes the way a compiler treats source code.
              The 6-phase pipeline —{" "}
              <span className="text-gray-300">
                Extract → Classify → Architect → Identity → Sections → Build
              </span>{" "}
              — is deterministic: same input produces exactly the same output,
              every time. No randomness. No network calls. No token costs.
            </p>
            <p>
              The pipeline uses novel algorithms built specifically for this
              problem: Gaussian decay alignment scoring for hand-drawn shape
              tolerance, coefficient-of-variation grid detection, containment
              ratio hierarchy building, and a 13-rule enhancement engine that
              recognizes common UI patterns.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { value: "55+", label: "Test Cases" },
              { value: "7", label: "Novel Algorithms" },
              { value: "< 300ms", label: "Compilation Time" },
              { value: "₹0", label: "Cost Per Generation" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center"
              >
                <div className="text-xl font-bold font-mono text-white">
                  {stat.value}
                </div>
                <div className="text-[11px] text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Key Differentiators ─────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Shield className="h-5 w-5 text-emerald-400" />
            Key Differentiators
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Zero AI, Zero Cost",
                description:
                  "The entire pipeline is deterministic — pure geometry analysis + template composition. No LLM calls, no API costs, no latency. Every generation is free, forever.",
              },
              {
                title: "Deterministic Guarantee",
                description:
                  "Same input always produces exactly the same output. No randomness, no variability between runs. This is verified by automated determinism tests across the entire test suite.",
              },
              {
                title: "Browser-Native",
                description:
                  "Everything runs client-side in under 300ms. No server round-trips for code generation. Your wireframes never leave your browser — complete privacy by architecture.",
              },
              {
                title: "Professional Output",
                description:
                  "25-40 Tailwind classes per element, hover/focus/active states, responsive breakpoints, SVG icons, gradient backgrounds — comparable to v0.dev output quality.",
              },
              {
                title: "Recipe System",
                description:
                  "Even without drawing anything, specify a page type + industry and get a complete professional page. 8 page types × 10 industries = 80 recipe combinations with rich, contextual content.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-3 p-4 rounded-lg border border-white/5 bg-white/[0.01]"
              >
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Open Source ─────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Globe className="h-5 w-5 text-violet-400" />
            Open Source
          </h2>
          <div className="text-gray-400 leading-relaxed space-y-4">
            <p>
              D2D is fully open source under the{" "}
              <span className="text-white font-medium">MIT License</span>. The
              entire codebase — every algorithm, every data structure, every
              test — is available on GitHub. We believe that tools this
              fundamental should be transparent, auditable, and community-owned.
            </p>
            <p>
              We welcome contributions of all kinds: bug reports, documentation
              improvements, new pipeline phases, additional industry content,
              preset creators, and test coverage.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="https://github.com/mevirajsheoran/d2d-compiler"
              target="_blank"
            >
              <Button
                size="sm"
                className="bg-white/10 text-white hover:bg-white/15 rounded-full px-5 border border-white/10 gap-2"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View on GitHub
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
            <Link
              href="https://github.com/mevirajsheoran/d2d-compiler#contributing"
              target="_blank"
            >
              <Button
                variant="outline"
                size="sm"
                className="rounded-full px-5 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 gap-2"
              >
                <Users className="h-4 w-4" />
                Contributing Guide
              </Button>
            </Link>
          </div>
        </section>

        {/* ── Roadmap ─────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            Roadmap
          </h2>

          {/* Completed */}
          <div className="mb-8">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4">
              ✓ Completed
            </h3>
            <div className="space-y-2">
              {[
                "v1.0 — MVP: Canvas, projects, authentication, payments, style guide",
                "v2.0 — Deterministic Pipeline: 7-phase generation engine, <100ms, ₹0 cost",
                "v3.0 — Context Layer: Design brief, industry content, multi-variation generation",
                "v4.0 — Spatial Intelligence: CSS Grid detection, alignment graph, extended gaps",
                "v5.0 — Recipe System: 8 page types × 10 industries, recipe-wireframe merger",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Near-term */}
          <div className="mb-8">
            <h3 className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-4">
              Near-Term
            </h3>
            <div className="space-y-2">
              {[
                "Image upload pipeline — Accept wireframe images via computer vision as alternative input",
                "Component library expansion — Tabs, modals, dropdowns, accordions beyond current 17 roles",
                "Export format expansion — Vue, Svelte, and plain HTML export targets",
                "Accessibility audit — WCAG 2.1 AA: ARIA labels, focus management, contrast ratios",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="h-3.5 w-3.5 rounded-full border border-gray-700 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-500">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mid-term */}
          <div className="mb-8">
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">
              Mid-Term
            </h3>
            <div className="space-y-2">
              {[
                "Plugin system — Community-contributed pipeline phases, classifiers, and presets",
                "Collaborative editing — Real-time multi-user canvas via Convex subscriptions",
                "Design token import/export — Figma tokens, Style Dictionary compatibility",
                "CLI tool — Command-line batch generation from saved project files",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="h-3.5 w-3.5 rounded-full border border-gray-700 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-500">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Long-term */}
          <div>
            <h3 className="text-xs font-mono text-gray-600 uppercase tracking-widest mb-4">
              Long-Term
            </h3>
            <div className="space-y-2">
              {[
                "AI-assisted enhancement — Optional LLM pass for content (deterministic core preserved)",
                "Self-hosted option — Docker deployment for on-premise teams",
                "Figma plugin — Import Figma frames directly into D2D canvas",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <div className="h-3.5 w-3.5 rounded-full border border-gray-800 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Creator ─────────────────────────────────────── */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-6">Built by</h2>
          <div className="flex items-center gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-lg font-bold">
              V
            </div>
            <div>
              <p className="font-semibold text-white">Viraj Sheoran</p>
              <p className="text-sm text-gray-500">
                Full-stack engineer. Building tools for builders.
              </p>
              <Link
                href="https://github.com/mevirajsheoran"
                target="_blank"
                className="text-xs text-violet-400 hover:text-violet-300 transition-colors mt-1 inline-block"
              >
                @mevirajsheoran on GitHub →
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────── */}
        <section className="text-center py-12 border-t border-gray-900">
          <h2 className="text-3xl font-bold mb-4">Ready to compile?</h2>
          <p className="text-gray-500 mb-8">
            Draw your first wireframe. Get production code in under 300ms.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button className="bg-white text-black hover:bg-white/90 rounded-full px-6 h-10 font-medium gap-2">
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://github.com/mevirajsheoran/d2d-compiler"
              target="_blank"
            >
              <Button
                variant="outline"
                className="rounded-full px-6 h-10 border-gray-800 text-gray-400 hover:text-white gap-2"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                View Source
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}