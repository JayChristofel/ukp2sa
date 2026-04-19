import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function DonorPortfolioLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Hero Impact Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-4">
            <Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800 opacity-50" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
              <Skeleton className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            {[1, 2].map(i => (
                <Card key={i} className="p-8 border-none shadow-3xl rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden relative min-h-[400px]">
                    <Skeleton className="absolute top-0 right-0 size-64 rounded-full bg-slate-50 dark:bg-slate-800/20 -translate-y-1/2 translate-x-1/2" />
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className="space-y-3">
                             <Skeleton className="h-6 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
                             <Skeleton className="h-3 w-40 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-full bg-emerald-500/10" />
                    </div>
                    <div className="space-y-6 relative z-10 pt-10">
                        <Skeleton className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                        <div className="grid grid-cols-3 gap-6 pt-10">
                            {[1, 2, 3].map(j => (
                                <div key={j} className="space-y-2">
                                    <Skeleton className="h-3 w-full rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                                    <Skeleton className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            ))}
        </div>
        <div className="space-y-8">
            <Card className="p-8 border-none shadow-2xl rounded-[3rem] bg-navy dark:bg-slate-900 text-white min-h-[600px] space-y-8">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-xl bg-slate-700" />
                    <Skeleton className="h-6 w-40 rounded-lg bg-slate-700" />
                </div>
                <div className="space-y-8 pt-6">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex gap-4">
                             <Skeleton className="size-10 rounded-xl bg-slate-700" />
                             <div className="space-y-2 flex-1">
                                 <Skeleton className="h-3 w-full rounded-lg bg-slate-700" />
                                 <Skeleton className="h-3 w-2/3 rounded-lg bg-slate-700 opacity-40" />
                             </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
