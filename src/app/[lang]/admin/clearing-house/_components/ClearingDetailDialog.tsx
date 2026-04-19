"use client";

import React from "react";
import Link from "next/link";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Badge, Button } from "@/components/ui";
import { ShieldAlert, ArrowRight } from "lucide-react";

interface ClearingDetailDialogProps {
  item: any;
  ach: any;
  d: any;
  lang: string;
  children: React.ReactNode;
}

export const ClearingDetailDialog = ({
  item,
  ach,
  d,
  lang,
  children,
}: ClearingDetailDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white dark:bg-slate-900 border-none shadow-2xl rounded-3xl overflow-hidden p-0 flex flex-col gap-0 max-h-[90vh]">
        <div
          className={`h-2 w-full shrink-0 ${
            item.status === "synced"
              ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              : item.status === "overlap"
              ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
          }`}
        />
        <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
          <DialogHeader className="mb-6 text-left">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge
                className={`rounded-lg font-black uppercase text-[9px] tracking-widest border-none px-3 py-1 ${
                  item.status === "synced"
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                    : item.status === "overlap"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                }`}
              >
                {item.status === "synced"
                  ? ach.conflict_resolved
                  : item.status === "overlap"
                  ? d.status_overlap || "OVERLAP"
                  : ach.duplicate_warning}
              </Badge>
              <span className="text-slate-300 dark:text-slate-700 font-bold">•</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">
                {item.sector}
              </span>
            </div>
            <DialogTitle className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight mb-2">
              {item.title}
            </DialogTitle>
            <DialogDescription className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={12} className="text-primary" /> REFF ID: {item.code}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8">
            <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{ach.agency_label}</h5>
              <p className="text-sm font-black text-navy dark:text-white truncate">{item.agency}</p>
            </div>
            <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">FUNDING SCHEME</h5>
              <p className="text-sm font-black text-navy dark:text-white truncate">{item.fundingScheme}</p>
            </div>
            <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BUDGET ESTIMATION</h5>
              <p className="text-sm font-black text-primary">
                {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(item.budget || 0)}
              </p>
            </div>
            <div className="space-y-1 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LOCATION FOCUS</h5>
              <p className="text-sm font-black text-navy dark:text-white truncate">{item.location}</p>
            </div>
          </div>

          <div className="space-y-3 mb-8 px-2">
            <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OUTCOME ANALYSIS</h5>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic border-l-4 border-slate-100 dark:border-slate-800 pl-4">
              {item.outcome || "-"}
            </p>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-slate-100 dark:border-slate-800 mb-8 overflow-hidden relative">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CONFIDENCE ALGORITHM</h5>
                <span className="text-xl font-black text-navy dark:text-white">{item.confidence}%</span>
              </div>
              <div className="h-3 w-full bg-white dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    item.confidence >= 90
                      ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                      : "bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                  }`}
                  style={{ width: `${item.confidence}%` }}
                />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-primary" /> SYSTEM VERIFICATION
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">VERIFICATION STATUS</p>
                  <p className="text-[11px] font-black text-navy dark:text-white uppercase truncate">
                    {item.status === "synced" ? "ALIGNED DETECTED" : item.status === "overlap" ? "OVERLAP DETECTED" : "CONFLICT DETECTED"}
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SIMILARITY LEVEL</p>
                  <p className="text-[11px] font-black text-navy dark:text-white uppercase">
                    {item.confidence}% {item.confidence >= 90 ? "VALIDATED" : "POTENTIAL"}
                  </p>
                </div>
              </div>

              <div className="p-5 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/10">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-primary mb-2">RESOLUTION NOTES</h5>
                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  {item.reason || "Verified record structure."}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {item.status === "duplicate" && (
                <Link href={`/${lang}/admin/clearing-house/manage?id=${item.id}`} className="w-full">
                  <Button className="w-full bg-rose-500 text-white hover:bg-rose-600 rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 shadow-xl shadow-rose-500/20 transition-all active:scale-95 group">
                    {ach.details_btn}{" "}
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
