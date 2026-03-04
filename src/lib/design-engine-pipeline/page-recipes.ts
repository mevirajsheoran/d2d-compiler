// src/lib/design-engine-pipeline/page-recipes.ts

/* ══════════════════════════════════════════════════════════════════════════════
   PAGE RECIPES — v5.0

   Defines what sections a specific page type should have, in what order,
   with what background, and whether the wireframe can override each section.

   This is the "knowledge" layer — it knows that a restaurant landing page
   needs a hero, features, stats, testimonial, CTA, newsletter, and footer.
   The wireframe then customizes specific sections while the recipe fills gaps.

   Pure data. No rendering logic. No imports from builder/component-library.
   ══════════════════════════════════════════════════════════════════════════════ */

import type { SectionRecipe, RecipeSectionType } from "./types";

// ═══════════════════════════════════════════════════════════
// LANDING PAGE — BASE RECIPE
// ═══════════════════════════════════════════════════════════

const LANDING_PAGE_BASE: SectionRecipe[] = [
  { type: "nav",          order: 0,  overridable: true,  config: {}, bg: "page" },
  { type: "hero-split",   order: 1,  overridable: true,  config: {}, bg: "hero" },
  { type: "logo-cloud",   order: 2,  overridable: false, config: {}, bg: "page" },
  { type: "features",     order: 3,  overridable: true,  config: { columns: 3 }, bg: "subtle" },
  { type: "stats",        order: 4,  overridable: true,  config: {}, bg: "page" },
  { type: "testimonial",  order: 5,  overridable: false, config: {}, bg: "subtle" },
  { type: "cta",          order: 7,  overridable: true,  config: {}, bg: "cta" },
  { type: "newsletter",   order: 8,  overridable: false, config: {}, bg: "page" },
  { type: "footer",       order: 99, overridable: true,  config: {}, bg: "inverse" },
];

// ═══════════════════════════════════════════════════════════
// INDUSTRY OVERRIDES FOR LANDING PAGES
// ═══════════════════════════════════════════════════════════

const INDUSTRY_LANDING_OVERRIDES: Record<string, Partial<SectionRecipe>[]> = {
  restaurant: [
    { type: "hero-split", order: 1, config: { variant: "restaurant" } },
    { type: "features", order: 3, config: { columns: 3, variant: "menu-highlights" } },
  ],

  tech: [
    // Tech uses base as-is — it's already designed for tech
  ],

  medical: [
    { type: "trust-badges" as RecipeSectionType, order: 2.5, overridable: false, config: {}, bg: "page" as const },
    { type: "features", order: 3, config: { columns: 3, variant: "services" } },
  ],

  ecommerce: [
    { type: "hero-split", order: 1, config: { variant: "product-showcase" } },
    { type: "features", order: 3, config: { columns: 4, variant: "categories" } },
  ],

  education: [
    { type: "features", order: 3, config: { columns: 3, variant: "courses" } },
  ],

  finance: [
    { type: "trust-badges" as RecipeSectionType, order: 2.5, overridable: false, config: {}, bg: "page" as const },
  ],

  agency: [
    { type: "hero-split", order: 1, config: { variant: "portfolio-showcase" } },
    { type: "features", order: 3, config: { columns: 3, variant: "services" } },
  ],

  fitness: [
    { type: "features", order: 3, config: { columns: 3, variant: "programs" } },
  ],

  realestate: [
    { type: "hero-split", order: 1, config: { variant: "property-search" } },
    { type: "features", order: 3, config: { columns: 3, variant: "listings" } },
  ],

  travel: [
    { type: "hero-split", order: 1, config: { variant: "destination" } },
    { type: "features", order: 3, config: { columns: 4, variant: "destinations" } },
  ],
};

// ═══════════════════════════════════════════════════════════
// OTHER PAGE TYPE RECIPES
// ═══════════════════════════════════════════════════════════

const SAAS_RECIPE: SectionRecipe[] = [
  { type: "nav",              order: 0,  overridable: true,  config: {}, bg: "page" },
  { type: "hero-split",       order: 1,  overridable: true,  config: { variant: "product-demo" }, bg: "hero" },
  { type: "logo-cloud",       order: 2,  overridable: false, config: {}, bg: "page" },
  { type: "features",         order: 3,  overridable: true,  config: { columns: 3 }, bg: "subtle" },
  { type: "stats",            order: 4,  overridable: true,  config: {}, bg: "page" },
  { type: "testimonial",      order: 5,  overridable: false, config: {}, bg: "subtle" },
  { type: "pricing-cards",    order: 6,  overridable: true,  config: { tiers: 3 }, bg: "page" },
  { type: "faq",              order: 7,  overridable: false, config: {}, bg: "subtle" },
  { type: "cta",              order: 8,  overridable: true,  config: {}, bg: "cta" },
  { type: "footer",           order: 99, overridable: true,  config: {}, bg: "inverse" },
];

const PRICING_RECIPE: SectionRecipe[] = [
  { type: "nav",                order: 0,  overridable: true,  config: {}, bg: "page" },
  { type: "hero-centered",      order: 1,  overridable: true,  config: { variant: "pricing" }, bg: "hero" },
  { type: "pricing-cards",      order: 2,  overridable: true,  config: { tiers: 3 }, bg: "page" },
  { type: "features-comparison" as RecipeSectionType, order: 3, overridable: false, config: {}, bg: "subtle" },
  { type: "faq",                order: 4,  overridable: false, config: {}, bg: "page" },
  { type: "cta",                order: 5,  overridable: true,  config: {}, bg: "cta" },
  { type: "footer",             order: 99, overridable: true,  config: {}, bg: "inverse" },
];

const BLOG_RECIPE: SectionRecipe[] = [
  { type: "nav",          order: 0,  overridable: true,  config: {}, bg: "page" },
  { type: "hero-centered",order: 1,  overridable: true,  config: { variant: "blog" }, bg: "hero" },
  { type: "features",     order: 2,  overridable: true,  config: { columns: 3, variant: "blog-posts" }, bg: "page" },
  { type: "newsletter",   order: 3,  overridable: false, config: {}, bg: "subtle" },
  { type: "footer",       order: 99, overridable: true,  config: {}, bg: "inverse" },
];

const PORTFOLIO_RECIPE: SectionRecipe[] = [
  { type: "nav",           order: 0,  overridable: true,  config: {}, bg: "page" },
  { type: "hero-centered", order: 1,  overridable: true,  config: { variant: "personal" }, bg: "hero" },
  { type: "features",      order: 2,  overridable: true,  config: { columns: 3, variant: "projects" }, bg: "page" },
  { type: "stats",         order: 3,  overridable: true,  config: {}, bg: "subtle" },
  { type: "testimonial",   order: 4,  overridable: false, config: {}, bg: "page" },
  { type: "cta",           order: 5,  overridable: true,  config: { variant: "contact" }, bg: "cta" },
  { type: "footer",        order: 99, overridable: true,  config: {}, bg: "inverse" },
];

const DASHBOARD_RECIPE: SectionRecipe[] = [
  { type: "nav",               order: 0,  overridable: true,  config: { variant: "dashboard" }, bg: "page" },
  { type: "stats",             order: 1,  overridable: true,  config: { variant: "metrics" }, bg: "page" },
  { type: "features",          order: 2,  overridable: true,  config: { columns: 2, variant: "dashboard-cards" }, bg: "subtle" },
  { type: "footer",            order: 99, overridable: true,  config: {}, bg: "inverse" },
];

const LOGIN_RECIPE: SectionRecipe[] = [
  { type: "auth-card", order: 0, overridable: true, config: { variant: "login" }, bg: "subtle" },
];

const SIGNUP_RECIPE: SectionRecipe[] = [
  { type: "auth-card", order: 0, overridable: true, config: { variant: "signup" }, bg: "subtle" },
];

const ECOMMERCE_PAGE_RECIPE: SectionRecipe[] = [
  { type: "nav",          order: 0,  overridable: true,  config: { variant: "ecommerce" }, bg: "page" },
  { type: "hero-split",   order: 1,  overridable: true,  config: { variant: "product" }, bg: "hero" },
  { type: "features",     order: 2,  overridable: true,  config: { columns: 4, variant: "categories" }, bg: "page" },
  { type: "stats",        order: 3,  overridable: true,  config: {}, bg: "subtle" },
  { type: "testimonial",  order: 4,  overridable: false, config: {}, bg: "page" },
  { type: "newsletter",   order: 5,  overridable: false, config: {}, bg: "subtle" },
  { type: "footer",       order: 99, overridable: true,  config: {}, bg: "inverse" },
];

// ═══════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════

/**
 * Get the page recipe for a given page type and industry.
 *
 * For landing pages, industry-specific overrides are applied
 * on top of the base landing recipe.
 *
 * For other page types (dashboard, login, etc.), industry
 * only affects content (via RecipeContent), not structure.
 */
export function getPageRecipe(
  pageType: string,
  industry: string
): SectionRecipe[] {
  const normalizedPage = (pageType || "").toLowerCase().trim();
  const normalizedIndustry = (industry || "tech")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  // Select base recipe
  let baseRecipe: SectionRecipe[];

  switch (normalizedPage) {
    case "landing":
    case "landing page":
      baseRecipe = structuredClone(LANDING_PAGE_BASE);
      break;
    case "saas":
    case "saas product":
      return structuredClone(SAAS_RECIPE);
    case "pricing":
      return structuredClone(PRICING_RECIPE);
    case "blog":
      return structuredClone(BLOG_RECIPE);
    case "portfolio":
      return structuredClone(PORTFOLIO_RECIPE);
    case "dashboard":
      return structuredClone(DASHBOARD_RECIPE);
    case "login":
    case "login/sign up":
    case "login/signup":
      return structuredClone(LOGIN_RECIPE);
    case "signup":
    case "sign up":
      return structuredClone(SIGNUP_RECIPE);
    case "ecommerce":
    case "e-commerce":
      return structuredClone(ECOMMERCE_PAGE_RECIPE);
    default:
      // Default to landing page for unknown types
      baseRecipe = structuredClone(LANDING_PAGE_BASE);
      break;
  }

  // Apply industry-specific overrides (only for landing pages)
  const overrides = INDUSTRY_LANDING_OVERRIDES[normalizedIndustry];
  if (overrides) {
    for (const override of overrides) {
      if (!override.type) continue;
      const existingIndex = baseRecipe.findIndex(
        (s) => s.type === override.type
      );
      if (existingIndex >= 0) {
        // Merge override into existing section
        baseRecipe[existingIndex] = {
          ...baseRecipe[existingIndex],
          ...override,
        } as SectionRecipe;
      } else {
        // Add new section
        baseRecipe.push({
          type: override.type as RecipeSectionType,
          order: override.order ?? 50,
          overridable: override.overridable ?? false,
          config: override.config ?? {},
          bg: override.bg,
        });
      }
    }
  }

  // Sort by order
  return baseRecipe.sort((a, b) => a.order - b.order);
}