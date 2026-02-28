"use client";

import { cn } from "@/lib/utils";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewportSize = "desktop" | "tablet" | "mobile";

interface ResponsiveToggleProps {
  value: ViewportSize;
  onChange: (value: ViewportSize) => void;
}

const VIEWPORTS: { value: ViewportSize; label: string; icon: typeof Monitor; width: string }[] = [
  { value: "desktop", label: "Desktop", icon: Monitor, width: "1440px" },
  { value: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
  { value: "mobile", label: "Mobile", icon: Smartphone, width: "375px" },
];

export function ResponsiveToggle({ value, onChange }: ResponsiveToggleProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-muted">
      {VIEWPORTS.map((vp) => {
        const Icon = vp.icon;
        const isActive = value === vp.value;

        return (
          <Button
            key={vp.value}
            variant="ghost"
            size="sm"
            onClick={() => onChange(vp.value)}
            className={cn(
              "h-7 px-2.5 text-xs gap-1.5 rounded-md",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{vp.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

export function getViewportWidth(size: ViewportSize): string {
  switch (size) {
    case "desktop":
      return "100%";
    case "tablet":
      return "768px";
    case "mobile":
      return "375px";
  }
}