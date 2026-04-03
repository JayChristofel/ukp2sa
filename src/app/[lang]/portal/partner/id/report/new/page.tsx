"use client";

import React from "react";
import SendReportPage from "@/app/[lang]/laporan/baru/page";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/app/[lang]/providers";

export default function NewPortalReport() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <NewPortalReportContent />
    </React.Suspense>
  );
}

function NewPortalReportContent() {
  const dict = useI18n();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={16} /> {dict?.common?.back || "Kembali"}
      </button>
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl">
        <SendReportPage />
      </div>
    </div>
  );
}
