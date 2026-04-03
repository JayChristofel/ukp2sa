"use client";

import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { ReportStatus } from "@/lib/types";
import { Button, Card } from "@/components/ui";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Eye,
  PlusCircle,
  TrendingUp,
} from "lucide-react";

import { useQueries } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";
import { useI18n } from "@/app/[lang]/providers";

export const HeroSection: React.FC = () => {
  const dict = useI18n();
  const d = dict?.common || {};
  const common = dict?.common || {};

  // --- API Fetches ---
  const [qAnswers, qMissingPersons] = useQueries({
    queries: [
      {
        queryKey: ["reportAnswers"],
        queryFn: () => apiService.getReportAnswers(100),
        refetchInterval: 60000,
        staleTime: 60000,
      },
      {
        queryKey: ["missingPersonsFeed"],
        queryFn: () => apiService.getMissingPersons(1),
        refetchInterval: 300000,
        staleTime: 300000,
      },
    ],
  });

  // --- Merge Data logic similar to ReportSection ---
  const reports = useMemo(() => {
    const combined: any[] = [];

    // 1. Citizen Reports
    qAnswers.data?.forEach((item: any) => {
      combined.push({
        status: (() => {
          const s = (item.status || "").toUpperCase();
          if (s === "DONE" || s === "SELESAI") return ReportStatus.DONE;
          if (s === "PROCESS" || s === "DIPROSES") return ReportStatus.PROCESS;
          return ReportStatus.PENDING;
        })(),
      });
    });

    // 2. Missing Persons
    qMissingPersons.data?.forEach((item: any) => {
      combined.push({
        status: (() => {
          const s = (item.missingPersonStatus || "").toUpperCase();
          if (s === "RESOLVED" || s === "SELESAI" || s === "DONE")
            return ReportStatus.DONE;
          if (s === "SEARCHING" || s === "DIPROSES" || s === "PROSES")
            return ReportStatus.PROCESS;
          return ReportStatus.PENDING;
        })(),
      });
    });

    return combined;
  }, [qAnswers.data, qMissingPersons.data]);

  const stats = useMemo(() => {
    const total = reports.length;
    const processCount = reports.filter(
      (r: any) => r.status === ReportStatus.PROCESS,
    ).length;
    const doneCount = reports.filter(
      (r: any) => r.status === ReportStatus.DONE,
    ).length;

    const processPercent =
      total > 0 ? Math.round((processCount / total) * 100) : 0;
    const donePercent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    return { total, processCount, doneCount, processPercent, donePercent };
  }, [reports]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.section
      id="home"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex flex-col gap-10 mt-10 md:mt-0 relative overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start relative z-10">
          <motion.span
            variants={itemVariants}
            className="text-primary-600 dark:text-primary-400 font-black tracking-widest md:tracking-[0.25em] text-[10px] uppercase bg-primary-500/10 dark:bg-primary-500/20 px-5 py-2.5 rounded-full w-fit border border-primary-500/20 backdrop-blur-sm"
          >
            {d.hero_sub || "MONITORING TERPADU ACEH"}
          </motion.span>

          <motion.h2
            variants={itemVariants}
            className="text-navy dark:text-white text-clamp-heading font-black leading-[0.95] tracking-tight"
          >
            {d.hero_title_1 || "Pantau &"}{" "}
            <span className="neon-gradient-text">
              {d.hero_title_gradient || "Tindak Lanjut"}
            </span>{" "}
            {d.hero_title_2 || "Pemulihan Aceh."}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-slate-500 dark:text-slate-400 text-clamp-subheading leading-relaxed max-w-xl font-medium"
          >
            {d.hero_description ||
              "Platform Komunikasi dan Transparansi Pemulihan Aceh Pasca Bencana."}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 mt-2 w-full"
          >
            <a href="#kirim-laporan">
              <Button
                size="lg"
                className="rounded-2xl w-full sm:w-auto text-sm md:text-base px-10 h-14 md:h-16 font-black shadow-glow hover:scale-105 active:scale-95 transition-all duration-300"
                icon={<PlusCircle size={22} />}
              >
                {d.button_report || "Buat Laporan"}
              </Button>
            </a>
            <a href="#laporan">
              <Button
                variant="outline"
                size="lg"
                className="rounded-2xl w-full sm:w-auto text-sm md:text-base px-10 h-14 md:h-16 font-black backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                icon={<Eye size={22} />}
              >
                {d.button_monitor || "Pantau Laporan"}
              </Button>
            </a>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-primary-600 dark:text-primary-400 font-black tracking-widest md:tracking-[0.25em] text-[10px] uppercase bg-primary-500/10 dark:bg-primary-500/20 px-5 py-2.5 rounded-full w-fit border border-primary-500/20 backdrop-blur-sm max-w-full overflow-hidden"
          >
            {d.credits || "Dibuat oleh Keluarga Bjorka dan Keluarga Langie"}
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-5 relative group/grid"
        >
          <Card className="sm:col-span-2 p-8 md:p-10 flex items-center justify-between group hover:border-primary-500/40 transition-all overflow-hidden relative border-white/20 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-bento dark:shadow-bento-dark">
            <div className="absolute -top-10 -right-10 size-48 bg-primary-500/10 rounded-full blur-3xl group-hover:bg-primary-500/20 transition-all duration-1000" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em]">
                  {d.total_reports || "Total Laporan Masuk"}
                </p>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary-500/10 border border-primary-500/20 rounded-lg backdrop-blur-md">
                  <div className="size-1.5 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  <span className="text-[9px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                    {d.reports_live || "Langsung"}
                  </span>
                </div>
              </div>
              <p className="text-6xl md:text-7xl font-black text-navy dark:text-white group-hover:text-primary-500 transition-colors tracking-tighter">
                {stats.total.toLocaleString(
                  common.dashboard === "Situation Room" ? "en-US" : "id-ID",
                )}
              </p>
            </div>
            <div className="bg-primary-500/5 size-20 md:size-24 rounded-[2rem] flex items-center justify-center text-primary-500 border border-primary-500/10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 relative z-10 shadow-inner">
              <Activity size={48} />
            </div>
          </Card>

          <Card className="p-7 hover:border-orange-500/30 transition-all bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-bento dark:shadow-bento-dark group/card">
            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em]">
                {d.status_processing || "Diproses"}
              </p>
              <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500 group-hover/card:rotate-12 transition-transform">
                <AlertCircle size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-navy dark:text-white tracking-tight">
              {stats.processCount.toLocaleString(
                common.dashboard === "Situation Room" ? "en-US" : "id-ID",
              )}
            </p>
            <div className="mt-3 text-[10px] font-black text-orange-500 flex items-center gap-1.5 uppercase tracking-wider bg-orange-500/5 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} />
              {stats.processPercent}% {d.workload || "Beban Kerja"}
            </div>
          </Card>

          <Card className="p-7 hover:border-accent-500/30 transition-all bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-bento dark:shadow-bento-dark group/card">
            <div className="flex items-center justify-between mb-5">
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider md:tracking-[0.2em]">
                {d.status_done || "Selesai"}
              </p>
              <div className="bg-accent-500/10 p-2.5 rounded-xl text-accent-500 group-hover/card:rotate-12 transition-transform">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="text-4xl font-black text-navy dark:text-white tracking-tight">
              {stats.doneCount.toLocaleString(
                common.dashboard === "Situation Room" ? "en-US" : "id-ID",
              )}
            </p>
            <div className="mt-3 text-[10px] font-black text-accent-500 flex items-center gap-1.5 uppercase tracking-wider bg-accent-500/5 w-fit px-2 py-1 rounded-md">
              <TrendingUp size={12} />
              {stats.donePercent}% {d.resolved || "Teratasi"}
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};
