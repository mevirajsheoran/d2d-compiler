// src/lib/ai-pipeline/moodboard-analyzer.ts

/* ══════════════════════════════════════════════════════════
   MOODBOARD ANALYZER
   
   Extracts "design personality" from moodboard images.
   
   V1: Returns defaults (no Gemini call yet)
   V2 (future): Sends images to Gemini Vision for analysis
   
   The personality data feeds into:
   1. The Stylist (borderRadius, shadow, spacing overrides)
   2. The Design Brain prompt (so Gemini knows the brand mood)
   ══════════════════════════════════════════════════════════ */

export interface MoodPersonality {
  style:
    | "minimal"
    | "bold"
    | "glass"
    | "corporate"
    | "playful"
    | "luxury"
    | "modern";
  density: "compact" | "comfortable" | "spacious";
  radius: "sharp" | "soft" | "pill";
  shadow: "none" | "subtle" | "elevated";
  mood:
    | "professional"
    | "friendly"
    | "techy"
    | "creative"
    | "elegant";
}

/* ──────────────────────────────────────────────────────────
   Default personality when no moodboard images exist
   ────────────────────────────────────────────────────────── */
function getDefaultPersonality(): MoodPersonality {
  return {
    style: "modern",
    density: "comfortable",
    radius: "soft",
    shadow: "subtle",
    mood: "professional",
  };
}

/* ──────────────────────────────────────────────────────────
   Validate that a parsed object matches MoodPersonality
   ────────────────────────────────────────────────────────── */
function isValidPersonality(obj: unknown): obj is MoodPersonality {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;

  const validStyle = [
    "minimal", "bold", "glass", "corporate",
    "playful", "luxury", "modern",
  ];
  const validDensity = ["compact", "comfortable", "spacious"];
  const validRadius = ["sharp", "soft", "pill"];
  const validShadow = ["none", "subtle", "elevated"];
  const validMood = [
    "professional", "friendly", "techy",
    "creative", "elegant",
  ];

  return (
    validStyle.includes(o.style as string) &&
    validDensity.includes(o.density as string) &&
    validRadius.includes(o.radius as string) &&
    validShadow.includes(o.shadow as string) &&
    validMood.includes(o.mood as string)
  );
}

/* ══════════════════════════════════════════════════════════
   ANALYZE MOODBOARD
   
   Called once per generation. In enhanced mode, sends
   moodboard image URLs to /api/design-brain for Gemini
   Vision analysis. Falls back to defaults on any error.
   
   @param imageUrls - Public URLs of moodboard images
   @returns MoodPersonality object
   ══════════════════════════════════════════════════════════ */
export async function analyzeMoodboard(
  imageUrls: string[]
): Promise<MoodPersonality> {
  // No images → use defaults
  if (!imageUrls || imageUrls.length === 0) {
    return getDefaultPersonality();
  }

  try {
    const response = await fetch("/api/design-brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "moodboard-analysis",
        imageUrls,
      }),
    });

    if (!response.ok) {
      console.warn("[MoodboardAnalyzer] API returned", response.status);
      return getDefaultPersonality();
    }

    const data = await response.json();

    if (isValidPersonality(data.personality)) {
      return data.personality;
    }

    console.warn("[MoodboardAnalyzer] Invalid personality shape, using defaults");
    return getDefaultPersonality();
  } catch (error) {
    console.warn("[MoodboardAnalyzer] Failed, using defaults:", error);
    return getDefaultPersonality();
  }
}