"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { PARTNERS_DATA } from "@/lib/constants";
import { useI18n } from "@/app/[lang]/providers";
import FinancialPaymentPortal from "@/components/sections/FinancialPaymentPortal";
import { useAuditLogger } from "@/hooks/useAuditLogger";
import { useEffect } from "react";

function FinancialInputContent() {
  const dict = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const partnerIdParam = searchParams.get("partnerId");

  const partner = PARTNERS_DATA.find((p) => p.id === partnerIdParam);
  const partnerName = partner?.name || "Mitra Kerja";
  const partnerId = partnerIdParam || "INTERNAL";
  const f = dict?.financial || {};
  const { logActivity } = useAuditLogger();

  useEffect(() => {
    logActivity(
      "FINANCIAL_INPUT_VIEW",
      "FINANCIAL",
      `User accessed financial input portal for partner: ${partnerName} (${partnerId})`,
    );
  }, [logActivity, partnerName, partnerId]);

  return (
    <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 md:px-6">
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4 hover:translate-x-[-4px] transition-transform"
          >
            <ArrowLeft size={16} /> {dict?.common?.back || "Kembali"}
          </button>
          <h1 className="text-3xl md:text-4xl font-black text-navy dark:text-white mb-2 tracking-tight uppercase">
            {f.authority_title_main || "Otoritas"}{" "}
            <span className="text-primary italic">
              {f.authority_title_sub || "Anggaran."}
            </span>
          </h1>
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed md:leading-none">
            {f.authority_desc ||
              "Panel Input & Alokasi Dana untuk Partner Strategis"}
          </p>
        </div>
      </div>

      {/* Gunakan UI Portal dengan header disembunyikan untuk integrasi admin yang mulus */}
      <FinancialPaymentPortal
        partnerId={partnerId}
        partnerName={partnerName}
        hideHeader={true}
        isAdmin={true}
        topBadge={
          <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 w-fit">
            <ShieldCheck size={16} />{" "}
            {f.admin_access || "Admin Verified Access"}
          </div>
        }
      />
    </div>
  );
}

export default function FinancialInputPage() {
  const dict = useI18n();
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center font-black uppercase text-xs tracking-widest animate-pulse text-slate-400">
          {dict?.common?.loading || "Loading..."}
        </div>
      }
    >
      <FinancialInputContent />
    </Suspense>
  );
}
