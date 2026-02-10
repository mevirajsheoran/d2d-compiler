"use client";

import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { undo, redo } from "@/redux/slice/shapes";

export function HistoryButtons() {
  const dispatch = useAppDispatch();
  const pastLength = useAppSelector((state) => state.shapes.past.length);
  const futureLength = useAppSelector((state) => state.shapes.future.length);

  const canUndo = pastLength > 0;
  const canRedo = futureLength > 0;

  const handleUndo = () => {
    if (canUndo) dispatch(undo());
  };

  const handleRedo = () => {
    if (canRedo) dispatch(redo());
  };

  return (
    <TooltipProvider>
      <div className="flex items-center bg-background border rounded-full p-1 shadow-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleUndo}
              disabled={!canUndo}
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-border mx-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleRedo}
              disabled={!canRedo}
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}