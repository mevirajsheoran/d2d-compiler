// src/lib/ai-pipeline/design-brain.ts

/* ══════════════════════════════════════════════════════════
   DESIGN BRAIN
   
   The "intelligence layer" that sits between the
   deterministic Enhancer and the Stylist.
   
   Takes the structured UINode tree + style context,
   sends to Gemini, gets back an improved tree.
   
   Gemini does NOT generate code. It ONLY restructures
   the JSON tree (grouping, layout, hints).
   
   If Gemini fails for any reason, the pipeline silently
   falls back to the deterministic tree.
   ══════════════════════════════════════════════════════════ */

import type { UINode, DesignTokens } from "./types";
import type { MoodPersonality } from "./moodboard-analyzer";

/* ──────────────────────────────────────────────────────────
   Simplify tree for the prompt (remove noise, reduce tokens)
   ────────────────────────────────────────────────────────── */
interface SimplifiedNode {
  id: string;
  role: string;
  relX: number;
  relY: number;
  width: number;
  height: number;
  text?: string;
  properties: Record<string, unknown>;
  layout: "row" | "column";
  enhancementHints: string[];
  children: SimplifiedNode[];
}

function simplifyTree(node: UINode): SimplifiedNode {
  return {
    id: node.id,
    role: node.role,
    relX: Math.round(node.relX),
    relY: Math.round(node.relY),
    width: Math.round(node.width),
    height: Math.round(node.height),
    ...(node.text ? { text: node.text } : {}),
    properties: node.properties,
    layout: node.layout,
    enhancementHints: node.enhancementHints,
    children: node.children.map(simplifyTree),
  };
}

/* ──────────────────────────────────────────────────────────
   Build the Gemini prompt
   ────────────────────────────────────────────────────────── */
export function buildDesignBrainPrompt(
  tree: UINode,
  tokens: DesignTokens,
  moodPersonality: MoodPersonality | null,
  frameWidth: number,
  frameHeight: number
): string {
  const simplified = simplifyTree(tree);

  return `You are a senior UI/UX designer restructuring a wireframe layout tree into a production-quality page layout.

LAYOUT TREE (JSON):
${JSON.stringify(simplified, null, 2)}

FRAME SIZE: ${frameWidth}px × ${frameHeight}px

BRAND STYLE:
- Primary color: ${tokens.colors.primary}
- Secondary color: ${tokens.colors.secondary}
- Design style: ${moodPersonality?.style || "modern clean"}
- Density: ${moodPersonality?.density || "comfortable"}
- Border radius: ${moodPersonality?.radius || "soft"}
- Shadow style: ${moodPersonality?.shadow || "subtle"}
- Mood: ${moodPersonality?.mood || "professional"}

YOUR TASK:
Restructure this layout tree to create a production-quality page. Follow these rules STRICTLY:

1. GROUP related elements:
   - If buttons are near a nav element (similar Y position, top of frame) → put buttons INSIDE the nav as children
   - If a heading is above inputs and a button → group them as a form container
   - If elements share the same Y band (within 10% of frame height) → they should be siblings in a "row" layout parent

2. DETECT side-by-side columns:
   - If two or more large elements sit side-by-side (similar Y, different X, each wider than 25% of frame) → wrap them in a container with "row" layout
   - Add "responsive-grid-2" or "responsive-grid-3" enhancementHint for column layouts

3. CREATE page sections:
   - Elements in top 15% of frame → header/nav section
   - Elements in bottom 15% → footer section
   - Group remaining content into logical main sections

4. STRICT RULES — DO NOT VIOLATE:
   - Do NOT add new components that weren't in the original tree
   - Do NOT change any "role" value (button stays button, image stays image)
   - Do NOT remove any components — every original node must appear in output
   - Do NOT change "text" or "properties" values
   - ONLY modify: parent-child grouping, children order, layout direction, enhancementHints
   - You MAY create new container nodes (role: "container") to group elements
   - New container nodes must have a unique id starting with "group_"

5. ENHANCEMENT HINTS you can add to enhancementHints array:
   - "sticky-nav" → for nav elements at top
   - "centered-form" → for form-like groups (heading + inputs + button)
   - "responsive-grid-2" or "responsive-grid-3" → for column layouts
   - "hero-heading" → for the main/largest heading
   - "hero-text" → for subtitle text under hero heading
   - "auto-card" → for card-like containers
   - "footer" → for footer sections
   - "section-gap" → for containers that need extra top spacing

6. LAYOUT RULES:
   - Set layout to "row" when children should be side-by-side
   - Set layout to "column" when children should stack vertically
   - The root node should almost always be "column" layout

Return ONLY the modified JSON tree. No explanation. No markdown code fences. Just valid JSON that can be parsed with JSON.parse().`;
}

/* ──────────────────────────────────────────────────────────
   Validate that Gemini's response is a valid UINode tree
   ────────────────────────────────────────────────────────── */
function isValidUINode(obj: unknown): obj is UINode {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.role === "string" &&
    Array.isArray(o.children) &&
    (o.layout === "row" || o.layout === "column")
  );
}

/* ──────────────────────────────────────────────────────────
   Recursively restore fields that Gemini might strip
   (gaps, tailwindClasses, missing defaults)
   ────────────────────────────────────────────────────────── */
function normalizeTree(node: unknown): UINode {
  const n = node as Record<string, unknown>;
  const children = Array.isArray(n.children) ? n.children : [];

  return {
    id: (n.id as string) || "unknown",
    role: (n.role as UINode["role"]) || "container",
    relX: (n.relX as number) || 0,
    relY: (n.relY as number) || 0,
    width: (n.width as number) || 0,
    height: (n.height as number) || 0,
    text: n.text as string | undefined,
    properties: (n.properties as Record<string, unknown>) || {},
    children: children.map(normalizeTree),
    layout: (n.layout as "row" | "column") || "column",
    gaps: Array.isArray(n.gaps) ? (n.gaps as number[]) : [],
    enhancementHints: Array.isArray(n.enhancementHints)
      ? (n.enhancementHints as string[])
      : [],
    tailwindClasses: undefined, // Stylist will fill this
  };
}

/* ──────────────────────────────────────────────────────────
   Count total nodes in tree (for validation)
   ────────────────────────────────────────────────────────── */
function countNodes(node: UINode): number {
  return 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0);
}

/* ──────────────────────────────────────────────────────────
   Collect all non-container node IDs (for validation)
   ────────────────────────────────────────────────────────── */
function collectLeafIds(node: UINode): Set<string> {
  const ids = new Set<string>();
  if (node.role !== "container" || node.children.length === 0) {
    // Don't add the root container or grouping containers
    if (!node.id.startsWith("group_") && node.id !== "root") {
      ids.add(node.id);
    }
  }
  for (const child of node.children) {
    for (const id of collectLeafIds(child)) {
      ids.add(id);
    }
  }
  return ids;
}

/* ══════════════════════════════════════════════════════════
   CALL DESIGN BRAIN
   
   Sends tree to /api/design-brain, gets improved tree back.
   Validates response. Falls back to original tree on error.
   
   @param tree - Enhanced UINode tree from Enhancer
   @param tokens - Design tokens from StyleGuide
   @param mood - MoodPersonality (or null)
   @param frameWidth - Frame width in px
   @param frameHeight - Frame height in px
   @returns Improved UINode tree (or original if Gemini fails)
   ══════════════════════════════════════════════════════════ */
export async function callDesignBrain(
  tree: UINode,
  tokens: DesignTokens,
  mood: MoodPersonality | null,
  frameWidth: number,
  frameHeight: number
): Promise<UINode> {
  const prompt = buildDesignBrainPrompt(
    tree, tokens, mood, frameWidth, frameHeight
  );

  const originalLeafIds = collectLeafIds(tree);

  try {
    const response = await fetch("/api/design-brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "design-brain",
        prompt,
      }),
    });

    if (!response.ok) {
      console.warn("[DesignBrain] API returned", response.status);
      return tree;
    }

    const data = await response.json();

    if (!data.tree) {
      console.warn("[DesignBrain] No tree in response");
      return tree;
    }

    // Validate basic structure
    if (!isValidUINode(data.tree)) {
      console.warn("[DesignBrain] Invalid tree structure");
      return tree;
    }

    // Normalize (restore missing fields)
    const improved = normalizeTree(data.tree);

    // Validate: all original leaf nodes must still exist
    const improvedLeafIds = collectLeafIds(improved);
    let allPresent = true;
    for (const id of originalLeafIds) {
      if (!improvedLeafIds.has(id)) {
        console.warn(`[DesignBrain] Missing node: ${id}`);
        allPresent = false;
        break;
      }
    }

    if (!allPresent) {
      console.warn("[DesignBrain] Gemini dropped nodes, using original tree");
      return tree;
    }

    return improved;
  } catch (error) {
    console.warn("[DesignBrain] Failed, using original tree:", error);
    return tree;
  }
}