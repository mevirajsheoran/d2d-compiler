// src/components/generation/generation-panel.tsx

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  X,
  Copy,
  Download,
  RefreshCw,
  Check,
  Sparkles,
  ScanSearch,
  LayoutGrid,
  Paintbrush,
  Code2,
  CheckCircle2,
  BrainCircuit,
} from "lucide-react";
import { toast } from "sonner";

/* ══════════════════════════════════════════════════════════
   PROGRESS STEPS CONFIGURATION
   ══════════════════════════════════════════════════════════ */
const FAST_STEPS = [
  { id: "extract", label: "Extracting", icon: ScanSearch, duration: 300 },
  { id: "classify", label: "Classifying", icon: LayoutGrid, duration: 400 },
  { id: "sections", label: "Detecting Sections", icon: Sparkles, duration: 500 },
  { id: "build", label: "Building", icon: Code2, duration: 600 },
  { id: "style", label: "Styling", icon: Paintbrush, duration: 400 },
  { id: "done", label: "Complete", icon: CheckCircle2, duration: 0 },
];

const ENHANCED_STEPS = [
  { id: "extract", label: "Extracting", icon: ScanSearch, duration: 400 },
  { id: "classify", label: "Classifying", icon: LayoutGrid, duration: 400 },
  { id: "enhance", label: "AI Enhancing", icon: BrainCircuit, duration: 2000 },
  { id: "build", label: "Building", icon: Code2, duration: 500 },
  { id: "style", label: "Styling", icon: Paintbrush, duration: 400 },
  { id: "done", label: "Complete", icon: CheckCircle2, duration: 0 },
];

/* ══════════════════════════════════════════════════════════
   SIMPLE SYNTAX HIGHLIGHTING
   ══════════════════════════════════════════════════════════ */
function highlightCode(line: string): React.ReactElement {
  const parts: React.ReactElement[] = [];
  let remaining = line;
  let key = 0;

  const addPart = (text: string, color: string) => {
    if (text) {
      parts.push(
        <span key={key++} style={{ color }}>
          {text}
        </span>
      );
    }
  };

  if (remaining.trimStart().startsWith("//")) {
    addPart(remaining, "#6a9955");
    return <>{parts}</>;
  }

  const patterns: [RegExp, string][] = [
    [/^(export|default|function|return|const|let|var|import|from|type|interface)\b/, "#c586c0"],
    [/^(<\/?)([\w.-]+)/, ""],
    [/^"[^"]*"/, "#ce9178"],
    [/^'[^']*'/, "#ce9178"],
    [/^`[^`]*`/, "#ce9178"],
    [/^className/, "#9cdcfe"],
    [/^[\w-]+=/, ""],
    [/^\d+(\.\d+)?/, "#b5cea8"],
    [/^[{}()\[\]]/, "#ffd700"],
    [/^[=<>!+\-*/&|?:]+/, "#d4d4d4"],
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const [pattern, color] of patterns) {
      const match = remaining.match(pattern);
      if (match) {
        if (color === "" && match[0].startsWith("<")) {
          addPart(match[1] || "<", "#808080");
          addPart(match[2] || "", "#4ec9b0");
          remaining = remaining.slice(match[0].length);
        } else if (color === "" && match[0].includes("=")) {
          const attrName = match[0].replace("=", "");
          addPart(attrName, "#9cdcfe");
          addPart("=", "#d4d4d4");
          remaining = remaining.slice(match[0].length);
        } else if (color) {
          addPart(match[0], color);
          remaining = remaining.slice(match[0].length);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      addPart(remaining[0], "#d4d4d4");
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
}

/* ══════════════════════════════════════════════════════════
   GENERATION PANEL COMPONENT
   ══════════════════════════════════════════════════════════ */
interface GenerationPanelProps {
  code: string;
  onClose: () => void;
  onRegenerate: () => void;
  mode?: "fast" | "enhanced";
}

export function GenerationPanel({
  code,
  onClose,
  onRegenerate,
  mode = "fast",
}: GenerationPanelProps) {
  // ── Select steps based on mode ──
  const PIPELINE_STEPS = mode === "enhanced" ? ENHANCED_STEPS : FAST_STEPS;

  // ── State ──
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayedLines, setDisplayedLines] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const codeLines = code.split("\n");
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // ── Mount animation ──
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // ── Progress steps animation ──
  useEffect(() => {
    if (!isAnimating) return;

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex >= PIPELINE_STEPS.length - 1) {
        setCurrentStep(PIPELINE_STEPS.length - 1);
        setTimeout(() => startCodeTyping(), 300);
        return;
      }
      setCurrentStep(stepIndex);
      stepIndex++;
      setTimeout(runStep, PIPELINE_STEPS[stepIndex - 1].duration);
    };

    runStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnimating]);

  // ── Code typing animation ──
  const startCodeTyping = useCallback(() => {
    const totalLines = codeLines.length;
    const totalDuration = 2500;
    const perLineDelay = Math.max(totalDuration / totalLines, 15);
    let currentLine = 0;

    const typeInterval = setInterval(() => {
      currentLine++;
      setDisplayedLines(currentLine);

      if (codeContainerRef.current) {
        codeContainerRef.current.scrollTop =
          codeContainerRef.current.scrollHeight;
      }

      if (currentLine % 5 === 0 || currentLine === totalLines) {
        updatePreview(codeLines.slice(0, currentLine).join("\n"));
      }

      if (currentLine >= totalLines) {
        clearInterval(typeInterval);
        setIsAnimating(false);
        updatePreview(code);
      }
    }, perLineDelay);

    return () => clearInterval(typeInterval);
  }, [code, codeLines]);

  // ── Update preview iframe ──
  const updatePreview = (currentCode: string) => {
    if (!previewRef.current) return;
    previewRef.current.srcdoc = buildPreviewHtml(currentCode);
  };

  // ── Actions ──
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GeneratedUI.tsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded GeneratedUI.tsx");
  };

  const handleRegenerate = () => {
    setCurrentStep(0);
    setDisplayedLines(0);
    setIsAnimating(true);
    onRegenerate();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative w-full max-w-[90vw] h-[88vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
        style={{
          background:
            "linear-gradient(145deg, #0a0a0a 0%, #111111 50%, #0a0a0a 100%)",
        }}
      >
        {/* ── Top Bar ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="h-5 w-5 text-violet-400" />
              <div className="absolute inset-0 h-5 w-5 text-violet-400 blur-md opacity-50">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <span className="text-sm font-semibold text-white">
              D2D Generation
            </span>
            {mode === "enhanced" && (
              <span className="text-xs text-violet-300 bg-violet-400/10 px-2 py-0.5 rounded-full border border-violet-400/20">
                AI Enhanced
              </span>
            )}
            {!isAnimating && (
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                ✓ Complete
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isAnimating && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={handleRegenerate}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  Regenerate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1.5" />
                      Copy Code
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
              </>
            )}
            <div className="w-px h-5 bg-white/10 mx-1" />
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Progress Steps ── */}
        <div className="px-5 py-3 border-b border-white/10 bg-white/[0.01]">
          <div className="flex items-center justify-center gap-1">
            {PIPELINE_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500 ${
                      isComplete
                        ? "text-emerald-400 bg-emerald-400/10"
                        : isActive
                          ? step.id === "enhance"
                            ? "text-violet-300 bg-violet-400/15 shadow-lg shadow-violet-500/20 ring-1 ring-violet-400/30"
                            : "text-violet-300 bg-violet-400/15 shadow-lg shadow-violet-500/10"
                          : "text-gray-600"
                    }`}
                  >
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        isActive ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="hidden sm:inline">{step.label}</span>
                    {isComplete && (
                      <Check className="h-3 w-3 text-emerald-400" />
                    )}
                  </div>

                  {index < PIPELINE_STEPS.length - 1 && (
                    <div className="w-6 sm:w-10 h-px mx-1">
                      <div
                        className={`h-full transition-all duration-500 ${
                          isComplete
                            ? "bg-emerald-400/50"
                            : isActive
                              ? "bg-gradient-to-r from-violet-400/50 to-transparent"
                              : "bg-white/5"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main Content: Split View ── */}
        <div className="flex h-[calc(100%-110px)]">
          {/* Left: Code Editor */}
          <div className="w-1/2 border-r border-white/10 flex flex-col">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#1e1e1e]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-1 ml-3 px-3 py-1 rounded-md bg-[#2d2d2d] border-t border-white/10">
                <Code2 className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-gray-300">
                  GeneratedUI.tsx
                </span>
              </div>
            </div>

            <div
              ref={codeContainerRef}
              className="flex-1 overflow-auto font-mono text-[13px] leading-[1.6] bg-[#1e1e1e]"
            >
              <div className="p-4">
                {codeLines.slice(0, displayedLines).map((line, i) => (
                  <div key={i} className="flex">
                    <span className="inline-block w-10 text-right pr-4 text-gray-600 select-none flex-shrink-0 text-xs">
                      {i + 1}
                    </span>
                    <span className="flex-1 whitespace-pre">
                      {highlightCode(line)}
                    </span>
                  </div>
                ))}
                {isAnimating && displayedLines > 0 && (
                  <span className="inline-block w-[2px] h-4 bg-violet-400 animate-pulse ml-10" />
                )}
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="w-1/2 flex flex-col bg-white">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-600 font-medium">
                Live Preview
              </span>
              {isAnimating && (
                <span className="text-xs text-violet-500 animate-pulse ml-auto">
                  Rendering...
                </span>
              )}
            </div>

            <div className="flex-1 overflow-auto">
              {displayedLines === 0 ? (
                <div className="flex items-center justify-center h-full bg-gray-50">
                  <div className="text-center">
                    <div className="relative mx-auto w-12 h-12 mb-4">
                      <Sparkles className="w-12 h-12 text-violet-300 animate-pulse" />
                      <div className="absolute inset-0 w-12 h-12 text-violet-300 blur-lg opacity-50">
                        <Sparkles className="w-12 h-12" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      {mode === "enhanced"
                        ? "AI is designing your layout..."
                        : "Generating your design..."}
                    </p>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={previewRef}
                  className="w-full h-full border-0"
                  title="Generated UI Preview"
                  sandbox="allow-scripts"
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Glow Line ── */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div
            className={`h-full transition-all duration-1000 ${
              isAnimating
                ? "bg-gradient-to-r from-transparent via-violet-500/50 to-transparent"
                : "bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   Build self-contained HTML preview with Tailwind CDN
   ══════════════════════════════════════════════════════════ */
function buildPreviewHtml(code: string): string {
  let htmlContent = code;

  htmlContent = htmlContent
    .replace(/export default function GeneratedUI\(\)\s*\{/, "")
    .replace(/\s*return\s*\(/, "")
    .replace(/\s*\);\s*\}$/, "");

  // Extract font families from the code comments
  const fontMatch = htmlContent.match(/\/\*\s*Fonts?:\s*([^*]+)\*\//);
  const fontFamilies = fontMatch
    ? fontMatch[1].split(",").map((f: string) => f.trim()).filter(Boolean)
    : [];

  // Build Google Fonts link
  const defaultFonts = ["Inter"];
  const allFonts = [...new Set([...defaultFonts, ...fontFamilies])];
  const fontLinks = allFonts
    .map(
      (font) =>
        `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`
    )
    .join("\n  ");

  // Remove font comments from output
  htmlContent = htmlContent.replace(/\{\/\*\s*Fonts?:[^*]*\*\/\}\s*/g, "");

  htmlContent = htmlContent
    .replace(/className="/g, 'class="')
    .replace(/<input([^>]*)\s*\/>/g, "<input$1>")
    .replace(/<hr([^>]*)\s*\/>/g, "<hr$1>")
    .replace(
      /style=\{\{([^}]+)\}\}/g,
      (_match: string, styleContent: string) => {
        const cssProps = styleContent
          .split(",")
          .map((prop: string) => {
            const [key, value] = prop.split(":").map((s: string) => s.trim());
            if (!key || !value) return "";
            const cssKey = key.replace(
              /[A-Z]/g,
              (m: string) => `-${m.toLowerCase()}`
            );
            const cssValue = /^\d+$/.test(value) ? `${value}px` : value;
            return `${cssKey}: ${cssValue}`;
          })
          .filter(Boolean)
          .join("; ");
        return `style="${cssProps}"`;
      }
    )
    .replace(/strokeLinecap/g, "stroke-linecap")
    .replace(/strokeLinejoin/g, "stroke-linejoin")
    .replace(/strokeWidth/g, "stroke-width")
    .replace(/defaultChecked/g, "checked")
    .replace(/=\{(\d+(?:\.\d+)?)\}/g, '="$1"')
    .replace(/=\{"([^"]+)"\}/g, '="$1"');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  ${fontLinks}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      overflow-x: hidden;
    }
    body > * {
      animation: revealSection 0.5s ease forwards;
      opacity: 0;
    }
    @keyframes revealSection {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}