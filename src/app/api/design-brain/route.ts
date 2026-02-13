// src/app/api/design-brain/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // ═══════════════════════════════════════════
    // MOODBOARD ANALYSIS
    // Takes image URLs, returns design personality
    // ═══════════════════════════════════════════
    if (body.type === "moodboard-analysis") {
      const imageUrls = body.imageUrls as string[];

      if (!imageUrls || imageUrls.length === 0) {
        return NextResponse.json({
          personality: {
            style: "modern",
            density: "comfortable",
            radius: "soft",
            shadow: "subtle",
            mood: "professional",
          },
        });
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          // @ts-ignore — disable thinking for speed
          thinkingConfig: { thinkingBudget: 0 },
        }
      });

      // Download images and convert to base64 for Gemini
      const imageParts: Array<{
        inlineData: { mimeType: string; data: string };
      }> = [];

      for (const url of imageUrls.slice(0, 5)) {
        try {
          const imgResponse = await fetch(url);
          if (!imgResponse.ok) continue;

          const buffer = await imgResponse.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          const contentType =
            imgResponse.headers.get("content-type") || "image/png";

          imageParts.push({
            inlineData: { mimeType: contentType, data: base64 },
          });
        } catch (err) {
          console.warn("[DesignBrain] Failed to fetch moodboard image:", err);
          continue;
        }
      }

      // If no images could be fetched, return defaults
      if (imageParts.length === 0) {
        return NextResponse.json({
          personality: {
            style: "modern",
            density: "comfortable",
            radius: "soft",
            shadow: "subtle",
            mood: "professional",
          },
        });
      }

      const prompt = `Analyze these design inspiration images and determine the overall design personality.

Return ONLY a valid JSON object with exactly these fields and allowed values:

{
  "style": one of "minimal" | "bold" | "glass" | "corporate" | "playful" | "luxury" | "modern",
  "density": one of "compact" | "comfortable" | "spacious",
  "radius": one of "sharp" | "soft" | "pill",
  "shadow": one of "none" | "subtle" | "elevated",
  "mood": one of "professional" | "friendly" | "techy" | "creative" | "elegant"
}

Look at the color palette, spacing, typography weight, border styles, and overall feel.
Return ONLY valid JSON. No explanation. No markdown.`;

      try {
        const result = await model.generateContent([
          prompt,
          ...imageParts,
        ]);
        const text = result.response.text();
        const cleaned = text
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();
        const personality = JSON.parse(cleaned);

        return NextResponse.json({ personality });
      } catch (parseError) {
        console.error("[DesignBrain] Moodboard parse error:", parseError);
        return NextResponse.json({
          personality: {
            style: "modern",
            density: "comfortable",
            radius: "soft",
            shadow: "subtle",
            mood: "professional",
          },
        });
      }
    }

    // ═══════════════════════════════════════════
    // DESIGN BRAIN — LAYOUT IMPROVEMENT
    // Takes UINode tree JSON prompt, returns improved tree
    // ═══════════════════════════════════════════
    if (body.type === "design-brain") {
      if (!body.prompt) {
        return NextResponse.json(
          { error: "Missing prompt" },
          { status: 400 }
        );
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
          // @ts-ignore — disable thinking for speed
          thinkingConfig: { thinkingBudget: 0 },
        }
      });

      const result = await model.generateContent(body.prompt);
      const text = result.response.text();

      // Clean response — Gemini sometimes wraps in markdown
      const cleaned = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      try {
        const improvedTree = JSON.parse(cleaned);
        return NextResponse.json({ tree: improvedTree });
      } catch (parseError) {
        console.error("[DesignBrain] JSON parse error:", parseError);
        console.error("[DesignBrain] Raw response:", text.slice(0, 500));
        return NextResponse.json(
          { error: "Failed to parse Gemini response" },
          { status: 422 }
        );
      }
    }

    return NextResponse.json(
      { error: `Unknown type: ${body.type}` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[DesignBrain] Unhandled error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}