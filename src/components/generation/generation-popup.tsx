"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Copy,
  Download,
  Code2,
  Check,
  ChevronDown,
  Eye,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface GenerationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  presetName: string;
  onPresetChange: (preset: string) => void;
  isRegenerating?: boolean;
}

type ViewportSize = "desktop" | "tablet" | "mobile";
type Phase =
  | "entering"    // popup slides in (500ms)
  | "building"    // loading animation (1.6s)
  | "revealing"   // code curtain + preview appear (2.5s)
  | "transitioning" // wipe line sweeps across (1s)
  | "complete";   // full preview, code togglable

const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const PRESETS = [
  { name: "startup-modern", label: "Startup Modern" },
  { name: "corporate-clean", label: "Corporate Clean" },
  { name: "bold-creative", label: "Bold Creative" },
  { name: "minimal-elegant", label: "Minimal Elegant" },
  { name: "dashboard-dense", label: "Dashboard Dense" },
  { name: "glass-gradient", label: "Glass & Gradient" },
];

const BUILDING_STAGES = [
  "Analyzing layout structure",
  "Composing components",
  "Applying design tokens",
  "Rendering preview",
];

// ═══════════════════════════════════════════════════════════
// JSX → HTML CONVERTER (unchanged from your original)
// ═══════════════════════════════════════════════════════════

function buildPreviewHtml(jsxCode: string): string {
  let html = jsxCode;

  html = html.replace(
    /export\s+default\s+function\s+\w+\s*\(\s*\)\s*\{\s*return\s*\(\s*/,
    ""
  );
  html = html.replace(/\s*\);\s*\}\s*$/, "");

  html = html.replace(/className="/g, 'class="');
  html = html.replace(/className={/g, "class={");

  html = html.replace(
    /style=\{\{([^}]*)\}\}/g,
    (_match: string, styles: string) => {
      const cssString = styles
        .replace(/(\w+):/g, (_m: string, prop: string) => {
          return prop.replace(/([A-Z])/g, "-$1").toLowerCase() + ":";
        })
        .replace(/,\s*/g, "; ")
        .replace(/"/g, "")
        .replace(/'/g, "")
        .trim();
      return `style="${cssString}"`;
    }
  );

  html = html.replace(/strokeWidth=/g, "stroke-width=");
  html = html.replace(/strokeLinecap=/g, "stroke-linecap=");
  html = html.replace(/strokeLinejoin=/g, "stroke-linejoin=");
  html = html.replace(/fillRule=/g, "fill-rule=");
  html = html.replace(/clipRule=/g, "clip-rule=");
  html = html.replace(/viewBox=/g, "viewBox=");
  html = html.replace(/<(input|img|br|hr)([^>]*)\s*\/>/g, "<$1$2>");
  html = html.replace(/defaultChecked/g, "checked");
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  const fontFamilies = new Set<string>();
  const fontMatches = html.match(/font-\['([^']+)'\]/g);
  if (fontMatches) {
    for (const match of fontMatches) {
      const family = match
        .replace("font-['", "")
        .replace("']", "")
        .replace(/_/g, " ");
      if (family !== "Inter") fontFamilies.add(family);
    }
  }
  fontFamilies.add("Inter");

  const fontLinks = Array.from(fontFamilies)
    .map(
      (f) =>
        `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(
          f
        )}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`
    )
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"><\/script>
    ${fontLinks}
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      body { margin: 0; font-family: 'Inter', system-ui, sans-serif; }
      @keyframes revealSection {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      section, nav, footer, main {
        animation: revealSection 0.5s ease-out both;
      }
      details summary::-webkit-details-marker { display: none; }
      details summary { list-style: none; }
    </style>
  </head>
  <body>
    ${html}
  </body>
</html>`;
}

// ═══════════════════════════════════════════════════════════
// MAIN POPUP COMPONENT
// ═══════════════════════════════════════════════════════════

export default function GenerationPopup({
  isOpen,
  onClose,
  code,
  presetName,
  onPresetChange,
  isRegenerating = false,
}: GenerationPopupProps) {
  // ── State ──────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>("entering");
  const [buildStage, setBuildStage] = useState(0);
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Phase orchestration ────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      setPhase("entering");
      setBuildStage(0);
      setShowCode(false);
      setIframeReady(false);
      setPreviewHtml("");
      setShowPresetDropdown(false);
      return;
    }

    // 1. Popup slides in
    setPhase("entering");

    const timers: NodeJS.Timeout[] = [];

    // 2. Start building phase after popup enters
    const t1 = setTimeout(() => {
      setPhase("building");

      // Stage text animation
      BUILDING_STAGES.forEach((_, i) => {
        if (i > 0) {
          timers.push(setTimeout(() => setBuildStage(i), i * 400));
        }
      });

      // 3. Revealing phase — code + preview appear
      const t2 = setTimeout(() => {
        if (code) {
          setPreviewHtml(buildPreviewHtml(code));
        }
        setPhase("revealing");

        // 4. Transitioning phase — wipe line sweeps
        const t3 = setTimeout(() => {
          setPhase("transitioning");

          // 5. Complete — full preview
          const t4 = setTimeout(() => {
            setPhase("complete");
          }, 1000);

          timers.push(t4);
        }, 2500);

        timers.push(t3);
      }, 1600);

      timers.push(t2);
    }, 500);

    timers.push(t1);

    return () => timers.forEach(clearTimeout);
  }, [isOpen, code]);

  // ── Rebuild preview on preset switch ──────────────────
  useEffect(() => {
    if (
      code &&
      (phase === "revealing" ||
        phase === "transitioning" ||
        phase === "complete")
    ) {
      setIframeReady(false);
      setPreviewHtml(buildPreviewHtml(code));
    }
  }, [code, phase]);

  // ── Close dropdown on outside click ───────────────────
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowPresetDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Escape + scroll lock ───────────────────────────────
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // ── Handlers ──────────────────────────────────────────
  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const handleDownloadTSX = useCallback(() => {
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GeneratedUI.tsx";
    a.click();
    URL.revokeObjectURL(url);
  }, [code]);

  const handleDownloadHTML = useCallback(() => {
    const html = buildPreviewHtml(code);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "GeneratedUI.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [code]);

  const handlePresetChange = useCallback(
    (preset: string) => {
      setShowPresetDropdown(false);
      onPresetChange(preset);
    },
    [onPresetChange]
  );

  if (!isOpen) return null;

  const currentPreset = PRESETS.find((p) => p.name === presetName);
  const showUI =
    phase === "revealing" ||
    phase === "transitioning" ||
    phase === "complete";

  // ══════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        style={{ animation: "d2dFadeIn 0.3s ease-out" }}
        onClick={onClose}
      />

      {/* Popup container */}
      <div
        className="relative w-[95vw] h-[92vh] max-w-7xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl shadow-blue-500/5 flex flex-col overflow-hidden"
        style={{
          animation: "d2dPopupEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* ── Header ──────────────────────────────────────── */}
        <Header
          phase={phase}
          currentPreset={currentPreset}
          presetName={presetName}
          viewport={viewport}
          setViewport={setViewport}
          showPresetDropdown={showPresetDropdown}
          setShowPresetDropdown={setShowPresetDropdown}
          dropdownRef={dropdownRef}
          handlePresetChange={handlePresetChange}
          isRegenerating={isRegenerating}
          showUI={showUI}
          onClose={onClose}
        />

        {/* ── Body ────────────────────────────────────────── */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* PHASE: building ──────────────────────────────── */}
          {phase === "building" && (
            <BuildingView buildStage={buildStage} />
          )}

          {/* PHASE: revealing — curtain code + preview ─────── */}
          {phase === "revealing" && (
            <RevealingView
              code={code}
              previewHtml={previewHtml}
              viewport={viewport}
              iframeRef={iframeRef}
              iframeReady={iframeReady}
              onIframeLoad={() => setIframeReady(true)}
            />
          )}

          {/* PHASE: transitioning — wipe line ──────────────── */}
          {phase === "transitioning" && (
            <TransitioningView
              previewHtml={previewHtml}
              viewport={viewport}
              iframeRef={iframeRef}
              iframeReady={iframeReady}
              onIframeLoad={() => setIframeReady(true)}
            />
          )}

          {/* PHASE: complete — full preview ─────────────────── */}
          {phase === "complete" && (
            <CompleteView
              code={code}
              previewHtml={previewHtml}
              viewport={viewport}
              showCode={showCode}
              iframeRef={iframeRef}
              iframeReady={iframeReady}
              onIframeLoad={() => setIframeReady(true)}
            />
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        {showUI && (
          <Footer
            phase={phase}
            showCode={showCode}
            setShowCode={setShowCode}
            copied={copied}
            handleCopyCode={handleCopyCode}
            handleDownloadTSX={handleDownloadTSX}
            handleDownloadHTML={handleDownloadHTML}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HEADER SUB-COMPONENT
// ═══════════════════════════════════════════════════════════

function Header({
  phase,
  currentPreset,
  presetName,
  viewport,
  setViewport,
  showPresetDropdown,
  setShowPresetDropdown,
  dropdownRef,
  handlePresetChange,
  isRegenerating,
  showUI,
  onClose,
}: {
  phase: Phase;
  currentPreset: { name: string; label: string } | undefined;
  presetName: string;
  viewport: ViewportSize;
  setViewport: (v: ViewportSize) => void;
  showPresetDropdown: boolean;
  setShowPresetDropdown: (v: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  handlePresetChange: (preset: string) => void;
  isRegenerating: boolean;
  showUI: boolean;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800/60 shrink-0">
      <div className="flex items-center gap-3">
        {/* Sparkle icon */}
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
          <svg
            className="h-4 w-4 text-blue-400"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-neutral-100">
            Generated Design
          </h2>
          {showUI && (
            <p
              className="text-[11px] text-neutral-500"
              style={{ animation: "d2dFadeUp 0.3s ease-out" }}
            >
              {currentPreset?.label || presetName}
            </p>
          )}
        </div>

        {/* Preset switcher */}
        {showUI && phase === "complete" && (
          <div
            className="relative ml-2"
            ref={dropdownRef}
            style={{ animation: "d2dFadeUp 0.3s ease-out" }}
          >
            <button
              onClick={() => setShowPresetDropdown(!showPresetDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-neutral-400 border border-neutral-700 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
            >
              <span>Switch Style</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showPresetDropdown && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl z-10 py-1"
                style={{ animation: "d2dFadeUp 0.15s ease-out" }}
              >
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetChange(preset.name)}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                      preset.name === presetName
                        ? "bg-blue-500/10 text-blue-400 font-medium"
                        : "text-neutral-300 hover:bg-neutral-800"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Regenerating spinner */}
        {isRegenerating && (
          <div className="flex items-center gap-2 ml-3 text-xs text-blue-400">
            <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            Regenerating...
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Responsive toggle */}
        {showUI && (
          <div
            className="flex items-center gap-0.5 rounded-lg border border-neutral-800 bg-neutral-900/50 p-0.5"
            style={{ animation: "d2dFadeUp 0.3s ease-out" }}
          >
            {(
              [
                { key: "desktop" as const, icon: Monitor },
                { key: "tablet" as const, icon: Tablet },
                { key: "mobile" as const, icon: Smartphone },
              ] as const
            ).map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewport(key)}
                className={`rounded-md p-1.5 transition-colors ${
                  viewport === key
                    ? "bg-neutral-800 text-neutral-100"
                    : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// BUILDING VIEW
// ═══════════════════════════════════════════════════════════

function BuildingView({ buildStage }: { buildStage: number }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-12">
      {/* Animated skeleton blocks */}
      <div className="relative flex flex-col items-center gap-2 w-72">
        {[
          { w: "w-full", h: "h-10", delay: "0s" },
          { w: "w-full", h: "h-28", delay: "0.15s" },
          { w: "w-3/4", h: "h-6", delay: "0.3s" },
          { w: "w-full", h: "h-20", delay: "0.45s" },
          { w: "w-5/6", h: "h-8", delay: "0.6s" },
        ].map((block, i) => (
          <div
            key={i}
            className={`${block.w} ${block.h} rounded-lg`}
            style={{
              animation: `d2dBuildBlock 0.4s ease-out ${block.delay} both, d2dShimmer 1.5s infinite`,
              background:
                "linear-gradient(90deg, rgba(59,130,246,0.06) 0%, rgba(59,130,246,0.12) 50%, rgba(59,130,246,0.06) 100%)",
              backgroundSize: "200% 100%",
              border: "1px solid rgba(59,130,246,0.1)",
            }}
          />
        ))}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-blue-500/5 blur-3xl" />
      </div>

      {/* Stage indicator */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-400"
              style={{
                animation: "d2dPulseDot 1.4s infinite",
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <p className="text-sm font-medium text-neutral-300 transition-all duration-300">
          {BUILDING_STAGES[buildStage]}
        </p>

        <div className="h-1 w-48 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out"
            style={{
              width: `${((buildStage + 1) / BUILDING_STAGES.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// REVEALING VIEW — curtain code sweep + preview
// ═══════════════════════════════════════════════════════════

function RevealingView({
  code,
  previewHtml,
  viewport,
  iframeRef,
  iframeReady,
  onIframeLoad,
}: {
  code: string;
  previewHtml: string;
  viewport: ViewportSize;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeReady: boolean;
  onIframeLoad: () => void;
}) {
  return (
    <div className="flex h-full w-full">
      {/* ── Code panel (left 45%) — curtain reveal ──────── */}
      <div
        className="w-[45%] shrink-0 border-r border-neutral-800/60 flex flex-col overflow-hidden"
        style={{ animation: "d2dSlideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {/* Curtain reveal wrapper */}
        <div
          className="flex-1 flex flex-col h-full d2d-curtain-reveal"
        >
          <CodePanel code={code} />
        </div>

        {/* Scanning glow line that sweeps from top to bottom */}
        <ScanLine duration={2500} />
      </div>

      {/* ── Preview panel (right 55%) ────────────────────── */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{
          animation: "d2dSlideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          animationDelay: "150ms",
          animationFillMode: "both",
        }}
      >
        <PreviewPanel
          previewHtml={previewHtml}
          viewport={viewport}
          iframeRef={iframeRef}
          iframeReady={iframeReady}
          onIframeLoad={onIframeLoad}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TRANSITIONING VIEW — wipe line sweeps across
// ═══════════════════════════════════════════════════════════

function TransitioningView({
  previewHtml,
  viewport,
  iframeRef,
  iframeReady,
  onIframeLoad,
}: {
  previewHtml: string;
  viewport: ViewportSize;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeReady: boolean;
  onIframeLoad: () => void;
}) {
  return (
    <div className="relative flex h-full w-full overflow-hidden">
      {/* Full-width preview underneath */}
      <div className="absolute inset-0">
        <PreviewPanel
          previewHtml={previewHtml}
          viewport={viewport}
          iframeRef={iframeRef}
          iframeReady={iframeReady}
          onIframeLoad={onIframeLoad}
          fullWidth
        />
      </div>

      {/* Wipe overlay — slides from left to right, revealing preview */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(10,10,10,0.97) 20%, rgba(10,10,10,0.97) 80%, transparent 100%)",
          animation: "d2dWipeOverlay 1s cubic-bezier(0.76, 0, 0.24, 1) forwards",
        }}
      />

      {/* The glowing vertical wipe line */}
      <WipeLine />

      {/* Center text */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ animation: "d2dTransitionTextIn 1s ease-out forwards" }}
      >
        {/* Horizontal decorative lines flanking text */}
        <div className="flex items-center gap-4">
          <div
            className="h-px w-20 md:w-32"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.6))",
            }}
          />

          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              {/* Sparkle left */}
              <svg
                className="h-3.5 w-3.5 text-blue-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>

              <span className="text-sm font-semibold tracking-widest text-white uppercase">
                Taking you to your UI
              </span>

              {/* Sparkle right */}
              <svg
                className="h-3.5 w-3.5 text-blue-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>

            <p className="text-[11px] text-blue-400/70 tracking-wider">
              Your design is ready
            </p>
          </div>

          <div
            className="h-px w-20 md:w-32"
            style={{
              background: "linear-gradient(90deg, rgba(59,130,246,0.6), transparent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPLETE VIEW — full preview, toggleable code
// ═══════════════════════════════════════════════════════════

function CompleteView({
  code,
  previewHtml,
  viewport,
  showCode,
  iframeRef,
  iframeReady,
  onIframeLoad,
}: {
  code: string;
  previewHtml: string;
  viewport: ViewportSize;
  showCode: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeReady: boolean;
  onIframeLoad: () => void;
}) {
  return (
    <div className="flex h-full w-full">
      {/* Code panel — collapses/expands */}
      <div
        className={`shrink-0 border-r border-neutral-800/60 flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showCode ? "w-[45%]" : "w-0 border-r-0"
        }`}
      >
        <div className="h-full min-w-[40vw]">
          <CodePanel code={code} />
        </div>
      </div>

      {/* Preview panel — fades in at full width */}
      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-500"
        style={{
          animation: "d2dPreviewReveal 0.6s ease-out forwards",
        }}
      >
        <PreviewPanel
          previewHtml={previewHtml}
          viewport={viewport}
          iframeRef={iframeRef}
          iframeReady={iframeReady}
          onIframeLoad={onIframeLoad}
          fullWidth
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FOOTER SUB-COMPONENT
// ═══════════════════════════════════════════════════════════

function Footer({
  phase,
  showCode,
  setShowCode,
  copied,
  handleCopyCode,
  handleDownloadTSX,
  handleDownloadHTML,
}: {
  phase: Phase;
  showCode: boolean;
  setShowCode: (v: boolean) => void;
  copied: boolean;
  handleCopyCode: () => void;
  handleDownloadTSX: () => void;
  handleDownloadHTML: () => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-5 py-3 border-t border-neutral-800/60 shrink-0"
      style={{ animation: "d2dFadeUp 0.4s ease-out" }}
    >
      {/* Export buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy Code
            </>
          )}
        </button>

        <button
          onClick={handleDownloadTSX}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          .tsx
        </button>

        <button
          onClick={handleDownloadHTML}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          .html
        </button>
      </div>

      {/* Code toggle (only in complete phase) */}
      {phase === "complete" && (
        <button
          onClick={() => setShowCode(!showCode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            showCode
              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
              : "text-neutral-400 bg-neutral-900 border border-neutral-700 hover:bg-neutral-800"
          }`}
        >
          {showCode ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              Hide Code
            </>
          ) : (
            <>
              <Code2 className="w-3.5 h-3.5" />
              View Code
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CODE PANEL
// ═══════════════════════════════════════════════════════════

function CodePanel({ code }: { code: string }) {
  const lines = code.split("\n");

  return (
    <div className="flex h-full flex-col">
      {/* Tab bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800/40 bg-[#0d0d0d] shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <div className="flex items-center gap-1 ml-3 px-2 py-0.5 rounded bg-neutral-800/50 border border-neutral-700/30">
          <Code2 className="h-3 w-3 text-blue-400" />
          <span className="text-[11px] text-neutral-400">GeneratedUI.tsx</span>
        </div>
        <span className="ml-auto text-[10px] text-neutral-600">
          {lines.length} lines
        </span>
      </div>

      {/* Code lines */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a]">
        <div className="p-4 font-mono text-[12px] leading-[1.7]">
          {lines.map((line, i) => (
            <div key={i} className="flex hover:bg-white/[0.02]">
              <span className="inline-block w-10 text-right pr-4 text-neutral-700 select-none shrink-0 text-[11px]">
                {i + 1}
              </span>
              <span className="whitespace-pre text-neutral-300">{line}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PREVIEW PANEL
// ═══════════════════════════════════════════════════════════

function PreviewPanel({
  previewHtml,
  viewport,
  iframeRef,
  iframeReady,
  onIframeLoad,
  fullWidth = false,
}: {
  previewHtml: string;
  viewport: ViewportSize;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  iframeReady: boolean;
  onIframeLoad: () => void;
  fullWidth?: boolean;
}) {
  return (
    <div className="flex-1 flex items-start justify-center p-4 bg-neutral-900/30 overflow-auto h-full">
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 h-full relative"
        style={{
          width: fullWidth ? VIEWPORT_WIDTHS[viewport] : VIEWPORT_WIDTHS[viewport],
          maxWidth: "100%",
        }}
      >
        {/* Loading skeleton */}
        {!iframeReady && previewHtml && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-5 border-2 border-neutral-300 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-xs text-neutral-500">Rendering preview...</p>
            </div>
          </div>
        )}

        {previewHtml && (
          <iframe
            ref={iframeRef}
            srcDoc={previewHtml}
            title="Preview"
            className={`w-full h-full border-0 transition-opacity duration-500 ${
              iframeReady ? "opacity-100" : "opacity-0"
            }`}
            sandbox="allow-scripts"
            onLoad={onIframeLoad}
          />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCAN LINE — glows down during curtain reveal
// ═══════════════════════════════════════════════════════════

function ScanLine({ duration }: { duration: number }) {
  return (
    <div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        height: "3px",
        top: "0%",
        animation: `d2dScanLine ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        background:
          "linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.8) 20%, rgba(96,165,250,1) 50%, rgba(59,130,246,0.8) 80%, transparent 100%)",
        boxShadow:
          "0 0 12px 4px rgba(59,130,246,0.5), 0 0 24px 8px rgba(59,130,246,0.2)",
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════
// WIPE LINE — glows across during transition
// ═══════════════════════════════════════════════════════════

function WipeLine() {
  return (
    <div
      className="absolute top-0 bottom-0 pointer-events-none"
      style={{
        width: "3px",
        left: "0%",
        animation: "d2dWipeLine 1s cubic-bezier(0.76, 0, 0.24, 1) forwards",
        background:
          "linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.8) 20%, rgba(96,165,250,1) 50%, rgba(59,130,246,0.8) 80%, transparent 100%)",
        boxShadow:
          "0 0 12px 4px rgba(59,130,246,0.5), 0 0 24px 8px rgba(59,130,246,0.2)",
      }}
    />
  );
}