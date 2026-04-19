"use client";

import React from "react";
import { Card } from "@/components/ui";
import { CheckCircle2, AlertTriangle, Layers } from "lucide-react";

interface ClearingStatsProps {
  stats: {
    totalAligned: number;
    potentialDup: number;
    totalAnalyzed: number;
  };
  ach: any;
}

export const ClearingStats = ({ stats, ach }: ClearingStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <Card className="p-6 border-none shadow-xl bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/10 rounded-3xl">
        <div className="flex items-center gap-4 text-emerald-500 mb-2">
          <CheckCircle2 size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {ach.conflict_resolved}
          </span>
        </div>
        <p className="text-3xl font-black text-navy dark:text-white transition-colors">
          {stats.totalAligned}
        </p>
      </Card>
      <Card className="p-6 border-none shadow-xl bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10 rounded-3xl">
        <div className="flex items-center gap-4 text-amber-500 mb-2">
          <AlertTriangle size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {ach.duplicate_warning}
          </span>
        </div>
        <p className="text-3xl font-black text-navy dark:text-white transition-colors">
          {stats.potentialDup}
        </p>
      </Card>
      <Card className="p-6 border-none shadow-xl bg-primary/5 dark:bg-primary/10 border-primary/10 rounded-3xl sm:col-span-2 lg:col-span-1">
        <div className="flex items-center gap-4 text-primary mb-2">
          <Layers size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {ach.budget_overlap}
          </span>
        </div>
        <p className="text-3xl font-black text-navy dark:text-white transition-colors">
          {stats.totalAnalyzed}
        </p>
      </Card>
    </div>
  );
};
