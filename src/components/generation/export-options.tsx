"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Download, FileText, Braces, Check } from "lucide-react";
import { toast } from "sonner";
import { buildPreviewHtml } from "@/lib/ai-pipeline/preview-builder";

interface ExportOptionsProps {
  code: string;
  presetName?: string;
}

export function ExportOptions({ code, presetName }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);

  // ─── Copy Code ───
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  // ─── Download TSX ───
  const handleDownloadTSX = () => {
    const blob = new Blob([code], { type: "text/typescript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "GeneratedUI.tsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded GeneratedUI.tsx");
  };

  // ─── Download HTML ───
  const handleDownloadHTML = () => {
    const html = buildPreviewHtml(code);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-design.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded generated-design.html");
  };

  // ─── Download Design Tokens ───
  const handleDownloadTokens = () => {
    const tokens = {
      generatedBy: "D2D v3.0",
      preset: presetName || "startup-modern",
      exportedAt: new Date().toISOString(),
      note: "Use these tokens to match the generated design in your own project.",
    };

    const blob = new Blob([JSON.stringify(tokens, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "design-tokens.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded design-tokens.json");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleCopy}>
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            Copy Code
          </>
        )}
      </Button>

      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleDownloadTSX}>
        <Download className="h-3.5 w-3.5" />
        Download TSX
      </Button>

      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleDownloadHTML}>
        <FileText className="h-3.5 w-3.5" />
        Download HTML
      </Button>

      <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={handleDownloadTokens}>
        <Braces className="h-3.5 w-3.5" />
        Design Tokens
      </Button>
    </div>
  );
}