"use client";

import React from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Activity, Target, TrendingUp, ShieldAlert } from "lucide-react";

interface AbsorptionDetailDialogProps {
  record: any;
  f: any;
  formatCurrency: (val: number) => string;
}

export const AbsorptionDetailDialog = ({
  record,
  f,
  formatCurrency,
}: AbsorptionDetailDialogProps) => {
  return (
    <DialogContent className="w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white dark:bg-slate-900 border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0 flex flex-col gap-0 max-h-[90vh]">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
            <DialogHeader className="text-left mb-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[9px] px-3">
                  {record.source}
                </Badge>
                <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                  REF: {record.id}
                </span>
              </div>
              <DialogTitle className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight">
                {record.programName}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                {f.detail_desc || "Detail rincian penyerapan anggaran dan tahapan distribusi dana bantuan."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {f.total_allocation || "Total Alokasi"}
                </p>
                <p className="text-[15px] font-black text-navy dark:text-white truncate">
                  {formatCurrency(record.allocation)}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {f.total_realization || "Realisasi Kas"}
                </p>
                <p className="text-[15px] font-black text-emerald-600 truncate">
                  {formatCurrency(record.realization)}
                </p>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        </div>

        {/* Progress Flow Detail */}
        <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900/50">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                {f.stage_progress || "Posisi Kas Saat Ini"}
              </h5>
              <span className="text-lg font-black text-primary">
                {record.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner p-1">
              <div
                className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000"
                style={{ width: `${record.percentage}%` }}
              />
            </div>
            <p className="text-center mt-3 text-[11px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">
              ➜ Tahap: {record.disbursementStage}
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center mb-6">
              Alur Distribusi Bantuan
            </h5>
            <div className="flex items-center justify-between gap-2 relative">
              <div className="absolute top-4 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/20 via-primary/20 to-orange-500/20" />
              <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                <div className="size-10 rounded-2xl bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30"><DollarSign size={16} /></div>
                <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">Dana: {record.source}</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                <div className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30"><Activity size={16} /></div>
                <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">Intervensi Program</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                <div className="size-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30"><Target size={16} /></div>
                <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">Eksekusi Lapangan</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                <div className="size-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30"><TrendingUp size={16} /></div>
                <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">Capaian Manfaat</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
              <ShieldAlert size={16} className="text-primary mt-0.5 shrink-0" />
              <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic">
                Catatan Sistem: Penyaluran tahap ini dinyatakan {record.percentage >= 60 ? "sesuai target" : "membutuhkan akselerasi"} berdasarkan timeline kurva-S standar penanganan kebencanaan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
