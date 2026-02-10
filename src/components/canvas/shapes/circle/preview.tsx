interface CirclePreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function CirclePreview({ x, y, w, h }: CirclePreviewProps) {
  const size = Math.min(w, h);
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        border: "2px dashed hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        borderRadius: "50%",
      }}
    />
  );
}