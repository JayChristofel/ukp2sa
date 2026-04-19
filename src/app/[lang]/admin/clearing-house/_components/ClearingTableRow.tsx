"use client";

import React from "react";
import { Badge, Button } from "@/components/ui";
import { CheckCircle2, Layers, AlertTriangle, ArrowRight } from "lucide-react";
import { ClearingDetailDialog } from "./ClearingDetailDialog";

interface ClearingTableRowProps {
  item: any;
  ach: any;
  d: any;
  lang: string;
}

export const ClearingTableRow = ({
  item,
  ach,
  d,
  lang,
}: ClearingTableRowProps) => {
  return (
    <tr className="group border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-8 py-6">
        <div className="space-y-1">
          <p className="text-[13px] font-black text-navy dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
            {item.title}
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
            {item.code}
          </p>
        </div>
      </td>
      <td className="px-8 py-6">
        <Badge
          variant="outline"
          className="rounded-lg border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-3 py-1 bg-white/50 dark:bg-slate-900/50"
        >
          {item.sector}
        </Badge>
      </td>
      <td className="px-8 py-6">
        {item.status === "synced" ? (
          <div className="flex items-center gap-1.5 text-emerald-500 font-black uppercase text-[9px] tracking-widest">
            <CheckCircle2 size={12} /> {ach.conflict_resolved}
          </div>
        ) : item.status === "overlap" ? (
          <div className="flex items-center gap-1.5 text-amber-500 font-black uppercase text-[9px] tracking-widest">
            <Layers size={12} /> {d.status_overlap || "OVERLAP"}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-rose-500 font-black uppercase text-[9px] tracking-widest">
            <AlertTriangle size={12} /> {ach.duplicate_warning}
          </div>
        )}
        <div className="text-[8px] font-bold text-slate-400 mt-1 uppercase truncate max-w-[120px]">
          {item.reason}
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                item.confidence >= 90
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  : "bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]"
              }`}
              style={{ width: `${item.confidence}%` }}
            />
          </div>
          <span className="text-[11px] font-black text-navy dark:text-white font-mono">
            {item.confidence}%
          </span>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <ClearingDetailDialog item={item} ach={ach} d={d} lang={lang}>
          <Button
            variant="ghost"
            className="text-[10px] h-10 px-4 font-black uppercase tracking-widest text-primary hover:text-primary-600 hover:bg-primary/5 gap-2 group cursor-pointer rounded-xl transition-all active:scale-95"
          >
            {ach.details_btn}
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </ClearingDetailDialog>
      </td>
    </tr>
  );
};
