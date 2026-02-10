// src/components/landing/live-canvas.tsx
"use client";

import { useRef, useEffect, useState, useCallback } from "react";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

const DEMO_COLORS = ["#a78bfa", "#818cf8", "#22d3ee", "#f472b6", "#ffffff"];

export function LiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const demoAnimRef = useRef<number>(0);
  const demoStrokesRef = useRef<Stroke[]>([]);

  // Get canvas coordinates
  const getCanvasPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent): Point | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let clientX: number, clientY: number;

      if ("touches" in e) {
        if (e.touches.length === 0) return null;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    []
  );

  // Draw everything on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dot grid
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let x = 0; x < canvas.width; x += 20) {
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw all completed strokes
    const allStrokes = [...demoStrokesRef.current, ...strokes];
    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });

    // Draw current stroke
    if (currentStroke && currentStroke.points.length >= 2) {
      ctx.beginPath();
      ctx.strokeStyle = currentStroke.color;
      ctx.lineWidth = currentStroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.moveTo(currentStroke.points[0].x, currentStroke.points[0].y);
      for (let i = 1; i < currentStroke.points.length; i++) {
        ctx.lineTo(currentStroke.points[i].x, currentStroke.points[i].y);
      }
      ctx.stroke();
    }
  }, [strokes, currentStroke]);

  // Redraw whenever strokes change
  useEffect(() => {
    draw();
  }, [draw]);

  // Auto demo animation
  useEffect(() => {
    if (hasInteracted) return;

    const demoShapes: Stroke[] = [];
    let step = 0;
    const totalSteps = 120;

    const animateDemo = () => {
      step++;

      if (step <= 30) {
        // Draw rectangle top line
        const progress = step / 30;
        const x1 = 60;
        const y1 = 40;
        const x2 = x1 + 200 * progress;
        if (!demoShapes[0]) {
          demoShapes[0] = { points: [], color: "#a78bfa", width: 2 };
        }
        demoShapes[0].points.push({ x: x2, y: y1 });
      } else if (step <= 50) {
        // Right line
        const progress = (step - 30) / 20;
        const y = 40 + 100 * progress;
        if (!demoShapes[1]) {
          demoShapes[1] = { points: [], color: "#a78bfa", width: 2 };
        }
        demoShapes[1].points.push({ x: 260, y });
      } else if (step <= 80) {
        // Bottom line
        const progress = (step - 50) / 30;
        const x = 260 - 200 * progress;
        if (!demoShapes[2]) {
          demoShapes[2] = { points: [], color: "#a78bfa", width: 2 };
        }
        demoShapes[2].points.push({ x, y: 140 });
      } else if (step <= 100) {
        // Left line
        const progress = (step - 80) / 20;
        const y = 140 - 100 * progress;
        if (!demoShapes[3]) {
          demoShapes[3] = { points: [], color: "#a78bfa", width: 2 };
        }
        demoShapes[3].points.push({ x: 60, y });
      } else if (step <= 110) {
        // Small button inside
        const progress = (step - 100) / 10;
        const x = 100 + 80 * progress;
        if (!demoShapes[4]) {
          demoShapes[4] = { points: [], color: "#22d3ee", width: 2 };
        }
        demoShapes[4].points.push({ x, y: 100 });
      }

      demoStrokesRef.current = demoShapes.filter(Boolean);
      draw();

      if (step < totalSteps && !hasInteracted) {
        demoAnimRef.current = requestAnimationFrame(animateDemo);
      }
    };

    // Start after 1 second
    const timeout = setTimeout(() => {
      demoAnimRef.current = requestAnimationFrame(animateDemo);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(demoAnimRef.current);
    };
  }, [hasInteracted, draw]);

  // Handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * 2;
      canvas.height = parent.clientHeight * 2;
      draw();
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!hasInteracted) {
      setHasInteracted(true);
      demoStrokesRef.current = [];
      cancelAnimationFrame(demoAnimRef.current);
    }

    const point = getCanvasPoint(e);
    if (!point) return;

    setIsDrawing(true);
    setCurrentStroke({
      points: [point],
      color: DEMO_COLORS[colorIndex],
      width: 3,
    });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !currentStroke) return;
    const point = getCanvasPoint(e);
    if (!point) return;

    setCurrentStroke({
      ...currentStroke,
      points: [...currentStroke.points, point],
    });
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);

    if (currentStroke.points.length >= 2) {
      setStrokes((prev) => [...prev, currentStroke]);
    }

    setCurrentStroke(null);
    setColorIndex((prev) => (prev + 1) % DEMO_COLORS.length);
  };

  const clearCanvas = () => {
    setStrokes([]);
    demoStrokesRef.current = [];
    setColorIndex(0);
  };

  return (
    <div className="relative group">
      {/* Canvas */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#080808]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-gray-600 font-mono">Try it — Draw here</span>
            {/* Color dots */}
            <div className="flex items-center gap-1.5">
              {DEMO_COLORS.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setColorIndex(i)}
                  className={`w-3 h-3 rounded-full transition-transform ${
                    i === colorIndex ? "scale-125 ring-1 ring-white/30 ring-offset-1 ring-offset-black" : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          {(strokes.length > 0 || demoStrokesRef.current.length > 0) && (
            <button
              onClick={clearCanvas}
              className="text-[11px] text-gray-600 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Drawing area */}
        <div className="h-[200px] sm:h-[260px] relative">
          <canvas
            ref={canvasRef}
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
            className="absolute inset-0 w-full h-full cursor-crosshair"
          />

          {/* Hint overlay - only show if no interaction */}
          {!hasInteracted && strokes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                  Drawing demo...
                </div>
              </div>
            </div>
          )}

          {hasInteracted && strokes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-xs text-gray-600">Draw something!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}