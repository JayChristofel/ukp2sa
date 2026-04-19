"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import { ShieldAlert } from "lucide-react";

interface AuditStatsProps {
  stats: any;
  a: any; // dictionary
}

export function AuditStats({ stats, a }: AuditStatsProps) {
  const integrity = stats.integrity || {
    totalScore: 0,
    dimensions: { completeness: 0, accuracy: 0, consistency: 0 },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 lg:col-span-2 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-black text-navy dark:text-white uppercase tracking-tight">
            {a.integrity_title || "Integrity Diagnostics"}
          </h3>
          <Badge
            variant={integrity.totalScore > 80 ? "emerald" : "amber"}
            className="border-none rounded-lg px-3 py-1"
          >
            {integrity.totalScore > 80
              ? a.integrity_healthy || "Healthy System"
              : a.integrity_warning || "Monitoring Needed"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-1 text-center border-r border-slate-100 dark:border-slate-800">
            <p className="text-3xl font-black text-primary">
              {integrity.totalScore}%
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {a.global_score || "Global Score"}
            </p>
          </div>
          {Object.entries(integrity.dimensions).map(
            ([key, val]: [string, any]) => (
              <div
                key={key}
                className="space-y-1 text-center last:border-none border-r border-slate-100 dark:border-slate-800"
              >
                <p className="text-xl font-black text-navy dark:text-white">
                  {val}%
                </p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest capitalize">
                  {a.integrity_dimensions?.[key] || key}
                </p>
              </div>
            ),
          )}
        </div>
      </Card>

      <Card className="p-8 border-none shadow-2xl rounded-[2.5rem] bg-navy text-white relative overflow-hidden">
        <div className="relative z-10">
          <ShieldAlert size={32} className="mb-4 text-rose-500" />
          <h3 className="text-lg font-black uppercase tracking-tight">
            {a.access_title || "Access Control"}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 italic opacity-80">
            {a.access_desc || "Device & Session Footprints"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">
              {stats.totalEvents > 1000
                ? `${(stats.totalEvents / 1000).toFixed(1)}k`
                : stats.totalEvents}
            </span>
            <span className="text-[10px] font-bold opacity-50 uppercase">
              {stats.activeSessions} {a.sessions_active || "Active Sessions"}
            </span>
          </div>
          <p className="mt-4 text-[9px] font-black uppercase tracking-widest text-rose-400">
            {stats.securityGaps} {a.security_gaps || "Security Gaps Detected"}
          </p>
        </div>
        <div className="absolute -bottom-10 -right-10 size-40 bg-primary/20 blur-3xl rounded-full" />
      </Card>
    </div>
  );
}
