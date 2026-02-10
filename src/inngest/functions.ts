// src/inngest/functions.ts
import { inngest } from "./client";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

// Create Convex client for server-side calls
const getConvexClient = () => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
  }
  return new ConvexHttpClient(url);
};

/**
 * Safely parse JSON — handles both string and object input
 */
function safeParse(data: any): any {
  if (!data) return null;
  if (typeof data === "object") return data;
  try {
    return JSON.parse(data);
  } catch {
    console.warn("[Inngest] Failed to parse data, using raw value");
    return data;
  }
}

/**
 * Autosave Project Workflow
 */
export const autosaveProjectWorkflow = inngest.createFunction(
  {
    id: "autosave-project",
    name: "Autosave Project",
    retries: 3,
  },
  { event: "project/autosave.requested" },
  async ({ event, step }) => {
    const { projectId, userId, shapes, viewportData } = event.data;

    console.log("[Inngest] Starting autosave for project:", projectId);

    const result = await step.run("update-project", async () => {
      try {
        const convex = getConvexClient();

        const sketchesData = safeParse(shapes);
        const viewport = safeParse(viewportData);

        // Use autosaveProject (no auth needed, uses userId)
        await convex.mutation(api.projects.autosaveProject, {
          projectId: projectId as Id<"projects">,
          userId: userId as Id<"users">,
          sketchesData,
          viewportData: viewport,
        });

        console.log("[Inngest] Project saved successfully:", projectId);
        return { success: true };
      } catch (error) {
        console.error("[Inngest] Failed to save project:", error);
        throw error;
      }
    });

    return result;
  }
);

/**
 * Razorpay Webhook Handler (Placeholder)
 */
export const razorpayWebhookHandler = inngest.createFunction(
  {
    id: "razorpay-webhook-handler",
    name: "Razorpay Webhook Handler",
    retries: 3,
  },
  { event: "razorpay/webhook.received" },
  async ({ event, step }) => {
    const { event: eventType, payload } = event.data;

    console.log("[Inngest] Processing Razorpay event:", eventType);

    await step.run("log-event", async () => {
      console.log("[Inngest] Razorpay payload:", JSON.stringify(payload, null, 2));
      return { logged: true };
    });

    return { processed: true, eventType };
  }
);

/**
 * AI Generation Workflow (Placeholder)
 */
export const generationWorkflow = inngest.createFunction(
  {
    id: "generate-design",
    name: "Generate Design from Sketch",
    retries: 2,
  },
  { event: "generation/requested" },
  async ({ event, step }) => {
    const { projectId, frameId } = event.data;

    console.log("[Inngest] Generation requested for frame:", frameId);

    const result = await step.run("generate-design", async () => {
      return {
        success: true,
        message: "Generation queued (placeholder)",
        projectId,
        frameId,
      };
    });

    return result;
  }
);

// Export all functions
export const functions = [
  autosaveProjectWorkflow,
  razorpayWebhookHandler,
  generationWorkflow,
];