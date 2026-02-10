// src/inngest/client.ts
import { Inngest } from "inngest";

// Check if we're in development
const isDev = process.env.NODE_ENV === "development";

// Create the Inngest client
export const inngest = new Inngest({
  id: "d2d-app",
  name: "D2D - Drawing to Design",
  // In development, don't require event key
  ...(isDev && {
    isDev: true,
  }),
});

// Event types for type safety
export type InngestEvents = {
  "project/autosave.requested": {
    data: {
      projectId: string;
      userId: string;
      shapes: string;
      viewportData: string;
    };
  };
  "razorpay/webhook.received": {
    data: {
      event: string;
      payload: any;
    };
  };
  "generation/requested": {
    data: {
      projectId: string;
      frameId: string;
      imageBase64: string;
      styleGuide?: any;
    };
  };
};