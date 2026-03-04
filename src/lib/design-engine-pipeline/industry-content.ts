/* ══════════════════════════════════════════════════════════════════════════════
   INDUSTRY CONTENT BANKS + SMART SUGGESTIONS
   
   Pure data + simple lookup functions. Zero complex logic.
   
   - 10 industry content banks (~500 pieces of content)
   - 30+ suggestion mappings (industry × tone → preset + color + fonts)
   - Deterministic selection (position hash, no randomness)
   
   Used by: content-inferrer.ts, design-identity.ts, design-brief.tsx
   ══════════════════════════════════════════════════════════════════════════════ */

/* ─── Types ─── */

export interface IndustryContent {
  heroHeadings: string[];
  heroSubtexts: string[];
  featureTitles: string[];
  featureDescriptions: string[];
  ctaPrimary: string[];
  ctaSecondary: string[];
  navLinks: string[];
  footerLinks: string[];
  inputLabels: Record<string, string[]>;
  icons: string[];
  colorSuggestion: string;
  fontSuggestion: [string, string]; // [heading, body]
}

export interface Suggestions {
  preset: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
}

/* ══════════════════════════════════════════════════════════════════════════════
   10 INDUSTRY CONTENT BANKS
   ══════════════════════════════════════════════════════════════════════════════ */

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  /* ─── Technology / Software ─── */
  tech: {
    heroHeadings: [
      "Ship faster, grow smarter",
      "Build the future of software",
      "Developer tools that just work",
      "Scale with confidence",
    ],
    heroSubtexts: [
      "The modern platform for teams who build",
      "Everything you need to ship products people love",
      "Trusted by thousands of developers worldwide",
    ],
    featureTitles: [
      "Lightning Fast",
      "Enterprise Security",
      "Scalable Infrastructure",
      "Developer First",
      "Real-time Analytics",
      "99.9% Uptime",
    ],
    featureDescriptions: [
      "Built for speed with sub-100ms response times",
      "SOC2 compliant with end-to-end encryption",
      "Auto-scales from prototype to millions of users",
      "APIs and SDKs designed for developer happiness",
      "Monitor everything in real-time with custom dashboards",
      "Enterprise-grade reliability you can count on",
    ],
    ctaPrimary: ["Start Free Trial", "Get Started", "Try for Free"],
    ctaSecondary: ["View Documentation", "See Pricing", "Book Demo"],
    navLinks: ["Product", "Pricing", "Docs", "Blog", "Changelog"],
    footerLinks: ["Privacy", "Terms", "GitHub", "Twitter", "Status"],
    inputLabels: {
      email: ["Work email", "Email address"],
      password: ["Password", "Create password"],
      name: ["Full name", "Your name"],
      search: ["Search docs...", "Search anything..."],
    },
    icons: ["zap", "shield-check", "rocket", "code", "globe"],
    colorSuggestion: "#3b82f6",
    fontSuggestion: ["Inter", "Inter"],
  },

  /* ─── Healthcare / Medical ─── */
  medical: {
    heroHeadings: [
      "Healthcare you can trust",
      "Your health, our priority",
      "Modern care, personal touch",
      "Better health starts here",
    ],
    heroSubtexts: [
      "Compassionate care backed by cutting-edge technology",
      "Board-certified specialists available 24/7",
      "Putting patients first since day one",
    ],
    featureTitles: [
      "24/7 Support",
      "Board Certified",
      "Patient First",
      "Telehealth",
      "Secure Records",
      "Easy Scheduling",
    ],
    featureDescriptions: [
      "Round-the-clock medical support when you need it",
      "All practitioners are board-certified specialists",
      "Patient-centered approach to every consultation",
      "Virtual visits from the comfort of your home",
      "HIPAA-compliant electronic health records",
      "Book appointments in seconds, not minutes",
    ],
    ctaPrimary: ["Book Appointment", "Find a Doctor", "Get Care Now"],
    ctaSecondary: ["Learn More", "View Services", "Patient Portal"],
    navLinks: ["Services", "Doctors", "Locations", "Patient Portal"],
    footerLinks: ["Privacy", "HIPAA", "Accessibility", "Careers"],
    inputLabels: {
      email: ["Patient email", "Email address"],
      password: ["Password", "Account password"],
      name: ["Patient name", "Full name"],
      search: ["Search doctors...", "Find a specialist..."],
      phone: ["Phone number", "Contact number"],
    },
    icons: ["shield-check", "heart", "user", "phone", "calendar"],
    colorSuggestion: "#0891b2",
    fontSuggestion: ["Inter", "Inter"],
  },

  /* ─── Restaurant / Food ─── */
  restaurant: {
    heroHeadings: [
      "A culinary journey awaits",
      "Taste the extraordinary",
      "Where flavor meets artistry",
      "Farm to table, heart to soul",
    ],
    heroSubtexts: [
      "Experience dining reimagined with locally sourced ingredients",
      "Award-winning cuisine in an unforgettable atmosphere",
      "Reserve your table for an evening to remember",
    ],
    featureTitles: [
      "Fresh Ingredients",
      "Award Winning",
      "Private Dining",
      "Seasonal Menu",
      "Wine Selection",
      "Chef's Table",
    ],
    featureDescriptions: [
      "Locally sourced ingredients prepared with passion",
      "Recognized by Michelin and James Beard Foundation",
      "Exclusive spaces for intimate gatherings and events",
      "Our menu evolves with the freshest seasonal produce",
      "Curated wine list with over 200 selections",
      "An intimate dining experience with our head chef",
    ],
    ctaPrimary: ["Reserve a Table", "View Menu", "Order Now"],
    ctaSecondary: ["See Hours", "Private Events", "Gift Cards"],
    navLinks: ["Menu", "Reservations", "About", "Events", "Gallery"],
    footerLinks: ["Hours", "Location", "Careers", "Instagram"],
    inputLabels: {
      email: ["Email", "Your email"],
      name: ["Name", "Reservation name"],
      phone: ["Phone", "Contact number"],
      search: ["Search menu...", "Find a dish..."],
    },
    icons: ["star", "heart", "map-pin", "clock", "calendar"],
    colorSuggestion: "#92400e",
    fontSuggestion: ["Playfair Display", "Inter"],
  },

  /* ─── Education / Learning ─── */
  education: {
    heroHeadings: [
      "Learn without limits",
      "Knowledge is your superpower",
      "Education for everyone, everywhere",
      "Master new skills today",
    ],
    heroSubtexts: [
      "Join millions of learners transforming their careers",
      "Expert-led courses with hands-on projects",
      "Flexible learning that fits your schedule",
    ],
    featureTitles: [
      "Expert Instructors",
      "Flexible Schedule",
      "Certified Programs",
      "Hands-on Projects",
      "Community Support",
      "Career Guidance",
    ],
    featureDescriptions: [
      "Learn from industry leaders and subject matter experts",
      "Study at your own pace, anytime, anywhere",
      "Earn recognized certificates upon completion",
      "Apply what you learn with real-world projects",
      "Connect with peers and mentors in our community",
      "Get career support and job placement assistance",
    ],
    ctaPrimary: ["Enroll Now", "Start Learning", "Browse Courses"],
    ctaSecondary: ["View Curriculum", "Free Preview", "Talk to Advisor"],
    navLinks: ["Courses", "Programs", "Instructors", "Community"],
    footerLinks: ["Privacy", "Terms", "Careers", "Blog", "Help"],
    inputLabels: {
      email: ["Student email", "Email address"],
      password: ["Password", "Create password"],
      name: ["Student name", "Your name"],
      search: ["Search courses...", "What do you want to learn?"],
    },
    icons: ["globe", "star", "check", "play", "user"],
    colorSuggestion: "#7c3aed",
    fontSuggestion: ["Inter", "Inter"],
  },

  /* ─── E-commerce / Store ─── */
  ecommerce: {
    heroHeadings: [
      "Discover your style",
      "Shop the new collection",
      "Curated for you",
      "Elevate your everyday",
    ],
    heroSubtexts: [
      "Premium products handpicked for quality and design",
      "Free shipping on orders over $50",
      "New arrivals dropping every week",
    ],
    featureTitles: [
      "Free Shipping",
      "Easy Returns",
      "Premium Quality",
      "Secure Checkout",
      "24/7 Support",
      "Loyalty Rewards",
    ],
    featureDescriptions: [
      "Free standard shipping on all orders over $50",
      "30-day hassle-free return policy on all items",
      "Every product meets our strict quality standards",
      "Shop with confidence using encrypted payments",
      "Our support team is always here to help",
      "Earn points on every purchase and unlock perks",
    ],
    ctaPrimary: ["Shop Now", "Browse Collection", "Add to Cart"],
    ctaSecondary: ["View Sale", "Gift Guide", "Track Order"],
    navLinks: ["Shop", "New Arrivals", "Collections", "Sale"],
    footerLinks: ["Shipping", "Returns", "Size Guide", "FAQ"],
    inputLabels: {
      email: ["Email address", "Your email"],
      password: ["Password", "Account password"],
      name: ["Full name", "Your name"],
      search: ["Search products...", "What are you looking for?"],
    },
    icons: ["heart", "star", "credit-card", "download", "share"],
    colorSuggestion: "#be123c",
    fontSuggestion: ["Plus Jakarta Sans", "Inter"],
  },

  /* ─── Finance / Banking ─── */
  finance: {
    heroHeadings: [
      "Your money, simplified",
      "Smart banking for everyone",
      "Financial freedom starts here",
      "Banking built for you",
    ],
    heroSubtexts: [
      "Modern banking with zero hidden fees",
      "Grow your wealth with intelligent tools",
      "Trusted by over a million customers",
    ],
    featureTitles: [
      "Secure Transactions",
      "Low Fees",
      "24/7 Access",
      "Smart Investing",
      "Bill Pay",
      "Instant Transfers",
    ],
    featureDescriptions: [
      "Bank-grade encryption protects every transaction",
      "Transparent pricing with no hidden charges",
      "Access your accounts anytime from any device",
      "AI-powered investment recommendations",
      "Pay all your bills from one place automatically",
      "Send money instantly to anyone, anywhere",
    ],
    ctaPrimary: ["Open Account", "Get Started", "Apply Now"],
    ctaSecondary: ["Compare Plans", "Learn More", "Calculator"],
    navLinks: ["Personal", "Business", "Invest", "Cards"],
    footerLinks: ["Security", "Privacy", "FDIC", "Careers"],
    inputLabels: {
      email: ["Email address", "Your email"],
      password: ["Password", "Secure password"],
      name: ["Account holder name", "Full legal name"],
      search: ["Search transactions...", "Find account..."],
      phone: ["Phone number", "Mobile number"],
    },
    icons: ["shield-check", "credit-card", "chart-bar", "lock", "globe"],
    colorSuggestion: "#1e40af",
    fontSuggestion: ["Inter", "Inter"],
  },

  /* ─── Agency / Services ─── */
  agency: {
    heroHeadings: [
      "We build brands that matter",
      "Design that delivers results",
      "Your vision, our expertise",
      "Digital experiences, crafted",
    ],
    heroSubtexts: [
      "Full-service creative agency for ambitious brands",
      "Strategy, design, and development under one roof",
      "Turning ideas into impactful digital products",
    ],
    featureTitles: [
      "Strategy",
      "Design",
      "Development",
      "Marketing",
      "Analytics",
      "Support",
    ],
    featureDescriptions: [
      "Data-driven strategy that aligns with your goals",
      "Beautiful, functional design that converts",
      "Scalable development with modern technologies",
      "Growth marketing that delivers measurable ROI",
      "Deep analytics to understand your audience",
      "Ongoing support and optimization post-launch",
    ],
    ctaPrimary: ["Let's Talk", "View Our Work", "Get a Quote"],
    ctaSecondary: ["Case Studies", "Our Process", "Meet the Team"],
    navLinks: ["Work", "Services", "About", "Blog", "Contact"],
    footerLinks: ["Privacy", "Careers", "Dribbble", "LinkedIn"],
    inputLabels: {
      email: ["Business email", "Your email"],
      name: ["Your name", "Contact name"],
      phone: ["Phone", "Best number to reach you"],
      search: ["Search projects...", "Explore our work..."],
    },
    icons: ["palette", "code", "rocket", "globe", "sparkles"],
    colorSuggestion: "#6d28d9",
    fontSuggestion: ["Plus Jakarta Sans", "Inter"],
  },

  /* ─── Fitness / Sports ─── */
  fitness: {
    heroHeadings: [
      "Push your limits",
      "Transform your body and mind",
      "Strength starts here",
      "Your fitness journey begins",
    ],
    heroSubtexts: [
      "Expert-led training programs for every fitness level",
      "Join a community of thousands achieving their goals",
      "State-of-the-art facilities and personalized coaching",
    ],
    featureTitles: [
      "Personal Training",
      "Group Classes",
      "Nutrition Plans",
      "Recovery",
      "Progress Tracking",
      "Community",
    ],
    featureDescriptions: [
      "One-on-one sessions tailored to your goals",
      "High-energy group workouts led by certified trainers",
      "Custom meal plans designed by registered dietitians",
      "Recovery programs including stretching and therapy",
      "Track your progress with detailed performance metrics",
      "Join a supportive community of fitness enthusiasts",
    ],
    ctaPrimary: ["Join Now", "Free Trial", "Start Today"],
    ctaSecondary: ["View Classes", "Membership Options", "Tour"],
    navLinks: ["Classes", "Trainers", "Membership", "Schedule"],
    footerLinks: ["Privacy", "Terms", "Careers", "Instagram"],
    inputLabels: {
      email: ["Email", "Your email address"],
      name: ["Name", "Your name"],
      phone: ["Phone", "Contact number"],
      search: ["Search classes...", "Find a workout..."],
    },
    icons: ["zap", "heart", "star", "calendar", "user"],
    colorSuggestion: "#dc2626",
    fontSuggestion: ["Plus Jakarta Sans", "Inter"],
  },

  /* ─── Real Estate ─── */
  realestate: {
    heroHeadings: [
      "Find your dream home",
      "Where life happens",
      "Modern living, redefined",
      "Your perfect space awaits",
    ],
    heroSubtexts: [
      "Browse thousands of listings in your area",
      "Expert agents guiding you every step of the way",
      "From first viewing to closing, we're with you",
    ],
    featureTitles: [
      "Virtual Tours",
      "Expert Agents",
      "Market Insights",
      "Mortgage Calculator",
      "Neighborhood Guide",
      "Instant Alerts",
    ],
    featureDescriptions: [
      "Explore properties from anywhere with 3D virtual tours",
      "Work with experienced agents who know your market",
      "Real-time market data and pricing trends",
      "Calculate your monthly payments in seconds",
      "Detailed guides for every neighborhood",
      "Get notified the moment new listings match your criteria",
    ],
    ctaPrimary: ["Browse Listings", "Find a Home", "Get Started"],
    ctaSecondary: ["Sell Your Home", "Market Report", "Contact Agent"],
    navLinks: ["Buy", "Sell", "Rent", "Agents", "Insights"],
    footerLinks: ["Privacy", "Terms", "Licensing", "Careers"],
    inputLabels: {
      email: ["Email", "Your email"],
      name: ["Name", "Your name"],
      search: ["Search by city, zip, or address...", "Find your home..."],
      phone: ["Phone", "Best contact number"],
    },
    icons: ["home", "map-pin", "search", "heart", "star"],
    colorSuggestion: "#059669",
    fontSuggestion: ["Inter", "Inter"],
  },

  /* ─── Travel / Hospitality ─── */
  travel: {
    heroHeadings: [
      "Adventure awaits",
      "Discover the world",
      "Travel made extraordinary",
      "Your journey starts here",
    ],
    heroSubtexts: [
      "Curated experiences in the world's most beautiful destinations",
      "Book with confidence — free cancellation on most trips",
      "Over 10,000 unique stays and experiences",
    ],
    featureTitles: [
      "Unique Stays",
      "Local Experiences",
      "Flexible Booking",
      "24/7 Concierge",
      "Best Price Guarantee",
      "Verified Reviews",
    ],
    featureDescriptions: [
      "Handpicked accommodations from boutique to luxury",
      "Authentic local experiences curated by experts",
      "Free cancellation up to 24 hours before your trip",
      "Personal concierge support wherever you go",
      "We match any lower price you find elsewhere",
      "Honest reviews from real travelers like you",
    ],
    ctaPrimary: ["Explore Now", "Book a Trip", "Start Planning"],
    ctaSecondary: ["View Destinations", "Gift Cards", "Travel Guide"],
    navLinks: ["Destinations", "Stays", "Experiences", "Flights"],
    footerLinks: ["Privacy", "Terms", "Help", "Careers"],
    inputLabels: {
      email: ["Email", "Your email"],
      name: ["Traveler name", "Full name"],
      search: ["Where are you going?", "Search destinations..."],
      phone: ["Phone", "Contact number"],
    },
    icons: ["globe", "map-pin", "star", "calendar", "heart"],
    colorSuggestion: "#0284c7",
    fontSuggestion: ["Plus Jakarta Sans", "Inter"],
  },
};

/* ══════════════════════════════════════════════════════════════════════════════
   SMART SUGGESTION MAPPING
   
   Maps (industry × tone) → recommended preset, color, and fonts.
   30+ hardcoded combinations. Default fallback for unknown combos.
   ══════════════════════════════════════════════════════════════════════════════ */

const SUGGESTION_MAP: Record<string, Suggestions> = {
  // ─── Technology ───
  "tech-professional": { preset: "startup-modern", primaryColor: "#3b82f6", headingFont: "Inter", bodyFont: "Inter" },
  "tech-futuristic": { preset: "glass-gradient", primaryColor: "#8b5cf6", headingFont: "Space Grotesk", bodyFont: "Inter" },
  "tech-minimal": { preset: "minimal-elegant", primaryColor: "#374151", headingFont: "Inter", bodyFont: "Inter" },
  "tech-bold": { preset: "bold-creative", primaryColor: "#f59e0b", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "tech-playful": { preset: "bold-creative", primaryColor: "#6366f1", headingFont: "Nunito", bodyFont: "Inter" },
  "tech-elegant": { preset: "minimal-elegant", primaryColor: "#1e293b", headingFont: "Merriweather", bodyFont: "Inter" },

  // ─── Medical ───
  "medical-professional": { preset: "corporate-clean", primaryColor: "#0891b2", headingFont: "Inter", bodyFont: "Inter" },
  "medical-elegant": { preset: "minimal-elegant", primaryColor: "#0d9488", headingFont: "Merriweather", bodyFont: "Inter" },
  "medical-minimal": { preset: "minimal-elegant", primaryColor: "#0f766e", headingFont: "Inter", bodyFont: "Inter" },
  "medical-playful": { preset: "startup-modern", primaryColor: "#06b6d4", headingFont: "Nunito", bodyFont: "Inter" },
  "medical-bold": { preset: "startup-modern", primaryColor: "#0891b2", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "medical-futuristic": { preset: "glass-gradient", primaryColor: "#06b6d4", headingFont: "Space Grotesk", bodyFont: "Inter" },

  // ─── Restaurant ───
  "restaurant-elegant": { preset: "minimal-elegant", primaryColor: "#92400e", headingFont: "Playfair Display", bodyFont: "Inter" },
  "restaurant-playful": { preset: "bold-creative", primaryColor: "#ea580c", headingFont: "Nunito", bodyFont: "Inter" },
  "restaurant-professional": { preset: "corporate-clean", primaryColor: "#78350f", headingFont: "Inter", bodyFont: "Inter" },
  "restaurant-minimal": { preset: "minimal-elegant", primaryColor: "#78350f", headingFont: "Playfair Display", bodyFont: "Inter" },
  "restaurant-bold": { preset: "bold-creative", primaryColor: "#c2410c", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "restaurant-futuristic": { preset: "glass-gradient", primaryColor: "#ea580c", headingFont: "Space Grotesk", bodyFont: "Inter" },

  // ─── Education ───
  "education-professional": { preset: "startup-modern", primaryColor: "#7c3aed", headingFont: "Inter", bodyFont: "Inter" },
  "education-playful": { preset: "bold-creative", primaryColor: "#8b5cf6", headingFont: "Nunito", bodyFont: "Inter" },
  "education-minimal": { preset: "minimal-elegant", primaryColor: "#4f46e5", headingFont: "Inter", bodyFont: "Inter" },
  "education-bold": { preset: "bold-creative", primaryColor: "#7c3aed", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "education-elegant": { preset: "minimal-elegant", primaryColor: "#4338ca", headingFont: "Merriweather", bodyFont: "Inter" },
  "education-futuristic": { preset: "glass-gradient", primaryColor: "#8b5cf6", headingFont: "Space Grotesk", bodyFont: "Inter" },

  // ─── E-commerce ───
  "ecommerce-bold": { preset: "bold-creative", primaryColor: "#be123c", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "ecommerce-elegant": { preset: "minimal-elegant", primaryColor: "#78350f", headingFont: "Playfair Display", bodyFont: "Inter" },
  "ecommerce-minimal": { preset: "minimal-elegant", primaryColor: "#171717", headingFont: "Inter", bodyFont: "Inter" },
  "ecommerce-professional": { preset: "startup-modern", primaryColor: "#be123c", headingFont: "Inter", bodyFont: "Inter" },
  "ecommerce-playful": { preset: "bold-creative", primaryColor: "#e11d48", headingFont: "Nunito", bodyFont: "Inter" },
  "ecommerce-futuristic": { preset: "glass-gradient", primaryColor: "#be123c", headingFont: "Space Grotesk", bodyFont: "Inter" },

  // ─── Finance ───
  "finance-professional": { preset: "corporate-clean", primaryColor: "#1e40af", headingFont: "Inter", bodyFont: "Inter" },
  "finance-elegant": { preset: "minimal-elegant", primaryColor: "#0f172a", headingFont: "Merriweather", bodyFont: "Inter" },
  "finance-minimal": { preset: "minimal-elegant", primaryColor: "#1e293b", headingFont: "Inter", bodyFont: "Inter" },
  "finance-bold": { preset: "startup-modern", primaryColor: "#1e40af", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "finance-playful": { preset: "startup-modern", primaryColor: "#3b82f6", headingFont: "Nunito", bodyFont: "Inter" },
  "finance-futuristic": { preset: "glass-gradient", primaryColor: "#1e40af", headingFont: "Space Grotesk", bodyFont: "Inter" },

  // ─── Agency ───
  "agency-bold": { preset: "bold-creative", primaryColor: "#6d28d9", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "agency-professional": { preset: "startup-modern", primaryColor: "#4f46e5", headingFont: "Inter", bodyFont: "Inter" },
  "agency-futuristic": { preset: "glass-gradient", primaryColor: "#7c3aed", headingFont: "Space Grotesk", bodyFont: "Inter" },
  "agency-minimal": { preset: "minimal-elegant", primaryColor: "#4338ca", headingFont: "Inter", bodyFont: "Inter" },
  "agency-elegant": { preset: "minimal-elegant", primaryColor: "#3730a3", headingFont: "Merriweather", bodyFont: "Inter" },
  "agency-playful": { preset: "bold-creative", primaryColor: "#7c3aed", headingFont: "Nunito", bodyFont: "Inter" },

  // ─── Fitness ───
  "fitness-bold": { preset: "bold-creative", primaryColor: "#dc2626", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "fitness-futuristic": { preset: "glass-gradient", primaryColor: "#06b6d4", headingFont: "Space Grotesk", bodyFont: "Inter" },
  "fitness-professional": { preset: "startup-modern", primaryColor: "#ea580c", headingFont: "Inter", bodyFont: "Inter" },
  "fitness-playful": { preset: "bold-creative", primaryColor: "#f59e0b", headingFont: "Nunito", bodyFont: "Inter" },
  "fitness-minimal": { preset: "minimal-elegant", primaryColor: "#dc2626", headingFont: "Inter", bodyFont: "Inter" },
  "fitness-elegant": { preset: "minimal-elegant", primaryColor: "#991b1b", headingFont: "Merriweather", bodyFont: "Inter" },

  // ─── Real Estate ───
  "realestate-professional": { preset: "corporate-clean", primaryColor: "#059669", headingFont: "Inter", bodyFont: "Inter" },
  "realestate-elegant": { preset: "minimal-elegant", primaryColor: "#064e3b", headingFont: "Merriweather", bodyFont: "Inter" },
  "realestate-minimal": { preset: "minimal-elegant", primaryColor: "#065f46", headingFont: "Inter", bodyFont: "Inter" },
  "realestate-bold": { preset: "startup-modern", primaryColor: "#059669", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "realestate-playful": { preset: "startup-modern", primaryColor: "#10b981", headingFont: "Nunito", bodyFont: "Inter" },
  "realestate-futuristic": { preset: "glass-gradient", primaryColor: "#059669", headingFont: "Space Grotesk", bodyFont: "Inter" },

  // ─── Travel ───
  "travel-playful": { preset: "bold-creative", primaryColor: "#0284c7", headingFont: "Nunito", bodyFont: "Inter" },
  "travel-elegant": { preset: "minimal-elegant", primaryColor: "#0c4a6e", headingFont: "Playfair Display", bodyFont: "Inter" },
  "travel-professional": { preset: "startup-modern", primaryColor: "#0369a1", headingFont: "Inter", bodyFont: "Inter" },
  "travel-bold": { preset: "bold-creative", primaryColor: "#0284c7", headingFont: "Plus Jakarta Sans", bodyFont: "Inter" },
  "travel-minimal": { preset: "minimal-elegant", primaryColor: "#075985", headingFont: "Inter", bodyFont: "Inter" },
  "travel-futuristic": { preset: "glass-gradient", primaryColor: "#0284c7", headingFont: "Space Grotesk", bodyFont: "Inter" },
};

const DEFAULT_SUGGESTION: Suggestions = {
  preset: "startup-modern",
  primaryColor: "#3b82f6",
  headingFont: "Inter",
  bodyFont: "Inter",
};

/* ══════════════════════════════════════════════════════════════════════════════
   EXPORTED FUNCTIONS
   ══════════════════════════════════════════════════════════════════════════════ */

/**
 * Get design suggestions based on industry + tone combination.
 * Returns recommended preset, primary color, and font pair.
 */
export function getSuggestions(industry: string, tone: string): Suggestions {
  const key = `${industry}-${tone}`;
  return SUGGESTION_MAP[key] || DEFAULT_SUGGESTION;
}

/**
 * Get the full content bank for an industry.
 * Falls back to 'tech' if industry is unknown.
 */
export function getIndustryContent(industry: string): IndustryContent {
  return INDUSTRY_CONTENT[industry] || INDUSTRY_CONTENT["tech"];
}

/**
 * Get preferred icon names for an industry.
 * Falls back to tech icons if industry is unknown.
 */
export function getIndustryIcons(industry: string): string[] {
  const content = INDUSTRY_CONTENT[industry];
  return content?.icons || INDUSTRY_CONTENT["tech"].icons;
}

/**
 * Get all available industry keys (for UI dropdowns/chips).
 */
export function getAvailableIndustries(): string[] {
  return Object.keys(INDUSTRY_CONTENT);
}

/**
 * Get all available tone options.
 */
export function getAvailableTones(): string[] {
  return ["professional", "playful", "minimal", "bold", "elegant", "futuristic"];
}

/**
 * Get all available page type options.
 */
export function getAvailablePageTypes(): string[] {
  return [
    "landing",
    "dashboard",
    "login",
    "blog",
    "portfolio",
    "ecommerce",
    "saas",
    "agency",
    "restaurant",
    "pricing",
  ];
}


// ═══════════════════════════════════════════════════════════
// v5.0 — RECIPE CONTENT PER INDUSTRY
// ═══════════════════════════════════════════════════════════

import type { RecipeContent } from "./types";

const RECIPE_CONTENT: Record<string, RecipeContent> = {
  tech: {
    statsItems: [
      { value: "10K+", label: "Developers" },
      { value: "99.9%", label: "Uptime" },
      { value: "50ms", label: "Avg Response" },
      { value: "150+", label: "Countries" },
    ],
    testimonialQuote:
      "This platform cut our development time in half. The developer experience is unmatched.",
    testimonialAuthor: "Alex Rivera",
    testimonialRole: "Engineering Lead",
    testimonialCompany: "TechCorp",
    trustBadges: ["SOC 2 Certified", "GDPR Compliant", "99.99% SLA", "ISO 27001"],
    logoCloudNames: ["Vercel", "Stripe", "Linear", "Notion", "Figma"],
    logoCloudLabel: "Trusted by developers at",
    newsletterHeading: "Stay in the loop",
    newsletterSubtext: "Get product updates and engineering tips delivered weekly.",
    newsletterPlaceholder: "you@company.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "Everything you need to ship faster",
    featuresSectionSubtext:
      "Powerful features designed for modern development teams.",
    ctaHeading: "Ready to get started?",
    ctaSubtext:
      "Join thousands of developers who are already building faster.",
    footerLinkGroups: [
      ["Product", "Features", "Pricing", "Changelog", "Docs"],
      ["Company", "About", "Blog", "Careers", "Press"],
      ["Resources", "Community", "Contact", "Status", "Security"],
    ],
    socialLinks: ["GitHub", "Twitter", "Discord", "LinkedIn"],
  },

  medical: {
    statsItems: [
      { value: "50K+", label: "Patients Served" },
      { value: "200+", label: "Specialists" },
      { value: "98%", label: "Satisfaction Rate" },
      { value: "24/7", label: "Available" },
    ],
    testimonialQuote:
      "The care I received was exceptional. The team went above and beyond at every step.",
    testimonialAuthor: "Sarah Mitchell",
    testimonialRole: "Patient",
    testimonialCompany: "",
    trustBadges: [
      "HIPAA Compliant",
      "Board Certified",
      "JCI Accredited",
      "Telehealth Ready",
    ],
    logoCloudNames: [
      "Mayo Clinic",
      "Johns Hopkins",
      "Cleveland Clinic",
      "Kaiser",
      "Mount Sinai",
    ],
    logoCloudLabel: "Trusted by leading institutions",
    newsletterHeading: "Health tips delivered to you",
    newsletterSubtext:
      "Evidence-based wellness insights from our medical team.",
    newsletterPlaceholder: "your@email.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "Comprehensive care you can trust",
    featuresSectionSubtext:
      "Advanced medical services backed by decades of expertise.",
    ctaHeading: "Your health journey starts here",
    ctaSubtext: "Schedule a consultation with our specialists today.",
    footerLinkGroups: [
      ["Services", "Primary Care", "Specialists", "Telehealth", "Lab Results"],
      ["Patients", "Book Appointment", "Patient Portal", "Insurance", "FAQ"],
      ["About", "Our Team", "Careers", "Research", "Contact"],
    ],
    socialLinks: ["Facebook", "Instagram", "LinkedIn", "YouTube"],
  },

  restaurant: {
    statsItems: [
      { value: "15+", label: "Years of Excellence" },
      { value: "200+", label: "Menu Items" },
      { value: "50K+", label: "Happy Guests" },
      { value: "4.9★", label: "Average Rating" },
    ],
    testimonialQuote:
      "An unforgettable dining experience. Every dish tells a story of passion and craftsmanship.",
    testimonialAuthor: "James Chen",
    testimonialRole: "Food Critic",
    testimonialCompany: "Gourmet Magazine",
    trustBadges: [
      "Michelin Guide",
      "James Beard Nominee",
      "OpenTable Choice",
      "Zagat Rated",
    ],
    logoCloudNames: [
      "Michelin Guide",
      "Zagat",
      "OpenTable",
      "Yelp Elite",
      "TripAdvisor",
    ],
    logoCloudLabel: "Featured in",
    newsletterHeading: "Get exclusive offers",
    newsletterSubtext:
      "Be the first to know about seasonal menus and special events.",
    newsletterPlaceholder: "your@email.com",
    newsletterButton: "Join",
    featuresSectionHeading: "A culinary experience like no other",
    featuresSectionSubtext:
      "Every detail crafted with care, from farm to table.",
    ctaHeading: "Reserve your table tonight",
    ctaSubtext: "Experience dining that delights every sense.",
    footerLinkGroups: [
      ["Dine", "Menu", "Reservations", "Private Events", "Catering"],
      ["Discover", "Our Story", "The Chef", "Gallery", "Press"],
      ["Visit", "Hours", "Location", "Parking", "Contact"],
    ],
    socialLinks: ["Instagram", "Facebook", "TripAdvisor", "Yelp"],
  },

  education: {
    statsItems: [
      { value: "500+", label: "Courses" },
      { value: "50K+", label: "Students" },
      { value: "95%", label: "Completion Rate" },
      { value: "4.8★", label: "Avg Rating" },
    ],
    testimonialQuote:
      "The courses completely transformed my career. The instructors are world-class.",
    testimonialAuthor: "Maria Santos",
    testimonialRole: "Graduate",
    testimonialCompany: "Class of 2024",
    trustBadges: [
      "Accredited",
      "Industry Recognized",
      "Transferable Credits",
      "Career Support",
    ],
    logoCloudNames: [
      "Harvard",
      "Stanford",
      "MIT",
      "Coursera",
      "edX",
    ],
    logoCloudLabel: "Partnered with",
    newsletterHeading: "Never stop learning",
    newsletterSubtext: "New courses and learning resources, delivered weekly.",
    newsletterPlaceholder: "student@email.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "Learn without limits",
    featuresSectionSubtext:
      "Flexible, world-class education designed for your schedule.",
    ctaHeading: "Start your learning journey",
    ctaSubtext: "Enroll today and transform your future.",
    footerLinkGroups: [
      ["Learn", "Courses", "Programs", "Certifications", "Free Resources"],
      ["Community", "Student Stories", "Forums", "Events", "Blog"],
      ["Support", "Help Center", "Contact", "Accessibility", "FAQ"],
    ],
    socialLinks: ["LinkedIn", "YouTube", "Twitter", "Instagram"],
  },

  ecommerce: {
    statsItems: [
      { value: "10K+", label: "Products" },
      { value: "Free", label: "Shipping Over $50" },
      { value: "24h", label: "Fast Delivery" },
      { value: "30 Day", label: "Easy Returns" },
    ],
    testimonialQuote:
      "Amazing quality and fast shipping. This is my go-to store for everything.",
    testimonialAuthor: "Emily Johnson",
    testimonialRole: "Verified Buyer",
    testimonialCompany: "",
    trustBadges: [
      "Free Shipping",
      "Secure Checkout",
      "Money-Back Guarantee",
      "24/7 Support",
    ],
    logoCloudNames: [
      "Visa",
      "Mastercard",
      "PayPal",
      "Apple Pay",
      "Shop Pay",
    ],
    logoCloudLabel: "Secure payment with",
    newsletterHeading: "Get 15% off your first order",
    newsletterSubtext: "Sign up for exclusive deals and new arrivals.",
    newsletterPlaceholder: "your@email.com",
    newsletterButton: "Get My Discount",
    featuresSectionHeading: "Why shop with us",
    featuresSectionSubtext: "Quality products, unbeatable service.",
    ctaHeading: "Start shopping today",
    ctaSubtext: "Discover thousands of products curated just for you.",
    footerLinkGroups: [
      ["Shop", "New Arrivals", "Best Sellers", "Sale", "Gift Cards"],
      ["Help", "Track Order", "Shipping", "Returns", "Size Guide"],
      ["Company", "About Us", "Sustainability", "Careers", "Press"],
    ],
    socialLinks: ["Instagram", "Facebook", "Pinterest", "TikTok"],
  },

  finance: {
    statsItems: [
      { value: "$2B+", label: "Assets Managed" },
      { value: "500K+", label: "Active Accounts" },
      { value: "0.01%", label: "Fraud Rate" },
      { value: "99.99%", label: "Uptime" },
    ],
    testimonialQuote:
      "Switching was the best financial decision I've made. Transparent, reliable, and easy to use.",
    testimonialAuthor: "David Park",
    testimonialRole: "Business Owner",
    testimonialCompany: "Park Industries",
    trustBadges: [
      "Bank-Level Security",
      "FDIC Insured",
      "SOC 2 Certified",
      "256-bit Encryption",
    ],
    logoCloudNames: [
      "Forbes",
      "Bloomberg",
      "Wall Street Journal",
      "TechCrunch",
      "CNBC",
    ],
    logoCloudLabel: "As seen in",
    newsletterHeading: "Financial insights, delivered",
    newsletterSubtext:
      "Market analysis and tips from our experts, every week.",
    newsletterPlaceholder: "investor@email.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "Banking built for the modern world",
    featuresSectionSubtext:
      "Powerful tools to manage, grow, and protect your money.",
    ctaHeading: "Take control of your finances",
    ctaSubtext: "Open your account in minutes. No hidden fees.",
    footerLinkGroups: [
      ["Products", "Personal", "Business", "Investing", "Insurance"],
      ["Resources", "Blog", "Calculators", "Security", "API"],
      ["Company", "About", "Careers", "Press", "Contact"],
    ],
    socialLinks: ["LinkedIn", "Twitter", "Facebook", "YouTube"],
  },

  agency: {
    statsItems: [
      { value: "200+", label: "Projects Delivered" },
      { value: "50+", label: "Happy Clients" },
      { value: "15+", label: "Awards Won" },
      { value: "8+", label: "Years" },
    ],
    testimonialQuote:
      "They didn't just build a website — they built a brand experience that drives real results.",
    testimonialAuthor: "Lisa Wong",
    testimonialRole: "Marketing Director",
    testimonialCompany: "Horizon Brands",
    trustBadges: [
      "Awwwards Winner",
      "Google Partner",
      "Clutch Top Agency",
      "HubSpot Certified",
    ],
    logoCloudNames: [
      "Nike",
      "Spotify",
      "Airbnb",
      "Shopify",
      "Slack",
    ],
    logoCloudLabel: "Brands we've worked with",
    newsletterHeading: "Design thinking, delivered",
    newsletterSubtext:
      "Creative insights and industry trends, straight to your inbox.",
    newsletterPlaceholder: "hello@company.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "What we do best",
    featuresSectionSubtext:
      "End-to-end digital solutions that move the needle.",
    ctaHeading: "Let's build something great",
    ctaSubtext: "Tell us about your project and we'll get back to you within 24 hours.",
    footerLinkGroups: [
      ["Services", "Web Design", "Branding", "Development", "Strategy"],
      ["Work", "Case Studies", "Portfolio", "Industries", "Process"],
      ["Studio", "About", "Team", "Careers", "Blog"],
    ],
    socialLinks: ["Dribbble", "Instagram", "Behance", "LinkedIn"],
  },

  fitness: {
    statsItems: [
      { value: "100+", label: "Classes Weekly" },
      { value: "50+", label: "Expert Trainers" },
      { value: "10K+", label: "Active Members" },
      { value: "4.9★", label: "Rated" },
    ],
    testimonialQuote:
      "I've never felt stronger or more confident. The trainers here truly care about your goals.",
    testimonialAuthor: "Mike Thompson",
    testimonialRole: "Member since 2022",
    testimonialCompany: "",
    trustBadges: [
      "Certified Trainers",
      "24/7 Access",
      "Free Trial",
      "No Lock-in Contracts",
    ],
    logoCloudNames: [
      "Nike Training",
      "Peloton",
      "Lululemon",
      "Under Armour",
      "Fitbit",
    ],
    logoCloudLabel: "Partnered with",
    newsletterHeading: "Get fit tips weekly",
    newsletterSubtext:
      "Workout plans, nutrition advice, and motivation delivered free.",
    newsletterPlaceholder: "your@email.com",
    newsletterButton: "Join Free",
    featuresSectionHeading: "Transform your body and mind",
    featuresSectionSubtext:
      "World-class facilities and programs for every fitness level.",
    ctaHeading: "Start your transformation today",
    ctaSubtext: "Your first week is on us. No commitment required.",
    footerLinkGroups: [
      ["Programs", "Group Classes", "Personal Training", "Nutrition", "Online"],
      ["Membership", "Plans", "Corporate", "Student", "Gift Cards"],
      ["Info", "Locations", "Schedule", "Blog", "Contact"],
    ],
    socialLinks: ["Instagram", "YouTube", "TikTok", "Facebook"],
  },

  realestate: {
    statsItems: [
      { value: "5K+", label: "Properties Listed" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "$500M+", label: "Sales Volume" },
      { value: "15+", label: "Years Experience" },
    ],
    testimonialQuote:
      "They found us our dream home in two weeks. Professional, knowledgeable, and genuinely caring.",
    testimonialAuthor: "The Martinez Family",
    testimonialRole: "Homeowners",
    testimonialCompany: "",
    trustBadges: [
      "Licensed Agents",
      "Top 1% Nationwide",
      "Award Winning",
      "Free Consultation",
    ],
    logoCloudNames: [
      "Zillow Premier",
      "Realtor.com",
      "RE/MAX",
      "Compass",
      "Sotheby's",
    ],
    logoCloudLabel: "Featured on",
    newsletterHeading: "Market updates you can trust",
    newsletterSubtext:
      "Local listings, price trends, and buying tips delivered weekly.",
    newsletterPlaceholder: "your@email.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "Your trusted real estate partner",
    featuresSectionSubtext:
      "Expert guidance for every step of your property journey.",
    ctaHeading: "Find your perfect property",
    ctaSubtext: "Browse thousands of listings or talk to an agent today.",
    footerLinkGroups: [
      ["Buy", "Homes for Sale", "New Construction", "Open Houses", "Map Search"],
      ["Sell", "Home Valuation", "Selling Guide", "Market Report", "Agents"],
      ["Company", "About", "Testimonials", "Careers", "Contact"],
    ],
    socialLinks: ["Instagram", "Facebook", "LinkedIn", "YouTube"],
  },

  travel: {
    statsItems: [
      { value: "100+", label: "Destinations" },
      { value: "50K+", label: "Happy Travelers" },
      { value: "24/7", label: "Support" },
      { value: "Best", label: "Price Guarantee" },
    ],
    testimonialQuote:
      "The trip of a lifetime, flawlessly organized. Every detail was perfect from start to finish.",
    testimonialAuthor: "Sophie Laurent",
    testimonialRole: "Traveler",
    testimonialCompany: "",
    trustBadges: [
      "IATA Accredited",
      "Best Price Guarantee",
      "Free Cancellation",
      "24/7 Support",
    ],
    logoCloudNames: [
      "TripAdvisor",
      "Lonely Planet",
      "National Geographic",
      "Condé Nast",
      "Travel + Leisure",
    ],
    logoCloudLabel: "Recommended by",
    newsletterHeading: "Wanderlust, delivered",
    newsletterSubtext:
      "Destination guides, travel deals, and insider tips every week.",
    newsletterPlaceholder: "explorer@email.com",
    newsletterButton: "Subscribe",
    featuresSectionHeading: "Travel experiences you'll never forget",
    featuresSectionSubtext:
      "Curated itineraries and local expertise for the modern traveler.",
    ctaHeading: "Your next adventure awaits",
    ctaSubtext: "Browse destinations and book your dream trip today.",
    footerLinkGroups: [
      ["Explore", "Destinations", "Tours", "Cruises", "Adventure"],
      ["Plan", "Travel Guides", "Visa Info", "Insurance", "Packing Lists"],
      ["Company", "About", "Careers", "Partners", "Contact"],
    ],
    socialLinks: ["Instagram", "YouTube", "Pinterest", "Facebook"],
  },
};

/** Default recipe content for unknown industries */
const DEFAULT_RECIPE_CONTENT: RecipeContent = RECIPE_CONTENT.tech;

/**
 * Get recipe-specific content for an industry.
 * Used by recipe template renderers in component-library.ts
 */
export function getRecipeContent(industry: string): RecipeContent {
  const normalized = (industry || "tech").toLowerCase().replace(/[^a-z]/g, "");
  return RECIPE_CONTENT[normalized] || DEFAULT_RECIPE_CONTENT;
}

