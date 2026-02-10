// src/components/landing/cursor.tsx
"use client";

import { useEffect, useRef } from "react";

export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const visible = useRef(false);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    // Skip on mobile/tablet
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) {
        visible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = "1";
        if (ringRef.current) ringRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      visible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
    };

    const animate = () => {
      // Dot follows closely
      dotPos.current.x += (mouseRef.current.x - dotPos.current.x) * 0.15;
      dotPos.current.y += (mouseRef.current.y - dotPos.current.y) * 0.15;

      // Ring follows slowly
      ringPos.current.x += (mouseRef.current.x - ringPos.current.x) * 0.08;
      ringPos.current.y += (mouseRef.current.y - ringPos.current.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px)`;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      {/* Small dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none opacity-0 mix-blend-difference"
        style={{ transition: "opacity 0.3s" }}
      >
        <div className="w-2 h-2 rounded-full bg-white" />
      </div>

      {/* Larger ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[100] pointer-events-none opacity-0 mix-blend-difference"
        style={{ transition: "opacity 0.3s" }}
      >
        <div className="w-10 h-10 rounded-full border border-white/50" />
      </div>
    </>
  );
}