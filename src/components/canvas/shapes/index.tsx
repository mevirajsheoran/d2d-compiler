"use client";

import { Shape } from "@/redux/slice/shapes";
import { Frame } from "./frame";
import { Rectangle } from "./rectangle";
import { RoundedRectangle } from "./rounded-rectangle";
import { Ellipse } from "./ellipse";
import { CircleComponent } from "./circle";
import { Triangle } from "./triangle";
import { Star } from "./star";
import { Polygon } from "./polygon";
import { Stroke } from "./stroke";
import { Highlighter } from "./highlighter";
import { Arrow } from "./arrow";
import { Line } from "./line";
import { Connector } from "./connector";
import { Divider } from "./divider";
import { Text } from "./text";
import { StickyNote } from "./sticky-note";
import { SpeechBubble } from "./speech-bubble";
import { ImagePlaceholder } from "./image-placeholder";
import { VideoPlaceholder } from "./video-placeholder";
import { ChartPlaceholder } from "./chart-placeholder";
import { ButtonShape } from "./button-shape";
import { InputField } from "./input-field";
import { Checkbox } from "./checkbox";
import { HamburgerMenu } from "./hamburger-menu";
import { DeviceFrame } from "./device-frame";

interface ShapeRendererProps {
  shape: Shape;
  isSelected?: boolean;
}

export function ShapeRenderer({ shape, isSelected = false }: ShapeRendererProps) {
  switch (shape.type) {
    case "frame":
      return <Frame shape={shape} isSelected={isSelected} />;
    case "rect":
      return <Rectangle shape={shape} isSelected={isSelected} />;
    case "roundedRect":
      return <RoundedRectangle shape={shape} isSelected={isSelected} />;
    case "ellipse":
      return <Ellipse shape={shape} isSelected={isSelected} />;
    case "circle":
      return <CircleComponent shape={shape} isSelected={isSelected} />;
    case "triangle":
      return <Triangle shape={shape} isSelected={isSelected} />;
    case "star":
      return <Star shape={shape} isSelected={isSelected} />;
    case "polygon":
      return <Polygon shape={shape} isSelected={isSelected} />;
    case "freedraw":
      return <Stroke shape={shape} isSelected={isSelected} />;
    case "highlighter":
      return <Highlighter shape={shape} isSelected={isSelected} />;
    case "arrow":
      return <Arrow shape={shape} isSelected={isSelected} />;
    case "line":
      return <Line shape={shape} isSelected={isSelected} />;
    case "connector":
      return <Connector shape={shape} isSelected={isSelected} />;
    case "divider":
      return <Divider shape={shape} isSelected={isSelected} />;
    case "text":
      return <Text shape={shape} isSelected={isSelected} />;
    case "stickyNote":
      return <StickyNote shape={shape} isSelected={isSelected} />;
    case "speechBubble":
      return <SpeechBubble shape={shape} isSelected={isSelected} />;
    case "imagePlaceholder":
      return <ImagePlaceholder shape={shape} isSelected={isSelected} />;
    case "videoPlaceholder":
      return <VideoPlaceholder shape={shape} isSelected={isSelected} />;
    case "chartPlaceholder":
      return <ChartPlaceholder shape={shape} isSelected={isSelected} />;
    case "buttonShape":
      return <ButtonShape shape={shape} isSelected={isSelected} />;
    case "inputField":
      return <InputField shape={shape} isSelected={isSelected} />;
    case "checkbox":
      return <Checkbox shape={shape} isSelected={isSelected} />;
    case "hamburgerMenu":
      return <HamburgerMenu shape={shape} isSelected={isSelected} />;
    case "deviceFrame":
      return <DeviceFrame shape={shape} isSelected={isSelected} />;
    default:
      return null;
  }
}