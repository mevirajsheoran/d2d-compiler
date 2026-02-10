interface GenericBoundedPreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
  borderRadius?: number;
}

export function GenericBoundedPreview({ x, y, w, h, borderRadius = 0 }: GenericBoundedPreviewProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        border: "2px dashed hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        borderRadius,
      }}
    />
  );
}