// src/hooks/use-project-moodboard.ts

"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearchParams } from "next/navigation";
import type { Id } from "../../convex/_generated/dataModel";

/* ══════════════════════════════════════════════════════════
   USE PROJECT MOODBOARD
   
   Fetches moodboard image URLs for the current project
   from Convex. The moodboard images are stored as
   Convex storage IDs in the project, and the
   getMoodBoardImages query converts them to URLs.
   
   Used by: GenerationButton to pass moodboard context
   to the MoodboardAnalyzer → Design Brain pipeline.
   ══════════════════════════════════════════════════════════ */
export function useProjectMoodboard(): {
  imageUrls: string[];
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const images = useQuery(
    api.moodboard.getMoodBoardImages,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Still loading
  if (images === undefined) {
    return { imageUrls: [], isLoading: true };
  }

  // No images or empty
  if (!images || images.length === 0) {
    return { imageUrls: [], isLoading: false };
  }

  // Extract URLs, filter out nulls
  const urls = images
    .filter(
      (img): img is typeof img & { url: string } =>
        img !== null && typeof img.url === "string"
    )
    .map((img) => img.url);

  return { imageUrls: urls, isLoading: false };
}