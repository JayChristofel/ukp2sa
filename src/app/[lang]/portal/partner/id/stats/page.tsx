"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Satellite,
  BarChart3,
  Search,
} from "lucide-react";

import {
  format,
  subDays,
  isSameDay,
  startOfMonth,
  subMonths,
  isWithinInterval,
  endOfMonth,
} from "date-fns";

import { useI18n } from "@/app/[lang]/providers";
import { Card } from "@/components/ui";
import { ReportStatus } from "@/lib/types";
import { PARTNERS_DATA } from "@/lib/constants";

import { useSession } from "@/stores/authStore";
import { ShieldAlert, ArrowRight } from "lucide-react";

const SkeletonValue = ({ width = "w-16", height = "h-8" }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-slate-200 dark:bg-slate-800 rounded-lg ${width} ${height} inline-block`}
  />
);

export default function PartnerStatsPage() {
  const { data: session, status: authStatus } = useSession();
  const dict = useI18n();
  const d = dict?.portal || {};
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("id") || "p1";
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (authStatus === "loading") return;
    if (!session?.user) {
      setIsAuthorized(false);
      return;
    }
    const user = session.user as any;
    const hasAccess =
      user.role === "superadmin" ||
      user.role === "admin" ||
      user.instansiId === partnerId;
    setIsAuthorized(hasAccess);
  }, [session, partnerId, authStatus]);

  const partner = useMemo(
    () => PARTNERS_DATA.find((p) => p.id === partnerId) || PARTNERS_DATA[0],
    [partnerId],
  );

  // Data Fetching
  const reports: any = []; // auto-cleaned
  const financials: any = []; // auto-cleaned
  const satMetrics: any = []; // auto-cleaned
  const satAlerts: any = []; // auto-cleaned
  const tasks: any = []; // auto-cleaned

  const isLoading = false; // Forced to false for demo or cleaned

  // Detect User Timezone Abbreviation (WIB, WITA, WIT, etc.)
  const userTimeZone = useMemo(() => {
    try {
      return (
        new Intl.DateTimeFormat("id-ID", { timeZoneName: "short" })
          .formatToParts(new Date())
          .find((p) => p.type === "timeZoneName")?.value || ""
      );
    } catch {
      return "WIB";
    }
  }, []);

  // Process Stats
  const stats = useMemo(() => {
    const partnerCategoryMap: Record<string, string> = {
      p1: "Jalan & Jembatan",
      p2: "Normalisasi Sungai",
      p3: "Penyediaan Huntara",
      p4: "Pembersihan Jalan Lingkungan",
    };

    const targetCategory = partnerCategoryMap[partnerId];
    const filteredReports = (reports as any[]).filter(
      (r) => r.category === targetCategory,
    );

    const totalReports = filteredReports.length;
    const completedReports = filteredReports.filter(
      (r) => r.status === ReportStatus.DONE,
    ).length;
    const pendingReports = totalReports - completedReports;
    const currentCompletionRate =
      totalReports > 0 ? Math.round((completedReports / totalReports) * 100) : 0;

    const now = new Date();
    const thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };
    const lastMonth = {
      start: startOfMonth(subMonths(now, 1)),
      end: endOfMonth(subMonths(now, 1)),
    };

    const getMonthStats = (interval: { start: Date; end: Date }) => {
      const monthReports = filteredReports.filter(
        (r) => r.createdAt && isWithinInterval(new Date(r.createdAt), interval),
      );
      const done = monthReports.filter(
        (r) => r.status === ReportStatus.DONE,
      ).length;
      return monthReports.length > 0 ? (done / monthReports.length) * 100 : 0;
    };

    const thisMonthRate = getMonthStats(thisMonth);
    const lastMonthRate = getMonthStats(lastMonth);
    const rateDiff = Math.round(thisMonthRate - lastMonthRate);

    const activeTasks = tasks
      .filter((t) => t.assignedTo === partnerId || t.assignedTo === partner.name)
      .filter((t) => t.status !== "Resolved");

    const taskCounts = {
      high: activeTasks.filter((t) => t.priority === "High").length,
      medium: activeTasks.filter((t) => t.priority === "Medium").length,
      low: activeTasks.filter((t) => t.priority === "Low").length,
    };

    const totalAllocation = financials.reduce((sum, f) => sum + (f.allocation || 0), 0);
    const totalRealization = financials.reduce((sum, f) => sum + (f.realization || 0), 0);
    const budgetPercent = totalAllocation > 0 ? Math.round((totalRealization / totalAllocation) * 100) : 0;

    const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
    const chartData = last7Days.map((day) => {
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      const cumulativeRealization = financials.reduce((sum, f) => {
        if (!f.realizedAt) return sum;
        return new Date(f.realizedAt) <= dayEnd ? sum + (f.realization || 0) : sum;
      }, 0);
      const dayBudgetPercent = totalAllocation > 0 ? (cumulativeRealization / totalAllocation) * 100 : 0;
      const reportsUpToDay = filteredReports.filter((r) => r.createdAt && new Date(r.createdAt) <= dayEnd);
      const completedUpToDay = reportsUpToDay.filter((r) => r.status === ReportStatus.DONE).length;
      const dayCompletionRate = reportsUpToDay.length > 0 ? (completedUpToDay / reportsUpToDay.length) * 100 : 0;
      const newReportsOnDay = filteredReports.filter((r) => r.createdAt && isSameDay(new Date(r.createdAt), day)).length;
      return {
        name: format(day, "EEE"),
        progress: Math.min(100, Math.round(dayBudgetPercent * 0.6 + dayCompletionRate * 0.4)),
        reports: newReportsOnDay,
      };
    });

    return {
      totalReports,
      completedReports,
      pendingReports,
      completionRate: currentCompletionRate,
      rateDiff,
      taskCounts,
      budgetPercent,
      chartData,
      filteredReports,
    };
  }, [reports, financials, tasks, partnerId, partner]);

  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="size-24 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20">
          <ShieldAlert size={48} />
        </div>
        <h2 className="text-4xl font-black text-navy dark:text-white mb-4 uppercase tracking-tight">
          {dict?.common?.access_denied || "Akses Ditolak"}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mb-10 leading-relaxed">
          {dict?.common?.no_permission ||
            "Maaf, Anda tidak memiliki izin untuk mengakses Dashboard ini."}{" "}
          {dict?.common?.use_correct_account ||
            "Silakan gunakan akun yang sesuai."}
        </p>
        <button
          onClick={() => router.push(`/${dict?.lang || "id"}/auth/login`)}
          className="flex items-center gap-3 px-8 py-4 bg-navy dark:bg-white text-white dark:text-navy rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {dict?.common?.back_to_login || "Kembali ke Login"}{" "}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-0 md:p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-navy text-white p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-primary-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
            <Activity size={16} /> {d.deep_analytics || "Analisis Mendalam"}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
            {d.my_stats || "Statistik Saya"}
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-lg max-w-xl">
            {dict?.common?.stats_desc ||
              "Pantau performa Satgas secara real-time dengan integrasi data multi-platform."}
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-end gap-2">
          <div className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-right">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              {d.partner_id || "Partner ID"}
            </div>
            <div className="text-xl font-black text-white">{partnerId}</div>
          </div>
          <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
            {d.live_sync || "Live Data Synchronized"}
          </div>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Completion Rate */}
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl w-fit mb-6">
            <TrendingUp size={24} />
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            {d.completion_rate || "Tingkat Penyelesaian"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white">
            {isLoading ? <SkeletonValue /> : `${stats.completionRate}%`}
          </div>
          {stats.rateDiff !== 0 && (
            <div
              className={`mt-4 flex items-center gap-2 text-[10px] font-bold ${
                stats.rateDiff > 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              <TrendingUp
                size={12}
                className={stats.rateDiff < 0 ? "rotate-180" : ""}
              />
              {stats.rateDiff > 0 ? "+" : ""}
              {stats.rateDiff}% {d.vs_last_month || "vs Bulan Lalu"}
            </div>
          )}
        </Card>

        {/* Task Completed */}
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit mb-6">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            {dict?.common?.task_completed || "Tugas Tuntas"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white">
            {isLoading ? <SkeletonValue /> : stats.completedReports}
          </div>
          <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {d.from_total || "DARI TOTAL"} {stats.totalReports}{" "}
            {d.related_reports || "LAPORAN TERKAIT"}
          </div>
        </Card>

        {/* Pending Actions */}
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl w-fit mb-6">
            <Clock size={24} />
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            {dict?.common?.pending_action || "Menunggu Aksi"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white">
            {isLoading ? (
              <SkeletonValue />
            ) : (
              stats.taskCounts.high +
              stats.taskCounts.medium +
              stats.taskCounts.low
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold uppercase tracking-tight">
            <span className="text-orange-600">
              HIGH: {stats.taskCounts.high}
            </span>
            <span className="text-blue-600">
              MED: {stats.taskCounts.medium}
            </span>
            <span className="text-slate-400">LOW: {stats.taskCounts.low}</span>
          </div>
        </Card>

        {/* Satellite Status */}
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl w-fit mb-6">
            <Satellite size={24} />
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
            {d.satellite_status || "Satellite Status"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white uppercase">
            {isLoading ? (
              <SkeletonValue width="w-24" />
            ) : (
              satMetrics?.precisionLevel || "N/A"
            )}
          </div>
          <div className="mt-4 text-[10px] font-bold text-blue-500 uppercase tracking-widest">
            {d.last_sync || "Last Sync"}: {format(new Date(), "HH:mm")}{" "}
            {userTimeZone}
          </div>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Trend Analysis Chart */}
        <Card className="xl:col-span-2 p-8 md:p-10 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-navy text-white rounded-2xl">
                <BarChart3 size={20} />
              </div>
              <div>
                <h4 className="text-xl font-black text-navy dark:text-white">
                  {d.performance_trend || "Tren Performa Mingguan"}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {d.filtered_by || "Filtered by"} {partner.name}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="size-2 rounded-full bg-primary" />{" "}
                {d.progress || "Progress"}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <span className="size-2 rounded-full bg-slate-200" />{" "}
                {d.new_reports || "New Reports"}
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorProgress"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="6 6"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 900, fill: "#94a3b8" }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 900, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    fontSize: "10px",
                    letterSpacing: "0.1em",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="progress"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorProgress)"
                />
                <Bar
                  dataKey="reports"
                  fill="#e2e8f0"
                  radius={[4, 4, 0, 0]}
                  barSize={12}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Intelligence Card */}
        <Card className="p-8 md:p-10 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-navy text-white relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#8b5cf6,transparent)]" />
          </div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/10 text-primary-400 rounded-2xl">
                <Satellite size={20} />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight">
                  {d.satellite_intel || "Satellite Intel"}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {d.live_stream || "Live Stream"}:{" "}
                  {(process.env.NEXT_PUBLIC_API_MODE || "rest").toUpperCase()}
                </p>
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {d.cloud_coverage || "Cloud Coverage"}
                  </span>
                  <span className="text-xs font-black text-emerald-400">
                    {satMetrics?.cloudCoverage}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${satMetrics?.cloudCoverage || 0}%` }}
                    className="h-full bg-emerald-400 rounded-full"
                  />
                </div>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 text-center">
                  {d.insar_deviation || "InSAR Deviation"}
                </div>
                <div className="text-3xl font-black text-center text-primary-400 tracking-tighter">
                  {satMetrics?.insarDeviation || "N/A"}
                </div>
              </div>

              <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                {satAlerts.length > 0 ? (
                  satAlerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 group hover:bg-red-500/20 transition-all"
                    >
                      <AlertTriangle
                        className="text-red-500 shrink-0"
                        size={18}
                      />
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black uppercase text-red-500">
                          {d.critical_alert || "Critical Alert"}
                        </span>
                        <div className="text-[10px] font-bold text-white/90 leading-tight">
                          {alert}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                    <CheckCircle2
                      className="text-emerald-500 shrink-0"
                      size={18}
                    />
                    <div className="text-[10px] font-bold text-white/90">
                      {d.no_threats || "No threats detected in sector."}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button className="mt-8 w-full py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              {d.open_sat_map || "Buka Peta Satelit"}{" "}
              <Search className="inline-block ml-2" size={14} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
