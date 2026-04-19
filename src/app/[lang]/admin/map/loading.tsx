import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function MapLoading() {
  return (
    <div className="space-y-10 pb-10 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-glow-primary opacity-50" />
        </div>
      </div>

      {/* Hero Map Container Skeleton */}
      <Card className="p-0 border-none shadow-3xl rounded-[3rem] bg-white dark:bg-slate-900 h-[600px] overflow-hidden relative border-4 border-slate-100 dark:border-slate-800">
        <Skeleton className="size-full bg-slate-100 dark:bg-slate-800/50" />
        
        {/* Floating Controls Overlay Skeleton */}
        <div className="absolute top-8 left-8 space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="size-12 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xl" />
          ))}
        </div>

        <div className="absolute bottom-8 right-8 w-80 p-8 rounded-[2rem] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-2xl space-y-6">
          <Skeleton className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                <Skeleton className="h-4 w-12 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Operational Feed Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-3 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
              <Skeleton className="h-4 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
