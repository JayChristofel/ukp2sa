"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui";
import {
  LayoutDashboard,
  MessageSquare,
  Wallet,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { PARTNERS_DATA } from "@/lib/constants";
import { useI18n } from "@/app/[lang]/providers";
import { ReportStatus } from "@/lib/types";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/unifiedService";

/** Skeleton placeholder — extracted outside component to prevent re-creation during render */
const SkeletonValue = ({ width = "w-16" }: { width?: string }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.7, 0.4] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`h-8 bg-slate-200 dark:bg-slate-800 rounded-lg ${width} inline-block`}
  />
);

export default function PartnerPortalOverview() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <PartnerPortalContent />
    </React.Suspense>
  );
}

function PartnerPortalContent() {
  const { data: session, status: authStatus } = useSession();
  const dict = useI18n();
  const d = dict?.portal || {};
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const router = useRouter();

  // Derived auth state — computed from session, no need for effect + setState
  const isAuthorized = useMemo(() => {
    if (authStatus === "loading") return null;
    if (!session?.user) return false;

    const user = session.user as any;
    return (
      user.role === "superadmin" ||
      user.role === "admin" ||
      user.instansiId === id
    );
  }, [session, id, authStatus]);

  // Real Data Fetching
  const { data: reports = [], isLoading: loadingReports } = useQuery({
    queryKey: ["portal-reports", id],
    queryFn: () => apiService.getReportsByAgency(id),
    enabled: !!id && isAuthorized === true,
  });

  const { data: financials = [], isLoading: loadingFinance } = useQuery({
    queryKey: ["portal-financials", id],
    queryFn: () => apiService.getFinancialsByAgency(id),
    enabled: !!id && isAuthorized === true,
  });

  const partner = PARTNERS_DATA.find((p) => p.id === id) || {
    name: dict?.common?.not_found || "Partner Not Found",
    owner: dict?.common?.partner || "Partner",
  };

  // Memoized Stats calculation
  const stats = useMemo(() => {
    const totalReports = reports.length;
    const completedReports = reports.filter(
      (r) => r.status === ReportStatus.DONE,
    ).length;

    // Financial math
    const totalAllocation = financials.reduce(
      (acc, curr) => acc + curr.allocation,
      0,
    );
    const totalRealization = financials.reduce(
      (acc, curr) => acc + curr.realization,
      0,
    );
    const budgetPercent =
      totalAllocation > 0 ? (totalRealization / totalAllocation) * 100 : 0;

    return {
      totalReports,
      completedReports,
      budgetPercent: budgetPercent.toFixed(1),
      totalAllocation,
      totalRealization,
    };
  }, [reports, financials]);

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
            "Maaf, Anda tidak memiliki izin untuk mengakses Dashboard milik"}{" "}
          <span className="text-navy dark:text-white font-black">
            {partner.name}
          </span>
          .{" "}
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

  const isLoading = isAuthorized === null || loadingReports || loadingFinance;

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-navy dark:text-white tracking-tight mb-2">
          {d.welcome_partner || "Selamat Datang,"}
        </h2>
        <h3 className="text-5xl font-black text-primary tracking-tighter uppercase">
          {partner.owner || partner.name}
        </h3>
        <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-[0.2em]">
          {d.institutional_account || "Akun Institusi"}: {partner.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <MessageSquare size={24} />
            </div>
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
            {dict?.common?.total_reports || "Total Laporan"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white">
            {isLoading ? (
              <SkeletonValue />
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {stats.totalReports}
              </motion.span>
            )}
          </div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-accent/10 text-accent rounded-2xl">
              <Wallet size={24} />
            </div>
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
            {d.budget_realization || "Anggaran Realisasi"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white">
            {isLoading ? (
              <SkeletonValue width="w-24" />
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {stats.budgetPercent}%
              </motion.span>
            )}
          </div>
        </Card>

        <Card className="p-6 border-slate-100 dark:border-slate-800 rounded-3xl bg-white shadow-xl shadow-slate-200/50">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
            {d.outcome_complete || "Outcome Tuntas"}
          </h4>
          <div className="text-4xl font-black text-navy dark:text-white">
            {isLoading ? (
              <SkeletonValue />
            ) : (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {stats.completedReports}
              </motion.span>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem]">
          <h4 className="text-xl font-black text-navy dark:text-white mb-6">
            {d.last_update || "Update Terakhir"}
          </h4>
          <div className="space-y-6">
            {isLoading
              ? // Small pulse for the feed
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 items-start p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl animate-pulse"
                  >
                    <div className="size-2 mt-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-2 w-1/4 bg-slate-100 dark:bg-slate-900 rounded" />
                    </div>
                  </div>
                ))
              : reports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="flex gap-4 items-start p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl"
                  >
                    <div
                      className={`size-2 mt-2 rounded-full ${
                        report.status === ReportStatus.DONE
                          ? "bg-emerald-500"
                          : "bg-primary"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-bold text-navy dark:text-white leading-snug">
                        {report.title}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        {report.timeAgo} • {report.category}
                      </p>
                    </div>
                  </div>
                ))}

            {reports.length === 0 && !isLoading && (
              <p className="text-center text-slate-400 text-xs py-10 font-bold uppercase tracking-widest">
                {dict?.dashboard?.no_recent_activities ||
                  "Belum Ada Aktivitas Terbaru"}
              </p>
            )}
          </div>
        </Card>

        <Card className="p-8 border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-navy text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <LayoutDashboard size={120} />
          </div>
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-4">
              {d.quick_actions || "Quick Actions"}
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() =>
                  router.push(
                    `/${
                      dict?.lang || "id"
                    }/laporan/baru?instansi=${encodeURIComponent(
                      partner.name,
                    )}`,
                  )
                }
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl text-left font-black transition-all border border-white/5 uppercase text-xs tracking-widest"
              >
                {d.btn_new_report || "Kirim Laporan Baru"}
              </button>
              <button
                onClick={() =>
                  router.push(
                    `/${
                      dict?.lang || "id"
                    }/portal/partner/id/finance/new?id=${id}`,
                  )
                }
                className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 rounded-2xl text-left font-black transition-all border border-white/5 uppercase text-xs tracking-widest"
              >
                {d.btn_budget || "Submit Realisasi Anggaran"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
