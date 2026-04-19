"use client";

import React from "react";
import { Building2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui";

interface AssetRestorationGridProps {
  t: any;
  assets: any[];
}

export const AssetRestorationGrid = ({
  t,
  assets,
}: AssetRestorationGridProps) => {
  return (
    <section className="space-y-8 font-display">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-indigo-500/10 text-indigo-500 rounded-xl shadow-inner">
          <Building2 size={26} />
        </div>
        <h2 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight">
          {t.asset_restoration || "Restorasi Aset"}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {assets.map((a) => (
          <Card
            key={a.id}
            className="p-8 border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-xl bg-white dark:bg-slate-900 border-none"
          >
            <div className="flex items-center justify-between mb-4 gap-4">
              <h3 className="text-lg font-black text-navy dark:text-white uppercase tracking-tight">
                {a.name}
              </h3>
              <span
                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  a.status === "Selesai" || a.status === "Done"
                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                    : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                }`}
              >
                {a.status}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">
              <AlertCircle size={14} className="text-primary" /> {a.type} 
              <span className="opacity-30 mx-1">/</span> {a.location}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                <span className="text-slate-400">
                  {t.completion || "Penyelesaian"}
                </span>
                <span className="text-navy dark:text-white tabular-nums">
                  {a.progress}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${a.progress}%` }}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
