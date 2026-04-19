"use client";

import React from "react";
import { Card } from "@/components/ui";
import { DollarSign, Target, TrendingUp } from "lucide-react";

interface FinancialStatsProps {
  totalAllocation: number;
  totalRealization: number;
  overallPercentage: number;
  f: any;
  formatCurrency: (val: number) => string;
}

export const FinancialStats = ({
  totalAllocation,
  totalRealization,
  overallPercentage,
  f,
  formatCurrency,
}: FinancialStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="p-6 bg-primary text-white border-none rounded-3xl shadow-xl shadow-primary/20">
        <DollarSign size={32} className="mb-4 opacity-50" />
        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
          {f.total_allocation || "Total Alokasi"}
        </div>
        <div className="text-2xl font-black mt-1">
          {formatCurrency(totalAllocation)}
        </div>
      </Card>
      <Card className="p-6 bg-navy text-white border-none rounded-3xl shadow-xl shadow-navy/20">
        <Target size={32} className="mb-4 opacity-50" />
        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
          {f.total_realization || "Total Realisasi"}
        </div>
        <div className="text-2xl font-black mt-1">
          {formatCurrency(totalRealization)}
        </div>
      </Card>
      <Card className="p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl">
        <TrendingUp size={32} className="mb-4 text-accent opacity-50" />
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {f.avg_absorption || "Rata-rata Penyerapan"}
        </div>
        <div className="text-3xl font-black mt-1 text-navy dark:text-white">
          {overallPercentage.toFixed(1)}%
        </div>
      </Card>
    </div>
  );
};
