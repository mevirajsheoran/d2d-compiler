"use client";

import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  updateShape,
  TextShape,
  ButtonShapeType,
  InputFieldShape,
  CheckboxShape,
  StickyNoteShape,
  SpeechBubbleShape,
  Shape,
} from "@/redux/slice/shapes";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const fontFamilies = [
  "Inter, sans-serif",
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
];

// Types that have editable text and show the sidebar
const TEXT_EDITABLE_TYPES = ["text", "buttonShape", "inputField", "checkbox", "stickyNote", "speechBubble"];

interface TextSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function TextSidebar({ isOpen, onClose }: TextSidebarProps) {
  const dispatch = useAppDispatch();
  const selected = useAppSelector((state) => state.shapes.selected);
  const entities = useAppSelector((state) => state.shapes.shapes.entities);

  const selectedIds = Object.keys(selected || {});

  // Find any selected shape that has editable text
  const selectedShape = selectedIds
    .map((id) => entities[id])
    .find((shape) => shape && TEXT_EDITABLE_TYPES.includes(shape.type)) as Shape | undefined;

  if (!isOpen || !selectedShape) return null;

  const updateProperty = (property: string, value: any) => {
    dispatch(updateShape({ id: selectedShape.id, patch: { [property]: value } }));
  };

  // Determine what properties this shape supports
  const isFullTextShape = selectedShape.type === "text";
  const isButtonShape = selectedShape.type === "buttonShape";
  const isInputShape = selectedShape.type === "inputField";
  const isCheckboxShape = selectedShape.type === "checkbox";
  const isStickyNote = selectedShape.type === "stickyNote";
  const isSpeechBubble = selectedShape.type === "speechBubble";

  // Get the text value based on shape type
  const getTextValue = (): string => {
    if (isFullTextShape) return (selectedShape as TextShape).text;
    if (isButtonShape) return (selectedShape as ButtonShapeType).text;
    if (isStickyNote) return (selectedShape as StickyNoteShape).text;
    if (isSpeechBubble) return (selectedShape as SpeechBubbleShape).text;
    if (isCheckboxShape) return (selectedShape as CheckboxShape).label;
    if (isInputShape) return (selectedShape as InputFieldShape).label;
    return "";
  };

  const getTextProperty = (): string => {
    if (isCheckboxShape) return "label";
    if (isInputShape) return "label";
    return "text";
  };

  // Get the title for the sidebar
  const getTitle = (): string => {
    switch (selectedShape.type) {
      case "text": return "Text Properties";
      case "buttonShape": return "Button Properties";
      case "inputField": return "Input Field Properties";
      case "checkbox": return "Checkbox Properties";
      case "stickyNote": return "Sticky Note Properties";
      case "speechBubble": return "Speech Bubble Properties";
      default: return "Properties";
    }
  };

  return (
    <div
      className={cn(
        "fixed right-0 top-14 h-[calc(100vh-56px)] w-72 bg-background border-l shadow-lg z-40",
        "transform transition-transform duration-200 overflow-y-auto",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{getTitle()}</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* ================================================
            TEXT CONTENT (all editable text shapes)
        ================================================ */}
        <div className="space-y-2">
          <Label>Text</Label>
          <Input
            value={getTextValue()}
            onChange={(e) => updateProperty(getTextProperty(), e.target.value)}
            placeholder="Enter text..."
          />
        </div>

        {/* InputField: also has placeholder */}
        {isInputShape && (
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              value={(selectedShape as InputFieldShape).placeholder}
              onChange={(e) => updateProperty("placeholder", e.target.value)}
              placeholder="Enter placeholder..."
            />
          </div>
        )}

        {/* ================================================
            BUTTON VARIANT (button shape only)
        ================================================ */}
        {isButtonShape && (
          <div className="space-y-2">
            <Label>Button Style</Label>
            <Select
              value={(selectedShape as ButtonShapeType).variant}
              onValueChange={(value) => updateProperty("variant", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary (Blue)</SelectItem>
                <SelectItem value="secondary">Secondary (Gray)</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ================================================
            CHECKBOX STATE (checkbox only)
        ================================================ */}
        {isCheckboxShape && (
          <div className="space-y-2">
            <Label>State</Label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={(selectedShape as CheckboxShape).checked}
                onChange={(e) => updateProperty("checked", e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm text-muted-foreground">
                {(selectedShape as CheckboxShape).checked ? "Checked" : "Unchecked"}
              </span>
            </div>
          </div>
        )}

        {/* ================================================
            STICKY NOTE COLOR (sticky note only)
        ================================================ */}
        {isStickyNote && (
          <div className="space-y-2">
            <Label>Note Color</Label>
            <div className="flex gap-2">
              {["#facc15", "#fb923c", "#4ade80", "#60a5fa", "#f472b6", "#c084fc"].map((color) => (
                <button
                  key={color}
                  onClick={() => updateProperty("noteColor", color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                    (selectedShape as StickyNoteShape).noteColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================================================
            FULL TEXT PROPERTIES (text shape only)
        ================================================ */}
        {isFullTextShape && (
          <>
            {/* Font Family */}
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={(selectedShape as TextShape).fontFamily}
                onValueChange={(value) => updateProperty("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font}>
                      <span style={{ fontFamily: font }}>{font.split(",")[0]}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label>Font Size: {(selectedShape as TextShape).fontSize}px</Label>
              <Slider
                value={[(selectedShape as TextShape).fontSize]}
                min={8}
                max={120}
                step={1}
                onValueChange={([value]) => updateProperty("fontSize", value)}
              />
            </div>

            {/* Font Weight */}
            <div className="space-y-2">
              <Label>Font Weight: {(selectedShape as TextShape).fontWeight}</Label>
              <Slider
                value={[(selectedShape as TextShape).fontWeight]}
                min={100}
                max={900}
                step={100}
                onValueChange={([value]) => updateProperty("fontWeight", value)}
              />
            </div>

            {/* Style Toggles */}
            <div className="space-y-2">
              <Label>Style</Label>
              <div className="flex gap-1">
                <Toggle
                  pressed={(selectedShape as TextShape).fontWeight >= 700}
                  onPressedChange={(pressed) => updateProperty("fontWeight", pressed ? 700 : 400)}
                  size="sm"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={(selectedShape as TextShape).fontStyle === "italic"}
                  onPressedChange={(pressed) => updateProperty("fontStyle", pressed ? "italic" : "normal")}
                  size="sm"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={(selectedShape as TextShape).textDecoration === "underline"}
                  onPressedChange={(pressed) => updateProperty("textDecoration", pressed ? "underline" : "none")}
                  size="sm"
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={(selectedShape as TextShape).textDecoration === "line-through"}
                  onPressedChange={(pressed) => updateProperty("textDecoration", pressed ? "line-through" : "none")}
                  size="sm"
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
              </div>
            </div>

            {/* Text Align */}
            <div className="space-y-2">
              <Label>Alignment</Label>
              <div className="flex gap-1">
                <Toggle
                  pressed={(selectedShape as TextShape).textAlign === "left"}
                  onPressedChange={() => updateProperty("textAlign", "left")}
                  size="sm"
                >
                  <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={(selectedShape as TextShape).textAlign === "center"}
                  onPressedChange={() => updateProperty("textAlign", "center")}
                  size="sm"
                >
                  <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={(selectedShape as TextShape).textAlign === "right"}
                  onPressedChange={() => updateProperty("textAlign", "right")}
                  size="sm"
                >
                  <AlignRight className="h-4 w-4" />
                </Toggle>
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={(selectedShape as TextShape).fill || "#ffffff"}
                  onChange={(e) => updateProperty("fill", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <Input
                  value={(selectedShape as TextShape).fill || "#ffffff"}
                  onChange={(e) => updateProperty("fill", e.target.value)}
                  className="flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </>
        )}

        {/* ================================================
            STROKE COLOR (shared - all shapes)
        ================================================ */}
        <div className="space-y-2">
          <Label>Stroke Color</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedShape.stroke || "#ffffff"}
              onChange={(e) => updateProperty("stroke", e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <Input
              value={selectedShape.stroke || "#ffffff"}
              onChange={(e) => updateProperty("stroke", e.target.value)}
              className="flex-1 font-mono text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}