// src/lib/design-engine-pipeline/builder.ts

/* ══════════════════════════════════════════════════════════════════════════════
   RICH BUILDER
   
   The final assembly layer. Takes:
   - UINode tree (from architect + enhancer)
   - DesignIdentity (from design-identity)
   - DetectedSections (from section-engine)
   - InferredContent (from content-inferrer)
   
   And produces a COMPLETE React + Tailwind component string
   with 100-500 lines of production-quality JSX.
   
   ARCHITECTURE:
   1. Page wrapper (min-h-screen, bg, antialiased, fonts)
   2. For each detected section:
      a. Section wrapper (<section> + container + bg)
      b. Section template (hero, form, features, etc.)
      c. Elements placed into template slots
      d. Each element rendered via component-library
      e. Content inferred where user left blanks
   3. Unassigned elements → generic section
   4. Quality metrics logged
   
   Zero AI. Deterministic. < 100ms.
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  UINode,
  DesignIdentity,
  DetectedSection,
  SlotAssignment,
  InferredContent,
  SectionType,
  QualityMetrics,
  IconName,
} from "./types";
import { inferSectionContent } from "./content-inferrer";
import { getFeatureIcons } from "./icon-registry";
import {
  renderButton,
  renderInput,
  renderHeading,
  renderParagraph,
  renderImage,
  renderVideo,
  renderChart,
  renderCheckbox,
  renderAvatar,
  renderDivider,
  renderNav,
  renderFeatureCard,
  renderFeatureGrid,
  renderHeroCentered,
  renderHeroSplit,
  renderFormSection,
  renderFooter as renderFooterContent,
  renderStats,
  renderCTA,
  renderContentSplit,
  renderSectionWrapper,
  renderPageWrapper,
  renderGenericNode,
} from "./component-library";
import type { MergedSection, RecipeSectionType } from "./types";
import type { DesignBrief } from "@/types/style-guide";
import {
  renderRecipeNav,
  renderRecipeHeroCentered,
  renderRecipeHeroSplit,
  renderRecipeLogoCloud,
  renderRecipeFeatures,
  renderRecipeStats,
  renderRecipeTestimonial,
  renderRecipeCTA,
  renderRecipeNewsletter,
  renderRecipeFooter,
  renderRecipeTrustBadges,
  renderRecipePricingCards,
  renderRecipeFAQ,
  renderRecipeAuthCard,
  renderRecipeFeaturesComparison,
} from "./component-library";


/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

function pad(indent: number): string {
  return "  ".repeat(indent);
}

/**
 * Get a slot by name from a section's slots.
 */
function getSlot(
  slots: SlotAssignment[],
  name: string
): SlotAssignment | undefined {
  return slots.find((s) => s.slotName === name);
}

/**
 * Get all slots matching a prefix (e.g., "field-" → field-0, field-1, ...)
 */
function getSlotsWithPrefix(
  slots: SlotAssignment[],
  prefix: string
): SlotAssignment[] {
  return slots.filter((s) => s.slotName.startsWith(prefix));
}

/**
 * Get inferred content for a node, or empty object.
 */
function getInferred(
  contentMap: Map<string, InferredContent>,
  nodeId: string
): InferredContent {
  return contentMap.get(nodeId) || {};
}

/**
 * Get text for a node — inferred text takes priority over original.
 */
function getText(
  node: UINode,
  inferred: InferredContent
): string {
  return inferred.text || node.text || "";
}

/**
 * Determine alternating background for sections.
 * Every other content section gets a subtle background.
 */
function getSectionBackground(
  identity: DesignIdentity,
  sectionType: SectionType,
  sectionIndex: number
): string {
  switch (sectionType) {
    case "nav":
      return ""; // Nav has its own bg in wrapper
    case "hero-centered":
    case "hero-split":
      return identity.backgrounds.hero;
    case "cta":
      return identity.backgrounds.cta;
    case "footer":
      return identity.sections.footer.includes("bg-")
        ? "" // Footer section preset already has bg
        : identity.backgrounds.inverse;
    case "features":
      // Features always get subtle bg for contrast with hero above
      return identity.backgrounds.subtle;
    case "stats":
      return identity.backgrounds.accent;
    case "form":
      return identity.backgrounds.subtle;
    case "content-split":
      // Alternate: even = no bg (white), odd = subtle bg
      return sectionIndex % 2 === 0 ? "" : identity.backgrounds.subtle;
    case "card-grid":
      return sectionIndex % 2 === 0 ? identity.backgrounds.subtle : "";
    default:
      // Generic sections alternate to create visual rhythm
      return sectionIndex % 2 === 0 ? "" : identity.backgrounds.subtle;
  }
}


/* ══════════════════════════════════════════════════════════
   SECTION RENDERERS
   
   Each function renders a complete section from its
   detected slots + inferred content.
   ══════════════════════════════════════════════════════════ */

/**
 * Render NAV section
 */
function renderNavSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  // Brand name
  const logoSlot = getSlot(slots, "logo");
  let brandName = identity.content.navBrand;
  if (logoSlot) {
    const inferred = getInferred(contentMap, logoSlot.nodeId);
    const logoText = getText(logoSlot.node, inferred);
    if (logoText && logoText !== "Type here...") {
      brandName = logoText;
    }
  }

  // Nav links
  const navLinkSlots = getSlotsWithPrefix(slots, "nav-link");
  const navLinks: string[] = [];
  if (navLinkSlots.length > 0) {
    for (const s of navLinkSlots) {
      const inferred = getInferred(contentMap, s.nodeId);
      navLinks.push(getText(s.node, inferred) || "Link");
    }
  } else {
    navLinks.push(...identity.content.navLinks.slice(0, 4));
  }

  // CTA buttons
  const ctaButtons: string[] = [];
  const ctaSecondary = getSlot(slots, "cta-secondary");
  const ctaPrimary = getSlot(slots, "cta-primary");

  if (ctaSecondary) {
    const inf = getInferred(contentMap, ctaSecondary.nodeId);
    ctaButtons.push(
      renderButton(
        identity,
        indent + 4,
        getText(ctaSecondary.node, inf) || "Log In",
        inf.variant || "ghost"
      )
    );
  }

  if (ctaPrimary) {
    const inf = getInferred(contentMap, ctaPrimary.nodeId);
    ctaButtons.push(
      renderButton(
        identity,
        indent + 4,
        getText(ctaPrimary.node, inf) || "Sign Up",
        inf.variant || "primary",
        inf.icon,
        inf.iconPosition || "right",
        "sm"
      )
    );
  }

  // If no CTA buttons from drawing, add defaults
  if (ctaButtons.length === 0) {
    ctaButtons.push(
      renderButton(identity, indent + 4, "Log In", "ghost", undefined, "right", "sm")
    );
    ctaButtons.push(
      renderButton(identity, indent + 4, "Sign Up", "primary", "arrow-right", "right", "sm")
    );
  }

  return renderNav(identity, indent, brandName, ctaButtons, navLinks);
}

/**
 * Render HERO (centered) section
 */
function renderHeroSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  // Heading
  const headingSlot = getSlot(slots, "heading");
  let headingText = identity.content.heroHeadings[0];
  if (headingSlot) {
    const inf = getInferred(contentMap, headingSlot.nodeId);
    headingText = getText(headingSlot.node, inf) || headingText;
  }

  // Subtext
  const subtextSlot = getSlot(slots, "subtext");
  let subtextText = identity.content.heroSubtexts[0];
  if (subtextSlot) {
    const inf = getInferred(contentMap, subtextSlot.nodeId);
    subtextText = getText(subtextSlot.node, inf) || subtextText;
  }

  // CTAs
  const ctaPrimarySlot = getSlot(slots, "cta-primary");
  const ctaSecondarySlot = getSlot(slots, "cta-secondary");

  let primaryCTA: { text: string; icon?: IconName } | undefined;
  let secondaryCTA: { text: string; icon?: IconName } | undefined;

  if (ctaPrimarySlot) {
    const inf = getInferred(contentMap, ctaPrimarySlot.nodeId);
    primaryCTA = {
      text: getText(ctaPrimarySlot.node, inf) || identity.content.ctaPrimary[0],
      icon: inf.icon,
    };
  } else {
    primaryCTA = { text: identity.content.ctaPrimary[0], icon: "arrow-right" };
  }

  if (ctaSecondarySlot) {
    const inf = getInferred(contentMap, ctaSecondarySlot.nodeId);
    secondaryCTA = {
      text: getText(ctaSecondarySlot.node, inf) || identity.content.ctaSecondary[0],
      icon: inf.icon,
    };
  }

  // Check for media (split vs centered)
  const mediaSlot = getSlot(slots, "media");

  if (section.type === "hero-split" && mediaSlot) {
    const mediaContent = renderImage(identity, indent + 3, "hero");
    return renderHeroSplit(
      identity,
      indent,
      headingText,
      subtextText,
      mediaContent,
      primaryCTA,
      secondaryCTA
    );
  }

  return renderHeroCentered(
    identity,
    indent,
    headingText,
    subtextText,
    primaryCTA,
    secondaryCTA
  );
}

/**
 * Render FORM section
 */
function renderFormSectionContent(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  // Heading
  const headingSlot = getSlot(slots, "heading");
  let headingText = identity.content.formHeadings[0];
  if (headingSlot) {
    const inf = getInferred(contentMap, headingSlot.nodeId);
    headingText = getText(headingSlot.node, inf) || headingText;
  }

  // Description
  const descSlot = getSlot(slots, "description");
  let descText = identity.content.formSubtexts[0];
  if (descSlot) {
    const inf = getInferred(contentMap, descSlot.nodeId);
    descText = getText(descSlot.node, inf) || descText;
  }

  // Fields
  const fieldSlots = getSlotsWithPrefix(slots, "field-");
  const fields: string[] = [];

  for (const fieldSlot of fieldSlots) {
    const inf = getInferred(contentMap, fieldSlot.nodeId);
    fields.push(
      renderInput(
        identity,
        indent + 2,
        inf.label || (fieldSlot.node.properties?.label as string),
        inf.placeholder || (fieldSlot.node.properties?.placeholder as string),
        inf.inputType,
        inf.icon
      )
    );
  }

  // If no fields from drawing, add defaults
  if (fields.length === 0) {
    fields.push(renderInput(identity, indent + 2, "Email", "you@example.com", "email", "mail"));
    fields.push(renderInput(identity, indent + 2, "Password", "••••••••", "password", "lock"));
  }

  // Extras (checkboxes)
  const extras: string[] = [];
  const checkboxSlots = getSlotsWithPrefix(slots, "checkbox");
  for (const cbSlot of checkboxSlots) {
    const inf = getInferred(contentMap, cbSlot.nodeId);
    extras.push(
      renderCheckbox(
        identity,
        indent + 2,
        inf.text || (cbSlot.node.properties?.label as string) || "Remember me",
        (cbSlot.node.properties?.checked as boolean) || false
      )
    );
  }

  // Submit button
  const submitSlot = getSlot(slots, "submit");
  let submitButton: string;
  if (submitSlot) {
    const inf = getInferred(contentMap, submitSlot.nodeId);
    submitButton = renderButton(
      identity,
      indent + 2,
      getText(submitSlot.node, inf) || "Sign In",
      inf.variant || "primary",
      inf.icon,
      inf.iconPosition || "right",
      "md",
      true // full width
    );
  } else {
    submitButton = renderButton(
      identity,
      indent + 2,
      "Sign In",
      "primary",
      "arrow-right",
      "right",
      "md",
      true
    );
  }

  return renderFormSection(
    identity,
    indent,
    headingText,
    descText,
    fields,
    submitButton,
    extras
  );
}

/**
 * Render FEATURES section
 */
function renderFeaturesSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  // ═══ v4.0: Check for grid-container slot ═══
  const gridContainerSlot = getSlot(slots, "grid-container");
  if (gridContainerSlot && gridContainerSlot.node.properties?.isGrid) {
    return renderGridFeaturesSection(
      gridContainerSlot.node,
      section,
      identity,
      contentMap,
      indent
    );
  }
  // ═══ v4.0 END ═══

  // Section heading
  const sectionHeadingSlot = getSlot(slots, "section-heading");
  let sectionHeading = "Everything you need";
  if (sectionHeadingSlot) {
    const inf = getInferred(contentMap, sectionHeadingSlot.nodeId);
    sectionHeading = getText(sectionHeadingSlot.node, inf) || sectionHeading;
  }

  // Section description
  const sectionDescSlot = getSlot(slots, "section-description");
  let sectionDesc = "";
  if (sectionDescSlot) {
    const inf = getInferred(contentMap, sectionDescSlot.nodeId);
    sectionDesc = getText(sectionDescSlot.node, inf) || "";
  }

  // Feature cards
  const featureSlots = getSlotsWithPrefix(slots, "feature-");
  const featureCardSlots = featureSlots.filter(
    (s) =>
      s.slotName.match(/^feature-\d+$/) ||
      s.slotName.startsWith("feature-icon-")
  );

  const featureCount = Math.max(
    featureCardSlots.length,
    getSlotsWithPrefix(slots, "feature-icon-").length,
    3
  );
  const icons = getFeatureIcons(featureCount);

  const featureCards: string[] = [];

  // Check if we have icon-style features (icon + title + text)
  const iconSlots = getSlotsWithPrefix(slots, "feature-icon-");

  if (iconSlots.length > 0) {
    // Icon-based feature layout
    for (let i = 0; i < iconSlots.length; i++) {
      const titleSlot = getSlot(slots, `feature-title-${i}`);
      const textSlot = getSlot(slots, `feature-text-${i}`);

      const titleInf = titleSlot ? getInferred(contentMap, titleSlot.nodeId) : {};
      const textInf = textSlot ? getInferred(contentMap, textSlot.nodeId) : {};

      const title = (titleSlot ? getText(titleSlot.node, titleInf) : "") ||
        identity.content.featureTitles[i % identity.content.featureTitles.length];
      const text = (textSlot ? getText(textSlot.node, textInf) : "") ||
        identity.content.featureTexts[i % identity.content.featureTexts.length];

      featureCards.push(
        renderFeatureCard(identity, indent + 1, title, text, icons[i % icons.length])
      );
    }
  } else if (featureCardSlots.length > 0) {
    // Container-based features
    for (let i = 0; i < featureCardSlots.length; i++) {
      const s = featureCardSlots[i];
      // Try to extract title and text from card children
      const cardNode = s.node;
      let title = "";
      let text = "";

      if (cardNode.children) {
        for (const child of cardNode.children) {
          if (child.role === "heading" && !title) title = child.text || "";
          if (child.role === "paragraph" && !text) text = child.text || "";
        }
      }

      if (!title || title === "Type here..." || title === "Heading") {
        title = identity.content.featureTitles[i % identity.content.featureTitles.length];
      }
      if (!text || text === "Type here...") {
        text = identity.content.featureTexts[i % identity.content.featureTexts.length];
      }

      featureCards.push(
        renderFeatureCard(identity, indent + 1, title, text, icons[i % icons.length])
      );
    }
  } else {
    // No features from drawing — generate defaults
    for (let i = 0; i < 3; i++) {
      featureCards.push(
        renderFeatureCard(
          identity,
          indent + 1,
          identity.content.featureTitles[i],
          identity.content.featureTexts[i],
          icons[i]
        )
      );
    }
  }

  return renderFeatureGrid(
    identity,
    indent,
    sectionHeading,
    sectionDesc,
    featureCards,
    Math.min(featureCards.length, 4)
  );
}

/**
 * Render FOOTER section
 */
function renderFooterSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  // Collect link texts
  const linkSlots = getSlotsWithPrefix(slots, "footer-");
  const links: string[] = [];

  for (const s of linkSlots) {
    if (s.slotName === "footer-text" || s.slotName === "footer-link") {
      const inf = getInferred(contentMap, s.nodeId);
      const text = getText(s.node, inf);
      if (text && text !== "Type here...") {
        links.push(text);
      }
    }
  }

  if (links.length === 0) {
    links.push(...identity.content.footerLinks);
  }

  return renderFooterContent(
    identity,
    indent,
    identity.content.navBrand,
    links,
    identity.content.footerCopy
  );
}

/**
 * Render STATS section
 */
function renderStatsSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;
  const stats: Array<{ value: string; label: string }> = [];

  const valueSlots = getSlotsWithPrefix(slots, "stat-value-");
  for (let i = 0; i < valueSlots.length; i++) {
    const valueInf = getInferred(contentMap, valueSlots[i].nodeId);
    const labelSlot = getSlot(slots, `stat-label-${i}`);
    const labelInf = labelSlot ? getInferred(contentMap, labelSlot.nodeId) : {};

    stats.push({
      value: getText(valueSlots[i].node, valueInf) || `${(i + 1) * 10}K+`,
      label: labelSlot
        ? getText(labelSlot.node, labelInf) || "Metric"
        : "Metric",
    });
  }

  if (stats.length === 0) {
    stats.push(
      { value: "10K+", label: "Active Users" },
      { value: "99.9%", label: "Uptime" },
      { value: "24/7", label: "Support" },
      { value: "150+", label: "Integrations" }
    );
  }

  return renderStats(identity, indent, stats);
}

/**
 * Render CTA section
 */
function renderCTASection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  const headingSlot = getSlot(slots, "heading");
  const subtextSlot = getSlot(slots, "subtext");

  let heading = identity.content.heroHeadings[1] || "Ready to get started?";
  let subtext = "";

  if (headingSlot) {
    const inf = getInferred(contentMap, headingSlot.nodeId);
    heading = getText(headingSlot.node, inf) || heading;
  }
  if (subtextSlot) {
    const inf = getInferred(contentMap, subtextSlot.nodeId);
    subtext = getText(subtextSlot.node, inf) || "";
  }

  const ctaPrimarySlot = getSlot(slots, "cta-primary");
  const ctaSecondarySlot = getSlot(slots, "cta-secondary");

  let primaryCTA: { text: string; icon?: IconName } | undefined;
  let secondaryCTA: { text: string; icon?: IconName } | undefined;

  if (ctaPrimarySlot) {
    const inf = getInferred(contentMap, ctaPrimarySlot.nodeId);
    primaryCTA = {
      text: getText(ctaPrimarySlot.node, inf) || identity.content.ctaPrimary[0],
      icon: inf.icon,
    };
  } else {
    primaryCTA = { text: identity.content.ctaPrimary[0], icon: "arrow-right" };
  }

  if (ctaSecondarySlot) {
    const inf = getInferred(contentMap, ctaSecondarySlot.nodeId);
    secondaryCTA = {
      text: getText(ctaSecondarySlot.node, inf) || identity.content.ctaSecondary[0],
      icon: inf.icon,
    };
  }

  return renderCTA(identity, indent, heading, subtext, primaryCTA, secondaryCTA);
}

/**
 * Render CONTENT SPLIT section
 */
function renderContentSplitSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const slots = section.slots;

  // Text content
  const textLines: string[] = [];
  const contentHeadingSlot = getSlot(slots, "content-heading");
  const contentTextSlot = getSlot(slots, "content-text");

  if (contentHeadingSlot) {
    const inf = getInferred(contentMap, contentHeadingSlot.nodeId);
    textLines.push(
      renderHeading(identity, indent + 2, getText(contentHeadingSlot.node, inf) || "Built for the modern web", 2)
    );
  }
  if (contentTextSlot) {
    const inf = getInferred(contentMap, contentTextSlot.nodeId);
    textLines.push(
      renderParagraph(identity, indent + 2, getText(contentTextSlot.node, inf) || "")
    );
  }

  // CTA buttons
  const ctaSlots = getSlotsWithPrefix(slots, "content-cta");
  for (const cta of ctaSlots) {
    const inf = getInferred(contentMap, cta.nodeId);
    textLines.push(
      renderButton(
        identity,
        indent + 2,
        getText(cta.node, inf) || "Learn More",
        inf.variant || "primary",
        inf.icon || "arrow-right"
      )
    );
  }

  const textContent = textLines.join("\n");

  // Media content
  const mediaSlot = getSlot(slots, "media");
  const mediaContent = mediaSlot
    ? renderImage(identity, indent + 2, "hero")
    : renderImage(identity, indent + 2, "hero");

  return renderContentSplit(identity, indent, textContent, mediaContent);
}

/**
 * Render CARD GRID section
 */
function renderCardGridSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const p = pad(indent);
  const slots = section.slots;
  const lines: string[] = [];

  // Section heading
  const headingSlot = getSlot(slots, "section-heading");
  if (headingSlot) {
    const inf = getInferred(contentMap, headingSlot.nodeId);
    lines.push(
      `${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`
    );
    lines.push(
      renderHeading(identity, indent + 1, getText(headingSlot.node, inf) || "Featured", 2, true)
    );
    lines.push(`${p}</div>`);
  }

  // Cards
  const cardSlots = getSlotsWithPrefix(slots, "card-");
  const colCount = Math.min(cardSlots.length, 4);
  const colClass =
    colCount <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : colCount === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  lines.push(`${p}<div className="grid ${colClass} ${identity.spacing.groupGap}">`);

  for (const cardSlot of cardSlots) {
    const cardNode = cardSlot.node;
    // Render card children
    const childContent = cardNode.children
      .map((child) => renderGenericNode(identity, indent + 2, child))
      .join("\n");

    lines.push(`${pad(indent + 1)}<div className="${identity.components.card.interactive}">`);
    lines.push(`${pad(indent + 2)}<div className="p-6 ${identity.spacing.stackMd}">`);
    if (childContent) {
      lines.push(childContent);
    } else {
      lines.push(renderImage(identity, indent + 3, "card"));
      lines.push(renderHeading(identity, indent + 3, "Card Title", 4));
      lines.push(renderParagraph(identity, indent + 3, "Card description goes here.", "bodySm"));
    }
    lines.push(`${pad(indent + 2)}</div>`);
    lines.push(`${pad(indent + 1)}</div>`);
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

/**
 * Render GENERIC section (fallback for unmatched nodes)
 */
/**
 * Render GENERIC section (fallback for unmatched nodes)
 * 
 * v4.0: Instead of dumping each shape at raw pixel dimensions,
 * apply intelligent grouping:
 * - Skip decorative elements (they add visual noise)
 * - Group headings + paragraphs into text blocks
 * - Apply proper spacing and identity styling
 * - Use max-width containers for readability
 */
/**
 * Render GENERIC section (fallback for unmatched nodes)
 * 
 * v4.1 FIX: Instead of dumping slots vertically, analyze them
 * to produce intelligent layouts (hero-like, split, grid).
 */
function renderGenericSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const p = pad(indent);
  const slots = section.slots;

  // Categorize slots by role
  const headings: SlotAssignment[] = [];
  const paragraphs: SlotAssignment[] = [];
  const buttons: SlotAssignment[] = [];
  const media: SlotAssignment[] = [];
  const containers: SlotAssignment[] = [];
  const dividers: SlotAssignment[] = [];
  const other: SlotAssignment[] = [];

  for (const slot of slots) {
    const role = slot.node.role;
    switch (role) {
      case "heading":
        headings.push(slot);
        break;
      case "paragraph":
        paragraphs.push(slot);
        break;
      case "button":
        buttons.push(slot);
        break;
      case "image":
      case "video":
      case "chart":
        media.push(slot);
        break;
      case "container":
      case "card":
        containers.push(slot);
        break;
      case "divider":
        dividers.push(slot);
        break;
      case "decorative":
      case "device-wrapper":
      case "avatar":
        // Skip these — they produce noise
        break;
      default:
        other.push(slot);
    }
  }

  // Also check inside containers for headings/text (user might have drawn text inside a rectangle)
  for (const container of containers) {
    for (const child of container.node.children) {
      if (child.role === "heading" && !headings.some(h => h.node.id === child.id)) {
        headings.push({ slotName: "nested-heading", nodeId: child.id, node: child });
      }
      if (child.role === "paragraph" && !paragraphs.some(p => p.node.id === child.id)) {
        paragraphs.push({ slotName: "nested-paragraph", nodeId: child.id, node: child });
      }
      if (child.role === "button" && !buttons.some(b => b.node.id === child.id)) {
        buttons.push({ slotName: "nested-button", nodeId: child.id, node: child });
      }
    }
  }

  const lines: string[] = [];

  // ─── PATTERN: Hero-like (heading + text + buttons, with or without media) ───
  if (headings.length > 0 || (paragraphs.length > 0 && buttons.length > 0)) {
    const hasMedia = media.length > 0;

    if (hasMedia) {
      // Split layout: text left, media right
      lines.push(`${p}<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">`);

      // Text side
      lines.push(`${p}  <div className="${identity.spacing.stackLg}">`);

      // Render heading (use first one, or create from paragraph)
      if (headings.length > 0) {
        const h = headings[0];
        const inf = getInferred(contentMap, h.nodeId);
        const text = getText(h.node, inf);
        // Don't replace user text unless it's truly blank
        const headingText = isRealText(text) ? text : identity.content.heroHeadings[0];
        const level = (h.node.properties?.headingLevel as number) || 1;
        lines.push(renderHeading(identity, indent + 2, headingText, level));
      }

      // Render paragraphs (skip ones used as heading substitute)
      for (const para of paragraphs.slice(0, 2)) {
        const inf = getInferred(contentMap, para.nodeId);
        const text = getText(para.node, inf);
        const paraText = isRealText(text) ? text : identity.content.heroSubtexts[0];
        lines.push(renderParagraph(identity, indent + 2, paraText, "bodyLg"));
      }

      // Render buttons
      if (buttons.length > 0) {
        lines.push(`${pad(indent + 2)}<div className="flex flex-wrap gap-4 pt-2">`);
        for (let i = 0; i < Math.min(buttons.length, 2); i++) {
          const btn = buttons[i];
          const inf = getInferred(contentMap, btn.nodeId);
          const text = getText(btn.node, inf);
          const btnText = isRealText(text) ? text : identity.content.ctaPrimary[i];
          const variant = i === 0 ? "primary" : "secondary";
          lines.push(renderButton(identity, indent + 3, btnText, variant, i === 0 ? "arrow-right" : undefined));
        }
        lines.push(`${pad(indent + 2)}</div>`);
      }

      lines.push(`${p}  </div>`);

      // Media side
      lines.push(`${p}  <div>`);
      const m = media[0];
      if (m.node.role === "video") {
        lines.push(renderVideo(identity, indent + 2));
      } else if (m.node.role === "chart") {
        lines.push(renderChart(identity, indent + 2, (m.node.properties?.chartType as string) || "bar"));
      } else {
        lines.push(renderImage(identity, indent + 2, "hero"));
      }
      lines.push(`${p}  </div>`);

      lines.push(`${p}</div>`);
    } else {
      // Centered layout (no media)
      lines.push(`${p}<div className="text-center ${identity.spacing.stackLg} max-w-3xl mx-auto">`);

      if (headings.length > 0) {
        const h = headings[0];
        const inf = getInferred(contentMap, h.nodeId);
        const text = getText(h.node, inf);
        const headingText = isRealText(text) ? text : identity.content.heroHeadings[0];
        const level = (h.node.properties?.headingLevel as number) || 1;
        lines.push(renderHeading(identity, indent + 1, headingText, level, true, true));
      }

      for (const para of paragraphs.slice(0, 2)) {
        const inf = getInferred(contentMap, para.nodeId);
        const text = getText(para.node, inf);
        const paraText = isRealText(text) ? text : identity.content.heroSubtexts[0];
        lines.push(renderParagraph(identity, indent + 1, paraText, "bodyLg", true, true));
      }

      if (buttons.length > 0) {
        lines.push(`${pad(indent + 1)}<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">`);
        for (let i = 0; i < Math.min(buttons.length, 2); i++) {
          const btn = buttons[i];
          const inf = getInferred(contentMap, btn.nodeId);
          const text = getText(btn.node, inf);
          const btnText = isRealText(text) ? text : identity.content.ctaPrimary[i];
          const variant = i === 0 ? "primary" : "secondary";
          lines.push(renderButton(identity, indent + 2, btnText, variant, i === 0 ? "arrow-right" : undefined, "right", "lg"));
        }
        lines.push(`${pad(indent + 1)}</div>`);
      }

      lines.push(`${p}</div>`);
    }

    return lines.join("\n");
  }

  // ─── PATTERN: Card grid (multiple containers/cards) ───
  if (containers.length >= 2) {
    const colCount = Math.min(containers.length, 4);
    const colClass = colCount === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : colCount === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

    lines.push(`${p}<div className="grid ${colClass} ${identity.spacing.groupGap}">`);
    for (const container of containers) {
      lines.push(renderGenericNode(identity, indent + 1, container.node));
    }
    lines.push(`${p}</div>`);
    return lines.join("\n");
  }

  // ─── FALLBACK: Simple vertical stack ───
  lines.push(`${p}<div className="${identity.spacing.stackLg}">`);

  // Render dividers first (usually at top)
  for (const div of dividers) {
    lines.push(renderDivider(identity, indent + 1));
  }

  // Then headings
  for (const h of headings) {
    const inf = getInferred(contentMap, h.nodeId);
    const text = getText(h.node, inf);
    const level = (h.node.properties?.headingLevel as number) || 2;
    lines.push(renderHeading(identity, indent + 1, isRealText(text) ? text : "Heading", level));
  }

  // Then paragraphs
  for (const para of paragraphs) {
    const inf = getInferred(contentMap, para.nodeId);
    const text = getText(para.node, inf);
    lines.push(renderParagraph(identity, indent + 1, isRealText(text) ? text : ""));
  }

  // Then media
  for (const m of media) {
    if (m.node.role === "video") {
      lines.push(renderVideo(identity, indent + 1));
    } else if (m.node.role === "chart") {
      lines.push(renderChart(identity, indent + 1, (m.node.properties?.chartType as string) || "bar"));
    } else {
      lines.push(renderImage(identity, indent + 1, "default"));
    }
  }

  // Then buttons
  if (buttons.length > 0) {
    lines.push(`${pad(indent + 1)}<div className="flex flex-wrap gap-4">`);
    for (const btn of buttons) {
      const inf = getInferred(contentMap, btn.nodeId);
      const text = getText(btn.node, inf);
      lines.push(renderButton(identity, indent + 2, isRealText(text) ? text : "Button", inf.variant || "primary", inf.icon));
    }
    lines.push(`${pad(indent + 1)}</div>`);
  }

  // Then containers
  for (const container of containers) {
    lines.push(renderGenericNode(identity, indent + 1, container.node));
  }

  // Then other
  for (const o of other) {
    const inf = getInferred(contentMap, o.nodeId);
    lines.push(renderGenericNode(identity, indent + 1, o.node, inf));
  }

  lines.push(`${p}</div>`);
  return lines.join("\n");
}

/**
 * Check if text is actual user content (not placeholder/blank).
 */
function isRealText(text: string): boolean {
  if (!text) return false;
  const t = text.trim().toLowerCase();
  const blanks = [
    "", "type here...", "heading", "text", "button", "label",
    "placeholder", "enter text...", "paragraph", "title"
  ];
  return !blanks.includes(t);
}

/* ══════════════════════════════════════════════════════════
   v4.0: BLANK TEXT CHECK
   ══════════════════════════════════════════════════════════ */
function isBlankText(text: string): boolean {
  const t = text.trim().toLowerCase();
  return (
    t === "" ||
    t === "type here..." ||
    t === "heading" ||
    t === "text" ||
    t === "button" ||
    t === "label" ||
    t === "placeholder"
  );
}

/* ══════════════════════════════════════════════════════════
   v4.0: RENDER GRID-BASED FEATURES SECTION
   
   When the section engine detected a grid container,
   this renders it with CSS Grid instead of flex rows.
   ══════════════════════════════════════════════════════════ */
function renderGridFeaturesSection(
  gridNode: UINode,
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const p = pad(indent);
  const lines: string[] = [];
  const slots = section.slots;

  // Section heading (above the grid)
  const sectionHeadingSlot = getSlot(slots, "section-heading");
  let sectionHeading = "Everything you need";
  if (sectionHeadingSlot) {
    const inf = getInferred(contentMap, sectionHeadingSlot.nodeId);
    sectionHeading = getText(sectionHeadingSlot.node, inf) || sectionHeading;
  }

  const sectionDescSlot = getSlot(slots, "section-description");
  let sectionDesc = "";
  if (sectionDescSlot) {
    const inf = getInferred(contentMap, sectionDescSlot.nodeId);
    sectionDesc = getText(sectionDescSlot.node, inf) || "";
  }

  // Section header
  if (sectionHeading) {
    lines.push(`${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`);
    lines.push(renderHeading(identity, indent + 1, sectionHeading, 2, true, true));
    if (sectionDesc) {
      lines.push(renderParagraph(identity, indent + 1, sectionDesc, "bodyLg", true, true));
    }
    lines.push(`${p}</div>`);
  }

  // Grid layout
  const cols = (gridNode.properties.gridCols as number) || 3;
  const colGapPx = (gridNode.properties.gridColGap as number) || 24;
  const rowGapPx = (gridNode.properties.gridRowGap as number) || 24;

  const colGapTw = pxToTailwindGap(colGapPx);
  const rowGapTw = pxToTailwindGap(rowGapPx);

  let colClasses: string;
  if (cols >= 4) {
    colClasses = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols}`;
  } else if (cols === 3) {
    colClasses = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  } else {
    colClasses = `grid-cols-1 sm:grid-cols-${cols}`;
  }

  lines.push(
    `${p}<div className="grid ${colClasses} gap-x-${colGapTw} gap-y-${rowGapTw}">`
  );

  // Render each grid child as a feature card
  const icons = getFeatureIcons(gridNode.children.length);

  for (let i = 0; i < gridNode.children.length; i++) {
    const child = gridNode.children[i];

    // Extract title and description from card children
    let title = "";
    let desc = "";

    if (child.children && child.children.length > 0) {
      for (const sub of child.children) {
        if (sub.role === "heading" && !title) {
          title = sub.text || "";
        }
        if (sub.role === "paragraph" && !desc) {
          desc = sub.text || "";
        }
      }
    }

    if (!title || isBlankText(title)) {
      title = identity.content.featureTitles[i % identity.content.featureTitles.length];
    }
    if (!desc || isBlankText(desc)) {
      desc = identity.content.featureTexts[i % identity.content.featureTexts.length];
    }

    lines.push(
      renderFeatureCard(
        identity,
        indent + 1,
        title,
        desc,
        icons[i % icons.length]
      )
    );
  }

  lines.push(`${p}</div>`);
  return lines.join("\n");
}

/**
 * v4.0: Convert pixel gap to Tailwind gap number.
 * gap-1 = 4px, gap-2 = 8px, ..., gap-16 = 64px
 */
function pxToTailwindGap(px: number): number {
  const mapping = [
    { tw: 1, px: 4 },
    { tw: 2, px: 8 },
    { tw: 3, px: 12 },
    { tw: 4, px: 16 },
    { tw: 5, px: 20 },
    { tw: 6, px: 24 },
    { tw: 8, px: 32 },
    { tw: 10, px: 40 },
    { tw: 12, px: 48 },
    { tw: 16, px: 64 },
  ];
  const nearest = mapping.reduce((prev, curr) =>
    Math.abs(curr.px - px) < Math.abs(prev.px - px) ? curr : prev
  );
  return nearest.tw;
}


/* ══════════════════════════════════════════════════════════
   SECTION DISPATCHER
   
   Routes each detected section to its specific renderer.
   ══════════════════════════════════════════════════════════ */
function renderSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  switch (section.type) {
    case "nav":
      return renderNavSection(section, identity, contentMap, indent);
    case "hero-centered":
    case "hero-split":
      return renderHeroSection(section, identity, contentMap, indent);
    case "form":
      return renderFormSectionContent(section, identity, contentMap, indent);
    case "features":
      return renderFeaturesSection(section, identity, contentMap, indent);
    case "footer":
      return renderFooterSection(section, identity, contentMap, indent);
    case "stats":
      return renderStatsSection(section, identity, contentMap, indent);
    case "cta":
      return renderCTASection(section, identity, contentMap, indent);
    case "content-split":
      return renderContentSplitSection(section, identity, contentMap, indent);
    case "card-grid":
      return renderCardGridSection(section, identity, contentMap, indent);
    case "generic":
    default:
      return renderGenericSection(section, identity, contentMap, indent);
  }
}


/* ══════════════════════════════════════════════════════════
   QUALITY METRICS
   ══════════════════════════════════════════════════════════ */
function measureQuality(
  code: string,
  sections: DetectedSection[]
): QualityMetrics {
  const lines = code.split("\n");
  const allClasses = code.match(/className="[^"]*"/g) || [];

  let totalClasses = 0;
  let responsivePrefixes = 0;
  let hoverStates = 0;
  let focusStates = 0;
  let backgroundVariations = 0;
  const typographySizes = new Set<string>();

  for (const match of allClasses) {
    const classes = match.replace('className="', "").replace('"', "").split(/\s+/);
    totalClasses += classes.length;

    for (const cls of classes) {
      if (cls.startsWith("sm:") || cls.startsWith("md:") || cls.startsWith("lg:") || cls.startsWith("xl:")) {
        responsivePrefixes++;
      }
      if (cls.startsWith("hover:")) hoverStates++;
      if (cls.startsWith("focus:") || cls.startsWith("focus-visible:")) focusStates++;
      if (cls.startsWith("bg-") && !cls.includes("bg-white") && !cls.includes("bg-transparent")) {
        backgroundVariations++;
      }
      if (cls.startsWith("text-") && (cls.includes("xl") || cls.includes("lg") || cls.includes("sm") || cls.includes("base"))) {
        typographySizes.add(cls);
      }
    }
  }

  return {
    totalClasses,
    responsivePrefixes,
    hoverStates,
    focusStates,
    sectionsDetected: sections.filter((s) => s.type !== "generic").length,
    outputLines: lines.length,
    backgroundVariations: new Set(
      (code.match(/bg-[^\s"]+/g) || [])
    ).size,
    typographyLevels: typographySizes.size,
  };
}


/* ══════════════════════════════════════════════════════════
   MAIN BUILDER FUNCTION
   
   Assembles all sections into a complete React component.
   ══════════════════════════════════════════════════════════ */
export function generateCode(
  tree: UINode,
  identity: DesignIdentity,
  sections: DetectedSection[]
): string {
  const baseIndent = 2;
  const lines: string[] = [];

  // ═══ v4.0: Frame ratio → section spacing scaling ═══
  const frameRatio = (tree.properties?.frameRatio as number) || 1;
  // For tall frames (ratio > 1.8), scale section padding up
  // ratio 1.0 → factor 1.0 (no change)
  // ratio 2.0 → factor 1.2
  // ratio 3.0 → factor 1.6
  const spacingFactor = frameRatio > 1.8 ? 1 + (frameRatio - 1.8) * 0.5 : 1;
  // ═══ v4.0 END ═══

  // ─── Page wrapper ───
  const page = renderPageWrapper(identity, baseIndent);
  lines.push(page.open);

  // ─── Render each section in order ───
  let contentSectionIndex = 0;

  for (const section of sections) {
    const contentMap = inferSectionContent(
      section.slots,
      section.type,
      identity
    );

    if (section.type === "nav") {
      const navHtml = renderSection(section, identity, contentMap, baseIndent + 1);
      const navWithStagger = navHtml.replace(
        /^(\s*<(?:nav|header)\s)/,
        `$1style={{ animationDelay: "0ms" }} `
      );
      lines.push(navWithStagger);
      lines.push("");
    } else if (section.type === "footer") {
      const bg = getSectionBackground(identity, section.type, contentSectionIndex);
      // ═══ v4.0: Pass spacingFactor ═══
      const wrapper = renderSectionWrapper(identity, baseIndent + 1, "footer", bg, spacingFactor);

      const footerIdx = contentSectionIndex + 2;
      const footerWithStagger = wrapper.open.replace(
        /^(\s*<(?:section|footer)\s)/,
        `$1style={{ animationDelay: "${footerIdx * 100}ms" }} `
      );

      lines.push(footerWithStagger);
      lines.push(
        renderSection(section, identity, contentMap, baseIndent + 3)
      );
      lines.push(wrapper.close);
    } else {
      const bg = getSectionBackground(identity, section.type, contentSectionIndex);
      // ═══ v4.0: Pass spacingFactor ═══
      const wrapper = renderSectionWrapper(identity, baseIndent + 2, section.type, bg, spacingFactor);

      if (contentSectionIndex === 0) {
        lines.push(
          `${pad(baseIndent + 1)}<main className="${identity.page.mainContent}">`
        );
      }

      const sectionIdx = contentSectionIndex + 1;
      const staggerStyle = ` style={{ animationDelay: "${sectionIdx * 100}ms" }}`;

      const wrapperWithStagger = wrapper.open.replace(
        /^(\s*<section\s)/,
        `$1${staggerStyle} `
      );

      lines.push(wrapperWithStagger);
      lines.push(
        renderSection(section, identity, contentMap, baseIndent + 4)
      );
      lines.push(wrapper.close);
      lines.push("");

      contentSectionIndex++;
    }
  }

  if (contentSectionIndex > 0) {
    lines.push(`${pad(baseIndent + 1)}</main>`);
  }

  lines.push(page.close);

  const jsx = lines.filter((l) => l !== undefined).join("\n");

  const code = `export default function GeneratedUI() {
  return (
${jsx}
  );
}`;

  const metrics = measureQuality(code, sections);
  console.log("[D2D Quality]", {
    classes: metrics.totalClasses,
    responsive: metrics.responsivePrefixes,
    hover: metrics.hoverStates,
    focus: metrics.focusStates,
    sections: metrics.sectionsDetected,
    lines: metrics.outputLines,
    backgrounds: metrics.backgroundVariations,
    typography: metrics.typographyLevels,
  });

  return code;
}

// ═══════════════════════════════════════════════════════════════════════════════
// v5.0 — RECIPE-BASED CODE GENERATION
//
// generateMergedCode() renders merged sections (recipe + wireframe).
// Wireframe sections use existing rendering path (renderSection).
// Recipe sections use renderSectionFromRecipe → renderRecipeXxx functions.
// ═══════════════════════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════
// SECTION BACKGROUND — from recipe bg intent
// ═══════════════════════════════════════════════════════════

function getRecipeSectionBackground(
  identity: DesignIdentity,
  bg?: string,
  sectionType?: string,
  sectionIndex?: number
): string {
  // If recipe defines explicit bg intent, use it
  if (bg) {
    switch (bg) {
      case "hero": return identity.backgrounds.hero;
      case "page": return "";
      case "subtle": return identity.backgrounds.subtle;
      case "accent": return identity.backgrounds.accent;
      case "cta": return identity.backgrounds.cta;
      case "inverse": return identity.backgrounds.inverse;
      default: return "";
    }
  }

  // Fallback to existing logic
  return getSectionBackground(
    identity,
    (sectionType || "generic") as SectionType,
    sectionIndex || 0
  );
}

// ═══════════════════════════════════════════════════════════
// RENDER A SINGLE RECIPE SECTION
// ═══════════════════════════════════════════════════════════

function renderSectionFromRecipe(
  type: RecipeSectionType,
  config: Record<string, unknown> | undefined,
  identity: DesignIdentity,
  brief: DesignBrief,
  indent: number
): string {
  const brandName = brief.brandName || identity.content.navBrand || "Brand";
  const industry = brief.industry || "tech";

  switch (type) {
    case "nav":
      return renderRecipeNav(identity, indent, brandName, industry);

    case "hero-split":
      return renderRecipeHeroSplit(identity, indent, brandName, industry);

    case "hero-centered":
      return renderRecipeHeroCentered(identity, indent, brandName, industry);

    case "logo-cloud":
      return renderRecipeLogoCloud(identity, indent, industry);

    case "features":
      return renderRecipeFeatures(identity, indent, industry, config);

    case "stats":
      return renderRecipeStats(identity, indent, industry);

    case "testimonial":
      return renderRecipeTestimonial(identity, indent, industry);

    case "cta":
      return renderRecipeCTA(identity, indent, brandName, industry);

    case "newsletter":
      return renderRecipeNewsletter(identity, indent, industry);

    case "footer":
      return renderRecipeFooter(identity, indent, brandName, industry);

    case "trust-badges":
      return renderRecipeTrustBadges(identity, indent, industry);

    case "pricing-cards":
      return renderRecipePricingCards(identity, indent, brandName);

    case "faq":
      return renderRecipeFAQ(identity, indent, brandName);

    case "auth-card":
      return renderRecipeAuthCard(identity, indent, brandName, config);

    case "features-comparison":
      return renderRecipeFeaturesComparison(identity, indent);

    default:
      // Unknown recipe type — render a generic content block
      return renderRecipeFeatures(identity, indent, industry, config);
  }
}

// ═══════════════════════════════════════════════════════════
// RENDER WIREFRAME SECTION (delegates to existing code)
// ═══════════════════════════════════════════════════════════

function renderWireframeSection(
  detected: DetectedSection,
  identity: DesignIdentity,
  indent: number
): string {
  const contentMap = inferSectionContent(
    detected.slots,
    detected.type,
    identity
  );
  return renderSection(detected, identity, contentMap, indent);
}

// ═══════════════════════════════════════════════════════════
// MAIN: GENERATE MERGED CODE
// ═══════════════════════════════════════════════════════════

export function generateMergedCode(
  mergedSections: MergedSection[],
  identity: DesignIdentity,
  brief: DesignBrief
): string {
  const baseIndent = 2;
  const lines: string[] = [];

  // ─── Page wrapper ───
  const page = renderPageWrapper(identity, baseIndent);
  lines.push(page.open);

  // ─── Separate nav / content / footer ───
  const navSections = mergedSections.filter((s) => s.type === "nav");
  const footerSections = mergedSections.filter(
    (s) => s.type === "footer" || s.order >= 99
  );
  const contentSections = mergedSections.filter(
    (s) => s.type !== "nav" && s.type !== "footer" && s.order < 99
  );

  // Auth pages are special — full page, no nav/main/footer structure
  const isAuthPage = mergedSections.length === 1 && mergedSections[0].type === "auth-card";
  if (isAuthPage) {
    const section = mergedSections[0];
    if (section.source === "wireframe" && section.detected) {
      lines.push(renderWireframeSection(section.detected, identity, baseIndent + 1));
    } else {
      lines.push(renderSectionFromRecipe(
        section.type, section.recipeConfig, identity, brief, baseIndent + 1
      ));
    }
    lines.push(page.close);

    const jsx = lines.filter(Boolean).join("\n");
    return `export default function GeneratedUI() {\n  return (\n${jsx}\n  );\n}`;
  }

  // ─── Render nav ───
  for (const section of navSections) {
    if (section.source === "wireframe" && section.detected) {
      lines.push(renderWireframeSection(section.detected, identity, baseIndent + 1));
    } else {
      lines.push(renderSectionFromRecipe(
        section.type, section.recipeConfig, identity, brief, baseIndent + 1
      ));
    }
    lines.push("");
  }

  // ─── Render main content ───
  if (contentSections.length > 0) {
    lines.push(`${pad(baseIndent + 1)}<main className="${identity.page.mainContent}">`);

    for (let i = 0; i < contentSections.length; i++) {
      const section = contentSections[i];
      const bg = getRecipeSectionBackground(
        identity, section.bg, section.type as string, i
      );

      // Map recipe section types to wrapper-compatible types
      const wrapperType = mapToWrapperType(section.type);
      const wrapper = renderSectionWrapper(
        identity, baseIndent + 2, wrapperType, bg
      );

      // Stagger animation
      const staggerStyle = ` style={{ animationDelay: "${(i + 1) * 100}ms" }}`;
      const wrapperWithStagger = wrapper.open
        ? wrapper.open.replace(/^(\s*<section\s)/, `$1${staggerStyle} `)
        : "";

      if (wrapperWithStagger) {
        lines.push(wrapperWithStagger);
      }

      // Render content
      const contentIndent = wrapper.open ? baseIndent + 4 : baseIndent + 2;

      if (section.source === "wireframe" && section.detected) {
        lines.push(renderWireframeSection(section.detected, identity, contentIndent));
      } else {
        lines.push(renderSectionFromRecipe(
          section.type, section.recipeConfig, identity, brief, contentIndent
        ));
      }

      if (wrapper.close) {
        lines.push(wrapper.close);
      }
      lines.push("");
    }

    lines.push(`${pad(baseIndent + 1)}</main>`);
  }

  // ─── Render footer ───
  for (const section of footerSections) {
    const bg = getRecipeSectionBackground(identity, section.bg, "footer", 0);
    const wrapper = renderSectionWrapper(
      identity, baseIndent + 1, "footer", bg
    );

    if (wrapper.open) lines.push(wrapper.open);

    const footerIndent = wrapper.open ? baseIndent + 3 : baseIndent + 1;
    if (section.source === "wireframe" && section.detected) {
      lines.push(renderWireframeSection(section.detected, identity, footerIndent));
    } else {
      lines.push(renderSectionFromRecipe(
        section.type, section.recipeConfig, identity, brief, footerIndent
      ));
    }

    if (wrapper.close) lines.push(wrapper.close);
  }

  // ─── Close page wrapper ───
  lines.push(page.close);

  const jsx = lines.filter(Boolean).join("\n");
  const code = `export default function GeneratedUI() {\n  return (\n${jsx}\n  );\n}`;

  // ─── Quality metrics ───
  const pseudoSections: DetectedSection[] = mergedSections
    .filter((s) => s.detected)
    .map((s) => s.detected!);

  const metrics = measureQuality(code, pseudoSections);
  console.log("[D2D v5 Quality]", {
    ...metrics,
    recipeSections: mergedSections.filter((s) => s.source === "recipe").length,
    wireframeSections: mergedSections.filter((s) => s.source === "wireframe").length,
    totalSections: mergedSections.length,
  });

  return code;
}

/**
 * Map recipe section types to existing SectionType for wrapper compatibility.
 * Unknown types fall back to "generic" which uses identity.sections.generic.
 */
function mapToWrapperType(type: RecipeSectionType): SectionType {
  const map: Record<string, SectionType> = {
    "hero-centered": "hero-centered",
    "hero-split": "hero-split",
    features: "features",
    stats: "stats",
    cta: "cta",
    form: "form",
    "content-split": "content-split",
    "card-grid": "card-grid",
    footer: "footer",
    nav: "nav",
    generic: "generic",
    // Recipe-only types → closest wrapper type
    "logo-cloud": "generic",
    testimonial: "generic",
    newsletter: "generic",
    "trust-badges": "generic",
    "pricing-cards": "generic",
    faq: "generic",
    "auth-card": "generic",
    "features-comparison": "generic",
    "blog-hero": "hero-centered",
    "blog-grid": "card-grid",
    "portfolio-grid": "card-grid",
    "dashboard-header": "nav",
    "dashboard-metrics": "stats",
    "dashboard-chart": "generic",
    "dashboard-table": "generic",
    "product-grid": "card-grid",
    skills: "features",
    "reservation-form": "form",
    "code-preview": "generic",
  };
  return map[type] || "generic";
}