"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  ScanSearch,
  LayoutGrid,
  Paintbrush,
  Code2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { cn, combinedSlug } from "@/lib/utils";
import { toast } from "sonner";

import { VariationView } from "@/components/generation/variation-view";
import {
  generateVariations,
  generateWithPreset,
  getAllPresets,
  type Variation,
} from "@/lib/ai-pipeline/variation-generator";
import type { Shape, FrameShape } from "@/redux/slice/shapes";
import type { StyleGuide } from "@/types/style-guide";

/* ══════════════════════════════════════════════════════════════════════════════
   LOADING ANIMATION STEPS
   ══════════════════════════════════════════════════════════════════════════════ */

const LOADING_STEPS = [
  { id: "layout", label: "Analyzing layout...", icon: ScanSearch, delay: 0 },
  { id: "sections", label: "Detecting sections...", icon: LayoutGrid, delay: 300 },
  { id: "brand", label: "Applying brand identity...", icon: Paintbrush, delay: 600 },
  { id: "generate", label: "Generating 3 variations...", icon: Code2, delay: 900 },
  { id: "complete", label: "Complete!", icon: CheckCircle2, delay: 1200 },
];

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════════════════ */

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const session = params.session as string;

  const projectId = searchParams.get("project");
  const frameIdsParam = searchParams.get("frames") || "";

  const user = useAppSelector((state) => state.profile.user);
  const userSlug = user ? combinedSlug(user.name) : "";

  // ─── State ───
  const [variations, setVariations] = useState<Variation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [hasGenerated, setHasGenerated] = useState(false);
  const generationDone = useRef(false);

  // ─── Fetch Project from Convex ───
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  const updateProject = useMutation(api.projects.updateProject);

  // ─── Parse project data ───
  // In generate/page.tsx, replace the parseProjectData function with this:

  const parseProjectData = useCallback(() => {
    if (!project) return null;

    // Parse shapes — handle EntityState structure from Redux/Convex
    let allShapes: Shape[] = [];
    try {
      const sketchesData =
        typeof project.sketchesData === "string"
          ? JSON.parse(project.sketchesData)
          : project.sketchesData;

      // sketchesData.shapes is an EntityState: { ids: [...], entities: { id: Shape } }
      // OR it could be a plain array (backward compatibility)
      const shapesField = sketchesData?.shapes;

      if (shapesField && shapesField.ids && shapesField.entities) {
        // EntityState format — convert to plain array
        const ids: string[] = Array.isArray(shapesField.ids) ? shapesField.ids : [];
        allShapes = ids
          .map((id: string) => shapesField.entities[id])
          .filter((s: Shape | undefined): s is Shape => s !== undefined && s !== null);
      } else if (Array.isArray(shapesField)) {
        // Plain array format (backward compatibility)
        allShapes = shapesField;
      } else if (Array.isArray(sketchesData)) {
        // Entire sketchesData is the shapes array (legacy)
        allShapes = sketchesData;
      }
    } catch {
      console.error("[Generate] Failed to parse sketchesData");
      return null;
    }

    // Parse style guide
    let styleGuide: StyleGuide | null = null;
    try {
      if (project.styleGuide) {
        styleGuide =
          typeof project.styleGuide === "string"
            ? JSON.parse(project.styleGuide)
            : project.styleGuide;
      }
    } catch {
      console.error("[Generate] Failed to parse styleGuide");
    }

    // Find frames
    const frameIds = frameIdsParam
      ? frameIdsParam.split(",").filter(Boolean)
      : [];

    let frames: FrameShape[] = allShapes.filter(
      (s): s is FrameShape => s.type === "frame"
    );

    // If specific frames requested, filter to just those
    if (frameIds.length > 0) {
      frames = frames.filter((f) => frameIds.includes(f.id));
    }

    // Take first frame for generation
    const targetFrame = frames[0] || null;

    return { allShapes, styleGuide, targetFrame };
  }, [project, frameIdsParam]);

  // ─── Run Generation ───
  const runGeneration = useCallback(async () => {
    const data = parseProjectData();
    if (!data || !data.targetFrame) {
      toast.error("No frame found. Go back to canvas and draw a frame.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateVariations(
        data.targetFrame,
        data.allShapes,
        data.styleGuide
      );
      setVariations(result);
      generationDone.current = true;

      // Cache results to Convex
      try {
        const inputStr = JSON.stringify({
          shapes: data.allShapes.length,
          guide: data.styleGuide?.preset || "none",
        });
        let hash = 0;
        for (let i = 0; i < inputStr.length; i++) {
          const chr = inputStr.charCodeAt(i);
          hash = (hash << 5) - hash + chr;
          hash |= 0;
        }

        await updateProject({
          projectId: projectId as Id<"projects">,
          generatedDesignData: {
            inputHash: hash.toString(36),
            generatedAt: Date.now(),
            variations: result.map((v) => ({
              presetName: v.presetName,
              presetLabel: v.presetLabel,
              presetDescription: v.presetDescription,
              code: v.code,
            })),
          },
        });
      } catch (cacheError) {
        console.error("[Generate] Failed to cache results:", cacheError);
        // Non-critical, don't block
      }
    } catch (error) {
      console.error("[Generate] Pipeline error:", error);
      toast.error("Generation failed. Please try again.");
      setIsLoading(false);
    }
  }, [parseProjectData, projectId, updateProject]);

  // ─── Loading Animation + Generation Trigger ───
  useEffect(() => {
    if (!project || hasGenerated) return;

    // Check cache first
    const cached = project.generatedDesignData as {
      inputHash?: string;
      variations?: Variation[];
    } | null;

    if (cached?.variations && cached.variations.length > 0) {
      setVariations(cached.variations);
      setIsLoading(false);
      setHasGenerated(true);
      return;
    }

    // Start generation immediately
    runGeneration();
    setHasGenerated(true);

    // Run loading animation (1.5 seconds)
    const timers: NodeJS.Timeout[] = [];
    LOADING_STEPS.forEach((step, index) => {
      const timer = setTimeout(() => {
        setLoadingStep(index);
      }, step.delay);
      timers.push(timer);
    });

    // End loading animation after 1.5s
    const endTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    timers.push(endTimer);

    return () => timers.forEach(clearTimeout);
  }, [project, hasGenerated, runGeneration]);

  // ─── Handle Style Change ("Try Another Style") ───
  const handleStyleChange = useCallback(
    async (presetName: string, variationIndex: number) => {
      const data = parseProjectData();
      if (!data || !data.targetFrame) return;

      try {
        const newVariation = await generateWithPreset(
          data.targetFrame,
          data.allShapes,
          data.styleGuide,
          presetName
        );

        setVariations((prev) => {
          if (!prev) return prev;
          const updated = [...prev];
          updated[variationIndex] = newVariation;
          return updated;
        });

        toast.success(`Switched to ${newVariation.presetLabel}`);
      } catch {
        toast.error("Failed to switch style");
      }
    },
    [parseProjectData]
  );

  // ─── No project ───
  if (!projectId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">No project selected</p>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/${userSlug}`}>Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ─── Project loading ───
  if (project === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const canvasUrl = `/dashboard/${userSlug}/canvas?project=${projectId}`;
  const styleGuideUrl = `/dashboard/${session}/style-guide?project=${projectId}${frameIdsParam ? `&frames=${frameIdsParam}` : ""}`;

  return (
    <div className="min-h-screen bg-background">
      {/* ─── Top Bar ─── */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link href={canvasUrl}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Canvas</span>
                </Link>
              </Button>

              <div className="w-px h-5 bg-border" />

              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="font-semibold">D2D Generation</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="gap-1.5" asChild>
              <Link href={styleGuideUrl}>
                <Paintbrush className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Style Guide</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="container mx-auto px-4 py-8">
        {/* Loading Animation */}
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-8 max-w-md">
              {/* Sparkle icon */}
              <div className="relative mx-auto w-16 h-16">
                <Sparkles className="w-16 h-16 text-primary animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 text-primary blur-xl opacity-30">
                  <Sparkles className="w-16 h-16" />
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {LOADING_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === loadingStep;
                  const isComplete = index < loadingStep;

                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-500",
                        isComplete
                          ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-400/10"
                          : isActive
                            ? "text-primary bg-primary/5"
                            : "text-muted-foreground/40"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 flex-shrink-0",
                          isActive && "animate-pulse"
                        )}
                      />
                      <span className="text-sm font-medium">{step.label}</span>
                      {isComplete && (
                        <CheckCircle2 className="h-4 w-4 ml-auto text-emerald-500" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{
                    width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Variations */}
        {!isLoading && variations && variations.length > 0 && (
          <VariationView
            variations={variations}
            onStyleChange={handleStyleChange}
            allPresets={getAllPresets()}
          />
        )}

        {/* No results / error state */}
        {!isLoading && (!variations || variations.length === 0) && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
              <p className="text-muted-foreground">
                No design could be generated. Make sure you have shapes drawn
                inside a frame.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" asChild>
                  <Link href={canvasUrl}>Back to Canvas</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href={styleGuideUrl}>Edit Style Guide</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}