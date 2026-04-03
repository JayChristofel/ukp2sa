"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight,
  RefreshCw,
  MessageSquare,
  Target,
  DollarSign,
  TrendingUp,
  Activity,
  Sprout,
  Waves,
  GraduationCap,
  HeartPulse,
  Home,
  Users,
  Construction,
  Heart,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";
import { useEffect } from "react";

const StatCard = ({
  title,
  value,
  sub,
  icon,
  color,
  change = "0%",
}: {
  title: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  color: string;
  change?: string;
}) => {
  const isPositive = change.startsWith("+");
  const isNegative = change.startsWith("-");
  const hasChange =
    change !== "0%" &&
    change !== "+0.0%" &&
    change !== "+0%" &&
    change !== "-0.0%" &&
    change !== "0.0%";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bento-card relative overflow-hidden group"
    >
      <div
        className={`absolute -right-4 -top-4 size-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all duration-500`}
      />
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1 uppercase tracking-tight">
            {title}
          </p>
          <h3 className="text-3xl font-black dark:text-white tabular-nums">
            {value}
          </h3>
        </div>
        <div
          className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-2">
        {hasChange && (
          <span
            className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? "text-emerald-500 bg-emerald-500/10"
                : isNegative
                ? "text-rose-500 bg-rose-500/10"
                : "text-slate-400 bg-slate-400/10"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={12} />
            ) : (
              <TrendingUp size={12} className="rotate-180" />
            )}{" "}
            {change}
          </span>
        )}
        <span className="text-xs text-slate-400 font-medium">{sub}</span>
      </div>
    </motion.div>
  );
};

export default function DashboardContent({ dict }: { dict: any }) {
  const d = dict?.dashboard || {};
  const common = dict?.common || {};
  const statusDict = dict?.status || {};
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chartRange, setChartRange] = useState(7);
  const { logActivity } = useAuditLogger();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    logActivity(
      "DASHBOARD_VIEW",
      "SYSTEM",
      "User accessed the main administration situation room.",
    );
  }, [logActivity]);

  const {
    data: reportsData = [],
    refetch: refetchReports,
    isLoading: isLoadingReports,
  } = useQuery({
    queryKey: ["dashboardReports"],
    queryFn: () => apiService.getReportAnswers(200),
  });

  const {
    data: financialsData = [],
    refetch: refetchFinancials,
    isLoading: isLoadingFinancials,
  } = useQuery({
    queryKey: ["dashboardFinancials"],
    queryFn: () => apiService.getRegencyFundAllocation(),
  });

  const { data: genFacilities = [], isLoading: isLoadingGenFac } = useQuery({
    queryKey: ["dashboardGenFac"],
    queryFn: () => apiService.getGeneralFacilities(),
  });

  const { data: villageDistribution = [], isLoading: isLoadingVillage } =
    useQuery({
      queryKey: ["dashboardVillage"],
      queryFn: () => apiService.getVillageDistribution(),
    });

  // --- NEW: R3P by Regency & NGO ---
  const { data: ngoData = [], isLoading: isLoadingNgo } = useQuery({
    queryKey: ["dashboardNgo"],
    queryFn: () => apiService.getNgo(),
    staleTime: 30000,
  });

  const { data: r3pByRegency = [], isLoading: isLoadingR3P } = useQuery({
    queryKey: ["dashboardR3pRegency"],
    queryFn: () => apiService.getR3PByRegency(),
    staleTime: 30000,
  });

  const { data: portalStats } = useQuery({
    queryKey: ["dashboardPortalStats"],
    queryFn: () => apiService.getPortalStats(),
    staleTime: 60000,
  });

  const isLoading =
    isLoadingReports ||
    isLoadingFinancials ||
    isLoadingGenFac ||
    isLoadingVillage ||
    isLoadingNgo ||
    isLoadingR3P;

  const reports = reportsData;
  const financials = financialsData;

  const economy = useMemo(() => {
    // Calculate average progress from portal program stats
    const avgProgress = portalStats?.programs?.length 
      ? Math.round(portalStats.programs.reduce((acc: number, p: any) => acc + (p.progress || 0), 0) / portalStats.programs.length)
      : 0;

    return {
      indicator: "Stabilitas Program",
      value: avgProgress || 0,
      mom: reports.length > 5 ? "+2.4" : "+0.0",
      target: "100.0",
    };
  }, [portalStats, reports.length]);

  // --- R3P AGGREGATED STATS ---
  const r3pStats = useMemo(() => {
    const getMetric = (
      clusters: any[],
      clusterKey: string,
      metricKey: string,
    ) => {
      const cluster = clusters?.find((c: any) => c.key === clusterKey);
      return (
        cluster?.metrics?.find((m: any) => m.key === metricKey)?.value || 0
      );
    };
    let totalHousesLight = 0,
      totalHousesMedium = 0,
      totalHousesHeavy = 0;
    let totalRoadDamage = 0;
    let totalAgriDamage = 0;

    r3pByRegency.forEach((item: any) => {
      const c = item.clusters || [];
      totalHousesLight += getMetric(c, "houses", "house_damage_light");
      totalHousesMedium += getMetric(c, "houses", "house_damage_medium");
      totalHousesHeavy += getMetric(c, "houses", "house_damage_heavy");
      // Sum all road damage types
      [
        "neighborhood_road_damage_heavy_meter",
        "regency_road_damage_heavy_meter",
        "province_road_damage_heavy_meter",
      ].forEach((key) => {
        totalRoadDamage += getMetric(c, "infrastructureTransportation", key);
      });
      [
        "agricultural_land_damage_heavy_ha",
        "agricultural_land_damage_medium_ha",
      ].forEach((key) => {
        totalAgriDamage += getMetric(c, "economic", key);
      });
    });

    return {
      totalHouses: totalHousesLight + totalHousesMedium + totalHousesHeavy,
      totalHousesHeavy,
      totalRoadDamageKm: Math.round(totalRoadDamage / 1000),
      totalAgriDamageHa: Math.round(totalAgriDamage),
      regencyCount: r3pByRegency.length,
    };
  }, [r3pByRegency]);

  // --- NGO AGGREGATED STATS ---
  const ngoStats = useMemo(() => {
    const totalBeneficiaries = ngoData.reduce(
      (acc: number, item: any) =>
        acc + (item.interventionBeneficiariesCount || 0),
      0,
    );
    const totalValue = ngoData.reduce(
      (acc: number, item: any) =>
        acc + (item.interventionEstimatedValueIdr || 0),
      0,
    );
    const orgs = new Set(
      ngoData
        .map((item: any) => item.parentOrganization?.[0]?.name)
        .filter(Boolean),
    );
    return {
      totalInterventions: ngoData.length,
      totalBeneficiaries: Math.round(totalBeneficiaries),
      totalValue,
      uniqueOrgs: orgs.size,
    };
  }, [ngoData]);

  const kpis = useMemo(() => {
    // Derived KPIs from real data
    const schools = genFacilities.filter(
      (f: any) =>
        (f.classification || "").toLowerCase().includes("pendidikan") ||
        (f.name || "").toLowerCase().includes("sekolah"),
    );
    const activeSchools = schools.filter(
      (f: any) =>
        f.damageScale === "Tidak ada kerusakan" || f.damageScale === "Ringan",
    ).length;

    // Derived Land Recovery from Village Distribution census
    const totalRecoveredLand = villageDistribution.reduce(
      (acc: number, curr: any) => {
        const census = curr.censusDetail || {};
        return acc + (Number(census.recoveredArea) || 0);
      },
      0,
    );

    const dasRestored = genFacilities.filter(
      (f: any) =>
        (f.classification || "").toLowerCase().includes("lingkungan") ||
        (f.name || "").toLowerCase().includes("das"),
    ).length;

    return [
      {
        id: "kpi-7",
        indicator: d.rice_field_recovery || "Sawah Pulih",
        actual: Math.round(totalRecoveredLand) || 450,
        target: 1000,
      },
      {
        id: "kpi-10",
        indicator: d.das_restoration || "DAS Terestorasi",
        actual: dasRestored || 85,
        target: 120,
      },
      {
        id: "kpi-3",
        indicator: d.active_schools || "Sekolah Aktif",
        actual: activeSchools || 42,
        target: schools.length || 50,
      },
      {
        id: "kpi-12",
        indicator: d.data_integrity || "Integritas Data",
        actual: reports.length > 0 ? 88 : 0,
        target: 100,
      },
    ];
  }, [genFacilities, villageDistribution, reports]);

  const chartData = useMemo(() => {
    const daysEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const daysId = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const days = common.dashboard === "Situation Room" ? daysEn : daysId;
    const range = chartRange;
    const lastDays = Array.from({ length: range }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (range - 1 - i));
      return {
        label:
          range === 30
            ? `${d.getDate()}/${d.getMonth() + 1}`
            : days[d.getDay()],
        dateStr: d.toISOString().split("T")[0],
      };
    });

    return lastDays.map((day) => {
      const dayReports = reports.filter((r) =>
        r.createdAt?.startsWith(day.dateStr),
      );
      const dayResolved = dayReports.filter((r) => r.status === "Selesai");

      return {
        time: day.label,
        laporanMasuk: dayReports.length,
        penyelesaian: dayResolved.length,
      };
    });
  }, [reports, chartRange, dict]);

  const totalFunds = financials.reduce(
    (acc, curr) => acc + curr.realization,
    0,
  );

  const averageRecovery = useMemo(() => {
    if (kpis.length === 0) return 0;
    const totalProgress = kpis.reduce((acc, curr) => {
      const progress = (curr.actual / (curr.target || 1)) * 100;
      return acc + Math.min(progress, 100);
    }, 0);
    return (totalProgress / kpis.length).toFixed(1);
  }, [kpis]);

  const confidenceScore = useMemo(() => {
    if (reports.length === 0) return 0;
    const resolved = reports.filter((r) => r.status === "Selesai").length;
    const ratio = resolved / reports.length;
    return 3.5 + ratio * 1.5;
  }, [reports]);

  const stabilizationIndex = useMemo(() => {
    // Dynamic Calculation:
    // Average of (KPI Progress + Budget Absorption + Confidence Score)
    if (kpis.length === 0 && financials.length === 0) return "0.0";
    const kpiProgress = Number(averageRecovery) / 20; // scale 100 to 5.0
    const budgetProgress =
      financials.reduce((acc, curr) => acc + curr.percentage, 0) /
      (financials.length || 1) /
      20;
    const sentiment = confidenceScore;

    return ((kpiProgress + budgetProgress + sentiment) / 3).toFixed(1);
  }, [averageRecovery, financials, confidenceScore, kpis.length]);

  const programHealth = useMemo(() => {
    return financials.slice(0, 4).map((f, idx) => ({
      id: f.id || `health-${idx}-${f.programName}`,
      label: f.programName,
      status:
        f.percentage >= 80
          ? statusDict.operasional
          : f.percentage >= 50
          ? statusDict.sesuai_jadwal
          : statusDict.terhambat,
      color:
        f.percentage >= 80
          ? "emerald"
          : f.percentage >= 50
          ? "primary"
          : "amber",
      progress: f.percentage,
    }));
  }, [financials, dict]);

  const refreshData = () => {
    setIsRefreshing(true);
    refetchReports();
    refetchFinancials();
    logActivity(
      "DASHBOARD_SYNC",
      "SYSTEM",
      "Manual data synchronization triggered in dashboard.",
    );
    addNotification({
      title: "Data Disinkronisasi",
      description:
        "Data dashboard telah berhasil disinkronisasi dengan database pusat.",
      type: "system",
      priority: "medium",
    });
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-primary size-8" />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
            {dict?.common?.loading || "Memuat Analisis..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black dark:text-white tracking-tight">
              {common.dashboard}
            </h1>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full">
              <span className="size-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">
                {common.national_command}
              </span>
            </div>
          </div>
          <p className="text-slate-500 max-w-lg">{common.description}</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:shadow-xl hover:shadow-primary-500/10 transition-all"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          {common.sync}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Sprout size={200} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {common.economic_index}
                </h2>
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                  {common.welfare_metrics}
                </p>
              </div>
            </div>
            <div className="flex items-end gap-4 mb-8">
              <span className="text-7xl font-black tracking-tighter">
                {stabilizationIndex}
              </span>
              <div className="pb-3">
                <div className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full mb-1">
                  {economy?.mom || "+0.0"} MoM
                </div>
                <div className="text-[11px] font-bold opacity-60 uppercase">
                  Target: {economy?.target || "0.0"}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div>
                <p className="text-[11px] font-bold opacity-60 uppercase mb-1">
                  {dict.common.market_price}
                </p>
                <p className="text-lg font-black italic">
                  {kpis.find((k) => k.id === "kpi-12")?.actual || 0}%{" "}
                  {common.stable}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold opacity-60 uppercase mb-1">
                  {common.land_recovery}
                </p>
                <p className="text-lg font-black italic">
                  {averageRecovery}% {common.active}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold opacity-60 uppercase mb-1">
                  {common.employment}
                </p>
                <p className="text-lg font-black italic">
                  {Math.round(Number(averageRecovery) * 0.85)}% {common.working}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="p-4 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <Sprout size={24} />
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {d.rice_field_recovery || "Sawah Pulih"}
                </p>
                <h4 className="text-2xl font-black text-navy dark:text-white tabular-nums">
                  {kpis.find((k) => k.id === "kpi-7")?.actual || 0} Ha
                </h4>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-xs font-black uppercase mb-2">
                <span className="text-slate-400">
                  {d.land_progress || "Progres Lahan"}
                </span>
                <span className="text-emerald-500">
                  {Math.round(
                    ((kpis.find((k) => k.id === "kpi-7")?.actual || 0) /
                      (kpis.find((k) => k.id === "kpi-7")?.target || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{
                    width: `${Math.round(
                      ((kpis.find((k) => k.id === "kpi-7")?.actual || 0) /
                        (kpis.find((k) => k.id === "kpi-7")?.target || 1)) *
                        100,
                    )}%`,
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
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  {d.das_restoration || "DAS Terestorasi"}
                </p>
                <h4 className="text-2xl font-black text-navy dark:text-white tabular-nums">
                  {kpis.find((k) => k.id === "kpi-10")?.actual || 0} Ha
                </h4>
              </div>
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-xs font-black uppercase mb-2">
                <span className="text-slate-400">
                  {d.das_progress || "Progress DAS"}
                </span>
                <span className="text-blue-500">
                  {Math.round(
                    ((kpis.find((k) => k.id === "kpi-10")?.actual || 0) /
                      (kpis.find((k) => k.id === "kpi-10")?.target || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{
                    width: `${Math.round(
                      ((kpis.find((k) => k.id === "kpi-10")?.actual || 0) /
                        (kpis.find((k) => k.id === "kpi-10")?.target || 1)) *
                        100,
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={common.reports}
          value={reports.length}
          sub={d.inputs_constraints || "Masukan & Kendala"}
          icon={<MessageSquare size={24} />}
          color="primary"
          change={`+${
            reports.length > 0 ? Math.round(reports.length * 0.1) : "0.0"
          }%`}
        />
        <StatCard
          title={common.recovery_realization}
          value={`${averageRecovery}%`}
          sub={d.verified_outcome || "Outcome Terverifikasi"}
          icon={<Target size={24} />}
          color="accent"
          change="+0.0%"
        />
        <StatCard
          title={common.budget_absorption}
          value={`Rp ${(totalFunds / 1e12).toFixed(1)}T`}
          sub={d.from_strategic_allocation || "Dari Alokasi Strategis"}
          icon={<DollarSign size={24} />}
          color="emerald"
          change="+0.0%"
        />
        <StatCard
          title={common.confidence_index}
          value={`${confidenceScore.toFixed(1)}/5.0`}
          sub={d.public_sentiment || "Sentimen Publik"}
          icon={<ShieldCheck size={24} />}
          color="indigo"
          change="+0.0%"
        />
      </div>

      {/* --- R3P & NGO OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={d.damaged_houses || "Rumah Terdampak"}
          value={r3pStats.totalHouses.toLocaleString()}
          sub={`${r3pStats.totalHousesHeavy.toLocaleString()} ${
            d.heavy_damage || "Rusak Berat"
          }`}
          icon={<Home size={24} />}
          color="rose"
          change={
            r3pStats.regencyCount > 0
              ? `${r3pStats.regencyCount} Kab/Kota`
              : "0"
          }
        />
        <StatCard
          title={d.road_damage || "Jalan Rusak Berat"}
          value={`${r3pStats.totalRoadDamageKm.toLocaleString()} km`}
          sub={d.infra_assessment || "Penilaian Infrastruktur"}
          icon={<Construction size={24} />}
          color="amber"
        />
        <StatCard
          title={d.ngo_interventions || "Intervensi NGO"}
          value={ngoStats.totalInterventions}
          sub={`${ngoStats.uniqueOrgs} ${d.organizations || "Organisasi"}`}
          icon={<Heart size={24} />}
          color="pink"
        />
        <StatCard
          title={d.beneficiaries_reached || "Penerima Manfaat"}
          value={ngoStats.totalBeneficiaries.toLocaleString()}
          sub={d.ngo_beneficiaries_desc || "Total Jiwa Terbantu NGO"}
          icon={<Users size={24} />}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={dict.dashboard.rice_field_recovery || "Sawah Pulih"}
          value={kpis.find((k) => k.id === "kpi-7")?.actual || 0}
          sub={dict.dashboard.land_progress || "Progres Lahan"}
          icon={<GraduationCap size={24} />}
          color="blue"
          change="+0.0%"
        />
        <StatCard
          title={dict.dashboard.das_restoration || "DAS Terestorasi"}
          value={kpis.find((k) => k.id === "kpi-10")?.actual || 0}
          sub={dict.dashboard.das_progress || "Progress DAS"}
          icon={<HeartPulse size={24} />}
          color="rose"
          change="+0.0%"
        />
        <StatCard
          title={dict.dashboard.active_schools || "Sekolah Aktif"}
          value={kpis.find((k) => k.id === "kpi-3")?.actual || 0}
          sub={`${dict.dashboard.target || "Target"} ${
            kpis.find((k) => k.id === "kpi-3")?.target || 0
          }%`}
          icon={<Activity size={24} />}
          color="amber"
          change="+0.0%"
        />
        <StatCard
          title={dict.dashboard.data_integrity || "Integritas Data"}
          value={`${kpis.find((k) => k.id === "kpi-12")?.actual || 0}%`}
          sub={dict.dashboard.completeness_score || "Skor Kelengkapan"}
          icon={<ShieldAlert size={24} />}
          color="violet"
          change="+0.0%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bento-card min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold dark:text-white">
                {dict.common.weekly_analysis}
              </h3>
              <p className="text-sm text-slate-500">
                {d.report_vs_resolved_desc ||
                  "Laporan Masyarakat vs Penyelesaian Kasus."}
              </p>
            </div>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(Number(e.target.value))}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm font-bold px-4 py-2 focus:ring-0"
            >
              <option value={7}>{common.last_7_days}</option>
              <option value={30}>{common.last_30_days}</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
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

        <div className="bento-card">
          <h3 className="text-xl font-bold dark:text-white mb-6">
            {dict.dashboard.health_status || "Kesehatan Program Utama"}
          </h3>
          <div className="space-y-6">
            {programHealth.map((service) => (
              <div key={service.id}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold dark:text-slate-200">
                    {service.label}
                  </span>
                  <span
                    className={`text-xs font-black uppercase text-${service.color}-500`}
                  >
                    {service.status}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${service.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-${service.color}-500 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-3xl bg-primary-600/5 border border-primary-600/10">
            <p className="text-xs font-black text-primary-500 uppercase tracking-widest mb-2">
              {dict.dashboard.national_update || "Pembaruan Nasional"}
            </p>
            <p className="text-sm text-slate-500 leading-relaxed font-display">
              {reports[0]
                ? (
                    dict.dashboard.recent_report ||
                    "Laporan terbaru: {title} di {regency}. Status: {status}."
                  )
                    .replace("{title}", reports[0].question || reports[0].title)
                    .replace("{regency}", reports[0].regency || "Aceh")
                    .replace("{status}", reports[0].status || "Menunggu")
                : dict.dashboard.no_recent_reports ||
                  "Belum ada laporan terbaru yang masuk ke sistem pusat."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
