"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, Button } from "@/components/ui";
import { Report } from "@/lib/types";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Plus,
  Search,
  MessageSquare,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";
import { useSession } from "next-auth/react";
import { ShieldAlert, ArrowRight } from "lucide-react";

export default function PartnerReportModule() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <PartnerReportContent />
    </React.Suspense>
  );
}

function PartnerReportContent() {
  const { data: session, status: authStatus } = useSession();
  const dict = useI18n();
  const d = dict?.portal || {};
  const dr = dict?.reports || {};
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;
  const params = useParams();
  const lang = params.lang as string;
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    if (isAuthorized === false) return;
    const fetch = async () => {
      setIsLoading(true);
      const data: any[] = []; // await getReports({ partnerId: id as string });
      setReports(data);
      setIsLoading(false);
    };
    fetch();
  }, [id, isAuthorized]);

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
          onClick={() => router.push(`/${lang}/auth/login`)}
          className="flex items-center gap-3 px-8 py-4 bg-navy dark:bg-white text-white dark:text-navy rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          {dict?.common?.back_to_login || "Kembali ke Login"}{" "}
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  const filtered = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-navy dark:text-white tracking-tighter mb-2 uppercase">
            {d.cross_sector_reports || "Laporan Lintas Sektor"}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {d.agency_report_management || "Manajemen Feed Laporan Instansi"}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder={`${dict?.reports?.search || "Telusuri"}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold w-64"
            />
          </div>
          <Button
            onClick={() =>
              router.push(`/${lang}/portal/partner/id/report/new?id=${id}`)
            }
            className="rounded-2xl h-12 px-6 font-black text-[10px] uppercase tracking-widest gap-2"
          >
            <Plus size={18} /> {d.btn_new_report || "Buat Laporan"}
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-100 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase tracking-widest font-black text-slate-400">
              <th className="px-8 py-6">
                {d.report_detail || "Detail Laporan"}
              </th>
              <th className="px-8 py-6">
                {dict?.reports?.location_label || "Lokasi"}
              </th>
              <th className="px-8 py-6">
                {dict?.common?.status_label || "Status"}
              </th>
              <th className="px-8 py-6 text-right">
                {dict?.financial?.table_action || "Aksi"}
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
                  {dict?.common?.loading || "Memuat Data..."}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center font-bold text-slate-400"
                >
                  {dr.no_reports || "Belum ada laporan yang tercatat."}
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
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-1 flex items-center gap-2">
                      <MessageSquare size={10} /> ID: #{r.id} • {r.category}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <MapPin size={14} className="text-primary" /> {r.regency}
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
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary transition-colors">
                      <ExternalLink size={16} />
                    </button>
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
