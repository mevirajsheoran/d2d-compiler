// src/components/projects/provider.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { fetchProjectsSuccess } from "@/redux/slice/projects";

interface ProjectsProviderProps {
  children: React.ReactNode;
  initialProjects: any;
}

export function ProjectsProvider({
  children,
  initialProjects,
}: ProjectsProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!initialProjects) return;

    try {
      // Convex preloadQuery wraps data in _valueJSON
      let data = initialProjects;

      if (data._valueJSON !== undefined) {
        data = data._valueJSON;
      }

      if (!data) return;

      // getUserProjects returns { projects: [...], total: N }
      const projects = data.projects || [];
      const total = data.total || projects.length;

      dispatch(
        fetchProjectsSuccess({
          projects,
          total,
        })
      );
    } catch (error) {
      console.error("Failed to load projects into Redux:", error);
    }
  }, [initialProjects, dispatch]);

  return <>{children}</>;
}