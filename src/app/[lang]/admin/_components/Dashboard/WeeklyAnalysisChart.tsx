"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyAnalysisChartProps {
  chartData: any[];
  chartRange: number;
  setChartRange: (val: number) => void;
  dict: any;
  common: any;
  d: any;
}

export const WeeklyAnalysisChart = ({
  chartData,
  chartRange,
  setChartRange,
  dict,
  common,
  d,
}: WeeklyAnalysisChartProps) => {
  return (
    <div className="lg:col-span-2 p-6 md:p-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] md:rounded-[3rem] shadow-xl min-h-[350px] md:min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight dark:text-white">
            {dict.common?.weekly_analysis || "Analisis Mingguan"}
          </h3>
          <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
            {d.report_vs_resolved_desc ||
              "Laporan Masyarakat vs Penyelesaian Kasus."}
          </p>
        </div>
        <select
          value={chartRange}
          onChange={(e) => setChartRange(Number(e.target.value))}
          className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-black uppercase px-4 py-2.5 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
        >
          <option value={7}>{common.last_7_days}</option>
          <option value={30}>{common.last_30_days}</option>
        </select>
      </div>
      <div className="h-[220px] md:h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSelesai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f010"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderRadius: "16px",
                border: "1px solid #1e293b",
                color: "#fff",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#8b5cf6" }}
            />
            <Area
              type="monotone"
              dataKey="laporanMasuk"
              stroke="#8b5cf6"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorMasuk)"
            />
            <Area
              type="monotone"
              dataKey="penyelesaian"
              stroke="#10b981"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorSelesai)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
