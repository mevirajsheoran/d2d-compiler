"use client";

import { SpeechBubbleShape, updateShape } from "@/redux/slice/shapes";
import { useAppDispatch } from "@/redux/store";
import { useState, useRef, useEffect } from "react";

interface SpeechBubbleProps {
  shape: SpeechBubbleShape;
  isSelected?: boolean;
}

export function SpeechBubble({ shape, isSelected }: SpeechBubbleProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      setIsEditing(false);
    }
  };

  const padding = shape.strokeWidth + 2;
  const tailSize = 16;
  const totalW = shape.w + padding * 2;
  const totalH = shape.h + tailSize + padding * 2;

  const bubbleX = padding;
  const bubbleY = padding;
  const bubbleW = shape.w;
  const bubbleH = shape.h;
  const r = Math.min(12, bubbleW / 4, bubbleH / 4);

  let tailPath = "";
  if (shape.tailDirection === "bottom-left") {
    tailPath = `M ${bubbleX + 20} ${bubbleY + bubbleH} L ${bubbleX + 10} ${bubbleY + bubbleH + tailSize} L ${bubbleX + 40} ${bubbleY + bubbleH}`;
  } else if (shape.tailDirection === "bottom-right") {
    tailPath = `M ${bubbleX + bubbleW - 40} ${bubbleY + bubbleH} L ${bubbleX + bubbleW - 10} ${bubbleY + bubbleH + tailSize} L ${bubbleX + bubbleW - 20} ${bubbleY + bubbleH}`;
  } else if (shape.tailDirection === "top-left") {
    tailPath = `M ${bubbleX + 20} ${bubbleY} L ${bubbleX + 10} ${bubbleY - tailSize} L ${bubbleX + 40} ${bubbleY}`;
  } else {
    tailPath = `M ${bubbleX + bubbleW - 40} ${bubbleY} L ${bubbleX + bubbleW - 10} ${bubbleY - tailSize} L ${bubbleX + bubbleW - 20} ${bubbleY}`;
  }

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x - padding,
        top: shape.y - padding,
        width: totalW,
        height: totalH,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <svg width={totalW} height={totalH} style={{ overflow: "visible" }}>
        <rect
          x={bubbleX}
          y={bubbleY}
          width={bubbleW}
          height={bubbleH}
          rx={r}
          ry={r}
          fill={shape.fill || "#ffffff"}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
        />
        <path
          d={tailPath}
          fill={shape.fill || "#ffffff"}
          stroke={shape.stroke}
          strokeWidth={shape.strokeWidth}
          strokeLinejoin="round"
        />
        <line
          x1={shape.tailDirection.includes("left") ? bubbleX + 21 : bubbleX + bubbleW - 39}
          y1={shape.tailDirection.includes("bottom") ? bubbleY + bubbleH : bubbleY}
          x2={shape.tailDirection.includes("left") ? bubbleX + 39 : bubbleX + bubbleW - 21}
          y2={shape.tailDirection.includes("bottom") ? bubbleY + bubbleH : bubbleY}
          stroke={shape.fill || "#ffffff"}
          strokeWidth={shape.strokeWidth + 1}
        />
      </svg>

      {/* Text content - editable */}
      <div
        style={{
          position: "absolute",
          left: bubbleX + 12,
          top: bubbleY + 8,
          width: bubbleW - 24,
          height: bubbleH - 16,
          overflow: "hidden",
        }}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={shape.text}
            onChange={(e) =>
              dispatch(updateShape({ id: shape.id, patch: { text: e.target.value } }))
            }
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none resize-none w-full h-full"
            style={{
              margin: 0,
              color: "#1a1a1a",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.4,
              wordBreak: "break-word",
              padding: 0,
            }}
          />
        ) : (
          <p
            style={{
              margin: 0,
              color: "#1a1a1a",
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              lineHeight: 1.4,
              wordBreak: "break-word",
              userSelect: "none",
            }}
          >
            {shape.text || "Hello!"}
          </p>
        )}
      </div>
    </div>
  );
}