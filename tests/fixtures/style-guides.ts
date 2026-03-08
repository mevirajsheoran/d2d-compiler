import type { StyleGuide } from "@/types/style-guide";

// Mock style guides for pipeline tests

export const TECH_LANDING_GUIDE: StyleGuide = {
  theme: "light",
  description: "Tech startup landing page",
  colors: {
    primary: [{ name: "Primary", hexColor: "#3B82F6" }],
    secondary: [{ name: "Secondary", hexColor: "#10B981" }],
    accent: [{ name: "Accent", hexColor: "#F59E0B" }],
    neutral: [
      { name: "Background", hexColor: "#FFFFFF" },
      { name: "Text", hexColor: "#1F2937" },
    ],
    semantic: [],
  },
  typography: [
    {
      title: "Headings",
      styles: [
        { name: "H1", fontFamily: "Inter", fontSize: "48px", fontWeight: "700", lineHeight: "1.2" },
        { name: "H2", fontFamily: "Inter", fontSize: "36px", fontWeight: "600", lineHeight: "1.3" },
      ],
    },
    {
      title: "Body",
      styles: [
        { name: "Body", fontFamily: "Inter", fontSize: "16px", fontWeight: "400", lineHeight: "1.6" },
      ],
    },
  ],
  brief: {
    pageType: "landing",
    industry: "tech",
    tone: "professional",
    brandName: "Acme",
    tagline: "Build faster with our platform",
  },
};

export const RESTAURANT_LANDING_GUIDE: StyleGuide = {
  theme: "light",
  description: "Elegant restaurant landing page",
  colors: {
    primary: [{ name: "Primary", hexColor: "#8B4513" }],
    secondary: [{ name: "Secondary", hexColor: "#D2691E" }],
    accent: [{ name: "Gold", hexColor: "#D4AF37" }],
    neutral: [
      { name: "Background", hexColor: "#FFFAF0" },
      { name: "Text", hexColor: "#2F1810" },
    ],
    semantic: [],
  },
  typography: [
    {
      title: "Headings",
      styles: [
        { name: "H1", fontFamily: "Playfair Display", fontSize: "56px", fontWeight: "700", lineHeight: "1.2" },
      ],
    },
    {
      title: "Body",
      styles: [
        { name: "Body", fontFamily: "Inter", fontSize: "18px", fontWeight: "400", lineHeight: "1.7" },
      ],
    },
  ],
  brief: {
    pageType: "landing",
    industry: "restaurant",
    tone: "elegant",
    brandName: "La Maison",
    tagline: "Fine dining experience",
  },
};

export const NO_BRIEF_GUIDE: StyleGuide = {
  theme: "light",
  description: "Style guide without brief (legacy mode)",
  colors: {
    primary: [{ name: "Primary", hexColor: "#6366F1" }],
    secondary: [{ name: "Secondary", hexColor: "#8B5CF6" }],
    accent: [{ name: "Accent", hexColor: "#EC4899" }],
    neutral: [
      { name: "Background", hexColor: "#FFFFFF" },
      { name: "Text", hexColor: "#1F2937" },
    ],
    semantic: [],
  },
  typography: [
    {
      title: "Headings",
      styles: [
        { name: "H1", fontFamily: "Inter", fontSize: "48px", fontWeight: "700", lineHeight: "1.2" },
      ],
    },
    {
      title: "Body",
      styles: [
        { name: "Body", fontFamily: "Inter", fontSize: "16px", fontWeight: "400", lineHeight: "1.6" },
      ],
    },
  ],
  // No brief property - tests legacy mode
};

export const SAAS_GUIDE: StyleGuide = {
  theme: "light",
  description: "SaaS pricing page",
  colors: {
    primary: [{ name: "Primary", hexColor: "#0EA5E9" }],
    secondary: [{ name: "Secondary", hexColor: "#6366F1" }],
    accent: [{ name: "Accent", hexColor: "#22C55E" }],
    neutral: [
      { name: "Background", hexColor: "#F8FAFC" },
      { name: "Text", hexColor: "#0F172A" },
    ],
    semantic: [],
  },
  typography: [
    {
      title: "Headings",
      styles: [
        { name: "H1", fontFamily: "Inter", fontSize: "48px", fontWeight: "700", lineHeight: "1.2" },
      ],
    },
    {
      title: "Body",
      styles: [
        { name: "Body", fontFamily: "Inter", fontSize: "16px", fontWeight: "400", lineHeight: "1.6" },
      ],
    },
  ],
  brief: {
    pageType: "saas",
    industry: "tech",
    tone: "professional",
    brandName: "CloudFlow",
    tagline: "Scale your business",
  },
};

export const LOGIN_GUIDE: StyleGuide = {
  theme: "light",
  description: "Login page style guide",
  colors: {
    primary: [{ name: "Primary", hexColor: "#4F46E5" }],
    secondary: [{ name: "Secondary", hexColor: "#7C3AED" }],
    accent: [{ name: "Accent", hexColor: "#F43F5E" }],
    neutral: [
      { name: "Background", hexColor: "#F3F4F6" },
      { name: "Card", hexColor: "#FFFFFF" },
    ],
    semantic: [],
  },
  typography: [
    {
      title: "Headings",
      styles: [
        { name: "H1", fontFamily: "Inter", fontSize: "32px", fontWeight: "700", lineHeight: "1.3" },
      ],
    },
    {
      title: "Body",
      styles: [
        { name: "Body", fontFamily: "Inter", fontSize: "14px", fontWeight: "400", lineHeight: "1.5" },
      ],
    },
  ],
  brief: {
    pageType: "login",
    industry: "tech",
    tone: "professional",
    brandName: "AppName",
    tagline: "Welcome back",
  },
};
