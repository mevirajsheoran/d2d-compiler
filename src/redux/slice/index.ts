// src/redux/slice/index.ts
import profileReducer from "./profile";
import projectsReducer from "./projects";
import shapesReducer from "./shapes";
import viewportReducer from "./viewport";

export const slices = {
  profile: profileReducer,
  projects: projectsReducer,
  shapes: shapesReducer,
  viewport: viewportReducer,
} as const;