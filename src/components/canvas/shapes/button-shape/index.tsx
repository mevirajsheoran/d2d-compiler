"use client";

import { ButtonShapeType, updateShape } from "@/redux/slice/shapes";
import { useAppDispatch } from "@/redux/store";
import { useState, useRef, useEffect } from "react";

interface ButtonShapeProps {
  shape: ButtonShapeType;
  isSelected?: boolean;
}

export function ButtonShape({ shape, isSelected }: ButtonShapeProps) {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateShape({ id: shape.id, patch: { text: e.target.value } }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape" || e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const getStyles = () => {
    switch (shape.variant) {
      case "primary":
        return {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          border: "none",
        };
      case "secondary":
        return {
          backgroundColor: "#6b7280",
          color: "#ffffff",
          border: "none",
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: "#ffffff",
          border: "2px solid #ffffff",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "#ffffff",
          border: "none",
        };
      default:
        return {
          backgroundColor: "#3b82f6",
          color: "#ffffff",
          border: "none",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: shape.x,
        top: shape.y,
        width: shape.w,
        height: shape.h,
        ...styles,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        cursor: "default",
      }}
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          value={shape.text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-center w-full"
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: styles.color,
            fontFamily: "inherit",
            padding: "0 8px",
          }}
        />
      ) : (
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            userSelect: "none",
          }}
        >
          {shape.text || "Button"}
        </span>
      )}
    </div>
  );
}