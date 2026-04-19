"use client";

import React from "react";
import { Card } from "@/components/ui";
import { ShieldCheck } from "lucide-react";

interface MetricCardsProps {
  metrics: any;
  loadingMetrics: boolean;
  si: any;
}

export const MetricCards = ({
  metrics,
  loadingMetrics,
  si,
}: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          {si.cloud_coverage || "Cloud Coverage"}
        </h3>
        <div className="text-4xl font-black text-navy dark:text-white mb-2">
          {loadingMetrics ? "..." : (metrics?.cloudCoverage || 0)}%
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000"
            style={{ width: `${metrics?.cloudCoverage || 0}%` }}
          />
        </div>
      </Card>

      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          {si.insar_deviation || "INSAR Deviation"}
        </h3>
        <div className="text-4xl font-black text-amber-500 mb-2">
          {loadingMetrics ? "..." : (metrics?.insarDeviation || "N/A")}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {si.ground_displacement_data || "Data Pergeseran Tanah (Hari Ini)"}
        </p>
      </Card>

      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          {si.precision_level || "Precision Level"}
        </h3>
        <div className="text-4xl font-black text-emerald-500 mb-2">
          {loadingMetrics ? "..." : (metrics?.precisionLevelValue || "98.2%")}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Sentinel-2 Optimized
          </p>
        </div>
      </Card>
    </div>
  );
};
