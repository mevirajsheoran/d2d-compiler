// src/components/generation/generation-button.tsx

"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { FrameShape, Shape } from "@/redux/slice/shapes";
import { useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { generateFromFrame } from "@/lib/ai-pipeline";
import { useProjectStyleGuide } from "@/hooks/use-project-style-guide";
import { GenerationPanel } from "./generation-panel";
import { toast } from "sonner";

interface GenerationButtonProps {
  frame: FrameShape;
}

export function GenerationButton({ frame }: GenerationButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Get all shapes from Redux
  const shapesState = useAppSelector((state) => state.shapes);
  const allShapes: Shape[] = Object.values(
    shapesState.shapes.entities
  ).filter((s): s is Shape => s !== undefined);

  // Connect style guide from Convex
  const { styleGuide } = useProjectStyleGuide();

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const code = await generateFromFrame(
        frame,
        allShapes,
        styleGuide
      );

      setGeneratedCode(code);
      toast.success("Design generated!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate design");
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, frame, allShapes, styleGuide]);

  return (
    <>
      {/* Generate Button */}
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs shadow-md bg-background/80 backdrop-blur-sm"
        onClick={(e) => {
          e.stopPropagation();
          handleGenerate();
        }}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-3 w-3 mr-1" />
            Generate
          </>
        )}
      </Button>

      {/* Generation Panel (portal to body) */}
      {generatedCode &&
        typeof window !== "undefined" &&
        createPortal(
          <GenerationPanel
            code={generatedCode}
            onClose={() => setGeneratedCode(null)}
            onRegenerate={() => handleGenerate()}
            mode="fast"
          />,
          document.body
        )}
    </>
  );
}