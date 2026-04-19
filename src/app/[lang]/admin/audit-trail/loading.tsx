import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/**
 * Loading state for Audit Trail page.
 * Mimics the dashboard layout with high-fidelity skeletons.
 */
export default function AuditTrailLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-48 rounded-2xl" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 lg:col-span-2 space-y-8">
          <div className="flex justify-between">
            <Skeleton className="h-6 w-40 rounded-lg" />
            <Skeleton className="h-6 w-24 rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 flex flex-col items-center">
                <Skeleton className="h-8 w-12 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-navy/10 dark:bg-slate-800 space-y-6">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 rounded-lg" />
            <Skeleton className="h-3 w-48 rounded-lg" />
          </div>
          <div className="flex items-baseline gap-2">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
        </Card>
      </div>

      {/* Table Feed Skeleton */}
      <Card className="p-10 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 space-y-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-lg" />
              <Skeleton className="h-3 w-24 rounded-lg" />
            </div>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Skeleton className="h-11 w-32 rounded-2xl" />
            <Skeleton className="h-11 flex-1 lg:w-80 rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Skeleton className="h-12 w-12 rounded-[1.25rem]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded-lg" />
                  <Skeleton className="h-4 w-64 rounded-lg" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                <Skeleton className="h-10 w-24 rounded-xl" />
                <Skeleton className="h-10 w-32 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24 rounded-lg" />
                  <Skeleton className="h-3 w-16 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
