// src/app/(protected)/dashboard/[session]/loading.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function SessionLoading() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-4 w-72 bg-muted rounded animate-pulse mt-2" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-[4/3] bg-muted rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}