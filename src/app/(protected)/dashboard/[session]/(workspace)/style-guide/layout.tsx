"use client";

import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import { combinedSlug } from "@/lib/utils";

interface StyleGuideLayoutProps {
  children: ReactNode;
}

export default function StyleGuideLayout({ children }: StyleGuideLayoutProps) {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");
  const user = useAppSelector((state) => state.profile.user);
  const userSlug = user ? combinedSlug(user.name) : "";

  return (
    <div className="min-h-[calc(100vh-56px)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link
                href={`/dashboard/${userSlug}/canvas?project=${projectId}`}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Style Guide</h1>
              <p className="text-sm text-muted-foreground">
                Configure your design brief, style, colors, and typography
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto py-6 px-4">{children}</div>
    </div>
  );
}