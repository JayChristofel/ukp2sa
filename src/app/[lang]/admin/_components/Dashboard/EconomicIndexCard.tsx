"use client";

import React from "react";
import { Sprout, TrendingUp } from "lucide-react";

interface EconomicIndexCardProps {
  stabilizationIndex: string;
  economy: any;
  latestReport: any;
  averageRecovery: string;
  kpis: any[];
  common: any;
  dict: any;
}

export const EconomicIndexCard = ({
  stabilizationIndex,
  economy,
  latestReport,
  averageRecovery,
  kpis,
  common,
  dict,
}: EconomicIndexCardProps) => {
  return (
    <div className="p-6 md:p-8 bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
        <Sprout size={150} className="md:size-[200px]" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 md:p-3 bg-white/20 rounded-2xl backdrop-blur-md">
            <TrendingUp size={20} className="md:size-6" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tight leading-tight">
              {common.economic_index}
            </h2>
            <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5">
              {common.welfare_metrics}
            </p>
          </div>
        </div>
        <div className="flex items-end gap-3 md:gap-4 mb-8">
          <span className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            {stabilizationIndex}
          </span>
          <div className="pb-1 md:pb-3">
            <div className="text-[10px] md:text-xs font-black bg-white/20 px-2 py-0.5 rounded-full mb-1 inline-block">
              {economy?.mom || "+0.0"} MoM
            </div>
            <p className="text-[10px] text-white/60 font-medium leading-tight max-w-[180px] md:max-w-none">
              {dict.common.latest_update}: {latestReport?.subject || latestReport?.category || dict.common.no_recent_activity} {latestReport?.regency ? `di ${latestReport.regency}` : ""}. 
              {dict.status.label}: <span className="text-primary-400 font-bold">{latestReport?.status || dict.common.waiting}</span>.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 md:gap-4 border-t border-white/10 pt-6">
          <div>
            <p className="text-[9px] md:text-[11px] font-bold opacity-60 uppercase mb-1 leading-tight">
              {dict.common.market_price}
            </p>
            <p className="text-sm md:text-lg font-black italic tabular-nums">
              {kpis.find((k) => k.id === "kpi-12")?.actual || 0}%{" "}
              {common.stable}
            </p>
          </div>
          <div>
            <p className="text-[9px] md:text-[11px] font-bold opacity-60 uppercase mb-1 leading-tight">
              {common.land_recovery}
            </p>
            <p className="text-sm md:text-lg font-black italic tabular-nums">
              {averageRecovery}% {common.active}
            </p>
          </div>
          <div>
            <p className="text-[9px] md:text-[11px] font-bold opacity-60 uppercase mb-1 leading-tight">
              {common.employment}
            </p>
            <p className="text-sm md:text-lg font-black italic tabular-nums">
              {Math.round(Number(averageRecovery) * 0.85)}% {common.working}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
