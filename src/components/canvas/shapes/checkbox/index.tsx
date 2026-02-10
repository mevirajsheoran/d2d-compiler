"use client";

import { CheckboxShape, updateShape } from "@/redux/slice/shapes";
import { useAppDispatch } from "@/redux/store";
import { useState, useRef, useEffect } from "react";

interface CheckboxProps {
  shape: CheckboxShape;
  isSelected?: boolean;
}

export function Checkbox({ shape, isSelected }: CheckboxProps) {
  const dispatch = useAppDispatch();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingLabel && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingLabel]);

  const handleCheckToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(updateShape({ id: shape.id, patch: { checked: !shape.checked } }));
  };

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingLabel(true);
  };

  const handleBlur = () => {
    setIsEditingLabel(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Enter") {
      setIsEditingLabel(false);
    }
  };

  const boxSize = 18;

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Checkbox box - click to toggle */}
      <div
        style={{
          width: boxSize,
          height: boxSize,
          border: `${shape.strokeWidth}px solid ${shape.stroke}`,
          borderRadius: 4,
          backgroundColor: shape.checked ? "#3b82f6" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          cursor: "pointer",
        }}
        onClick={handleCheckToggle}
      >
        {shape.checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>

      {/* Label - double click to edit */}
      {isEditingLabel ? (
        <input
          ref={inputRef}
          value={shape.label}
          onChange={(e) =>
            dispatch(updateShape({ id: shape.id, patch: { label: e.target.value } }))
          }
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-1"
          style={{
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            color: "#d1d5db",
            padding: 0,
          }}
        />
      ) : (
        <span
          style={{
            fontSize: 14,
            fontFamily: "Inter, sans-serif",
            color: "#d1d5db",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
          onDoubleClick={handleLabelDoubleClick}
        >
          {shape.label}
        </span>
      )}
    </div>
  );
}