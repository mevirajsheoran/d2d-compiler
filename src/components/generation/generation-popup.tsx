"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Monitor, Tablet, Smartphone, Copy, Download, Code2, Check, ChevronDown } from "lucide-react";

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

// ═══════════════════════════════════════════════════════════
// JSX → HTML CONVERTER (for iframe preview)
// ═══════════════════════════════════════════════════════════

function buildPreviewHtml(jsxCode: string): string {
  // Extract the JSX body from the component wrapper
  let html = jsxCode;

  // Remove component wrapper
  html = html.replace(
    /export\s+default\s+function\s+\w+\s*\(\s*\)\s*\{\s*return\s*\(\s*/,
    ""
  );
  html = html.replace(/\s*\);\s*\}\s*$/, "");

  // Convert className to class
  html = html.replace(/className="/g, 'class="');
  html = html.replace(/className={/g, "class={");

  // Convert React style objects to HTML style strings
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

  // Convert React SVG attributes to HTML
  html = html.replace(/strokeWidth=/g, "stroke-width=");
  html = html.replace(/strokeLinecap=/g, "stroke-linecap=");
  html = html.replace(/strokeLinejoin=/g, "stroke-linejoin=");
  html = html.replace(/fillRule=/g, "fill-rule=");
  html = html.replace(/clipRule=/g, "clip-rule=");
  html = html.replace(/viewBox=/g, "viewBox=");

  // Fix self-closing tags for HTML
  html = html.replace(/<(input|img|br|hr)([^>]*)\s*\/>/g, "<$1$2>");

  // Convert defaultChecked to checked
  html = html.replace(/defaultChecked/g, "checked");

  // Remove JSX comments
  html = html.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  // Extract font families from the code for Google Fonts
  const fontFamilies = new Set<string>();
  const fontMatches = html.match(/font-\['([^']+)'\]/g);
  if (fontMatches) {
    for (const match of fontMatches) {
      const family = match.replace("font-['", "").replace("']", "").replace(/_/g, " ");
      if (family !== "Inter") fontFamilies.add(family);
    }
  }
  fontFamilies.add("Inter");

  const fontLinks = Array.from(fontFamilies)
    .map(
      (f) =>
        `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(f)}:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">`
    )
    .join("\n    ");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
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
      
      /* Details/summary arrow removal for FAQ */
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
// POPUP COMPONENT
// ═══════════════════════════════════════════════════════════

export default function GenerationPopup({
  isOpen,
  onClose,
  code,
  presetName,
  onPresetChange,
  isRegenerating = false,
}: GenerationPopupProps) {
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update preview when code changes
  useEffect(() => {
    if (previewRef.current && code) {
      previewRef.current.srcdoc = buildPreviewHtml(code);
    }
  }, [code]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPresetDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape key closes popup
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

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
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

  if (!isOpen) return null;

  const currentPreset = PRESETS.find((p) => p.name === presetName);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup container */}
      <div className="relative w-[95vw] h-[92vh] max-w-7xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Design
            </h2>

            {/* Preset switcher */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span>{currentPreset?.label || presetName}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showPresetDropdown && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-10 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        onPresetChange(preset.name);
                        setShowPresetDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        preset.name === presetName
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isRegenerating && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Regenerating...
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ─── Body ─── */}
        <div className="flex-1 flex min-h-0">
          {/* Preview panel */}
          <div className={`flex-1 flex flex-col min-w-0 ${showCode ? "w-1/2" : "w-full"}`}>
            {/* Viewport toggle */}
            <div className="flex items-center justify-center gap-1 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              {(
                [
                  { key: "desktop", icon: Monitor, label: "Desktop" },
                  { key: "tablet", icon: Tablet, label: "Tablet" },
                  { key: "mobile", icon: Smartphone, label: "Mobile" },
                ] as const
              ).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setViewport(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    viewport === key
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Preview iframe */}
            <div className="flex-1 flex items-start justify-center p-4 bg-gray-100 dark:bg-gray-950 overflow-auto">
              <div
                className="bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 h-full"
                style={{
                  width: VIEWPORT_WIDTHS[viewport],
                  maxWidth: "100%",
                }}
              >
                <iframe
                  ref={previewRef}
                  title="Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>

          {/* Code panel (slides in from right) */}
          {showCode && (
            <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 flex flex-col min-w-0 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  React + Tailwind CSS
                </span>
                <span className="text-xs text-gray-400">
                  {code.split("\n").length} lines
                </span>
              </div>
              <div className="flex-1 overflow-auto">
                <pre className="p-4 text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-mono whitespace-pre overflow-x-auto">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {/* Left: export buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Code
                </>
              )}
            </button>

            <button
              onClick={handleDownloadTSX}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span> TSX
            </button>

            <button
              onClick={handleDownloadHTML}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span> HTML
            </button>
          </div>

          {/* Right: code toggle */}
          <button
            onClick={() => setShowCode(!showCode)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showCode
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            }`}
          >
            <Code2 className="w-4 h-4" />
            {showCode ? "Hide Code" : "View Code"}
          </button>
        </div>
      </div>
    </div>
  );
}