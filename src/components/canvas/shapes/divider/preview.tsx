interface DividerPreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function DividerPreview({ x, y, w, h }: DividerPreviewProps) {
  const isHorizontal = w > h;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: isHorizontal ? w : 2,
        height: isHorizontal ? 2 : h,
        backgroundColor: "hsl(var(--primary))",
        opacity: 0.5,
      }}
    />
  );
}