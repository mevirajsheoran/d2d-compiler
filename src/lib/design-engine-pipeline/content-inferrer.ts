// src/lib/design-engine-pipeline/content-inferrer.ts

/* ══════════════════════════════════════════════════════════════════════════════
   CONTENT INFERRER
   
   Fills in smart placeholder content when the user leaves things blank.
   
   PROBLEM: User draws a button but doesn't type text on it → "Button"
            User draws an input but doesn't set label → "Label"
            User draws a heading but text is "Type here..." → generic
   
   SOLUTION: Based on the SECTION TYPE and POSITION, we infer
             contextually appropriate content:
             - Form's submit button → "Sign In" (not "Button")
             - First input in form → email placeholder
             - Hero heading → themed heading from preset
   
   Also handles ICON INFERENCE:
   - CTA buttons get arrow-right icons
   - Email inputs get mail icons
   - Feature cards get rotating feature icons
   
   All content comes from the DesignIdentity's content preset,
   so different presets produce different themed text.
   
   Zero AI. Deterministic. Same input = same output.
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  UINode,
  SectionType,
  InferredContent,
  DesignIdentity,
  ContentPreset,
  IconName,
  SlotAssignment,
} from "./types";
import {
  inferButtonIcon,
  inferInputIcon,
  getFeatureIcons,
} from "./icon-registry";

import { escapeHtml } from "@/lib/utils";
/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

/**
 * Check if text is a default/blank value that should be replaced.
 */
function isBlankText(text: string | undefined): boolean {
  if (!text) return true;
  const t = text.trim().toLowerCase();
  return (
    t === "" ||
    t === "type here..." ||
    t === "button" ||
    t === "label" ||
    t === "heading" ||
    t === "text" ||
    t === "enter text..." ||
    t === "placeholder" ||
    t === "checkbox label" ||
    t === "option" ||
    t === "brand"
  );
}

/**
 * Deterministic selection from an array using a hash.
 * Same nodeId + same array = same selection every time.
 */
function deterministicPick<T>(arr: T[], nodeId: string): T {
  if (arr.length === 0) throw new Error("Empty array for deterministicPick");
  let hash = 0;
  for (let i = 0; i < nodeId.length; i++) {
    const char = nodeId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return arr[Math.abs(hash) % arr.length];
}

/**
 * Pick item by index (wraps around if out of bounds).
 */
function pickByIndex<T>(arr: T[], index: number): T {
  return arr[Math.abs(index) % arr.length];
}


/* ══════════════════════════════════════════════════════════
   BUTTON CONTENT INFERENCE
   ══════════════════════════════════════════════════════════ */

function inferButtonContent(
  node: UINode,
  sectionType: SectionType,
  slotName: string,
  content: ContentPreset,
  _positionIndex: number
): InferredContent {
  const result: InferredContent = {};
  const rawText = (node.properties?.text as string) || node.text || "";
  const currentText = rawText ? escapeHtml(rawText) : "";

  // Determine text
  if (isBlankText(currentText)) {
    switch (sectionType) {
      case "nav":
        if (slotName === "cta-primary") {
          result.text = deterministicPick(content.ctaPrimary, node.id);
        } else if (slotName === "cta-secondary") {
          result.text = "Log In";
        } else {
          result.text = "Sign Up";
        }
        break;

      case "hero-centered":
      case "hero-split":
        if (slotName === "cta-primary") {
          result.text = deterministicPick(content.ctaPrimary, node.id);
        } else {
          result.text = deterministicPick(content.ctaSecondary, node.id);
        }
        break;

      case "form":
        if (slotName === "submit") {
          // Determine form type from number of fields
          result.text = "Sign In";
        } else if (slotName === "secondary-action") {
          result.text = "Forgot password?";
        } else {
          result.text = deterministicPick(content.ctaPrimary, node.id);
        }
        break;

      case "cta":
        if (slotName === "cta-primary") {
          result.text = deterministicPick(content.ctaPrimary, node.id);
        } else {
          result.text = deterministicPick(content.ctaSecondary, node.id);
        }
        break;

      case "footer":
        result.text = deterministicPick(content.footerLinks, node.id);
        break;

      default:
        result.text = deterministicPick(content.ctaPrimary, node.id);
    }
  } else {
    result.text = currentText;
  }

  // Determine icon
  const textForIcon = result.text || currentText;
  const explicitIcon = inferButtonIcon(textForIcon);

  if (explicitIcon) {
    result.icon = explicitIcon;
    result.iconPosition = "right";
  } else if (
    slotName === "cta-primary" &&
    (sectionType === "hero-centered" ||
      sectionType === "hero-split" ||
      sectionType === "cta")
  ) {
    result.icon = "arrow-right";
    result.iconPosition = "right";
  }

  // Determine variant
  if (slotName === "cta-primary" || slotName === "submit") {
    result.variant = "primary";
  } else if (slotName === "cta-secondary" || slotName === "secondary-action") {
    result.variant = "secondary";
  } else if (sectionType === "nav") {
    result.variant =
      slotName === "cta-primary" ? "primary" : "ghost";
  } else if (sectionType === "footer") {
    result.variant = "link";
  }

  return result;
}


/* ══════════════════════════════════════════════════════════
   INPUT CONTENT INFERENCE
   ══════════════════════════════════════════════════════════ */

function inferInputContent(
  node: UINode,
  sectionType: SectionType,
  slotName: string,
  _content: ContentPreset,
  positionIndex: number
): InferredContent {
  const result: InferredContent = {};
  const currentLabel = (node.properties?.label as string) || "";
  const currentPlaceholder = (node.properties?.placeholder as string) || "";

  // Extract field index from slot name (e.g., "field-0" → 0)
  const fieldMatch = slotName.match(/field-(\d+)/);
  const fieldIndex = fieldMatch ? parseInt(fieldMatch[1]) : positionIndex;

  if (sectionType === "form") {
    // Smart form field detection based on position
    if (isBlankText(currentLabel) && isBlankText(currentPlaceholder)) {
      switch (fieldIndex) {
        case 0:
          result.label = "Email";
          result.placeholder = "you@example.com";
          result.inputType = "email";
          result.icon = "mail";
          break;
        case 1:
          result.label = "Password";
          result.placeholder = "••••••••";
          result.inputType = "password";
          result.icon = "lock";
          break;
        case 2:
          result.label = "Full Name";
          result.placeholder = "John Doe";
          result.inputType = "text";
          result.icon = "user";
          break;
        case 3:
          result.label = "Phone";
          result.placeholder = "+1 (555) 000-0000";
          result.inputType = "tel";
          result.icon = "phone";
          break;
        case 4:
          result.label = "Message";
          result.placeholder = "Tell us about your project...";
          result.inputType = "text";
          result.icon = "mail";
          break;
        default:
          result.label = `Field ${fieldIndex + 1}`;
          result.placeholder = "Enter value...";
          result.inputType = "text";
          break;
      }
    } else {
      // User provided some text — infer icon from it
      const labelText = currentLabel || currentPlaceholder;
      const icon = inferInputIcon(labelText, undefined, fieldIndex);
      if (icon) result.icon = icon;

      // Infer input type from label
      const l = labelText.toLowerCase();
      if (l.includes("email")) result.inputType = "email";
      else if (l.includes("password") || l.includes("pass"))
        result.inputType = "password";
      else if (l.includes("phone") || l.includes("mobile"))
        result.inputType = "tel";
      else if (l.includes("url") || l.includes("website"))
        result.inputType = "url";
      else if (l.includes("search")) result.inputType = "search";
    }
  } else {
    // Non-form inputs — just add icon if we can infer
    const labelText = currentLabel || currentPlaceholder;
    if (labelText) {
      const icon = inferInputIcon(labelText, undefined, positionIndex);
      if (icon) result.icon = icon;
    }
  }

  return result;
}


/* ══════════════════════════════════════════════════════════
   HEADING CONTENT INFERENCE
   ══════════════════════════════════════════════════════════ */

function inferHeadingContent(
  node: UINode,
  sectionType: SectionType,
  slotName: string,
  content: ContentPreset,
  _positionIndex: number
): InferredContent {
  const result: InferredContent = {};
  const currentText = node.text ? escapeHtml(node.text) : "";

  if (!isBlankText(currentText)) {
    return result; // User provided text — keep it
  }

  switch (sectionType) {
    case "hero-centered":
    case "hero-split":
      result.text = deterministicPick(content.heroHeadings, node.id);
      break;

    case "features":
      if (slotName === "section-heading") {
        result.text = "Everything you need";
      } else if (slotName.startsWith("feature-title-")) {
        const idx = parseInt(slotName.split("-")[2] || "0");
        result.text = pickByIndex(content.featureTitles, idx);
      }
      break;

    case "form":
      result.text = deterministicPick(content.formHeadings, node.id);
      break;

    case "cta":
      result.text = deterministicPick(content.heroHeadings, node.id);
      break;

    case "stats":
      if (slotName.startsWith("stat-value-")) {
        const statValues = ["10K+", "99.9%", "24/7", "150+"];
        const idx = parseInt(slotName.split("-")[2] || "0");
        result.text = pickByIndex(statValues, idx);
      }
      break;

    case "card-grid":
      if (slotName === "section-heading") {
        result.text = "Featured";
      }
      break;

    case "content-split":
      if (slotName === "content-heading") {
        result.text = "Built for the modern web";
      }
      break;

    default:
      result.text = "Section Title";
  }

  return result;
}


/* ══════════════════════════════════════════════════════════
   PARAGRAPH CONTENT INFERENCE
   ══════════════════════════════════════════════════════════ */

function inferParagraphContent(
  node: UINode,
  sectionType: SectionType,
  slotName: string,
  content: ContentPreset,
  _positionIndex: number
): InferredContent {
  const result: InferredContent = {};
  const currentText = node.text ? escapeHtml(node.text) : "";

  if (!isBlankText(currentText)) {
    return result; // User provided text — keep it
  }

  switch (sectionType) {
    case "hero-centered":
    case "hero-split":
      result.text = deterministicPick(content.heroSubtexts, node.id);
      break;

    case "features":
      if (slotName === "section-description") {
        result.text =
          "We've built the tools you need to succeed. Here's what sets us apart.";
      } else if (slotName.startsWith("feature-text-")) {
        const idx = parseInt(slotName.split("-")[2] || "0");
        result.text = pickByIndex(content.featureTexts, idx);
      }
      break;

    case "form":
      result.text = deterministicPick(content.formSubtexts, node.id);
      break;

    case "cta":
      result.text = deterministicPick(content.heroSubtexts, node.id);
      break;

    case "footer":
      result.text = content.footerCopy;
      break;

    case "stats":
      if (slotName.startsWith("stat-label-")) {
        const statLabels = [
          "Active Users",
          "Uptime",
          "Support",
          "Integrations",
        ];
        const idx = parseInt(slotName.split("-")[2] || "0");
        result.text = pickByIndex(statLabels, idx);
      }
      break;

    case "content-split":
      result.text =
        "Our platform is designed to help you work smarter, not harder. With powerful features and an intuitive interface, you'll be up and running in minutes.";
      break;

    default:
      result.text =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.";
  }

  return result;
}


/* ══════════════════════════════════════════════════════════
   CHECKBOX CONTENT INFERENCE
   ══════════════════════════════════════════════════════════ */

function inferCheckboxContent(
  node: UINode,
  sectionType: SectionType,
  _slotName: string,
  _content: ContentPreset,
  _positionIndex: number
): InferredContent {
  const result: InferredContent = {};
  const rawLabel = (node.properties?.label as string) || "";
  const currentLabel = rawLabel ? escapeHtml(rawLabel) : "";

  if (isBlankText(currentLabel)) {
    if (sectionType === "form") {
      result.text = "Remember me";
    } else {
      result.text = "I agree to the terms";
    }
  }

  return result;
}


/* ══════════════════════════════════════════════════════════
   NAV CONTENT INFERENCE
   ══════════════════════════════════════════════════════════ */

function inferNavContent(
  node: UINode,
  _sectionType: SectionType,
  slotName: string,
  content: ContentPreset,
  _positionIndex: number
): InferredContent {
  const result: InferredContent = {};

  if (slotName === "logo") {
    // Nav brand name
    if (isBlankText(node.text)) {
      result.text = content.navBrand;
    } else {
      result.text = escapeHtml(node.text || "");
    }
  } else if (slotName === "nav-link") {
    if (isBlankText(node.text)) {
      result.text = deterministicPick(content.navLinks, node.id);
    }
  }

  return result;
}


/* ══════════════════════════════════════════════════════════
   FEATURE ICON INFERENCE
   
   For feature sections, assign rotating icons to each
   feature card/item.
   ══════════════════════════════════════════════════════════ */

function inferFeatureIcon(
  slotName: string,
  featureCount: number
): IconName | undefined {
  if (!slotName.startsWith("feature-icon-") && !slotName.startsWith("feature-")) {
    return undefined;
  }

  const match = slotName.match(/(\d+)/);
  if (!match) return undefined;

  const idx = parseInt(match[1]);
  const icons = getFeatureIcons(featureCount);
  return icons[idx % icons.length];
}


/* ══════════════════════════════════════════════════════════
   MAIN INFERENCE FUNCTION
   
   Takes a node, its section context, and the design identity,
   and returns inferred content overrides.
   
   Called per-node during the builder phase.
   ══════════════════════════════════════════════════════════ */
export function inferContent(
  node: UINode,
  sectionType: SectionType,
  slotName: string,
  identity: DesignIdentity,
  positionIndex: number = 0,
  featureCount: number = 3
): InferredContent {
  const content = identity.content;

  switch (node.role) {
    case "button":
      return inferButtonContent(
        node,
        sectionType,
        slotName,
        content,
        positionIndex
      );

    case "input":
      return inferInputContent(
        node,
        sectionType,
        slotName,
        content,
        positionIndex
      );

    case "heading":
      return inferHeadingContent(
        node,
        sectionType,
        slotName,
        content,
        positionIndex
      );

    case "paragraph":
      return inferParagraphContent(
        node,
        sectionType,
        slotName,
        content,
        positionIndex
      );

    case "checkbox":
      return inferCheckboxContent(
        node,
        sectionType,
        slotName,
        content,
        positionIndex
      );

    case "nav":
      return inferNavContent(
        node,
        sectionType,
        slotName,
        content,
        positionIndex
      );

    case "image":
    case "avatar":
    case "decorative": {
      // Feature icons
      if (sectionType === "features") {
        const icon = inferFeatureIcon(slotName, featureCount);
        if (icon) {
          return { icon };
        }
      }
      return {};
    }

    default:
      return {};
  }
}


/* ══════════════════════════════════════════════════════════
   BATCH INFERENCE
   
   Infer content for all slots in a section at once.
   Returns a Map of nodeId → InferredContent.
   ══════════════════════════════════════════════════════════ */
export function inferSectionContent(
  slots: SlotAssignment[],
  sectionType: SectionType,
  identity: DesignIdentity
): Map<string, InferredContent> {
  const result = new Map<string, InferredContent>();

  // Count features for icon rotation
  const featureCount = slots.filter((s) =>
    s.slotName.startsWith("feature-")
  ).length;

  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    const inferred = inferContent(
      s.node,
      sectionType,
      s.slotName,
      identity,
      i,
      featureCount
    );

    // Only store if we actually inferred something
    if (
      inferred.text ||
      inferred.label ||
      inferred.placeholder ||
      inferred.icon ||
      inferred.variant ||
      inferred.inputType
    ) {
      result.set(s.nodeId, inferred);
    }
  }

  return result;
}