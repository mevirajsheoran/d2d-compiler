// src/lib/ai-pipeline/stylist.ts

/* ══════════════════════════════════════════════════════════════════════════════
   STYLIST — SIMPLIFIED
   
   In the new pipeline, the Stylist is a THIN WRAPPER.
   
   The heavy lifting of class generation has moved to:
   - design-identity.ts (design system presets)
   - component-library.ts (rich HTML templates)
   
   The Stylist's only remaining job:
   1. Apply identity-based classes to each node (for the section engine
      and builder to use as fallback data)
   2. Provide the hashString utility
   
   This file is kept for backward compatibility and to store
   basic class information on nodes that the builder's
   renderGenericNode function can use.
   ══════════════════════════════════════════════════════════════════════════════ */

import type { UINode, DesignIdentity } from "./types";

/* ══════════════════════════════════════════════════════════
   Simple hash function for deterministic selection.
   Converts any string → positive integer.
   ══════════════════════════════════════════════════════════ */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/* ══════════════════════════════════════════════════════════
   Apply basic identity-derived classes to each node.
   
   These classes are ONLY used as fallback when a node
   doesn't get rendered by a section template.
   The component-library produces much richer output.
   ══════════════════════════════════════════════════════════ */
function applyNodeClasses(node: UINode, identity: DesignIdentity): string {
  switch (node.role) {
    case "button": {
      const variant = (node.properties?.variant as string) || "primary";
      const map: Record<string, string> = {
        primary: identity.components.button.primary,
        secondary: identity.components.button.secondary,
        ghost: identity.components.button.ghost,
        link: identity.components.button.link,
        danger: identity.components.button.danger,
        outline: identity.components.button.secondary,
      };
      return map[variant] || map.primary;
    }

    case "input":
      return identity.components.input.default;

    case "heading": {
      const level = (node.properties?.headingLevel as number) || 2;
      const scaleMap: Record<number, string> = {
        1: identity.typography.display,
        2: identity.typography.h1,
        3: identity.typography.h2,
        4: identity.typography.h3,
      };
      return [
        scaleMap[level] || scaleMap[2],
        identity.colors.textPrimary,
        identity.typography.headingFont,
      ]
        .filter(Boolean)
        .join(" ");
    }

    case "paragraph":
      return [
        identity.typography.body,
        identity.colors.textSecondary,
        identity.typography.bodyFont,
      ]
        .filter(Boolean)
        .join(" ");

    case "image":
      return identity.components.image.default;

    case "video":
      return identity.components.video;

    case "chart":
      return identity.components.chart;

    case "divider":
      return identity.components.divider;

    case "checkbox":
      return identity.components.checkbox;

    case "nav":
      return identity.components.nav.wrapper;

    case "avatar": {
      const size = node.width > 48 ? "lg" : node.width > 32 ? "md" : "sm";
      return identity.components.avatar[size as "sm" | "md" | "lg"];
    }

    case "card":
      return identity.components.card.elevated;

    case "container": {
      const classes: string[] = ["flex"];
      classes.push(node.layout === "row" ? "flex-row" : "flex-col");
      classes.push(identity.spacing.elementGap);

      if (node.id === "root") {
        classes.push("w-full min-h-screen");
        if (identity.typography.bodyFont) {
          classes.push(identity.typography.bodyFont);
        }
      }

      return classes.filter(Boolean).join(" ");
    }

    case "decorative":
      return "flex items-center justify-center";

    case "device-wrapper":
      return `border-2 border-gray-400 ${identity.borders.radius.lg} overflow-hidden`;

    default:
      return "";
  }
}

/* ══════════════════════════════════════════════════════════
   MAIN STYLIST FUNCTION
   
   Recursively applies identity-based classes to every node.
   These are BASELINE classes — the component library
   produces richer output during the build phase.
   ══════════════════════════════════════════════════════════ */
export function applyStyles(
  node: UINode,
  identity: DesignIdentity
): UINode {
  return {
    ...node,
    tailwindClasses: applyNodeClasses(node, identity),
    children: node.children.map((child) => applyStyles(child, identity)),
  };
}