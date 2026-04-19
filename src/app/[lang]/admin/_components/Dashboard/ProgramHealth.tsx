"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgramHealthProps {
  programHealth: any[];
  dict: any;
  latestReport: any;
}

export const ProgramHealth = ({
  programHealth,
  dict,
  latestReport,
}: ProgramHealthProps) => {
  return (
    <div className="p-6 md:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] md:rounded-[3rem] shadow-xl">
      <h3 className="text-lg md:text-xl font-black uppercase tracking-tight dark:text-white mb-8">
        {dict.dashboard?.health_status || "Kesehatan Program Utama"}
      </h3>
      <div className="space-y-6">
        {programHealth.map((service) => (
          <div key={service.id}>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] md:text-sm font-black uppercase tracking-tight dark:text-slate-200">
                {service.label}
              </span>
              <span
                className={`text-[9px] md:text-xs font-black uppercase text-${service.color}-500 tracking-widest`}
              >
                {service.status}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${service.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full bg-${service.color}-500 rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 rounded-[2rem] bg-primary/5 border border-primary/10">
        <p className="text-[9px] md:text-xs font-black text-primary uppercase tracking-[0.2em] mb-2.5">
          {dict.dashboard?.national_update || "Pembaruan Nasional"}
        </p>
        <p className="text-[11px] md:text-sm text-slate-500 leading-relaxed font-bold uppercase tracking-tight">
          {latestReport
            ? `${dict.common?.latest_update}: ${
                latestReport.subject ||
                latestReport.question ||
                latestReport.title ||
                dict.common?.no_recent_activity
              } di ${latestReport.regency || "Aceh"}.`
            : dict.dashboard?.no_recent_reports ||
              "Belum ada laporan terbaru yang masuk ke sistem pusat."}
        </p>
        {latestReport && (
          <div className="mt-2 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">
              {dict.status.label}: {latestReport.status || dict.common?.waiting}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
