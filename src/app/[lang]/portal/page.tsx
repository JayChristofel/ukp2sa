"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui";
import {
  Building2,
  LayoutGrid,
  ArrowRight,
  ExternalLink,
  Activity,
  Waves,
  Construction,
  Home,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function PortalMainPage() {
  const params = useParams();
  const lang = params.lang || "id";
  const dict = useI18n();
  const d = dict?.portal || {};

  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/portal/stats");
        const json = await res.json();
        if (json.status === "success") {
          setStats(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch portal stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const totalRealization =
    stats?.programs?.reduce((acc: number, p: any) => acc + p.realization, 0) ||
    0;
  const totalAllocation =
    stats?.programs?.reduce((acc: number, p: any) => acc + p.allocation, 0) ||
    0;
  const overallProgress =
    totalAllocation > 0 ? (totalRealization / totalAllocation) * 100 : 0;

  return (
    <div className="space-y-16 py-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Activity size={12} /> Live Monitoring System
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-navy dark:text-white uppercase tracking-tighter mb-6 leading-none">
            {d.portal_title_1 || "Akses"}{" "}
            <span className="text-primary italic">
              {d.portal_title_2 || "Portal Utama."}
            </span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] leading-relaxed max-w-xl">
            {d.portal_desc ||
              "Pusat komando terpadu untuk percepatan pemulihan ekonomi dan infrastruktur wilayah Aceh pascabencana."}
          </p>
        </div>

        {/* Intelligence Summary Row */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6 w-full md:w-auto">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl min-w-[200px]">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Overall Progress
            </div>
            <div className="text-3xl font-black text-navy dark:text-white">
              {loading ? "..." : `${overallProgress.toFixed(1)}%`}
            </div>
            <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                className="h-full bg-primary"
              />
            </div>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl min-w-[200px]">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Resolved Reports
            </div>
            <div className="text-3xl font-black text-navy dark:text-white">
              {loading ? "..." : stats?.reports?.byStatus?.["Selesai"] || 0}
            </div>
            <p className="text-[9px] text-emerald-500 font-bold uppercase mt-2">
              Active Intervention
            </p>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-navy dark:text-white uppercase tracking-tighter mb-4">
            Programs & Stakeholders
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Monitoring Accelerated Recovery Projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {(loading ? [1, 2, 3, 4] : stats?.programs || []).map(
            (prog: any, i: number) => {
              const isPlaceholder = loading || !prog;
              const name = isPlaceholder ? "Loading..." : prog.name;
              const progress = isPlaceholder ? 0 : prog.progress;

              // Program-Specific Data Mapping
              const mapping: Record<string, { icon: any; subtitle: string }> = {
                "Normalisasi Sungai": {
                  icon: <Waves size={32} />,
                  subtitle: "Ministry of PU",
                },
                "Jalan & Jembatan": {
                  icon: <Construction size={32} />,
                  subtitle: "Ministry of PU, TN Bridge Task Force",
                },
                "Penyediaan Huntara": {
                  icon: <Home size={32} />,
                  subtitle: "BPBD-BNPB, Ministry of PU",
                },
                "Pembersihan Jalan Lingkungan": {
                  icon: <Sparkles size={32} />,
                  subtitle: "Ministry of PU, TN Bridge Task Force",
                },
              };

              const data = mapping[name] || {
                icon: <LayoutGrid size={32} />,
                subtitle: "Kementerian / Lembaga Terkait",
              };

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={`/${lang}/portal/program/id?id=${encodeURIComponent(
                      name,
                    )}`}
                  >
                    <Card className="p-10 border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-2xl bg-white dark:bg-slate-900 group hover:border-primary transition-all overflow-hidden relative text-center min-h-[460px] flex flex-col items-center justify-between">
                      <div className="absolute -top-20 -left-20 size-60 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />

                      <div className="relative z-10 w-full flex flex-col items-center">
                        <div className="size-20 bg-primary/10 text-primary rounded-[2rem] flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-lg shadow-primary/20">
                          {data.icon}
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-4 min-h-[4rem] flex items-center justify-center line-clamp-2">
                          {name}
                        </h3>
                        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mb-12 block min-h-[2.5rem] leading-relaxed">
                          {data.subtitle}
                        </p>

                        <div className="w-full space-y-4">
                          <div className="flex justify-between items-end px-1">
                            <span className="text-[10px] font-black text-navy dark:text-slate-400 uppercase tracking-widest">
                              Physical Progress
                            </span>
                            <span className="text-sm font-black text-primary">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                              transition={{ duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 w-full mt-10">
                        <div className="inline-flex items-center gap-3 px-8 py-4 bg-navy dark:bg-white text-white dark:text-navy rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest group-hover:bg-primary group-hover:text-white transition-all shadow-xl">
                          Learn More <ArrowRight size={16} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            },
          )}
        </div>
      </div>

      <div className="pt-10">
        <Link href={`/${lang}/portal/partner/id?id=p1`}>
          <Card className="p-10 border-dashed border-2 border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col md:flex-row items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
              <div className="size-20 bg-navy text-white rounded-3xl flex items-center justify-center shadow-2xl shadow-navy/20">
                <Building2 size={32} />
              </div>
              <div>
                <h4 className="text-2xl font-black text-navy dark:text-white uppercase tracking-tight mb-2">
                  Portal Institusi & Mitra Strategis
                </h4>
                <p className="text-sm text-slate-500 font-medium max-w-xl">
                  Akses dashboard monitoring khusus untuk K/L, NGO, dan Satuan
                  Tugas Pelaksana di lapangan.
                </p>
              </div>
            </div>
            <div className="size-14 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
              <ArrowRight size={24} />
            </div>
          </Card>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm">
            <ExternalLink size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-navy dark:text-white uppercase tracking-tight">
              Need partner access?
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Contact UKP2SA Admin for credentials.
            </p>
          </div>
        </div>
        <Link
          href={`/${lang}/kontak`}
          className="px-8 py-4 bg-navy text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
