"use client";

import { useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Palette,
  Type as TypeIcon,
  Layers,
  Check,
} from "lucide-react";
import {
  getSuggestions,
  type Suggestions,
} from "@/lib/ai-pipeline/industry-content";
import type { DesignBrief } from "@/types/style-guide";

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE TYPE OPTIONS
   ══════════════════════════════════════════════════════════════════════════════ */

const PAGE_TYPES = [
  {
    value: "landing",
    label: "Landing Page",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <line x1="4" y1="10" x2="28" y2="10" />
        <rect x="8" y="14" width="16" height="4" rx="1" />
        <rect x="10" y="21" width="5" height="2" rx="0.5" />
        <rect x="17" y="21" width="5" height="2" rx="0.5" />
      </svg>
    ),
  },
  {
    value: "dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <line x1="12" y1="4" x2="12" y2="28" />
        <line x1="12" y1="16" x2="28" y2="16" />
        <rect x="14" y="6" width="5" height="4" rx="1" />
        <rect x="21" y="6" width="5" height="4" rx="1" />
      </svg>
    ),
  },
  {
    value: "login",
    label: "Login / Sign Up",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <rect x="10" y="11" width="12" height="3" rx="1" />
        <rect x="10" y="17" width="12" height="3" rx="1" />
        <rect x="12" y="23" width="8" height="2.5" rx="1" />
      </svg>
    ),
  },
  {
    value: "blog",
    label: "Blog / Article",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <line x1="8" y1="10" x2="24" y2="10" />
        <line x1="8" y1="14" x2="20" y2="14" />
        <line x1="8" y1="18" x2="22" y2="18" />
        <line x1="8" y1="22" x2="16" y2="22" />
      </svg>
    ),
  },
  {
    value: "portfolio",
    label: "Portfolio",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <circle cx="16" cy="14" r="4" />
        <line x1="10" y1="22" x2="22" y2="22" />
        <line x1="12" y1="25" x2="20" y2="25" />
      </svg>
    ),
  },
  {
    value: "ecommerce",
    label: "Store",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <rect x="7" y="8" width="8" height="8" rx="1" />
        <rect x="17" y="8" width="8" height="8" rx="1" />
        <rect x="7" y="18" width="8" height="8" rx="1" />
        <rect x="17" y="18" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    value: "saas",
    label: "SaaS Product",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <line x1="4" y1="10" x2="28" y2="10" />
        <rect x="8" y="13" width="7" height="5" rx="1" />
        <rect x="17" y="13" width="7" height="5" rx="1" />
        <rect x="8" y="20" width="16" height="4" rx="1" />
      </svg>
    ),
  },
  {
    value: "agency",
    label: "Agency",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <rect x="7" y="7" width="18" height="10" rx="1" />
        <circle cx="11" cy="22" r="2" />
        <circle cx="16" cy="22" r="2" />
        <circle cx="21" cy="22" r="2" />
      </svg>
    ),
  },
  {
    value: "restaurant",
    label: "Restaurant",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <line x1="4" y1="10" x2="28" y2="10" />
        <line x1="10" y1="15" x2="22" y2="15" />
        <line x1="10" y1="19" x2="22" y2="19" />
        <line x1="10" y1="23" x2="18" y2="23" />
      </svg>
    ),
  },
  {
    value: "pricing",
    label: "Pricing",
    icon: (
      <svg viewBox="0 0 32 32" className="w-6 h-6" stroke="currentColor" strokeWidth="2" fill="none">
        <rect x="4" y="4" width="24" height="24" rx="2" />
        <rect x="6" y="9" width="6" height="16" rx="1" />
        <rect x="13" y="6" width="6" height="19" rx="1" />
        <rect x="20" y="9" width="6" height="16" rx="1" />
      </svg>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   INDUSTRY OPTIONS
   ══════════════════════════════════════════════════════════════════════════════ */

const INDUSTRIES = [
  { value: "tech", label: "Technology", emoji: "💻" },
  { value: "medical", label: "Healthcare", emoji: "🏥" },
  { value: "education", label: "Education", emoji: "📚" },
  { value: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { value: "ecommerce", label: "E-commerce", emoji: "🛍️" },
  { value: "finance", label: "Finance", emoji: "💰" },
  { value: "realestate", label: "Real Estate", emoji: "🏠" },
  { value: "travel", label: "Travel", emoji: "✈️" },
  { value: "fitness", label: "Fitness", emoji: "💪" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "legal", label: "Legal", emoji: "⚖️" },
  { value: "agency", label: "Agency", emoji: "🔧" },
];

/* ══════════════════════════════════════════════════════════════════════════════
   TONE OPTIONS
   Each tone has a mini preview showing representative visual characteristics.
   ══════════════════════════════════════════════════════════════════════════════ */

const TONES = [
  {
    value: "professional",
    label: "Professional",
    description: "Clean & structured",
    preview: {
      bg: "bg-white",
      navBg: "bg-slate-800",
      heading: "text-slate-900 font-semibold text-[10px]",
      button: "bg-blue-600 text-white text-[7px] rounded-md px-2 py-0.5",
      card: "bg-white border border-slate-200 rounded-lg shadow-sm",
      accent: "#3b82f6",
    },
  },
  {
    value: "playful",
    label: "Playful",
    description: "Fun & colorful",
    preview: {
      bg: "bg-white",
      navBg: "bg-indigo-500",
      heading: "text-gray-900 font-bold text-[10px]",
      button: "bg-indigo-500 text-white text-[7px] rounded-full px-2 py-0.5",
      card: "bg-white border-2 border-indigo-200 rounded-2xl shadow-md",
      accent: "#6366f1",
    },
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "Space & simplicity",
    preview: {
      bg: "bg-white",
      navBg: "bg-white border-b border-neutral-100",
      heading: "text-neutral-900 font-normal text-[10px] italic",
      button: "bg-neutral-900 text-white text-[7px] rounded-sm px-2 py-0.5",
      card: "bg-white border border-neutral-100 rounded",
      accent: "#374151",
    },
  },
  {
    value: "bold",
    label: "Bold",
    description: "Strong & energetic",
    preview: {
      bg: "bg-white",
      navBg: "bg-gray-950",
      heading: "text-gray-950 font-black text-[10px]",
      button: "bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] rounded-full px-2 py-0.5",
      card: "bg-white border-2 border-gray-200 rounded-3xl shadow-lg",
      accent: "#f59e0b",
    },
  },
  {
    value: "elegant",
    label: "Elegant",
    description: "Refined & luxurious",
    preview: {
      bg: "bg-white",
      navBg: "bg-white border-b border-stone-200",
      heading: "text-stone-800 font-normal text-[10px]",
      button: "bg-stone-800 text-white text-[7px] rounded-sm px-2 py-0.5",
      card: "bg-white border border-stone-200 rounded-sm",
      accent: "#78350f",
    },
  },
  {
    value: "futuristic",
    label: "Futuristic",
    description: "Dark & glowing",
    preview: {
      bg: "bg-gray-950",
      navBg: "bg-gray-900/80 border-b border-white/10",
      heading: "text-white font-semibold text-[10px]",
      button: "bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[7px] rounded-xl px-2 py-0.5",
      card: "bg-white/5 border border-white/10 rounded-2xl backdrop-blur",
      accent: "#8b5cf6",
    },
  },
];

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT PROPS
   ══════════════════════════════════════════════════════════════════════════════ */

interface DesignBriefProps {
  brief: DesignBrief | undefined;
  onUpdateField: (field: keyof DesignBrief, value: string) => void;
  onApplySuggestions: (suggestions: Suggestions) => void;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export function DesignBriefSection({
  brief,
  onUpdateField,
  onApplySuggestions,
}: DesignBriefProps) {
  const currentPageType = brief?.pageType || "";
  const currentIndustry = brief?.industry || "";
  const currentTone = brief?.tone || "";
  const currentBrandName = brief?.brandName || "";
  const currentTagline = brief?.tagline || "";

  // ─── Smart Suggestions ───
  const suggestions = useMemo(() => {
    if (!currentIndustry || !currentTone) return null;
    return getSuggestions(currentIndustry, currentTone);
  }, [currentIndustry, currentTone]);

  // ─── Handlers ───
  const handlePageType = useCallback(
    (value: string) => {
      onUpdateField("pageType", value === currentPageType ? "" : value);
    },
    [onUpdateField, currentPageType]
  );

  const handleIndustry = useCallback(
    (value: string) => {
      onUpdateField("industry", value === currentIndustry ? "" : value);
    },
    [onUpdateField, currentIndustry]
  );

  const handleTone = useCallback(
    (value: string) => {
      onUpdateField("tone", value === currentTone ? "" : value);
    },
    [onUpdateField, currentTone]
  );

  return (
    <div className="space-y-10">
      {/* ─── SECTION 1: PAGE TYPE ─── */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Page Type</h3>
          <p className="text-xs text-muted-foreground">
            What kind of page are you designing?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {PAGE_TYPES.map((pt) => (
            <button
              key={pt.value}
              onClick={() => handlePageType(pt.value)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border text-center",
                "transition-all duration-200 cursor-pointer",
                "hover:border-primary/50 hover:bg-muted/50",
                currentPageType === pt.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.02]"
                  : "border-muted"
              )}
            >
              <div
                className={cn(
                  "text-muted-foreground transition-colors",
                  currentPageType === pt.value && "text-primary"
                )}
              >
                {pt.icon}
              </div>
              <span className="text-xs font-medium leading-tight">
                {pt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── SECTION 2: INDUSTRY ─── */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Industry</h3>
          <p className="text-xs text-muted-foreground">
            What industry is this website for? This determines content and icons.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind.value}
              onClick={() => handleIndustry(ind.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                "border transition-all duration-200 cursor-pointer",
                "hover:border-primary/50",
                currentIndustry === ind.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-muted text-foreground hover:bg-muted/50"
              )}
            >
              <span>{ind.emoji}</span>
              <span>{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── SECTION 3: TONE ─── */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold">Tone & Feel</h3>
          <p className="text-xs text-muted-foreground">
            What aesthetic are you going for? This affects colors, spacing, and
            typography.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TONES.map((tone) => (
            <button
              key={tone.value}
              onClick={() => handleTone(tone.value)}
              className={cn(
                "flex flex-col rounded-xl border overflow-hidden text-left",
                "transition-all duration-200 cursor-pointer",
                "hover:border-primary/50",
                currentTone === tone.value
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-muted"
              )}
            >
              {/* Mini Preview */}
              <div
                className={cn(
                  "relative h-[72px] w-full overflow-hidden",
                  tone.preview.bg
                )}
              >
                {/* Mini Nav */}
                <div
                  className={cn(
                    "h-4 w-full flex items-center px-2",
                    tone.preview.navBg
                  )}
                >
                  <div
                    className="w-2 h-2 rounded-sm"
                    style={{ backgroundColor: tone.preview.accent }}
                  />
                  <div className="flex gap-1 ml-auto">
                    <div
                      className={cn(
                        "w-4 h-1 rounded-full",
                        tone.value === "futuristic"
                          ? "bg-white/30"
                          : "bg-gray-300"
                      )}
                    />
                    <div
                      className={cn(
                        "w-4 h-1 rounded-full",
                        tone.value === "futuristic"
                          ? "bg-white/30"
                          : "bg-gray-300"
                      )}
                    />
                  </div>
                </div>

                {/* Mini Content */}
                <div className="p-2 space-y-1.5">
                  <div className={cn("truncate", tone.preview.heading)}>
                    Heading Text
                  </div>
                  <div
                    className={cn(
                      "w-16 h-1 rounded-full",
                      tone.value === "futuristic"
                        ? "bg-white/20"
                        : "bg-gray-200"
                    )}
                  />
                  <div className="flex gap-1">
                    <div className={cn(tone.preview.button)}>Button</div>
                  </div>
                </div>
              </div>

              {/* Label */}
              <div className="p-3 border-t border-inherit">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{tone.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {tone.description}
                    </p>
                  </div>
                  {currentTone === tone.value && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── SECTION 4 & 5: BRAND NAME + TAGLINE ─── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold">Brand Details</h3>
          <p className="text-xs text-muted-foreground">
            Your brand name and tagline appear throughout the generated design.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brand Name */}
          <div className="space-y-2">
            <Label htmlFor="brand-name" className="text-sm font-medium">
              Brand Name
            </Label>
            <Input
              id="brand-name"
              value={currentBrandName}
              onChange={(e) =>
                onUpdateField("brandName", e.target.value.slice(0, 30))
              }
              placeholder="Your brand name"
              maxLength={30}
              className="h-10"
            />
            <p className="text-[10px] text-muted-foreground">
              Appears in navigation, footer, and CTAs ({30 - currentBrandName.length} chars left)
            </p>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label htmlFor="tagline" className="text-sm font-medium">
              Tagline
            </Label>
            <Input
              id="tagline"
              value={currentTagline}
              onChange={(e) =>
                onUpdateField("tagline", e.target.value.slice(0, 100))
              }
              placeholder={
                currentIndustry === "restaurant"
                  ? "Describe your dining experience"
                  : currentIndustry === "medical"
                    ? "Your healthcare mission"
                    : currentIndustry === "fitness"
                      ? "Your fitness philosophy"
                      : "A short description of your product"
              }
              maxLength={100}
              className="h-10"
            />
            <p className="text-[10px] text-muted-foreground">
              Used as hero subtitle and page description ({100 - currentTagline.length} chars left)
            </p>
          </div>
        </div>
      </div>

      {/* ─── SECTION 6: SMART SUGGESTIONS ─── */}
      {suggestions && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Smart Suggestions</h3>
              <p className="text-xs text-muted-foreground">
                Based on{" "}
                <span className="font-medium text-foreground">
                  {INDUSTRIES.find((i) => i.value === currentIndustry)?.label}
                </span>{" "}
                +{" "}
                <span className="font-medium text-foreground">
                  {TONES.find((t) => t.value === currentTone)?.label}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Color Suggestion */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
              <div
                className="w-8 h-8 rounded-lg border shadow-sm flex-shrink-0"
                style={{ backgroundColor: suggestions.primaryColor }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Primary Color</p>
                <p className="text-[10px] text-muted-foreground font-mono uppercase">
                  {suggestions.primaryColor}
                </p>
              </div>
            </div>

            {/* Font Suggestion */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <TypeIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Typography</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {suggestions.headingFont}
                  {suggestions.bodyFont !== suggestions.headingFont &&
                    ` + ${suggestions.bodyFont}`}
                </p>
              </div>
            </div>

            {/* Preset Suggestion */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Layers className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">Design Style</p>
                <p className="text-[10px] text-muted-foreground truncate capitalize">
                  {suggestions.preset.replace(/-/g, " ")}
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => onApplySuggestions(suggestions)}
            className="w-full"
            size="sm"
          >
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Apply All Suggestions
          </Button>
        </div>
      )}
    </div>
  );
}