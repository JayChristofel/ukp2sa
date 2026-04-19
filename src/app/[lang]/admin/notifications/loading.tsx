import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function NotificationsLoading() {
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

      {/* AI Digest Skeleton */}
      <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-primary/5 dark:bg-slate-900 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl bg-primary/10" />
            <Skeleton className="h-6 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-4 w-5/6 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <Skeleton className="h-14 w-32 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-md" />
        </div>
      </Card>

      {/* Notifications List Skeleton */}
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900 border-l-4 border-slate-100 dark:border-slate-800 flex items-start gap-6">
            <Skeleton className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                  <Skeleton className="h-3 w-32 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                </div>
                <Skeleton className="h-5 w-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
              <Skeleton className="h-3 w-full rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
