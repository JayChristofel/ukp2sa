"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge, Button } from "@/components/ui";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Activity, 
  ArrowUpRight, 
  Info,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

interface KPIDetailDialogProps {
  kpi: any;
  config: any;
  onClose: () => void;
  dict: any;
  common: any;
  lang: string;
}

export const KPIDetailDialog = ({
  kpi,
  config,
  onClose,
  dict,
  common,
  lang,
}: KPIDetailDialogProps) => {
  if (!kpi) return null;

  const d = dict?.kpi || {};
  const progress = (kpi.actual / kpi.target) * 100;
  const isComplete = progress >= 100;

  return (
    <Dialog open={!!kpi} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 border-none bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className={`p-8 pb-12 relative overflow-hidden ${config.bgColor}`}>
          <div className="absolute top-0 right-0 p-12 opacity-10">
            {config.icon}
          </div>
          
          <div className="relative z-10">
            <Badge className="mb-4 rounded-xl border-none bg-white/20 dark:bg-slate-800/80 text-navy dark:text-white font-black uppercase text-[9px] tracking-widest px-3">
              {config.label}
            </Badge>
            <DialogTitle className="text-3xl font-black text-navy dark:text-white uppercase leading-tight tracking-tight mb-2">
              {kpi.title}
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-widest">
              {kpi.description}
            </DialogDescription>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8 -mt-6 bg-white dark:bg-slate-900 rounded-t-[2.5rem] relative z-20 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Target size={14} className="text-primary" /> {d.target || "Target"}
              </p>
              <h5 className="text-xl font-black text-navy dark:text-white uppercase tabular-nums">
                {kpi.target.toLocaleString(lang === "en" ? "en-US" : "id-ID")}{" "}
                <span className="text-xs text-slate-400">{kpi.unit}</span>
              </h5>
            </div>
            
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" /> {d.actual || "Realisasi"}
              </p>
              <h5 className="text-xl font-black text-navy dark:text-white uppercase tabular-nums">
                {kpi.actual.toLocaleString(lang === "en" ? "en-US" : "id-ID")}{" "}
                <span className="text-xs text-slate-400">{kpi.unit}</span>
              </h5>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h6 className="text-xs font-black text-navy dark:text-white uppercase tracking-widest mb-1">
                  {d.recovery_progress || "Progress Pemulihan"}
                </h6>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-black ${isComplete ? "text-emerald-500" : "text-primary"}`}>
                    {progress.toFixed(1)}%
                  </span>
                  <Badge variant="outline" className={`rounded-lg py-0 border-none font-bold text-[9px] ${
                    isComplete ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                  }`}>
                    {isComplete ? (lang === "en" ? "AHEAD" : "MELAMPAUI") : (lang === "en" ? "ON TRACK" : "BERJALAN")}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {d.status || "Status"}
                </p>
                <div className="flex items-center gap-1.5 justify-end">
                  {isComplete ? (
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  ) : progress >= 50 ? (
                    <Info size={14} className="text-amber-500" />
                  ) : (
                    <AlertCircle size={14} className="text-rose-500" />
                  )}
                  <span className="text-xs font-black text-navy dark:text-white uppercase tracking-tight">
                    {progress >= 90
                      ? d.status_optimal || "Optimal"
                      : progress >= 50
                      ? d.status_warning || "Warning"
                      : d.status_critical || "Kritis"}
                  </span>
                </div>
              </div>
            </div>
            
            <Progress value={Math.min(progress, 100)} className={`h-3 rounded-full ${isComplete ? "[&>div]:bg-emerald-500" : ""}`} />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
            <h6 className="text-[10px] font-black text-navy dark:text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <Info size={14} className="text-primary" /> {d.indicator_intelligence || "Intelijen Indikator"}
            </h6>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                  {isComplete 
                    ? (lang === "en" ? "Target achieved. Current efforts focus on long-term sustainability and evaluation." : "Target tercapai. Fokus saat ini beralih ke keberlanjutan jangka panjang dan evaluasi.")
                    : (lang === "en" ? "Data validation from multiple agencies confirms positive trajectory." : "Validasi data lintas lembaga mengonfirmasi lintasan positif.")
                  }
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
                  {d.latest_sync || "Singkronisasi terakhir dilakukan secara otomatis dengan pusat data nasional."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Button onClick={onClose} variant="secondary" className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest">
              {common.close || "Tutup"}
            </Button>
            <Button className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest gap-2 bg-navy dark:bg-white dark:text-navy group">
              {d.export_report || "Unduh Laporan"} <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
