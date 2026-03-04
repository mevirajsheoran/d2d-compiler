"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Id } from "@/../convex/_generated/dataModel";
import { Loader2 } from "lucide-react";
import { InfiniteCanvas } from "@/components/canvas";
import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/redux/store";
import { loadProject, clearAll, Shape } from "@/redux/slice/shapes";
import { restoreViewport, resetView } from "@/redux/slice/viewport";

// v5.0: Generate button overlay
import GenerateButton from "@/components/canvas/generate-button";

/**
 * Rebuild EntityState from saved data
 * Handles both EntityState format and plain arrays
 */
function rebuildShapesState(data: any) {
  if (!data) return null;

  // Already in EntityState format with ids and entities
  if (data.shapes && data.shapes.ids && data.shapes.entities) {
    return {
      shapes: data.shapes,
      tool: data.tool || "select",
      frameCounter: data.frameCounter || 0,
      selected: {},
    };
  }

  // shapes is a flat object of entities (no ids array)
  if (data.shapes && data.shapes.entities && !data.shapes.ids) {
    const entities = data.shapes.entities;
    const ids = Object.keys(entities);
    return {
      shapes: { ids, entities },
      tool: data.tool || "select",
      frameCounter: data.frameCounter || 0,
      selected: {},
    };
  }

  // shapes is an array
  if (Array.isArray(data.shapes)) {
    const entities: Record<string, Shape> = {};
    const ids: string[] = [];

    data.shapes.forEach((shape: Shape) => {
      if (shape && shape.id) {
        entities[shape.id] = shape;
        ids.push(shape.id);
      }
    });

    return {
      shapes: { ids, entities },
      tool: data.tool || "select",
      frameCounter: data.frameCounter || 0,
      selected: {},
    };
  }

  // data itself might be EntityState (legacy format)
  if (data.ids && data.entities) {
    return {
      shapes: data,
      tool: "select",
      frameCounter: 0,
      selected: {},
    };
  }

  return null;
}

export default function CanvasPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const session = params.session as string;
  const projectId = searchParams.get("project");
  const dispatch = useAppDispatch();
  const loadedRef = useRef<string | null>(null);

  // Fetch project data
  const project = useQuery(
    api.projects.getProject,
    projectId ? { projectId: projectId as Id<"projects"> } : "skip"
  );

  // Load project data into Redux
  useEffect(() => {
    if (!project) return;

    // Prevent re-loading the same project
    const projectKey = project._id + "-" + project.lastModified;
    if (loadedRef.current === projectKey) return;
    loadedRef.current = projectKey;

    // Load shapes
    if (project.sketchesData) {
      try {
        const data =
          typeof project.sketchesData === "string"
            ? JSON.parse(project.sketchesData)
            : project.sketchesData;

        const shapesState = rebuildShapesState(data);

        if (shapesState) {
          dispatch(loadProject(shapesState));
          console.log("[Canvas] Loaded project shapes:", {
            shapeCount: shapesState.shapes.ids.length,
            frameCounter: shapesState.frameCounter,
          });
        } else {
          console.warn("[Canvas] Could not rebuild shapes state, clearing");
          dispatch(clearAll());
        }
      } catch (e) {
        console.error("[Canvas] Failed to parse sketches data:", e);
        dispatch(clearAll());
      }
    } else {
      dispatch(clearAll());
    }

    // Load viewport
    if (project.viewportData) {
      try {
        const data =
          typeof project.viewportData === "string"
            ? JSON.parse(project.viewportData)
            : project.viewportData;

        dispatch(
          restoreViewport({
            scale: data.scale || 1,
            translate: data.translate || { x: 0, y: 0 },
          })
        );
      } catch (e) {
        console.error("[Canvas] Failed to parse viewport data:", e);
        dispatch(resetView());
      }
    } else {
      dispatch(resetView());
    }
  }, [project, dispatch]);

  // No project selected
  if (!projectId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-lg">No project selected</p>
        <p className="text-sm">Select a project from the dashboard</p>
      </div>
    );
  }

  // Loading
  if (project === undefined) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not found
  if (project === null) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p className="text-lg">Project not found</p>
        <p className="text-sm">The project may have been deleted</p>
      </div>
    );
  }

  return (
    <>
      <InfiniteCanvas />
      <GenerateButton session={session} projectId={projectId} />
    </>
  );
}