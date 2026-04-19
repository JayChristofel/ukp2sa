import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <Skeleton className="h-14 w-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-4">
            <Skeleton className="h-10 w-10 rounded-xl bg-slate-200 dark:bg-slate-800 opacity-50" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
              <Skeleton className="h-8 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 p-10 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 space-y-8">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-6 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-6 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-80 w-full rounded-3xl bg-slate-50 dark:bg-slate-800/50" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-10 border-none shadow-2xl rounded-[3rem] bg-navy dark:bg-slate-900 text-white space-y-8">
          <Skeleton className="h-12 w-12 rounded-2xl bg-slate-700 dark:bg-slate-800" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 rounded-lg bg-slate-700 dark:bg-slate-800" />
            <Skeleton className="h-3 w-56 rounded-lg bg-slate-700 dark:bg-slate-800 opacity-60" />
          </div>
          <div className="space-y-6 pt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-xl bg-slate-700 dark:bg-slate-800" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-3 w-full rounded-lg bg-slate-700 dark:bg-slate-800" />
                  <Skeleton className="h-3 w-2/3 rounded-lg bg-slate-700 dark:bg-slate-800 opacity-40" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
