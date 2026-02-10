// src/app/(protected)/dashboard/[session]/page.tsx
import { ProjectsQuery } from "@/convex/query.config";
import { ProjectsProvider } from "@/components/projects/provider";
import { ProjectList } from "@/components/projects/list";
import { redirect } from "next/navigation";

export default async function SessionPage() {
  let projects = null;
  let profile = null;

  try {
    const result = await ProjectsQuery();
    projects = result.projects;
    profile = result.profile;
  } catch (error) {
    console.error("Failed to load projects:", error);
  }

  // If no profile, user is not logged in
  if (!profile) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage your wireframe projects
        </p>
      </div>

      {/* Projects Grid */}
      <ProjectsProvider initialProjects={projects}>
        <ProjectList />
      </ProjectsProvider>
    </div>
  );
} 