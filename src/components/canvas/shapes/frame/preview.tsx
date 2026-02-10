interface FramePreviewProps {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function FramePreview({ x, y, w, h }: FramePreviewProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
      }}
    >
      <div className="absolute inset-0 border-2 border-dashed border-blue-500 bg-blue-500/5 rounded-sm" />
      <div className="absolute -top-5 left-0 text-xs text-blue-500 font-medium">
        New Frame
      </div>
    </div>
  );
}