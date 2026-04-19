"use client";

import React, { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useRouter, useParams } from "next/navigation";
import { useI18n } from "@/app/[lang]/providers";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const params = useParams();
  const dict = useI18n();
  const e = dict?.error || {};

  useEffect(() => {
    // Log the error for observability
    console.error("Global Error Boundary:", error);
  }, [error]);

  const getErrorCode = () => {
    if (error.message.includes("401") || error.message.includes("403")) 
      return { code: "SEC_BREACH", label: "ACCESS_DENIED", color: "text-rose-500", desc: e.desc_sec_breach };
    if (error.message.includes("404")) 
      return { code: "ZONE_MISSING", label: "DATA_NOT_FOUND", color: "text-amber-500", desc: e.desc_zone_missing };
    if (error.message.includes("5")) 
      return { code: "INFRA_FAIL", label: "INFRASTRUCTURE_FAILURE", color: "text-rose-600", desc: e.desc_infra_fail };
    
    return { code: "ANOMALY", label: "SYSTEM_ANOMALY", color: "text-rose-500", desc: e.desc_anomaly };
  };

  const currentErr = getErrorCode();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-10 font-display bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <Card className="max-w-2xl w-full p-8 md:p-16 border-none shadow-3xl rounded-[2.5rem] md:rounded-[4rem] bg-white dark:bg-slate-900 border-2 border-rose-500/10 text-center animate-in fade-in zoom-in duration-500">
        <div className={`size-20 md:size-28 rounded-[2rem] md:rounded-[3rem] bg-rose-500/10 flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-xl shadow-rose-500/10`}>
          <AlertCircle size={40} className={currentErr.code === "ZONE_MISSING" ? "text-amber-500 md:size-14 font-black" : "text-rose-500 md:size-14"} />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-navy dark:text-white uppercase tracking-tighter mb-4 md:mb-6 leading-tight">
          {currentErr.code === "ZONE_MISSING" ? e.title_missing : e.title_anomaly}
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-lg uppercase tracking-widest mb-10 md:mb-16 leading-relaxed px-2 md:px-12 opacity-80">
          {currentErr.desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 justify-center">
          <Button
            onClick={reset}
            className="w-full sm:w-auto px-8 md:px-12 py-6 md:py-8 rounded-xl md:rounded-3xl bg-primary text-white font-black uppercase tracking-widest text-[11px] md:text-[12px] shadow-glow-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 border-none"
          >
            <RefreshCcw size={20} /> {e.button_reinit}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push(`/${params.lang}`)}
            className="w-full sm:w-auto px-8 md:px-12 py-6 md:py-8 rounded-xl md:rounded-3xl border-slate-200 dark:border-slate-800 text-slate-500 font-black uppercase tracking-widest text-[11px] md:text-[12px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
          >
            <Home size={20} /> {e.button_dashboard.includes("Dashboard") ? (params.lang === "id" ? "Beranda Utama" : "Home") : e.button_dashboard}
          </Button>
        </div>

        {/* System Diagnostics Branding */}
        <div className="mt-12 md:mt-20 flex flex-col items-center pt-8 md:pt-12 border-t border-slate-100 dark:border-slate-800">
          <div className="px-6 md:px-10 py-3 md:py-5 bg-slate-50 dark:bg-slate-800/80 rounded-[1.2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 inline-flex flex-col items-center">
            <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
              SYSTEM_DIAGNOSTIC_DIGEST
            </span>
            <p className="text-[10px] md:text-[14px] font-mono text-rose-500 font-black tracking-widest break-all">
              {error.digest ? `CORE-HASH-${error.digest.slice(0, 16).toUpperCase()}` : `CORE-GLOBAL-${currentErr.code}-${new Date().getTime().toString().slice(-6)}`}
            </p>
          </div>
          
          <p className={`mt-5 md:mt-8 text-[10px] md:text-[12px] font-black uppercase tracking-widest text-center animate-pulse ${currentErr.color} px-6`}>
            {params.lang === "id" ? "[ GANGGUAN EKOSISTEM DIGITAL ]" : "[ DIGITAL ECOSYSTEM DISRUPTION ]"}
          </p>
        </div>
      </Card>
    </div>
  );
}
