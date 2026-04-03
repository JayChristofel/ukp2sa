"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui";
import {
  MessageSquare,
  Target,
  Info,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useI18n } from "@/app/[lang]/providers";
import { motion } from "framer-motion";

export default function ProgramPortalOverview() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <ProgramPortalContent />
    </React.Suspense>
  );
}

// Helper for small skeleton
const SkeletonValue = ({ width = "w-16" }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`h-8 bg-slate-200 dark:bg-slate-800 rounded-lg ${width} inline-block`}
  />
);

function ProgramPortalContent() {
  const dict = useI18n();
  const d = dict?.portal || {};
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const lang = searchParams.get("lang") || "id";
  const router = useRouter();

  // id is the program name slug
  const programName = decodeURIComponent(id || "").replace(/-/g, " ");

  // Fetch real data for this program
  const reports: any = []; // auto-cleaned
  const isLoading: any = false; // auto-cleaned

  const stats = useMemo(() => {
    const totalReports = reports.length;
    return {
      totalReports,
      target: 0,
    };
  }, [reports]);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-black text-navy dark:text-white tracking-tight mb-2">
            {d.tracking_title || "Program Tracking"}
          </h2>
          <h3 className="text-5xl font-black text-primary tracking-tighter uppercase font-display">
            {programName}
          </h3>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-center min-w-[120px]">
          <div className="text-[10px] font-black uppercase tracking-widest">
            {dict?.common?.status_label || "Status"}
          </div>
          <div className="text-xl font-black">
            {dict?.common?.active || "AKTIF"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white flex flex-col justify-center min-h-[240px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary/10 text-primary rounded-[1.5rem]">
              <MessageSquare size={32} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                {dict?.common?.reports || "Laporan Masalah"}
              </h4>
              <div className="text-5xl font-black text-navy dark:text-white">
                {isLoading ? (
                  <SkeletonValue />
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {stats.totalReports}
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm">
            {isLoading ? (
              <span className="h-4 w-2/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse inline-block" />
            ) : stats.totalReports > 0 ? (
              `${stats.totalReports} ${
                d.reports_processing ||
                "Laporan sedang dalam pengawasan intensif Satgas."
              }`
            ) : (
              d.no_reports || "Belum ada laporan kendala untuk program ini."
            )}
          </p>
        </Card>

        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white flex flex-col justify-center min-h-[240px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-accent/10 text-accent rounded-[1.5rem]">
              <Target size={32} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                {d.target_title || "Target Capaian"}
              </h4>
              <div className="text-5xl font-black text-navy dark:text-white">
                {isLoading ? (
                  <SkeletonValue width="w-24" />
                ) : (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {stats.target}%
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-sm">
            {isLoading ? (
              <span className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded animate-pulse inline-block" />
            ) : (
              d.target_desc ||
              "Sesuai dengan timeline Rencana Induk Pemulihan Aceh."
            )}
          </p>
        </Card>
      </div>

      <div className="p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2rem] flex flex-col md:flex-row items-center gap-6">
        <div className="p-4 bg-blue-500 text-white rounded-2xl">
          <Info size={24} />
        </div>
        <div className="flex-1">
          <h4 className="font-black text-navy dark:text-white uppercase text-xs tracking-widest mb-1">
            {d.info_title || "Informasi Publik"}
          </h4>
          <p className="text-sm text-slate-500 font-medium">
            {d.info_desc ||
              "Laporan masyarakat sangat membantu percepatan penanganan di wilayah terpencil. Link kirim laporan tersedia di sidebar."}
          </p>
        </div>
        <button
          onClick={() =>
            router.push(
              `/${lang}/laporan/baru?program=${encodeURIComponent(
                programName,
              )}`,
            )
          }
          className="px-6 py-3 bg-navy dark:bg-slate-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all"
        >
          {d.btn_report || "Kirim Laporan Program"}
        </button>
      </div>
    </div>
  );
}
