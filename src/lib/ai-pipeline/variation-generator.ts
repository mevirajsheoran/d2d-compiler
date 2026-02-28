/* ══════════════════════════════════════════════════════════════════════════════
   VARIATION GENERATOR
   
   Generates 3 design variations from a single wireframe by running
   the pipeline with 3 different design presets.
   
   - Selects 3 contrasting presets for maximum visual variety
   - Primary preset: user's choice OR suggestion from brief
   - Contrast presets: most visually different from primary
   - Total time: < 300ms for all 3 variations
   - Total cost: ₹0 (all deterministic, client-side)
   
   Used by: Generation page to show MidJourney-style 3-up comparison
   ══════════════════════════════════════════════════════════════════════════════ */

import type { Shape, FrameShape } from "@/redux/slice/shapes";
import type { StyleGuide } from "@/types/style-guide";
import { generateFromFrame } from "./index";
import { getSuggestions } from "./industry-content";

/* ─── Types ─── */

export interface Variation {
  presetName: string;
  presetLabel: string;
  presetDescription: string;
  code: string;
}

/* ─── Preset Metadata ─── */

const PRESET_INFO: Record<string, { label: string; description: string }> = {
  "startup-modern": {
    label: "Startup Modern",
    description: "Clean SaaS look with gradients and glass effects",
  },
  "corporate-clean": {
    label: "Corporate Clean",
    description: "Structured and professional with subtle shadows",
  },
  "bold-creative": {
    label: "Bold Creative",
    description: "Vibrant colors with strong visual impact",
  },
  "minimal-elegant": {
    label: "Minimal Elegant",
    description: "Refined simplicity with generous whitespace",
  },
  "dashboard-dense": {
    label: "Dashboard Dense",
    description: "Compact layout optimized for data display",
  },
  "glass-gradient": {
    label: "Glass & Gradient",
    description: "Dark theme with glassmorphism and glowing accents",
  },
};

/* ─── Contrast Mapping ─── */
// For each preset, which two presets look most different?

const CONTRAST_MAP: Record<string, [string, string]> = {
  "startup-modern": ["minimal-elegant", "glass-gradient"],
  "corporate-clean": ["bold-creative", "glass-gradient"],
  "bold-creative": ["minimal-elegant", "corporate-clean"],
  "minimal-elegant": ["bold-creative", "startup-modern"],
  "dashboard-dense": ["bold-creative", "glass-gradient"],
  "glass-gradient": ["corporate-clean", "minimal-elegant"],
};

/* ─── Preset Selection ─── */

function selectThreePresets(
  selectedPreset?: string,
  brief?: { industry?: string; tone?: string }
): [string, string, string] {
  let primary = selectedPreset;

  // If no explicit preset, try suggestion from brief
  if (!primary && brief?.industry && brief?.tone) {
    const suggestion = getSuggestions(brief.industry, brief.tone);
    primary = suggestion.preset;
  }

  // Final fallback
  primary = primary || "startup-modern";

  // Get contrasting presets
  const contrasts = CONTRAST_MAP[primary] || ["minimal-elegant", "glass-gradient"];

  return [primary, contrasts[0], contrasts[1]];
}

/* ─── Generate Single Variation ─── */

async function generateSingleVariation(
  frame: FrameShape,
  allShapes: Shape[],
  styleGuide: StyleGuide | null,
  presetName: string
): Promise<Variation> {
  // Create a modified styleGuide with this preset override
  const modifiedGuide: StyleGuide = {
    colors: styleGuide?.colors || {
      primary: [],
      secondary: [],
      accent: [],
      neutral: [],
      semantic: [],
    },
    typography: styleGuide?.typography || [],
    brief: styleGuide?.brief,
    preset: presetName,
    theme: styleGuide?.theme,
    description: styleGuide?.description,
  };

  const code = await generateFromFrame(frame, allShapes, modifiedGuide);
  const info = PRESET_INFO[presetName] || {
    label: presetName,
    description: "",
  };

  return {
    presetName,
    presetLabel: info.label,
    presetDescription: info.description,
    code,
  };
}

/* ═══════════════════════════════════════════════════════════
   EXPORTED FUNCTIONS
   ═══════════════════════════════════════════════════════════ */

/**
 * Generate 3 variations from a single wireframe.
 * Each variation uses a different design preset for maximum contrast.
 * Total time: < 300ms. Total cost: ₹0.
 */
export async function generateVariations(
  frame: FrameShape,
  allShapes: Shape[],
  styleGuide: StyleGuide | null
): Promise<Variation[]> {
  const brief = styleGuide?.brief;
  const [p1, p2, p3] = selectThreePresets(styleGuide?.preset, brief);

  // Run all 3 in parallel (they're synchronous internally but
  // the interface supports async for future extensibility)
  const variations = await Promise.all([
    generateSingleVariation(frame, allShapes, styleGuide, p1),
    generateSingleVariation(frame, allShapes, styleGuide, p2),
    generateSingleVariation(frame, allShapes, styleGuide, p3),
  ]);

  console.log(
    `[D2D Variations] Generated 3 variations: ${p1}, ${p2}, ${p3}`
  );

  return variations;
}

/**
 * Generate a single variation with a specific preset.
 * Used by "Try Another Style" to instantly switch presets.
 */
export async function generateWithPreset(
  frame: FrameShape,
  allShapes: Shape[],
  styleGuide: StyleGuide | null,
  presetName: string
): Promise<Variation> {
  return generateSingleVariation(frame, allShapes, styleGuide, presetName);
}

/**
 * Get the 3 preset names that would be selected for variations.
 * Useful for UI to show which presets will be generated.
 */
export function getVariationPresets(
  selectedPreset?: string,
  brief?: { industry?: string; tone?: string }
): [string, string, string] {
  return selectThreePresets(selectedPreset, brief);
}

/**
 * Get all available preset names with metadata.
 */
export function getAllPresets(): Array<{
  name: string;
  label: string;
  description: string;
}> {
  return Object.entries(PRESET_INFO).map(([name, info]) => ({
    name,
    ...info,
  }));
}