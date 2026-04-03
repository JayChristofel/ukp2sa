"use client";

import React from "react";
import SendReportPage from "@/app/[lang]/laporan/baru/page";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function NewProgramReport() {
  return (
    <React.Suspense
      fallback={<div className="p-10 text-center">Loading...</div>}
    >
      <NewProgramReportContent />
    </React.Suspense>
  );
}

function NewProgramReportContent() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={16} /> Kembali ke Monitoring Program
      </button>
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl">
        <SendReportPage />
      </div>
    </div>
  );
}
