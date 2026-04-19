"use client";

import React from "react";
import { 
  CircleDollarSign, 
  Heart, 
  Building2, 
  TrendingUp 
} from "lucide-react";
import { Card } from "@/components/ui";

interface ImpactStatsProps {
  dd: any;
  common: any;
  impact: any;
  lang: string;
}

export const ImpactStats = ({
  dd,
  common,
  impact,
  lang,
}: ImpactStatsProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-display">
      <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl rounded-3xl">
        <CircleDollarSign size={32} className="mb-4 text-emerald-500 opacity-50" />
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">
          {dd.total_contribution || dd.total_grant || "Total Kontribusi"}
        </div>
        <div className="text-2xl font-black mt-1 text-navy dark:text-white">
          {formatCurrency(impact?.totalGrant || 0)}
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl rounded-3xl">
        <Heart size={32} className="mb-4 text-rose-500 opacity-50" />
        <div className="text-xs font-black uppercase tracking-widest text-slate-400">
          {dd.lives_helped || "Jiwa Terbantu"}
        </div>
        <div className="text-2xl font-black mt-1 text-navy dark:text-white">
          {(impact?.livesImpacted || 0).toLocaleString(
            lang === "en" ? "en-US" : "id-ID",
          )}{" "}
          <span className="text-xs font-medium opacity-60">
            {lang === "en"
              ? impact?.livesImpacted > 1
                ? "People"
                : "Person"
              : "Jiwa"}
          </span>
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl rounded-3xl">
        <Building2 size={32} className="mb-4 text-primary opacity-50" />
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {dd.infra_ready || "Infra Siap"}
        </div>
        <div className="text-2xl font-black mt-1 text-navy dark:text-white">
          {impact?.infrastructureReady}%
        </div>
      </Card>

      <Card className="p-6 bg-white dark:bg-slate-900 border-none shadow-xl rounded-3xl">
        <TrendingUp size={32} className="mb-4 text-amber-500 opacity-50" />
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {common.economic_growth || "Pertumbuhan Ekonomi"}
        </div>
        <div className="text-2xl font-black mt-1 text-navy dark:text-white">
          {impact?.economicGrowth}%
        </div>
      </Card>
    </div>
  );
};
