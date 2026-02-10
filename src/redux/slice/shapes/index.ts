import {
  createSlice,
  createEntityAdapter,
  nanoid,
  PayloadAction,
  EntityState,
} from "@reduxjs/toolkit";
import type { Point } from "../viewport";

/* ======================================================
   Tool Types
====================================================== */
export type Tool =
  | "select"
  | "pan"
  | "frame"
  | "rect"
  | "roundedRect"
  | "ellipse"
  | "circle"
  | "triangle"
  | "star"
  | "polygon"
  | "freedraw"
  | "highlighter"
  | "arrow"
  | "line"
  | "connector"
  | "divider"
  | "text"
  | "stickyNote"
  | "speechBubble"
  | "imagePlaceholder"
  | "videoPlaceholder"
  | "chartPlaceholder"
  | "buttonShape"
  | "inputField"
  | "checkbox"
  | "hamburgerMenu"
  | "deviceFrame"
  | "eraser";

/* ======================================================
   Shape Types
====================================================== */
export interface BaseShape {
  id: string;
  stroke: string;
  strokeWidth: number;
  fill?: string | null;
}

export interface FrameShape extends BaseShape {
  type: "frame";
  x: number;
  y: number;
  w: number;
  h: number;
  frameNumber: number;
}

export interface RectShape extends BaseShape {
  type: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface RoundedRectShape extends BaseShape {
  type: "roundedRect";
  x: number;
  y: number;
  w: number;
  h: number;
  borderRadius: number;
}

export interface EllipseShape extends BaseShape {
  type: "ellipse";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface TriangleShape extends BaseShape {
  type: "triangle";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface StarShape extends BaseShape {
  type: "star";
  x: number;
  y: number;
  w: number;
  h: number;
  points: number; // number of star points (5, 6, etc.)
  innerRadiusRatio: number; // 0-1, how deep the inner points go
}

export interface PolygonShape extends BaseShape {
  type: "polygon";
  x: number;
  y: number;
  w: number;
  h: number;
  sides: number; // 5 = pentagon, 6 = hexagon, etc.
}

export interface FreeDrawShape extends BaseShape {
  type: "freedraw";
  points: Point[];
}

export interface HighlighterShape extends BaseShape {
  type: "highlighter";
  points: Point[];
  highlighterColor: string;
}

export interface ArrowShape extends BaseShape {
  type: "arrow";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface LineShape extends BaseShape {
  type: "line";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export interface ConnectorShape extends BaseShape {
  type: "connector";
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  connectorStyle: "straight" | "elbow" | "curved";
}

export interface DividerShape extends BaseShape {
  type: "divider";
  x: number;
  y: number;
  w: number;
  h: number;
  direction: "horizontal" | "vertical";
}

export interface TextShape extends BaseShape {
  type: "text";
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  textAlign: "left" | "center" | "right";
  textDecoration: "none" | "underline" | "line-through";
  lineHeight: number;
  letterSpacing: number;
  textTransform: "none" | "uppercase" | "lowercase" | "capitalize";
}

export interface StickyNoteShape extends BaseShape {
  type: "stickyNote";
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  noteColor: string;
}

export interface SpeechBubbleShape extends BaseShape {
  type: "speechBubble";
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  tailDirection: "bottom-left" | "bottom-right" | "top-left" | "top-right";
}

export interface ImagePlaceholderShape extends BaseShape {
  type: "imagePlaceholder";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface VideoPlaceholderShape extends BaseShape {
  type: "videoPlaceholder";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ChartPlaceholderShape extends BaseShape {
  type: "chartPlaceholder";
  x: number;
  y: number;
  w: number;
  h: number;
  chartType: "bar" | "line" | "pie";
}

export interface ButtonShapeType extends BaseShape {
  type: "buttonShape";
  x: number;
  y: number;
  w: number;
  h: number;
  text: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
}

export interface InputFieldShape extends BaseShape {
  type: "inputField";
  x: number;
  y: number;
  w: number;
  h: number;
  placeholder: string;
  label: string;
}

export interface CheckboxShape extends BaseShape {
  type: "checkbox";
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  checked: boolean;
}

export interface HamburgerMenuShape extends BaseShape {
  type: "hamburgerMenu";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface DeviceFrameShape extends BaseShape {
  type: "deviceFrame";
  x: number;
  y: number;
  w: number;
  h: number;
  device: "phone" | "tablet" | "desktop";
}

export interface GeneratedUIShape extends BaseShape {
  type: "generatedui";
  x: number;
  y: number;
  w: number;
  h: number;
  uiSpecData: string | null;
  sourceFrameId: string;
  isWorkflowPage?: boolean;
}

export type Shape =
  | FrameShape
  | RectShape
  | RoundedRectShape
  | EllipseShape
  | CircleShape
  | TriangleShape
  | StarShape
  | PolygonShape
  | FreeDrawShape
  | HighlighterShape
  | ArrowShape
  | LineShape
  | ConnectorShape
  | DividerShape
  | TextShape
  | StickyNoteShape
  | SpeechBubbleShape
  | ImagePlaceholderShape
  | VideoPlaceholderShape
  | ChartPlaceholderShape
  | ButtonShapeType
  | InputFieldShape
  | CheckboxShape
  | HamburgerMenuShape
  | DeviceFrameShape
  | GeneratedUIShape;

/* ======================================================
   Shapes that use x,y,w,h bounding box (for resize/hit-test)
====================================================== */
export type BoundedShape = Extract<
  Shape,
  { x: number; y: number; w: number; h: number }
>;

/* ======================================================
   Shapes that use startX,startY,endX,endY (line-like)
====================================================== */
export type LineLikeShape = ArrowShape | LineShape | ConnectorShape;

/* ======================================================
   Entity Adapter
====================================================== */
const shapesAdapter = createEntityAdapter<Shape, string>({
  selectId: (s) => s.id,
});

type SelectionMap = Record<string, true>;

/* ======================================================
   History Snapshot
====================================================== */
interface HistorySnapshot {
  shapes: EntityState<Shape, string>;
  frameCounter: number;
}

const MAX_HISTORY = 50;

interface ShapesState {
  tool: Tool;
  shapes: EntityState<Shape, string>;
  selected: SelectionMap;
  frameCounter: number;
  isDrawing: boolean;
  currentDrawingId: string | null;
  past: HistorySnapshot[];
  future: HistorySnapshot[];
}

const initialState: ShapesState = {
  tool: "select",
  shapes: shapesAdapter.getInitialState(),
  selected: {},
  frameCounter: 0,
  isDrawing: false,
  currentDrawingId: null,
  past: [],
  future: [],
};

/* ======================================================
   History Helper
====================================================== */
function pushHistory(state: ShapesState) {
  const snapshot: HistorySnapshot = {
    shapes: JSON.parse(JSON.stringify(state.shapes)),
    frameCounter: state.frameCounter,
  };
  state.past.push(snapshot);
  if (state.past.length > MAX_HISTORY) {
    state.past = state.past.slice(state.past.length - MAX_HISTORY);
  }
  state.future = [];
}

/* ======================================================
   Shape Factory Functions
====================================================== */
const DEFAULTS = { stroke: "#ffffff", strokeWidth: 2 as const };

const makeFrame = (p: {
  x: number; y: number; w: number; h: number;
  frameNumber: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): FrameShape => ({
  id: nanoid(), type: "frame",
  x: p.x, y: p.y, w: p.w, h: p.h,
  frameNumber: p.frameNumber,
  stroke: "transparent", strokeWidth: 0,
  fill: p.fill ?? "rgba(255, 255, 255, 0.05)",
});

const makeRect = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): RectShape => ({
  id: nanoid(), type: "rect",
  x: p.x, y: p.y, w: p.w, h: p.h,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeRoundedRect = (p: {
  x: number; y: number; w: number; h: number;
  borderRadius?: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): RoundedRectShape => ({
  id: nanoid(), type: "roundedRect",
  x: p.x, y: p.y, w: p.w, h: p.h,
  borderRadius: p.borderRadius ?? 12,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeEllipse = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): EllipseShape => ({
  id: nanoid(), type: "ellipse",
  x: p.x, y: p.y, w: p.w, h: p.h,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeCircle = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): CircleShape => {
  const size = Math.min(p.w, p.h);
  return {
    id: nanoid(), type: "circle",
    x: p.x, y: p.y, w: size, h: size,
    stroke: p.stroke ?? DEFAULTS.stroke,
    strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
    fill: p.fill ?? null,
  };
};

const makeTriangle = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): TriangleShape => ({
  id: nanoid(), type: "triangle",
  x: p.x, y: p.y, w: p.w, h: p.h,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeStar = (p: {
  x: number; y: number; w: number; h: number;
  points?: number; innerRadiusRatio?: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): StarShape => ({
  id: nanoid(), type: "star",
  x: p.x, y: p.y, w: p.w, h: p.h,
  points: p.points ?? 5,
  innerRadiusRatio: p.innerRadiusRatio ?? 0.4,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? "#facc15",
});

const makePolygon = (p: {
  x: number; y: number; w: number; h: number;
  sides?: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): PolygonShape => ({
  id: nanoid(), type: "polygon",
  x: p.x, y: p.y, w: p.w, h: p.h,
  sides: p.sides ?? 6,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeFree = (p: {
  points: Point[];
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): FreeDrawShape => ({
  id: nanoid(), type: "freedraw",
  points: p.points,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeHighlighter = (p: {
  points: Point[];
  highlighterColor?: string;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): HighlighterShape => ({
  id: nanoid(), type: "highlighter",
  points: p.points,
  highlighterColor: p.highlighterColor ?? "#facc15",
  stroke: p.stroke ?? "transparent",
  strokeWidth: p.strokeWidth ?? 20,
  fill: p.fill ?? null,
});

const makeArrow = (p: {
  startX: number; startY: number; endX: number; endY: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): ArrowShape => ({
  id: nanoid(), type: "arrow",
  startX: p.startX, startY: p.startY, endX: p.endX, endY: p.endY,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeLine = (p: {
  startX: number; startY: number; endX: number; endY: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): LineShape => ({
  id: nanoid(), type: "line",
  startX: p.startX, startY: p.startY, endX: p.endX, endY: p.endY,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeConnector = (p: {
  startX: number; startY: number; endX: number; endY: number;
  connectorStyle?: "straight" | "elbow" | "curved";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): ConnectorShape => ({
  id: nanoid(), type: "connector",
  startX: p.startX, startY: p.startY, endX: p.endX, endY: p.endY,
  connectorStyle: p.connectorStyle ?? "elbow",
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeDivider = (p: {
  x: number; y: number; w: number; h: number;
  direction?: "horizontal" | "vertical";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): DividerShape => ({
  id: nanoid(), type: "divider",
  x: p.x, y: p.y,
  w: p.direction === "vertical" ? 2 : p.w,
  h: p.direction === "vertical" ? p.h : 2,
  direction: p.direction ?? "horizontal",
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? null,
});

const makeText = (p: {
  x: number; y: number;
  text?: string; fontSize?: number; fontFamily?: string; fontWeight?: number;
  fontStyle?: "normal" | "italic";
  textAlign?: "left" | "center" | "right";
  textDecoration?: "none" | "underline" | "line-through";
  lineHeight?: number; letterSpacing?: number;
  textTransform?: "none" | "uppercase" | "lowercase" | "capitalize";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): TextShape => ({
  id: nanoid(), type: "text",
  x: p.x, y: p.y,
  text: p.text ?? "Type here...",
  fontSize: p.fontSize ?? 16,
  fontFamily: p.fontFamily ?? "Inter, sans-serif",
  fontWeight: p.fontWeight ?? 400,
  fontStyle: p.fontStyle ?? "normal",
  textAlign: p.textAlign ?? "left",
  textDecoration: p.textDecoration ?? "none",
  lineHeight: p.lineHeight ?? 1.2,
  letterSpacing: p.letterSpacing ?? 0,
  textTransform: p.textTransform ?? "none",
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? "#ffffff",
});

const makeStickyNote = (p: {
  x: number; y: number; w: number; h: number;
  text?: string; noteColor?: string;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): StickyNoteShape => ({
  id: nanoid(), type: "stickyNote",
  x: p.x, y: p.y, w: p.w || 200, h: p.h || 200,
  text: p.text ?? "Note...",
  noteColor: p.noteColor ?? "#facc15",
  stroke: "transparent", strokeWidth: 0,
  fill: p.fill ?? null,
});

const makeSpeechBubble = (p: {
  x: number; y: number; w: number; h: number;
  text?: string; tailDirection?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): SpeechBubbleShape => ({
  id: nanoid(), type: "speechBubble",
  x: p.x, y: p.y, w: p.w || 200, h: p.h || 120,
  text: p.text ?? "Hello!",
  tailDirection: p.tailDirection ?? "bottom-left",
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? DEFAULTS.strokeWidth,
  fill: p.fill ?? "#ffffff",
});

const makeImagePlaceholder = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): ImagePlaceholderShape => ({
  id: nanoid(), type: "imagePlaceholder",
  x: p.x, y: p.y, w: p.w || 200, h: p.h || 150,
  stroke: p.stroke ?? "#666666",
  strokeWidth: p.strokeWidth ?? 2,
  fill: p.fill ?? "rgba(255,255,255,0.05)",
});

const makeVideoPlaceholder = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): VideoPlaceholderShape => ({
  id: nanoid(), type: "videoPlaceholder",
  x: p.x, y: p.y, w: p.w || 320, h: p.h || 180,
  stroke: p.stroke ?? "#666666",
  strokeWidth: p.strokeWidth ?? 2,
  fill: p.fill ?? "rgba(255,255,255,0.05)",
});

const makeChartPlaceholder = (p: {
  x: number; y: number; w: number; h: number;
  chartType?: "bar" | "line" | "pie";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): ChartPlaceholderShape => ({
  id: nanoid(), type: "chartPlaceholder",
  x: p.x, y: p.y, w: p.w || 300, h: p.h || 200,
  chartType: p.chartType ?? "bar",
  stroke: p.stroke ?? "#666666",
  strokeWidth: p.strokeWidth ?? 2,
  fill: p.fill ?? "rgba(255,255,255,0.05)",
});

const makeButtonShape = (p: {
  x: number; y: number; w: number; h: number;
  text?: string; variant?: "primary" | "secondary" | "outline" | "ghost";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): ButtonShapeType => ({
  id: nanoid(), type: "buttonShape",
  x: p.x, y: p.y, w: p.w || 120, h: p.h || 40,
  text: p.text ?? "Button",
  variant: p.variant ?? "primary",
  stroke: p.stroke ?? "transparent",
  strokeWidth: p.strokeWidth ?? 0,
  fill: p.fill ?? null,
});

const makeInputField = (p: {
  x: number; y: number; w: number; h: number;
  placeholder?: string; label?: string;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): InputFieldShape => ({
  id: nanoid(), type: "inputField",
  x: p.x, y: p.y, w: p.w || 250, h: p.h || 60,
  placeholder: p.placeholder ?? "Enter text...",
  label: p.label ?? "Label",
  stroke: p.stroke ?? "#666666",
  strokeWidth: p.strokeWidth ?? 1,
  fill: p.fill ?? null,
});

const makeCheckbox = (p: {
  x: number; y: number; w: number; h: number;
  label?: string; checked?: boolean;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): CheckboxShape => ({
  id: nanoid(), type: "checkbox",
  x: p.x, y: p.y, w: p.w || 150, h: p.h || 24,
  label: p.label ?? "Checkbox label",
  checked: p.checked ?? false,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? 2,
  fill: p.fill ?? null,
});

const makeHamburgerMenu = (p: {
  x: number; y: number; w: number; h: number;
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): HamburgerMenuShape => ({
  id: nanoid(), type: "hamburgerMenu",
  x: p.x, y: p.y, w: p.w || 32, h: p.h || 32,
  stroke: p.stroke ?? DEFAULTS.stroke,
  strokeWidth: p.strokeWidth ?? 2,
  fill: p.fill ?? null,
});

const makeDeviceFrame = (p: {
  x: number; y: number; w: number; h: number;
  device?: "phone" | "tablet" | "desktop";
  stroke?: string; strokeWidth?: number; fill?: string | null;
}): DeviceFrameShape => {
  let w = p.w, h = p.h;
  if (p.device === "phone") { w = w || 375; h = h || 812; }
  else if (p.device === "tablet") { w = w || 768; h = h || 1024; }
  else { w = w || 1440; h = h || 900; }
  return {
    id: nanoid(), type: "deviceFrame",
    x: p.x, y: p.y, w, h,
    device: p.device ?? "phone",
    stroke: p.stroke ?? "#666666",
    strokeWidth: p.strokeWidth ?? 2,
    fill: p.fill ?? "rgba(255,255,255,0.03)",
  };
};

const makeGeneratedUI = (p: {
  x: number; y: number; w: number; h: number;
  uiSpecData: string | null; sourceFrameId: string;
  id?: string; stroke?: string; strokeWidth?: number; fill?: string | null;
  isWorkflowPage?: boolean;
}): GeneratedUIShape => ({
  id: p.id ?? nanoid(), type: "generatedui",
  x: p.x, y: p.y, w: p.w, h: p.h,
  uiSpecData: p.uiSpecData, sourceFrameId: p.sourceFrameId,
  isWorkflowPage: p.isWorkflowPage,
  stroke: "transparent", strokeWidth: 0,
  fill: p.fill ?? null,
});

/* ======================================================
   Helper: which tools draw as bounded (x,y,w,h) shapes
====================================================== */
export const BOUNDED_DRAW_TOOLS: Tool[] = [
  "frame", "rect", "roundedRect", "ellipse", "circle",
  "triangle", "star", "polygon", "divider",
  "stickyNote", "speechBubble",
  "imagePlaceholder", "videoPlaceholder", "chartPlaceholder",
  "buttonShape", "inputField", "checkbox", "hamburgerMenu", "deviceFrame",
];

export const LINE_DRAW_TOOLS: Tool[] = ["arrow", "line", "connector"];

export const FREEHAND_TOOLS: Tool[] = ["freedraw", "highlighter"];

/* ======================================================
   Shapes Slice
====================================================== */
const shapesSlice = createSlice({
  name: "shapes",
  initialState,
  reducers: {
    setTool(state, action: PayloadAction<Tool>) {
      state.tool = action.payload;
      if (action.payload !== "select") {
        state.selected = {};
      }
    },

    // ============================================
    // UNDO / REDO
    // ============================================
    undo(state) {
      if (state.past.length === 0) return;
      const currentSnapshot: HistorySnapshot = {
        shapes: JSON.parse(JSON.stringify(state.shapes)),
        frameCounter: state.frameCounter,
      };
      state.future.push(currentSnapshot);
      const previousSnapshot = state.past.pop()!;
      state.shapes = previousSnapshot.shapes;
      state.frameCounter = previousSnapshot.frameCounter;
      state.selected = {};
    },

    redo(state) {
      if (state.future.length === 0) return;
      const currentSnapshot: HistorySnapshot = {
        shapes: JSON.parse(JSON.stringify(state.shapes)),
        frameCounter: state.frameCounter,
      };
      state.past.push(currentSnapshot);
      const nextSnapshot = state.future.pop()!;
      state.shapes = nextSnapshot.shapes;
      state.frameCounter = nextSnapshot.frameCounter;
      state.selected = {};
    },

    saveHistorySnapshot(state) {
      pushHistory(state);
    },

    // ============================================
    // GENERIC ADD BOUNDED SHAPE
    // ============================================
    addBoundedShape(
      state,
      action: PayloadAction<{
        tool: Tool;
        x: number; y: number; w: number; h: number;
      }>
    ) {
      pushHistory(state);
      const { tool, x, y, w, h } = action.payload;
      let shape: Shape;

      switch (tool) {
        case "frame":
          state.frameCounter += 1;
          shape = makeFrame({ x, y, w, h, frameNumber: state.frameCounter });
          shapesAdapter.addOne(state.shapes, shape);
          return; // frames don't auto-select
        case "rect":
          shape = makeRect({ x, y, w, h }); break;
        case "roundedRect":
          shape = makeRoundedRect({ x, y, w, h }); break;
        case "ellipse":
          shape = makeEllipse({ x, y, w, h }); break;
        case "circle":
          shape = makeCircle({ x, y, w, h }); break;
        case "triangle":
          shape = makeTriangle({ x, y, w, h }); break;
        case "star":
          shape = makeStar({ x, y, w, h }); break;
        case "polygon":
          shape = makePolygon({ x, y, w, h }); break;
        case "divider":
          shape = makeDivider({ x, y, w, h }); break;
        case "stickyNote":
          shape = makeStickyNote({ x, y, w, h }); break;
        case "speechBubble":
          shape = makeSpeechBubble({ x, y, w, h }); break;
        case "imagePlaceholder":
          shape = makeImagePlaceholder({ x, y, w, h }); break;
        case "videoPlaceholder":
          shape = makeVideoPlaceholder({ x, y, w, h }); break;
        case "chartPlaceholder":
          shape = makeChartPlaceholder({ x, y, w, h }); break;
        case "buttonShape":
          shape = makeButtonShape({ x, y, w, h }); break;
        case "inputField":
          shape = makeInputField({ x, y, w, h }); break;
        case "checkbox":
          shape = makeCheckbox({ x, y, w, h }); break;
        case "hamburgerMenu":
          shape = makeHamburgerMenu({ x, y, w, h }); break;
        case "deviceFrame":
          shape = makeDeviceFrame({ x, y, w, h }); break;
        default:
          return;
      }

      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    // GENERIC ADD LINE-LIKE SHAPE
    addLineLikeShape(
      state,
      action: PayloadAction<{
        tool: Tool;
        startX: number; startY: number; endX: number; endY: number;
      }>
    ) {
      pushHistory(state);
      const { tool, startX, startY, endX, endY } = action.payload;
      let shape: Shape;

      switch (tool) {
        case "arrow":
          shape = makeArrow({ startX, startY, endX, endY }); break;
        case "line":
          shape = makeLine({ startX, startY, endX, endY }); break;
        case "connector":
          shape = makeConnector({ startX, startY, endX, endY }); break;
        default:
          return;
      }

      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    // Keep individual adds for backward compatibility
    addFrame(
      state,
      action: PayloadAction<Omit<Parameters<typeof makeFrame>[0], "frameNumber">>
    ) {
      pushHistory(state);
      state.frameCounter += 1;
      shapesAdapter.addOne(
        state.shapes,
        makeFrame({ ...action.payload, frameNumber: state.frameCounter })
      );
    },

    addRect(state, action: PayloadAction<Parameters<typeof makeRect>[0]>) {
      pushHistory(state);
      const shape = makeRect(action.payload);
      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    addEllipse(state, action: PayloadAction<Parameters<typeof makeEllipse>[0]>) {
      pushHistory(state);
      const shape = makeEllipse(action.payload);
      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    addArrow(state, action: PayloadAction<Parameters<typeof makeArrow>[0]>) {
      pushHistory(state);
      const shape = makeArrow(action.payload);
      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    addLine(state, action: PayloadAction<Parameters<typeof makeLine>[0]>) {
      pushHistory(state);
      const shape = makeLine(action.payload);
      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    addText(state, action: PayloadAction<Parameters<typeof makeText>[0]>) {
      pushHistory(state);
      const shape = makeText(action.payload);
      shapesAdapter.addOne(state.shapes, shape);
      state.selected = { [shape.id]: true };
    },

    addGeneratedUI(
      state,
      action: PayloadAction<Parameters<typeof makeGeneratedUI>[0]>
    ) {
      pushHistory(state);
      shapesAdapter.addOne(state.shapes, makeGeneratedUI(action.payload));
    },

    // ============================================
    // Free draw / Highlighter
    // ============================================
    startFreeDraw(state, action: PayloadAction<{ x: number; y: number; tool?: Tool }>) {
      pushHistory(state);
      const isHighlighter = action.payload.tool === "highlighter";
      const shape = isHighlighter
        ? makeHighlighter({ points: [{ x: action.payload.x, y: action.payload.y }] })
        : makeFree({ points: [{ x: action.payload.x, y: action.payload.y }] });
      shapesAdapter.addOne(state.shapes, shape);
      state.isDrawing = true;
      state.currentDrawingId = shape.id;
    },

    continueFreeDraw(state, action: PayloadAction<Point>) {
      if (state.currentDrawingId && state.isDrawing) {
        const shape = state.shapes.entities[state.currentDrawingId];
        if (shape && (shape.type === "freedraw" || shape.type === "highlighter")) {
          (shape as FreeDrawShape | HighlighterShape).points.push(action.payload);
        }
      }
    },

    endFreeDraw(state) {
      state.isDrawing = false;
      if (state.currentDrawingId) {
        state.selected = { [state.currentDrawingId]: true };
      }
      state.currentDrawingId = null;
    },

    addFreeDrawShape(state, action: PayloadAction<Parameters<typeof makeFree>[0]>) {
      const { points } = action.payload;
      if (!points || points.length === 0) return;
      pushHistory(state);
      shapesAdapter.addOne(state.shapes, makeFree(action.payload));
    },

    // ============================================
    // Update shapes
    // ============================================
    updateShape(
      state,
      action: PayloadAction<{ id: string; patch: Partial<Shape> }>
    ) {
      const { id, patch } = action.payload;
      shapesAdapter.updateOne(state.shapes, { id, changes: patch });
    },

    moveShape(
      state,
      action: PayloadAction<{ id: string; x: number; y: number }>
    ) {
      const shape = state.shapes.entities[action.payload.id];
      if (shape && "x" in shape && "y" in shape) {
        shapesAdapter.updateOne(state.shapes, {
          id: action.payload.id,
          changes: { x: action.payload.x, y: action.payload.y },
        });
      }
    },

    resizeShape(
      state,
      action: PayloadAction<{
        id: string; w: number; h: number; x?: number; y?: number;
      }>
    ) {
      const { id, w, h, x, y } = action.payload;
      const changes: any = { w, h };
      if (x !== undefined) changes.x = x;
      if (y !== undefined) changes.y = y;
      shapesAdapter.updateOne(state.shapes, { id, changes });
    },

    // ============================================
    // Delete shapes
    // ============================================
    removeShape(state, action: PayloadAction<string>) {
      pushHistory(state);
      const id = action.payload;
      const shape = state.shapes.entities[id];
      if (shape?.type === "frame") {
        state.frameCounter = Math.max(0, state.frameCounter - 1);
      }
      shapesAdapter.removeOne(state.shapes, id);
      delete state.selected[id];
    },

    deleteSelected(state) {
      const ids = Object.keys(state.selected);
      if (ids.length) {
        pushHistory(state);
        shapesAdapter.removeMany(state.shapes, ids);
      }
      state.selected = {};
    },

    clearAll(state) {
      pushHistory(state);
      shapesAdapter.removeAll(state.shapes);
      state.selected = {};
      state.frameCounter = 0;
    },

    // ============================================
    // Selection
    // ============================================
    selectShape(state, action: PayloadAction<string>) {
      state.selected = { [action.payload]: true };
    },
    addToSelection(state, action: PayloadAction<string>) {
      state.selected[action.payload] = true;
    },
    deselectShape(state, action: PayloadAction<string>) {
      delete state.selected[action.payload];
    },
    clearSelection(state) {
      state.selected = {};
    },
    selectAll(state) {
      const ids = state.shapes.ids as string[];
      state.selected = Object.fromEntries(ids.map((id) => [id, true]));
    },

    // ============================================
    // Load / Reset
    // ============================================
    loadProject(
      state,
      action: PayloadAction<{
        shapes: EntityState<Shape, string>;
        tool?: Tool; selected?: SelectionMap; frameCounter?: number;
      }>
    ) {
      state.shapes = action.payload.shapes;
      state.tool = action.payload.tool ?? "select";
      state.selected = action.payload.selected ?? {};
      state.frameCounter = action.payload.frameCounter ?? 0;
      state.past = [];
      state.future = [];
    },

    resetShapes(state) {
      state.shapes = shapesAdapter.getInitialState();
      state.tool = "select";
      state.selected = {};
      state.frameCounter = 0;
      state.isDrawing = false;
      state.currentDrawingId = null;
      state.past = [];
      state.future = [];
    },
  },
});

export const {
  setTool,
  undo,
  redo,
  saveHistorySnapshot,
  addBoundedShape,
  addLineLikeShape,
  addFrame,
  addRect,
  addEllipse,
  addArrow,
  addLine,
  addText,
  addGeneratedUI,
  startFreeDraw,
  continueFreeDraw,
  endFreeDraw,
  addFreeDrawShape,
  updateShape,
  moveShape,
  resizeShape,
  removeShape,
  deleteSelected,
  clearAll,
  selectShape,
  addToSelection,
  deselectShape,
  clearSelection,
  selectAll,
  loadProject,
  resetShapes,
} = shapesSlice.actions;

export default shapesSlice.reducer;

export const shapesSelectors = shapesAdapter.getSelectors();