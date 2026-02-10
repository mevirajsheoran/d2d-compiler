"use client";

import { StickyNoteShape, updateShape } from "@/redux/slice/shapes";
import { useAppDispatch } from "@/redux/store";
import { useState, useRef, useEffect } from "react";

interface StickyNoteProps {
  shape: StickyNoteShape;
  isSelected?: boolean;
}

export function StickyNote({ shape, isSelected }: StickyNoteProps) {
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

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        backgroundColor: shape.noteColor,
        borderRadius: 4,
        boxShadow: "2px 2px 8px rgba(0,0,0,0.15)",
        padding: 12,
        overflow: "hidden",
      }}
      onDoubleClick={handleDoubleClick}
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
          {shape.text || "Note..."}
        </p>
      )}
    </div>
  );
}