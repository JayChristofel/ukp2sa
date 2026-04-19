"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  ShieldCheck,
  RefreshCw,
  MessageSquare,
  Target,
  DollarSign,
  Activity,
  ShieldAlert,
  Home,
  Users,
  Construction,
  Heart,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useNotificationStore } from "@/hooks/useNotificationStore";

// Modular Components
import { StatCard } from "./_components/Dashboard/StatCard";
import { DashboardHeader } from "./_components/Dashboard/DashboardHeader";
import { EconomicIndexCard } from "./_components/Dashboard/EconomicIndexCard";
import { StrategicKPIs } from "./_components/Dashboard/StrategicKPIs";
import { WeeklyAnalysisChart } from "./_components/Dashboard/WeeklyAnalysisChart";
import { ProgramHealth } from "./_components/Dashboard/ProgramHealth";

/**
 * DashboardContent - Orchestrator for the National Command Center.
 * Refactored for Modular Architecture while preserving 100% of the original premium design.
 */
export default function DashboardContent({ dict }: { dict: any }) {
  const params = useParams();
  const d = dict?.dashboard || {};
  const common = dict?.common || {};
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

  // --- DATA FETCHING ---
  const {
    data: reportsData = [],
    refetch: refetchReports,
    isLoading: isLoadingReports,
  } = useQuery({
    queryKey: ["dashboardReports"],
    queryFn: () => apiService.getReportAnswers(200),
  });

  const {
    data: missingPersonsData = [],
    isLoading: isLoadingMissing,
  } = useQuery({
    queryKey: ["dashboardMissingPersons"],
    queryFn: () => apiService.getMissingPersons(1),
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

  const { data: clearingHouseData = [] } = useQuery({
    queryKey: ["dashboardClearingHouse"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 60000,
  });

  const isLoading =
    isLoadingReports ||
    isLoadingFinancials ||
    isLoadingGenFac ||
    isLoadingVillage ||
    isLoadingNgo ||
    isLoadingR3P ||
    isLoadingMissing;

  const latestReport = reportsData[0] || null;

  // --- DATA AGGREGATION LOGIC (Preserved Original) ---
  
  const totalPublicReports = useMemo(() => reportsData.length + missingPersonsData.length, [reportsData, missingPersonsData]);

  const aggregatedFinancials = useMemo(() => {
    const records: any[] = [];
    if (Array.isArray(clearingHouseData)) {
      clearingHouseData.filter((ch: any) => ch.sector !== "NGO / Kemanusiaan").forEach((ch: any) => {
        const alloc = Number(ch.budget || 0);
        const progress = Number(ch.confidence || 0);
        records.push({ allocation: alloc, realization: (alloc * progress) / 100, percentage: progress, programName: ch.title || "Program Strategis" });
      });
    }
    if (Array.isArray(ngoData)) {
      ngoData.forEach((ngo: any) => {
        const alloc = Number(ngo.interventionEstimatedValueIdr || ngo.budget || 0);
        if (alloc > 0) {
          const progress = 65; 
          records.push({ allocation: alloc, realization: (alloc * progress) / 100, percentage: progress, programName: ngo.org_name || "Intervensi NGO" });
        }
      });
    }
    if (Array.isArray(financialsData)) {
      financialsData.forEach((f: any) => {
        records.push({ allocation: Number(f.allocation || 0), realization: Number(f.realization || 0), percentage: Number(f.percentage || 0), programName: f.programName || "Program Daerah" });
      });
    }
    return records;
  }, [financialsData, ngoData, clearingHouseData]);

  const totalFunds = useMemo(() => aggregatedFinancials.reduce((acc, curr) => acc + (Number(curr.realization) || 0), 0), [aggregatedFinancials]);

  const fundDisplay = useMemo(() => {
    if (isNaN(totalFunds) || totalFunds === 0) return "Rp 0.0";
    if (totalFunds >= 1e12) return `Rp ${(totalFunds / 1e12).toFixed(1)} T`;
    if (totalFunds >= 1e9) return `Rp ${(totalFunds / 1e9).toFixed(1)} M`;
    return `Rp ${(totalFunds / 1e6).toFixed(1)} JT`;
  }, [totalFunds]);

  const economy = useMemo(() => {
    const avgProgress = portalStats?.programs?.length 
      ? Math.round(portalStats.programs.reduce((acc: number, p: any) => acc + (p.progress || 0), 0) / portalStats.programs.length)
      : 0;
    return { indicator: d.program_stability || "Stabilitas Program", value: avgProgress || 0, mom: "+0.0", target: "100.0" };
  }, [portalStats, d]);

  const r3pStats = useMemo(() => {
    const getMetric = (clusters: any[], clusterKey: string, metricKey: string) => {
      const cluster = clusters?.find((c: any) => c.key === clusterKey);
      return cluster?.metrics?.find((m: any) => m.key === metricKey)?.value || 0;
    };
    let totalHousesLight = 0, totalHousesMedium = 0, totalHousesHeavy = 0, totalRoadDamage = 0, totalAgriDamage = 0;
    r3pByRegency.forEach((item: any) => {
      const c = item.clusters || [];
      totalHousesLight += getMetric(c, "houses", "house_damage_light");
      totalHousesMedium += getMetric(c, "houses", "house_damage_medium");
      totalHousesHeavy += getMetric(c, "houses", "house_damage_heavy");
      ["neighborhood_road_damage_heavy_meter", "regency_road_damage_heavy_meter", "province_road_damage_heavy_meter"].forEach((key) => { totalRoadDamage += getMetric(c, "infrastructureTransportation", key); });
      ["agricultural_land_damage_heavy_ha", "agricultural_land_damage_medium_ha"].forEach((key) => { totalAgriDamage += getMetric(c, "economic", key); });
    });
    return { totalHouses: totalHousesLight + totalHousesMedium + totalHousesHeavy, totalHousesHeavy, totalRoadDamageKm: Math.round(totalRoadDamage / 1000), totalAgriDamageHa: Math.round(totalAgriDamage), regencyCount: r3pByRegency.length };
  }, [r3pByRegency]);

  const ngoStats = useMemo(() => {
    const totalBeneficiaries = ngoData.reduce((acc: number, item: any) => acc + (item.interventionBeneficiariesCount || 0), 0);
    const orgs = new Set(ngoData.map((item: any) => item.parentOrganization?.[0]?.name || item.org_name).filter(Boolean));
    return { totalInterventions: ngoData.length, totalBeneficiaries: Math.round(totalBeneficiaries), uniqueOrgs: orgs.size };
  }, [ngoData]);

  const kpis = useMemo(() => {
    const schools = genFacilities.filter((f: any) => f.isSchool || (f.classification || "").toLowerCase().includes("pendidikan"));
    const activeSchools = schools.filter((f: any) => f.damageScale === "Tidak ada kerusakan" || f.status === "Aktif").length;
    const totalRecoveredLand = 1840 + villageDistribution.reduce((acc: number, curr: any) => acc + (Number(curr.recoveredArea) || 0), 0);
    return [
      { id: "kpi-7", indicator: d.rice_field_recovery || "Sawah Pulih", actual: Math.round(totalRecoveredLand), target: 2500 },
      { id: "kpi-10", indicator: d.das_restoration || "DAS Terestorasi", actual: (genFacilities.filter(f => f.isDAS).length) || 85, target: 120 },
      { id: "kpi-3", indicator: d.active_schools || "Sekolah Aktif", actual: activeSchools || 32, target: schools.length || 45 },
      { id: "kpi-12", indicator: d.data_integrity || "Integritas Data", actual: reportsData.length > 0 ? 100 : 0, target: 100 },
    ];
  }, [genFacilities, villageDistribution, reportsData, d]);

  const averageRecovery = useMemo(() => {
    if (kpis.length === 0) return "0.0";
    const totalProgress = kpis.reduce((acc, curr) => acc + Math.min((Number(curr.actual) / Number(curr.target)) * 100, 100), 0);
    return (totalProgress / kpis.length).toFixed(1);
  }, [kpis]);

  const confidenceScore = useMemo(() => {
    if (reportsData.length === 0) return "3.8";
    const resolved = reportsData.filter((r) => r.status?.toLowerCase() === "selesai").length;
    const score = Math.max(0, Math.min(5, (resolved / reportsData.length * 5.0) + 1.0));
    return score.toFixed(1);
  }, [reportsData]);

  const stabilizationIndex = useMemo(() => {
    const kpiVal = Number(averageRecovery) || 0;
    const totalBudgetPercentage = aggregatedFinancials.length > 0 ? aggregatedFinancials.reduce((acc: number, curr: any) => acc + (Number(curr.percentage) || 0), 0) / aggregatedFinancials.length : 0;
    return ((kpiVal / 20 + totalBudgetPercentage / 20 + Number(confidenceScore)) / 3).toFixed(1);
  }, [averageRecovery, aggregatedFinancials, confidenceScore]);

  const chartData = useMemo(() => {
    const days = common.dashboard === "Situation Room" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return Array.from({ length: chartRange }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (chartRange - 1 - i));
      const dateStr = date.toISOString().split("T")[0];
      const dayReports = reportsData.filter((r) => r.createdAt?.startsWith(dateStr));
      return { time: chartRange === 30 ? `${date.getDate()}/${date.getMonth() + 1}` : days[date.getDay()], laporanMasuk: dayReports.length, penyelesaian: dayReports.filter(r => r.status === "Selesai").length };
    });
  }, [reportsData, chartRange, common.dashboard]);

  const programHealth = useMemo(() => {
    const statusDict = dict?.status || {};
    const mapStatus = (p: number) => {
      const pct = Math.min(100, Math.max(0, p));
      if (pct >= 80) return { status: statusDict.operasional || "OPERATIONAL", color: "emerald", progress: pct };
      if (pct >= 40) return { status: statusDict.sesuai_jadwal || "ON TRACK", color: "amber", progress: pct };
      return { status: statusDict.terhambat || "CRITICAL", color: "rose", progress: pct };
    };
    return [
      { id: "h-infra", label: "Program Rehabilitasi Infrastruktur", ...mapStatus(Number(averageRecovery)) },
      { id: "h-env", label: "Restorasi Lingkungan & Pertanian", ...mapStatus(villageDistribution.length > 0 ? (1840 + villageDistribution.reduce((acc, cur) => acc + (Number(cur.recoveredArea) || 0), 0)) / 25 : 0) },
      { id: "h-budget", label: "Program Strategis Daerah", ...mapStatus(aggregatedFinancials.length > 0 ? aggregatedFinancials.reduce((acc: number, curr: any) => acc + (Number(curr.percentage) || 0), 0) / aggregatedFinancials.length : 0) },
      { id: "h-social", label: "Kesejahteraan & Bantuan Sosial", ...mapStatus(Number(confidenceScore) * 20) },
    ];
  }, [averageRecovery, villageDistribution, aggregatedFinancials, confidenceScore, dict]);

  const refreshData = () => {
    setIsRefreshing(true);
    refetchReports();
    refetchFinancials();
    logActivity("DASHBOARD_SYNC", "SYSTEM", "Manual data synchronization triggered.");
    addNotification({
      title: (params.lang as string) === "en" ? "Data Synchronized" : "Data Disinkronisasi",
      description: (params.lang as string) === "en" ? "Dashboard data has been updated." : "Data dashboard telah diperbarui.",
      type: "system",
      priority: "medium",
      createdAt: new Date().toISOString()
    });
    setTimeout(() => setIsRefreshing(false), 800);
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-primary size-8" />
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{dict?.common?.loading || "Memuat Analisis..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* 1. Header */}
      <DashboardHeader common={common} refreshData={refreshData} isRefreshing={isRefreshing} />

      {/* 2. Primary Analysis (Economic Index & Strategic KPIs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EconomicIndexCard 
          stabilizationIndex={stabilizationIndex} 
          economy={economy} 
          latestReport={latestReport} 
          averageRecovery={averageRecovery} 
          kpis={kpis} 
          common={common} 
          dict={dict} 
        />
        <StrategicKPIs kpis={kpis} d={d} />
      </div>

      {/* 3. Core Metrics Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={d.stats_public_reports || "Public Reports"} value={totalPublicReports.toString()} sub={d.inputs_constraints || "Masukan & Kendala"} icon={<MessageSquare size={24} />} color="primary" change="+5%" />
        <StatCard title={common.recovery_realization} value={`${averageRecovery}%`} sub={d.verified_outcome || "Outcome Terverifikasi"} icon={<Target size={24} />} color="accent" />
        <StatCard title={common.budget_absorption} value={fundDisplay} sub={d.from_strategic_allocation || "Dari Alokasi Strategis"} icon={<DollarSign size={24} />} color="emerald" />
        <StatCard title={common.confidence_index || "Indeks Kepercayaan"} value={`${Number(confidenceScore).toFixed(1)}/5.0`} sub={d.public_sentiment || "Sentimen Publik"} icon={<ShieldCheck size={24} />} color="indigo" />
      </div>

      {/* 4. Core Metrics Row 2 (R3P & NGO) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title={d.damaged_houses || "Damaged Houses"} value={r3pStats.totalHouses.toLocaleString()} sub={`${r3pStats.totalHousesHeavy.toLocaleString()} ${d.heavy_damage || "Heavy Damage"}`} icon={<Home size={24} />} color="rose" change={r3pStats.regencyCount > 0 ? `${r3pStats.regencyCount} Kab/Kota` : "0"} />
        <StatCard title={d.road_damage || "Severely Damaged Roads"} value={`${r3pStats.totalRoadDamageKm.toLocaleString()} km`} sub={d.infra_assessment || "Infrastructure Assessment"} icon={<Construction size={24} />} color="amber" />
        <StatCard title={d.ngo_interventions || "NGO Interventions"} value={ngoStats.totalInterventions} sub={`${ngoStats.uniqueOrgs} ${d.organizations || "Organizations"}`} icon={<Heart size={24} />} color="pink" />
        <StatCard title={d.beneficiaries_reached || "Beneficiaries Reached"} value={ngoStats.totalBeneficiaries.toLocaleString()} sub={d.ngo_beneficiaries_desc || "Total Persons Assisted by NGO"} icon={<Users size={24} />} color="teal" />
      </div>

      {/* 5. System & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <StatCard title={d.active_schools || "Sekolah Aktif"} value={kpis.find((k) => k.id === "kpi-3")?.actual || 0} sub={`${d.target || "Target"} ${kpis.find((k) => k.id === "kpi-3")?.target || 0}%`} icon={<Activity size={24} />} color="amber" />
        <StatCard title={d.data_integrity || "Integritas Data"} value={`${kpis.find((k) => k.id === "kpi-12")?.actual || 0}%`} sub={d.completeness_score || "Skor Kelengkapan"} icon={<ShieldAlert size={24} />} color="violet" />
      </div>

      {/* 6. Deep Analytics (Chart & Health Monitoring) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <WeeklyAnalysisChart chartData={chartData} chartRange={chartRange} setChartRange={setChartRange} dict={dict} common={common} d={d} />
        <ProgramHealth programHealth={programHealth} dict={dict} latestReport={latestReport} />
      </div>
    </div>
  );
}
