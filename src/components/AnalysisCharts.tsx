"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SECTOR_COLORS } from "@/lib/constants";
import { ReportStatus } from "@/lib/types";
import { Card } from "./ui";
import {
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { useTheme, useI18n } from "@/app/[lang]/providers";
import { useUnifiedReports } from "@/hooks/useUnifiedReports";

const AnalysisCharts: React.FC = () => {
  const { isDark } = useTheme();
  const dict = useI18n();
  const d = dict?.stats || {};

  const { lang = "id" } = useParams() as { lang: string };
  const { reports, isRefetching } = useUnifiedReports(100, lang);

  const stats = useMemo(() => {
    const hasData = reports.length > 0;
    const total = reports.length || 1;
    const doneCount = reports.filter(
      (r) => r.status === ReportStatus.DONE,
    ).length;
    const donePercent = hasData ? Math.round((doneCount / total) * 100) : 0;
    const processCount = reports.length - doneCount;

    const pieData = hasData
      ? [
          { name: "Selesai", value: doneCount, color: "#8b5cf6" },
          {
            name: "Proses",
            value: Math.max(0, processCount),
            color: "#e2e8f0",
          },
        ]
      : [];

    const sectorsMap: Record<string, number> = {};
    reports.forEach((r) => {
      sectorsMap[r.category] = (sectorsMap[r.category] || 0) + 1;
    });
    const sectorPriority = Object.entries(sectorsMap)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / total) * 100),
        color: SECTOR_COLORS[name] || "#94a3b8",
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    const regionsMap: Record<string, number> = {};
    reports.forEach((r) => {
      const regency = r.regency || "Unknown";
      regionsMap[regency] = (regionsMap[regency] || 0) + 1;
    });
    const regionalStats = Object.entries(regionsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { pieData, donePercent, sectorPriority, regionalStats, hasData };
  }, [reports]);

  return (
    <section className="flex flex-col gap-10 md:gap-12" id="statistik">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
        <div className="flex flex-col gap-2 text-center md:text-left items-center md:items-start">
          <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
            <TrendingUp size={14} /> {d.sub || "Data Insight"}
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-navy dark:text-white tracking-tight leading-tight">
            {d.title || "Analisis Data Infrastruktur"}
          </h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">
            {d.desc || "Visualisasi performa pembangunan dengan data real-time"}
          </p>
        </div>

        {/* Status Koneksi Real-time */}
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div
            className={`size-2 rounded-full bg-emerald-500 ${
              isRefetching ? "animate-ping" : ""
            }`}
          />
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            <Zap size={10} /> Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {/* Report Status (Pie) */}
        <Card className="flex flex-col items-center justify-center min-h-[350px] p-6 md:p-8 group relative overflow-hidden">
          <div className="flex items-center gap-2 font-black text-[10px] text-slate-400 mb-6 uppercase tracking-widest leading-none">
            <PieIcon size={14} /> {d.status_title || "Status Laporan"}
          </div>
          <div className="relative w-full h-48">
            {stats.hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    wrapperStyle={{ zIndex: 100 }}
                    contentStyle={{
                      backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      borderRadius: "16px",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      fontWeight: "bold",
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                    itemStyle={{
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest gap-2">
                <div className="size-16 rounded-full border-2 border-dashed border-slate-200" />
                {d.no_data || "Belum Ada Data"}
              </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-navy dark:text-white group-hover:scale-110 transition-transform">
                {stats.donePercent}%
              </span>
              {/* <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                Selesai
              </span> */}
            </div>
          </div>
          <div className="mt-8 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-slate-200"></span>{" "}
              {d.status_process || "Proses"}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary shadow-lg shadow-primary/20"></span>{" "}
              {d.status_done || "Selesai"}
            </span>
          </div>
        </Card>

        {/* Priority Sector (Progress) */}
        <Card className="flex flex-col p-6 md:p-8 relative overflow-hidden">
          <div className="flex items-center gap-2 font-black text-[10px] text-slate-400 mb-8 uppercase tracking-widest leading-none">
            <Target size={14} /> {d.priority_title || "Prioritas Sektor"}
          </div>
          <div className="space-y-8">
            {stats.hasData ? (
              stats.sectorPriority.map((sector) => (
                <div key={sector.name} className="group">
                  <div className="flex justify-between items-end text-[10px] mb-3 font-black uppercase tracking-widest">
                    <span className="text-navy dark:text-white group-hover:text-primary transition-colors">
                      {sector.name}
                    </span>
                    <span className="text-primary text-xs">
                      {sector.value}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                    <div
                      className="h-full rounded-full transition-all duration-1000 group-hover:brightness-110"
                      style={{
                        width: `${sector.value}%`,
                        backgroundColor: sector.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-40 w-full flex flex-col items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest gap-4 border-2 border-dashed border-slate-100 rounded-3xl">
                No Data Available
              </div>
            )}
          </div>
          <p className="mt-auto pt-6 text-[9px] font-bold text-slate-400 text-center leading-relaxed">
            {d.update_notice ||
              "Data diperbarui secara otomatis berdasarkan laporan yang masuk ke sistem."}
          </p>
        </Card>

        {/* Regional Stats (Bar) */}
        <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2 flex flex-col p-6 md:p-8 group relative overflow-hidden">
          <div className="flex items-center gap-2 font-black text-[10px] text-slate-400 mb-8 uppercase tracking-widest leading-none">
            <BarChart3 size={14} />{" "}
            {d.regional_title || "Laporan Per Wilayah (Top 5)"}
          </div>
          <div className="flex-1 w-full h-48 min-h-[220px]">
            {stats.hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.regionalStats}
                  margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="6 6"
                    vertical={false}
                    stroke={isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    tick={{
                      fontSize: 10,
                      fontWeight: 900,
                      fill: isDark ? "#64748b" : "#94a3b8",
                    }}
                    height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fontWeight: 900,
                      fill: isDark ? "#64748b" : "#94a3b8",
                    }}
                  />
                  <Tooltip
                    cursor={{
                      fill: isDark
                        ? "rgba(139, 92, 246, 0.1)"
                        : "rgba(139, 92, 246, 0.05)",
                      radius: 12,
                    }}
                    contentStyle={{
                      backgroundColor: isDark ? "#0f172a" : "#ffffff",
                      borderRadius: "16px",
                      border: isDark
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "none",
                      boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      fontWeight: "bold",
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                    itemStyle={{
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    barSize={45}
                  />
                  <defs>
                    <linearGradient
                      id="barGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d8b4fe" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-widest gap-4 border-2 border-dashed border-slate-50 rounded-3xl">
                Waiting for Data Inflow
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AnalysisCharts;
