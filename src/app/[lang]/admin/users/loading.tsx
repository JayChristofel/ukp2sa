import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function UsersLoading() {
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

      {/* Bento Card Skeleton */}
      <Card className="p-0 border-none shadow-2xl rounded-[3rem] bg-white/40 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden">
        {/* Filter Bar Skeleton */}
        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row gap-6 justify-between items-center">
            <Skeleton className="h-14 flex-1 xl:max-w-xl rounded-2xl bg-slate-200 dark:bg-slate-800" />
            <Skeleton className="h-14 w-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                {[1, 2, 3, 4, 5].map((i) => (
                  <th key={i} className="px-8 py-5">
                    <Skeleton className="h-3 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-50" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((row) => (
                <tr key={row} className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32 rounded-lg bg-slate-200 dark:bg-slate-800" />
                        <Skeleton className="h-3 w-24 rounded-lg bg-slate-200 dark:bg-slate-800 opacity-40" />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6"><Skeleton className="h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" /></td>
                  <td className="px-8 py-6"><Skeleton className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800" /></td>
                  <td className="px-8 py-6"><Skeleton className="h-4 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" /></td>
                  <td className="px-8 py-6 text-right flex justify-end gap-2"><Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" /><Skeleton className="size-10 rounded-xl bg-slate-200 dark:bg-slate-800" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="p-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <Skeleton className="h-4 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
                <Skeleton className="h-10 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
        </div>
      </Card>
    </div>
  );
}
