// src/lib/design-engine-pipeline/types.ts

import type { Shape } from "@/redux/slice/shapes";

/* ══════════════════════════════════════════════════════════
   UI ROLES — What a shape means semantically
   ══════════════════════════════════════════════════════════ */
export type UIRole =
  | "container"
  | "card"
  | "button"
  | "input"
  | "checkbox"
  | "heading"
  | "paragraph"
  | "image"
  | "video"
  | "chart"
  | "divider"
  | "nav"
  | "avatar"
  | "icon"
  | "device-wrapper"
  | "decorative"
  | "annotation";

/* ══════════════════════════════════════════════════════════
   EXTRACTED SHAPE — After Phase 1 (Extractor)
   ══════════════════════════════════════════════════════════ */
export interface ExtractedShape {
  originalShape: Shape;
  relX: number;
  relY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

/* ══════════════════════════════════════════════════════════
   CLASSIFIED COMPONENT — After Phase 2 (Classifier)
   ══════════════════════════════════════════════════════════ */
export interface ClassifiedComponent {
  id: string;
  role: UIRole;
  relX: number;
  relY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  text?: string;
  properties: Record<string, unknown>;
  originalShape: Shape;
}

/* ══════════════════════════════════════════════════════════
   UI NODE — After Phase 3 (Architect) - Tree structure
   ══════════════════════════════════════════════════════════ */
export interface UINode {
  id: string;
  role: UIRole;
  relX: number;
  relY: number;
  width: number;
  height: number;
  text?: string;
  properties: Record<string, unknown>;
  children: UINode[];
  layout: "row" | "column";
  gaps: number[];
  enhancementHints: string[];
  tailwindClasses?: string;
}

/* ══════════════════════════════════════════════════════════
   COLOR PALETTE — Generated from a single hex color
   ══════════════════════════════════════════════════════════ */
export interface ColorPalette {
  base: string;        // Original hex
  hover: string;       // 10% darker
  light: string;       // Very light tint (for backgrounds)
  lighter: string;     // Barely tinted (for subtle surfaces)
  dark: string;        // 20% darker
  glow: string;        // rgba for colored shadows
  ring: string;        // rgba for focus rings
  contrast: string;    // White or black for text on this color
}

/* ══════════════════════════════════════════════════════════
   DESIGN PRESET NAMES
   ══════════════════════════════════════════════════════════ */
export type PresetName =
  | "startup-modern"
  | "corporate-clean"
  | "bold-creative"
  | "minimal-elegant"
  | "dashboard-dense"
  | "glass-gradient";

/* ══════════════════════════════════════════════════════════
   ICON NAMES — Available inline SVG icons
   ══════════════════════════════════════════════════════════ */
export type IconName =
  // Tier 1: Essential
  | "arrow-right"
  | "arrow-left"
  | "menu"
  | "x"
  | "check"
  | "chevron-down"
  | "search"
  | "user"
  | "mail"
  | "lock"
  | "eye"
  | "plus"
  | "image"
  | "play"
  // Tier 2: Common
  | "phone"
  | "map-pin"
  | "calendar"
  | "clock"
  | "star"
  | "heart"
  | "share"
  | "download"
  | "upload"
  | "settings"
  | "bell"
  | "home"
  | "chart-bar"
  | "credit-card"
  | "shield-check"
  // Tier 3: Specific
  | "github"
  | "twitter"
  | "linkedin"
  | "sparkles"
  | "zap"
  | "globe"
  | "code"
  | "palette"
  | "rocket"
  | "external-link";

/* ══════════════════════════════════════════════════════════
   SECTION TYPES — Detected page sections
   ══════════════════════════════════════════════════════════ */
export type SectionType =
  | "nav"
  | "hero-centered"
  | "hero-split"
  | "features"
  | "form"
  | "content-split"
  | "card-grid"
  | "cta"
  | "footer"
  | "sidebar"
  | "stats"
  | "generic";

/* ══════════════════════════════════════════════════════════
   SECTION DETECTION RESULT
   ══════════════════════════════════════════════════════════ */
export interface DetectedSection {
  type: SectionType;
  confidence: number;      // 0-1, how sure we are
  nodeIds: string[];       // Which UINode IDs belong to this section
  slots: SlotAssignment[];
  position: "top" | "middle" | "bottom";
  orderIndex: number;      // For rendering order
}

/* ══════════════════════════════════════════════════════════
   SLOT ASSIGNMENT — Maps elements to section template slots
   ══════════════════════════════════════════════════════════ */
export interface SlotAssignment {
  slotName: string;        // "logo", "heading", "cta-primary", etc.
  nodeId: string;          // Which UINode fills this slot
  node: UINode;            // The actual node
}

/* ══════════════════════════════════════════════════════════
   INFERRED CONTENT — Smart placeholder content
   ══════════════════════════════════════════════════════════ */
export interface InferredContent {
  text?: string;           // Override text
  label?: string;          // For inputs
  placeholder?: string;    // For inputs
  inputType?: string;      // "email", "password", "tel", etc.
  icon?: IconName;         // Icon to add
  iconPosition?: "left" | "right";
  variant?: string;        // Component variant override
}

/* ══════════════════════════════════════════════════════════
   CONTENT PRESET — Themed placeholder text per preset
   ══════════════════════════════════════════════════════════ */
export interface ContentPreset {
  heroHeadings: string[];
  heroSubtexts: string[];
  ctaPrimary: string[];
  ctaSecondary: string[];
  navBrand: string;
  navLinks: string[];
  footerCopy: string;
  footerLinks: string[];
  featureTitles: string[];
  featureTexts: string[];
  formHeadings: string[];
  formSubtexts: string[];
}

/* ══════════════════════════════════════════════════════════
   DESIGN IDENTITY — Complete design system per project
   
   This is THE HEART of the new pipeline.
   Contains every visual decision needed to generate
   production-quality UI.
   ══════════════════════════════════════════════════════════ */
export interface DesignIdentity {
  // ─── META ───
  name: PresetName;
  label: string;
  description: string;

  // ─── COLOR SYSTEM ───
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    accent: ColorPalette;

    // Surfaces
    pageBg: string;
    cardBg: string;
    cardBgHover: string;
    elevatedBg: string;
    inverseBg: string;
    accentBg: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textInverse: string;
    textLink: string;
    textLinkHover: string;

    // Borders
    borderLight: string;
    borderDefault: string;
    borderStrong: string;
    borderAccent: string;
  };

  // ─── TYPOGRAPHY SYSTEM ───
  typography: {
    headingFont: string;       // Tailwind font class
    bodyFont: string;
    monoFont: string;

    // Complete responsive type scale
    display: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    bodyLg: string;
    body: string;
    bodySm: string;
    caption: string;
    overline: string;

    // Readability
    headingMaxW: string;
    bodyMaxW: string;
  };

  // ─── SPACING SYSTEM ───
  spacing: {
    sectionSm: string;
    sectionMd: string;
    sectionLg: string;

    container: string;
    containerSm: string;
    containerLg: string;

    elementGap: string;
    groupGap: string;
    sectionGap: string;

    stackSm: string;
    stackMd: string;
    stackLg: string;
  };

  // ─── ELEVATION SYSTEM ───
  elevation: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    glow: string;    // Uses primary color
    inner: string;
  };

  // ─── BORDER SYSTEM ───
  borders: {
    radius: {
      sm: string;
      md: string;
      lg: string;
      full: string;
      button: string;
      input: string;
      card: string;
      badge: string;
      avatar: string;
      section: string;
    };
    widthThin: string;
    widthMedium: string;
  };

  // ─── ANIMATION SYSTEM ───
  animation: {
    transition: string;
    transitionSlow: string;
    hoverLift: string;
    hoverScale: string;
    activePress: string;
    focusRing: string;
  };

  // ─── BACKGROUNDS ───
  backgrounds: {
    page: string;
    subtle: string;
    accent: string;
    inverse: string;
    pattern: string;
    mesh: string;
    hero: string;
    cta: string;
  };

  // ─── COMPONENT CLASS PRESETS ───
  components: {
    button: {
      primary: string;
      secondary: string;
      ghost: string;
      link: string;
      danger: string;
      sizes: { sm: string; md: string; lg: string };
    };
    input: {
      default: string;
      error: string;
      search: string;
      sizes: { sm: string; md: string; lg: string };
    };
    card: {
      elevated: string;
      bordered: string;
      ghost: string;
      interactive: string;
    };
    badge: {
      default: string;
      primary: string;
      success: string;
      warning: string;
    };
    nav: {
      wrapper: string;
      container: string;
      logo: string;
      logoIcon: string;
      link: string;
      linkActive: string;
      mobileToggle: string;
    };
    avatar: {
      sm: string;
      md: string;
      lg: string;
    };
    divider: string;
    checkbox: string;
    image: {
      default: string;
      hero: string;
      card: string;
    };
    video: string;
    chart: string;
  };

  // ─── SECTION WRAPPER PRESETS ───
  sections: {
    nav: string;
    hero: string;
    features: string;
    form: string;
    content: string;
    cardGrid: string;
    cta: string;
    footer: string;
    generic: string;
  };

  // ─── PAGE WRAPPER ───
  page: {
    wrapper: string;
    innerWrapper: string;
    mainContent: string;
    fontImports: string[];
  };

  // ─── THEMED CONTENT ───
  content: ContentPreset;
}

/* ══════════════════════════════════════════════════════════
   QUALITY METRICS — For measuring output quality
   ══════════════════════════════════════════════════════════ */
export interface QualityMetrics {
  totalClasses: number;
  responsivePrefixes: number;
  hoverStates: number;
  focusStates: number;
  sectionsDetected: number;
  outputLines: number;
  backgroundVariations: number;
  typographyLevels: number;
}

/* ══════════════════════════════════════════════════════════
   LEGACY — Keep DesignTokens for backward compatibility
   (will be replaced by DesignIdentity in Phase 8)
   ══════════════════════════════════════════════════════════ */
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    textHeading: string;
    textBody: string;
    textMuted: string;
    border: string;
  };
  font: {
    heading: string;
    body: string;
  };
  variation: {
    borderRadius: "sm" | "md" | "lg" | "xl";
    shadow: "none" | "sm" | "md" | "lg";
    spacing: "compact" | "comfortable" | "spacious";
  };
}
// ═══════════════════════════════════════════════════════════
// SPATIAL GRAPH TYPES (v4.0 — Grid Detection + Blank Space)
// ═══════════════════════════════════════════════════════════

/** The 6 axes on which two rectangles can align */
export type AlignmentType =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "center-x"
  | "center-y";

/** A single measured spatial relationship between two elements */
export interface SpatialRelation {
  type:
    | AlignmentType
    | "h-gap"
    | "v-gap"
    | "same-width"
    | "same-height";
  /** Continuous strength 0–1 (1 = perfect alignment) */
  strength: number;
  /** The raw pixel measurement that produced this strength */
  rawValue: number;
}

/** A node in the spatial constraint graph */
export interface SpatialNode {
  id: string;
  role: UIRole;
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  component: ClassifiedComponent;
}

/** An edge connecting two nodes with measured relationships */
export interface SpatialEdge {
  sourceId: string;
  targetId: string;
  relations: SpatialRelation[];
}

/** A group of elements sharing alignment on one axis */
export interface AlignmentClique {
  type: AlignmentType;
  memberIds: string[];
  avgStrength: number;
  referenceValue: number;
}

/** The complete spatial constraint graph */
export interface SpatialConstraintGraph {
  nodes: SpatialNode[];
  edges: SpatialEdge[];
  topAlignedCliques: AlignmentClique[];
  leftAlignedCliques: AlignmentClique[];
}

/** A detected CSS Grid layout */
export interface DetectedGrid {
  rows: number;
  cols: number;
  rowGap: number;
  colGap: number;
  /** Element IDs in row-major order: assignment[row][col] = elementId */
  assignment: string[][];
  memberIds: string[];
  confidence: number;
}



// ═══════════════════════════════════════════════════════════
// v5.0 — RECIPE SYSTEM TYPES
// ═══════════════════════════════════════════════════════════

/** Extended section types that only exist in recipe mode */
export type RecipeSectionType =
  | SectionType
  | "logo-cloud"
  | "testimonial"
  | "newsletter"
  | "trust-badges"
  | "pricing-cards"
  | "faq"
  | "auth-card"
  | "blog-hero"
  | "blog-grid"
  | "portfolio-grid"
  | "dashboard-header"
  | "dashboard-metrics"
  | "dashboard-chart"
  | "dashboard-table"
  | "product-grid"
  | "skills"
  | "features-comparison"
  | "reservation-form"
  | "code-preview";

/** A section in a page recipe */
export interface SectionRecipe {
  /** Section type identifier */
  type: RecipeSectionType;
  /** Display order (lower = higher on page). Nav=0, Footer=99. */
  order: number;
  /** Can the wireframe override this section? */
  overridable: boolean;
  /** Section-specific configuration */
  config: Record<string, unknown>;
  /** Background intent for visual rhythm */
  bg?: "hero" | "page" | "subtle" | "accent" | "cta" | "inverse";
}

/** A complete page recipe */
export interface PageRecipe {
  pageType: string;
  sections: SectionRecipe[];
}

/** A merged section — either from wireframe detection or recipe default */
export interface MergedSection {
  /** The section type to render */
  type: RecipeSectionType;
  /** Where the data comes from */
  source: "wireframe" | "recipe";
  /** If from wireframe, the detected section data */
  detected?: DetectedSection;
  /** If from recipe, the recipe configuration */
  recipeConfig?: Record<string, unknown>;
  /** Background intent */
  bg?: "hero" | "page" | "subtle" | "accent" | "cta" | "inverse";
  /** Render order */
  order: number;
}

/** Rich content for recipe section rendering (per industry) */
export interface RecipeContent {
  // Stats
  statsItems: Array<{ value: string; label: string }>;

  // Testimonial
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  testimonialCompany: string;

  // Trust / Logo cloud
  trustBadges: string[];
  logoCloudNames: string[];
  logoCloudLabel: string;

  // Newsletter
  newsletterHeading: string;
  newsletterSubtext: string;
  newsletterPlaceholder: string;
  newsletterButton: string;

  // Features section header
  featuresSectionHeading: string;
  featuresSectionSubtext: string;

  // CTA
  ctaHeading: string;
  ctaSubtext: string;

  // Footer
  footerLinkGroups: string[][];
  socialLinks: string[];
}