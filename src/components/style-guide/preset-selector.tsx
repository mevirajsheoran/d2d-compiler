"use client";

import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { getPresetList } from "@/lib/design-engine-pipeline/design-identity";

/* ══════════════════════════════════════════════════════════════════════════════
   PRESET PREVIEW DATA
   
   Static visual characteristics for each preset's mini preview card.
   These are representative styles — NOT the full identity, just enough
   to give users a visual sense of each preset's personality.
   ══════════════════════════════════════════════════════════════════════════════ */

const PRESET_PREVIEW_DATA: Record<
  string,
  {
    pageBg: string;
    navBg: string;
    navText: string;
    headingClass: string;
    bodyTextClass: string;
    buttonClass: string;
    cardClass: string;
    dots: string[];
  }
> = {
  "startup-modern": {
    pageBg: "bg-gray-50",
    navBg: "bg-white/80 backdrop-blur border-b border-gray-100",
    navText: "text-gray-600",
    headingClass: "text-gray-900 font-bold",
    bodyTextClass: "bg-gray-200",
    buttonClass:
      "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-md",
    cardClass: "bg-white rounded-2xl border border-gray-200/60 shadow-sm",
    dots: ["#3b82f6", "#60a5fa", "#1e293b", "#f8fafc"],
  },
  "corporate-clean": {
    pageBg: "bg-white",
    navBg: "bg-white border-b border-slate-200",
    navText: "text-slate-500",
    headingClass: "text-slate-900 font-semibold",
    bodyTextClass: "bg-slate-200",
    buttonClass: "bg-slate-800 text-white rounded-lg",
    cardClass: "bg-white rounded-xl border border-slate-200 shadow-sm",
    dots: ["#1e40af", "#475569", "#f1f5f9", "#e2e8f0"],
  },
  "bold-creative": {
    pageBg: "bg-white",
    navBg: "bg-white/90 border-b border-gray-100",
    navText: "text-gray-500",
    headingClass: "text-gray-950 font-black",
    bodyTextClass: "bg-gray-200",
    buttonClass:
      "bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg",
    cardClass: "bg-white rounded-3xl border border-gray-100 shadow-lg",
    dots: ["#f59e0b", "#ef4444", "#8b5cf6", "#10b981"],
  },
  "minimal-elegant": {
    pageBg: "bg-white",
    navBg: "bg-white/95 border-b border-neutral-100",
    navText: "text-neutral-400",
    headingClass: "text-neutral-900 font-normal italic",
    bodyTextClass: "bg-neutral-200",
    buttonClass: "bg-neutral-900 text-white rounded-sm",
    cardClass: "bg-white rounded-lg border border-neutral-100",
    dots: ["#374151", "#78350f", "#f5f5f4", "#d6d3d1"],
  },
  "dashboard-dense": {
    pageBg: "bg-gray-100",
    navBg: "bg-white border-b border-gray-200",
    navText: "text-gray-500",
    headingClass: "text-gray-900 font-semibold text-[9px]",
    bodyTextClass: "bg-gray-200",
    buttonClass: "bg-blue-600 text-white rounded-md text-[6px]",
    cardClass: "bg-white rounded-lg border border-gray-200 shadow-sm",
    dots: ["#3b82f6", "#6b7280", "#f3f4f6", "#e5e7eb"],
  },
  "glass-gradient": {
    pageBg: "bg-gray-950",
    navBg: "bg-gray-950/80 border-b border-white/[0.06]",
    navText: "text-gray-400",
    headingClass: "text-white font-bold",
    bodyTextClass: "bg-white/20",
    buttonClass:
      "bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl shadow-lg",
    cardClass:
      "bg-white/[0.06] rounded-2xl border border-white/[0.08] backdrop-blur",
    dots: ["#8b5cf6", "#06b6d4", "#1f2937", "#111827"],
  },
};

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT PROPS
   ══════════════════════════════════════════════════════════════════════════════ */

interface PresetSelectorProps {
  selectedPreset: string | undefined;
  recommendedPreset: string | undefined;
  onSelectPreset: (presetName: string) => void;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function PresetSelector({
  selectedPreset,
  recommendedPreset,
  onSelectPreset,
}: PresetSelectorProps) {
  const presets = getPresetList();

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-semibold">Choose Your Design Style</h3>
        <p className="text-xs text-muted-foreground">
          Select a visual style for your generated design. Each style has
          different typography, spacing, shadows, and animations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {presets.map((preset) => {
          const preview = PRESET_PREVIEW_DATA[preset.name];
          if (!preview) return null;

          const isSelected = selectedPreset === preset.name;
          const isRecommended = recommendedPreset === preset.name;

          return (
            <button
              key={preset.name}
              onClick={() => onSelectPreset(preset.name)}
              className={cn(
                "flex flex-col rounded-xl border overflow-hidden text-left",
                "transition-all duration-200 cursor-pointer",
                "hover:border-primary/50",
                isSelected
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-muted"
              )}
            >
              {/* ─── Mini Preview ─── */}
              <div className={cn("relative h-[100px] w-full", preview.pageBg)}>
                {/* Mini Nav */}
                <div
                  className={cn(
                    "h-5 w-full flex items-center justify-between px-2",
                    preview.navBg
                  )}
                >
                  {/* Logo dot */}
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: preview.dots[0] }}
                    />
                    <div
                      className={cn(
                        "w-8 h-1 rounded-full",
                        preview.navText === "text-gray-400"
                          ? "bg-white/30"
                          : "bg-gray-300"
                      )}
                    />
                  </div>
                  {/* Nav links */}
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-5 h-1 rounded-full",
                          preview.navText === "text-gray-400"
                            ? "bg-white/20"
                            : "bg-gray-200"
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Mini Hero */}
                <div className="px-3 pt-2.5 space-y-1.5">
                  <div
                    className={cn(
                      "text-[10px] leading-tight truncate",
                      preview.headingClass
                    )}
                  >
                    Heading Text
                  </div>
                  <div
                    className={cn(
                      "w-24 h-1 rounded-full",
                      preview.bodyTextClass
                    )}
                  />
                  <div
                    className={cn(
                      "w-16 h-1 rounded-full",
                      preview.bodyTextClass
                    )}
                  />
                  <div className="pt-0.5">
                    <div
                      className={cn(
                        "inline-block text-[7px] font-medium px-2 py-0.5",
                        preview.buttonClass
                      )}
                    >
                      Button
                    </div>
                  </div>
                </div>

                {/* Mini Cards Row */}
                <div className="absolute bottom-1.5 left-3 right-3 flex gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={cn("flex-1 h-5", preview.cardClass)}
                    />
                  ))}
                </div>
              </div>

              {/* ─── Info Area ─── */}
              <div className="p-3 border-t border-inherit space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{preset.label}</p>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {preset.description}
                </p>

                {/* Color dots */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {preview.dots.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border-2 border-background"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Recommended badge */}
                  {isRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                      <Sparkles className="h-2.5 w-2.5" />
                      Recommended
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}