"use client";

import React from "react";
import { Search } from "lucide-react";
import { Card, Input, Label } from "@/components/ui";

interface AnalyticsTabProps {
  s: any;
}

export const AnalyticsTab = ({ s }: AnalyticsTabProps) => {
  return (
    <div className="space-y-8 font-display">
      <Card className="p-10 border-none rounded-[2.5rem] shadow-xl bg-white dark:bg-navy/50">
        <h3 className="text-xl font-black text-navy dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
          <Search size={20} className="text-primary" />{" "}
          {s.metrics_monitoring || "Metrics & Monitoring"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
              Google Analytics ID
            </Label>
            <Input
              defaultValue="G-XXXXXXXXXX"
              className="h-12 bg-slate-50 dark:bg-slate-900 border-none px-6 font-mono text-xs font-black rounded-2xl"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">
              Sentry DSN (Error Tracking)
            </Label>
            <Input
              defaultValue="https://99999999@sentry.io/123456"
              className="h-12 bg-slate-50 dark:bg-slate-900 border-none px-6 font-mono text-xs font-black rounded-2xl"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};
