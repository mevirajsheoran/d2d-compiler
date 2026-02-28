"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Type,
  Sparkles,
  Layers,
  Loader2,
  Save,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorsSection } from "@/components/style-guide/colors";
import { TypographySection } from "@/components/style-guide/typography";
import { DesignBriefSection } from "@/components/style-guide/design-brief";
import { PresetSelector } from "@/components/style-guide/preset-selector";
import { ColorSection, TypographySection as TypographySectionType } from "@/types/style-guide";
import { useStyleGuide } from "@/hooks/use-style-guide";
import { useAppSelector } from "@/redux/store";
import { combinedSlug } from "@/lib/utils";
import { toast } from "sonner";
import type { Suggestions } from "@/lib/ai-pipeline/industry-content";

/* ══════════════════════════════════════════════════════════════════════════════
   TYPOGRAPHY DEFAULTS (used by "Apply All" for font suggestions)
   ══════════════════════════════════════════════════════════════════════════════ */

function buildTypographyFromFonts(
  headingFont: string,
  bodyFont: string
): TypographySectionType[] {
  const headingFamily = `${headingFont}, sans-serif`;
  const bodyFamily = `${bodyFont}, sans-serif`;

  return [
    {
      title: "Headings",
      description: "Used for page titles and section headers",
      styles: [
        { name: "Heading 1", fontFamily: headingFamily, fontSize: "48px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-0.02em" },
        { name: "Heading 2", fontFamily: headingFamily, fontSize: "36px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-0.01em" },
        { name: "Heading 3", fontFamily: headingFamily, fontSize: "24px", fontWeight: "600", lineHeight: "1.3", letterSpacing: "0" },
        { name: "Heading 4", fontFamily: headingFamily, fontSize: "20px", fontWeight: "600", lineHeight: "1.4", letterSpacing: "0" },
      ],
    },
    {
      title: "Body Text",
      description: "Used for paragraphs, descriptions, and general content",
      styles: [
        { name: "Body Large", fontFamily: bodyFamily, fontSize: "18px", fontWeight: "400", lineHeight: "1.6", letterSpacing: "0" },
        { name: "Body", fontFamily: bodyFamily, fontSize: "16px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0" },
        { name: "Body Small", fontFamily: bodyFamily, fontSize: "14px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0" },
        { name: "Caption", fontFamily: bodyFamily, fontSize: "12px", fontWeight: "500", lineHeight: "1.4", letterSpacing: "0.01em" },
      ],
    },
  ];
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export default function StyleGuidePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const session = params.session as string;

  const projectId = searchParams.get("project");
  const frameIds = searchParams.get("frames") || "";

  const user = useAppSelector((state) => state.profile.user);

  const [activeTab, setActiveTab] = useState("brief");

  // ─── Style Guide Hook ───
  const {
    styleGuide,
    isSaving,
    isLoading,
    addColor,
    removeColor,
    updateColor,
    setTypography,
    updateTypographyStyle,
    setBrief,
    updateBriefField,
    setPreset,
    saveNow,
  } = useStyleGuide({ projectId });

  // ─── Computed Suggestions ───
  const suggestions = useMemo(() => {
    const brief = styleGuide.brief;
    if (!brief?.industry || !brief?.tone) return null;
    // Import dynamically to avoid module-level import
    const { getSuggestions } = require("@/lib/ai-pipeline/industry-content");
    return getSuggestions(brief.industry, brief.tone) as Suggestions;
  }, [styleGuide.brief?.industry, styleGuide.brief?.tone]);

  // ─── No project selected ───
  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No project selected</p>
        <p className="text-sm text-muted-foreground">
          Select a project from the dashboard
        </p>
      </div>
    );
  }

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ─── Load a color preset (clears and replaces) ───
  const handleLoadPreset = (colors: ColorSection) => {
    (
      Object.entries(colors) as [
        keyof ColorSection,
        ColorSection[keyof ColorSection],
      ][]
    ).forEach(([category, swatches]) => {
      const existing = styleGuide.colors[category];

      // Remove existing colors in reverse order
      for (let i = existing.length - 1; i >= 0; i--) {
        removeColor(category, i);
      }

      // Add new colors
      swatches.forEach((swatch) => {
        addColor(category, swatch);
      });
    });
  };

  // ─── Apply All Suggestions ───
  const handleApplySuggestions = (sugg: Suggestions) => {
    // 1. Set preset
    setPreset(sugg.preset);

    // 2. Set primary color
    const primaryColors: ColorSection = {
      primary: [
        { name: "Primary", hexColor: sugg.primaryColor },
      ],
      secondary: [],
      accent: [],
      neutral: [],
      semantic: [],
    };

    // Only replace primary, keep others as-is
    const existingPrimary = styleGuide.colors.primary;
    for (let i = existingPrimary.length - 1; i >= 0; i--) {
      removeColor("primary", i);
    }
    primaryColors.primary.forEach((swatch) => {
      addColor("primary", swatch);
    });

    // 3. Set typography
    const typography = buildTypographyFromFonts(
      sugg.headingFont,
      sugg.bodyFont
    );
    setTypography(typography);

    toast.success("Suggestions applied! Switch to Colors and Typography tabs to see changes.");
  };

  // ─── Handle Generate ───
  const handleGenerate = () => {
    // Force save current state
    saveNow();

    // Navigate to generation page
    const generateUrl = `/dashboard/${session}/generate?project=${projectId}${frameIds ? `&frames=${frameIds}` : ""}`;
    router.push(generateUrl);
  };

  // ─── Tabs Config ───
  const tabs = [
    { label: "Design Brief", value: "brief", icon: Sparkles },
    { label: "Design Style", value: "style", icon: Layers },
    { label: "Colors", value: "colors", icon: Palette },
    { label: "Typography", value: "typography", icon: Type },
  ];

  return (
    <div className="space-y-4">
      {/* ─── Save Indicator ─── */}
      <div className="flex items-center justify-between">
        {/* Frame info (if frames selected) */}
        {frameIds && (
          <p className="text-xs text-muted-foreground">
            Generating for {frameIds.split(",").length} frame
            {frameIds.split(",").length !== 1 ? "s" : ""}
          </p>
        )}
        {!frameIds && <div />}

        <Button
          variant="outline"
          size="sm"
          className="text-xs gap-1.5"
          onClick={saveNow}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Save className="h-3 w-3" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* ─── Tabs ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* ─── Design Brief Tab ─── */}
        <TabsContent value="brief" className="space-y-6">
          <DesignBriefSection
            brief={styleGuide.brief}
            onUpdateField={updateBriefField}
            onApplySuggestions={handleApplySuggestions}
          />
        </TabsContent>

        {/* ─── Design Style Tab ─── */}
        <TabsContent value="style" className="space-y-6">
          <PresetSelector
            selectedPreset={styleGuide.preset}
            recommendedPreset={suggestions?.preset}
            onSelectPreset={setPreset}
          />
        </TabsContent>

        {/* ─── Colors Tab ─── */}
        <TabsContent value="colors" className="space-y-6">
          <ColorsSection
            colorGuide={styleGuide.colors}
            onAddColor={addColor}
            onRemoveColor={removeColor}
            onUpdateColor={updateColor}
            onLoadPreset={handleLoadPreset}
          />
        </TabsContent>

        {/* ─── Typography Tab ─── */}
        <TabsContent value="typography" className="space-y-6">
          <TypographySection
            typographyGuide={styleGuide.typography}
            onUpdate={updateTypographyStyle}
            onLoadDefaults={setTypography}
          />
        </TabsContent>
      </Tabs>

      {/* ─── Generate Button ─── */}
      <div className="flex justify-center pt-6 pb-8">
        <Button
          onClick={handleGenerate}
          size="lg"
          className="w-full max-w-md h-12 text-base gap-2"
        >
          <Wand2 className="h-5 w-5" />
          Generate Design
        </Button>
      </div>
    </div>
  );
}