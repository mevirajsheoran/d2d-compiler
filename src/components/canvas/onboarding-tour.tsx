"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "d2d-canvas-tour-completed";

// ─── Step definitions ────────────────────────────────────────
const STEPS = [
  {
    id: "welcome",
    title: "Welcome to D2D ✨",
    subtitle: "Turn sketches into production React code",
    content: (
      <div className="space-y-4">
        <p className="text-sm text-neutral-400 leading-relaxed">
          D2D transforms hand-drawn wireframes into production-ready
          React + Tailwind CSS components — instantly and deterministically.
        </p>
        <div className="grid grid-cols-3 gap-3 pt-2">
          {(["Draw", "Style", "Generate"] as const).map((step, i) => (
            <div
              key={step}
              className="flex flex-col items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400">
                {i + 1}
              </span>
              <span className="text-xs font-medium text-neutral-300">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "frame",
    title: "Step 1: Draw a Frame",
    subtitle: "The Frame is your artboard — everything starts here",
    content: (
      <div className="space-y-4">
        {/* Visual illustration */}
        <div className="relative mx-auto h-44 w-full max-w-sm rounded-xl border-2 border-dashed border-blue-500/40 bg-blue-500/5 p-4">
          <div className="absolute -top-3 left-4 rounded-md bg-blue-500 px-2 py-0.5 text-[10px] font-semibold text-white">
            Frame
          </div>
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="h-4 w-24 rounded bg-neutral-700/60" />
            <div className="h-3 w-32 rounded bg-neutral-700/40" />
            <div className="mt-2 h-6 w-16 rounded-md bg-blue-500/30" />
          </div>
          {/* Shape outside frame */}
          <div className="absolute -right-8 top-4 flex flex-col items-center gap-1 opacity-40">
            <div className="h-5 w-12 rounded bg-red-500/30" />
            <span className="text-[9px] text-red-400">ignored</span>
          </div>
        </div>

        <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-400">✦</span>
            <p className="text-xs text-neutral-300">
              Select the{" "}
              <kbd className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-blue-400">
                Frame
              </kbd>{" "}
              tool from the toolbar and drag to create one.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-amber-400">⚠</span>
            <p className="text-xs text-amber-300/90">
              Only shapes drawn <strong>inside</strong> a frame get converted to
              code. Anything outside is ignored.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "shapes",
    title: "Step 2: Draw UI Elements",
    subtitle: "Each shape maps to a UI component",
    content: (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { draw: "Large Rectangle", becomes: "Container / Section", icon: "▭" },
            { draw: "Small Rectangle", becomes: "Button", icon: "▬" },
            { draw: "Wide Rectangle", becomes: "Input Field", icon: "▭" },
            { draw: "Text", becomes: "Heading / Paragraph", icon: "T" },
            { draw: "Circle", becomes: "Avatar / Icon", icon: "○" },
            { draw: "Image Placeholder", becomes: "Image", icon: "🖼" },
          ].map((item) => (
            <div
              key={item.draw}
              className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/50 p-2.5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-sm">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-neutral-200">
                  {item.draw}
                </p>
                <p className="truncate text-[10px] text-neutral-500">
                  → {item.becomes}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-500 italic">
          The pipeline analyzes size &amp; position to determine each shape&apos;s role.
        </p>
      </div>
    ),
  },
  {
    id: "generate",
    title: "Step 3: Style & Generate",
    subtitle: "Configure your design, then export production code",
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          {[
            {
              step: "Click Generate",
              desc: "The big blue button saves your canvas and opens the Style Guide",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              step: "Style Guide",
              desc: "Pick colors, fonts, design preset, and describe your brand",
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
            {
              step: "Generate Design",
              desc: "Click Generate — get React + Tailwind code in under 300ms",
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-3 rounded-lg border border-neutral-800 ${item.bg} p-3`}
            >
              <span className={`text-sm font-semibold ${item.color} shrink-0`}>
                {item.step}
              </span>
              <p className="text-xs text-neutral-400">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
          <p className="text-xs text-emerald-400">
            🎉 You&apos;re all set! Start by drawing a Frame on the canvas.
          </p>
        </div>
      </div>
    ),
  },
];

// ─── Component ───────────────────────────────────────────────
export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        // Small delay so the canvas renders first
        const timer = setTimeout(() => setIsOpen(true), 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable (e.g., incognito)
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        style={{ animation: "d2dFadeIn 0.3s ease-out" }}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md mx-4"
        style={{ animation: "d2dSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-blue-500/5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800/60 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-100">
                {step.title}
              </h2>
              <p className="text-sm text-neutral-500">{step.subtitle}</p>
            </div>
            <button
              onClick={handleClose}
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">{step.content}</div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-neutral-800/60 px-6 py-4">
            {/* Step indicators */}
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-6 bg-blue-500"
                      : i < currentStep
                        ? "w-1.5 bg-blue-500/40"
                        : "w-1.5 bg-neutral-700"
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep === 0 && (
                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 text-sm text-neutral-500 hover:text-neutral-300 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  Skip tour
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                {isLast ? "Start Drawing ✨" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Call this to reset the tour (e.g., from a help button).
 * After calling, reload or remount the canvas page.
 */
export function resetOnboardingTour() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}