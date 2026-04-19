import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function IntelLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-glow-primary" />
        </div>
      </div>

      {/* Main Intel Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Card className="p-0 border-none shadow-3xl rounded-[3rem] bg-black h-[500px] overflow-hidden relative">
          <Skeleton className="size-full bg-slate-900" />
          <div className="absolute top-10 left-10 p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-3">
             <Skeleton className="h-4 w-32 rounded-lg bg-slate-700" />
             <Skeleton className="h-6 w-48 rounded-lg bg-slate-600" />
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 space-y-8 flex-1">
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
                            <Skeleton className="h-3 w-48 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    </div>
                ))}
            </div>
          </Card>
          <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-navy dark:bg-slate-950 text-white space-y-6">
              <Skeleton className="h-6 w-48 rounded-lg bg-slate-700" />
              <div className="flex gap-4">
                  <div className="h-16 flex-1 rounded-2xl bg-slate-800" />
                  <div className="h-16 flex-1 rounded-2xl bg-slate-800 opacity-60" />
                  <div className="h-16 flex-1 rounded-2xl bg-slate-800 opacity-40" />
              </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
