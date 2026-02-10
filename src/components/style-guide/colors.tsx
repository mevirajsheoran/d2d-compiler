"use client";

import { ColorSection, ColorSwatch } from "@/types/style-guide";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, Plus, X, Palette } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ======================================================
   Color Swatch Card (display + copy)
====================================================== */
interface ColorSwatchCardProps {
  swatch: ColorSwatch;
  onRemove: () => void;
  onUpdate: (updated: ColorSwatch) => void;
}

function ColorSwatchCard({ swatch, onRemove, onUpdate }: ColorSwatchCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(swatch.name);
  const [editColor, setEditColor] = useState(swatch.hexColor);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(swatch.hexColor);
    setCopied(true);
    toast.success(`Copied ${swatch.hexColor}`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdit = () => {
    onUpdate({
      name: editName || "Untitled",
      hexColor: editColor,
      description: swatch.description,
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveEdit();
    if (e.key === "Escape") setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2 p-3 border rounded-lg bg-card">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border-0 p-0"
          />
          <Input
            value={editColor}
            onChange={(e) => setEditColor(e.target.value)}
            className="flex-1 font-mono text-xs h-8"
            placeholder="#000000"
            onKeyDown={handleKeyDown}
          />
        </div>
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="h-8 text-sm"
          placeholder="Color name"
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="flex gap-1">
          <Button size="sm" className="h-7 text-xs flex-1" onClick={handleSaveEdit}>
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group space-y-2 relative">
      {/* Delete button */}
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </Button>

      {/* Color swatch */}
      <div
        className="aspect-square rounded-lg border shadow-sm cursor-pointer relative overflow-hidden transition-transform hover:scale-105"
        style={{ backgroundColor: swatch.hexColor }}
        onClick={() => setIsEditing(true)}
      >
        {/* Copy button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30"
          >
            {copied ? (
              <Check className="h-4 w-4 text-white" />
            ) : (
              <Copy className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-0.5">
        <p className="text-sm font-medium truncate">{swatch.name}</p>
        <p className="text-xs text-muted-foreground uppercase font-mono">
          {swatch.hexColor}
        </p>
      </div>
    </div>
  );
}

/* ======================================================
   Add Color Form (inline)
====================================================== */
interface AddColorFormProps {
  onAdd: (color: ColorSwatch) => void;
  onCancel: () => void;
}

function AddColorForm({ onAdd, onCancel }: AddColorFormProps) {
  const [name, setName] = useState("");
  const [hexColor, setHexColor] = useState("#3b82f6");

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Please enter a color name");
      return;
    }
    onAdd({ name: name.trim(), hexColor });
    setName("");
    setHexColor("#3b82f6");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="space-y-2 p-3 border rounded-lg bg-card border-dashed border-primary/50">
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={hexColor}
          onChange={(e) => setHexColor(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0 p-0"
        />
        <Input
          value={hexColor}
          onChange={(e) => setHexColor(e.target.value)}
          className="flex-1 font-mono text-xs h-8"
          placeholder="#000000"
          onKeyDown={handleKeyDown}
        />
      </div>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-8 text-sm"
        placeholder="Color name (e.g., Ocean Blue)"
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <div className="flex gap-1">
        <Button size="sm" className="h-7 text-xs flex-1" onClick={handleSubmit}>
          Add
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

/* ======================================================
   Color Category Section
====================================================== */
interface ColorCategoryProps {
  title: string;
  description: string;
  categoryKey: keyof ColorSection;
  swatches: ColorSwatch[];
  onAdd: (category: keyof ColorSection, color: ColorSwatch) => void;
  onRemove: (category: keyof ColorSection, index: number) => void;
  onUpdate: (category: keyof ColorSection, index: number, color: ColorSwatch) => void;
}

function ColorCategory({
  title,
  description,
  categoryKey,
  swatches,
  onAdd,
  onRemove,
  onUpdate,
}: ColorCategoryProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {!showAddForm && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {swatches.map((swatch, index) => (
          <ColorSwatchCard
            key={`${swatch.name}-${index}`}
            swatch={swatch}
            onRemove={() => onRemove(categoryKey, index)}
            onUpdate={(updated) => onUpdate(categoryKey, index, updated)}
          />
        ))}

        {showAddForm && (
          <AddColorForm
            onAdd={(color) => {
              onAdd(categoryKey, color);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Empty state placeholder */}
        {swatches.length === 0 && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center hover:border-primary/50 transition-colors cursor-pointer"
          >
            <Plus className="h-5 w-5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ======================================================
   Quick Presets
====================================================== */
const COLOR_PRESETS: Record<string, { name: string; colors: Record<keyof ColorSection, ColorSwatch[]> }> = {
  modern: {
    name: "Modern Blue",
    colors: {
      primary: [
        { name: "Blue 600", hexColor: "#2563eb" },
        { name: "Blue 500", hexColor: "#3b82f6" },
        { name: "Blue 400", hexColor: "#60a5fa" },
      ],
      secondary: [
        { name: "Slate 700", hexColor: "#334155" },
        { name: "Slate 500", hexColor: "#64748b" },
      ],
      accent: [
        { name: "Amber 400", hexColor: "#fbbf24" },
        { name: "Emerald 400", hexColor: "#34d399" },
      ],
      neutral: [
        { name: "White", hexColor: "#ffffff" },
        { name: "Gray 100", hexColor: "#f3f4f6" },
        { name: "Gray 500", hexColor: "#6b7280" },
        { name: "Gray 900", hexColor: "#111827" },
      ],
      semantic: [
        { name: "Success", hexColor: "#22c55e" },
        { name: "Error", hexColor: "#ef4444" },
        { name: "Warning", hexColor: "#f59e0b" },
        { name: "Info", hexColor: "#3b82f6" },
      ],
    },
  },
  warm: {
    name: "Warm Sunset",
    colors: {
      primary: [
        { name: "Rose 600", hexColor: "#e11d48" },
        { name: "Rose 500", hexColor: "#f43f5e" },
        { name: "Rose 400", hexColor: "#fb7185" },
      ],
      secondary: [
        { name: "Orange 500", hexColor: "#f97316" },
        { name: "Amber 500", hexColor: "#f59e0b" },
      ],
      accent: [
        { name: "Purple 500", hexColor: "#a855f7" },
        { name: "Pink 400", hexColor: "#f472b6" },
      ],
      neutral: [
        { name: "White", hexColor: "#ffffff" },
        { name: "Stone 100", hexColor: "#f5f5f4" },
        { name: "Stone 500", hexColor: "#78716c" },
        { name: "Stone 900", hexColor: "#1c1917" },
      ],
      semantic: [
        { name: "Success", hexColor: "#22c55e" },
        { name: "Error", hexColor: "#ef4444" },
        { name: "Warning", hexColor: "#f59e0b" },
        { name: "Info", hexColor: "#06b6d4" },
      ],
    },
  },
  dark: {
    name: "Dark Elegant",
    colors: {
      primary: [
        { name: "Violet 600", hexColor: "#7c3aed" },
        { name: "Violet 500", hexColor: "#8b5cf6" },
        { name: "Violet 400", hexColor: "#a78bfa" },
      ],
      secondary: [
        { name: "Cyan 500", hexColor: "#06b6d4" },
        { name: "Teal 500", hexColor: "#14b8a6" },
      ],
      accent: [
        { name: "Fuchsia 400", hexColor: "#e879f9" },
        { name: "Yellow 300", hexColor: "#fde047" },
      ],
      neutral: [
        { name: "Zinc 950", hexColor: "#09090b" },
        { name: "Zinc 900", hexColor: "#18181b" },
        { name: "Zinc 400", hexColor: "#a1a1aa" },
        { name: "Zinc 50", hexColor: "#fafafa" },
      ],
      semantic: [
        { name: "Success", hexColor: "#4ade80" },
        { name: "Error", hexColor: "#f87171" },
        { name: "Warning", hexColor: "#fbbf24" },
        { name: "Info", hexColor: "#38bdf8" },
      ],
    },
  },
};

/* ======================================================
   Main Colors Section
====================================================== */
interface ColorsSectionProps {
  colorGuide: ColorSection;
  onAddColor: (category: keyof ColorSection, color: ColorSwatch) => void;
  onRemoveColor: (category: keyof ColorSection, index: number) => void;
  onUpdateColor: (category: keyof ColorSection, index: number, color: ColorSwatch) => void;
  onLoadPreset: (colors: ColorSection) => void;
}

export function ColorsSection({
  colorGuide,
  onAddColor,
  onRemoveColor,
  onUpdateColor,
  onLoadPreset,
}: ColorsSectionProps) {
  const hasColors = Object.values(colorGuide).some((arr) => arr.length > 0);

  const categories: {
    key: keyof ColorSection;
    title: string;
    description: string;
  }[] = [
    { key: "primary", title: "Primary Colors", description: "Main brand colors for buttons, links, and key elements" },
    { key: "secondary", title: "Secondary Colors", description: "Supporting colors that complement the primary palette" },
    { key: "accent", title: "Accent Colors", description: "Colors that draw attention to specific elements" },
    { key: "neutral", title: "Neutral Colors", description: "Backgrounds, borders, text, and shadows" },
    { key: "semantic", title: "Semantic Colors", description: "Success (green), Error (red), Warning (yellow), Info (blue)" },
  ];

  return (
    <div className="space-y-8">
      {/* Quick start presets */}
      {!hasColors && (
        <div className="text-center space-y-4 py-6">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
            <Palette className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Start with a preset or build your own</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a preset palette to get started quickly, or add colors manually below.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {Object.entries(COLOR_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                className="h-auto py-3 px-4"
                onClick={() => onLoadPreset(preset.colors)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {preset.colors.primary.slice(0, 3).map((c, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-background"
                        style={{ backgroundColor: c.hexColor }}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{preset.name}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color categories */}
      {categories.map((cat) => (
        <ColorCategory
          key={cat.key}
          title={cat.title}
          description={cat.description}
          categoryKey={cat.key}
          swatches={colorGuide[cat.key]}
          onAdd={onAddColor}
          onRemove={onRemoveColor}
          onUpdate={onUpdateColor}
        />
      ))}
    </div>
  );
}