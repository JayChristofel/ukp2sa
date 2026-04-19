"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import { motion } from "framer-motion";

interface KPICardProps {
  kpi: any;
  config: {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    label: string;
  };
  lang: string;
  dict: any;
  common: any;
  onViewDetail?: () => void;
}

export const KPICard = ({
  kpi,
  config,
  lang,
  dict,
  common,
  onViewDetail,
}: KPICardProps) => {
  const progress = (kpi.actual / kpi.target) * 100;
  const d = dict?.kpi || {};

  return (
    <Card className="p-8 border-none rounded-[2.5rem] shadow-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl group hover:translate-y-[-4px] transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${config.bgColor} ${config.color} transition-colors`}>
          {config.icon}
        </div>
        <Badge className="rounded-xl border-none bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase text-[9px] tracking-widest">
          {config.label}
        </Badge>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-black text-navy dark:text-white uppercase leading-tight tracking-tight mb-2 line-clamp-2">
          {kpi.title}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {kpi.description}
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              {d.target || "Target"}
            </p>
            <p className="text-sm font-black text-navy dark:text-white uppercase">
              {kpi.target.toLocaleString(lang === "en" ? "en-US" : "id-ID")} {kpi.unit}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              {d.actual || "Realisasi"}
            </p>
            <p className="text-sm font-black text-primary uppercase">
              {kpi.actual.toLocaleString(lang === "en" ? "en-US" : "id-ID")} {kpi.unit}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase">
            <span className="text-slate-400">{d.progress || "Pencapaian"}</span>
            <span className={progress >= 100 ? "text-emerald-500" : "text-primary"}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${progress >= 100 ? "bg-emerald-500" : "bg-primary"}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <div
              className={`size-2 rounded-full ${
                progress >= 90 ? "bg-emerald-500" : progress >= 50 ? "bg-amber-500" : "bg-rose-500"
              }`}
            />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
              {progress >= 90
                ? d.status_optimal || "Optimal"
                : progress >= 50
                ? d.status_warning || "Warning"
                : d.status_critical || "Kritis"}
            </span>
          </div>
          <button 
            onClick={onViewDetail}
            className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
          >
            {common.detail || "Detail"}
          </button>
        </div>
      </div>
    </Card>
  );
};
