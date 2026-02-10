// src/hooks/use-tilt.ts
"use client";

import { useRef, useEffect } from "react";

interface TiltOptions {
  max?: number;
  scale?: number;
  speed?: number;
  glare?: boolean;
  maxGlare?: number;
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const ref = useRef<T>(null);

  const {
    max = 15,
    scale = 1.02,
    speed = 400,
    glare = true,
    maxGlare = 0.3,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let glareElement: HTMLDivElement | null = null;

    if (glare) {
      glareElement = document.createElement("div");
      glareElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(
          135deg,
          rgba(255,255,255,${maxGlare}) 0%,
          rgba(255,255,255,0) 60%
        );
        opacity: 0;
        transition: opacity 0.3s ease-out;
      `;
      element.style.position = "relative";
      element.style.overflow = "hidden";
      element.appendChild(glareElement);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (+1 * max * mouseY) / (rect.height / 2);
      const rotateY = (-1 * max * mouseX) / (rect.width / 2);

      element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
      element.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${scale}, ${scale}, ${scale})
      `;

      if (glareElement) {
        const glareX = (mouseX / rect.width) * 100 + 50;
        const glareY = (mouseY / rect.height) * 100 + 50;
        glareElement.style.background = `
          radial-gradient(
            circle at ${glareX}% ${glareY}%,
            rgba(255,255,255,${maxGlare}) 0%,
            rgba(255,255,255,0) 60%
          )
        `;
        glareElement.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      element.style.transition = `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
      element.style.transform = `
        perspective(1000px)
        rotateX(0deg)
        rotateY(0deg)
        scale3d(1, 1, 1)
      `;

      if (glareElement) {
        glareElement.style.opacity = "0";
      }
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
      if (glareElement && element.contains(glareElement)) {
        element.removeChild(glareElement);
      }
    };
  }, [max, scale, speed, glare, maxGlare]);

  return ref;
}