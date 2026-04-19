"use client";

import React from "react";
import { Sprout, Waves } from "lucide-react";

interface StrategicKPIsProps {
  kpis: any[];
  d: any;
}

export const StrategicKPIs = ({ kpis, d }: StrategicKPIsProps) => {
  const riceField = kpis.find((k) => k.id === "kpi-7") || { actual: 0, target: 1 };
  const das = kpis.find((k) => k.id === "kpi-10") || { actual: 0, target: 1 };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
            <Sprout size={24} />
          </div>
          <div className="text-right flex-1 min-w-0">
            <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">
              {d.rice_field_recovery || "Sawah Pulih"}
            </p>
            <h4 className="text-lg md:text-2xl font-black text-navy dark:text-white tabular-nums">
              {riceField.actual} Ha
            </h4>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between text-[8px] md:text-xs font-black uppercase mb-2">
            <span className="text-slate-400">
              {d.land_progress || "Progres Lahan"}
            </span>
            <span className="text-emerald-500">
              {Math.round((riceField.actual / riceField.target) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{
                width: `${Math.round((riceField.actual / riceField.target) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="p-4 bg-blue-500/10 text-blue-500 rounded-2xl">
            <Waves size={24} />
          </div>
          <div className="text-right flex-1 min-w-0">
            <p className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1 truncate">
              {d.das_restoration || "DAS Terestorasi"}
            </p>
            <h4 className="text-lg md:text-2xl font-black text-navy dark:text-white tabular-nums">
              {das.actual} Ha
            </h4>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between text-[8px] md:text-xs font-black uppercase mb-2">
            <span className="text-slate-400">
              {d.das_progress || "Progress DAS"}
            </span>
            <span className="text-blue-500">
              {Math.round((das.actual / das.target) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${Math.round((das.actual / das.target) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
