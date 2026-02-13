// src/lib/ai-pipeline/color-utils.ts

/* ══════════════════════════════════════════════════════════
   COLOR UTILITIES
   
   Pure math functions for color manipulation.
   Takes a single hex color and generates a complete
   harmonious palette for the design identity.
   
   Zero dependencies. Zero AI. Just math.
   ══════════════════════════════════════════════════════════ */

import type { ColorPalette } from "./types";

/* ──────────────────────────────────────────────────────────
   HEX ↔ RGB ↔ HSL Conversions
   ────────────────────────────────────────────────────────── */

export function hexToRGB(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);

  return [
    isNaN(r) ? 0 : r,
    isNaN(g) ? 0 : g,
    isNaN(b) ? 0 : b,
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    "#" +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const [r, g, b] = hexToRGB(hex).map((v) => v / 255);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / delta + 2) * 60;
        break;
      case b:
        h = ((r - g) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;
  const hNorm = ((h % 360) + 360) % 360;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;

  let r = 0, g = 0, b = 0;

  if (hNorm < 60) { r = c; g = x; b = 0; }
  else if (hNorm < 120) { r = x; g = c; b = 0; }
  else if (hNorm < 180) { r = 0; g = c; b = x; }
  else if (hNorm < 240) { r = 0; g = x; b = c; }
  else if (hNorm < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  return rgbToHex(
    (r + m) * 255,
    (g + m) * 255,
    (b + m) * 255
  );
}

/* ──────────────────────────────────────────────────────────
   COLOR ANALYSIS
   ────────────────────────────────────────────────────────── */

/**
 * Determines if a color is "warm" (reds, oranges, yellows),
 * "cool" (blues, greens, purples), or "neutral" (grays).
 */
export function getColorTemperature(
  hex: string
): "warm" | "cool" | "neutral" {
  const { h, s } = hexToHSL(hex);

  // Very low saturation = neutral (gray)
  if (s < 10) return "neutral";

  // Warm: reds, oranges, yellows (0-60, 330-360)
  if (h <= 60 || h >= 330) return "warm";

  // Cool: greens, blues, purples (120-300)
  if (h >= 120 && h <= 300) return "cool";

  // Edge zones (60-120, 300-330) — lean based on hue
  if (h < 120) return "warm"; // yellow-green leans warm
  return "cool"; // magenta leans cool
}

/**
 * Returns white or black based on which has better
 * contrast against the given color.
 * Uses WCAG relative luminance formula.
 */
export function getContrastColor(hex: string): "#ffffff" | "#000000" {
  const [r, g, b] = hexToRGB(hex);

  // Relative luminance (WCAG 2.0)
  const luminance =
    0.299 * (r / 255) + 0.587 * (g / 255) + 0.114 * (b / 255);

  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/**
 * Checks if a color is very light (good for backgrounds)
 */
export function isLightColor(hex: string): boolean {
  const { l } = hexToHSL(hex);
  return l > 85;
}

/**
 * Checks if a color is very dark
 */
export function isDarkColor(hex: string): boolean {
  const { l } = hexToHSL(hex);
  return l < 20;
}

/* ──────────────────────────────────────────────────────────
   PALETTE GENERATION
   
   Takes ONE hex color and generates a complete palette
   with hover, light, dark, glow, and ring variants.
   
   This is the key function that makes style guide colors
   work throughout the entire design system.
   ────────────────────────────────────────────────────────── */

export function generatePalette(hex: string): ColorPalette {
  const { h, s, l } = hexToHSL(hex);
  const [r, g, b] = hexToRGB(hex);

  return {
    // Original color
    base: hex,

    // Hover: slightly darker
    hover: hslToHex(h, Math.min(s + 5, 100), Math.max(l - 8, 0)),

    // Light: very light tint for backgrounds
    light: hslToHex(h, Math.max(s - 30, 10), 95),

    // Lighter: barely tinted for subtle surfaces
    lighter: hslToHex(h, Math.max(s - 35, 5), 97),

    // Dark: much darker for contrast
    dark: hslToHex(h, Math.min(s + 5, 100), Math.max(l - 20, 5)),

    // Glow: for colored shadows (rgba with 0.25 opacity)
    glow: `rgba(${r},${g},${b},0.25)`,

    // Ring: for focus rings (rgba with 0.1 opacity)
    ring: `rgba(${r},${g},${b},0.1)`,

    // Contrast: white or black text on this color
    contrast: getContrastColor(hex),
  };
}

/* ──────────────────────────────────────────────────────────
   TAILWIND CLASS HELPERS
   
   Convert hex colors to Tailwind arbitrary value classes.
   ────────────────────────────────────────────────────────── */

/** Generate bg-[#hex] class */
export function bg(hex: string): string {
  return `bg-[${hex}]`;
}

/** Generate text-[#hex] class */
export function text(hex: string): string {
  return `text-[${hex}]`;
}

/** Generate border-[#hex] class */
export function border(hex: string): string {
  return `border-[${hex}]`;
}

/** Generate shadow with colored glow */
export function shadowGlow(rgba: string): string {
  return `shadow-[0_8px_30px_${rgba.replace(/,/g, "_")}]`;
}

/** Generate ring color */
export function ring(hex: string): string {
  return `ring-[${hex}]`;
}

/** Generate gradient from two colors */
export function gradient(from: string, to: string): string {
  return `bg-gradient-to-br from-[${from}] to-[${to}]`;
}

/** Generate gradient for buttons (top to bottom, subtle) */
export function buttonGradient(light: string, dark: string): string {
  return `bg-gradient-to-b from-[${light}] to-[${dark}]`;
}

/* ──────────────────────────────────────────────────────────
   GENERATE SECONDARY COLOR (if user didn't provide one)
   
   Creates a complementary or analogous color based on
   the primary color.
   ────────────────────────────────────────────────────────── */

export function generateSecondaryFromPrimary(primaryHex: string): string {
  const { h, s, l } = hexToHSL(primaryHex);

  // Desaturated, slightly shifted version of primary
  return hslToHex(
    (h + 30) % 360,
    Math.max(s - 40, 10),
    Math.min(l + 10, 60)
  );
}

export function generateAccentFromPrimary(primaryHex: string): string {
  const { h, s } = hexToHSL(primaryHex);

  // Complementary-ish hue, warm tint
  return hslToHex(
    (h + 150) % 360,
    Math.min(s + 10, 90),
    55
  );
}