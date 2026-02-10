"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MousePointer2,
  Hand,
  Pencil,
  Square,
  Circle,
  ArrowUpRight,
  Minus,
  Type,
  Frame,
  Eraser,
  ChevronUp,
  RectangleHorizontal,
  Triangle,
  Star,
  Hexagon,
  MessageCircle,
  StickyNote,
  Image,
  Video,
  BarChart3,
  MousePointerClick,
  TextCursorInput,
  CheckSquare,
  Menu,
  Smartphone,
  Tablet,
  Monitor,
  Highlighter,
  GitCommitHorizontal,
  SeparatorHorizontal,
  CircleDot,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { setTool, Tool } from "@/redux/slice/shapes";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ======================================================
   Primary Tools (always visible in toolbar)
====================================================== */
interface ToolDef {
  id: Tool;
  icon: any;
  label: string;
  shortcut?: string;
}

const primaryTools: ToolDef[] = [
  { id: "select", icon: MousePointer2, label: "Select", shortcut: "V" },
  { id: "pan", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "freedraw", icon: Pencil, label: "Pen", shortcut: "P" },
  { id: "rect", icon: Square, label: "Rectangle", shortcut: "R" },
  { id: "ellipse", icon: Circle, label: "Ellipse", shortcut: "O" },
  { id: "arrow", icon: ArrowUpRight, label: "Arrow", shortcut: "A" },
  { id: "line", icon: Minus, label: "Line", shortcut: "L" },
  { id: "text", icon: Type, label: "Text", shortcut: "T" },
  { id: "frame", icon: Frame, label: "Frame", shortcut: "F" },
  { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
];

/* ======================================================
   More Shapes Categories
====================================================== */
interface ShapeCategory {
  label: string;
  tools: ToolDef[];
}

const moreShapesCategories: ShapeCategory[] = [
  {
    label: "Basic Shapes",
    tools: [
      { id: "roundedRect", icon: RectangleHorizontal, label: "Rounded Rectangle" },
      { id: "circle", icon: CircleDot, label: "Circle (Perfect)" },
      { id: "triangle", icon: Triangle, label: "Triangle" },
      { id: "star", icon: Star, label: "Star" },
      { id: "polygon", icon: Hexagon, label: "Polygon (Hexagon)" },
    ],
  },
  {
    label: "Connectors & Lines",
    tools: [
      { id: "connector", icon: GitCommitHorizontal, label: "Connector (Elbow)" },
      { id: "divider", icon: SeparatorHorizontal, label: "Divider / HR" },
    ],
  },
  {
    label: "Annotations",
    tools: [
      { id: "stickyNote", icon: StickyNote, label: "Sticky Note" },
      { id: "speechBubble", icon: MessageCircle, label: "Speech Bubble" },
      { id: "highlighter", icon: Highlighter, label: "Highlighter" },
    ],
  },
  {
    label: "UI Components",
    tools: [
      { id: "buttonShape", icon: MousePointerClick, label: "Button" },
      { id: "inputField", icon: TextCursorInput, label: "Input Field" },
      { id: "checkbox", icon: CheckSquare, label: "Checkbox" },
      { id: "hamburgerMenu", icon: Menu, label: "Hamburger Menu" },
    ],
  },
  {
    label: "Placeholders",
    tools: [
      { id: "imagePlaceholder", icon: Image, label: "Image Placeholder" },
      { id: "videoPlaceholder", icon: Video, label: "Video Placeholder" },
      { id: "chartPlaceholder", icon: BarChart3, label: "Chart Placeholder" },
    ],
  },
  {
    label: "Device Frames",
    tools: [
      { id: "deviceFrame", icon: Smartphone, label: "Phone Frame" },
    ],
  },
];

// Flatten all more shapes tool IDs for checking if current tool is a "more" tool
const allMoreToolIds = moreShapesCategories.flatMap((cat) =>
  cat.tools.map((t) => t.id)
);

/* ======================================================
   ToolButtons Component
====================================================== */
export function ToolButtons() {
  const dispatch = useAppDispatch();
  const currentTool = useAppSelector((state) => state.shapes.tool);
  const [moreOpen, setMoreOpen] = useState(false);

  // Check if current tool is one of the "more" shapes
  const isMoreToolActive = allMoreToolIds.includes(currentTool);

  // Find the active more tool's info for display
  const activeMoreTool = isMoreToolActive
    ? moreShapesCategories
        .flatMap((cat) => cat.tools)
        .find((t) => t.id === currentTool)
    : null;

  const handleSelectTool = (toolId: Tool) => {
    dispatch(setTool(toolId));
    setMoreOpen(false);
  };

  return (
    <TooltipProvider>
      <div className="relative flex items-center bg-background border rounded-full p-1 shadow-lg">
        {/* Primary Tools */}
        {primaryTools.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.id;

          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full transition-colors",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => handleSelectTool(tool.id)}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {tool.label}
                  {tool.shortcut ? ` (${tool.shortcut})` : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Separator */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* More Shapes Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-full transition-colors relative",
                (moreOpen || isMoreToolActive) &&
                  "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => setMoreOpen(!moreOpen)}
            >
              {activeMoreTool ? (
                <activeMoreTool.icon className="h-4 w-4" />
              ) : (
                <ChevronUp
                  className={cn(
                    "h-4 w-4 transition-transform",
                    moreOpen && "rotate-180"
                  )}
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{activeMoreTool ? activeMoreTool.label : "More Shapes"}</p>
          </TooltipContent>
        </Tooltip>

        {/* More Shapes Popover */}
        {moreOpen && (
          <>
            {/* Backdrop to close */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMoreOpen(false)}
            />

            {/* Popover Panel */}
            <div
              className={cn(
                "absolute bottom-full mb-3 right-0 z-50",
                "bg-background border rounded-xl shadow-2xl",
                "w-[320px] max-h-[480px] overflow-y-auto",
                "p-3"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-sm font-semibold text-foreground">
                  More Shapes
                </h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Categories */}
              {moreShapesCategories.map((category) => (
                <div key={category.label} className="mb-3 last:mb-0">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-1 mb-1.5">
                    {category.label}
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {category.tools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = currentTool === tool.id;

                      return (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool.id)}
                          className={cn(
                            "flex items-center gap-2 px-2.5 py-2 rounded-lg text-left",
                            "text-sm transition-colors",
                            "hover:bg-accent hover:text-accent-foreground",
                            isActive &&
                              "bg-primary text-primary-foreground hover:bg-primary/90"
                          )}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate text-xs">
                            {tool.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}