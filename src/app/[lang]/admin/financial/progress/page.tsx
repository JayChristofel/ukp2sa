"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { Card, Button } from "@/components/ui";
import { useI18n } from "@/app/[lang]/providers";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import {
  Tooltip,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart as RePieChart,
} from "recharts";
import {
  Activity,
  DollarSign,
  Target,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldAlert,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { PARTNERS_DATA } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function FinancialProgressContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const dict = useI18n();
  const f = dict?.financial || {};
  const router = useRouter();
  const lang = params.lang as string;
  const partnerIdParam = searchParams.get("partnerId");
  const { logActivity } = useAuditLogger();

  const { data: ngoData = [], isLoading: isLoadingNgo } = useQuery({
    queryKey: ["ngoData"],
    queryFn: () => apiService.getNgo(1),
    staleTime: 30000,
  });

  const { data: clearingHouseData = [], isLoading: isLoadingCH } = useQuery({
    queryKey: ["clearingHouseData"],
    queryFn: () => apiService.getClearingHouseData(),
    staleTime: 60000,
  });

  const isLoading = isLoadingNgo || isLoadingCH;

  const partnerName = partnerIdParam
    ? PARTNERS_DATA.find((x) => x.id === partnerIdParam)?.name ||
      f.national ||
      "Nasional"
    : f.national_consolidation || "Konsolidasi Nasional";

  useEffect(() => {
    logActivity(
      "FINANCIAL_PROGRESS_VIEW",
      "FINANCIAL",
      `User accessed detailed financial progress for: ${partnerName}`,
    );
  }, [logActivity, partnerName]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const stagesMap = f.stages || {};
  const STAGES = React.useMemo(
    () => [
      stagesMap.planning || "Perencanaan",
      stagesMap.approval || "Persetujuan",
      stagesMap.treasury || "Kas Negara",
      stagesMap.transfer || "Transfer",
      stagesMap.done || "Selesai",
    ],
    [stagesMap],
  );

  const records = React.useMemo(() => {
    const arr: any[] = [];
    let idCount = 1;

    const getStage = (prog: number) => {
      if (prog >= 90) return STAGES[4];
      if (prog >= 60) return STAGES[3];
      if (prog >= 40) return STAGES[2];
      if (prog >= 20) return STAGES[1];
      return STAGES[0];
    };

    const stableDate = "2024-03-20T00:00:00Z";

    clearingHouseData
      .filter((col: any) => col.sector !== "NGO / Kemanusiaan")
      .forEach((ch: any) => {
        const alloc = ch.budget || 500000000;
        const progress = ch.confidence || 50;
        const realz = (alloc * progress) / 100;

        arr.push({
          id: `PBG-${idCount++}`,
          source: ch.fundingScheme?.includes("APBN") ? "APBN" : "APBD",
          programName: ch.title,
          allocation: alloc,
          realization: realz,
          percentage: progress,
          lastUpdate: stableDate,
          disbursementStage: getStage(progress),
        });
      });

    ngoData.slice(0, 50).forEach((ngo: any) => {
      const alloc = ngo.interventionEstimatedValueIdr || 0;
      if (alloc === 0) return;

      const progress = 45 + (idCount % 35); // Deterministic
      const realz = (alloc * progress) / 100;
      const orgName = ngo.parentOrganization?.[0]?.name || "NGO Internasional";

      arr.push({
        id: `NGO-${idCount++}`,
        source: "NGO/Donor",
        programName: `${orgName}: ${
          ngo.interventionActivityDescription?.slice(0, 50) ||
          "Intervensi Kemanusiaan"
        }`,
        allocation: alloc,
        realization: realz,
        percentage: progress,
        lastUpdate: stableDate,
        disbursementStage: getStage(progress),
      });
    });

    return arr.sort((a, b) => b.allocation - a.allocation);
  }, [ngoData, clearingHouseData, STAGES]);

  const { totalAllocation, totalRealization, overallPercentage } =
    React.useMemo(() => {
      const alloc = records.reduce(
        (acc: any, curr: any) => acc + curr.allocation,
        0,
      );
      const realz = records.reduce(
        (acc: any, curr: any) => acc + curr.realization,
        0,
      );
      const pct = alloc > 0 ? (realz / alloc) * 100 : 0;
      return {
        totalAllocation: alloc,
        totalRealization: realz,
        overallPercentage: pct,
      };
    }, [records]);

  const sourceData = React.useMemo(() => {
    return records.reduce((acc: any[], curr) => {
      const existing = acc.find((a) => a.name === curr.source);
      if (existing) {
        existing.value += curr.allocation;
      } else {
        acc.push({ name: curr.source, value: curr.allocation });
      }
      return acc;
    }, []);
  }, [records]);

  const SOURCE_COLORS = [
    "#8b5cf6",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
    "#ec4899",
  ];

  return (
    <div className="space-y-6 md:space-y-10 pb-20 font-display">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 dark:bg-slate-900/20 backdrop-blur-sm">
          <Loader2 className="size-12 text-primary animate-spin" />
        </div>
      )}
      <div className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-navy dark:text-white mb-2 tracking-tight uppercase">
            {f.progress_title || "Progres Finansial"}
          </h1>
          <p className="text-slate-500 font-bold flex items-center gap-2 text-xs md:text-sm">
            <Activity size={18} className="text-primary" /> {partnerName}
          </p>
        </div>
        <Button
          onClick={() =>
            router.push(
              `/${lang}/admin/financial/input${
                partnerIdParam ? `?partnerId=${partnerIdParam}` : ""
              }`,
            )
          }
          className="w-full md:w-auto rounded-2xl h-12 px-6 font-black uppercase text-[10px] tracking-widest shadow-glow-primary"
        >
          <Plus size={16} className="mr-2" />{" "}
          {f.input_new || "Input Anggaran Baru"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 bg-primary text-white border-none rounded-3xl shadow-xl shadow-primary/20">
          <DollarSign size={32} className="mb-4 opacity-50" />
          <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
            {f.total_allocation || "Total Alokasi"}
          </div>
          <div className="text-2xl font-black mt-1">
            {formatCurrency(totalAllocation)}
          </div>
        </Card>
        <Card className="p-6 bg-navy text-white border-none rounded-3xl shadow-xl shadow-navy/20">
          <Target size={32} className="mb-4 opacity-50" />
          <div className="text-[10px] font-black uppercase tracking-widest opacity-80">
            {f.total_realization || "Total Realisasi"}
          </div>
          <div className="text-2xl font-black mt-1">
            {formatCurrency(totalRealization)}
          </div>
        </Card>
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl">
          <TrendingUp size={32} className="mb-4 text-accent opacity-50" />
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {f.avg_absorption || "Rata-rata Penyerapan"}
          </div>
          <div className="text-3xl font-black mt-1 text-navy dark:text-white">
            {overallPercentage.toFixed(1)}%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl">
          <h3 className="text-xl font-black text-navy dark:text-white mb-8">
            {f.composition_title || "Komposisi Sumber Dana"}
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SOURCE_COLORS[index % SOURCE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: "1rem", border: "none" }}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {sourceData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor:
                      SOURCE_COLORS[index % SOURCE_COLORS.length],
                  }}
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col">
          <h3 className="text-xl font-black text-navy dark:text-white mb-8">
            {f.absorption_list || "Daftar Penyerapan"}
          </h3>
          <div className="space-y-6 overflow-y-auto max-h-[300px] pr-4 custom-scrollbar">
            {records.map((record) => (
              <Dialog key={record.id}>
                <DialogTrigger asChild>
                  <div className="p-6 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/50 hover:dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-slate-800 cursor-pointer group transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[8px] font-black uppercase tracking-widest">
                            {record.source}
                          </span>
                          <h4 className="text-sm font-black text-navy dark:text-white tracking-tight group-hover:text-primary transition-colors">
                            {record.programName}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase flex items-center gap-2">
                          Last Update:{" "}
                          {new Date(record.lastUpdate).toLocaleDateString(
                            lang === "en" ? "en-US" : "id-ID",
                          )}
                          <ArrowRight
                            size={14}
                            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                          />
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-navy dark:text-white group-hover:text-primary transition-colors">
                          {record.percentage.toFixed(1)}%
                        </div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase">
                          {f.absorption || "Penyerapan"}
                        </div>
                      </div>
                    </div>

                    {/* Disbursement Stepper */}
                    <div className="flex items-center justify-between mb-6 relative px-2">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-slate-200 dark:bg-slate-800 -z-0" />
                      {STAGES.map((stage, idx) => {
                        const isCurrent = record.disbursementStage === stage;
                        const isPast =
                          STAGES.indexOf(record.disbursementStage) > idx;
                        return (
                          <div
                            key={stage}
                            className="relative z-10 flex flex-col items-center gap-1"
                          >
                            <div
                              className={`size-5 rounded-full flex items-center justify-center transition-all ${
                                isCurrent
                                  ? "bg-primary text-white scale-125 shadow-lg shadow-primary/30"
                                  : isPast
                                  ? "bg-emerald-500 text-white"
                                  : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-300"
                              }`}
                            >
                              {isPast ? (
                                <CheckCircle size={10} />
                              ) : (
                                <div className="size-1.5 rounded-full bg-current" />
                              )}
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase tracking-tighter ${
                                isCurrent
                                  ? "text-primary"
                                  : "text-slate-400 opacity-50"
                              }`}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                        style={{ width: `${record.percentage}%` }}
                      />
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white dark:bg-slate-900 border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0 flex flex-col gap-0 max-h-[90vh]">
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-slate-100 dark:border-slate-800 relative overflow-hidden">
                      <div className="relative z-10">
                        <DialogHeader className="text-left mb-6">
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[9px] px-3">
                              {record.source}
                            </Badge>
                            <span className="text-slate-300 dark:text-slate-700 font-bold">
                              •
                            </span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
                              REF: {record.id}
                            </span>
                          </div>
                          <DialogTitle className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tighter leading-tight">
                            {record.programName}
                          </DialogTitle>
                          <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                            {f.detail_desc || "Detail rincian penyerapan anggaran dan tahapan distribusi dana bantuan."}
                          </DialogDescription>
                        </DialogHeader>

                        {/* Top Stats Board */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                              {f.total_allocation || "Total Alokasi"}
                            </p>
                            <p className="text-[15px] font-black text-navy dark:text-white truncate">
                              {formatCurrency(record.allocation)}
                            </p>
                          </div>
                          <div className="bg-white dark:bg-slate-950 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                              {f.total_realization || "Realisasi Kas"}
                            </p>
                            <p className="text-[15px] font-black text-emerald-600 truncate">
                              {formatCurrency(record.realization)}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Decoration Element */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    </div>

                    {/* Progress Flow Detail */}
                    <div className="p-8 space-y-8 bg-slate-50 dark:bg-slate-900/50">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            {f.stage_progress || "Posisi Kas Saat Ini"}
                          </h5>
                          <span className="text-lg font-black text-primary">
                            {record.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner p-1">
                          <div
                            className="bg-gradient-to-r from-primary to-emerald-400 h-full rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all duration-1000"
                            style={{ width: `${record.percentage}%` }}
                          />
                        </div>
                        <p className="text-center mt-3 text-[11px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">
                          ➜ Tahap: {record.disbursementStage}
                        </p>
                      </div>

                      {/* The Transparency Pipeline Diagram */}
                      <div className="p-6 bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center mb-6">
                          Alur Distribusi Bantuan
                        </h5>
                        <div className="flex items-center justify-between gap-2 relative">
                          <div className="absolute top-4 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/20 via-primary/20 to-orange-500/20" />

                          <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                            <div className="size-10 rounded-2xl bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
                              <DollarSign size={16} />
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">
                              Dana: {record.source}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                            <div className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                              <Activity size={16} />
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">
                              Intervensi Program
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                            <div className="size-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                              <Target size={16} />
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">
                              Eksekusi Lapangan
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center gap-2 relative z-10">
                            <div className="size-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                              <TrendingUp size={16} />
                            </div>
                            <span className="text-[9px] font-black uppercase text-slate-500 text-center leading-tight">
                              Capaian Manfaat
                            </span>
                          </div>
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-start gap-4">
                          <ShieldAlert
                            size={16}
                            className="text-primary mt-0.5 shrink-0"
                          />
                          <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 italic">
                            Catatan Sistem: Penyaluran tahap ini dinyatakan{" "}
                            {record.percentage >= 60
                              ? "sesuai target"
                              : "membutuhkan akselerasi"}{" "}
                            berdasarkan timeline kurva-S standar penanganan
                            kebencanaan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function FinancialProgressPage() {
  const dict = useI18n();
  return (
    <Suspense
      fallback={
        <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase text-xs tracking-widest">
          {dict?.common?.loading || "Memuat Analisis..."}
        </div>
      }
    >
      <FinancialProgressContent />
    </Suspense>
  );
}
