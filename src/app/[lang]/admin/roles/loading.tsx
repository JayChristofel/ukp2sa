import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function RolesLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Grid for Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-3 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-3 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
            </div>
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-8 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex gap-2">
                <Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
