"use client";

import React from "react";
import { Card } from "@/components/ui";
import { AlertTriangle, Home, Heart } from "lucide-react";

interface OperationalStatsProps {
  stats: {
    totalReports: number;
    criticalFac: number;
    activeLogistics: number;
  };
  isLoading: boolean;
  dm: any;
}

export const OperationalStats = ({ stats, isLoading, dm }: OperationalStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l-4 border-l-rose-500">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {dm.incident_missing || "Incident & Missing"}
          </h3>
          <AlertTriangle size={16} className="text-rose-500" />
        </div>
        <div className="text-4xl font-black text-navy dark:text-white mb-2">
          {isLoading ? "..." : stats.totalReports}
        </div>
        <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-1">
          {dm.reports_subtitle || "Laporan Warga & Orang Hilang"}
        </p>
      </Card>

      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l-4 border-l-amber-500">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {dm.affected_facilities || "Fasum Terdampak"}
          </h3>
          <Home size={16} className="text-amber-500" />
        </div>
        <div className="text-4xl font-black text-amber-500 mb-2">
          {isLoading ? "..." : stats.criticalFac}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
          {dm.facilities_subtitle || "Sekolah & RS Butuh Intervensi"}
        </p>
      </Card>

      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-l-4 border-l-primary">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {dm.aid_distribution || "Distribusi Bantuan"}
          </h3>
          <Heart size={16} className="text-primary" />
        </div>
        <div className="text-4xl font-black text-primary mb-2">
          {isLoading ? "..." : stats.activeLogistics}
        </div>
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
          {dm.logistics_subtitle || "Posko, Tenda & Titik Pendaratan"}
        </p>
      </Card>
    </div>
  );
};
