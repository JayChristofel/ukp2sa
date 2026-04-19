import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function FinancialProgressLoading() {
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

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className={`p-10 border-none shadow-2xl rounded-[3rem] space-y-6 ${i === 1 ? 'bg-navy dark:bg-slate-950 text-white' : 'bg-white dark:bg-slate-900'}`}>
            <Skeleton className={`size-14 rounded-2xl ${i === 1 ? 'bg-slate-700' : 'bg-slate-200 dark:bg-slate-800'}`} />
            <div className="space-y-3">
                <Skeleton className={`h-4 w-32 rounded-lg ${i === 1 ? 'bg-slate-700' : 'bg-slate-200 dark:bg-slate-800 opacity-60'}`} />
                <Skeleton className={`h-10 w-full rounded-lg ${i === 1 ? 'bg-slate-700' : 'bg-slate-200 dark:bg-slate-800'}`} />
            </div>
            {i === 1 && <Skeleton className="h-2 w-full rounded-full bg-slate-700" />}
          </Card>
        ))}
      </div>

      {/* Large Progress Table Skeleton */}
      <Card className="p-10 border-none shadow-3xl rounded-[3.5rem] bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex justify-between items-center mb-10">
              <Skeleton className="h-8 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <Skeleton className="h-12 w-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row gap-8 items-center">
                      <div className="flex items-center gap-6 flex-1 w-full">
                          <Skeleton className="size-16 rounded-[1.5rem] bg-slate-200 dark:bg-slate-800" />
                          <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                              <Skeleton className="h-3 w-64 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
                          </div>
                      </div>
                      <div className="w-full lg:w-80 space-y-3">
                           <div className="flex justify-between">
                              <Skeleton className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                              <Skeleton className="h-3 w-10 rounded-lg bg-slate-200 dark:bg-slate-800" />
                           </div>
                           <Skeleton className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 opacity-30" />
                      </div>
                      <Skeleton className="h-12 w-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                  </div>
              ))}
          </div>
      </Card>
    </div>
  );
}
