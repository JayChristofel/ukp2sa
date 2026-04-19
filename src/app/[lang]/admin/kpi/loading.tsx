import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function KPILoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-glow-primary" />
      </div>

      {/* KPI Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-4">
            <Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800 opacity-50" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
              <div className="flex items-baseline gap-2">
                <Skeleton className="h-8 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-3 w-8 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4">
               <Skeleton className="h-full w-2/3 rounded-full bg-primary/20" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 p-10 border-none shadow-2xl rounded-[3.5rem] bg-white dark:bg-slate-910 space-y-8 min-h-[500px]">
           <Skeleton className="h-8 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
           <div className="h-64 w-full bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem]" />
           <div className="grid grid-cols-4 gap-4 pt-4">
               {[1, 2, 3, 4].map(i => (
                   <div key={i} className="space-y-2 text-center">
                       <Skeleton className="h-3 w-full rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                       <Skeleton className="h-6 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                   </div>
               ))}
           </div>
        </Card>
        
        <div className="space-y-6">
            {[1, 2].map(i => (
                <Card key={i} className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-navy dark:bg-slate-900 text-white space-y-6">
                    <Skeleton className="size-10 rounded-xl bg-slate-700 dark:bg-slate-800" />
                    <div className="space-y-3">
                        <Skeleton className="h-5 w-32 rounded-lg bg-slate-700 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-full rounded-lg bg-slate-700 dark:bg-slate-800 opacity-40" />
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
