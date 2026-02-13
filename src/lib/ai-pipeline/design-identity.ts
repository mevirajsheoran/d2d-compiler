// src/lib/ai-pipeline/design-identity.ts

/* ══════════════════════════════════════════════════════════════════════════════
   DESIGN IDENTITY ENGINE
   
   This is THE HEART of the D2D pipeline.
   
   A Design Identity is a COMPLETE, OPINIONATED design system that defines
   every visual decision: colors, typography, spacing, elevation, borders,
   animations, component styles, section layouts, and themed content.
   
   Instead of generating bare CSS ("bg-blue-500 text-white px-4 py-2"),
   we generate v0-level output with 25-30 classes per component, hover states,
   gradients, shadows, transitions, responsive breakpoints, and rich HTML.
   
   6 Presets:
     1. startup-modern    → Linear, Vercel, Raycast
     2. corporate-clean   → Stripe, GitHub, Notion  
     3. bold-creative     → Framer, Figma, Webflow
     4. minimal-elegant   → Apple, Medium, Squarespace
     5. dashboard-dense   → Linear Dashboard, Jira, Vercel Dashboard
     6. glass-gradient    → Apple Vision Pro, Raycast
   
   ZERO AI. ZERO API CALLS. ZERO COST. < 5ms execution.
   
   ══════════════════════════════════════════════════════════════════════════════ */

import type {
  DesignIdentity,
  PresetName,
  ColorPalette,
  ContentPreset,
} from "./types";

import type { StyleGuide } from "@/types/style-guide";

import {
  generatePalette,
  generateSecondaryFromPrimary,
  generateAccentFromPrimary,
  bg,
  text,
  border,
} from "./color-utils";

/* ══════════════════════════════════════════════════════════════════════════════
   PRESET 1: STARTUP MODERN
   
   Think: Linear, Vercel, Raycast, Clerk
   
   Characteristics:
   - Rounded-2xl everywhere (soft, friendly)
   - Blue/indigo gradients
   - Large whitespace (py-24 sections)
   - Colored shadows (shadow-blue-500/25)
   - Inter + Plus Jakarta Sans
   - Backdrop blur glass nav
   - Gradient CTA buttons
   - Playful hover animations (lift + scale)
   - Gray-50 page background
   - Content: "Ship faster" / "Build better" energy
   ══════════════════════════════════════════════════════════════════════════════ */

function buildStartupModern(
  primary: ColorPalette,
  secondary: ColorPalette,
  accent: ColorPalette,
  headingFont: string,
  bodyFont: string
): DesignIdentity {
  return {
    // ─── META ───
    name: "startup-modern",
    label: "Startup Modern",
    description: "Clean, modern SaaS look with gradients and glass effects. Think Linear, Vercel.",

    // ─── COLOR SYSTEM ───
    colors: {
      primary,
      secondary,
      accent,

      pageBg: "bg-gray-50",
      cardBg: "bg-white",
      cardBgHover: "hover:bg-gray-50/50",
      elevatedBg: "bg-white",
      inverseBg: "bg-gray-900",
      accentBg: `bg-gradient-to-br from-[${primary.lighter}] to-[${accent.lighter}]`,

      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      textTertiary: "text-gray-400",
      textInverse: "text-white",
      textLink: `text-[${primary.base}]`,
      textLinkHover: `hover:text-[${primary.hover}]`,

      borderLight: "border-gray-100",
      borderDefault: "border-gray-200",
      borderStrong: "border-gray-300",
      borderAccent: `border-[${primary.light}]`,
    },

    // ─── TYPOGRAPHY SYSTEM ───
    typography: {
      headingFont: headingFont !== "Inter" ? `font-['${headingFont.replace(/ /g, "_")}']` : "",
      bodyFont: bodyFont !== "Inter" ? `font-['${bodyFont.replace(/ /g, "_")}']` : "",
      monoFont: "font-mono",

      display: "text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]",
      h1: "text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12]",
      h2: "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight",
      h3: "text-xl sm:text-2xl font-semibold tracking-tight",
      h4: "text-lg font-semibold",
      bodyLg: "text-lg leading-relaxed",
      body: "text-base leading-relaxed",
      bodySm: "text-sm leading-relaxed",
      caption: "text-sm text-gray-500",
      overline: "text-xs font-semibold uppercase tracking-widest text-gray-400",

      headingMaxW: "max-w-3xl",
      bodyMaxW: "max-w-2xl",
    },

    // ─── SPACING SYSTEM ───
    spacing: {
      sectionSm: "py-12 sm:py-16",
      sectionMd: "py-16 sm:py-24",
      sectionLg: "py-24 sm:py-32",

      container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      containerSm: "max-w-2xl mx-auto px-4 sm:px-6",
      containerLg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

      elementGap: "gap-4",
      groupGap: "gap-6",
      sectionGap: "gap-16 sm:gap-24",

      stackSm: "space-y-2",
      stackMd: "space-y-4",
      stackLg: "space-y-8",
    },

    // ─── ELEVATION SYSTEM ───
    elevation: {
      none: "",
      sm: "shadow-sm shadow-gray-200/50",
      md: "shadow-md shadow-gray-200/60",
      lg: "shadow-lg shadow-gray-200/60",
      xl: "shadow-xl shadow-gray-300/40",
      glow: `shadow-lg shadow-[${primary.glow}]`,
      inner: "shadow-inner",
    },

    // ─── BORDER SYSTEM ───
    borders: {
      radius: {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        full: "rounded-full",
        button: "rounded-xl",
        input: "rounded-xl",
        card: "rounded-2xl",
        badge: "rounded-full",
        avatar: "rounded-full",
        section: "rounded-3xl",
      },
      widthThin: "border",
      widthMedium: "border-2",
    },

    // ─── ANIMATION SYSTEM ───
    animation: {
      transition: "transition-all duration-200",
      transitionSlow: "transition-all duration-500",
      hoverLift: "hover:-translate-y-1",
      hoverScale: "hover:scale-[1.02]",
      activePress: "active:scale-[0.98]",
      focusRing: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-2`,
    },

    // ─── BACKGROUNDS ───
    backgrounds: {
      page: "bg-gray-50",
      subtle: "bg-gray-50/80",
      accent: `bg-gradient-to-br from-[${primary.lighter}] via-white to-[${accent.lighter}]`,
      inverse: "bg-gray-900",
      pattern: "bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0,0.05)_1px,transparent_0)] bg-[length:24px_24px]",
      mesh: `bg-gradient-to-br from-[${primary.lighter}] via-white to-[${accent.lighter}]`,
      hero: `bg-gradient-to-b from-white via-[${primary.lighter}] to-white`,
      cta: `bg-gradient-to-br from-[${primary.base}] to-[${primary.dark}]`,
    },

    // ─── COMPONENT CLASS PRESETS ───
    components: {
      button: {
        primary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-6",
          "rounded-xl",
          `bg-gradient-to-b from-[${primary.base}] to-[${primary.hover}]`,
          "text-white",
          `shadow-md shadow-[${primary.glow}]`,
          `hover:shadow-lg hover:shadow-[${primary.glow}]`,
          "hover:-translate-y-0.5",
          "active:translate-y-0 active:shadow-sm",
          `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-2`,
          "transition-all duration-200",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        secondary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-6",
          "rounded-xl",
          "bg-white border border-gray-200",
          "text-gray-700",
          "shadow-sm",
          "hover:bg-gray-50 hover:border-gray-300 hover:shadow-md",
          "hover:-translate-y-0.5",
          "active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        ghost: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-4",
          "rounded-xl",
          "text-gray-600",
          "hover:text-gray-900 hover:bg-gray-100",
          "active:bg-gray-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          "transition-all duration-200",
        ].join(" "),

        link: [
          "inline-flex items-center gap-1",
          "text-sm font-medium",
          `text-[${primary.base}]`,
          `hover:text-[${primary.hover}]`,
          "underline-offset-4 hover:underline",
          "transition-colors duration-200",
        ].join(" "),

        danger: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-6",
          "rounded-xl",
          "bg-gradient-to-b from-red-500 to-red-600",
          "text-white",
          "shadow-md shadow-red-500/25",
          "hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5",
          "active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
          "transition-all duration-200",
        ].join(" "),

        sizes: {
          sm: "h-8 px-3 text-xs rounded-lg",
          md: "h-10 px-6 text-sm rounded-xl",
          lg: "h-12 px-8 text-base rounded-xl",
        },
      },

      input: {
        default: [
          "w-full h-11",
          "px-4",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white border border-gray-200 rounded-xl",
          "hover:border-gray-300",
          `focus:border-[${primary.base}] focus:ring-4 focus:ring-[${primary.ring}]`,
          "transition-all duration-200 outline-none",
          "disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed",
        ].join(" "),

        error: [
          "w-full h-11",
          "px-4",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white border-2 border-red-300 rounded-xl",
          "focus:border-red-500 focus:ring-4 focus:ring-red-500/10",
          "transition-all duration-200 outline-none",
        ].join(" "),

        search: [
          "w-full h-11",
          "pl-10 pr-4",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-gray-50 border border-gray-200 rounded-full",
          "hover:bg-white hover:border-gray-300",
          `focus:bg-white focus:border-[${primary.base}] focus:ring-4 focus:ring-[${primary.ring}]`,
          "transition-all duration-200 outline-none",
        ].join(" "),

        sizes: {
          sm: "h-9 px-3 text-xs",
          md: "h-11 px-4 text-sm",
          lg: "h-13 px-5 text-base",
        },
      },

      card: {
        elevated: [
          "bg-white rounded-2xl",
          "border border-gray-200/60",
          "shadow-sm shadow-gray-100",
          "hover:shadow-xl hover:shadow-gray-200/40",
          "hover:border-gray-200",
          "hover:-translate-y-1",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        bordered: [
          "bg-white rounded-2xl",
          "border border-gray-200",
          "hover:border-gray-300",
          "transition-all duration-200",
          "overflow-hidden",
        ].join(" "),

        ghost: [
          "bg-gray-50/50 rounded-2xl",
          "hover:bg-gray-50",
          "transition-all duration-200",
          "overflow-hidden",
        ].join(" "),

        interactive: [
          "group relative bg-white rounded-2xl",
          "border border-gray-200/60",
          "shadow-sm shadow-gray-100",
          "hover:shadow-xl hover:shadow-gray-200/40",
          "hover:-translate-y-1",
          "transition-all duration-300",
          "overflow-hidden cursor-pointer",
        ].join(" "),
      },

      badge: {
        default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700",
        primary: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg(primary.light)} ${text(primary.dark)}`,
        success: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700",
        warning: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700",
      },

      nav: {
        wrapper: "sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-100/80",
        container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
        logo: "flex items-center gap-2.5 group transition-opacity hover:opacity-80",
        logoIcon: `w-8 h-8 rounded-lg bg-gradient-to-br from-[${primary.base}] to-[${primary.hover}] flex items-center justify-center shadow-md shadow-[${primary.glow}]`,
        link: "text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200",
        linkActive: `text-sm font-medium text-[${primary.base}]`,
        mobileToggle: "p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors lg:hidden",
      },

      avatar: {
        sm: `w-8 h-8 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${primary.hover}] flex items-center justify-center text-white text-xs font-bold shadow-sm`,
        md: `w-10 h-10 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${primary.hover}] flex items-center justify-center text-white text-sm font-bold shadow-sm`,
        lg: `w-14 h-14 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${primary.hover}] flex items-center justify-center text-white text-lg font-bold shadow-md`,
      },

      divider: "border-t border-gray-200 w-full",

      checkbox: [
        "flex items-center gap-3 cursor-pointer group",
      ].join(" "),

      image: {
        default: [
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-gray-100 to-gray-50",
          "border border-gray-200/50",
          "flex items-center justify-center",
        ].join(" "),

        hero: [
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-gray-100 to-gray-50",
          "border border-gray-200/50",
          "aspect-video",
          "flex items-center justify-center",
          `shadow-xl shadow-gray-300/30`,
        ].join(" "),

        card: [
          "relative overflow-hidden rounded-t-2xl",
          "bg-gradient-to-br from-gray-100 to-gray-50",
          "aspect-video",
          "flex items-center justify-center",
        ].join(" "),
      },

      video: [
        "relative overflow-hidden rounded-2xl",
        "bg-gray-900",
        "aspect-video",
        "flex items-center justify-center",
        "shadow-xl shadow-gray-900/20",
      ].join(" "),

      chart: [
        "bg-white rounded-2xl",
        "border border-gray-200",
        "p-6",
        "shadow-sm",
      ].join(" "),
    },

    // ─── SECTION WRAPPER PRESETS ───
    sections: {
      nav: "sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl backdrop-saturate-150 border-b border-gray-100/80",
      hero: "py-24 sm:py-32",
      features: "py-16 sm:py-24 bg-white",
      form: "py-16 sm:py-24",
      content: "py-16 sm:py-24",
      cardGrid: "py-16 sm:py-24",
      cta: `py-16 sm:py-24 bg-gradient-to-br from-[${primary.base}] to-[${primary.dark}] text-white`,
      footer: "py-12 sm:py-16 bg-gray-900 text-gray-300",
      generic: "py-12 sm:py-16",
    },

    // ─── PAGE WRAPPER ───
    page: {
      wrapper: "min-h-screen bg-gray-50 antialiased",
      innerWrapper: "flex flex-col min-h-screen",
      mainContent: "flex-1",
      fontImports: [
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap",
        ...(headingFont !== "Inter" && headingFont !== ""
          ? [`https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@400;500;600;700;800&display=swap`]
          : []),
      ],
    },

    // ─── THEMED CONTENT ───
    content: {
      heroHeadings: [
        "Build something amazing",
        "Ship faster, grow smarter",
        "The modern platform for teams",
        "Everything you need to scale",
      ],
      heroSubtexts: [
        "Join thousands of teams who trust us to power their workflow. Simple setup, powerful results.",
        "From idea to production in minutes, not months. Built for speed.",
        "The all-in-one platform that helps you build, deploy, and scale with confidence.",
      ],
      ctaPrimary: ["Get Started", "Start Free", "Try Now", "Get Started Free"],
      ctaSecondary: ["Learn More", "See Demo", "View Pricing", "Book a Demo"],
      navBrand: "Brand",
      navLinks: ["Features", "Pricing", "About", "Blog"],
      footerCopy: "© 2025 Brand. All rights reserved.",
      footerLinks: ["Privacy", "Terms", "Contact", "Status"],
      featureTitles: ["Lightning Fast", "Enterprise Security", "Auto Scaling", "99.9% Uptime"],
      featureTexts: [
        "Built on the edge for sub-millisecond response times worldwide.",
        "SOC 2 compliant with end-to-end encryption and SSO support.",
        "Automatically scales from zero to millions without configuration.",
        "Redundant infrastructure across multiple regions for maximum reliability.",
      ],
      formHeadings: ["Welcome back", "Create your account", "Get in touch", "Sign in"],
      formSubtexts: [
        "Enter your credentials to access your dashboard.",
        "Start your free trial. No credit card required.",
        "We'd love to hear from you. Send us a message.",
      ],
    },
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
   PRESET 2: CORPORATE CLEAN
   
   Think: Stripe, GitHub, Notion, Linear
   
   Characteristics:
   - Moderate corners (rounded-lg)
   - Navy/slate color palette
   - Structured spacing (py-16 sections)
   - Subtle gray shadows
   - System font stack or Inter
   - Solid nav background
   - Solid color CTA buttons (no gradients)
   - Minimal, purposeful animations
   - White page background
   - Content: "Enterprise solutions" / "Trusted by leaders" energy
   ══════════════════════════════════════════════════════════════════════════════ */

function buildCorporateClean(
  primary: ColorPalette,
  secondary: ColorPalette,
  accent: ColorPalette,
  headingFont: string,
  bodyFont: string
): DesignIdentity {
  return {
    name: "corporate-clean",
    label: "Corporate Clean",
    description: "Professional, structured look with clean lines. Think Stripe, GitHub.",

    colors: {
      primary,
      secondary,
      accent,

      pageBg: "bg-white",
      cardBg: "bg-white",
      cardBgHover: "hover:bg-gray-50",
      elevatedBg: "bg-white",
      inverseBg: "bg-slate-900",
      accentBg: `bg-[${primary.lighter}]`,

      textPrimary: "text-slate-900",
      textSecondary: "text-slate-600",
      textTertiary: "text-slate-400",
      textInverse: "text-white",
      textLink: `text-[${primary.base}]`,
      textLinkHover: `hover:text-[${primary.hover}]`,

      borderLight: "border-slate-100",
      borderDefault: "border-slate-200",
      borderStrong: "border-slate-300",
      borderAccent: `border-[${primary.light}]`,
    },

    typography: {
      headingFont: headingFont !== "Inter" ? `font-['${headingFont.replace(/ /g, "_")}']` : "",
      bodyFont: bodyFont !== "Inter" ? `font-['${bodyFont.replace(/ /g, "_")}']` : "",
      monoFont: "font-mono",

      display: "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]",
      h1: "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15]",
      h2: "text-2xl sm:text-3xl font-semibold tracking-tight",
      h3: "text-xl font-semibold",
      h4: "text-lg font-medium",
      bodyLg: "text-lg leading-7",
      body: "text-base leading-7",
      bodySm: "text-sm leading-6",
      caption: "text-sm text-slate-500",
      overline: "text-xs font-semibold uppercase tracking-wider text-slate-400",

      headingMaxW: "max-w-2xl",
      bodyMaxW: "max-w-xl",
    },

    spacing: {
      sectionSm: "py-12 sm:py-16",
      sectionMd: "py-16 sm:py-20",
      sectionLg: "py-20 sm:py-28",

      container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      containerSm: "max-w-xl mx-auto px-4 sm:px-6",
      containerLg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

      elementGap: "gap-4",
      groupGap: "gap-6",
      sectionGap: "gap-12 sm:gap-20",

      stackSm: "space-y-2",
      stackMd: "space-y-4",
      stackLg: "space-y-6",
    },

    elevation: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md shadow-slate-200/50",
      lg: "shadow-lg shadow-slate-200/50",
      xl: "shadow-xl shadow-slate-300/30",
      glow: `shadow-lg shadow-[${primary.glow}]`,
      inner: "shadow-inner",
    },

    borders: {
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
        full: "rounded-full",
        button: "rounded-lg",
        input: "rounded-lg",
        card: "rounded-xl",
        badge: "rounded-full",
        avatar: "rounded-full",
        section: "rounded-xl",
      },
      widthThin: "border",
      widthMedium: "border-2",
    },

    animation: {
      transition: "transition-all duration-150",
      transitionSlow: "transition-all duration-300",
      hoverLift: "hover:-translate-y-0.5",
      hoverScale: "hover:scale-[1.01]",
      activePress: "active:scale-[0.99]",
      focusRing: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-2`,
    },

    backgrounds: {
      page: "bg-white",
      subtle: "bg-slate-50",
      accent: `bg-[${primary.lighter}]`,
      inverse: "bg-slate-900",
      pattern: "bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0,0.03)_1px,transparent_0)] bg-[length:20px_20px]",
      mesh: "bg-gradient-to-b from-slate-50 to-white",
      hero: "bg-gradient-to-b from-slate-50 via-white to-white",
      cta: `bg-[${primary.base}]`,
    },

    components: {
      button: {
        primary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-5",
          "rounded-lg",
          `${bg(primary.base)}`,
          "text-white",
          "shadow-sm",
          `hover:${bg(primary.hover)} hover:shadow-md`,
          "active:shadow-sm",
          `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-2`,
          "transition-all duration-150",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        secondary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-5",
          "rounded-lg",
          "bg-white border border-slate-200",
          "text-slate-700",
          "shadow-sm",
          "hover:bg-slate-50 hover:border-slate-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
          "transition-all duration-150",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        ghost: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-4",
          "rounded-lg",
          "text-slate-600",
          "hover:text-slate-900 hover:bg-slate-100",
          "transition-all duration-150",
        ].join(" "),

        link: [
          "inline-flex items-center gap-1",
          "text-sm font-medium",
          `text-[${primary.base}]`,
          `hover:text-[${primary.hover}]`,
          "underline-offset-4 hover:underline",
          "transition-colors duration-150",
        ].join(" "),

        danger: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-5",
          "rounded-lg",
          "bg-red-600 text-white",
          "shadow-sm",
          "hover:bg-red-700 hover:shadow-md",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
          "transition-all duration-150",
        ].join(" "),

        sizes: {
          sm: "h-8 px-3 text-xs rounded-md",
          md: "h-10 px-5 text-sm rounded-lg",
          lg: "h-12 px-7 text-base rounded-lg",
        },
      },

      input: {
        default: [
          "w-full h-10",
          "px-3.5",
          "text-sm text-slate-900 placeholder:text-slate-400",
          "bg-white border border-slate-200 rounded-lg",
          "hover:border-slate-300",
          `focus:border-[${primary.base}] focus:ring-2 focus:ring-[${primary.ring}]`,
          "transition-all duration-150 outline-none",
          "disabled:bg-slate-50 disabled:text-slate-400",
        ].join(" "),

        error: [
          "w-full h-10",
          "px-3.5",
          "text-sm text-slate-900 placeholder:text-slate-400",
          "bg-white border-2 border-red-300 rounded-lg",
          "focus:border-red-500 focus:ring-2 focus:ring-red-500/10",
          "transition-all duration-150 outline-none",
        ].join(" "),

        search: [
          "w-full h-10",
          "pl-9 pr-3.5",
          "text-sm text-slate-900 placeholder:text-slate-400",
          "bg-slate-50 border border-slate-200 rounded-lg",
          "hover:bg-white hover:border-slate-300",
          `focus:bg-white focus:border-[${primary.base}] focus:ring-2 focus:ring-[${primary.ring}]`,
          "transition-all duration-150 outline-none",
        ].join(" "),

        sizes: {
          sm: "h-8 px-3 text-xs",
          md: "h-10 px-3.5 text-sm",
          lg: "h-12 px-4 text-base",
        },
      },

      card: {
        elevated: [
          "bg-white rounded-xl",
          "border border-slate-200",
          "shadow-sm",
          "hover:shadow-lg",
          "hover:-translate-y-0.5",
          "transition-all duration-200",
          "overflow-hidden",
        ].join(" "),

        bordered: [
          "bg-white rounded-xl",
          "border border-slate-200",
          "hover:border-slate-300",
          "transition-all duration-150",
          "overflow-hidden",
        ].join(" "),

        ghost: [
          "bg-slate-50 rounded-xl",
          "hover:bg-slate-100",
          "transition-all duration-150",
          "overflow-hidden",
        ].join(" "),

        interactive: [
          "group bg-white rounded-xl",
          "border border-slate-200",
          "shadow-sm",
          "hover:shadow-lg hover:-translate-y-0.5",
          "transition-all duration-200",
          "overflow-hidden cursor-pointer",
        ].join(" "),
      },

      badge: {
        default: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700",
        primary: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bg(primary.light)} ${text(primary.dark)}`,
        success: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700",
        warning: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700",
      },

      nav: {
        wrapper: "sticky top-0 z-50 w-full bg-white border-b border-slate-200",
        container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
        logo: "flex items-center gap-2 font-semibold text-slate-900",
        logoIcon: `w-7 h-7 rounded-md ${bg(primary.base)} flex items-center justify-center`,
        link: "text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors",
        linkActive: `text-sm font-medium text-[${primary.base}]`,
        mobileToggle: "p-2 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden",
      },

      avatar: {
        sm: `w-8 h-8 rounded-full ${bg(primary.base)} flex items-center justify-center text-white text-xs font-semibold`,
        md: `w-10 h-10 rounded-full ${bg(primary.base)} flex items-center justify-center text-white text-sm font-semibold`,
        lg: `w-14 h-14 rounded-full ${bg(primary.base)} flex items-center justify-center text-white text-lg font-semibold`,
      },

      divider: "border-t border-slate-200 w-full",
      checkbox: "flex items-center gap-3 cursor-pointer group",

      image: {
        default: "relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center",
        hero: "relative overflow-hidden rounded-xl bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center shadow-lg",
        card: "relative overflow-hidden rounded-t-xl bg-slate-100 aspect-video flex items-center justify-center",
      },

      video: "relative overflow-hidden rounded-xl bg-slate-900 aspect-video flex items-center justify-center shadow-lg",
      chart: "bg-white rounded-xl border border-slate-200 p-5 shadow-sm",
    },

    sections: {
      nav: "sticky top-0 z-50 w-full bg-white border-b border-slate-200",
      hero: "py-20 sm:py-28",
      features: "py-16 sm:py-20 bg-slate-50",
      form: "py-16 sm:py-20",
      content: "py-16 sm:py-20",
      cardGrid: "py-16 sm:py-20",
      cta: `py-16 sm:py-20 ${bg(primary.base)} text-white`,
      footer: "py-12 sm:py-16 bg-slate-900 text-slate-400",
      generic: "py-12 sm:py-16",
    },

    page: {
      wrapper: "min-h-screen bg-white antialiased",
      innerWrapper: "flex flex-col min-h-screen",
      mainContent: "flex-1",
      fontImports: [
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
        ...(headingFont !== "Inter" && headingFont !== ""
          ? [`https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@400;500;600;700&display=swap`]
          : []),
      ],
    },

    content: {
      heroHeadings: [
        "Enterprise solutions that scale",
        "Trusted by industry leaders",
        "Transform your business workflow",
        "Built for modern enterprises",
      ],
      heroSubtexts: [
        "Streamline operations with our enterprise-grade platform trusted by Fortune 500 companies.",
        "A complete suite of tools designed for teams that demand reliability and performance.",
        "Reduce complexity. Increase efficiency. Deliver results.",
      ],
      ctaPrimary: ["Request Demo", "Get Started", "Contact Sales", "Start Trial"],
      ctaSecondary: ["Learn More", "Read Docs", "View Case Studies", "See Pricing"],
      navBrand: "Acme",
      navLinks: ["Products", "Solutions", "Pricing", "Resources"],
      footerCopy: "© 2025 Acme Inc. All rights reserved.",
      footerLinks: ["Privacy Policy", "Terms of Service", "Security", "Status"],
      featureTitles: ["Enterprise Grade", "Compliance Ready", "Global Scale", "24/7 Support"],
      featureTexts: [
        "Built for organizations with demanding security and performance requirements.",
        "SOC 2 Type II, HIPAA, and GDPR compliant out of the box.",
        "Deploy across 30+ regions with automatic failover and load balancing.",
        "Dedicated support team with guaranteed response times.",
      ],
      formHeadings: ["Sign in to your account", "Create your account", "Contact our team", "Request a demo"],
      formSubtexts: [
        "Welcome back. Enter your credentials to continue.",
        "Get started with a free 14-day trial.",
        "Our team typically responds within 24 hours.",
      ],
    },
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
   PRESET 3: BOLD & CREATIVE
   
   Think: Framer, Figma, Webflow, Lemon Squeezy
   
   Characteristics:
   - Mixed corners (xl + full)
   - Vibrant multi-color palette
   - Asymmetric, generous spacing
   - Strong shadows + gradients
   - Display fonts (bold, expressive)
   - Colored section backgrounds
   - Bouncy hover animations (scale + rotate hints)
   - Gradient mesh backgrounds
   - Content: "Unleash creativity" / "Break the rules" energy
   ══════════════════════════════════════════════════════════════════════════════ */

function buildBoldCreative(
  primary: ColorPalette,
  secondary: ColorPalette,
  accent: ColorPalette,
  headingFont: string,
  bodyFont: string
): DesignIdentity {
  return {
    name: "bold-creative",
    label: "Bold & Creative",
    description: "Vibrant, expressive design with strong colors and playful interactions. Think Framer, Figma.",

    colors: {
      primary,
      secondary,
      accent,

      pageBg: "bg-white",
      cardBg: "bg-white",
      cardBgHover: "hover:bg-gray-50",
      elevatedBg: "bg-white",
      inverseBg: "bg-gray-950",
      accentBg: `bg-gradient-to-br from-[${primary.lighter}] via-[${accent.lighter}] to-[${secondary.lighter}]`,

      textPrimary: "text-gray-950",
      textSecondary: "text-gray-600",
      textTertiary: "text-gray-400",
      textInverse: "text-white",
      textLink: `text-[${primary.base}]`,
      textLinkHover: `hover:text-[${primary.hover}]`,

      borderLight: "border-gray-100",
      borderDefault: "border-gray-200",
      borderStrong: "border-gray-300",
      borderAccent: `border-[${accent.base}]`,
    },

    typography: {
      headingFont: headingFont !== "Inter" ? `font-['${headingFont.replace(/ /g, "_")}']` : "",
      bodyFont: bodyFont !== "Inter" ? `font-['${bodyFont.replace(/ /g, "_")}']` : "",
      monoFont: "font-mono",

      display: "text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]",
      h1: "text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.05]",
      h2: "text-3xl sm:text-4xl font-bold tracking-tight",
      h3: "text-xl sm:text-2xl font-bold",
      h4: "text-lg font-bold",
      bodyLg: "text-lg leading-relaxed",
      body: "text-base leading-relaxed",
      bodySm: "text-sm leading-relaxed",
      caption: "text-sm text-gray-500 font-medium",
      overline: "text-xs font-bold uppercase tracking-widest text-gray-400",

      headingMaxW: "max-w-4xl",
      bodyMaxW: "max-w-2xl",
    },

    spacing: {
      sectionSm: "py-16 sm:py-20",
      sectionMd: "py-20 sm:py-28",
      sectionLg: "py-28 sm:py-36",

      container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      containerSm: "max-w-2xl mx-auto px-4 sm:px-6",
      containerLg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

      elementGap: "gap-5",
      groupGap: "gap-8",
      sectionGap: "gap-20 sm:gap-28",

      stackSm: "space-y-3",
      stackMd: "space-y-5",
      stackLg: "space-y-10",
    },

    elevation: {
      none: "",
      sm: "shadow-md shadow-gray-200/40",
      md: "shadow-lg shadow-gray-300/40",
      lg: "shadow-xl shadow-gray-300/50",
      xl: "shadow-2xl shadow-gray-400/30",
      glow: `shadow-xl shadow-[${primary.glow}]`,
      inner: "shadow-inner",
    },

    borders: {
      radius: {
        sm: "rounded-xl",
        md: "rounded-2xl",
        lg: "rounded-3xl",
        full: "rounded-full",
        button: "rounded-full",
        input: "rounded-xl",
        card: "rounded-3xl",
        badge: "rounded-full",
        avatar: "rounded-full",
        section: "rounded-3xl",
      },
      widthThin: "border",
      widthMedium: "border-2",
    },

    animation: {
      transition: "transition-all duration-300",
      transitionSlow: "transition-all duration-700",
      hoverLift: "hover:-translate-y-2",
      hoverScale: "hover:scale-[1.05]",
      activePress: "active:scale-[0.95]",
      focusRing: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${accent.base}] focus-visible:ring-offset-2`,
    },

    backgrounds: {
      page: "bg-white",
      subtle: `bg-[${primary.lighter}]`,
      accent: `bg-gradient-to-br from-[${primary.lighter}] via-[${accent.lighter}] to-[${secondary.lighter}]`,
      inverse: "bg-gray-950",
      pattern: "bg-[radial-gradient(circle_at_1px_1px,rgb(0,0,0,0.06)_1px,transparent_0)] bg-[length:32px_32px]",
      mesh: `bg-gradient-to-tr from-[${primary.lighter}] via-white to-[${accent.lighter}]`,
      hero: `bg-gradient-to-br from-[${primary.lighter}] via-white to-[${accent.lighter}]`,
      cta: `bg-gradient-to-r from-[${primary.base}] via-[${accent.base}] to-[${secondary.base}]`,
    },

    components: {
      button: {
        primary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-bold",
          "h-12 px-8",
          "rounded-full",
          `bg-gradient-to-r from-[${primary.base}] to-[${accent.base}]`,
          "text-white",
          `shadow-lg shadow-[${primary.glow}]`,
          `hover:shadow-xl hover:shadow-[${primary.glow}]`,
          "hover:scale-105",
          "active:scale-95",
          `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${accent.base}] focus-visible:ring-offset-2`,
          "transition-all duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        secondary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-bold",
          "h-12 px-8",
          "rounded-full",
          "bg-white border-2 border-gray-200",
          "text-gray-900",
          "shadow-md",
          "hover:border-gray-300 hover:shadow-lg hover:scale-105",
          "active:scale-95",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        ghost: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-bold",
          "h-12 px-6",
          "rounded-full",
          "text-gray-600",
          "hover:text-gray-900 hover:bg-gray-100",
          "transition-all duration-300",
        ].join(" "),

        link: [
          "inline-flex items-center gap-1",
          "text-sm font-bold",
          `text-[${primary.base}]`,
          `hover:text-[${primary.hover}]`,
          "underline-offset-4 hover:underline",
          "transition-colors duration-300",
        ].join(" "),

        danger: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-bold",
          "h-12 px-8",
          "rounded-full",
          "bg-gradient-to-r from-red-500 to-rose-500",
          "text-white shadow-lg shadow-red-500/30",
          "hover:shadow-xl hover:scale-105",
          "active:scale-95",
          "transition-all duration-300",
        ].join(" "),

        sizes: {
          sm: "h-9 px-5 text-xs rounded-full",
          md: "h-12 px-8 text-sm rounded-full",
          lg: "h-14 px-10 text-base rounded-full",
        },
      },

      input: {
        default: [
          "w-full h-12",
          "px-5",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white border-2 border-gray-200 rounded-xl",
          "hover:border-gray-300",
          `focus:border-[${primary.base}] focus:ring-4 focus:ring-[${primary.ring}]`,
          "transition-all duration-300 outline-none",
        ].join(" "),

        error: [
          "w-full h-12",
          "px-5",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white border-2 border-red-300 rounded-xl",
          "focus:border-red-500 focus:ring-4 focus:ring-red-500/10",
          "transition-all duration-300 outline-none",
        ].join(" "),

        search: [
          "w-full h-12",
          "pl-12 pr-5",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-gray-50 border-2 border-gray-200 rounded-full",
          `focus:bg-white focus:border-[${primary.base}] focus:ring-4 focus:ring-[${primary.ring}]`,
          "transition-all duration-300 outline-none",
        ].join(" "),

        sizes: {
          sm: "h-10 px-4 text-xs",
          md: "h-12 px-5 text-sm",
          lg: "h-14 px-6 text-base",
        },
      },

      card: {
        elevated: [
          "bg-white rounded-3xl",
          "border border-gray-100",
          "shadow-lg shadow-gray-200/50",
          "hover:shadow-2xl hover:shadow-gray-300/40",
          "hover:-translate-y-2",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        bordered: [
          "bg-white rounded-3xl",
          "border-2 border-gray-200",
          "hover:border-gray-300",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        ghost: [
          `bg-[${primary.lighter}] rounded-3xl`,
          "hover:bg-gray-100",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        interactive: [
          "group relative bg-white rounded-3xl",
          "border border-gray-100",
          "shadow-lg shadow-gray-200/50",
          "hover:shadow-2xl hover:-translate-y-2",
          "transition-all duration-300",
          "overflow-hidden cursor-pointer",
        ].join(" "),
      },

      badge: {
        default: "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700",
        primary: `inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${bg(primary.light)} ${text(primary.dark)}`,
        success: "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700",
        warning: "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700",
      },

      nav: {
        wrapper: "sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100",
        container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
        logo: "flex items-center gap-3 group",
        logoIcon: `w-9 h-9 rounded-xl bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center shadow-lg shadow-[${primary.glow}]`,
        link: "text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors duration-300",
        linkActive: `text-sm font-bold text-[${primary.base}]`,
        mobileToggle: "p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all lg:hidden",
      },

      avatar: {
        sm: `w-8 h-8 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center text-white text-xs font-bold`,
        md: `w-10 h-10 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center text-white text-sm font-bold`,
        lg: `w-14 h-14 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center text-white text-lg font-bold`,
      },

      divider: "border-t-2 border-gray-200 w-full",
      checkbox: "flex items-center gap-3 cursor-pointer group",

      image: {
        default: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center",
        hero: "relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 aspect-video flex items-center justify-center shadow-2xl",
        card: "relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-100 to-gray-50 aspect-video flex items-center justify-center",
      },

      video: "relative overflow-hidden rounded-3xl bg-gray-950 aspect-video flex items-center justify-center shadow-2xl",
      chart: `bg-white rounded-3xl border-2 border-gray-200 p-6`,
    },

    sections: {
      nav: "sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100",
      hero: "py-28 sm:py-36",
      features: `py-20 sm:py-28 bg-[${primary.lighter}]`,
      form: "py-20 sm:py-28",
      content: "py-20 sm:py-28",
      cardGrid: "py-20 sm:py-28",
      cta: `py-20 sm:py-28 bg-gradient-to-r from-[${primary.base}] via-[${accent.base}] to-[${secondary.base}] text-white`,
      footer: "py-16 sm:py-20 bg-gray-950 text-gray-400",
      generic: "py-16 sm:py-20",
    },

    page: {
      wrapper: "min-h-screen bg-white antialiased",
      innerWrapper: "flex flex-col min-h-screen",
      mainContent: "flex-1",
      fontImports: [
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap",
        ...(headingFont !== "Inter" && headingFont !== ""
          ? [`https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@400;500;600;700;800;900&display=swap`]
          : []),
      ],
    },

    content: {
      heroHeadings: [
        "Unleash your creativity",
        "Design without limits",
        "Where ideas come alive",
        "Create. Inspire. Transform.",
      ],
      heroSubtexts: [
        "The creative platform that empowers you to build extraordinary digital experiences.",
        "No compromises. No constraints. Just pure creative freedom.",
        "Bring your wildest ideas to life with tools that match your ambition.",
      ],
      ctaPrimary: ["Start Creating", "Try it Free", "Dive In", "Get Inspired"],
      ctaSecondary: ["See Examples", "Watch Demo", "Explore", "View Gallery"],
      navBrand: "Studio",
      navLinks: ["Work", "Services", "About", "Contact"],
      footerCopy: "© 2025 Studio. Made with passion.",
      footerLinks: ["Privacy", "Terms", "Instagram", "Twitter"],
      featureTitles: ["Pixel Perfect", "Real-time Collab", "Smart Templates", "Export Anywhere"],
      featureTexts: [
        "Every detail matters. Create with precision at any scale.",
        "Work together in real-time with your entire team.",
        "Start fast with professionally designed templates.",
        "Export to any format — web, mobile, print, and more.",
      ],
      formHeadings: ["Join the community", "Let's collaborate", "Start your journey", "Get access"],
      formSubtexts: [
        "Join 50,000+ creators who are already building the future.",
        "Tell us about your project. We'll bring it to life.",
        "Your creative journey starts here.",
      ],
    },
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
   PRESET 4: MINIMAL ELEGANT
   
   Think: Apple, Medium, Squarespace, Aesop
   
   Characteristics:
   - Sharp/barely-rounded corners (rounded-sm to rounded)
   - Monochrome + single accent color
   - Generous whitespace (py-32 sections)
   - No or near-invisible shadows
   - Serif headings + sans body
   - Thin borders instead of shadows
   - Subtle fade-only animations
   - White page background
   - Content: "Refined simplicity" / "Less is more" energy
   ══════════════════════════════════════════════════════════════════════════════ */

function buildMinimalElegant(
  primary: ColorPalette,
  secondary: ColorPalette,
  accent: ColorPalette,
  headingFont: string,
  bodyFont: string
): DesignIdentity {
  // For minimal elegant, prefer serif for headings if none specified
  const effectiveHeadingFont = headingFont || "Georgia";
  const effectiveBodyFont = bodyFont || "Inter";

  return {
    name: "minimal-elegant",
    label: "Minimal Elegant",
    description: "Refined, spacious design with serif typography and subtle details. Think Apple, Medium.",

    colors: {
      primary,
      secondary,
      accent,

      pageBg: "bg-white",
      cardBg: "bg-white",
      cardBgHover: "hover:bg-gray-50/50",
      elevatedBg: "bg-white",
      inverseBg: "bg-neutral-950",
      accentBg: `bg-[${primary.lighter}]`,

      textPrimary: "text-neutral-900",
      textSecondary: "text-neutral-500",
      textTertiary: "text-neutral-400",
      textInverse: "text-white",
      textLink: `text-[${primary.base}]`,
      textLinkHover: `hover:text-[${primary.hover}]`,

      borderLight: "border-neutral-100",
      borderDefault: "border-neutral-200",
      borderStrong: "border-neutral-300",
      borderAccent: `border-[${primary.light}]`,
    },

    typography: {
      headingFont: `font-['${effectiveHeadingFont.replace(/ /g, "_")}']`,
      bodyFont: effectiveBodyFont !== "Inter" ? `font-['${effectiveBodyFont.replace(/ /g, "_")}']` : "",
      monoFont: "font-mono",

      display: "text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.1]",
      h1: "text-4xl sm:text-5xl font-normal tracking-tight leading-[1.15]",
      h2: "text-3xl sm:text-4xl font-normal tracking-tight leading-[1.2]",
      h3: "text-2xl font-normal tracking-tight",
      h4: "text-xl font-normal",
      bodyLg: "text-lg leading-[1.8]",
      body: "text-base leading-[1.8]",
      bodySm: "text-sm leading-[1.7]",
      caption: "text-sm text-neutral-400",
      overline: "text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-400",

      headingMaxW: "max-w-2xl",
      bodyMaxW: "max-w-lg",
    },

    spacing: {
      sectionSm: "py-16 sm:py-20",
      sectionMd: "py-20 sm:py-28",
      sectionLg: "py-28 sm:py-40",

      container: "max-w-5xl mx-auto px-6 sm:px-8 lg:px-12",
      containerSm: "max-w-xl mx-auto px-6 sm:px-8",
      containerLg: "max-w-6xl mx-auto px-6 sm:px-8 lg:px-12",

      elementGap: "gap-4",
      groupGap: "gap-8",
      sectionGap: "gap-20 sm:gap-32",

      stackSm: "space-y-3",
      stackMd: "space-y-5",
      stackLg: "space-y-10",
    },

    elevation: {
      none: "",
      sm: "",
      md: "shadow-sm shadow-neutral-100",
      lg: "shadow-md shadow-neutral-200/40",
      xl: "shadow-lg shadow-neutral-200/30",
      glow: "",
      inner: "",
    },

    borders: {
      radius: {
        sm: "rounded",
        md: "rounded",
        lg: "rounded-lg",
        full: "rounded-full",
        button: "rounded",
        input: "rounded",
        card: "rounded-lg",
        badge: "rounded-full",
        avatar: "rounded-full",
        section: "rounded-lg",
      },
      widthThin: "border",
      widthMedium: "border",
    },

    animation: {
      transition: "transition-all duration-300",
      transitionSlow: "transition-all duration-700",
      hoverLift: "",
      hoverScale: "",
      activePress: "",
      focusRing: `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-4`,
    },

    backgrounds: {
      page: "bg-white",
      subtle: "bg-neutral-50",
      accent: `bg-[${primary.lighter}]`,
      inverse: "bg-neutral-950",
      pattern: "",
      mesh: "bg-gradient-to-b from-neutral-50 to-white",
      hero: "bg-white",
      cta: "bg-neutral-950",
    },

    components: {
      button: {
        primary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium tracking-wide",
          "h-11 px-7",
          "rounded",
          `${bg(primary.base)}`,
          "text-white",
          `hover:${bg(primary.hover)}`,
          `focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-4`,
          "transition-colors duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        secondary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium tracking-wide",
          "h-11 px-7",
          "rounded",
          "bg-white border border-neutral-300",
          "text-neutral-700",
          "hover:bg-neutral-50 hover:border-neutral-400",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 focus-visible:ring-offset-4",
          "transition-colors duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        ghost: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-11 px-5",
          "rounded",
          "text-neutral-500",
          "hover:text-neutral-900",
          "transition-colors duration-300",
        ].join(" "),

        link: [
          "inline-flex items-center gap-1",
          "text-sm font-medium",
          "text-neutral-900",
          "border-b border-neutral-900",
          "hover:border-neutral-400",
          "transition-colors duration-300",
        ].join(" "),

        danger: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium tracking-wide",
          "h-11 px-7",
          "rounded",
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "transition-colors duration-300",
        ].join(" "),

        sizes: {
          sm: "h-9 px-4 text-xs",
          md: "h-11 px-7 text-sm",
          lg: "h-13 px-9 text-base",
        },
      },

      input: {
        default: [
          "w-full h-11",
          "px-4",
          "text-sm text-neutral-900 placeholder:text-neutral-400",
          "bg-white border-b border-neutral-200 rounded-none",
          "hover:border-neutral-400",
          `focus:border-[${primary.base}]`,
          "transition-colors duration-300 outline-none",
        ].join(" "),

        error: [
          "w-full h-11",
          "px-4",
          "text-sm text-neutral-900 placeholder:text-neutral-400",
          "bg-white border-b-2 border-red-400 rounded-none",
          "focus:border-red-500",
          "transition-colors duration-300 outline-none",
        ].join(" "),

        search: [
          "w-full h-11",
          "pl-10 pr-4",
          "text-sm text-neutral-900 placeholder:text-neutral-400",
          "bg-neutral-50 border border-neutral-200 rounded-full",
          `focus:bg-white focus:border-[${primary.base}]`,
          "transition-all duration-300 outline-none",
        ].join(" "),

        sizes: {
          sm: "h-9 px-3 text-xs",
          md: "h-11 px-4 text-sm",
          lg: "h-13 px-5 text-base",
        },
      },

      card: {
        elevated: [
          "bg-white rounded-lg",
          "border border-neutral-100",
          "hover:border-neutral-200",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        bordered: [
          "bg-white rounded-lg",
          "border border-neutral-200",
          "hover:border-neutral-300",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        ghost: [
          "bg-neutral-50 rounded-lg",
          "hover:bg-neutral-100",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        interactive: [
          "group bg-white rounded-lg",
          "border border-neutral-100",
          "hover:border-neutral-300",
          "transition-all duration-300",
          "overflow-hidden cursor-pointer",
        ].join(" "),
      },

      badge: {
        default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-neutral-100 text-neutral-600",
        primary: `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${bg(primary.light)} ${text(primary.dark)}`,
        success: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-emerald-50 text-emerald-600",
        warning: "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-amber-50 text-amber-600",
      },

      nav: {
        wrapper: "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-100",
        container: "max-w-5xl mx-auto px-6 sm:px-8 lg:px-12",
        logo: "flex items-center gap-2",
        logoIcon: "",
        link: "text-sm font-normal text-neutral-400 hover:text-neutral-900 transition-colors duration-300",
        linkActive: `text-sm font-normal text-neutral-900`,
        mobileToggle: "p-2 text-neutral-400 hover:text-neutral-600 transition-colors lg:hidden",
      },

      avatar: {
        sm: "w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 text-xs",
        md: "w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 text-sm",
        lg: "w-14 h-14 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 text-lg",
      },

      divider: "border-t border-neutral-100 w-full",
      checkbox: "flex items-center gap-3 cursor-pointer group",

      image: {
        default: "relative overflow-hidden rounded-lg bg-neutral-100 flex items-center justify-center",
        hero: "relative overflow-hidden rounded-lg bg-neutral-100 aspect-[4/3] flex items-center justify-center",
        card: "relative overflow-hidden rounded-t-lg bg-neutral-100 aspect-[4/3] flex items-center justify-center",
      },

      video: "relative overflow-hidden rounded-lg bg-neutral-900 aspect-video flex items-center justify-center",
      chart: "bg-white rounded-lg border border-neutral-200 p-6",
    },

    sections: {
      nav: "sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-neutral-100",
      hero: "py-28 sm:py-40",
      features: "py-20 sm:py-28",
      form: "py-20 sm:py-28",
      content: "py-20 sm:py-28",
      cardGrid: "py-20 sm:py-28",
      cta: "py-20 sm:py-28 bg-neutral-950 text-white",
      footer: "py-12 sm:py-16 border-t border-neutral-100",
      generic: "py-16 sm:py-20",
    },

    page: {
      wrapper: "min-h-screen bg-white antialiased",
      innerWrapper: "flex flex-col min-h-screen",
      mainContent: "flex-1",
      fontImports: [
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap",
        `https://fonts.googleapis.com/css2?family=${encodeURIComponent(effectiveHeadingFont === "Georgia" ? "Playfair+Display" : effectiveHeadingFont)}:wght@400;500;600;700&display=swap`,
      ],
    },

    content: {
      heroHeadings: [
        "Crafted with intention",
        "The art of simplicity",
        "Refined by design",
        "Where form meets function",
      ],
      heroSubtexts: [
        "We believe great design speaks softly. Every detail considered, every element purposeful.",
        "Simplicity is the ultimate sophistication. Experience design at its purest.",
        "Stripped of excess, rich in meaning. Design that stands the test of time.",
      ],
      ctaPrimary: ["Explore", "Discover", "Begin", "Experience"],
      ctaSecondary: ["Learn More", "Our Story", "See Work", "Read Journal"],
      navBrand: "Atelier",
      navLinks: ["Collection", "Journal", "About", "Contact"],
      footerCopy: "© 2025 Atelier",
      footerLinks: ["Privacy", "Terms", "Instagram"],
      featureTitles: ["Thoughtful Design", "Natural Materials", "Timeless Craft", "Sustainable"],
      featureTexts: [
        "Every detail is considered with care and purpose.",
        "Sourced responsibly, finished beautifully.",
        "Made to last, designed to endure.",
        "Committed to practices that respect our planet.",
      ],
      formHeadings: ["Welcome", "Join us", "Get in touch", "Connect"],
      formSubtexts: [
        "Enter your details below.",
        "We'd love to hear from you.",
        "Your inquiry matters to us.",
      ],
    },
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
   PRESET 5: DASHBOARD DENSE
   
   Think: Linear Dashboard, Jira, Vercel Dashboard, GitHub Dashboard
   
   Characteristics:
   - Small, functional corners (rounded-md)
   - Gray scale + single accent
   - Compact spacing (py-4 sections, gap-3)
   - Card-based layout
   - Monospace accents, Inter body
   - Sidebar + topbar layout feel
   - No entrance animations (performance)
   - Gray-100 page background
   - Content: "Analytics overview" / "System status" energy
   ══════════════════════════════════════════════════════════════════════════════ */

function buildDashboardDense(
  primary: ColorPalette,
  secondary: ColorPalette,
  accent: ColorPalette,
  headingFont: string,
  bodyFont: string
): DesignIdentity {
  return {
    name: "dashboard-dense",
    label: "Dashboard Dense",
    description: "Compact, data-rich layout optimized for dashboards and admin panels. Think Linear, Vercel.",

    colors: {
      primary,
      secondary,
      accent,

      pageBg: "bg-gray-100",
      cardBg: "bg-white",
      cardBgHover: "hover:bg-gray-50",
      elevatedBg: "bg-white",
      inverseBg: "bg-gray-900",
      accentBg: `bg-[${primary.lighter}]`,

      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      textTertiary: "text-gray-400",
      textInverse: "text-white",
      textLink: `text-[${primary.base}]`,
      textLinkHover: `hover:text-[${primary.hover}]`,

      borderLight: "border-gray-100",
      borderDefault: "border-gray-200",
      borderStrong: "border-gray-300",
      borderAccent: `border-[${primary.light}]`,
    },

    typography: {
      headingFont: headingFont !== "Inter" ? `font-['${headingFont.replace(/ /g, "_")}']` : "",
      bodyFont: bodyFont !== "Inter" ? `font-['${bodyFont.replace(/ /g, "_")}']` : "",
      monoFont: "font-mono",

      display: "text-3xl font-semibold tracking-tight",
      h1: "text-2xl font-semibold tracking-tight",
      h2: "text-xl font-semibold",
      h3: "text-lg font-medium",
      h4: "text-base font-medium",
      bodyLg: "text-base leading-6",
      body: "text-sm leading-6",
      bodySm: "text-xs leading-5",
      caption: "text-xs text-gray-500",
      overline: "text-[10px] font-semibold uppercase tracking-wider text-gray-400",

      headingMaxW: "",
      bodyMaxW: "",
    },

    spacing: {
      sectionSm: "py-4",
      sectionMd: "py-6",
      sectionLg: "py-8",

      container: "max-w-7xl mx-auto px-4 sm:px-6",
      containerSm: "max-w-3xl mx-auto px-4",
      containerLg: "max-w-full mx-auto px-4 sm:px-6",

      elementGap: "gap-3",
      groupGap: "gap-4",
      sectionGap: "gap-6",

      stackSm: "space-y-1.5",
      stackMd: "space-y-3",
      stackLg: "space-y-4",
    },

    elevation: {
      none: "",
      sm: "shadow-sm",
      md: "shadow-sm shadow-gray-200/50",
      lg: "shadow-md shadow-gray-200/40",
      xl: "shadow-lg shadow-gray-200/30",
      glow: `shadow-sm shadow-[${primary.glow}]`,
      inner: "shadow-inner",
    },

    borders: {
      radius: {
        sm: "rounded",
        md: "rounded-md",
        lg: "rounded-lg",
        full: "rounded-full",
        button: "rounded-md",
        input: "rounded-md",
        card: "rounded-lg",
        badge: "rounded-md",
        avatar: "rounded-full",
        section: "rounded-lg",
      },
      widthThin: "border",
      widthMedium: "border",
    },

    animation: {
      transition: "transition-colors duration-100",
      transitionSlow: "transition-all duration-200",
      hoverLift: "",
      hoverScale: "",
      activePress: "active:bg-gray-200",
      focusRing: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-1`,
    },

    backgrounds: {
      page: "bg-gray-100",
      subtle: "bg-gray-50",
      accent: `bg-[${primary.lighter}]`,
      inverse: "bg-gray-900",
      pattern: "",
      mesh: "",
      hero: "bg-white",
      cta: `bg-[${primary.base}]`,
    },

    components: {
      button: {
        primary: [
          "inline-flex items-center justify-center gap-1.5",
          "whitespace-nowrap text-sm font-medium",
          "h-8 px-3",
          "rounded-md",
          `${bg(primary.base)}`,
          "text-white",
          `hover:${bg(primary.hover)}`,
          `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}] focus-visible:ring-offset-1`,
          "transition-colors duration-100",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        secondary: [
          "inline-flex items-center justify-center gap-1.5",
          "whitespace-nowrap text-sm font-medium",
          "h-8 px-3",
          "rounded-md",
          "bg-white border border-gray-300",
          "text-gray-700",
          "shadow-sm",
          "hover:bg-gray-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1",
          "transition-colors duration-100",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        ghost: [
          "inline-flex items-center justify-center gap-1.5",
          "whitespace-nowrap text-sm font-medium",
          "h-8 px-2.5",
          "rounded-md",
          "text-gray-600",
          "hover:text-gray-900 hover:bg-gray-100",
          "transition-colors duration-100",
        ].join(" "),

        link: [
          "inline-flex items-center gap-1",
          "text-sm font-medium",
          `text-[${primary.base}]`,
          `hover:text-[${primary.hover}]`,
          "hover:underline underline-offset-4",
          "transition-colors duration-100",
        ].join(" "),

        danger: [
          "inline-flex items-center justify-center gap-1.5",
          "whitespace-nowrap text-sm font-medium",
          "h-8 px-3",
          "rounded-md",
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "transition-colors duration-100",
        ].join(" "),

        sizes: {
          sm: "h-7 px-2 text-xs rounded",
          md: "h-8 px-3 text-sm rounded-md",
          lg: "h-9 px-4 text-sm rounded-md",
        },
      },

      input: {
        default: [
          "w-full h-8",
          "px-3",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white border border-gray-300 rounded-md",
          "hover:border-gray-400",
          `focus:border-[${primary.base}] focus:ring-2 focus:ring-[${primary.ring}]`,
          "transition-colors duration-100 outline-none",
          "disabled:bg-gray-100 disabled:text-gray-400",
        ].join(" "),

        error: [
          "w-full h-8",
          "px-3",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-white border border-red-300 rounded-md",
          "focus:border-red-500 focus:ring-2 focus:ring-red-500/10",
          "transition-colors duration-100 outline-none",
        ].join(" "),

        search: [
          "w-full h-8",
          "pl-8 pr-3",
          "text-sm text-gray-900 placeholder:text-gray-400",
          "bg-gray-50 border border-gray-200 rounded-md",
          `focus:bg-white focus:border-[${primary.base}] focus:ring-2 focus:ring-[${primary.ring}]`,
          "transition-colors duration-100 outline-none",
        ].join(" "),

        sizes: {
          sm: "h-7 px-2 text-xs",
          md: "h-8 px-3 text-sm",
          lg: "h-9 px-3.5 text-sm",
        },
      },

      card: {
        elevated: [
          "bg-white rounded-lg",
          "border border-gray-200",
          "shadow-sm",
          "overflow-hidden",
        ].join(" "),

        bordered: [
          "bg-white rounded-lg",
          "border border-gray-200",
          "overflow-hidden",
        ].join(" "),

        ghost: [
          "bg-gray-50 rounded-lg",
          "overflow-hidden",
        ].join(" "),

        interactive: [
          "bg-white rounded-lg",
          "border border-gray-200",
          "shadow-sm",
          "hover:bg-gray-50",
          "transition-colors duration-100",
          "overflow-hidden cursor-pointer",
        ].join(" "),
      },

      badge: {
        default: "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-600",
        primary: `inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium ${bg(primary.light)} ${text(primary.dark)}`,
        success: "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700",
        warning: "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700",
      },

      nav: {
        wrapper: "sticky top-0 z-50 w-full bg-white border-b border-gray-200",
        container: "max-w-7xl mx-auto px-4 sm:px-6",
        logo: "flex items-center gap-2 font-semibold text-gray-900 text-sm",
        logoIcon: `w-6 h-6 rounded ${bg(primary.base)} flex items-center justify-center`,
        link: "text-sm text-gray-500 hover:text-gray-900 transition-colors",
        linkActive: `text-sm font-medium text-[${primary.base}]`,
        mobileToggle: "p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden",
      },

      avatar: {
        sm: `w-6 h-6 rounded-full ${bg(primary.base)} flex items-center justify-center text-white text-[10px] font-semibold`,
        md: `w-8 h-8 rounded-full ${bg(primary.base)} flex items-center justify-center text-white text-xs font-semibold`,
        lg: `w-10 h-10 rounded-full ${bg(primary.base)} flex items-center justify-center text-white text-sm font-semibold`,
      },

      divider: "border-t border-gray-200 w-full",
      checkbox: "flex items-center gap-2 cursor-pointer text-sm",

      image: {
        default: "relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center",
        hero: "relative overflow-hidden rounded-lg bg-gray-100 border border-gray-200 aspect-video flex items-center justify-center",
        card: "relative overflow-hidden rounded-t-lg bg-gray-100 aspect-video flex items-center justify-center",
      },

      video: "relative overflow-hidden rounded-lg bg-gray-900 aspect-video flex items-center justify-center",
      chart: "bg-white rounded-lg border border-gray-200 p-4",
    },

    sections: {
      nav: "sticky top-0 z-50 w-full bg-white border-b border-gray-200",
      hero: "py-6",
      features: "py-4",
      form: "py-6",
      content: "py-4",
      cardGrid: "py-4",
      cta: `py-6 ${bg(primary.base)} text-white`,
      footer: "py-4 border-t border-gray-200 text-gray-500",
      generic: "py-4",
    },

    page: {
      wrapper: "min-h-screen bg-gray-100 antialiased",
      innerWrapper: "flex flex-col min-h-screen",
      mainContent: "flex-1",
      fontImports: [
        "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      ],
    },

    content: {
      heroHeadings: [
        "Dashboard Overview",
        "Analytics",
        "System Status",
        "Project Summary",
      ],
      heroSubtexts: [
        "Monitor your key metrics and performance indicators in real-time.",
        "Track, analyze, and optimize your workflow.",
        "Everything you need at a glance.",
      ],
      ctaPrimary: ["Create New", "Add Item", "Deploy", "Export"],
      ctaSecondary: ["View All", "Settings", "Filter", "Import"],
      navBrand: "Dashboard",
      navLinks: ["Overview", "Analytics", "Settings", "Docs"],
      footerCopy: "© 2025 Dashboard v2.1.0",
      footerLinks: ["Docs", "API", "Status", "Changelog"],
      featureTitles: ["Total Revenue", "Active Users", "Conversion Rate", "Response Time"],
      featureTexts: [
        "$2.4M this quarter, up 12% from last quarter.",
        "14,528 active users in the last 30 days.",
        "3.2% conversion rate, above industry average.",
        "45ms average response time across all endpoints.",
      ],
      formHeadings: ["Sign in", "Create resource", "Configure", "New project"],
      formSubtexts: [
        "Access your dashboard.",
        "Set up a new resource in your workspace.",
        "Adjust your project settings.",
      ],
    },
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
   PRESET 6: GLASS & GRADIENT
   
   Think: Apple Vision Pro, Raycast, Arc Browser
   
   Characteristics:
   - Large corners (rounded-2xl)
   - Gradient backgrounds everywhere
   - Semi-transparent cards (bg-white/10)
   - Backdrop-blur on everything
   - Glow shadows
   - Dark base with light overlays
   - Smooth, elegant transitions
   - Dark gradient page background
   - Content: "Experience the future" / "Beyond boundaries" energy
   ══════════════════════════════════════════════════════════════════════════════ */

function buildGlassGradient(
  primary: ColorPalette,
  secondary: ColorPalette,
  accent: ColorPalette,
  headingFont: string,
  bodyFont: string
): DesignIdentity {
  return {
    name: "glass-gradient",
    label: "Glass & Gradient",
    description: "Futuristic glass morphism with gradients and glow effects. Think Apple Vision Pro, Raycast.",

    colors: {
      primary,
      secondary,
      accent,

      pageBg: "bg-gray-950",
      cardBg: "bg-white/[0.08]",
      cardBgHover: "hover:bg-white/[0.12]",
      elevatedBg: "bg-white/[0.1]",
      inverseBg: "bg-white",
      accentBg: `bg-gradient-to-br from-[${primary.base}]/20 to-[${accent.base}]/20`,

      textPrimary: "text-white",
      textSecondary: "text-gray-300",
      textTertiary: "text-gray-500",
      textInverse: "text-gray-900",
      textLink: `text-[${primary.light}]`,
      textLinkHover: `hover:text-[${primary.lighter}]`,

      borderLight: "border-white/[0.06]",
      borderDefault: "border-white/[0.1]",
      borderStrong: "border-white/[0.15]",
      borderAccent: `border-[${primary.base}]/30`,
    },

    typography: {
      headingFont: headingFont !== "Inter" ? `font-['${headingFont.replace(/ /g, "_")}']` : "",
      bodyFont: bodyFont !== "Inter" ? `font-['${bodyFont.replace(/ /g, "_")}']` : "",
      monoFont: "font-mono",

      display: "text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08]",
      h1: "text-4xl sm:text-5xl font-bold tracking-tight leading-[1.12]",
      h2: "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight",
      h3: "text-xl sm:text-2xl font-semibold",
      h4: "text-lg font-medium",
      bodyLg: "text-lg leading-relaxed",
      body: "text-base leading-relaxed",
      bodySm: "text-sm leading-relaxed",
      caption: "text-sm text-gray-400",
      overline: "text-xs font-semibold uppercase tracking-widest text-gray-500",

      headingMaxW: "max-w-3xl",
      bodyMaxW: "max-w-2xl",
    },

    spacing: {
      sectionSm: "py-12 sm:py-16",
      sectionMd: "py-16 sm:py-24",
      sectionLg: "py-24 sm:py-32",

      container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
      containerSm: "max-w-2xl mx-auto px-4 sm:px-6",
      containerLg: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",

      elementGap: "gap-4",
      groupGap: "gap-6",
      sectionGap: "gap-16 sm:gap-24",

      stackSm: "space-y-2",
      stackMd: "space-y-4",
      stackLg: "space-y-8",
    },

    elevation: {
      none: "",
      sm: "shadow-sm shadow-black/20",
      md: "shadow-md shadow-black/30",
      lg: "shadow-lg shadow-black/30",
      xl: "shadow-2xl shadow-black/40",
      glow: `shadow-lg shadow-[${primary.glow}]`,
      inner: "shadow-inner shadow-black/20",
    },

    borders: {
      radius: {
        sm: "rounded-lg",
        md: "rounded-xl",
        lg: "rounded-2xl",
        full: "rounded-full",
        button: "rounded-xl",
        input: "rounded-xl",
        card: "rounded-2xl",
        badge: "rounded-full",
        avatar: "rounded-full",
        section: "rounded-3xl",
      },
      widthThin: "border",
      widthMedium: "border",
    },

    animation: {
      transition: "transition-all duration-300",
      transitionSlow: "transition-all duration-500",
      hoverLift: "hover:-translate-y-1",
      hoverScale: "hover:scale-[1.02]",
      activePress: "active:scale-[0.98]",
      focusRing: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950`,
    },

    backgrounds: {
      page: "bg-gray-950",
      subtle: "bg-white/[0.03]",
      accent: `bg-gradient-to-br from-[${primary.base}]/10 to-[${accent.base}]/10`,
      inverse: "bg-white",
      pattern: "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:24px_24px]",
      mesh: `bg-gradient-to-br from-[${primary.dark}]/30 via-gray-950 to-[${accent.dark}]/30`,
      hero: `bg-gradient-to-b from-[${primary.dark}]/20 via-gray-950 to-gray-950`,
      cta: `bg-gradient-to-br from-[${primary.base}]/20 to-[${accent.base}]/20 backdrop-blur-xl`,
    },

    components: {
      button: {
        primary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-6",
          "rounded-xl",
          `bg-gradient-to-b from-[${primary.base}] to-[${primary.hover}]`,
          "text-white",
          `shadow-lg shadow-[${primary.glow}]`,
          `hover:shadow-xl hover:shadow-[${primary.glow}]`,
          "hover:-translate-y-0.5",
          "active:translate-y-0",
          `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[${primary.base}]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950`,
          "transition-all duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        secondary: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-6",
          "rounded-xl",
          "bg-white/[0.08] backdrop-blur-sm border border-white/[0.1]",
          "text-white",
          "hover:bg-white/[0.15] hover:border-white/[0.2]",
          "hover:-translate-y-0.5",
          "active:translate-y-0",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:pointer-events-none",
        ].join(" "),

        ghost: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-4",
          "rounded-xl",
          "text-gray-300",
          "hover:text-white hover:bg-white/[0.08]",
          "transition-all duration-300",
        ].join(" "),

        link: [
          "inline-flex items-center gap-1",
          "text-sm font-medium",
          `text-[${primary.light}]`,
          `hover:text-[${primary.lighter}]`,
          "underline-offset-4 hover:underline",
          "transition-colors duration-300",
        ].join(" "),

        danger: [
          "inline-flex items-center justify-center gap-2",
          "whitespace-nowrap text-sm font-medium",
          "h-10 px-6",
          "rounded-xl",
          "bg-gradient-to-b from-red-500 to-red-600",
          "text-white",
          "shadow-lg shadow-red-500/25",
          "hover:shadow-xl hover:-translate-y-0.5",
          "active:translate-y-0",
          "transition-all duration-300",
        ].join(" "),

        sizes: {
          sm: "h-8 px-3 text-xs rounded-lg",
          md: "h-10 px-6 text-sm rounded-xl",
          lg: "h-12 px-8 text-base rounded-xl",
        },
      },

      input: {
        default: [
          "w-full h-11",
          "px-4",
          "text-sm text-white placeholder:text-gray-500",
          "bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-xl",
          "hover:border-white/[0.2]",
          `focus:border-[${primary.base}]/50 focus:ring-4 focus:ring-[${primary.base}]/10`,
          "transition-all duration-300 outline-none",
          "disabled:opacity-50",
        ].join(" "),

        error: [
          "w-full h-11",
          "px-4",
          "text-sm text-white placeholder:text-gray-500",
          "bg-white/[0.06] backdrop-blur-sm border border-red-400/30 rounded-xl",
          "focus:border-red-400/50 focus:ring-4 focus:ring-red-400/10",
          "transition-all duration-300 outline-none",
        ].join(" "),

        search: [
          "w-full h-11",
          "pl-10 pr-4",
          "text-sm text-white placeholder:text-gray-500",
          "bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-full",
          `focus:border-[${primary.base}]/50 focus:ring-4 focus:ring-[${primary.base}]/10`,
          "transition-all duration-300 outline-none",
        ].join(" "),

        sizes: {
          sm: "h-9 px-3 text-xs",
          md: "h-11 px-4 text-sm",
          lg: "h-13 px-5 text-base",
        },
      },

      card: {
        elevated: [
          "bg-white/[0.06] backdrop-blur-xl rounded-2xl",
          "border border-white/[0.08]",
          "hover:bg-white/[0.1] hover:border-white/[0.12]",
          "hover:-translate-y-1",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        bordered: [
          "bg-white/[0.04] backdrop-blur-sm rounded-2xl",
          "border border-white/[0.08]",
          "hover:border-white/[0.15]",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        ghost: [
          "bg-white/[0.03] rounded-2xl",
          "hover:bg-white/[0.06]",
          "transition-all duration-300",
          "overflow-hidden",
        ].join(" "),

        interactive: [
          "group bg-white/[0.06] backdrop-blur-xl rounded-2xl",
          "border border-white/[0.08]",
          "hover:bg-white/[0.1] hover:border-white/[0.15]",
          "hover:-translate-y-1",
          "transition-all duration-300",
          "overflow-hidden cursor-pointer",
        ].join(" "),
      },

      badge: {
        default: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.1] text-gray-300 border border-white/[0.06]",
        primary: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[${primary.base}]/20 text-[${primary.light}] border border-[${primary.base}]/20`,
        success: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-400/20 text-emerald-300 border border-emerald-400/10",
        warning: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-400/20 text-amber-300 border border-amber-400/10",
      },

      nav: {
        wrapper: "sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06]",
        container: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
        logo: "flex items-center gap-2.5 group",
        logoIcon: `w-8 h-8 rounded-lg bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center shadow-lg shadow-[${primary.glow}]`,
        link: "text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300",
        linkActive: `text-sm font-medium text-white`,
        mobileToggle: "p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.08] transition-all lg:hidden",
      },

      avatar: {
        sm: `w-8 h-8 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10`,
        md: `w-10 h-10 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center text-white text-sm font-bold ring-2 ring-white/10`,
        lg: `w-14 h-14 rounded-full bg-gradient-to-br from-[${primary.base}] to-[${accent.base}] flex items-center justify-center text-white text-lg font-bold ring-2 ring-white/10`,
      },

      divider: "border-t border-white/[0.06] w-full",
      checkbox: "flex items-center gap-3 cursor-pointer group",

      image: {
        default: [
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
          "border border-white/[0.08]",
          "flex items-center justify-center",
        ].join(" "),

        hero: [
          "relative overflow-hidden rounded-2xl",
          "bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
          "border border-white/[0.08]",
          "aspect-video",
          "flex items-center justify-center",
          `shadow-2xl shadow-[${primary.glow}]`,
        ].join(" "),

        card: [
          "relative overflow-hidden rounded-t-2xl",
          "bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
          "aspect-video",
          "flex items-center justify-center",
        ].join(" "),
      },

      video: [
        "relative overflow-hidden rounded-2xl",
        "bg-black/50 backdrop-blur-sm",
        "border border-white/[0.08]",
        "aspect-video",
        "flex items-center justify-center",
        "shadow-2xl shadow-black/40",
      ].join(" "),

      chart: [
        "bg-white/[0.06] backdrop-blur-sm rounded-2xl",
        "border border-white/[0.08]",
        "p-6",
      ].join(" "),
    },

    sections: {
      nav: "sticky top-0 z-50 w-full bg-gray-950/80 backdrop-blur-xl border-b border-white/[0.06]",
      hero: "py-24 sm:py-32",
      features: "py-16 sm:py-24",
      form: "py-16 sm:py-24",
      content: "py-16 sm:py-24",
      cardGrid: "py-16 sm:py-24",
      cta: `py-16 sm:py-24 bg-gradient-to-br from-[${primary.base}]/10 to-[${accent.base}]/10 backdrop-blur-xl border-y border-white/[0.06]`,
      footer: "py-12 sm:py-16 border-t border-white/[0.06]",
      generic: "py-12 sm:py-16",
    },

    page: {
      wrapper: `min-h-screen bg-gray-950 antialiased text-white`,
      innerWrapper: "flex flex-col min-h-screen",
      mainContent: "flex-1",
      fontImports: [
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
        ...(headingFont !== "Inter" && headingFont !== ""
          ? [`https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@400;500;600;700;800&display=swap`]
          : []),
      ],
    },

    content: {
      heroHeadings: [
        "Beyond boundaries",
        "The future is here",
        "Experience tomorrow",
        "Redefine what's possible",
      ],
      heroSubtexts: [
        "Step into a new dimension of digital experiences. Built for the next generation.",
        "Where cutting-edge technology meets beautiful design.",
        "Immersive, intelligent, and impossibly fast.",
      ],
      ctaPrimary: ["Get Early Access", "Join Waitlist", "Explore", "Start Now"],
      ctaSecondary: ["Watch Video", "See Demo", "Learn More", "View Docs"],
      navBrand: "Nova",
      navLinks: ["Product", "Features", "Pricing", "Blog"],
      footerCopy: "© 2025 Nova Labs. All rights reserved.",
      footerLinks: ["Privacy", "Terms", "Discord", "Twitter"],
      featureTitles: ["AI Powered", "Real-time Sync", "Edge Computing", "Zero Latency"],
      featureTexts: [
        "Intelligent automation that learns and adapts to your workflow.",
        "Instant synchronization across all your devices and platforms.",
        "Processing at the edge for blazing-fast response times.",
        "Sub-millisecond operations for a truly seamless experience.",
      ],
      formHeadings: ["Welcome back", "Join the future", "Connect", "Get access"],
      formSubtexts: [
        "Sign in to continue your journey.",
        "Be among the first to experience what's next.",
        "We'd love to hear from you.",
      ],
    },
  };
}


/* ══════════════════════════════════════════════════════════════════════════════
   PRESET REGISTRY
   ══════════════════════════════════════════════════════════════════════════════ */

const PRESET_BUILDERS: Record<
  PresetName,
  (
    primary: ColorPalette,
    secondary: ColorPalette,
    accent: ColorPalette,
    headingFont: string,
    bodyFont: string
  ) => DesignIdentity
> = {
  "startup-modern": buildStartupModern,
  "corporate-clean": buildCorporateClean,
  "bold-creative": buildBoldCreative,
  "minimal-elegant": buildMinimalElegant,
  "dashboard-dense": buildDashboardDense,
  "glass-gradient": buildGlassGradient,
};


/* ══════════════════════════════════════════════════════════════════════════════
   PUBLIC API
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * Get list of available presets for the style guide UI.
 */
export function getPresetList(): {
  name: PresetName;
  label: string;
  description: string;
}[] {
  return [
    {
      name: "startup-modern",
      label: "Startup Modern",
      description: "Clean, modern SaaS look with gradients and glass effects",
    },
    {
      name: "corporate-clean",
      label: "Corporate Clean",
      description: "Professional, structured look with clean lines",
    },
    {
      name: "bold-creative",
      label: "Bold & Creative",
      description: "Vibrant, expressive design with strong colors",
    },
    {
      name: "minimal-elegant",
      label: "Minimal Elegant",
      description: "Refined, spacious design with serif typography",
    },
    {
      name: "dashboard-dense",
      label: "Dashboard Dense",
      description: "Compact, data-rich layout for admin panels",
    },
    {
      name: "glass-gradient",
      label: "Glass & Gradient",
      description: "Futuristic glass morphism with glow effects",
    },
  ];
}

/**
 * Auto-detect the best preset based on the user's style guide.
 * Used as fallback when user hasn't explicitly chosen a preset.
 */
export function detectPresetFromStyleGuide(
  guide: StyleGuide | null
): PresetName {
  if (!guide) return "startup-modern";

  // Check typography for serif fonts (→ minimal elegant)
  if (guide.typography?.length) {
    const firstFont =
      guide.typography[0]?.styles?.[0]?.fontFamily?.toLowerCase() ?? "";
    const serifFonts = [
      "georgia",
      "playfair",
      "merriweather",
      "lora",
      "crimson",
      "garamond",
      "baskerville",
      "times",
      "serif",
      "cormorant",
      "dm serif",
    ];
    if (serifFonts.some((s) => firstFont.includes(s))) {
      return "minimal-elegant";
    }
  }

  // Check primary color temperature
  if (guide.colors?.primary?.length) {
    const hex = guide.colors.primary[0].hexColor;
    if (hex) {
      // Import would be circular, so inline a simple check
      const r = parseInt(hex.slice(1, 3), 16) || 0;
      const g = parseInt(hex.slice(3, 5), 16) || 0;
      const b = parseInt(hex.slice(5, 7), 16) || 0;
      const luminance = (r * 299 + g * 587 + b * 114) / 1000;


      // Very dark primary → might want glass-gradient
      if (luminance < 50) {
        return "glass-gradient";
      }

      // Very saturated warm colors → bold creative
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max === 0 ? 0 : (max - min) / max;
      
      if (saturation > 0.7 && (r > g || r > b)) {
        return "bold-creative";
      }
    }
  }

  // Default
  return "startup-modern";
}


/* ══════════════════════════════════════════════════════════════════════════════
   MAIN FUNCTION: Build Design Identity from Style Guide
   
   This is THE function the pipeline calls.
   
   1. Determine which preset to use (explicit or auto-detected)
   2. Extract user's colors from style guide (or use defaults)
   3. Extract user's fonts from style guide (or use defaults)
   4. Generate full color palettes from user's hex colors
   5. Build the preset with user's colors/fonts overlaid
   6. Return complete DesignIdentity
   
   The result is a COMPLETE design system customized to the user's
   brand but with professional-grade aesthetic defaults.
   ══════════════════════════════════════════════════════════════════════════════ */
export function buildDesignIdentity(
  styleGuide: StyleGuide | null,
  presetName?: PresetName
): DesignIdentity {
  // ─── Step 1: Determine preset ───
  const resolvedPreset: PresetName =
    presetName ||
    (styleGuide as Record<string, unknown> | null)?.preset as PresetName ||
    detectPresetFromStyleGuide(styleGuide);

  // ─── Step 2: Extract user colors (or defaults) ───
  const primaryHex = getHex(styleGuide?.colors?.primary, DEFAULT_COLORS.primary);
  const secondaryHex = getHex(
    styleGuide?.colors?.secondary,
    DEFAULT_COLORS.secondary
  );
  const accentHex = getHex(styleGuide?.colors?.accent, DEFAULT_COLORS.accent);

  // ─── Step 3: Generate full palettes ───
  const primaryPalette = generatePalette(primaryHex);
  const secondaryPalette = generatePalette(secondaryHex);
  const accentPalette = generatePalette(accentHex);

  // ─── Step 4: Extract user fonts (or defaults) ───
  let headingFont = "Inter";
  let bodyFont = "Inter";

  if (styleGuide?.typography?.length) {
    const firstSection = styleGuide.typography[0];
    if (firstSection?.styles?.length) {
      const rawHeading = firstSection.styles[0]?.fontFamily;
      if (rawHeading) {
        headingFont = rawHeading.split(",")[0].trim().replace(/'/g, "");
      }
      if (firstSection.styles.length > 1) {
        const rawBody = firstSection.styles[1]?.fontFamily;
        if (rawBody) {
          bodyFont = rawBody.split(",")[0].trim().replace(/'/g, "");
        }
      } else {
        bodyFont = headingFont;
      }
    }
  }

  // ─── Step 5: Build identity from preset with user overrides ───
  const builder = PRESET_BUILDERS[resolvedPreset];
  if (!builder) {
    // Fallback to startup-modern if somehow invalid preset
    return PRESET_BUILDERS["startup-modern"](
      primaryPalette,
      secondaryPalette,
      accentPalette,
      headingFont,
      bodyFont
    );
  }

  return builder(
    primaryPalette,
    secondaryPalette,
    accentPalette,
    headingFont,
    bodyFont
  );
}


/* ══════════════════════════════════════════════════════════════════════════════
   HELPER: Extract hex from style guide color swatches
   ══════════════════════════════════════════════════════════════════════════════ */
function getHex(
  swatches: Array<{ hexColor: string }> | undefined,
  fallback: string
): string {
  if (!swatches || swatches.length === 0) return fallback;
  return swatches[0].hexColor || fallback;
}

const DEFAULT_COLORS = {
  primary: "#3b82f6",
  secondary: "#6b7280",
  accent: "#f59e0b",
};