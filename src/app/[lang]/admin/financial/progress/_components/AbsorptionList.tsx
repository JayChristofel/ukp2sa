"use client";

import React from "react";
import { Card } from "@/components/ui";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle } from "lucide-react";
import { AbsorptionDetailDialog } from "./AbsorptionDetailDialog";

interface AbsorptionListProps {
  records: any[];
  stages: string[];
  lang: string;
  f: any;
  formatCurrency: (val: number) => string;
}

export const AbsorptionList = ({
  records,
  stages,
  lang,
  f,
  formatCurrency,
}: AbsorptionListProps) => {
  return (
    <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col">
      <h3 className="text-xl font-black text-navy dark:text-white mb-8">
        {f.absorption_list || "Daftar Penyerapan"}
      </h3>
      <div className="space-y-6 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
        {records.map((record) => (
          <Dialog key={record.id}>
            <DialogTrigger asChild>
              <div className="p-6 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 hover:dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800 cursor-pointer group transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[8px] font-black uppercase tracking-widest">
                        {record.source}
                      </span>
                      <h4 className="text-sm font-black text-navy dark:text-white tracking-tight group-hover:text-primary transition-colors">
                        {record.programName}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-2">
                      Last Update:{" "}
                      {new Date(record.lastUpdate).toLocaleDateString(
                        lang === "en" ? "en-US" : "id-ID",
                      )}
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-navy dark:text-white group-hover:text-primary transition-colors">
                      {record.percentage.toFixed(1)}%
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase">
                      {f.absorption || "Penyerapan"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6 relative px-1 md:px-2 gap-1 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
                  <div className="absolute left-0 top-[22%] -translate-y-1/2 w-full h-[1px] md:h-[2px] bg-slate-200 dark:bg-slate-800 -z-0" />
                  {stages.map((stage, idx) => {
                    const isCurrent = record.disbursementStage === stage;
                    const isPast = stages.indexOf(record.disbursementStage) > idx;
                    return (
                      <div
                        key={stage}
                        className="relative z-10 flex flex-col items-center gap-1 min-w-[50px] md:min-w-0"
                      >
                        <div
                          className={`size-4 md:size-5 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? "bg-primary text-white scale-110 md:scale-125 shadow-lg shadow-primary/30"
                              : isPast
                              ? "bg-emerald-500 text-white"
                              : "bg-white dark:bg-slate-800 border-[1px] md:border-2 border-slate-200 dark:border-slate-700 text-slate-300"
                          }`}
                        >
                          {isPast ? (
                            <CheckCircle size={8} />
                          ) : (
                            <div className="size-1 md:size-1.5 rounded-full bg-current" />
                          )}
                        </div>
                        <span
                          className={`text-[7px] md:text-[9px] font-black uppercase tracking-tighter text-center whitespace-normal md:whitespace-nowrap ${
                            isCurrent
                              ? "text-primary"
                              : "text-slate-400 opacity-50"
                          }`}
                        >
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    style={{ width: `${record.percentage}%` }}
                  />
                </div>
              </div>
            </DialogTrigger>
            <AbsorptionDetailDialog record={record} f={f} formatCurrency={formatCurrency} />
          </Dialog>
        ))}
      </div>
    </Card>
  );
};
