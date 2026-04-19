"use client";

import React from "react";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui";

interface ActivityFeedProps {
  dd: any;
  common: any;
  logs: any[];
  lang: string;
  onSelect: (item: any) => void;
  onViewAll: () => void;
}

export const ActivityFeed = ({
  dd,
  common,
  logs,
  lang,
  onSelect,
  onViewAll,
}: ActivityFeedProps) => {
  return (
    <div className="space-y-6 font-display">
      <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight ml-2">
        {dd.real_time_info_feed || "Arus Informasi Real-time"}
      </h3>
      <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl bg-white dark:bg-slate-900 border-none">
        <div className="space-y-6">
          {(logs || []).slice(0, 5).map((item, i) => (
            <div
              key={i}
              className="flex gap-4 cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/80 p-2 rounded-xl transition-all"
              onClick={() => onSelect(item)}
            >
              <div className="size-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10 text-primary group-hover:scale-110 transition-transform shadow-inner">
                <Activity size={14} />
              </div>
              <div>
                <p className="text-xs font-black text-navy dark:text-white leading-tight group-hover:text-primary transition-colors uppercase tracking-tight">
                  {item.details}
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                  <span className="size-1 rounded-full bg-slate-300" />
                  {new Date(item.timestamp).toLocaleTimeString(
                    lang === "en" ? "en-US" : "id-ID",
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onViewAll}
          className="w-full mt-8 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 border-none"
        >
          {common.view_all_activity || "Lihat Semua Aktivitas"}
        </button>
      </Card>
    </div>
  );
};
