import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function TrackingLoading() {
  return (
    <div className="space-y-12 pb-20 animate-pulse font-display">
      {/* Search Header Skeleton */}
      <section className="p-10 bg-primary/5 rounded-[3.5rem] border-2 border-dashed border-primary/20">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
             <Skeleton className="h-10 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800 mx-auto" />
             <Skeleton className="h-4 w-60 rounded-lg bg-slate-200 dark:bg-slate-800 mx-auto" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
             <Skeleton className="h-16 flex-1 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl" />
             <Skeleton className="h-16 w-40 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-glow-primary opacity-50" />
          </div>
        </div>
      </section>

      {/* Profile Detail Card Skeleton (Conditional hidden usually, but showing skeleton for structure) */}
      <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 space-y-12">
          <div className="flex justify-between items-start">
             <div className="space-y-4">
                 <Skeleton className="h-10 w-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                 <div className="flex gap-4">
                     <Skeleton className="h-5 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
                     <Skeleton className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                 </div>
             </div>
             <Skeleton className="h-10 w-40 rounded-full bg-emerald-500/10" />
          </div>
          <div className="space-y-12 pl-4">
              {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-10">
                      <Skeleton className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                      <div className="flex-1 space-y-3">
                          <Skeleton className="h-5 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
                          <Skeleton className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
                      </div>
                  </div>
              ))}
          </div>
      </Card>

      {/* Outcome Header Skeleton */}
      <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-80 rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {[1, 2].map(i => (
            <div key={i} className="space-y-8">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-xl bg-slate-200 dark:bg-slate-800 opacity-50" />
                    <Skeleton className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(j => (
                        <Card key={j} className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-6">
                             <div className="flex justify-between">
                                 <Skeleton className="h-6 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
                                 <Skeleton className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800 opacity-50" />
                             </div>
                             <div className="space-y-4">
                                 <div className="flex justify-between">
                                     <Skeleton className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                                     <Skeleton className="h-3 w-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                                 </div>
                                 <Skeleton className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
                             </div>
                        </Card>
                    ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
