"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { Report } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Clock, Info } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";

export default function ProgramMonitoringModule() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <ProgramMonitoringContent />
    </React.Suspense>
  );
}

function ProgramMonitoringContent() {
  const dict = useI18n();
  const d = dict?.portal || {};
  const dr = dict?.reports || {};
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const programName = decodeURIComponent(id || "").replace(/-/g, " ");
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const data: any[] = []; // await getReports({ category: programName });
      setReports(data);
      setIsLoading(false);
    };
    fetch();
  }, [id, programName]);

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-black text-navy dark:text-white tracking-tighter mb-2 uppercase">
          {d.public_report_monitoring || "Monitoring Laporan Publik"}
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {dict?.report_new?.label_category || "Kategori"}: {programName}
        </p>
      </div>

      <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
        <div className="p-3 bg-blue-500 text-white rounded-xl">
          <Info size={20} />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
          {d.view_only_notice ||
            "Modul ini hanya bersifat monitoring (View-Only). Penanganan laporan dilakukan melalui Dashboard Utama UKP2SA."}
        </p>
      </div>

      <div className="relative">
        <Search
          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder={`${dr.search || "Telusuri"}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] text-sm font-bold shadow-xl shadow-slate-200/40 dark:shadow-none dark:text-white"
        />
      </div>

      <Card className="overflow-hidden border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest font-black text-slate-400">
              <th className="px-8 py-6">
                {d.report_detail || "Detail Laporan"}
              </th>
              <th className="px-8 py-6">{dr.location_label || "Lokasi"}</th>
              <th className="px-8 py-6">
                {dict?.common?.time_label || "Waktu"}
              </th>
              <th className="px-8 py-6">
                {dict?.common?.status_label || "Status"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center font-bold text-slate-400 animate-pulse"
                >
                  {dr.scanning || "Scanning Reports..."}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center font-bold text-slate-400"
                >
                  {dr.no_reports ||
                    "Tidak ada laporan masyarakat untuk kategori ini."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="font-black text-navy dark:text-white text-sm">
                      {r.title}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                      ID: #{r.id}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin size={14} className="text-primary" /> {r.regency}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock size={14} /> {r.timeAgo}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        r.status === (dr.status_done || "Selesai")
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
