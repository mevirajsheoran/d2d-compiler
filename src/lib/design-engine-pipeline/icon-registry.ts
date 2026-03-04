// src/lib/design-engine-pipeline/icon-registry.ts

/* ══════════════════════════════════════════════════════════
   ICON REGISTRY
   
   40 inline SVG icons for use in generated components.
   
   All icons are:
   - 24x24 viewBox
   - Stroke-based (currentColor)
   - No external dependencies
   - Tailwind-compatible sizing (w-4 h-4, w-5 h-5, etc.)
   
   Based on Lucide icon set paths (MIT licensed).
   ══════════════════════════════════════════════════════════ */

import type { IconName } from "./types";

/* ──────────────────────────────────────────────────────────
   SVG PATH DATA
   Each entry is the inner <path> content for a 24x24 SVG.
   ────────────────────────────────────────────────────────── */
const ICON_PATHS: Record<IconName, string> = {
  // ─── TIER 1: Essential ───
  "arrow-right":
    '<path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  "arrow-left":
    '<path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  menu:
    '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  x:
    '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  check:
    '<path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  "chevron-down":
    '<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  search:
    '<circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  user:
    '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" fill="none"/>',
  mail:
    '<rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M22 7l-10 7L2 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  lock:
    '<rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  eye:
    '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/>',
  plus:
    '<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><path d="M21 15l-5-5L5 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  play:
    '<polygon points="5,3 19,12 5,21" fill="currentColor"/>',

  // ─── TIER 2: Common ───
  phone:
    '<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" stroke-width="2" fill="none"/>',
  "map-pin":
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2" fill="none"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  clock:
    '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  star:
    '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
  heart:
    '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" stroke-width="2" fill="none"/>',
  share:
    '<circle cx="18" cy="5" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="6" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="18" cy="19" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" stroke-width="2"/>',
  download:
    '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  upload:
    '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  settings:
    '<circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" stroke-width="2" fill="none"/>',
  bell:
    '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  home:
    '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 22V12h6v10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  "chart-bar":
    '<path d="M12 20V10M18 20V4M6 20v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  "credit-card":
    '<rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/><path d="M1 10h22" stroke="currentColor" stroke-width="2"/>',
  "shield-check":
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',

  // ─── TIER 3: Specific ───
  github:
    '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  twitter:
    '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  linkedin:
    '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2" fill="none"/>',
  sparkles:
    '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM5 19l.88 2.63L8.5 22.5l-2.62.88L5 26l-.88-2.62L1.5 22.5l2.62-.87L5 19z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  zap:
    '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/>',
  globe:
    '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" stroke-width="2" fill="none"/>',
  code:
    '<path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  palette:
    '<circle cx="13.5" cy="6.5" r="2.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="2.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="2.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="2.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" stroke="currentColor" stroke-width="2" fill="none"/>',
  rocket:
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  "external-link":
    '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};

/* ══════════════════════════════════════════════════════════
   RENDER ICON AS JSX STRING
   ══════════════════════════════════════════════════════════ */

/**
 * Renders an icon as a complete JSX SVG element string.
 * @param name - Icon name from the registry
 * @param className - Additional Tailwind classes (default: "w-4 h-4")
 * @returns JSX string like: <svg className="w-4 h-4" ...>...</svg>
 */
export function renderIcon(
  name: IconName,
  className: string = "w-4 h-4"
): string {
  const path = ICON_PATHS[name];
  if (!path) return "";

  return `<svg className="${className}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">${path}</svg>`;
}

/* ══════════════════════════════════════════════════════════
   ICON INFERENCE — Determine which icon to use based on context
   ══════════════════════════════════════════════════════════ */

/**
 * Infer the best icon for a button based on its text.
 */
export function inferButtonIcon(text: string): IconName | null {
  const t = (text || "").toLowerCase().trim();

  // CTA / navigation buttons
  if (
    t.includes("get started") ||
    t.includes("sign up") ||
    t.includes("start") ||
    t.includes("begin") ||
    t.includes("continue") ||
    t.includes("next") ||
    t.includes("launch") ||
    t.includes("try")
  )
    return "arrow-right";

  // Action buttons
  if (t.includes("download")) return "download";
  if (t.includes("upload")) return "upload";
  if (t.includes("search")) return "search";
  if (t.includes("share")) return "share";
  if (t.includes("send") || t.includes("submit")) return "arrow-right";
  if (t.includes("save")) return "check";
  if (t.includes("delete") || t.includes("remove")) return "x";
  if (t.includes("add") || t.includes("create") || t.includes("new"))
    return "plus";
  if (t.includes("setting")) return "settings";
  if (t.includes("home")) return "home";
  if (t.includes("learn") || t.includes("more") || t.includes("view") || t.includes("see"))
    return "arrow-right";
  if (t.includes("contact") || t.includes("email") || t.includes("mail"))
    return "mail";
  if (t.includes("call") || t.includes("phone")) return "phone";
  if (t.includes("log in") || t.includes("login") || t.includes("sign in"))
    return "arrow-right";
  if (t.includes("external") || t.includes("visit") || t.includes("open"))
    return "external-link";
  if (t.includes("demo")) return "play";

  return null;
}

/**
 * Infer the best icon for an input based on its label/type/context.
 */
export function inferInputIcon(
  label: string,
  inputType?: string,
  positionInForm?: number
): IconName | null {
  const t = (label || "").toLowerCase().trim();
  const type = (inputType || "").toLowerCase();

  // Explicit type matches
  if (type === "email" || t.includes("email") || t.includes("e-mail"))
    return "mail";
  if (type === "password" || t.includes("password") || t.includes("pass"))
    return "lock";
  if (type === "tel" || t.includes("phone") || t.includes("mobile"))
    return "phone";
  if (type === "search" || t.includes("search")) return "search";
  if (type === "url" || t.includes("website") || t.includes("url"))
    return "globe";
  if (t.includes("date") || t.includes("birthday")) return "calendar";
  if (t.includes("time")) return "clock";
  if (t.includes("name") || t.includes("user") || t.includes("full name"))
    return "user";
  if (t.includes("address") || t.includes("location")) return "map-pin";
  if (
    t.includes("card") ||
    t.includes("payment") ||
    t.includes("credit")
  )
    return "credit-card";
  if (t.includes("message") || t.includes("comment") || t.includes("note"))
    return "mail";
  if (t.includes("company") || t.includes("organization")) return "home";

  // Position-based inference (when labels are blank)
  if (positionInForm !== undefined) {
    if (positionInForm === 0) return "mail"; // First input → likely email
    if (positionInForm === 1) return "lock"; // Second → likely password
    if (positionInForm === 2) return "user"; // Third → likely name
  }

  return null;
}

/**
 * Get a set of distinct "feature" icons for feature grid sections.
 * Returns different icons based on count needed.
 */
export function getFeatureIcons(count: number): IconName[] {
  const featurePool: IconName[] = [
    "zap",
    "shield-check",
    "sparkles",
    "rocket",
    "globe",
    "code",
    "chart-bar",
    "heart",
    "star",
    "settings",
    "bell",
    "credit-card",
  ];

  return featurePool.slice(0, Math.min(count, featurePool.length));
}

/**
 * Get social media icons for footer sections.
 */
export function getSocialIcons(): { name: IconName; label: string }[] {
  return [
    { name: "twitter", label: "Twitter" },
    { name: "github", label: "GitHub" },
    { name: "linkedin", label: "LinkedIn" },
  ];
}