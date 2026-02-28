"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import {
  StyleGuide,
  ColorSection,
  TypographySection,
  DesignBrief,
} from "@/types/style-guide";
import { toast } from "sonner";

const DEFAULT_BRIEF: DesignBrief = {
  pageType: "",
  industry: "",
  tone: "",
  brandName: "",
  tagline: "",
};

const DEFAULT_STYLE_GUIDE: StyleGuide = {
  colors: {
    primary: [],
    secondary: [],
    accent: [],
    neutral: [],
    semantic: [],
  },
  typography: [],
  brief: undefined,
  preset: undefined,
};

interface UseStyleGuideProps {
  projectId: string | null;
}

export function useStyleGuide({ projectId }: UseStyleGuideProps) {
  const [styleGuide, setStyleGuide] = useState<StyleGuide>(DEFAULT_STYLE_GUIDE);
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch project
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Convex mutation to update project
  const updateProject = useMutation(api.projects.updateProject);

  // Load style guide from project on first load
  useEffect(() => {
    if (project && !hasLoaded) {
      if (project.styleGuide) {
        try {
          const parsed =
            typeof project.styleGuide === "string"
              ? JSON.parse(project.styleGuide)
              : project.styleGuide;

          setStyleGuide({
            ...DEFAULT_STYLE_GUIDE,
            ...parsed,
            colors: {
              ...DEFAULT_STYLE_GUIDE.colors,
              ...(parsed.colors || {}),
            },
            brief: parsed.brief || undefined,
            preset: parsed.preset || undefined,
          });
        } catch {
          setStyleGuide(DEFAULT_STYLE_GUIDE);
        }
      }
      setHasLoaded(true);
    }
  }, [project, hasLoaded]);

  // Debounced save to Convex
  const saveToConvex = useCallback(
    async (data: StyleGuide) => {
      if (!projectId) return;

      setIsSaving(true);
      try {
        await updateProject({
          projectId: projectId as Id<"projects">,
          styleGuide: JSON.stringify(data),
        });
      } catch (error) {
        console.error("Failed to save style guide:", error);
        toast.error("Failed to save style guide");
      } finally {
        setIsSaving(false);
      }
    },
    [projectId, updateProject]
  );

  // Auto-save with debounce (800ms after last change)
  const scheduleAutoSave = useCallback(
    (updatedGuide: StyleGuide) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveToConvex(updatedGuide);
      }, 800);
    },
    [saveToConvex]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // ============================================
  // COLOR OPERATIONS
  // ============================================

  const addColor = useCallback(
    (
      category: keyof ColorSection,
      color: { name: string; hexColor: string; description?: string }
    ) => {
      setStyleGuide((prev) => {
        const updated = {
          ...prev,
          colors: {
            ...prev.colors,
            [category]: [...prev.colors[category], color],
          },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const removeColor = useCallback(
    (category: keyof ColorSection, index: number) => {
      setStyleGuide((prev) => {
        const updated = {
          ...prev,
          colors: {
            ...prev.colors,
            [category]: prev.colors[category].filter((_, i) => i !== index),
          },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateColor = useCallback(
    (
      category: keyof ColorSection,
      index: number,
      color: { name: string; hexColor: string; description?: string }
    ) => {
      setStyleGuide((prev) => {
        const updated = {
          ...prev,
          colors: {
            ...prev.colors,
            [category]: prev.colors[category].map((c, i) =>
              i === index ? color : c
            ),
          },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // ============================================
  // TYPOGRAPHY OPERATIONS
  // ============================================

  const setTypography = useCallback(
    (typography: TypographySection[]) => {
      setStyleGuide((prev) => {
        const updated = { ...prev, typography };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  const updateTypographyStyle = useCallback(
    (
      sectionIndex: number,
      styleIndex: number,
      patch: Record<string, string>
    ) => {
      setStyleGuide((prev) => {
        const updated = {
          ...prev,
          typography: prev.typography.map((section, si) =>
            si === sectionIndex
              ? {
                  ...section,
                  styles: section.styles.map((style, sti) =>
                    sti === styleIndex ? { ...style, ...patch } : style
                  ),
                }
              : section
          ),
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // ============================================
  // BRIEF OPERATIONS (NEW)
  // ============================================

  /**
   * Set the entire brief object at once.
   */
  const setBrief = useCallback(
    (brief: DesignBrief) => {
      setStyleGuide((prev) => {
        const updated = { ...prev, brief };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  /**
   * Update a single field of the brief.
   * Creates the brief with defaults if it doesn't exist yet.
   */
  const updateBriefField = useCallback(
    (field: keyof DesignBrief, value: string) => {
      setStyleGuide((prev) => {
        const currentBrief: DesignBrief = prev.brief || { ...DEFAULT_BRIEF };
        const updated = {
          ...prev,
          brief: { ...currentBrief, [field]: value },
        };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // ============================================
  // PRESET OPERATIONS (NEW)
  // ============================================

  /**
   * Set the design preset name.
   */
  const setPreset = useCallback(
    (presetName: string) => {
      setStyleGuide((prev) => {
        const updated = { ...prev, preset: presetName };
        scheduleAutoSave(updated);
        return updated;
      });
    },
    [scheduleAutoSave]
  );

  // ============================================
  // SAVE
  // ============================================

  // Manual save
  const saveNow = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveToConvex(styleGuide);
    toast.success("Style guide saved");
  }, [saveToConvex, styleGuide]);

  return {
    styleGuide,
    isSaving,
    isLoading: project === undefined,
    hasLoaded,

    // Color operations
    addColor,
    removeColor,
    updateColor,

    // Typography operations
    setTypography,
    updateTypographyStyle,

    // Brief operations (NEW)
    setBrief,
    updateBriefField,

    // Preset operations (NEW)
    setPreset,

    // Save
    saveNow,
  };
}