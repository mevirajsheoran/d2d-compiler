// src/components/generation/variation-view.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Code2, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildPreviewHtml, highlightCode } from "@/lib/design-engine-pipeline/preview-builder";
import { ResponsiveToggle, getViewportWidth, type ViewportSize } from "./responsive-toggle";
import { ExportOptions } from "./export-options";
import type { Variation } from "@/lib/design-engine-pipeline/variation-generator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ══════════════════════════════════════════════════════════════════════════════
   PROPS
   ══════════════════════════════════════════════════════════════════════════════ */

interface VariationViewProps {
  variations: Variation[];
  onStyleChange: (presetName: string, index: number) => void;
  allPresets: Array<{ name: string; label: string; description: string }>;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function VariationView({
  variations,
  onStyleChange,
  allPresets,
}: VariationViewProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [viewportSize, setViewportSize] = useState<ViewportSize>("desktop");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // ─── Card View (3 variations side by side) ───
  if (expandedIndex === null) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {variations.map((variation, index) => (
            <VariationCard
              key={`${variation.presetName}-${index}`}
              variation={variation}
              index={index}
              onExpand={() => setExpandedIndex(index)}
            />
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Click any variation to expand and view code
        </p>
      </div>
    );
  }

  // ─── Expanded View (split code + preview) ───
  const currentVariation = variations[expandedIndex];
  const codeLines = currentVariation.code.split("\n");

  return (
    <div className="space-y-4">
      {/* Variation Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {variations.map((v, i) => (
          <Button
            key={v.presetName}
            variant={i === expandedIndex ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => setExpandedIndex(i)}
          >
            {i === expandedIndex && <Check className="h-3 w-3" />}
            {v.presetLabel}
          </Button>
        ))}

        <div className="flex-1" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={() => setExpandedIndex(null)}
        >
          ← All Variations
        </Button>
      </div>

      {/* Split View */}
      <div className="rounded-xl border overflow-hidden bg-background shadow-lg">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold">
              {currentVariation.presetLabel}
            </span>
            <span className="text-xs text-muted-foreground">
              {currentVariation.presetDescription}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle (mobile) */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 px-2.5 text-xs rounded-md",
                  activeTab === "preview"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("preview")}
              >
                <Eye className="h-3.5 w-3.5 mr-1" />
                Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-7 px-2.5 text-xs rounded-md",
                  activeTab === "code"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setActiveTab("code")}
              >
                <Code2 className="h-3.5 w-3.5 mr-1" />
                Code
              </Button>
            </div>

            {/* Responsive Toggle */}
            <div className="hidden md:block">
              <ResponsiveToggle value={viewportSize} onChange={setViewportSize} />
            </div>
          </div>
        </div>

        {/* Content: Split on desktop, tabbed on mobile */}
        <div className="flex flex-col md:flex-row h-[60vh] min-h-[400px]">
          {/* Code Editor */}
          <div
            className={cn(
              "md:w-1/2 md:border-r flex flex-col",
              activeTab === "code" ? "flex" : "hidden md:flex"
            )}
          >
            {/* Code Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-[#1e1e1e]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-1 ml-3 px-3 py-1 rounded-md bg-[#2d2d2d] border-t border-white/10">
                <Code2 className="h-3 w-3 text-blue-400" />
                <span className="text-xs text-gray-300">GeneratedUI.tsx</span>
              </div>
              <span className="ml-auto text-[10px] text-gray-500">
                {codeLines.length} lines
              </span>
            </div>

            {/* Code Content */}
            <div
              ref={codeContainerRef}
              className="flex-1 overflow-auto font-mono text-[13px] leading-[1.6] bg-[#1e1e1e]"
            >
              <div className="p-4">
                {codeLines.map((line, i) => (
                  <div key={i} className="flex hover:bg-white/[0.03]">
                    <span className="inline-block w-10 text-right pr-4 text-gray-600 select-none flex-shrink-0 text-xs">
                      {i + 1}
                    </span>
                    <span className="flex-1 whitespace-pre">
                      {highlightCode(line)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div
            className={cn(
              "md:w-1/2 flex flex-col bg-muted/20",
              activeTab === "preview" ? "flex" : "hidden md:flex"
            )}
          >
            {/* Preview Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted-foreground font-medium">
                Live Preview
              </span>
              <span className="text-[10px] text-muted-foreground ml-auto">
                {viewportSize === "desktop"
                  ? "Full Width"
                  : viewportSize === "tablet"
                    ? "768px"
                    : "375px"}
              </span>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-auto flex justify-center p-2 bg-muted/10">
              <div
                className="transition-all duration-300 h-full bg-white rounded-lg overflow-hidden shadow-sm border"
                style={{
                  width: getViewportWidth(viewportSize),
                  maxWidth: "100%",
                }}
              >
                <iframe
                  srcDoc={buildPreviewHtml(currentVariation.code)}
                  className="w-full h-full border-0"
                  title={`Preview - ${currentVariation.presetLabel}`}
                  sandbox="allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ExportOptions
          code={currentVariation.code}
          presetName={currentVariation.presetName}
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Try another:</span>
          <Select
            value={currentVariation.presetName}
            onValueChange={(value) => onStyleChange(value, expandedIndex)}
          >
            <SelectTrigger className="h-8 w-[180px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allPresets.map((p) => (
                <SelectItem key={p.name} value={p.name} className="text-xs">
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   VARIATION CARD — Scaled-down preview card for 3-up view
   ══════════════════════════════════════════════════════════════════════════════ */

interface VariationCardProps {
  variation: Variation;
  index: number;
  onExpand: () => void;
}

function VariationCard({ variation, index, onExpand }: VariationCardProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = buildPreviewHtml(variation.code);
    }
  }, [variation.code]);

  return (
    <button
      onClick={onExpand}
      className={cn(
        "group flex flex-col rounded-xl border overflow-hidden text-left",
        "transition-all duration-300 cursor-pointer",
        "hover:border-primary/50 hover:shadow-lg hover:-translate-y-1",
        "opacity-0 animate-[fadeInUp_0.5s_ease_forwards]"
      )}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Scaled Preview */}
      <div className="relative w-full overflow-hidden bg-muted/30" style={{ height: "220px" }}>
        <div
          className="origin-top-left absolute top-0 left-0"
          style={{
            width: "1440px",
            height: "900px",
            transform: "scale(0.25)",
            transformOrigin: "top left",
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title={`Variation ${index + 1} - ${variation.presetLabel}`}
            sandbox="allow-scripts"
            onLoad={() => setLoaded(true)}
          />
        </div>

        {/* Loading overlay */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 text-xs font-medium text-white bg-black/60 px-3 py-1.5 rounded-full transition-opacity duration-300">
            Click to expand
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 border-t">
        <p className="text-sm font-semibold">{variation.presetLabel}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {variation.presetDescription}
        </p>
      </div>
    </button>
  );
}