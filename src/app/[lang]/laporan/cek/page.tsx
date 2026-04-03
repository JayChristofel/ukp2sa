"use client";

import React, { useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui";
import {
  Search,
  Loader2,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  History,
  Satellite,
  Database,
} from "lucide-react";
import { ReportStatus } from "@/lib/types";

function LaporanCekContent() {
  const searchParams = useSearchParams();
  const programParam = searchParams.get("program");

  const [searchQuery, setSearchQuery] = useState("");

  // Use Tanstack Query for real-time sync with MongoDB/Satellite
  const reports: any = []; // auto-cleaned
    const isLoading: any = false; // auto-cleaned


  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesQuery =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (programParam) {
        return matchesQuery && r.category === programParam;
      }
      return matchesQuery;
    });
  }, [reports, searchQuery, programParam]);

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.DONE:
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case ReportStatus.PROCESS:
        return "text-primary-500 bg-primary-500/10 border-primary-500/20";
      default:
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    }
  };

  return (
    <div className="py-12">
      <div className="mb-12 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 bg-primary-500/10 rounded-full blur-3xl -z-10" />
        <h1 className="text-3xl md:text-6xl font-black text-navy dark:text-white mb-4 tracking-tighter">
          Pusat <span className="text-primary-500">Transparansi</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto text-sm md:text-base">
          Akses data real-time langsung dari{" "}
          <span className="font-black text-navy dark:text-white uppercase tracking-widest text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            Satellite Node
          </span>{" "}
          untuk memantau progres pemulihan Aceh.
        </p>
      </div>

      <div className="relative mb-12 group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-[2.2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative">
          <Search
            className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500"
            size={24}
          />
          <input
            autoFocus
            className="w-full pl-16 pr-6 py-7 rounded-[2rem] bg-white dark:bg-slate-900 border-none shadow-2xl shadow-primary-500/5 dark:shadow-none focus:ring-4 focus:ring-primary-500/10 transition-all text-lg font-bold placeholder:text-slate-300"
            placeholder="Masukkan ID Laporan atau Kata Kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-accent-500/10 rounded-full border border-accent-500/20">
              <Satellite size={12} className="text-accent-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-accent-600">
                Syncing
              </span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-24 gap-6">
          <div className="relative">
            <Loader2 size={64} className="text-primary-500 animate-spin" />
            <Database
              size={24}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-500/60"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-navy dark:text-white font-black uppercase tracking-[0.3em] text-xs">
              Menghubungkan ke Node Pusat
            </p>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              Mengautentikasi Stream Data...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <Card
                key={report.id}
                className="p-8 border-slate-100 dark:border-slate-800 rounded-[3rem] hover:ring-4 hover:ring-primary-500/5 transition-all group relative overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                  <div className="flex items-center gap-6">
                    <div
                      className={`size-16 rounded-[1.5rem] flex items-center justify-center border-2 ${getStatusColor(report.status)} group-hover:scale-110 transition-all duration-500 shadow-lg`}
                    >
                      {report.status === ReportStatus.DONE ? (
                        <CheckCircle2 size={32} />
                      ) : (
                        <Clock size={32} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded italic">
                          ID: #{report.id}
                        </span>
                        {report.source === "satellite" && (
                          <span className="text-[9px] font-black tracking-widest uppercase text-accent-500 bg-accent-500/10 px-2 py-0.5 rounded border border-accent-500/20">
                            Satellite Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-black text-navy dark:text-white tracking-tight group-hover:text-primary-500 transition-colors">
                        {report.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 shadow-sm ${getStatusColor(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-primary-500/5 flex items-center justify-center text-primary-500 border border-primary-500/10">
                      <MapPin size={14} />
                    </div>
                    {report.regency}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-accent-500/5 flex items-center justify-center text-accent-500 border border-accent-500/10">
                      <Tag size={14} />
                    </div>
                    {report.category}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-500/5 flex items-center justify-center text-slate-500 border border-slate-500/10">
                      <History size={14} />
                    </div>
                    {report.timeAgo}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-500/5 flex items-center justify-center text-slate-500 border border-slate-500/10">
                      <Satellite size={14} />
                    </div>
                    Node: {report.source}
                  </div>
                </div>

                {report.adminReply && (
                  <div className="mt-8 p-6 bg-primary-600 text-white rounded-[2rem] shadow-xl shadow-primary-500/20 relative overflow-hidden group/reply animate-in fade-in slide-in-from-bottom-4">
                    <div className="absolute top-0 right-0 p-8 opacity-10 -rotate-12 group-hover/reply:rotate-0 transition-transform duration-700">
                      <CheckCircle2 size={80} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="px-3 py-1 rounded-lg bg-white/20 text-[9px] font-black uppercase tracking-widest border border-white/20">
                          Respon Pemerintah
                        </div>
                        <div className="text-white/60 text-[9px] font-black uppercase tracking-widest">
                          {new Date(
                            report.adminReply.repliedAt,
                          ).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </div>
                      <p className="text-base font-bold leading-relaxed mb-4">
                        &quot;{report.adminReply.content}&quot;
                      </p>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 flex items-center gap-2">
                        <div className="size-1.5 bg-emerald-400 rounded-full animate-pulse" />
                        Diverifikasi oleh {report.adminReply.repliedBy}
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))
          ) : (
            <div className="text-center py-32 opacity-80 flex flex-col items-center">
              <div className="size-32 bg-slate-100 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center mb-8 border border-slate-200/50 dark:border-slate-700/50 shadow-inner">
                <Search size={48} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-navy dark:text-white mb-2 tracking-tight uppercase">
                Data Tidak Ditemukan
              </h3>
              <p className="text-slate-400 text-sm font-medium max-w-xs leading-relaxed uppercase tracking-widest">
                Pastikan ID Laporan benar atau coba kata kunci lain.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function LaporanCekPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="animate-spin text-primary-500" size={48} />
        </div>
      }
    >
      <LaporanCekContent />
    </Suspense>
  );
}
