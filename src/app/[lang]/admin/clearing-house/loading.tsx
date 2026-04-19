import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ClearingHouseLoading() {
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

      {/* Filter Bar Skeleton */}
      <Card className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex flex-col lg:flex-row gap-6 justify-between items-center">
          <Skeleton className="h-14 flex-1 lg:max-w-2xl rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-4 w-full lg:w-auto">
             <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
             <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
      </Card>

      {/* Clearing Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-8 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 space-y-6">
            <div className="flex justify-between items-start">
               <Skeleton className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
               <Skeleton className="h-6 w-24 rounded-full bg-slate-200 dark:bg-slate-800 opacity-60" />
            </div>
            <div className="space-y-3">
               <Skeleton className="h-6 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
               <Skeleton className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
            </div>
            <div className="space-y-2 pt-4">
               <div className="flex justify-between">
                  <Skeleton className="h-3 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-50" />
                  <Skeleton className="h-3 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
               </div>
               <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Skeleton className="h-full w-3/4 rounded-full bg-primary/20" />
               </div>
            </div>
            <div className="flex justify-between items-center pt-4">
               <Skeleton className="h-5 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
               <Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
