"use client";

import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

interface GenerateButtonProps {
  session: string;
  projectId: string;
}

export default function GenerateButton({ session, projectId }: GenerateButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    // Navigate to style guide page where generation happens
    router.push(
      `/dashboard/${session}/style-guide?project=${projectId}`
    );
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 px-7 py-3.5 
                 bg-gradient-to-b from-blue-500 to-blue-600 text-white 
                 rounded-2xl shadow-2xl shadow-blue-500/30
                 text-base font-semibold tracking-tight
                 hover:shadow-3xl hover:shadow-blue-500/40 hover:-translate-y-0.5
                 active:translate-y-0 active:shadow-xl
                 transition-all duration-200
                 group"
    >
      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      Generate Design
    </button>
  );
}