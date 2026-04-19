import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function SettingsLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      <Card className="p-0 border-none shadow-3xl rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden">
        {/* Tabs Bar Skeleton */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex gap-4">
             {[1, 2, 3, 4, 5, 6].map(i => (
                 <Skeleton key={i} className={`h-12 w-32 rounded-2xl ${i === 1 ? 'bg-primary/20' : 'bg-slate-200 dark:bg-slate-800'}`} />
             ))}
          </div>
        </div>

        {/* Settings Content Area Skeleton */}
        <div className="p-10 lg:p-14 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="space-y-3">
                    <Skeleton className="h-6 w-40 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <Skeleton className="h-4 w-64 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                </div>
                <div className="lg:col-span-2 space-y-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-4 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                             <Skeleton className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                             <Skeleton className="h-12 w-full rounded-2xl bg-white dark:bg-slate-900" />
                             <Skeleton className="h-3 w-2/3 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
                        </div>
                    ))}
                    <div className="flex justify-end pt-4">
                        <Skeleton className="h-14 w-44 rounded-2xl bg-primary/20" />
                    </div>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
}
