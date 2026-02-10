"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Type, Images, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorsSection } from "@/components/style-guide/colors";
import { TypographySection } from "@/components/style-guide/typography";
import { MoodBoardSection } from "@/components/style-guide/mood-board";
import { MoodBoardImage, ColorSection } from "@/types/style-guide";
import { useStyleGuide } from "@/hooks/use-style-guide";

export default function StyleGuidePage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const [activeTab, setActiveTab] = useState("colors");

  // Style guide hook (manages state + auto-save)
  const {
    styleGuide,
    isSaving,
    isLoading,
    addColor,
    removeColor,
    updateColor,
    setTypography,
    updateTypographyStyle,
    saveNow,
  } = useStyleGuide({ projectId });

  // Fetch mood board images
  const moodBoardImagesRaw = useQuery(
    api.moodboard.getMoodBoardImages,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const moodBoardImages: MoodBoardImage[] = (moodBoardImagesRaw || []).map((img) => ({
    id: img.id,
    storageId: img.storageId,
    url: img.url || undefined,
    uploaded: img.uploaded,
    uploading: img.uploading,
    isFromServer: img.isFromServer,
  }));

  // No project selected
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

  // Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Load a color preset
  const handleLoadPreset = (colors: ColorSection) => {
    // Replace all colors with preset
    (Object.entries(colors) as [keyof ColorSection, ColorSection[keyof ColorSection]][])
      .forEach(([category, swatches]) => {
        const existing = styleGuide.colors[category];

        for (let i = existing.length - 1; i >= 0; i--) {
          removeColor(category, i);
        }

        swatches.forEach((swatch) => {
          addColor(category, swatch);
        });
      });
  };

  const tabs = [
    { label: "Colors", value: "colors", icon: Palette },
    { label: "Typography", value: "typography", icon: Type },
    { label: "Mood Board", value: "moodboard", icon: Images },
  ];

  return (
    <div className="space-y-4">
      {/* Save indicator */}
      <div className="flex justify-end">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Tab List */}
        <div className="flex justify-center mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6">
          <ColorsSection
            colorGuide={styleGuide.colors}
            onAddColor={addColor}
            onRemoveColor={removeColor}
            onUpdateColor={updateColor}
            onLoadPreset={handleLoadPreset}
          />
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6">
          <TypographySection
            typographyGuide={styleGuide.typography}
            onUpdate={updateTypographyStyle}
            onLoadDefaults={setTypography}
          />
        </TabsContent>

        {/* Mood Board Tab */}
        <TabsContent value="moodboard" className="space-y-6">
          <MoodBoardSection
            projectId={projectId}
            initialImages={moodBoardImages}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}