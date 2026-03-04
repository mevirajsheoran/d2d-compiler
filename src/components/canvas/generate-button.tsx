"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { useAppSelector } from "@/redux/store";

interface GenerateButtonProps {
  session: string;
  projectId: string;
}

export default function GenerateButton({ session, projectId }: GenerateButtonProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Read current state from Redux (same data auto-save sends)
  const shapesState = useAppSelector((state) => state.shapes);
  const viewportState = useAppSelector((state) => state.viewport);
  const userId = useAppSelector((state) => state.profile.user?.id);

  const handleClick = async () => {
    if (isSaving) return;

    setIsSaving(true);

    // ── Force save canvas to DB before navigating ──
    try {
      if (userId) {
        const sketchesData = JSON.stringify({
          shapes: shapesState.shapes,
          tool: shapesState.tool,
          frameCounter: shapesState.frameCounter,
        });

        const viewportData = JSON.stringify({
          translate: viewportState.translate,
          scale: viewportState.scale,
        });

        const response = await fetch("/api/project", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId,
            userId,
            shapes: sketchesData,
            viewportData,
          }),
        });

        if (!response.ok) {
          console.warn("[GenerateButton] Save failed, proceeding anyway");
        }
      }
    } catch (error) {
      console.warn("[GenerateButton] Save error, proceeding anyway:", error);
    }

    // ── Navigate to style guide ──
    router.push(
      `/dashboard/${session}/style-guide?project=${projectId}`
    );

    setIsSaving(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isSaving}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-7 py-3.5 
                 bg-gradient-to-b from-blue-500 to-blue-600 text-white 
                 rounded-2xl shadow-2xl shadow-blue-500/30
                 text-base font-semibold tracking-tight
                 hover:shadow-3xl hover:shadow-blue-500/40 hover:-translate-y-0.5
                 active:translate-y-0 active:shadow-xl
                 transition-all duration-200
                 disabled:opacity-70 disabled:cursor-not-allowed
                 disabled:hover:translate-y-0 disabled:hover:shadow-2xl
                 group"
    >
      {isSaving ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Generate Design
        </>
      )}
    </button>
  );
}