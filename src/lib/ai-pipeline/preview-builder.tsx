// src/lib/ai-pipeline/preview-builder.tsx

/* ══════════════════════════════════════════════════════════════════════════════
   PREVIEW HTML BUILDER
   
   Builds a self-contained HTML string from generated React/Tailwind code.
   Used by both the generation page iframes and the HTML export.
   ══════════════════════════════════════════════════════════════════════════════ */

import React from "react";

/**
 * Convert generated React+Tailwind code into a standalone HTML page
 * that renders in an iframe with Tailwind CDN.
 */
export function buildPreviewHtml(code: string): string {
  let htmlContent = code;

  htmlContent = htmlContent
    .replace(/export default function GeneratedUI\(\)\s*\{/, "")
    .replace(/\s*return\s*\(/, "")
    .replace(/\s*\);\s*\}$/, "");

  const fontMatch = htmlContent.match(/\/\*\s*Fonts?:\s*([^*]+)\*\//);
  const fontFamilies = fontMatch
    ? fontMatch[1]
        .split(",")
        .map((f: string) => f.trim())
        .filter(Boolean)
    : [];

  const defaultFonts = ["Inter"];
  const allFonts = [...new Set([...defaultFonts, ...fontFamilies])];
  const fontLinks = allFonts
    .map(
      (font) =>
        `<link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">`
    )
    .join("\n  ");

  htmlContent = htmlContent.replace(/\{\/\*\s*Fonts?:[^*]*\*\/\}\s*/g, "");

  htmlContent = htmlContent
    .replace(/className="/g, 'class="')
    .replace(/<input([^>]*)\s*\/>/g, "<input$1>")
    .replace(/<hr([^>]*)\s*\/>/g, "<hr$1>")
    .replace(
      /style=\{\{([^}]+)\}\}/g,
      (_match: string, styleContent: string) => {
        const cssProps = styleContent
          .split(",")
          .map((prop: string) => {
            const [key, value] = prop.split(":").map((s: string) => s.trim());
            if (!key || !value) return "";
            const cssKey = key.replace(
              /[A-Z]/g,
              (m: string) => `-${m.toLowerCase()}`
            );
            const cssValue = /^\d+$/.test(value) ? `${value}px` : value;
            return `${cssKey}: ${cssValue}`;
          })
          .filter(Boolean)
          .join("; ");
        return `style="${cssProps}"`;
      }
    )
    .replace(/strokeLinecap/g, "stroke-linecap")
    .replace(/strokeLinejoin/g, "stroke-linejoin")
    .replace(/strokeWidth/g, "stroke-width")
    .replace(/defaultChecked/g, "checked")
    .replace(/=\{(\d+(?:\.\d+)?)\}/g, '="$1"')
    .replace(/=\{"([^"]+)"\}/g, '="$1"');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"><\/script>
  ${fontLinks}
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      overflow-x: hidden;
    }
    body > * {
      animation: revealSection 0.5s ease forwards;
      opacity: 0;
    }
    @keyframes revealSection {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}

/**
 * Simple syntax highlighter for JSX/TSX code.
 * Returns React elements with colored spans.
 */
export function highlightCode(line: string): React.ReactElement {
  const parts: React.ReactElement[] = [];
  let remaining = line;
  let key = 0;

  const addPart = (text: string, color: string) => {
    if (text) {
      parts.push(
        <span key={key++} style={{ color }}>
          {text}
        </span>
      );
    }
  };

  if (remaining.trimStart().startsWith("//")) {
    addPart(remaining, "#6a9955");
    return <>{parts}</>;
  }

  const patterns: [RegExp, string][] = [
    [/^(export|default|function|return|const|let|var|import|from|type|interface)\b/, "#c586c0"],
    [/^(<\/?)([\w.-]+)/, ""],
    [/^"[^"]*"/, "#ce9178"],
    [/^'[^']*'/, "#ce9178"],
    [/^`[^`]*`/, "#ce9178"],
    [/^className/, "#9cdcfe"],
    [/^[\w-]+=/, ""],
    [/^\d+(\.\d+)?/, "#b5cea8"],
    [/^[{}()\[\]]/, "#ffd700"],
    [/^[=<>!+\-*/&|?:]+/, "#d4d4d4"],
  ];

  while (remaining.length > 0) {
    let matched = false;

    for (const [pattern, color] of patterns) {
      const match = remaining.match(pattern);
      if (match) {
        if (color === "" && match[0].startsWith("<")) {
          addPart(match[1] || "<", "#808080");
          addPart(match[2] || "", "#4ec9b0");
          remaining = remaining.slice(match[0].length);
        } else if (color === "" && match[0].includes("=")) {
          const attrName = match[0].replace("=", "");
          addPart(attrName, "#9cdcfe");
          addPart("=", "#d4d4d4");
          remaining = remaining.slice(match[0].length);
        } else if (color) {
          addPart(match[0], color);
          remaining = remaining.slice(match[0].length);
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      addPart(remaining[0], "#d4d4d4");
      remaining = remaining.slice(1);
    }
  }

  return <>{parts}</>;
}