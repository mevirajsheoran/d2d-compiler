// src/components/generation/generation-button.tsx

"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import type { FrameShape, Shape } from "@/redux/slice/shapes";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { FrameSelector } from "./frame-selector";

interface GenerationButtonProps {
  frame: FrameShape;
}

export function GenerationButton({ frame }: GenerationButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();

  const session = params.session as string;
  const projectId = searchParams.get("project");

  const shapesState = useAppSelector((state) => state.shapes);
  const viewportState = useAppSelector((state) => state.viewport);

  const updateProject = useMutation(api.projects.updateProject);

  const [isSaving, setIsSaving] = useState(false);
  const [showFrameSelector, setShowFrameSelector] = useState(false);

  // Get all frames from current shapes (entity adapter → array)
  const getFrames = useCallback((): FrameShape[] => {
    const { ids, entities } = shapesState.shapes;
    const idArray = Array.isArray(ids) ? ids : [];
    return idArray
      .map((id: string) => entities[id])
      .filter((s): s is FrameShape => s !== undefined && s !== null && s.type === "frame");
  }, [shapesState.shapes]);

  const handleGenerate = useCallback(async () => {
    if (isSaving) return;
    if (!projectId) {
      toast.error("No project found. Save your project first.");
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Build save data matching auto-save structure exactly
      const sketchesData = {
        shapes: shapesState.shapes,          // EntityState { ids, entities }
        tool: shapesState.tool,
        frameCounter: shapesState.frameCounter,
      };
      const viewportData = {
        translate: viewportState.translate,
        scale: viewportState.scale,
      };

      // Step 2: Force save via direct Convex mutation (awaited, authenticated)
      await updateProject({
        projectId: projectId as Id<"projects">,
        sketchesData,
        viewportData,
      });

      // Step 3: Determine navigation based on frame count
      const frames = getFrames();

      if (frames.length === 0) {
        toast.error("Draw a frame first (press F) to define your artboard");
        return;
      }

      if (frames.length === 1) {
        // Single frame → go directly to style guide
        router.push(
          `/dashboard/${session}/style-guide?project=${projectId}&frames=${frames[0].id}`
        );
      } else {
        // Multiple frames → show frame selector modal
        setShowFrameSelector(true);
      }
    } catch (error) {
      console.error("[GenerationButton] Force save failed:", error);
      toast.error("Failed to save. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  }, [
    isSaving,
    projectId,
    session,
    shapesState.shapes,
    shapesState.tool,
    shapesState.frameCounter,
    viewportState.translate,
    viewportState.scale,
    updateProject,
    getFrames,
    router,
  ]);

  // Called when frame selector modal confirms selection
  const handleFramesSelected = useCallback(
    (selectedFrameIds: string[]) => {
      setShowFrameSelector(false);
      const frameParam = selectedFrameIds.join(",");
      router.push(
        `/dashboard/${session}/style-guide?project=${projectId}&frames=${frameParam}`
      );
    },
    [router, session, projectId]
  );

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs shadow-md bg-background/80 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleGenerate();
        }}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Wand2 className="h-3 w-3 mr-1" />
            Generate
          </>
        )}
      </Button>

      {showFrameSelector && (
        <FrameSelector
          frames={getFrames().map((f) => ({
            id: f.id,
            w: f.w,
            h: f.h,
            x: f.x,
            y: f.y,
          }))}
          onSelect={handleFramesSelected}
          onClose={() => setShowFrameSelector(false)}
        />
      )}
    </>
  );
}