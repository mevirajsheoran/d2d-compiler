// src/components/canvas/shapes/frame/index.tsx

"use client";

import { useState } from "react";
import { FrameShape, Shape } from "@/redux/slice/shapes";
import { useAppSelector } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { generateFrameSnapshot, downloadBlob } from "@/lib/frame-snapshot";
import { GenerationButton } from "@/components/generation/generation-button";
import { toast } from "sonner";

interface FrameProps {
  shape: FrameShape;
  isSelected?: boolean;
}

export function Frame({ shape, isSelected }: FrameProps) {
  const [isExporting, setIsExporting] = useState(false);

  const shapesState = useAppSelector((state) => state.shapes);
  const allShapes: Shape[] = Object.values(shapesState.shapes.entities).filter(
    (s): s is Shape => s !== undefined
  );

  const handleExport = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      const blob = await generateFrameSnapshot(shape, allShapes);
      const fileName = `Frame-${shape.frameNumber || 1}.png`;
      downloadBlob(blob, fileName);
      toast.success(`Exported ${fileName}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export frame");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
      }}
    >
      {/* Frame background - visible on both themes */}
      <div
        className="absolute inset-0 bg-white/[0.03] dark:bg-white/[0.05] border border-dashed border-gray-400 dark:border-gray-600"
        style={{
          borderRadius: 2,
        }}
      />

      {/* Dot grid inside frame */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 0.5px, transparent 0.5px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Frame label */}
      <div className="absolute -top-6 left-0 flex items-center gap-2 select-none pointer-events-none">
        <span className="text-xs font-medium text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
          Frame {shape.frameNumber || 1}
        </span>
      </div>

      {/* Action buttons - only when selected */}
      {isSelected && (
        <div className="absolute -top-9 right-0 flex gap-1">
          {/* Generate button (NEW) */}
          <GenerationButton frame={shape} />

          {/* Export PNG button (existing) */}
          <Button
            size="sm"
            variant="secondary"
            className="h-7 px-3 text-xs shadow-md"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-3 w-3 mr-1" />
                Export PNG
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}