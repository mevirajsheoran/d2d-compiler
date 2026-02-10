"use client";

import { TypographySection as TypographySectionType, TypographyStyle } from "@/types/style-guide";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Type, Plus, RotateCcw } from "lucide-react";

const FONT_FAMILIES = [
  "Inter, sans-serif",
  "Arial, sans-serif",
  "Helvetica, sans-serif",
  "Georgia, serif",
  "Times New Roman, serif",
  "Courier New, monospace",
  "Verdana, sans-serif",
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lato, sans-serif",
  "Poppins, sans-serif",
  "Montserrat, sans-serif",
  "Playfair Display, serif",
  "Merriweather, serif",
  "Source Code Pro, monospace",
];

const FONT_WEIGHTS = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

/* ======================================================
   Default Typography Preset
====================================================== */
const DEFAULT_TYPOGRAPHY: TypographySectionType[] = [
  {
    title: "Headings",
    description: "Used for page titles and section headers",
    styles: [
      { name: "Heading 1", fontFamily: "Inter, sans-serif", fontSize: "48px", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-0.02em" },
      { name: "Heading 2", fontFamily: "Inter, sans-serif", fontSize: "36px", fontWeight: "700", lineHeight: "1.2", letterSpacing: "-0.01em" },
      { name: "Heading 3", fontFamily: "Inter, sans-serif", fontSize: "24px", fontWeight: "600", lineHeight: "1.3", letterSpacing: "0" },
      { name: "Heading 4", fontFamily: "Inter, sans-serif", fontSize: "20px", fontWeight: "600", lineHeight: "1.4", letterSpacing: "0" },
    ],
  },
  {
    title: "Body Text",
    description: "Used for paragraphs, descriptions, and general content",
    styles: [
      { name: "Body Large", fontFamily: "Inter, sans-serif", fontSize: "18px", fontWeight: "400", lineHeight: "1.6", letterSpacing: "0" },
      { name: "Body", fontFamily: "Inter, sans-serif", fontSize: "16px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0" },
      { name: "Body Small", fontFamily: "Inter, sans-serif", fontSize: "14px", fontWeight: "400", lineHeight: "1.5", letterSpacing: "0" },
      { name: "Caption", fontFamily: "Inter, sans-serif", fontSize: "12px", fontWeight: "500", lineHeight: "1.4", letterSpacing: "0.01em" },
    ],
  },
];

/* ======================================================
   Typography Style Editor
====================================================== */
interface StyleEditorProps {
  style: TypographyStyle;
  sectionIndex: number;
  styleIndex: number;
  onUpdate: (sectionIndex: number, styleIndex: number, patch: Record<string, string>) => void;
}

function StyleEditor({ style, sectionIndex, styleIndex, onUpdate }: StyleEditorProps) {
  const fontSize = parseInt(style.fontSize) || 16;

  return (
    <div className="p-4 rounded-lg border bg-card space-y-4">
      {/* Style name + info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h4 className="font-medium text-sm">{style.name}</h4>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <span>{style.fontFamily.split(",")[0]}</span>
          <span className="text-border">•</span>
          <span>{style.fontSize}</span>
          <span className="text-border">•</span>
          <span>{style.fontWeight}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Font Family */}
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Font</Label>
          <Select
            value={style.fontFamily}
            onValueChange={(v) => onUpdate(sectionIndex, styleIndex, { fontFamily: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }} className="text-xs">
                    {font.split(",")[0]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Weight */}
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Weight</Label>
          <Select
            value={style.fontWeight}
            onValueChange={(v) => onUpdate(sectionIndex, styleIndex, { fontWeight: v })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHTS.map((w) => (
                <SelectItem key={w.value} value={w.value}>
                  {w.label} ({w.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="space-y-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Size: {style.fontSize}
          </Label>
          <Slider
            value={[fontSize]}
            min={8}
            max={72}
            step={1}
            onValueChange={([v]) => onUpdate(sectionIndex, styleIndex, { fontSize: `${v}px` })}
            className="py-2"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="border-t pt-3">
        <p
          className="text-foreground"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight as any,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
          }}
        >
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>
    </div>
  );
}

/* ======================================================
   Main Typography Section
====================================================== */
interface TypographySectionProps {
  typographyGuide: TypographySectionType[];
  onUpdate: (sectionIndex: number, styleIndex: number, patch: Record<string, string>) => void;
  onLoadDefaults: (defaults: TypographySectionType[]) => void;
}

export function TypographySection({
  typographyGuide,
  onUpdate,
  onLoadDefaults,
}: TypographySectionProps) {
  const hasTypography = typographyGuide && typographyGuide.length > 0;

  return (
    <div className="space-y-8">
      {/* Empty state / Load defaults */}
      {!hasTypography && (
        <div className="text-center space-y-4 py-6">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Type className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Set Up Typography</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Load default typography styles and customize them for your project.
            </p>
          </div>
          <Button onClick={() => onLoadDefaults(DEFAULT_TYPOGRAPHY)}>
            <Plus className="h-4 w-4 mr-2" />
            Load Default Styles
          </Button>
        </div>
      )}

      {/* Typography sections */}
      {hasTypography && (
        <>
          {/* Reset button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => onLoadDefaults(DEFAULT_TYPOGRAPHY)}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset to Defaults
            </Button>
          </div>

          {typographyGuide.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <div>
                <h3 className="text-base font-semibold">{section.title}</h3>
                {section.description && (
                  <p className="text-xs text-muted-foreground">{section.description}</p>
                )}
              </div>

              <div className="space-y-3">
                {section.styles.map((style, styleIndex) => (
                  <StyleEditor
                    key={`${sectionIndex}-${styleIndex}`}
                    style={style}
                    sectionIndex={sectionIndex}
                    styleIndex={styleIndex}
                    onUpdate={onUpdate}
                  />
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}