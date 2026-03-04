// src/lib/design-engine-pipeline/component-library.ts

/* ══════════════════════════════════════════════════════════════════════════════
   COMPONENT LIBRARY
   
   v0-level HTML + Tailwind templates for every UI component.
   
   Each render function takes:
   - identity: DesignIdentity (the design system)
   - props: component-specific data (text, variant, icon, etc.)
   - indent: current indentation level
   
   Each function returns: a complete JSX string with 20-40 Tailwind classes,
   proper HTML structure, inline SVG icons, hover/focus/active states,
   responsive classes, and transitions.
   
   THIS is what transforms "tutorial exercise" output into "v0-level" output.
   The difference is purely CSS class volume + HTML richness.
   
   Zero AI. Zero dependencies beyond types and icon-registry.
   ══════════════════════════════════════════════════════════════════════════════ */
import { renderIcon, getFeatureIcons } from "./icon-registry";
import type { RecipeContent } from "./types";
import { getRecipeContent } from "./industry-content";
import type {
  DesignIdentity,
  UINode,
  InferredContent,
  IconName,
  SectionType,
} from "./types";


/* ══════════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════════ */

function pad(indent: number): string {
  return "  ".repeat(indent);
}

function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/"/g, "&quot;");
}

/**
 * Merge multiple class strings, filtering out empty ones.
 */
function cx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/**
 * Get the first letter of a brand name for logo icons.
 */
function brandInitial(brand: string): string {
  return (brand || "D").charAt(0).toUpperCase();
}


/* ══════════════════════════════════════════════════════════
   BUTTON COMPONENT
   
   Produces 25-30 classes with:
   - Gradient background (primary)
   - Colored shadow
   - Hover lift + shadow increase
   - Active press
   - Focus ring with primary color
   - Transition animation
   - Optional icon (left or right)
   - Size variants
   ══════════════════════════════════════════════════════════ */
export function renderButton(
  identity: DesignIdentity,
  indent: number,
  text: string,
  variant: string = "primary",
  icon?: IconName,
  iconPosition: "left" | "right" = "right",
  size: "sm" | "md" | "lg" = "md",
  fullWidth: boolean = false
): string {
  const p = pad(indent);
  const buttonText = esc(text);

  // Get variant classes from identity
  const variantMap: Record<string, string> = {
    primary: identity.components.button.primary,
    secondary: identity.components.button.secondary,
    ghost: identity.components.button.ghost,
    link: identity.components.button.link,
    danger: identity.components.button.danger,
  };

  const baseClasses = variantMap[variant] || variantMap.primary;
  const sizeClasses = identity.components.button.sizes[size] || "";
  const widthClass = fullWidth ? "w-full" : "";
  const fontClass = identity.typography.bodyFont;

  const allClasses = cx(baseClasses, sizeClasses, widthClass, fontClass);

  // Build icon elements
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const leftIcon = icon && iconPosition === "left" ? renderIcon(icon, iconSize) : "";
  const rightIcon = icon && iconPosition === "right" ? renderIcon(icon, iconSize) : "";

  if (leftIcon || rightIcon) {
    return [
      `${p}<button className="${allClasses}">`,
      leftIcon ? `${p}  ${leftIcon}` : null,
      `${p}  <span>${buttonText}</span>`,
      rightIcon ? `${p}  ${rightIcon}` : null,
      `${p}</button>`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  return `${p}<button className="${allClasses}">${buttonText}</button>`;
}


/* ══════════════════════════════════════════════════════════
   INPUT COMPONENT
   
   Produces 30+ classes with:
   - Label above input
   - Icon prepend (inside input, left side)
   - Focus ring with primary color
   - Hover border change
   - Placeholder styling
   - Transition animation
   - Optional helper text below
   ══════════════════════════════════════════════════════════ */
export function renderInput(
  identity: DesignIdentity,
  indent: number,
  label?: string,
  placeholder?: string,
  inputType?: string,
  icon?: IconName,
  _size: "sm" | "md" | "lg" = "md"
): string {
  const p = pad(indent);
  const ph = esc(placeholder || "Enter text...");
  const type = inputType || "text";
  const inputClasses = identity.components.input.default;
  const fontClass = identity.typography.bodyFont;

  // With icon — need relative positioning
  if (icon) {
    const iconClasses = cx(
      "absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none",
      identity.colors.textTertiary
    );

    const inputWithPadding = inputClasses.replace("px-4", "pl-10 pr-4");

    const lines: string[] = [];
    lines.push(`${p}<div className="space-y-2">`);

    if (label && !isBlankLabel(label)) {
      lines.push(
        `${p}  <label className="${cx("text-sm font-medium", identity.colors.textPrimary, fontClass)}">${esc(label)}</label>`
      );
    }

    lines.push(`${p}  <div className="relative">`);
    lines.push(
      `${p}    <div className="${iconClasses}">`
    );
    lines.push(`${p}      ${renderIcon(icon, "w-4 h-4")}`);
    lines.push(`${p}    </div>`);
    lines.push(
      `${p}    <input type="${type}" className="${cx(inputWithPadding, fontClass)}" placeholder="${ph}" />`
    );
    lines.push(`${p}  </div>`);
    lines.push(`${p}</div>`);

    return lines.join("\n");
  }

  // Without icon
  const lines: string[] = [];
  lines.push(`${p}<div className="space-y-2">`);

  if (label && !isBlankLabel(label)) {
    lines.push(
      `${p}  <label className="${cx("text-sm font-medium", identity.colors.textPrimary, fontClass)}">${esc(label)}</label>`
    );
  }

  lines.push(
    `${p}  <input type="${type}" className="${cx(inputClasses, fontClass)}" placeholder="${ph}" />`
  );
  lines.push(`${p}</div>`);

  return lines.join("\n");
}

function isBlankLabel(label: string): boolean {
  const l = label.trim().toLowerCase();
  return l === "" || l === "label" || l === "enter text...";
}


/* ══════════════════════════════════════════════════════════
   CARD COMPONENT
   
   Produces 20+ classes with:
   - Rounded corners
   - Shadow + hover shadow increase
   - Hover lift animation
   - Gradient overlay on hover
   - Proper padding
   - Overflow hidden for child images
   ══════════════════════════════════════════════════════════ */
export function renderCard(
  identity: DesignIdentity,
  indent: number,
  children: string,
  variant: string = "elevated"
): string {
  const p = pad(indent);

  const variantMap: Record<string, string> = {
    elevated: identity.components.card.elevated,
    bordered: identity.components.card.bordered,
    ghost: identity.components.card.ghost,
    interactive: identity.components.card.interactive,
  };

  const classes = variantMap[variant] || variantMap.elevated;

  return [
    `${p}<div className="${classes}">`,
    `${p}  <div className="p-6 sm:p-8 ${identity.spacing.stackMd}">`,
    children,
    `${p}  </div>`,
    `${p}</div>`,
  ].join("\n");
}


/* ══════════════════════════════════════════════════════════
   NAV COMPONENT
   
   Produces 40+ classes with:
   - Sticky positioning
   - Backdrop blur (glass effect)
   - Max-width container
   - Logo with brand icon (gradient square with initial)
   - Navigation links
   - CTA buttons on right
   - Mobile hamburger menu
   - Responsive hide/show
   ══════════════════════════════════════════════════════════ */
export function renderNav(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  ctaButtons: string[] = [],
  navLinks: string[] = []
): string {
  const p = pad(indent);
  const initial = brandInitial(brandName);

  const lines: string[] = [];

  // Nav wrapper
  lines.push(`${p}<nav className="${identity.components.nav.wrapper}">`);
  lines.push(`${p}  <div className="${identity.components.nav.container}">`);
  lines.push(
    `${p}    <div className="flex items-center justify-between h-16">`
  );

  // Logo
  lines.push(`${p}      <a href="#" className="${identity.components.nav.logo}">`);
  lines.push(
    `${p}        <div className="${identity.components.nav.logoIcon}">`
  );
  lines.push(
    `${p}          <span className="text-white font-bold text-sm">${initial}</span>`
  );
  lines.push(`${p}        </div>`);
  lines.push(
    `${p}        <span className="${cx("font-semibold text-sm tracking-tight", identity.colors.textPrimary)}">${esc(brandName)}</span>`
  );
  lines.push(`${p}      </a>`);

  // Center: Nav Links (hidden on mobile)
  if (navLinks.length > 0) {
    lines.push(
      `${p}      <div className="hidden lg:flex items-center ${identity.spacing.elementGap}">`
    );
    for (const link of navLinks) {
      lines.push(
        `${p}        <a href="#" className="${identity.components.nav.link}">${esc(link)}</a>`
      );
    }
    lines.push(`${p}      </div>`);
  }

  // Right: CTA Buttons + Mobile Toggle
  lines.push(
    `${p}      <div className="flex items-center gap-2">`
  );

  // CTA buttons (rendered by caller, passed as strings)
  for (const btn of ctaButtons) {
    lines.push(btn);
  }

  // Mobile hamburger
  lines.push(
    `${p}        <button className="${identity.components.nav.mobileToggle}">`
  );
  lines.push(`${p}          ${renderIcon("menu", "w-5 h-5")}`);
  lines.push(`${p}        </button>`);

  lines.push(`${p}      </div>`);

  // Close wrappers
  lines.push(`${p}    </div>`);
  lines.push(`${p}  </div>`);
  lines.push(`${p}</nav>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   HEADING COMPONENT
   
   Uses identity typography scale with responsive sizing.
   Adds heading font family and proper color.
   ══════════════════════════════════════════════════════════ */
export function renderHeading(
  identity: DesignIdentity,
  indent: number,
  text: string,
  level: number = 2,
  centered: boolean = false,
  maxWidth: boolean = false
): string {
  const p = pad(indent);
  const tag = `h${Math.min(Math.max(level, 1), 6)}`;

  const scaleMap: Record<number, string> = {
    1: identity.typography.display,
    2: identity.typography.h1,
    3: identity.typography.h2,
    4: identity.typography.h3,
    5: identity.typography.h4,
    6: identity.typography.h4,
  };

  const typeClasses = scaleMap[level] || scaleMap[2];
  const colorClass = identity.colors.textPrimary;
  const fontClass = identity.typography.headingFont;
  const centerClass = centered ? "text-center" : "";
  const maxWClass = maxWidth ? identity.typography.headingMaxW : "";

  const allClasses = cx(typeClasses, colorClass, fontClass, centerClass, maxWClass);

  return `${p}<${tag} className="${allClasses}">${esc(text)}</${tag}>`;
}


/* ══════════════════════════════════════════════════════════
   PARAGRAPH COMPONENT
   
   Uses identity typography with proper line height,
   secondary text color, and max-width for readability.
   ══════════════════════════════════════════════════════════ */
export function renderParagraph(
  identity: DesignIdentity,
  indent: number,
  text: string,
  variant: "body" | "bodyLg" | "bodySm" | "caption" | "overline" = "body",
  centered: boolean = false,
  maxWidth: boolean = false
): string {
  const p = pad(indent);

  const variantMap: Record<string, string> = {
    body: identity.typography.body,
    bodyLg: identity.typography.bodyLg,
    bodySm: identity.typography.bodySm,
    caption: identity.typography.caption,
    overline: identity.typography.overline,
  };

  const typeClasses = variantMap[variant] || variantMap.body;
  const colorClass =
    variant === "caption" || variant === "overline"
      ? identity.colors.textTertiary
      : identity.colors.textSecondary;
  const fontClass = identity.typography.bodyFont;
  const centerClass = centered ? "text-center" : "";
  const maxWClass = maxWidth ? identity.typography.bodyMaxW : "";

  const allClasses = cx(typeClasses, colorClass, fontClass, centerClass, maxWClass);

  if (variant === "overline") {
    return `${p}<span className="${allClasses}">${esc(text)}</span>`;
  }

  return `${p}<p className="${allClasses}">${esc(text)}</p>`;
}


/* ══════════════════════════════════════════════════════════
   IMAGE PLACEHOLDER COMPONENT
   
   Produces 25+ classes with:
   - Gradient background
   - Aspect ratio
   - Centered icon + text
   - Rounded corners
   - Decorative dot pattern overlay
   - Border
   ══════════════════════════════════════════════════════════ */
export function renderImage(
  identity: DesignIdentity,
  indent: number,
  variant: "default" | "hero" | "card" = "default",
  _width?: number,
  _height?: number
): string {
  const p = pad(indent);

  const variantMap: Record<string, string> = {
    default: identity.components.image.default,
    hero: identity.components.image.hero,
    card: identity.components.image.card,
  };

  const classes = variantMap[variant] || variantMap.default;
  // Always use responsive aspect ratio — never pixel dimensions
  const aspectClass = variant === "default" ? "aspect-video" : "";

  return [
    `${p}<div className="${cx(classes, aspectClass)}">`,
    `${p}  <div className="text-center space-y-3">`,
    `${p}    <div className="${cx("w-12 h-12 mx-auto rounded-xl flex items-center justify-center", identity.colors.textTertiary)}">`,
    `${p}      ${renderIcon("image", "w-6 h-6")}`,
    `${p}    </div>`,
    `${p}    <p className="${cx("text-sm", identity.colors.textTertiary)}">Image placeholder</p>`,
    `${p}  </div>`,
    `${p}</div>`,
  ].join("\n");
}


/* ══════════════════════════════════════════════════════════
   VIDEO PLACEHOLDER COMPONENT
   ══════════════════════════════════════════════════════════ */
export function renderVideo(
  identity: DesignIdentity,
  indent: number,
  _width?: number,
  _height?: number
): string {
  const p = pad(indent);
  const classes = identity.components.video;
  // identity.components.video already includes aspect-video

  return [
    `${p}<div className="${classes}">`,
    `${p}  <div className="text-center space-y-3">`,
    `${p}    <div className="w-16 h-16 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">`,
    `${p}      ${renderIcon("play", "w-6 h-6 text-white ml-1")}`,
    `${p}    </div>`,
    `${p}    <p className="${cx("text-sm", identity.colors.textTertiary)}">Video placeholder</p>`,
    `${p}  </div>`,
    `${p}</div>`,
  ].join("\n");
}


/* ══════════════════════════════════════════════════════════
   CHART PLACEHOLDER COMPONENT
   ══════════════════════════════════════════════════════════ */
export function renderChart(
  identity: DesignIdentity,
  indent: number,
  chartType: string = "bar",
  _width?: number,
  _height?: number
): string {
  const p = pad(indent);
  const classes = identity.components.chart;
  const label = chartType.charAt(0).toUpperCase() + chartType.slice(1);

  return [
    `${p}<div className="${classes}">`,
    `${p}  <div className="flex items-center justify-between mb-4">`,
    `${p}    <span className="${cx("text-sm font-medium", identity.colors.textPrimary)}">${label} Chart</span>`,
    `${p}    ${renderIcon("chart-bar", cx("w-4 h-4", identity.colors.textTertiary))}`,
    `${p}  </div>`,
    `${p}  <div className="flex items-end justify-around h-32 gap-2">`,
    `${p}    <div className="${cx("w-8 rounded-t", identity.backgrounds.accent)}" style={{ height: "60%" }} />`,
    `${p}    <div className="${cx("w-8 rounded-t", identity.backgrounds.accent)}" style={{ height: "85%" }} />`,
    `${p}    <div className="${cx("w-8 rounded-t", identity.backgrounds.accent)}" style={{ height: "45%" }} />`,
    `${p}    <div className="${cx("w-8 rounded-t", identity.backgrounds.accent)}" style={{ height: "70%" }} />`,
    `${p}    <div className="${cx("w-8 rounded-t", identity.backgrounds.accent)}" style={{ height: "90%" }} />`,
    `${p}  </div>`,
    `${p}</div>`,
  ].join("\n");
}


/* ══════════════════════════════════════════════════════════
   DIVIDER COMPONENT
   ══════════════════════════════════════════════════════════ */
export function renderDivider(
  identity: DesignIdentity,
  indent: number
): string {
  const p = pad(indent);
  return `${p}<hr className="${identity.components.divider}" />`;
}


/* ══════════════════════════════════════════════════════════
   CHECKBOX COMPONENT
   ══════════════════════════════════════════════════════════ */
export function renderCheckbox(
  identity: DesignIdentity,
  indent: number,
  label: string,
  checked: boolean = false
): string {
  const p = pad(indent);
  const checkClass = identity.components.checkbox;

  return [
    `${p}<label className="${checkClass}">`,
    `${p}  <input type="checkbox"${checked ? " defaultChecked" : ""} className="${cx(
      "w-4 h-4 rounded border-2",
      identity.colors.borderDefault,
      `accent-[${identity.colors.primary.base}]`
    )}" />`,
    `${p}  <span className="${cx("text-sm", identity.colors.textSecondary)}">${esc(label)}</span>`,
    `${p}</label>`,
  ].join("\n");
}


/* ══════════════════════════════════════════════════════════
   AVATAR COMPONENT
   ══════════════════════════════════════════════════════════ */
export function renderAvatar(
  identity: DesignIdentity,
  indent: number,
  size: "sm" | "md" | "lg" = "md",
  initial: string = "A"
): string {
  const p = pad(indent);
  const sizeMap: Record<string, string> = {
    sm: identity.components.avatar.sm,
    md: identity.components.avatar.md,
    lg: identity.components.avatar.lg,
  };
  const classes = sizeMap[size] || sizeMap.md;

  return `${p}<div className="${classes}"><span>${esc(initial.charAt(0).toUpperCase())}</span></div>`;
}


/* ══════════════════════════════════════════════════════════
   FEATURE CARD COMPONENT
   
   Used inside feature grid sections.
   Renders: icon + heading + text in a card.
   ══════════════════════════════════════════════════════════ */
export function renderFeatureCard(
  identity: DesignIdentity,
  indent: number,
  title: string,
  description: string,
  icon?: IconName
): string {
  const p = pad(indent);

  const cardClasses = identity.components.card.bordered;

  const lines: string[] = [];
  lines.push(`${p}<div className="${cardClasses}">`);
  lines.push(`${p}  <div className="p-6 ${identity.spacing.stackMd}">`);

  // Icon
  if (icon) {
    lines.push(
      `${p}    <div className="${cx(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        identity.backgrounds.accent
      )}">`
    );
    lines.push(
      `${p}      ${renderIcon(icon, cx("w-5 h-5", `text-[${identity.colors.primary.base}]`))}`
    );
    lines.push(`${p}    </div>`);
  }

  // Title
  lines.push(
    `${p}    <h3 className="${cx(identity.typography.h3, identity.colors.textPrimary, identity.typography.headingFont)}">${esc(title)}</h3>`
  );

  // Description
  lines.push(
    `${p}    <p className="${cx(identity.typography.bodySm, identity.colors.textSecondary, identity.typography.bodyFont)}">${esc(description)}</p>`
  );

  lines.push(`${p}  </div>`);
  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   SECTION WRAPPER COMPONENT
   
   Wraps a section with proper padding, container,
   and optional background.
   
   Returns { open, close } strings to wrap around content.
   ══════════════════════════════════════════════════════════ */
export function renderSectionWrapper(
  identity: DesignIdentity,
  indent: number,
  sectionType: SectionType,
  bgOverride?: string,
  spacingFactor: number = 1  // v4.0: scaling for tall frames
): { open: string; close: string } {
  const p = pad(indent);

  const sectionClassMap: Record<string, string> = {
    nav: identity.sections.nav,
    "hero-centered": identity.sections.hero,
    "hero-split": identity.sections.hero,
    features: identity.sections.features,
    form: identity.sections.form,
    "content-split": identity.sections.content,
    "card-grid": identity.sections.cardGrid,
    cta: identity.sections.cta,
    footer: identity.sections.footer,
    stats: identity.sections.features,
    sidebar: identity.sections.generic,
    generic: identity.sections.generic,
  };

  let sectionClasses = sectionClassMap[sectionType] || identity.sections.generic;
  const bg = bgOverride || "";

  // ═══ v4.0: Scale section padding for tall frames ═══
  if (spacingFactor > 1) {
    // Replace py-XX values with scaled versions
    sectionClasses = scalePaddingClasses(sectionClasses, spacingFactor);
  }
  // ═══ v4.0 END ═══

  if (sectionType === "nav") {
    return { open: "", close: "" };
  }

  if (sectionType === "footer") {
    return {
      open: [
        `${p}<footer className="${cx(sectionClasses, bg, identity.backgrounds.inverse === "bg-white" ? identity.backgrounds.subtle : "")}">`,
        `${p}  <div className="${identity.spacing.container}">`,
      ].join("\n"),
      close: [`${p}  </div>`, `${p}</footer>`].join("\n"),
    };
  }

  if (sectionType === "cta") {
    return {
      open: [
        `${p}<section className="${cx(sectionClasses, bg)}">`,
        `${p}  <div className="${identity.spacing.container}">`,
        `${p}    <div className="text-center ${identity.spacing.stackLg}">`,
      ].join("\n"),
      close: [
        `${p}    </div>`,
        `${p}  </div>`,
        `${p}</section>`,
      ].join("\n"),
    };
  }

  if (sectionType === "form") {
    return {
      open: [
        `${p}<section className="${cx(sectionClasses, bg)}">`,
        `${p}  <div className="${identity.spacing.containerSm}">`,
      ].join("\n"),
      close: [`${p}  </div>`, `${p}</section>`].join("\n"),
    };
  }

  return {
    open: [
      `${p}<section className="${cx(sectionClasses, bg)}">`,
      `${p}  <div className="${identity.spacing.container}">`,
    ].join("\n"),
    close: [`${p}  </div>`, `${p}</section>`].join("\n"),
  };
}

/**
 * v4.0: Scale py-XX classes by a factor for tall frames.
 * py-16 with factor 1.5 → py-24
 * py-24 with factor 1.5 → py-36 (capped at py-40)
 */
function scalePaddingClasses(classes: string, factor: number): string {
  return classes.replace(/py-(\d+)/g, (_match, num) => {
    const original = parseInt(num, 10);
    const scaled = Math.min(Math.round(original * factor), 48);
    // Snap to valid Tailwind values
    const valid = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48];
    const snapped = valid.reduce((prev, curr) =>
      Math.abs(curr - scaled) < Math.abs(prev - scaled) ? curr : prev
    );
    return `py-${snapped}`;
  }).replace(/sm:py-(\d+)/g, (_match, num) => {
    const original = parseInt(num, 10);
    const scaled = Math.min(Math.round(original * factor), 56);
    const valid = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56];
    const snapped = valid.reduce((prev, curr) =>
      Math.abs(curr - scaled) < Math.abs(prev - scaled) ? curr : prev
    );
    return `sm:py-${snapped}`;
  });
}


/* ══════════════════════════════════════════════════════════
   PAGE WRAPPER COMPONENT
   
   Wraps the entire page with:
   - min-h-screen
   - Background color
   - Antialiased text
   - Flex column (for sticky footer)
   - Font import comment
   ══════════════════════════════════════════════════════════ */
export function renderPageWrapper(
  identity: DesignIdentity,
  indent: number
): { open: string; close: string } {
  const p = pad(indent);

  const fontComment = identity.page.fontImports.length > 0
    ? `${p}{/* Fonts: ${identity.page.fontImports.map(u => {
      const match = u.match(/family=([^&:]+)/);
      return match ? decodeURIComponent(match[1]).replace(/\+/g, " ") : "";
    }).filter(Boolean).join(", ")} */}\n`
    : "";

  return {
    open: [
      fontComment,
      `${p}<div className="${identity.page.wrapper}">`,
      `${p}  <div className="${identity.page.innerWrapper}">`,
    ].filter(Boolean).join("\n"),
    close: [
      `${p}  </div>`,
      `${p}</div>`,
    ].join("\n"),
  };
}


/* ══════════════════════════════════════════════════════════
   HERO SECTION — CENTERED
   
   Full hero with:
   - Optional overline badge
   - Large heading (display size)
   - Subtitle paragraph
   - CTA button group
   - Responsive spacing
   ══════════════════════════════════════════════════════════ */
export function renderHeroCentered(
  identity: DesignIdentity,
  indent: number,
  heading: string,
  subtext: string,
  primaryCTA?: { text: string; icon?: IconName },
  secondaryCTA?: { text: string; icon?: IconName }
): string {
  const p = pad(indent);
  const lines: string[] = [];

  lines.push(`${p}<div className="text-center ${identity.spacing.stackLg} max-w-3xl mx-auto">`);

  // Heading
  lines.push(
    renderHeading(identity, indent + 1, heading, 1, true, true)
  );

  // Subtext
  if (subtext) {
    lines.push(
      renderParagraph(identity, indent + 1, subtext, "bodyLg", true, true)
    );
  }

  // CTA Group
  if (primaryCTA || secondaryCTA) {
    lines.push(
      `${p}  <div className="flex flex-col sm:flex-row items-center justify-center ${identity.spacing.elementGap} pt-4">`
    );

    if (primaryCTA) {
      lines.push(
        renderButton(
          identity,
          indent + 2,
          primaryCTA.text,
          "primary",
          primaryCTA.icon || "arrow-right",
          "right",
          "lg"
        )
      );
    }

    if (secondaryCTA) {
      lines.push(
        renderButton(
          identity,
          indent + 2,
          secondaryCTA.text,
          "secondary",
          secondaryCTA.icon,
          "right",
          "lg"
        )
      );
    }

    lines.push(`${p}  </div>`);
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   HERO SECTION — SPLIT (text left, media right)
   ══════════════════════════════════════════════════════════ */
export function renderHeroSplit(
  identity: DesignIdentity,
  indent: number,
  heading: string,
  subtext: string,
  mediaContent: string,
  primaryCTA?: { text: string; icon?: IconName },
  secondaryCTA?: { text: string; icon?: IconName }
): string {
  const p = pad(indent);
  const lines: string[] = [];

  lines.push(
    `${p}<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">`
  );

  // Left: Text content
  lines.push(`${p}  <div className="${identity.spacing.stackLg}">`);
  lines.push(renderHeading(identity, indent + 2, heading, 1, false, false));

  if (subtext) {
    lines.push(renderParagraph(identity, indent + 2, subtext, "bodyLg", false, true));
  }

  if (primaryCTA || secondaryCTA) {
    lines.push(
      `${p}    <div className="flex flex-col sm:flex-row ${identity.spacing.elementGap} pt-2">`
    );
    if (primaryCTA) {
      lines.push(
        renderButton(identity, indent + 3, primaryCTA.text, "primary", primaryCTA.icon || "arrow-right", "right", "lg")
      );
    }
    if (secondaryCTA) {
      lines.push(
        renderButton(identity, indent + 3, secondaryCTA.text, "secondary", secondaryCTA.icon, "right", "lg")
      );
    }
    lines.push(`${p}    </div>`);
  }

  lines.push(`${p}  </div>`);

  // Right: Media
  lines.push(`${p}  <div className="relative">`);
  lines.push(mediaContent);
  lines.push(`${p}  </div>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   FORM SECTION
   
   Centered card with heading + inputs + submit button.
   ══════════════════════════════════════════════════════════ */
export function renderFormSection(
  identity: DesignIdentity,
  indent: number,
  heading: string,
  description: string,
  fields: string[],
  submitButton: string,
  extras: string[] = []
): string {
  const p = pad(indent);
  const lines: string[] = [];

  // Form card wrapper
  const cardClasses = cx(
    identity.components.card.elevated,
    "p-6 sm:p-8"
  );

  lines.push(`${p}<div className="${cardClasses}">`);

  // Heading + description
  lines.push(`${p}  <div className="${identity.spacing.stackSm} mb-6">`);
  lines.push(renderHeading(identity, indent + 2, heading, 3, false, false));
  if (description) {
    lines.push(renderParagraph(identity, indent + 2, description, "bodySm", false, false));
  }
  lines.push(`${p}  </div>`);

  // Fields
  lines.push(`${p}  <div className="${identity.spacing.stackMd}">`);
  for (const field of fields) {
    lines.push(field);
  }
  lines.push(`${p}  </div>`);

  // Extras (checkboxes, forgot password, etc.)
  if (extras.length > 0) {
    lines.push(`${p}  <div className="${identity.spacing.stackSm} mt-4">`);
    for (const extra of extras) {
      lines.push(extra);
    }
    lines.push(`${p}  </div>`);
  }

  // Submit button
  lines.push(`${p}  <div className="mt-6">`);
  lines.push(submitButton);
  lines.push(`${p}  </div>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   FEATURE GRID SECTION
   ══════════════════════════════════════════════════════════ */
export function renderFeatureGrid(
  identity: DesignIdentity,
  indent: number,
  sectionHeading: string,
  sectionDescription: string,
  featureCards: string[],
  columns: number = 3
): string {
  const p = pad(indent);
  const lines: string[] = [];

  // Section header
  if (sectionHeading) {
    lines.push(`${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`);
    lines.push(renderHeading(identity, indent + 1, sectionHeading, 2, true, true));
    if (sectionDescription) {
      lines.push(renderParagraph(identity, indent + 1, sectionDescription, "bodyLg", true, true));
    }
    lines.push(`${p}</div>`);
  }

  // Grid
  const colClass =
    columns <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  lines.push(`${p}<div className="grid ${colClass} ${identity.spacing.groupGap}">`);
  for (const card of featureCards) {
    lines.push(card);
  }
  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   FOOTER SECTION
   ══════════════════════════════════════════════════════════ */
export function renderFooter(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  links: string[],
  copyright: string
): string {
  const p = pad(indent);
  const lines: string[] = [];

  lines.push(
    `${p}<div className="flex flex-col sm:flex-row items-center justify-between ${identity.spacing.elementGap}">`
  );

  // Brand + copyright
  lines.push(`${p}  <div className="flex items-center gap-2">`);
  lines.push(
    `${p}    <span className="${cx("text-sm font-medium", identity.colors.textSecondary)}">${esc(brandName)}</span>`
  );
  lines.push(`${p}  </div>`);

  // Links
  if (links.length > 0) {
    lines.push(
      `${p}  <div className="flex items-center ${identity.spacing.elementGap}">`
    );
    for (const link of links) {
      lines.push(
        `${p}    <a href="#" className="${cx("text-sm", identity.colors.textTertiary, "hover:" + identity.colors.textPrimary.replace("text-", "text-"), identity.animation.transition)}">${esc(link)}</a>`
      );
    }
    lines.push(`${p}  </div>`);
  }

  lines.push(`${p}</div>`);

  // Copyright
  lines.push(
    `${p}<div className="mt-8 pt-6 ${identity.components.divider}">`
  );
  lines.push(
    `${p}  <p className="${cx("text-xs text-center", identity.colors.textTertiary)}">${esc(copyright)}</p>`
  );
  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   STATS SECTION
   ══════════════════════════════════════════════════════════ */
export function renderStats(
  identity: DesignIdentity,
  indent: number,
  stats: Array<{ value: string; label: string }>
): string {
  const p = pad(indent);
  const lines: string[] = [];

  const colClass =
    stats.length <= 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-4";

  lines.push(`${p}<div className="grid ${colClass} ${identity.spacing.groupGap}">`);

  for (const stat of stats) {
    lines.push(`${p}  <div className="text-center ${identity.spacing.stackSm}">`);
    lines.push(
      `${p}    <div className="${cx(identity.typography.h1, identity.colors.textPrimary, identity.typography.headingFont)}">${esc(stat.value)}</div>`
    );
    lines.push(
      `${p}    <div className="${cx(identity.typography.bodySm, identity.colors.textTertiary)}">${esc(stat.label)}</div>`
    );
    lines.push(`${p}  </div>`);
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   CTA SECTION
   ══════════════════════════════════════════════════════════ */
export function renderCTA(
  identity: DesignIdentity,
  indent: number,
  heading: string,
  subtext: string,
  primaryCTA?: { text: string; icon?: IconName },
  secondaryCTA?: { text: string; icon?: IconName }
): string {
  const p = pad(indent);
  const lines: string[] = [];

  lines.push(renderHeading(identity, indent, heading, 2, true, true));

  if (subtext) {
    lines.push(renderParagraph(identity, indent, subtext, "bodyLg", true, true));
  }

  if (primaryCTA || secondaryCTA) {
    lines.push(
      `${p}<div className="flex flex-col sm:flex-row items-center justify-center ${identity.spacing.elementGap} pt-4">`
    );
    if (primaryCTA) {
      lines.push(
        renderButton(identity, indent + 1, primaryCTA.text, "primary", primaryCTA.icon || "arrow-right", "right", "lg")
      );
    }
    if (secondaryCTA) {
      lines.push(
        renderButton(identity, indent + 1, secondaryCTA.text, "secondary", secondaryCTA.icon)
      );
    }
    lines.push(`${p}</div>`);
  }

  return lines.join("\n");
}


/* ══════════════════════════════════════════════════════════
   CONTENT SPLIT SECTION
   ══════════════════════════════════════════════════════════ */
export function renderContentSplit(
  identity: DesignIdentity,
  indent: number,
  textContent: string,
  mediaContent: string,
  mediaPosition: "left" | "right" = "right"
): string {
  const p = pad(indent);

  const leftContent = mediaPosition === "left" ? mediaContent : textContent;
  const rightContent = mediaPosition === "left" ? textContent : mediaContent;

  return [
    `${p}<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">`,
    `${p}  <div>`,
    leftContent,
    `${p}  </div>`,
    `${p}  <div>`,
    rightContent,
    `${p}  </div>`,
    `${p}</div>`,
  ].join("\n");
}


/* ══════════════════════════════════════════════════════════
   GENERIC NODE RENDERER
   
   Fallback renderer for any node that doesn't fit
   a specific section template. Still uses identity
   styling for professional output.
   ══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   GENERIC NODE RENDERER — v4.1 FIX
   
   When section detection fails, this is what renders.
   Must produce GOOD output, not raw pixel dumps.
   
   Strategy:
   1. Skip decorative/device-wrapper (they produce noise)
   2. Never render fixed pixel dimensions (use responsive classes)
   3. For containers/cards with children, render children intelligently
   4. For empty containers, render as content placeholders
   5. Apply identity styling to everything
   ══════════════════════════════════════════════════════════ */
export function renderGenericNode(
  identity: DesignIdentity,
  indent: number,
  node: UINode,
  inferred?: InferredContent
): string {
  const p = pad(indent);
  const text = inferred?.text || node.text;
  const icon = inferred?.icon;
  const variant = inferred?.variant;

  switch (node.role) {
    case "button":
      return renderButton(
        identity,
        indent,
        text || "Button",
        variant || (node.properties?.variant as string) || "primary",
        icon,
        inferred?.iconPosition || "right"
      );

    case "input":
      return renderInput(
        identity,
        indent,
        inferred?.label || (node.properties?.label as string),
        inferred?.placeholder || (node.properties?.placeholder as string),
        inferred?.inputType,
        icon
      );

    case "heading": {
      const level = (node.properties?.headingLevel as number) || 2;
      const headingText = text || identity.content.heroHeadings[0];
      return renderHeading(identity, indent, headingText, level);
    }

    case "paragraph": {
      const paraText = text || identity.content.heroSubtexts[0];
      return renderParagraph(identity, indent, paraText);
    }

    case "image":
      // Never use fixed pixel dimensions — use responsive aspect ratio
      return renderImage(identity, indent, "hero");

    case "video":
      // Never use fixed pixel dimensions — use responsive aspect ratio
      return renderVideo(identity, indent);

    case "chart":
      return renderChart(
        identity,
        indent,
        (node.properties?.chartType as string) || "bar"
      );

    case "checkbox":
      return renderCheckbox(
        identity,
        indent,
        text || (node.properties?.label as string) || "Option",
        (node.properties?.checked as boolean) || false
      );

    case "avatar": {
      // Render avatar at standard size, not raw pixels
      return renderAvatar(identity, indent, "md");
    }

    case "divider":
      return renderDivider(identity, indent);

    case "nav":
      return renderNav(identity, indent, identity.content.navBrand);

    case "card":
    case "container": {
      // Filter out decorative noise from children
      const meaningfulChildren = node.children.filter(
        (c) => c.role !== "decorative" && c.role !== "device-wrapper" && c.role !== "avatar"
      );

      if (meaningfulChildren.length === 0) {
        // Empty container — render as a clean content area, not pixel box
        return [
          `${p}<div className="${cx(identity.components.card.bordered, "p-8 rounded-2xl")}">`,
          `${p}  <div className="text-center space-y-4">`,
          `${p}    <div className="w-12 h-12 mx-auto rounded-xl ${identity.backgrounds.accent} flex items-center justify-center">`,
          `${p}      ${renderIcon("image", cx("w-6 h-6", identity.colors.textTertiary))}`,
          `${p}    </div>`,
          `${p}    <p className="${cx("text-sm", identity.colors.textTertiary)}">Content area</p>`,
          `${p}  </div>`,
          `${p}</div>`,
        ].join("\n");
      }

      // Check if this looks like a hero section (heading + text + maybe button)
      const hasHeading = meaningfulChildren.some((c) => c.role === "heading");
      const hasText = meaningfulChildren.some((c) => c.role === "paragraph");
      const hasButton = meaningfulChildren.some((c) => c.role === "button");
      const hasMedia = meaningfulChildren.some((c) => c.role === "image" || c.role === "video");

      // Hero-like pattern: render as a proper hero layout
      if (hasHeading && (hasText || hasButton)) {
        const headingNode = meaningfulChildren.find((c) => c.role === "heading");
        const textNode = meaningfulChildren.find((c) => c.role === "paragraph");
        const buttonNode = meaningfulChildren.find((c) => c.role === "button");
        const mediaNode = meaningfulChildren.find((c) => c.role === "image" || c.role === "video");

        if (hasMedia) {
          // Split layout: text left, media right
          const lines: string[] = [];
          lines.push(`${p}<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">`);
          lines.push(`${p}  <div className="${identity.spacing.stackLg}">`);
          
          if (headingNode) {
            const level = (headingNode.properties?.headingLevel as number) || 1;
            lines.push(renderHeading(identity, indent + 2, headingNode.text || identity.content.heroHeadings[0], level));
          }
          if (textNode) {
            lines.push(renderParagraph(identity, indent + 2, textNode.text || identity.content.heroSubtexts[0], "bodyLg"));
          }
          if (buttonNode) {
            lines.push(renderButton(identity, indent + 2, buttonNode.text || identity.content.ctaPrimary[0], "primary", "arrow-right"));
          }
          
          lines.push(`${p}  </div>`);
          lines.push(`${p}  <div>`);
          lines.push(mediaNode?.role === "video" ? renderVideo(identity, indent + 2) : renderImage(identity, indent + 2, "hero"));
          lines.push(`${p}  </div>`);
          lines.push(`${p}</div>`);
          
          return lines.join("\n");
        } else {
          // Centered layout
          const lines: string[] = [];
          lines.push(`${p}<div className="text-center ${identity.spacing.stackLg} max-w-3xl mx-auto">`);
          
          if (headingNode) {
            const level = (headingNode.properties?.headingLevel as number) || 1;
            lines.push(renderHeading(identity, indent + 1, headingNode.text || identity.content.heroHeadings[0], level, true, true));
          }
          if (textNode) {
            lines.push(renderParagraph(identity, indent + 1, textNode.text || identity.content.heroSubtexts[0], "bodyLg", true, true));
          }
          if (buttonNode) {
            lines.push(`${pad(indent + 1)}<div className="flex justify-center gap-4 pt-4">`);
            lines.push(renderButton(identity, indent + 2, buttonNode.text || identity.content.ctaPrimary[0], "primary", "arrow-right", "right", "lg"));
            lines.push(`${pad(indent + 1)}</div>`);
          }
          
          lines.push(`${p}</div>`);
          return lines.join("\n");
        }
      }

      // Default: render as a flex container with children
      const childLines = meaningfulChildren.map((child) =>
        renderGenericNode(identity, indent + 1, child)
      );
      
      const containerClasses = cx(
        node.role === "card" ? identity.components.card.elevated : "",
        node.role === "card" ? "p-6 sm:p-8" : "",
        "flex",
        node.layout === "row" ? "flex-row items-center" : "flex-col",
        identity.spacing.elementGap
      );
      
      return [
        `${p}<div className="${containerClasses}">`,
        ...childLines,
        `${p}</div>`,
      ].join("\n");
    }

    // SKIP decorative elements — they produce visual noise
    case "decorative":
      return `${p}{/* decorative element */}`;

    // SKIP device frames — they produce ugly bordered boxes
    case "device-wrapper":
      return `${p}{/* device frame */}`;

    default:
      return `${p}<div className="p-4" />`;
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// v5.0 — RECIPE SECTION TEMPLATES
//
// These render complete, professional sections WITHOUT wireframe data.
// They read from DesignIdentity tokens + RecipeContent for industry context.
// Every class comes from identity — change preset → change look.
//
// Naming convention: renderRecipeXxx (vs existing renderXxx which take wireframe slots)
// ═══════════════════════════════════════════════════════════════════════════════





/* ─── Helper: get recipe content with fallback ─── */
function rc(industry: string): RecipeContent {
  return getRecipeContent(industry);
}

// ═══════════════════════════════════════════════════════════
// 1. RECIPE NAV
// ═══════════════════════════════════════════════════════════

export function renderRecipeNav(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const initial = (brandName || "B").charAt(0).toUpperCase();
  const navLinks = identity.content.navLinks.slice(0, 4);
  const lines: string[] = [];

  lines.push(`${p}<nav className="${identity.components.nav.wrapper}">`);
  lines.push(`${p}  <div className="${identity.components.nav.container}">`);
  lines.push(`${p}    <div className="flex items-center justify-between h-16">`);

  // Logo
  lines.push(`${p}      <a href="#" className="${identity.components.nav.logo}">`);
  lines.push(`${p}        <div className="${identity.components.nav.logoIcon}">`);
  lines.push(`${p}          <span className="text-white font-bold text-sm">${initial}</span>`);
  lines.push(`${p}        </div>`);
  lines.push(`${p}        <span className="${cx("font-semibold text-sm tracking-tight", identity.colors.textPrimary)}">${esc(brandName)}</span>`);
  lines.push(`${p}      </a>`);

  // Nav links (desktop)
  lines.push(`${p}      <div className="hidden lg:flex items-center ${identity.spacing.elementGap}">`);
  for (const link of navLinks) {
    lines.push(`${p}        <a href="#" className="${identity.components.nav.link}">${esc(link)}</a>`);
  }
  lines.push(`${p}      </div>`);

  // Right side: CTAs + mobile toggle
  lines.push(`${p}      <div className="flex items-center gap-3">`);
  lines.push(`${p}        <div className="hidden sm:flex items-center gap-2">`);
  lines.push(renderButton(identity, indent + 5, "Log In", "ghost", undefined, "right", "sm"));
  lines.push(renderButton(identity, indent + 5, identity.content.ctaPrimary[0] || "Get Started", "primary", "arrow-right", "right", "sm"));
  lines.push(`${p}        </div>`);
  lines.push(`${p}        <button className="${identity.components.nav.mobileToggle}">`);
  lines.push(`${p}          ${renderIcon("menu", "w-5 h-5")}`);
  lines.push(`${p}        </button>`);
  lines.push(`${p}      </div>`);

  lines.push(`${p}    </div>`);
  lines.push(`${p}  </div>`);
  lines.push(`${p}</nav>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 2. RECIPE HERO — CENTERED
// ═══════════════════════════════════════════════════════════

export function renderRecipeHeroCentered(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const lines: string[] = [];

  const heading = identity.content.heroHeadings[0] || "Build something amazing";
  const subtext = identity.content.heroSubtexts[0] || "The modern platform for teams who build.";
  const ctaPrimaryText = identity.content.ctaPrimary[0] || "Get Started";
  const ctaSecondaryText = identity.content.ctaSecondary[0] || "Learn More";

  lines.push(`${p}<div className="text-center ${identity.spacing.stackLg} max-w-3xl mx-auto">`);

  // Overline badge
  lines.push(`${p}  <div className="flex justify-center">`);
  lines.push(`${p}    <span className="${identity.components.badge.primary}">`);
  lines.push(`${p}      ✨ Now available — ${esc(brandName)}`);
  lines.push(`${p}    </span>`);
  lines.push(`${p}  </div>`);

  // Heading
  lines.push(renderHeading(identity, indent + 1, heading, 1, true, true));

  // Subtext
  lines.push(renderParagraph(identity, indent + 1, subtext, "bodyLg", true, true));

  // CTA group
  lines.push(`${p}  <div className="flex flex-col sm:flex-row items-center justify-center ${identity.spacing.elementGap} pt-4">`);
  lines.push(renderButton(identity, indent + 2, ctaPrimaryText, "primary", "arrow-right", "right", "lg"));
  lines.push(renderButton(identity, indent + 2, ctaSecondaryText, "secondary", undefined, "right", "lg"));
  lines.push(`${p}  </div>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 3. RECIPE HERO — SPLIT (text + media)
// ═══════════════════════════════════════════════════════════

export function renderRecipeHeroSplit(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  industry: string
): string {
  const p = pad(indent);
  const lines: string[] = [];

  const heading = identity.content.heroHeadings[0] || "Build something amazing";
  const subtext = identity.content.heroSubtexts[0] || "The modern platform for teams who build.";
  const ctaPrimaryText = identity.content.ctaPrimary[0] || "Get Started";
  const ctaSecondaryText = identity.content.ctaSecondary[0] || "Learn More";

  lines.push(`${p}<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">`);

  // Left: Text content
  lines.push(`${p}  <div className="${identity.spacing.stackLg}">`);

  // Overline badge
  lines.push(`${p}    <div>`);
  lines.push(`${p}      <span className="${identity.components.badge.primary}">`);
  lines.push(`${p}        ✨ Introducing ${esc(brandName)}`);
  lines.push(`${p}      </span>`);
  lines.push(`${p}    </div>`);

  lines.push(renderHeading(identity, indent + 2, heading, 1, false, false));

  lines.push(`${p}    <p className="${cx(identity.typography.bodyLg, identity.colors.textSecondary, identity.typography.bodyFont, "max-w-lg")}">`);
  lines.push(`${p}      ${esc(subtext)}`);
  lines.push(`${p}    </p>`);

  // CTA group
  lines.push(`${p}    <div className="flex flex-col sm:flex-row ${identity.spacing.elementGap} pt-2">`);
  lines.push(renderButton(identity, indent + 3, ctaPrimaryText, "primary", "arrow-right", "right", "lg"));
  lines.push(renderButton(identity, indent + 3, ctaSecondaryText, "secondary", undefined, "right", "lg"));
  lines.push(`${p}    </div>`);

  lines.push(`${p}  </div>`);

  // Right: Media placeholder
  lines.push(`${p}  <div className="${identity.components.image.hero}">`);
  lines.push(`${p}    <div className="w-full aspect-video flex items-center justify-center">`);
  lines.push(`${p}      <div className="text-center ${identity.spacing.stackSm}">`);
  lines.push(`${p}        <div className="w-16 h-16 mx-auto rounded-2xl ${identity.backgrounds.accent} flex items-center justify-center">`);
  lines.push(`${p}          ${renderIcon("sparkles", cx("w-8 h-8", `text-[${identity.colors.primary.base}]`))}`);
  lines.push(`${p}        </div>`);
  lines.push(`${p}        <p className="${cx(identity.typography.caption, identity.colors.textTertiary)}">Product Preview</p>`);
  lines.push(`${p}      </div>`);
  lines.push(`${p}    </div>`);
  lines.push(`${p}  </div>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 4. RECIPE LOGO CLOUD
// ═══════════════════════════════════════════════════════════

export function renderRecipeLogoCloud(
  identity: DesignIdentity,
  indent: number,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const lines: string[] = [];

  lines.push(`${p}<div className="text-center ${identity.spacing.stackMd}">`);

  // Label
  lines.push(`${p}  <p className="${cx(identity.typography.overline)}">`);
  lines.push(`${p}    ${esc(content.logoCloudLabel)}`);
  lines.push(`${p}  </p>`);

  // Logo names
  lines.push(`${p}  <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-4">`);
  for (const name of content.logoCloudNames) {
    lines.push(`${p}    <span className="${cx("text-lg font-semibold", identity.colors.textTertiary, "opacity-60 hover:opacity-100", identity.animation.transition)}">${esc(name)}</span>`);
  }
  lines.push(`${p}  </div>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 5. RECIPE FEATURES
// ═══════════════════════════════════════════════════════════

export function renderRecipeFeatures(
  identity: DesignIdentity,
  indent: number,
  industry: string,
  config?: Record<string, unknown>
): string {
  const p = pad(indent);
  const content = rc(industry);
  const columns = (config?.columns as number) || 3;
  const lines: string[] = [];

  // Section header
  lines.push(`${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`);
  lines.push(renderHeading(identity, indent + 1, content.featuresSectionHeading, 2, true, true));
  lines.push(renderParagraph(identity, indent + 1, content.featuresSectionSubtext, "bodyLg", true, true));
  lines.push(`${p}</div>`);

  // Grid
  const featureTitles = identity.content.featureTitles;
  const featureTexts = identity.content.featureTexts;
  const icons = getFeatureIcons(columns);

  const colClass =
    columns <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : columns === 3
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  lines.push(`${p}<div className="grid ${colClass} ${identity.spacing.groupGap}">`);

  for (let i = 0; i < columns; i++) {
    const title = featureTitles[i % featureTitles.length];
    const desc = featureTexts[i % featureTexts.length];
    const icon = icons[i % icons.length];
    lines.push(renderFeatureCard(identity, indent + 1, title, desc, icon));
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 6. RECIPE STATS
// ═══════════════════════════════════════════════════════════

export function renderRecipeStats(
  identity: DesignIdentity,
  indent: number,
  industry: string
): string {
  const content = rc(industry);
  return renderStats(identity, indent, content.statsItems);
}

// ═══════════════════════════════════════════════════════════
// 7. RECIPE TESTIMONIAL
// ═══════════════════════════════════════════════════════════

export function renderRecipeTestimonial(
  identity: DesignIdentity,
  indent: number,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const lines: string[] = [];

  lines.push(`${p}<div className="max-w-3xl mx-auto text-center ${identity.spacing.stackLg}">`);

  // Quote icon
  lines.push(`${p}  <svg className="${cx("w-10 h-10 mx-auto", identity.colors.textTertiary, "opacity-40")}" viewBox="0 0 24 24" fill="currentColor">`);
  lines.push(`${p}    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" />`);
  lines.push(`${p}  </svg>`);

  // Quote text
  lines.push(`${p}  <blockquote className="${cx(identity.typography.h3, identity.colors.textPrimary, identity.typography.headingFont, "italic leading-relaxed")}">`);
  lines.push(`${p}    "${esc(content.testimonialQuote)}"`);
  lines.push(`${p}  </blockquote>`);

  // Author
  lines.push(`${p}  <div className="flex items-center justify-center gap-4 pt-2">`);
  // Avatar
  const authorInitial = (content.testimonialAuthor || "A").charAt(0).toUpperCase();
  lines.push(`${p}    <div className="${identity.components.avatar.md}">`);
  lines.push(`${p}      ${authorInitial}`);
  lines.push(`${p}    </div>`);
  lines.push(`${p}    <div className="text-left">`);
  lines.push(`${p}      <div className="${cx("font-medium", identity.typography.body, identity.colors.textPrimary)}">${esc(content.testimonialAuthor)}</div>`);
  if (content.testimonialRole || content.testimonialCompany) {
    const roleText = [content.testimonialRole, content.testimonialCompany]
      .filter(Boolean)
      .join(", ");
    lines.push(`${p}      <div className="${cx(identity.typography.bodySm, identity.colors.textTertiary)}">${esc(roleText)}</div>`);
  }
  lines.push(`${p}    </div>`);
  lines.push(`${p}  </div>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 8. RECIPE CTA
// ═══════════════════════════════════════════════════════════

export function renderRecipeCTA(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const lines: string[] = [];

  const heading = content.ctaHeading || `Ready to try ${brandName}?`;
  const subtext = content.ctaSubtext || "Join thousands who are already building faster.";
  const ctaPrimary = identity.content.ctaPrimary[0] || "Get Started";
  const ctaSecondary = identity.content.ctaSecondary[0] || "Learn More";

  // CTA sections typically have inverted colors (white text on primary bg)
  lines.push(renderHeading(identity, indent, heading, 2, true, true));
  lines.push(`${p}<p className="${cx(identity.typography.bodyLg, "text-white/80 max-w-2xl mx-auto text-center")}">`);
  lines.push(`${p}  ${esc(subtext)}`);
  lines.push(`${p}</p>`);

  lines.push(`${p}<div className="flex flex-col sm:flex-row items-center justify-center ${identity.spacing.elementGap} pt-4">`);

  // Primary CTA — white on colored background
  lines.push(`${p}  <button className="${cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium h-12 px-8",
    identity.borders.radius.button,
    `bg-white text-[${identity.colors.primary.base}]`,
    "shadow-lg hover:shadow-xl hover:-translate-y-0.5",
    "active:translate-y-0",
    identity.animation.transition,
  )}">`);
  lines.push(`${p}    ${esc(ctaPrimary)}`);
  lines.push(`${p}    ${renderIcon("arrow-right", "w-4 h-4")}`);
  lines.push(`${p}  </button>`);

  // Secondary CTA — ghost on colored background
  lines.push(`${p}  <button className="${cx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium h-12 px-8",
    identity.borders.radius.button,
    "border border-white/30 text-white",
    "hover:bg-white/10",
    identity.animation.transition,
  )}">`);
  lines.push(`${p}    ${esc(ctaSecondary)}`);
  lines.push(`${p}  </button>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 9. RECIPE NEWSLETTER
// ═══════════════════════════════════════════════════════════

export function renderRecipeNewsletter(
  identity: DesignIdentity,
  indent: number,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const lines: string[] = [];

  lines.push(`${p}<div className="max-w-xl mx-auto text-center ${identity.spacing.stackMd}">`);

  lines.push(renderHeading(identity, indent + 1, content.newsletterHeading, 3, true, false));
  lines.push(renderParagraph(identity, indent + 1, content.newsletterSubtext, "body", true, false));

  // Input + button row
  lines.push(`${p}  <div className="flex gap-3 max-w-md mx-auto pt-2">`);
  lines.push(`${p}    <input`);
  lines.push(`${p}      type="email"`);
  lines.push(`${p}      placeholder="${esc(content.newsletterPlaceholder)}"`);
  lines.push(`${p}      className="${cx("flex-1", identity.components.input.default)}"`);
  lines.push(`${p}    />`);
  lines.push(renderButton(identity, indent + 2, content.newsletterButton, "primary", undefined, "right", "md"));
  lines.push(`${p}  </div>`);

  lines.push(`${p}  <p className="${cx(identity.typography.caption, identity.colors.textTertiary, "pt-2")}">`);
  lines.push(`${p}    No spam. Unsubscribe anytime.`);
  lines.push(`${p}  </p>`);

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 10. RECIPE FOOTER
// ═══════════════════════════════════════════════════════════

export function renderRecipeFooter(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const initial = (brandName || "B").charAt(0).toUpperCase();
  const lines: string[] = [];

  // Top section: Logo + link groups + social
  lines.push(`${p}<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">`);

  // Brand column
  lines.push(`${p}  <div className="col-span-2 md:col-span-4 lg:col-span-2 ${identity.spacing.stackMd}">`);
  lines.push(`${p}    <div className="flex items-center gap-2">`);
  lines.push(`${p}      <div className="${cx("w-8 h-8 rounded-lg flex items-center justify-center", `bg-[${identity.colors.primary.base}]`)}">`);
  lines.push(`${p}        <span className="text-white text-sm font-bold">${initial}</span>`);
  lines.push(`${p}      </div>`);
  lines.push(`${p}      <span className="${cx("font-semibold text-sm", identity.colors.textInverse)}">${esc(brandName)}</span>`);
  lines.push(`${p}    </div>`);
  lines.push(`${p}    <p className="${cx(identity.typography.bodySm, identity.colors.textTertiary, "max-w-xs")}">`);
  lines.push(`${p}      ${esc(identity.content.heroSubtexts[0] || "Building the future, one product at a time.")}`);
  lines.push(`${p}    </p>`);

  // Social links
  if (content.socialLinks.length > 0) {
    lines.push(`${p}    <div className="flex items-center gap-4 pt-2">`);
    for (const social of content.socialLinks) {
      lines.push(`${p}      <a href="#" className="${cx("text-sm", identity.colors.textTertiary, "hover:text-white", identity.animation.transition)}">${esc(social)}</a>`);
    }
    lines.push(`${p}    </div>`);
  }

  lines.push(`${p}  </div>`);

  // Link groups
  for (const group of content.footerLinkGroups) {
    if (group.length === 0) continue;
    const groupTitle = group[0];
    const groupLinks = group.slice(1);

    lines.push(`${p}  <div className="${identity.spacing.stackMd}">`);
    lines.push(`${p}    <h4 className="${cx("text-sm font-semibold", identity.colors.textInverse)}">${esc(groupTitle)}</h4>`);
    lines.push(`${p}    <ul className="${identity.spacing.stackSm}">`);
    for (const link of groupLinks) {
      lines.push(`${p}      <li>`);
      lines.push(`${p}        <a href="#" className="${cx("text-sm", identity.colors.textTertiary, "hover:text-white", identity.animation.transition)}">${esc(link)}</a>`);
      lines.push(`${p}      </li>`);
    }
    lines.push(`${p}    </ul>`);
    lines.push(`${p}  </div>`);
  }

  lines.push(`${p}</div>`);

  // Bottom bar: copyright
  lines.push(`${p}<div className="mt-12 pt-8 ${identity.components.divider}">`);
  lines.push(`${p}  <p className="${cx("text-xs text-center", identity.colors.textTertiary)}">${esc(identity.content.footerCopy)}</p>`);
  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 11. RECIPE TRUST BADGES
// ═══════════════════════════════════════════════════════════

export function renderRecipeTrustBadges(
  identity: DesignIdentity,
  indent: number,
  industry: string
): string {
  const p = pad(indent);
  const content = rc(industry);
  const lines: string[] = [];

  lines.push(`${p}<div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">`);

  for (const badge of content.trustBadges) {
    lines.push(`${p}  <div className="flex items-center gap-2 px-4 py-2 ${identity.borders.radius.lg} ${identity.colors.borderLight} border">`);
    lines.push(`${p}    ${renderIcon("shield-check", cx("w-4 h-4", `text-[${identity.colors.primary.base}]`))}`);
    lines.push(`${p}    <span className="${cx(identity.typography.bodySm, identity.colors.textSecondary, "font-medium")}">${esc(badge)}</span>`);
    lines.push(`${p}  </div>`);
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 12. RECIPE PRICING CARDS
// ═══════════════════════════════════════════════════════════

export function renderRecipePricingCards(
  identity: DesignIdentity,
  indent: number,
  brandName: string
): string {
  const p = pad(indent);
  const lines: string[] = [];

  // Header
  lines.push(`${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`);
  lines.push(renderHeading(identity, indent + 1, "Simple, transparent pricing", 2, true, true));
  lines.push(renderParagraph(identity, indent + 1, "Choose the plan that fits your needs. No hidden fees.", "bodyLg", true, true));
  lines.push(`${p}</div>`);

  // 3 pricing cards
  const tiers = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals and small projects.",
      features: ["Up to 5 projects", "Basic analytics", "Email support", "1 GB storage"],
      cta: "Start Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "For growing teams that need more power.",
      features: ["Unlimited projects", "Advanced analytics", "Priority support", "10 GB storage", "Custom domains", "Team collaboration"],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For organizations with advanced needs.",
      features: ["Everything in Pro", "SSO & SAML", "Dedicated support", "Unlimited storage", "SLA guarantee", "Custom integrations"],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  lines.push(`${p}<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">`);

  for (const tier of tiers) {
    const cardClass = tier.highlighted
      ? cx(identity.components.card.elevated, `border-2 border-[${identity.colors.primary.base}]`, "relative")
      : identity.components.card.bordered;

    lines.push(`${p}  <div className="${cardClass}">`);

    if (tier.highlighted) {
      lines.push(`${p}    <div className="absolute -top-3 left-1/2 -translate-x-1/2">`);
      lines.push(`${p}      <span className="${identity.components.badge.primary}">Most Popular</span>`);
      lines.push(`${p}    </div>`);
    }

    lines.push(`${p}    <div className="p-8 ${identity.spacing.stackMd}">`);
    lines.push(`${p}      <h3 className="${cx(identity.typography.h4, identity.colors.textPrimary)}">${tier.name}</h3>`);
    lines.push(`${p}      <p className="${cx(identity.typography.bodySm, identity.colors.textSecondary)}">${tier.description}</p>`);

    // Price
    lines.push(`${p}      <div className="flex items-baseline gap-1 pt-4">`);
    lines.push(`${p}        <span className="${cx(identity.typography.display, identity.colors.textPrimary)}">${tier.price}</span>`);
    lines.push(`${p}        <span className="${cx(identity.typography.bodySm, identity.colors.textTertiary)}">${tier.period}</span>`);
    lines.push(`${p}      </div>`);

    // CTA
    lines.push(`${p}      <div className="pt-4">`);
    if (tier.highlighted) {
      lines.push(renderButton(identity, indent + 4, tier.cta, "primary", "arrow-right", "right", "md", true));
    } else {
      lines.push(renderButton(identity, indent + 4, tier.cta, "secondary", undefined, "right", "md", true));
    }
    lines.push(`${p}      </div>`);

    // Features
    lines.push(`${p}      <ul className="${identity.spacing.stackSm} pt-6">`);
    for (const feature of tier.features) {
      lines.push(`${p}        <li className="flex items-center gap-3">`);
      lines.push(`${p}          ${renderIcon("check", cx("w-4 h-4 flex-shrink-0", `text-[${identity.colors.primary.base}]`))}`);
      lines.push(`${p}          <span className="${cx(identity.typography.bodySm, identity.colors.textSecondary)}">${esc(feature)}</span>`);
      lines.push(`${p}        </li>`);
    }
    lines.push(`${p}      </ul>`);

    lines.push(`${p}    </div>`);
    lines.push(`${p}  </div>`);
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 13. RECIPE FAQ
// ═══════════════════════════════════════════════════════════

export function renderRecipeFAQ(
  identity: DesignIdentity,
  indent: number,
  brandName: string
): string {
  const p = pad(indent);
  const lines: string[] = [];

  const faqs = [
    { q: `What is ${brandName}?`, a: `${brandName} is a modern platform designed to help you build, deploy, and scale with confidence. We handle the complexity so you can focus on what matters.` },
    { q: "How does the free trial work?", a: "Start with our 14-day free trial — no credit card required. You get full access to all Pro features. Cancel anytime." },
    { q: "Can I change my plan later?", a: "Absolutely. Upgrade or downgrade at any time. Changes take effect immediately and we'll prorate your billing." },
    { q: "What kind of support do you offer?", a: "All plans include email support. Pro plans get priority support with 4-hour response times. Enterprise gets a dedicated account manager." },
    { q: "Is my data secure?", a: "Yes. We use bank-level encryption, are SOC 2 certified, and your data is backed up across multiple regions. Security is our top priority." },
  ];

  // Header
  lines.push(`${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`);
  lines.push(renderHeading(identity, indent + 1, "Frequently asked questions", 2, true, true));
  lines.push(renderParagraph(identity, indent + 1, "Everything you need to know to get started.", "bodyLg", true, true));
  lines.push(`${p}</div>`);

  // FAQ items
  lines.push(`${p}<div className="max-w-2xl mx-auto ${identity.spacing.stackMd} divide-y ${identity.colors.borderLight}">`);

  for (const faq of faqs) {
    lines.push(`${p}  <details className="group py-4">`);
    lines.push(`${p}    <summary className="flex items-center justify-between cursor-pointer list-none">`);
    lines.push(`${p}      <span className="${cx(identity.typography.body, identity.colors.textPrimary, "font-medium")}">${esc(faq.q)}</span>`);
    lines.push(`${p}      <span className="${cx(identity.colors.textTertiary, "group-open:rotate-45", identity.animation.transition)}">`);
    lines.push(`${p}        ${renderIcon("plus", "w-5 h-5")}`);
    lines.push(`${p}      </span>`);
    lines.push(`${p}    </summary>`);
    lines.push(`${p}    <p className="${cx(identity.typography.bodySm, identity.colors.textSecondary, "pt-3 leading-relaxed")}">`);
    lines.push(`${p}      ${esc(faq.a)}`);
    lines.push(`${p}    </p>`);
    lines.push(`${p}  </details>`);
  }

  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 14. RECIPE AUTH CARD (Login / Signup)
// ═══════════════════════════════════════════════════════════

export function renderRecipeAuthCard(
  identity: DesignIdentity,
  indent: number,
  brandName: string,
  config?: Record<string, unknown>
): string {
  const p = pad(indent);
  const variant = (config?.variant as string) || "login";
  const isSignup = variant === "signup";
  const lines: string[] = [];

  // Full-page centered layout
  lines.push(`${p}<div className="min-h-screen flex items-center justify-center ${identity.backgrounds.page} px-4">`);
  lines.push(`${p}  <div className="w-full max-w-md ${identity.spacing.stackLg}">`);

  // Logo + heading
  lines.push(`${p}    <div className="text-center ${identity.spacing.stackMd}">`);

  // Logo icon
  const initial = (brandName || "B").charAt(0).toUpperCase();
  lines.push(`${p}      <div className="flex justify-center">`);
  lines.push(`${p}        <div className="${identity.components.nav.logoIcon}">`);
  lines.push(`${p}          <span className="text-white font-bold text-lg">${initial}</span>`);
  lines.push(`${p}        </div>`);
  lines.push(`${p}      </div>`);

  if (isSignup) {
    lines.push(renderHeading(identity, indent + 3, `Create your ${brandName} account`, 2, true, false));
    lines.push(renderParagraph(identity, indent + 3, "Start your free trial. No credit card required.", "body", true, false));
  } else {
    lines.push(renderHeading(identity, indent + 3, `Sign in to ${brandName}`, 2, true, false));
    lines.push(renderParagraph(identity, indent + 3, "Welcome back. Enter your credentials to continue.", "body", true, false));
  }

  lines.push(`${p}    </div>`);

  // Form card
  lines.push(`${p}    <div className="${identity.components.card.bordered}">`);
  lines.push(`${p}      <div className="p-8 ${identity.spacing.stackMd}">`);

  // Social login
  lines.push(`${p}        <button className="${cx(
    "w-full inline-flex items-center justify-center gap-3",
    "h-11 px-4",
    identity.borders.radius.input,
    "border", identity.colors.borderDefault,
    identity.colors.textPrimary,
    "text-sm font-medium",
    "hover:bg-gray-50",
    identity.animation.transition,
  )}">`);
  lines.push(`${p}          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>`);
  lines.push(`${p}          Continue with Google`);
  lines.push(`${p}        </button>`);

  // Divider
  lines.push(`${p}        <div className="relative">`);
  lines.push(`${p}          <div className="absolute inset-0 flex items-center"><div className="w-full ${identity.components.divider}"></div></div>`);
  lines.push(`${p}          <div className="relative flex justify-center">`);
  lines.push(`${p}            <span className="${cx("px-4 text-xs", identity.colors.textTertiary, identity.backgrounds.page || "bg-white")}">or continue with email</span>`);
  lines.push(`${p}          </div>`);
  lines.push(`${p}        </div>`);

  // Form fields
  if (isSignup) {
    lines.push(`${p}        <div className="${identity.spacing.stackSm}">`);
    lines.push(`${p}          <label className="${cx("block text-sm font-medium", identity.colors.textPrimary)}">Full name</label>`);
    lines.push(`${p}          <input type="text" placeholder="John Doe" className="${identity.components.input.default}" />`);
    lines.push(`${p}        </div>`);
  }

  lines.push(`${p}        <div className="${identity.spacing.stackSm}">`);
  lines.push(`${p}          <label className="${cx("block text-sm font-medium", identity.colors.textPrimary)}">Email address</label>`);
  lines.push(`${p}          <input type="email" placeholder="you@example.com" className="${identity.components.input.default}" />`);
  lines.push(`${p}        </div>`);

  lines.push(`${p}        <div className="${identity.spacing.stackSm}">`);
  lines.push(`${p}          <div className="flex items-center justify-between">`);
  lines.push(`${p}            <label className="${cx("block text-sm font-medium", identity.colors.textPrimary)}">Password</label>`);
  if (!isSignup) {
    lines.push(`${p}            <a href="#" className="${cx("text-xs font-medium", identity.colors.textLink, identity.colors.textLinkHover)}">Forgot password?</a>`);
  }
  lines.push(`${p}          </div>`);
  lines.push(`${p}          <input type="password" placeholder="••••••••" className="${identity.components.input.default}" />`);
  lines.push(`${p}        </div>`);

  // Submit
  lines.push(renderButton(identity, indent + 4, isSignup ? "Create Account" : "Sign In", "primary", "arrow-right", "right", "md", true));

  lines.push(`${p}      </div>`);
  lines.push(`${p}    </div>`);

  // Bottom link
  lines.push(`${p}    <p className="${cx("text-center", identity.typography.bodySm, identity.colors.textSecondary)}">`);
  if (isSignup) {
    lines.push(`${p}      Already have an account? <a href="#" className="${cx("font-medium", identity.colors.textLink, identity.colors.textLinkHover)}">Sign in</a>`);
  } else {
    lines.push(`${p}      Don't have an account? <a href="#" className="${cx("font-medium", identity.colors.textLink, identity.colors.textLinkHover)}">Sign up for free</a>`);
  }
  lines.push(`${p}    </p>`);

  lines.push(`${p}  </div>`);
  lines.push(`${p}</div>`);

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════
// 15. RECIPE FEATURES COMPARISON (for pricing pages)
// ═══════════════════════════════════════════════════════════

export function renderRecipeFeaturesComparison(
  identity: DesignIdentity,
  indent: number
): string {
  const p = pad(indent);
  const lines: string[] = [];

  const features = [
    { name: "Projects", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "Team members", starter: "1", pro: "10", enterprise: "Unlimited" },
    { name: "Storage", starter: "1 GB", pro: "10 GB", enterprise: "Unlimited" },
    { name: "Analytics", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
    { name: "Support", starter: "Email", pro: "Priority", enterprise: "Dedicated" },
    { name: "SSO / SAML", starter: "—", pro: "—", enterprise: "✓" },
    { name: "SLA", starter: "—", pro: "99.9%", enterprise: "99.99%" },
    { name: "Custom integrations", starter: "—", pro: "—", enterprise: "✓" },
  ];

  lines.push(`${p}<div className="text-center ${identity.spacing.stackSm} mb-12">`);
  lines.push(renderHeading(identity, indent + 1, "Compare plans", 2, true, true));
  lines.push(`${p}</div>`);

  lines.push(`${p}<div className="overflow-x-auto">`);
  lines.push(`${p}  <table className="w-full max-w-4xl mx-auto">`);

  // Header
  lines.push(`${p}    <thead>`);
  lines.push(`${p}      <tr className="${identity.colors.borderLight} border-b">`);
  lines.push(`${p}        <th className="${cx("text-left py-4 pr-4", identity.typography.bodySm, identity.colors.textSecondary, "font-medium")}">Feature</th>`);
  lines.push(`${p}        <th className="${cx("text-center py-4 px-4", identity.typography.bodySm, identity.colors.textSecondary, "font-medium")}">Starter</th>`);
  lines.push(`${p}        <th className="${cx("text-center py-4 px-4", identity.typography.bodySm, `text-[${identity.colors.primary.base}]`, "font-semibold")}">Pro</th>`);
  lines.push(`${p}        <th className="${cx("text-center py-4 pl-4", identity.typography.bodySm, identity.colors.textSecondary, "font-medium")}">Enterprise</th>`);
  lines.push(`${p}      </tr>`);
  lines.push(`${p}    </thead>`);

  // Body
  lines.push(`${p}    <tbody>`);
  for (const feat of features) {
    lines.push(`${p}      <tr className="${identity.colors.borderLight} border-b">`);
    lines.push(`${p}        <td className="${cx("py-3 pr-4", identity.typography.bodySm, identity.colors.textPrimary)}">${esc(feat.name)}</td>`);
    lines.push(`${p}        <td className="${cx("text-center py-3 px-4", identity.typography.bodySm, identity.colors.textSecondary)}">${esc(feat.starter)}</td>`);
    lines.push(`${p}        <td className="${cx("text-center py-3 px-4", identity.typography.bodySm, identity.colors.textPrimary, "font-medium")}">${esc(feat.pro)}</td>`);
    lines.push(`${p}        <td className="${cx("text-center py-3 pl-4", identity.typography.bodySm, identity.colors.textSecondary)}">${esc(feat.enterprise)}</td>`);
    lines.push(`${p}      </tr>`);
  }
  lines.push(`${p}    </tbody>`);

  lines.push(`${p}  </table>`);
  lines.push(`${p}</div>`);

  return lines.join("\n");
}