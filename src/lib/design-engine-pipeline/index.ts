/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PIPELINE ORCHESTRATOR — v5.0

   v5.0 additions:
   - Recipe-based page generation (page type + industry → section skeleton)
   - Wireframe sections override recipe defaults where drawn
   - Recipe fills undrawn sections with professional templates
   - Backward compatible: if no pageType in brief, falls back to wireframe-only
   
   v4.0 retained:
   - Spatial constraint graph + CSS Grid detection
   - Grid container injection
   - Extended gap scale + frame ratio awareness
   ══════════════════════════════════════════════════════════════════════════════ */

import type { Shape, FrameShape } from "@/redux/slice/shapes";
import type { StyleGuide } from "@/types/style-guide";
import type { PresetName } from "./types";
import { extractShapesFromFrame } from "./extractor";
import { classifyShapes } from "./classifier";
import { buildHierarchy, injectGridContainers } from "./architect";
import { enhanceTree } from "./enhancer";
import { buildDesignIdentity } from "./design-identity";
import { detectSections } from "./section-engine";
import { generateCode, generateMergedCode } from "./builder";
import { buildSpatialGraph } from "./spatial-graph";
import { detectGrids } from "./grid-detector";
import { getPageRecipe } from "./page-recipes";
import { mergeRecipeWithWireframe } from "./recipe-merger";

/* ══════════════════════════════════════════════════════════
   EMPTY FRAME FALLBACK
   ══════════════════════════════════════════════════════════ */

const EMPTY_FRAME_CODE = `export default function GeneratedUI() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-400">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm">Draw some shapes inside the frame to generate a design</p>
      </div>
    </div>
  );
}`;

/* ══════════════════════════════════════════════════════════
   MAIN PIPELINE FUNCTION
   ══════════════════════════════════════════════════════════ */

export async function generateFromFrame(
  frame: FrameShape,
  allShapes: Shape[],
  styleGuide: StyleGuide | null,
  _moodPersonality?: unknown,
  _mode?: string
): Promise<string> {
  const startTime = performance.now();
  const brief = styleGuide?.brief;
  const frameWidth = frame.w || 1200;
  const frameHeight = frame.h || 800;

  // ─── Phase 4: Build Design Identity (needed by both paths) ───
  const presetName = styleGuide?.preset as PresetName | undefined;
  const identity = buildDesignIdentity(styleGuide, presetName);

  // ─── Decide: Recipe mode vs Legacy wireframe-only mode ───
  const hasPageType = brief?.pageType && brief.pageType.trim() !== "";
  const hasIndustry = brief?.industry && brief.industry.trim() !== "";
  const useRecipeMode = hasPageType || hasIndustry;

  if (useRecipeMode) {
    return runRecipePipeline(
      frame, allShapes, styleGuide, identity,
      frameWidth, frameHeight, startTime
    );
  } else {
    return runLegacyPipeline(
      frame, allShapes, styleGuide, identity,
      frameWidth, frameHeight, startTime
    );
  }
}

/* ══════════════════════════════════════════════════════════
   v5.0 RECIPE PIPELINE
   ══════════════════════════════════════════════════════════ */

async function runRecipePipeline(
  frame: FrameShape,
  allShapes: Shape[],
  styleGuide: StyleGuide | null,
  identity: ReturnType<typeof buildDesignIdentity>,
  frameWidth: number,
  frameHeight: number,
  startTime: number
): Promise<string> {
  const brief = styleGuide?.brief || {
    pageType: "landing",
    industry: "tech",
    tone: "professional",
    brandName: "Brand",
    tagline: "",
  };

  // ─── Step 1: Get page recipe ───
  const recipe = getPageRecipe(
    brief.pageType || "landing",
    brief.industry || "tech"
  );

  // ─── Step 2: Analyze wireframe (if shapes exist) ───
  const extracted = extractShapesFromFrame(frame, allShapes);
  let wireframeSections: ReturnType<typeof detectSections> = [];

  if (extracted.length > 0) {
    const classified = classifyShapes(extracted);
    const uiComponents = classified.filter((c) => c.role !== "annotation");

    if (uiComponents.length > 0) {
      // Spatial graph + grid detection
      const spatialGraph = buildSpatialGraph(uiComponents, frameWidth, frameHeight);
      const detectedGrids = detectGrids(spatialGraph);

      if (detectedGrids.length > 0) {
        console.log(
          `[D2D Grid] Detected: ${detectedGrids
            .map((g) => `${g.rows}×${g.cols} (conf: ${g.confidence.toFixed(2)})`)
            .join(", ")}`
        );
      }

      // Build tree
      let tree = buildHierarchy(uiComponents, frameWidth, frameHeight);
      tree = injectGridContainers(tree, detectedGrids);
      tree = enhanceTree(tree);

      // Detect sections from wireframe
      wireframeSections = detectSections(tree, frameWidth, frameHeight);
    }
  }

  // ─── Step 3: Merge recipe with wireframe ───
  const mergedSections = mergeRecipeWithWireframe(recipe, wireframeSections);

  // ─── Step 4: Generate code ───
  const code = generateMergedCode(mergedSections, identity, brief);

  // ─── Logging ───
  const duration = Math.round(performance.now() - startTime);
  const recipeCount = mergedSections.filter((s) => s.source === "recipe").length;
  const wireframeCount = mergedSections.filter((s) => s.source === "wireframe").length;

  console.log(
    `[D2D v5 Recipe] Generated in ${duration}ms | ` +
      `${mergedSections.length} sections (${wireframeCount} wireframe, ${recipeCount} recipe) | ` +
      `${code.split("\n").length} lines | ` +
      `Page: ${brief.pageType} | Industry: ${brief.industry} | ` +
      `Preset: ${identity.name} | Brand: ${brief.brandName || "none"}`
  );

  return code;
}

/* ══════════════════════════════════════════════════════════
   LEGACY WIREFRAME-ONLY PIPELINE (v4.0 behavior preserved)
   ══════════════════════════════════════════════════════════ */

async function runLegacyPipeline(
  frame: FrameShape,
  allShapes: Shape[],
  styleGuide: StyleGuide | null,
  identity: ReturnType<typeof buildDesignIdentity>,
  frameWidth: number,
  frameHeight: number,
  startTime: number
): Promise<string> {
  const brief = styleGuide?.brief;

  // Phase 1: Extract
  const extracted = extractShapesFromFrame(frame, allShapes);
  if (extracted.length === 0) return EMPTY_FRAME_CODE;

  // Phase 2: Classify
  const classified = classifyShapes(extracted);
  if (classified.length === 0) return EMPTY_FRAME_CODE;

  // Phase 2.5: Spatial graph + grid detection
  const spatialGraph = buildSpatialGraph(classified, frameWidth, frameHeight);
  const detectedGrids = detectGrids(spatialGraph);

  if (detectedGrids.length > 0) {
    console.log(
      `[D2D Grid] Detected: ${detectedGrids
        .map((g) => `${g.rows}×${g.cols} (conf: ${g.confidence.toFixed(2)})`)
        .join(", ")}`
    );
  }

  // Phase 3: Build hierarchy
  let tree = buildHierarchy(classified, frameWidth, frameHeight);
  tree = injectGridContainers(tree, detectedGrids);

  // Phase 3.5: Enhance
  tree = enhanceTree(tree);

  // Phase 5: Detect sections
  const sections = detectSections(tree, frameWidth, frameHeight);

  // Phase 6: Generate code
  const code = generateCode(tree, identity, sections);

  const duration = Math.round(performance.now() - startTime);
  console.log(
    `[D2D v4 Legacy] Generated in ${duration}ms | ` +
      `${sections.length} sections | ` +
      `${code.split("\n").length} lines | ` +
      `Frame: ${frameWidth}×${frameHeight} | ` +
      `Preset: ${identity.name} | ` +
      `Industry: ${brief?.industry || "none"}`
  );

  return code;
}