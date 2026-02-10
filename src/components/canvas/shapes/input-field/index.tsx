"use client";

import { InputFieldShape, updateShape } from "@/redux/slice/shapes";
import { useAppDispatch } from "@/redux/store";
import { useState, useRef, useEffect } from "react";

interface InputFieldProps {
  shape: InputFieldShape;
  isSelected?: boolean;
}

export function InputField({ shape, isSelected }: InputFieldProps) {
  const dispatch = useAppDispatch();
  const [editingField, setEditingField] = useState<"label" | "placeholder" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  const handleBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Enter") {
      setEditingField(null);
    }
  };

  const labelHeight = 20;
  const inputHeight = shape.h - labelHeight - 4;

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
      }}
    >
      {/* Label - double click to edit */}
      <div
        style={{
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          color: "#d1d5db",
          marginBottom: 4,
          height: labelHeight,
          lineHeight: `${labelHeight}px`,
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditingField("label");
        }}
      >
        {editingField === "label" ? (
          <input
            ref={inputRef}
            value={shape.label}
            onChange={(e) =>
              dispatch(updateShape({ id: shape.id, patch: { label: e.target.value } }))
            }
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none w-full"
            style={{
              fontSize: 12,
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              color: "#d1d5db",
              padding: 0,
              height: labelHeight,
              lineHeight: `${labelHeight}px`,
            }}
          />
        ) : (
          <span style={{ userSelect: "none" }}>{shape.label}</span>
        )}
      </div>

      {/* Input box - double click to edit placeholder */}
      <div
        style={{
          width: "100%",
          height: inputHeight,
          border: `${shape.strokeWidth}px solid ${shape.stroke}`,
          borderRadius: 6,
          backgroundColor: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditingField("placeholder");
        }}
      >
        {editingField === "placeholder" ? (
          <input
            ref={editingField === "placeholder" ? inputRef : undefined}
            value={shape.placeholder}
            onChange={(e) =>
              dispatch(updateShape({ id: shape.id, patch: { placeholder: e.target.value } }))
            }
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none w-full"
            style={{
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              color: "#9ca3af",
              padding: 0,
            }}
          />
        ) : (
          <span
            style={{
              fontSize: 14,
              fontFamily: "Inter, sans-serif",
              color: "#6b7280",
              userSelect: "none",
            }}
          >
            {shape.placeholder}
          </span>
        )}
      </div>
    </div>
  );
}