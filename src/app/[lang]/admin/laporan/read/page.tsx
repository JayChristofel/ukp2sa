"use client";

import React from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  MapPin,
  User,
  Zap,
} from "lucide-react";
import { ReporterBadge, StatusBadge, SourceBadge } from "@/components/admin";

export default function ReportDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-10 text-center uppercase font-black text-xs tracking-widest text-slate-400">
          Memuat Detail Laporan...
        </div>
      }
    >
      <ReportDetailPageContent />
    </React.Suspense>
  );
}

function ReportDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const lang = (params?.lang as string) || "id";
  const searchParams = useSearchParams();
  const id = searchParams.get("id") as string;

  const calculateReportIntegrity = () => ({
    totalScore: 100,
    dimensions: { completeness: 100, accuracy: 100 },
  });
  const reports: any[] = [];

  const report = reports.find((r) => r.id === id) || {
    title: "Mock Report",
    category: "General",
    status: "PENDING",
    source: "mobile",
    reporterType: "masyarakat",
    reporterName: "User",
    regency: "Aceh",
    location: "Loc",
    description: "Desc",
  };
  const integrity = calculateReportIntegrity();

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-slate-500 mb-4">Laporan tidak ditemukan</p>
        <Link
          href={`/${lang}/admin/laporan`}
          className="text-primary-500 font-bold"
        >
          Kembali ke daftar
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-display">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black dark:text-white uppercase">
            {report.title}
          </h1>
          <p className="text-sm text-slate-500">{report.category}</p>
        </div>
      </div>

      <div className="bento-card p-8 space-y-6">
        <div className="flex flex-wrap gap-4">
          <StatusBadge status={report.status} />
          <SourceBadge source={report.source} />
          <ReporterBadge type={report.reporterType} />
        </div>

        {integrity && (
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-500" />
                <span className="text-xs font-black text-navy dark:text-white uppercase tracking-widest">
                  Data Integrity Score
                </span>
              </div>
              <span
                className={`text-xs font-black ${
                  integrity.totalScore > 80
                    ? "text-green-500"
                    : "text-amber-500"
                }`}
              >
                {integrity.totalScore}%
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  integrity.totalScore > 80 ? "bg-green-500" : "bg-amber-500"
                }`}
                style={{ width: `${integrity.totalScore}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Completeness: {integrity.dimensions.completeness}%</span>
              <span>Verified: {integrity.dimensions.accuracy}%</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
              Pelapor
            </p>
            <div className="flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              <span className="font-bold">{report.reporterName}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
              Lokasi
            </p>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-rose-500" />
              <span className="font-bold">
                {report.regency} - {report.location}
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
            Deskripsi
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {report.description}
          </p>
        </div>

        {report.adminReply && (
          <div className="p-6 bg-primary-500/10 rounded-2xl">
            <p className="text-[10px] font-black text-primary-500 uppercase mb-2">
              Respon Admin
            </p>
            <p className="text-sm">{report.adminReply.content}</p>
            <p className="text-[10px] text-slate-400 mt-2">
              Oleh: {report.adminReply.repliedBy}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href={`/${lang}/admin/laporan/read/edit?id=${id}`}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2"
          >
            <Edit2 size={16} /> Edit & Respon
          </Link>
        </div>
      </div>
    </div>
  );
}
