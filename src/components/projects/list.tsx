// src/components/projects/list.tsx
"use client";

import { useAppSelector } from "@/redux/store";
import { Card, CardContent } from "@/components/ui/card";
import { CreateProjectButton } from "@/components/buttons/project";
import { formatRelativeTime, combinedSlug } from "@/lib/utils";
import Link from "next/link";
import { Plus, MoreHorizontal, Trash2, Copy, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useAppDispatch } from "@/redux/store";
import { removeProject, addProject } from "@/redux/slice/projects";
import { toast } from "sonner";

export function ProjectList() {
  const { projects, isLoading } = useAppSelector((state) => state.projects);
  const user = useAppSelector((state) => state.profile.user);
  const userSlug = user ? combinedSlug(user.name) : "";
  const dispatch = useAppDispatch();

  const deleteProjectMutation = useMutation(api.projects.deleteProject);
  const duplicateProjectMutation = useMutation(api.projects.duplicateProject);

  const handleDelete = async (projectId: string) => {
    try {
      await deleteProjectMutation({
        projectId: projectId as Id<"projects">,
      });
      dispatch(removeProject(projectId));
      toast.success("Project deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleDuplicate = async (projectId: string) => {
    try {
      const result = await duplicateProjectMutation({
        projectId: projectId as Id<"projects">,
      });

      // Add the new project to Redux
      dispatch(
        addProject({
          id: result.projectId,
          name: result.name,
          projectNumber: result.projectNumber,
          thumbnail: null,
          lastModified: Date.now(),
          createdAt: Date.now(),
        })
      );

      toast.success("Project duplicated");
    } catch (error) {
      console.error("Duplicate failed:", error);
      toast.error("Failed to duplicate project");
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-[4/3] bg-muted rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Create New Project Card */}
      <CreateProjectCard />

      {/* Project Cards */}
      {projects.map((project) => (
        <Card
          key={project.id}
          className="group cursor-pointer hover:border-primary/50 transition-all hover:shadow-lg overflow-hidden"
        >
          <CardContent className="p-0 relative">
            {/* Dropdown Menu */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Open rename dialog
                      toast.info("Rename coming soon!");
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDuplicate(project.id);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Clickable Area */}
            <Link href={`/dashboard/${userSlug}/canvas?project=${project.id}`}>
              {/* Thumbnail */}
              <div className="aspect-[4/3] relative overflow-hidden">
                {project.thumbnail ? (
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary/30">
                      {project.projectNumber}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatRelativeTime(project.lastModified)}
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}

      {/* Empty State - only show if no projects exist */}
      {projects.length === 0 && (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <p className="text-lg">No projects yet</p>
          <p className="text-sm mt-2">
            Create your first project to get started!
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Create New Project Card
 */
function CreateProjectCard() {
  return (
    <Card className="group hover:border-primary transition-colors border-dashed">
      <CardContent className="p-0 h-full">
        <div className="aspect-[4/3] flex flex-col items-center justify-center gap-4 text-muted-foreground group-hover:text-primary transition-colors">
          <div className="w-14 h-14 rounded-full border-2 border-dashed border-current flex items-center justify-center">
            <Plus className="w-7 h-7" />
          </div>
          <span className="font-medium text-sm">New Project</span>
        </div>
        <div className="p-4 pt-0 flex justify-center">
          <CreateProjectButton />
        </div>
      </CardContent>
    </Card>
  );
}