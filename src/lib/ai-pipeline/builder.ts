// src/lib/ai-pipeline/builder.ts

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
      return ""; // Nav has its own bg
    case "hero-centered":
    case "hero-split":
      return identity.backgrounds.hero;
    case "cta":
      return identity.backgrounds.cta;
    case "footer":
      return identity.backgrounds.subtle;
    case "features":
    case "stats":
      return sectionIndex % 2 === 0 ? "" : identity.backgrounds.subtle;
    case "form":
      return identity.backgrounds.subtle;
    default:
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
function renderGenericSection(
  section: DetectedSection,
  identity: DesignIdentity,
  contentMap: Map<string, InferredContent>,
  indent: number
): string {
  const lines: string[] = [];

  for (const slot of section.slots) {
    const inf = getInferred(contentMap, slot.nodeId);
    lines.push(renderGenericNode(identity, indent, slot.node, inf));
  }

  return lines.join("\n");
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

  // ─── Page wrapper ───
  const page = renderPageWrapper(identity, baseIndent);
  lines.push(page.open);

  // ─── Render each section in order ───
  let contentSectionIndex = 0;

  for (const section of sections) {
    // Infer content for this section
    const contentMap = inferSectionContent(
      section.slots,
      section.type,
      identity
    );

    if (section.type === "nav") {
      // Nav renders its own wrapper
      lines.push(
        renderSection(section, identity, contentMap, baseIndent + 1)
      );
      lines.push("");
    } else if (section.type === "footer") {
      // Footer section
      const bg = getSectionBackground(identity, section.type, contentSectionIndex);
      const wrapper = renderSectionWrapper(identity, baseIndent + 1, "footer", bg);
      lines.push(wrapper.open);
      lines.push(
        renderSection(section, identity, contentMap, baseIndent + 3)
      );
      lines.push(wrapper.close);
    } else {
      // Content sections wrapped in <main>
      const bg = getSectionBackground(identity, section.type, contentSectionIndex);
      const wrapper = renderSectionWrapper(identity, baseIndent + 2, section.type, bg);

      // Add <main> wrapper before first content section
      if (contentSectionIndex === 0) {
        lines.push(
          `${pad(baseIndent + 1)}<main className="${identity.page.mainContent}">`
        );
      }

      lines.push(wrapper.open);
      lines.push(
        renderSection(section, identity, contentMap, baseIndent + 4)
      );
      lines.push(wrapper.close);
      lines.push("");

      contentSectionIndex++;
    }
  }

  // Close <main> if we opened it
  if (contentSectionIndex > 0) {
    lines.push(`${pad(baseIndent + 1)}</main>`);
  }

  // ─── Close page wrapper ───
  lines.push(page.close);

  // ─── Assemble final component ───
  const jsx = lines.filter((l) => l !== undefined).join("\n");

  const code = `export default function GeneratedUI() {
  return (
${jsx}
  );
}`;

  // ─── Log quality metrics ───
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