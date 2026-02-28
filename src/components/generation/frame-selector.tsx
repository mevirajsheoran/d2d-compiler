"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Frame, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FrameInfo {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

interface FrameSelectorProps {
  frames: FrameInfo[];
  onSelect: (frameIds: string[]) => void;
  onClose: () => void;
}

export function FrameSelector({ frames, onSelect, onClose }: FrameSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(frames.map((f) => f.id))
  );

  const toggleFrame = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selectedIds.size === 0) return;
    onSelect(Array.from(selectedIds));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background rounded-2xl border shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Select Frames</h2>
            <p className="text-sm text-muted-foreground">
              Choose which frames you&apos;d like to generate designs for
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Frame List */}
        <div className="p-5 space-y-2 max-h-[400px] overflow-auto">
          {frames.map((frame, index) => {
            const isSelected = selectedIds.has(frame.id);

            return (
              <button
                key={frame.id}
                onClick={() => toggleFrame(frame.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 text-left",
                  "hover:border-primary/50",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-muted"
                )}
              >
                {/* Checkbox */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 12 12"
                      className="w-3 h-3 text-primary-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                {/* Frame icon */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Frame className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    Frame {index + 1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(frame.w)} × {Math.round(frame.h)}px
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t bg-muted/30">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size} frame{selectedIds.size !== 1 ? "s" : ""} selected
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleContinue}
              disabled={selectedIds.size === 0}
              className="gap-1.5"
            >
              Continue to Style Guide
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}