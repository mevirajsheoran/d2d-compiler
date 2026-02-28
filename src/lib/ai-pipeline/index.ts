/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PIPELINE ORCHESTRATOR — v3
   
   The complete deterministic pipeline that produces v0-level output
   with ZERO AI calls, ₹0 cost, and < 100ms speed.
   
   Phase 1:    EXTRACTOR       → Get shapes inside frame
   Phase 2:    CLASSIFIER      → Assign UI role to each shape
   Phase 3:    ARCHITECT       → Build hierarchy tree
   Phase 3.5:  ENHANCER        → Apply design pattern upgrades (13 rules)
   Phase 4:    DESIGN IDENTITY → Build complete design system from style guide + brief
   Phase 5:    SECTION ENGINE  → Detect page sections (nav, hero, form, etc.)
   Phase 6:    BUILDER         → Assemble sections with rich components + smart content
   
   v3.0 additions:
   - Design Brief (industry, tone, brand) feeds into identity + content
   - Industry-specific content banks replace generic placeholders
   - Brand name permeation through nav, footer, CTA, forms
   - Section background composition for visual rhythm
   - Animation stagger for entrance effects
   
   Output: 100-500 line React + Tailwind component
   ══════════════════════════════════════════════════════════════════════════════ */

import type { Shape, FrameShape } from "@/redux/slice/shapes";
import type { StyleGuide } from "@/types/style-guide";
import type { PresetName } from "./types";
import { extractShapesFromFrame } from "./extractor";
import { classifyShapes } from "./classifier";
import { buildHierarchy } from "./architect";
import { enhanceTree } from "./enhancer";
import { buildDesignIdentity } from "./design-identity";
import { detectSections } from "./section-engine";
import { generateCode } from "./builder";

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

  // ─── Extract brief info for logging ───
  const brief = styleGuide?.brief;

  // ─── Phase 1: Extract shapes inside frame ───
  const extracted = extractShapesFromFrame(frame, allShapes);

  if (extracted.length === 0) {
    return `export default function GeneratedUI() {
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
  }

  // ─── Phase 2: Classify each shape's semantic role ───
  const classified = classifyShapes(extracted);

  if (classified.length === 0) {
    return `export default function GeneratedUI() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-400">
      <div className="text-center space-y-4">
        <p className="text-sm">No UI components found. Try adding buttons, inputs, or text shapes.</p>
      </div>
    </div>
  );
}`;
  }

  // ─── Phase 3: Build hierarchy tree ───
  let tree = buildHierarchy(classified, frame.w, frame.h);

  // ─── Phase 3.5: Apply design pattern enhancements (13 rules) ───
  tree = enhanceTree(tree);

  // ─── Phase 4: Build Design Identity from style guide + brief ───
  const presetName = styleGuide?.preset as PresetName | undefined;
  const identity = buildDesignIdentity(styleGuide, presetName);

  // ─── Phase 5: Detect page sections ───
  const sections = detectSections(tree, frame.w, frame.h);

  // ─── Phase 6: Generate code with rich components + smart content ───
  const code = generateCode(tree, identity, sections);

  const duration = Math.round(performance.now() - startTime);
  console.log(
    `[D2D Pipeline v3] Generated in ${duration}ms | ` +
    `${sections.length} sections | ` +
    `${code.split("\n").length} lines | ` +
    `Preset: ${identity.name} | ` +
    `Industry: ${brief?.industry || "none"} | ` +
    `Brand: ${brief?.brandName || "none"}`
  );

  return code;
}