// src/app/api/project/route.ts
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// Direct Convex save (fallback)
async function saveDirectToConvex(
  projectId: string,
  userId: string,
  shapes: string,
  viewportData: string
) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL not set");

  const convex = new ConvexHttpClient(url);

  let sketchesData: any = null;
  let viewport: any = null;

  try {
    sketchesData = typeof shapes === "string" ? JSON.parse(shapes) : shapes;
  } catch {
    sketchesData = shapes;
  }

  try {
    viewport = typeof viewportData === "string" ? JSON.parse(viewportData) : viewportData;
  } catch {
    viewport = viewportData;
  }

  // Use autosaveProject (no auth token needed, uses userId for verification)
  await convex.mutation(api.projects.autosaveProject, {
    projectId: projectId as Id<"projects">,
    userId: userId as Id<"users">,
    sketchesData,
    viewportData: viewport,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userId, shapes, viewportData } = body;

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: projectId and userId" },
        { status: 400 }
      );
    }

    // Try Inngest first (background processing with retries)
    try {
      await inngest.send({
        name: "project/autosave.requested",
        data: {
          projectId,
          userId,
          shapes: shapes || "{}",
          viewportData: viewportData || "{}",
        },
      });

      return NextResponse.json({
        success: true,
        method: "inngest",
        message: "Project save queued",
      });
    } catch (inngestError) {
      console.warn("[API] Inngest unavailable, falling back to direct save");

      // Fallback: Save directly to Convex
      try {
        await saveDirectToConvex(
          projectId,
          userId,
          shapes || "{}",
          viewportData || "{}"
        );

        return NextResponse.json({
          success: true,
          method: "direct",
          message: "Project saved directly",
        });
      } catch (convexError) {
        console.error("[API] Direct save failed:", convexError);
        return NextResponse.json(
          { error: "Failed to save project" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error("[API] Autosave error:", error);
    return NextResponse.json(
      { error: "Failed to process save request" },
      { status: 500 }
    );
  }
}