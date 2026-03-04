// Mock shape data for all pipeline tests

// Minimal shape type that satisfies the pipeline
// You may need to adjust based on your actual Shape type from redux
type MockShape = Record<string, unknown>;

function makeText(
  id: string,
  x: number,
  y: number,
  text: string,
  fontSize: number,
  fontWeight: number
): MockShape {
  return {
    id,
    type: "text",
    x, y,
    text,
    fontSize,
    fontWeight,
    fontFamily: "Inter",
    lineHeight: 1.2,
    textAlign: "left",
  };
}

function makeButton(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  text?: string
): MockShape {
  return {
    id,
    type: "buttonShape",
    x, y, w, h,
    text: text || "",
    variant: "primary",
  };
}

function makeRect(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number
): MockShape {
  return { id, type: "rect", x, y, w, h };
}

function makeRoundedRect(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number
): MockShape {
  return { id, type: "roundedRect", x, y, w, h, cornerRadius: 12 };
}

function makeInput(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
  placeholder?: string
): MockShape {
  return {
    id,
    type: "inputField",
    x, y, w, h,
    placeholder: placeholder || "",
    label: "",
  };
}

function makeFrame(
  id: string,
  x: number,
  y: number,
  w: number,
  h: number
): MockShape {
  return { id, type: "frame", x, y, w, h, name: "Frame" };
}

function makeDivider(
  id: string,
  x: number,
  y: number,
  w: number
): MockShape {
  return { id, type: "divider", x, y, w, h: 2, direction: "horizontal" };
}

// ─── LANDING PAGE: nav + heading + subtitle + button + 3 cards + footer ───
export const LANDING_PAGE_FRAME = makeFrame("frame-1", 0, 0, 1200, 900);

export const LANDING_PAGE_SHAPES: MockShape[] = [
  LANDING_PAGE_FRAME,
  makeText("nav-logo", 30, 15, "Brand", 16, 700),
  makeText("nav-link-1", 200, 18, "Features", 14, 400),
  makeButton("nav-btn", 1050, 12, 100, 35, "Sign Up"),
  makeText("hero-h1", 100, 120, "Welcome to Our Product", 36, 700),
  makeText("hero-sub", 100, 180, "Build faster with our platform", 18, 400),
  makeButton("hero-btn", 100, 230, 150, 44, "Get Started"),
  makeRoundedRect("card-1", 50, 450, 340, 200),
  makeRoundedRect("card-2", 430, 450, 340, 200),
  makeRoundedRect("card-3", 810, 450, 340, 200),
  makeDivider("footer-div", 50, 800, 1100),
  makeText("footer-text", 100, 850, "© 2025 Brand", 12, 400),
];

// ─── GRID: 2×3 cards ───
export const GRID_FRAME = makeFrame("frame-grid", 0, 0, 1200, 800);

export const GRID_SHAPES: MockShape[] = [
  GRID_FRAME,
  makeRoundedRect("g1", 50, 50, 340, 200),
  makeRoundedRect("g2", 430, 50, 340, 200),
  makeRoundedRect("g3", 810, 50, 340, 200),
  makeRoundedRect("g4", 50, 290, 340, 200),
  makeRoundedRect("g5", 430, 290, 340, 200),
  makeRoundedRect("g6", 810, 290, 340, 200),
];

// ─── FORM: heading + 3 inputs + button ───
export const FORM_FRAME = makeFrame("frame-form", 0, 0, 500, 600);

export const FORM_SHAPES: MockShape[] = [
  FORM_FRAME,
  makeText("form-heading", 50, 30, "Sign Up", 28, 700),
  makeInput("input-1", 50, 100, 400, 44, "Email"),
  makeInput("input-2", 50, 160, 400, 44, "Password"),
  makeInput("input-3", 50, 220, 400, 44, "Full Name"),
  makeButton("form-btn", 50, 300, 400, 48, "Create Account"),
];

// ─── EMPTY: frame only ───
export const EMPTY_FRAME = makeFrame("frame-empty", 0, 0, 1200, 800);
export const EMPTY_SHAPES: MockShape[] = [EMPTY_FRAME];

// ─── MESSY GRID: imprecise hand-drawn positions ───
export const MESSY_GRID_FRAME = makeFrame("frame-messy", 0, 0, 1200, 800);

export const MESSY_GRID_SHAPES: MockShape[] = [
  MESSY_GRID_FRAME,
  makeRoundedRect("m1", 52, 48, 338, 203),
  makeRoundedRect("m2", 428, 53, 345, 198),
  makeRoundedRect("m3", 815, 46, 335, 205),
  makeRoundedRect("m4", 48, 292, 342, 197),
  makeRoundedRect("m5", 433, 288, 340, 202),
  makeRoundedRect("m6", 808, 295, 348, 195),
];

// ─── MINIMAL: just a heading (tests recipe filling) ───
export const MINIMAL_FRAME = makeFrame("frame-min", 0, 0, 1200, 800);

export const MINIMAL_SHAPES: MockShape[] = [
  MINIMAL_FRAME,
  makeText("only-heading", 100, 100, "My Website", 36, 700),
];
