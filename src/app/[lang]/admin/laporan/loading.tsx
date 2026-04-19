import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function LaporanLoading() {
  return (
    <div className="space-y-10 pb-20 animate-pulse font-display">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <Skeleton className="h-4 w-60 rounded-lg bg-slate-200 dark:bg-slate-800" />
        </div>
        <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800 shadow-glow-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-8 border-none shadow-xl rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-4">
             <Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
             <Skeleton className="h-8 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </Card>
        ))}
      </div>

      <Card className="p-0 border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 overflow-hidden">
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between">
           <Skeleton className="h-12 w-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
           <Skeleton className="h-12 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="p-8 space-y-6">
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="flex items-center justify-between pb-6 border-b border-slate-50 dark:border-slate-800 last:border-0">
               <div className="flex items-center gap-4">
                 <Skeleton className="size-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
                 <div className="space-y-2">
                   <Skeleton className="h-4 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
                   <Skeleton className="h-3 w-32 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-60" />
                 </div>
               </div>
               <Skeleton className="h-8 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
