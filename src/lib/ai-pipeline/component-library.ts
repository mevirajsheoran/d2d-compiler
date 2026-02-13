// src/lib/ai-pipeline/component-library.ts

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

import type {
  DesignIdentity,
  UINode,
  InferredContent,
  IconName,
  SectionType,
} from "./types";
import { renderIcon } from "./icon-registry";

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
  width?: number,
  height?: number
): string {
  const p = pad(indent);

  const variantMap: Record<string, string> = {
    default: identity.components.image.default,
    hero: identity.components.image.hero,
    card: identity.components.image.card,
  };

  const classes = variantMap[variant] || variantMap.default;
  const aspectClass = variant === "default" && width && height
    ? ""
    : variant === "default" ? "aspect-video" : "";

  const styleAttr =
    variant === "default" && width && height
      ? ` style={{ width: ${Math.round(width)}, height: ${Math.round(height)} }}`
      : "";

  return [
    `${p}<div className="${cx(classes, aspectClass)}"${styleAttr}>`,
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
  width?: number,
  height?: number
): string {
  const p = pad(indent);
  const classes = identity.components.video;

  const styleAttr =
    width && height
      ? ` style={{ width: ${Math.round(width)}, height: ${Math.round(height)} }}`
      : "";

  return [
    `${p}<div className="${classes}"${styleAttr}>`,
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
  width?: number,
  height?: number
): string {
  const p = pad(indent);
  const classes = identity.components.chart;

  const styleAttr =
    width && height
      ? ` style={{ width: ${Math.round(width)}, height: ${Math.round(height)} }}`
      : "";

  const label = chartType.charAt(0).toUpperCase() + chartType.slice(1);

  return [
    `${p}<div className="${classes}"${styleAttr}>`,
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
  bgOverride?: string
): { open: string; close: string } {
  const p = pad(indent);

  // Get section classes from identity
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

  const sectionClasses = sectionClassMap[sectionType] || identity.sections.generic;
  const bg = bgOverride || "";

  // Nav doesn't need inner container (it has its own)
  if (sectionType === "nav") {
    return {
      open: "", // Nav renders its own wrapper
      close: "",
    };
  }

  // Footer uses inverse styling
  if (sectionType === "footer") {
    return {
      open: [
        `${p}<footer className="${cx(sectionClasses, bg, identity.backgrounds.inverse === "bg-white" ? identity.backgrounds.subtle : "")}">`,
        `${p}  <div className="${identity.spacing.container}">`,
      ].join("\n"),
      close: [`${p}  </div>`, `${p}</footer>`].join("\n"),
    };
  }

  // CTA uses accent background
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

  // Form uses smaller container
  if (sectionType === "form") {
    return {
      open: [
        `${p}<section className="${cx(sectionClasses, bg)}">`,
        `${p}  <div className="${identity.spacing.containerSm}">`,
      ].join("\n"),
      close: [`${p}  </div>`, `${p}</section>`].join("\n"),
    };
  }

  // Default section wrapper
  return {
    open: [
      `${p}<section className="${cx(sectionClasses, bg)}">`,
      `${p}  <div className="${identity.spacing.container}">`,
    ].join("\n"),
    close: [`${p}  </div>`, `${p}</section>`].join("\n"),
  };
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
export function renderGenericNode(
  identity: DesignIdentity,
  indent: number,
  node: UINode,
  inferred?: InferredContent
): string {
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
      return renderHeading(identity, indent, text || "Heading", level);
    }

    case "paragraph":
      return renderParagraph(identity, indent, text || "");

    case "image":
      return renderImage(identity, indent, "default", node.width, node.height);

    case "video":
      return renderVideo(identity, indent, node.width, node.height);

    case "chart":
      return renderChart(
        identity,
        indent,
        (node.properties?.chartType as string) || "bar",
        node.width,
        node.height
      );

    case "checkbox":
      return renderCheckbox(
        identity,
        indent,
        text || (node.properties?.label as string) || "Option",
        (node.properties?.checked as boolean) || false
      );

    case "avatar": {
      const size =
        node.width > 48 ? "lg" : node.width > 32 ? "md" : "sm";
      return renderAvatar(identity, indent, size);
    }

    case "divider":
      return renderDivider(identity, indent);

    case "nav":
      return renderNav(identity, indent, identity.content.navBrand);

    case "card":
    case "container": {
      if (node.children.length === 0) {
        return `${pad(indent)}<div className="${cx(identity.components.card.bordered, "p-6")}" style={{ width: ${Math.round(node.width)}, height: ${Math.round(node.height)} }} />`;
      }
      // Container with children — render children
      const childLines = node.children.map((child) =>
        renderGenericNode(identity, indent + 1, child)
      );
      const containerClasses = cx(
        node.role === "card" ? identity.components.card.elevated : "",
        "flex",
        node.layout === "row" ? "flex-row" : "flex-col",
        identity.spacing.elementGap
      );
      return [
        `${pad(indent)}<div className="${containerClasses}">`,
        ...childLines,
        `${pad(indent)}</div>`,
      ].join("\n");
    }

    case "decorative":
      return `${pad(indent)}<div className="${cx(identity.backgrounds.accent, identity.borders.radius.lg)}" style={{ width: ${Math.round(node.width)}, height: ${Math.round(node.height)} }} />`;

    case "device-wrapper":
      return `${pad(indent)}<div className="border-2 border-gray-300 ${identity.borders.radius.lg} overflow-hidden" style={{ width: ${Math.round(node.width)}, height: ${Math.round(node.height)} }} />`;

    default:
      return `${pad(indent)}<div className="p-4" />`;
  }
}