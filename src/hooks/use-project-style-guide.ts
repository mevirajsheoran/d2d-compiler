// src/hooks/use-project-style-guide.ts

"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSearchParams } from "next/navigation";
import type { StyleGuide } from "@/types/style-guide";
import type { Id } from "../../convex/_generated/dataModel";

/**
 * READ-ONLY hook to fetch style guide for the current project.
 * Used by GenerationButton on the canvas page to pass
 * style context to the AI pipeline.
 * 
 * Different from useStyleGuide (use-style-guide.ts) which is
 * the full CRUD hook used by the style guide editor page.
 */
export function useProjectStyleGuide(): {
  styleGuide: StyleGuide | null;
  isLoading: boolean;
} {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Still loading
  if (project === undefined) {
    return { styleGuide: null, isLoading: true };
  }

  // Project not found or no style guide
  if (!project || !project.styleGuide) {
    return { styleGuide: null, isLoading: false };
  }

  // Parse the JSON string
  try {
    const parsed =
      typeof project.styleGuide === "string"
        ? JSON.parse(project.styleGuide)
        : project.styleGuide;

    return { styleGuide: parsed as StyleGuide, isLoading: false };
  } catch (error) {
    console.warn("[useProjectStyleGuide] Failed to parse:", error);
    return { styleGuide: null, isLoading: false };
  }
}